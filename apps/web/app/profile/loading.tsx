export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-8 sm:py-12 animate-pulse">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation skeleton */}
        <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-6">
          <div className="h-4 w-36 bg-[#E5E2DC] rounded" />
          <div className="h-4 w-24 bg-[#E5E2DC] rounded" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-9 w-48 bg-[#E5E2DC] rounded-lg" />
          <div className="h-4 w-80 bg-[#E5E2DC] rounded" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
          <div className="h-8 w-24 bg-[#E5E2DC] rounded-lg" />
          <div className="h-8 w-24 bg-[#E5E2DC] rounded-lg" />
          <div className="h-8 w-32 bg-[#E5E2DC] rounded-lg" />
        </div>

        {/* Profile Hero skeleton */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-20 sm:size-24 rounded-2xl bg-[#E5E2DC]" />
              <div className="space-y-2.5">
                <div className="h-7 w-48 bg-[#E5E2DC] rounded" />
                <div className="h-4 w-36 bg-[#E5E2DC] rounded" />
                <div className="h-3 w-28 bg-[#E5E2DC] rounded" />
              </div>
            </div>
            <div className="h-10 w-32 bg-[#E5E2DC] rounded-lg" />
          </div>
        </div>

        {/* Orders summary skeleton */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 space-y-6">
          <div className="h-5 w-40 bg-[#E5E2DC] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-20 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC]" />
            <div className="h-20 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC]" />
            <div className="h-20 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC]" />
          </div>
        </div>

        {/* Account Details skeleton */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 space-y-5">
          <div className="h-5 w-44 bg-[#E5E2DC] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-18 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC]" />
            <div className="h-18 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC]" />
            <div className="h-18 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC]" />
            <div className="h-18 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC]" />
          </div>
        </div>
      </div>
    </div>
  );
}
