export default function PlaceCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mb-3 flex items-center gap-4">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mb-3 space-y-2">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-14 rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-10 rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
