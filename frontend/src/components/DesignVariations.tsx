"use client";

export function DesignVariations() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Design Variations</h2>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="aspect-square bg-gray-50 rounded-lg border-2 border-gray-200 p-4 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-400">
              {index}
            </div>
            <span className="text-sm text-gray-500">Variation {index}</span>
            <button className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Select
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Generate More Variations
        </button>
      </div>
    </div>
  );
}
