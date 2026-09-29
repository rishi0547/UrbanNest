export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 bg-[#F8F6F2]">
      <div className="flex flex-col items-center gap-4">
        {/* Monogram Brand Loading Indicator */}
        <div className="size-12 rounded-2xl bg-[#5D6B4D]/10 border border-[#5D6B4D]/20 flex items-center justify-center text-[#5D6B4D] font-heading font-bold text-xl animate-pulse">
          UN
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#5D6B4D] animate-bounce [animation-delay:-0.3s]" />
          <div className="size-2 rounded-full bg-[#5D6B4D] animate-bounce [animation-delay:-0.15s]" />
          <div className="size-2 rounded-full bg-[#5D6B4D] animate-bounce" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#6B7280] font-medium">
          Loading UrbanNest
        </span>
      </div>
    </div>
  );
}
