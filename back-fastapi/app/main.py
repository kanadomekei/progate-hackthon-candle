from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from fastapi.responses import StreamingResponse
from fastapi.responses import Response
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from PIL import Image
import requests
import logging
import httpx
import base64
import boto3
import json
import os
import io
import re

# .envファイルの読み込み
load_dotenv()

app = FastAPI()

# CORSミドルウェアの設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    print("in root method")
    return {"message": "Hello World from lambda with lwa"}


# モデル
MODELID = os.getenv("MODELID", "stability.stable-image-ultra-v1:0")
REGION = os.getenv("REGION", "us-west-2")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


def initialize_bedrock_client():
    try:
        return boto3.client("bedrock-runtime", region_name=REGION)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Bedrock client: {e}")


bedrock_runtime = initialize_bedrock_client()


class ImageGenerationRequest(BaseModel):
    prompt: str


class ImageGenerationRequestitoi(BaseModel):
    prompt: str
    image_url: str


# 日本語判別
def translate_en(text: str) -> bool:
    japanese_pattern = re.compile(r'[\u3040-\u30FF\u4E00-\u9FFF]')
    return bool(japanese_pattern.search(text))


class ImageGenerator:
    @staticmethod
    def decode_and_stream_response(model_response: dict) -> StreamingResponse:
        if (
            not model_response
            or "images" not in model_response
            or not model_response["images"]
        ):
            raise HTTPException(
                status_code=500, detail="Invalid response from the model."
            )

        base64_image_data = model_response["images"][0]
        image_data = base64.b64decode(base64_image_data)
        return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")

    @staticmethod
    def create_bedrock_client(region: str) -> boto3.client:
        try:
            return boto3.client("bedrock-runtime", region_name=region)
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Bedrock client: {e}")
        
        


@app.post("/generate-image-stable-diffusion")
async def generate_image_stable_diffusion(request_body: ImageGenerationRequest):
    if translate_en(request_body.prompt):
        async with httpx.AsyncClient() as client:
            translate_response = await client.post(
                "http://127.0.0.1:8000/translate-jp-to-en", 
                json={"text": request_body.prompt}
            )
        translated_text = translate_response.text
        request_body.prompt = translated_text
        print(request_body)
    body = {"prompt": request_body.prompt, "mode": "text-to-image"}

    try:
        response = bedrock_runtime.invoke_model(modelId=MODELID, body=json.dumps(body))
        model_response = json.loads(response["body"].read())
        print(model_response['seeds'])
        return ImageGenerator.decode_and_stream_response(model_response)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Image generation failed: {str(e)}"
        )


@app.post("/generate-image-nova-canvas")
async def generate_image_nova_canvas(request_body: ImageGenerationRequest):
    if translate_en(request_body.prompt):
        async with httpx.AsyncClient() as client:
            translate_response = await client.post(
                "http://127.0.0.1:8000/translate-jp-to-en", 
                json={"text": request_body.prompt}
            )
        translated_text = translate_response.text
        request_body.prompt = translated_text
        print(f"print: {request_body}")
        print(f"print: {request_body.prompt}")
    body = {
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {"text": request_body.prompt},
        "imageGenerationConfig": {
            "width": 1024,
            "height": 1024,
            "quality": "standard",
            "numberOfImages": 3,
        },
    }
    try:
        nova_canvas_client = ImageGenerator.create_bedrock_client("us-east-1")
        response = nova_canvas_client.invoke_model(
            modelId="amazon.nova-canvas-v1:0", body=json.dumps(body)
        )
        model_response = json.loads(response["body"].read())
        return ImageGenerator.decode_and_stream_response(model_response)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Image generation failed: {str(e)}"
        )

# ここから画像修正
class ImageError(Exception):
    "Custom exception for errors returned by SDXL"
    def __init__(self, message):
        self.message = message


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def resize_image_to_limit(image: Image, max_pixels: int = 1048576) -> Image:
    """
    Resize the image to ensure it is within the max pixel limit.
    
    Args:
        image_path (str): Path to the input image.
        max_pixels (int): Maximum allowed pixel count.
    
    Returns:
        PIL.Image: Resized image object.
    """
    # 画像をPillowで開く
    image = Image.open(image)

    width, height = image.size
    
    current_pixels = width * height

    if current_pixels <= max_pixels:
        return image
    
    scale_factor = (max_pixels / current_pixels) ** 0.5
    new_width = int(width * scale_factor)
    new_height = int(height * scale_factor)
    resized_image = image.resize((new_width, new_height), Image.ANTIALIAS)    
    return resized_image

    
def generate_image(model_Id, body):
    logger.info("Generating image with SDXL model %s", model_Id)

    bedrock = boto3.client(service_name='bedrock-runtime')

    accept = "application/json"
    content_type = "application/json"

    response = bedrock.invoke_model(
        body=body, modelId=model_Id, accept=accept, contentType=content_type
    )
    response_body = json.loads(response.get("body").read())

    finish_reason = response_body.get("artifacts")[0].get("finishReason")
    if finish_reason == 'ERROR' or finish_reason == 'CONTENT_FILTERED':
        raise ImageError(f"Image generation error. Error code is {finish_reason}")

    base64_image = response_body.get("artifacts")[0].get("base64")
    logger.info("Successfully generated image with the SDXL model %s", model_Id)

    return {"images": [base64_image]}


# stable-diffusionのID
model_Id = 'stability.stable-diffusion-xl-v1'
# stable-diffusionで画像修正
@app.post("/generate-image-to-image-stable-diffusion")
async def generate_image_stable_diffusion(request_body: ImageGenerationRequestitoi):
    if translate_en(request_body.prompt):
        async with httpx.AsyncClient() as client:
            translate_response = await client.post(
                "http://127.0.0.1:8000/translate-jp-to-en", 
                json={"text": request_body.prompt}
            )
        translated_text = translate_response.text
        request_body.prompt = translated_text

    try:
        response = requests.get(request_body.image_url)
        response.raise_for_status()
        init_image = base64.b64encode(response.content).decode('utf8')
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {e}")

    body = json.dumps({
        "text_prompts": [{"text": request_body.prompt}],
        "init_image": init_image,
        "style_preset": "isometric"
    })

    try:
        model_response = generate_image(model_Id=model_Id, body=body)
        return ImageGenerator.decode_and_stream_response(model_response)
    except ClientError as err:
        message = err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        raise HTTPException(status_code=500, detail=f"Client error: {message}")
    except ImageError as err:
        logger.error(err.message)
        raise HTTPException(status_code=500, detail=err.message)



class TranslationRequest(BaseModel):
    text: str


@app.post("/translate-jp-to-en")
async def translate_jp_to_en(request_body: TranslationRequest):
    translate_client = boto3.client('translate', region_name=REGION)
    try:
        response = translate_client.translate_text(
            Text=request_body.text,
            SourceLanguageCode='ja',
            TargetLanguageCode='en'
        )
        translated_text = response.get('TranslatedText', "")
        return Response(content=translated_text, media_type="text/plain")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Translation failed: {str(e)}"
        )
    

