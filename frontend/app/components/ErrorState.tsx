export default function ErrorState({
  message = "Something went wrong while loading products.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <svg className="h-7 w-7 text-[#FF6161]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-[#212121]">Couldn&apos;t load this</p>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
        <p className="mt-1 text-xs text-gray-400">
          Make sure the Go backend is running at{" "}
          <code className="rounded bg-gray-100 px-1">localhost:8080</code>
        </p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-sm bg-[#2874F0] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1e5fc9]"
      >
        Retry
      </button>
    </div>
  );
}
