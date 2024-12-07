"use client";

interface PromptSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export function PositivePrompt({ prompt, setPrompt }: PromptSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Design Prompt</h2>

      <div className="space-y-4">
        <div>
          <textarea
            id="prompt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="デザインのアイデアを書いてね"
          />
        </div>
      </div>
    </div>
  );
}
