from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import base64
import boto3
import json
import os
import io

# .envファイルの読み込み
load_dotenv()

app = FastAPI()


@app.get("/")
async def root():
    print("in root method")
    return {"message": "Hello World"}


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
    body = {"prompt": request_body.prompt, "mode": "text-to-image"}

    try:
        response = bedrock_runtime.invoke_model(modelId=MODELID, body=json.dumps(body))
        model_response = json.loads(response["body"].read())
        return ImageGenerator.decode_and_stream_response(model_response)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Image generation failed: {str(e)}"
        )


@app.post("/generate-image-nova-canvas")
async def generate_image_nova_canvas(request_body: ImageGenerationRequest):
    body = {
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {"text": request_body.prompt},
        "imageGenerationConfig": {
            "width": 1024,
            "height": 1024,
            "quality": "standard",
            "numberOfImages": 1,
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
