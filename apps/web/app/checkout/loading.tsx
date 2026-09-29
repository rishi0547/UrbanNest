export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2 border-b border-[#E5E2DC] pb-6">
          <div className="h-4 w-28 rounded bg-[#E5E2DC]" />
          <div className="h-8 w-64 rounded bg-[#E5E2DC]" />
          <div className="h-4 w-96 rounded bg-[#E5E2DC]" />
        </div>

        {/* 2-column layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-64 rounded-2xl bg-white border border-[#E5E2DC] p-6" />
            <div className="h-48 rounded-2xl bg-white border border-[#E5E2DC] p-6" />
          </div>
          <div className="lg:col-span-5">
            <div className="h-80 rounded-2xl bg-white border border-[#E5E2DC] p-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
