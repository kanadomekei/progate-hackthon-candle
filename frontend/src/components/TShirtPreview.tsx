"use client";

interface TShirtPreviewProps {
  generatedImageUrl?: string;
}

export function TShirtPreview({ generatedImageUrl }: TShirtPreviewProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {generatedImageUrl ? (
        <img
          src={generatedImageUrl}
          alt="Generated T-shirt design"
          className="w-full h-auto rounded-lg"
        />
      ) : (
        <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">画像が生成されていません</p>
        </div>
      )}
    </div>
  );
}
