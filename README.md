# Tシャツデザイナー

PixivさんのフルプリントTシャツをデザインするためのアプリケーションです。  
AWS Bedrockを活用した生成AIによるデザイン作成機能や、デザインを適切な形に切り取る機能、モデル選択機能を提供しています。

---

## 主な機能

- **デザイン生成**: AWS Bedrockを使用した生成AIにより、魅力的なデザインを作成できます。  
- **切り取り機能**: 作成したデザインをTシャツに合わせてカスタマイズできます。  
- **モデル選択**: 複数のモデルから好みのデザインスタイルを選択可能です。

---

## 使用技術

### フロントエンド

- **React**
- **Next.js**
- **TypeScript**
- **TailwindCSS**

### バックエンド

- **Python**
- **FastAPI**

### AWSサービス

- **S3**
- **Lambda**
- **Bedrock**

### 画像生成モデル

- **Stability AI SDXL 1.0**
- **Amazon Nova Canvas**

---

## 環境構築

以下の手順に従って開発環境をセットアップしてください。

1. **Dockerコンテナを起動**:
   ```bash
   task docker:up
2. **仮想環境の作成と有効化**:
   ```bash
    python -m venv myenv
    source myenv/bin/activate

3. **パッケージのインストール**:
   ```bash
    pip install -r requirements.txt

4. **バックエンドの起動**:
   ```bash
    uvicorn app.main:app --reload --port 8000

5. **フロントエンドの起動**:
   ```bash
    npm run dev
6. **ブラウザでアクセス**:  
   `http://localhost:3001/`

---

## 操作方法

1. **画像生成**:  
   テキストエリアにお好きなプロンプト（prompt）を入力し、「画像生成」をクリックしてください。複数枚のデザインが生成されます。

2. **デザイン選択と切り取り**:  
   お気に入りのデザインをクリックし、「服の方に切り取る」を選択してください。必要に応じて微調整後、「切り取る」ボタンをクリックすると、完成したデザインをダウンロード可能です。

3. **Tシャツへの適用例**:  
   詳細は [PixivフルプリントTシャツページ](https://factory.pixiv.net/products/all_over_printing_dry_tshirt) をご参照ください。

---

## その他コマンド

- **Dockerコンテナの停止**:
  ```bash
  task docker:down
