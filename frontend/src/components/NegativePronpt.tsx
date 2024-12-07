"use client";

interface NegativePromptSectionProps {
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
}

export function NegativePromptSection({
  negativePrompt,
  setNegativePrompt,
}: NegativePromptSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Negative Prompt</h2>

      <div className="space-y-4">
        <div>
          <textarea
            id="prompt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="削除したい内容を書いてね❤️"
          />
        </div>
      </div>
    </div>
  );
}
