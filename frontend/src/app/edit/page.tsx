"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function EditPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">画像が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">画像編集</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Image
          src={imageUrl}
          alt="編集する画像"
          width={400}
          height={533}
          className="w-full h-auto rounded-lg max-w-2xl mx-auto"
        />
        {/* ここに編集用のコントロールを追加予定 */}
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <EditPageContent />
    </Suspense>
  );
}
