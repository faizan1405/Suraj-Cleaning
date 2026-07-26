import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
      <h1 className="text-[120px] md:text-[180px] font-bold text-[#2563eb] leading-none">
        404
      </h1>
      <h2 className="text-[24px] md:text-[30px] font-bold text-[#0f172a] mt-2 mb-4">
        Page Not Found
      </h2>
      <p className="text-[15px] text-[#64748b] max-w-md mb-8">
        Looks like this page got lost in the cleaning. Let&apos;s get you back
        on track!
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200"
      >
        Go Back Home
      </Link>
    </div>
  );
}
