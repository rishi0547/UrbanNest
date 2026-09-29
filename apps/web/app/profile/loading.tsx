export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-8 sm:py-12 animate-pulse">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation skeleton */}
        <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-6">
          <div className="h-4 w-32 bg-[#E5E2DC] rounded" />
          <div className="h-4 w-24 bg-[#E5E2DC] rounded" />
        </div>

        {/* Profile Card skeleton */}
        <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-20 rounded-2xl bg-[#E5E2DC]" />
              <div className="space-y-2.5">
                <div className="h-7 w-48 bg-[#E5E2DC] rounded" />
                <div className="h-4 w-36 bg-[#E5E2DC] rounded" />
                <div className="h-3 w-28 bg-[#E5E2DC] rounded" />
              </div>
            </div>
            <div className="h-9 w-28 bg-[#E5E2DC] rounded-full" />
          </div>
        </div>

        {/* Orders summary skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-36 bg-[#E5E2DC] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 h-28" />
            <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 h-28" />
          </div>
        </div>

        {/* Account Details skeleton */}
        <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 sm:p-8 space-y-4">
          <div className="h-5 w-32 bg-[#E5E2DC] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-16 rounded-xl bg-[#F8F6F2]" />
            <div className="h-16 rounded-xl bg-[#F8F6F2]" />
            <div className="h-16 rounded-xl bg-[#F8F6F2]" />
            <div className="h-16 rounded-xl bg-[#F8F6F2]" />
          </div>
        </div>
      </div>
    </div>
  );
}
