export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2 border-b border-[#E5E2DC] pb-6">
          <div className="h-4 w-28 rounded bg-[#E5E2DC]" />
          <div className="h-8 w-64 rounded bg-[#E5E2DC]" />
          <div className="h-4 w-80 rounded bg-[#E5E2DC]" />
        </div>

        {/* Orders list skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-40 rounded-2xl bg-white border border-[#E5E2DC]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
