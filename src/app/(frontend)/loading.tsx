export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#214842]/20 border-t-[#214842] rounded-full animate-spin" />
        <p className="text-[#214842]/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
