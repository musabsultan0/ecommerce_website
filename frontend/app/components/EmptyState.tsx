export default function EmptyState({
  title = "Nothing here yet",
  message = "There's nothing to show right now.",
  action,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.693 2.615-7.152.088-.35-.128-.699-.483-.699H5.106M7.5 14.25L5.106 5.106" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-[#212121]">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
      </div>
      {action}
    </div>
  );
}
