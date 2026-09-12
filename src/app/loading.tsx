export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16"
    >
      <div className="flex flex-col gap-4">
        <div className="h-9 w-2/3 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
