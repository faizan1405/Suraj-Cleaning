import { motion } from "framer-motion";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-lg border border-slate-100">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[28px] md:text-[32px] font-bold text-[#0f172a] mb-3"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[15px] text-[#64748b] mb-8"
          >
            Thank you for your order. We have received your payment and will
            process your order shortly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-50 rounded-2xl p-5 mb-8 space-y-3"
          >
            {params.payment_id && (
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748b]">Payment ID</span>
                <span className="font-mono font-semibold text-[#0f172a]">{params.payment_id}</span>
              </div>
            )}
            {params.order_id && (
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748b]">Order ID</span>
                <span className="font-mono font-semibold text-[#0f172a]">{params.order_id}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#64748b]">Status</span>
              <span className="font-semibold text-green-600">Confirmed</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2563eb] text-white text-[14px] font-semibold rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 btn-shine"
            >
              Continue Shopping
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-[#334155] text-[14px] font-semibold rounded-full hover:bg-slate-200 transition-colors"
            >
              Back to Home
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[12px] text-[#94a3b8] mt-6"
          >
            A confirmation email will be sent to you shortly.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
