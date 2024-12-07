"use client";

interface PositivePromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onPromptChange?: (prompt: string) => void;
}

export function PositivePrompt({
  prompt,
  setPrompt,
  onPromptChange,
}: PositivePromptProps) {
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    if (onPromptChange) {
      onPromptChange(newPrompt);
    }
  };

  const handleClear = () => {
    setPrompt("");
    if (onPromptChange) {
      onPromptChange("");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Prompt</h2>
        <button
          onClick={handleClear}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          Clear
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Describe your T-shirt design..."
      />
    </div>
  );
}
