import { TShirtDesigner } from "@/components/TShirtDesigner";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          T-Shirt Designer
        </h1>
        <TShirtDesigner />
      </div>
    </main>
  );
}
