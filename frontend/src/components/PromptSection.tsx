"use client";

interface PromptSectionProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

const PROMPT_TEMPLATES = [
  {
    name: "Minimal Logo",
    template: "A minimal, modern logo design with clean lines",
  },
  {
    name: "Abstract Art",
    template: "An abstract artistic pattern with flowing shapes",
  },
  {
    name: "Nature Inspired",
    template: "A nature-inspired illustration with organic elements",
  },
];

export function PromptSection({ prompt, onPromptChange }: PromptSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Design Prompt</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter your design prompt
          </label>
          <textarea
            id="prompt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe your design idea..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Or select a template:
          </h3>
          <div className="space-y-2">
            {PROMPT_TEMPLATES.map((template) => (
              <button
                key={template.name}
                className="w-full text-left px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => onPromptChange(template.template)}
              >
                <span className="block font-medium">{template.name}</span>
                <span className="block text-sm text-gray-500">
                  {template.template}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
