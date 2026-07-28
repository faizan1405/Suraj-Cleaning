export default async function OrderFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const params = await searchParams;
  const reason = params.reason || "Your payment could not be processed.";

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[500px] px-5 md:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-[32px] font-bold">✕</div>
          <h1 className="text-[24px] font-bold text-[#0f172a] mb-2">Payment Failed</h1>
          <p className="text-[14px] text-[#64748b] mb-6">{reason}</p>
          <p className="text-[13px] text-[#64748b] mb-6">Your cart has been saved. You can try again or return to the cart.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/checkout" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white font-bold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200">Try Again</a>
            <a href="/cart" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-[#334155] font-bold text-[14px] rounded-full hover:bg-slate-200 transition-colors">Return to Cart</a>
          </div>
        </div>
      </div>
    </section>
  );
}
