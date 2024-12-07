"use client";

interface PositivePromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onPromptChange?: (prompt: string) => void;
}

export function PositivePrompt({ prompt, setPrompt, onPromptChange }: PositivePromptProps) {
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    if (onPromptChange) {
      onPromptChange(newPrompt);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">プロンプト</h2>
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tシャツのデザインを説明してください..."
      />
    </div>
  );
}
