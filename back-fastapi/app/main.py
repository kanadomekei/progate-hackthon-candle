from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from PIL import Image
import boto3
import json
import os
import io
import re
import base64
import logging
from pydantic import BaseModel
from typing import Optional, Union

# 環境設定
load_dotenv()
app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 環境変数
MODELID = os.getenv("MODELID", "stability.stable-image-ultra-v1:0")
REGION = os.getenv("REGION", "us-west-2")
STABLE_DIFFUSION_MODEL = 'stability.stable-diffusion-xl-v1'

# ロギング設定
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Bedrockクライアント初期化
bedrock_runtime = boto3.client("bedrock-runtime", region_name=REGION)

# リクエストモデルの定義を追加
class ImagePrompt(BaseModel):
    prompt: str

# ヘルスチェック
@app.get("/")
async def root():
    return {"message": "Hello World from lambda with lwa"}

# 日本語判定
def translate_en(text: str) -> bool:
    japanese_pattern = re.compile(r'[\u3040-\u30FF\u4E00-\u9FFF]')
    return bool(japanese_pattern.search(text))

# レスポンス処理
def decode_and_stream_response(model_response: dict) -> StreamingResponse:
    if not model_response or "images" not in model_response or not model_response["images"]:
        raise HTTPException(status_code=500, detail="Invalid response from the model.")
    
    base64_image_data = model_response["images"][0]
    image_data = base64.b64decode(base64_image_data)
    return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")

# 画像生成エンドポイントを修正
@app.post("/generate-image-stable-diffusion")
async def generate_image_stable_diffusion(request: ImagePrompt):
    prompt = request.prompt
    
    if translate_en(prompt):
        try:
            translate_client = boto3.client('translate', region_name=REGION)
            response = translate_client.translate_text(
                Text=prompt,
                SourceLanguageCode='ja',
                TargetLanguageCode='en'
            )
            prompt = response['TranslatedText']
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

    body = {"prompt": prompt, "mode": "text-to-image"}

    try:
        response = bedrock_runtime.invoke_model(modelId=MODELID, body=json.dumps(body))
        model_response = json.loads(response["body"].read())
        return decode_and_stream_response(model_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

# 画像変換用の関数
def resize_to_64_multiple(image_data: bytes) -> bytes:
    image = Image.open(io.BytesIO(image_data))
    width, height = image.size
    new_width = ((width + 63) // 64) * 64
    new_height = ((height + 63) // 64) * 64
    resized_image = image.resize((new_width, new_height))
    buffer = io.BytesIO()
    resized_image.save(buffer, format="PNG")
    return buffer.getvalue()

# 画像生成（image-to-image）エンドポイント
@app.post("/generate-image-to-image-stable-diffusion")
async def generate_image_to_image(prompt: str, file: UploadFile = File(...), style: str = None):
    if translate_en(prompt):
        try:
            translate_client = boto3.client('translate', region_name=REGION)
            response = translate_client.translate_text(
                Text=prompt,
                SourceLanguageCode='ja',
                TargetLanguageCode='en'
            )
            prompt = response['TranslatedText']
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

    try:
        image_content = await file.read()
        resized_image_content = resize_to_64_multiple(image_content)
        init_image = base64.b64encode(resized_image_content).decode('utf8')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process uploaded image: {e}")

    body = json.dumps({
        "text_prompts": [{"text": prompt}],
        "init_image": init_image,
        "style_preset": style
    })

    try:
        response = bedrock_runtime.invoke_model(
            body=body,
            modelId=STABLE_DIFFUSION_MODEL,
            accept="application/json",
            contentType="application/json"
        )
        response_body = json.loads(response.get("body").read())
        
        if response_body.get("artifacts")[0].get("finishReason") in ['ERROR', 'CONTENT_FILTERED']:
            raise HTTPException(status_code=500, detail="Image generation failed")
            
        base64_image = response_body.get("artifacts")[0].get("base64")
        return decode_and_stream_response({"images": [base64_image]})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

