import { useState } from "react";

interface SamplePromptProps {
  onPromptSelect: (prompt: string) => void;
}

const SAMPLE_PROMPTS = [
  {
    name: "Minimalist Logo",
    prompt:
      "シンプルで洗練された直線と基本的な図形を使用したミニマリストなロゴデザイン",
  },
  {
    name: "Abstract Art",
    prompt: "流れるような形状とパターンを持つ抽象的なアートデザイン",
  },
  {
    name: "Cute Character",
    prompt:
      "かわいらしい表情と丸みのある形状を持つカワイイスタイルのキャラクターデザイン",
  },
  {
    name: "Typography",
    prompt:
      "スタイリッシュでクリエイティブな文字デザイン、装飾的なタイポグラフィ",
  },
  {
    name: "Nature Motif",
    prompt: "葉や花などの自然をモチーフにした有機的なデザイン",
  },
];

export function SamplePrompt({ onPromptSelect }: SamplePromptProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sample</h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt.name}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedPrompt === prompt.name
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => {
              setSelectedPrompt(prompt.name);
              onPromptSelect(prompt.prompt);
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{prompt.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
