'use client';

/**
 * Fallback/Loading skeleton components for graceful degradation
 * Shows while data is loading or when there's an error
 */

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-gray-700 rounded w-full"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-800/30 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-2/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            <div className="h-4 bg-gray-700 rounded w-3/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorFallback({
  title = "Unable to load content",
  message = "Please try refreshing the page or contact support if the problem persists.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 my-4">
      <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "No data found",
  message = "There's nothing to display right now.",
  icon = "📭",
}: {
  title?: string;
  message?: string;
  icon?: string;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-400">{message}</p>
    </div>
  );
}
