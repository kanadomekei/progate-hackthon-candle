from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import base64
import boto3
import json
import os
import io

app = FastAPI()


class GenerateImageRequest(BaseModel):
    prompt: str

@app.get("/")
async def root():
    print("in root method")
    return {"message": "Hello World"}



@app.post("/generate-image-stability")
async def generate_image(request_body: GenerateImageRequest):

    # モデル(stability)
    MODELID = os.getenv("MODELID", "stability.stable-image-ultra-v1:0")
    # stabilityだけ us-west-2(オレゴン)
    REGION = os.getenv("REGION", "us-west-2")

    # Bedrock
    try:
        bedrock_runtime = boto3.client("bedrock-runtime", region_name=REGION)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Bedrock client: {e}")



    prompt = request_body.prompt

    body = {
        "prompt": prompt,
        "mode": "text-to-image"
    }

    try:
        # モデルの呼び出し
        response = bedrock_runtime.invoke_model(modelId=MODELID, body=json.dumps(body))
        model_response = json.loads(response["body"].read())
    except Exception as e:
        # モデル呼び出しエラー処理
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

    # レスポンスの検証
    if not model_response or "images" not in model_response or not model_response["images"]:
        raise HTTPException(status_code=500, detail="Invalid response from the model.")

    base64_image_data = model_response["images"][0]

    image_data = base64.b64decode(base64_image_data)

    return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")




@app.post("/generate-image-nova")
async def generate_image(request_body: GenerateImageRequest):

    # モデル(novaに変更する予定)
    MODELID = os.getenv("MODELID", "amazon.nova-convas-v1:0")
    REGION = os.getenv("REGION", "us-east-1")

    # Bedrock
    try:
        bedrock_runtime = boto3.client("bedrock-runtime", region_name=REGION)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Bedrock client: {e}")



    prompt = request_body.prompt

    body = {
        "prompt": prompt,
        "mode": "text-to-image"
    }

    try:
        # モデルの呼び出し
        response = bedrock_runtime.invoke_model(modelId=MODELID, body=json.dumps(body))
        model_response = json.loads(response["body"].read())
    except Exception as e:
        # モデル呼び出しエラー処理
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

    # レスポンスの検証
    if not model_response or "images" not in model_response or not model_response["images"]:
        raise HTTPException(status_code=500, detail="Invalid response from the model.")

    base64_image_data = model_response["images"][0]

    image_data = base64.b64decode(base64_image_data)

    return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")