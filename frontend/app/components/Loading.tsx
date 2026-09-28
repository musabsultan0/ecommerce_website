export default function Loading({ label = "Loading products..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2874F0]" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
