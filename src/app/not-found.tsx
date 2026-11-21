import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto min-w-0 max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8" id="main-content">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">404</p>
      <h1 className="mt-3 font-display text-4xl font-black text-stone-950">Không tìm thấy nội dung</h1>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-stone-600">
        Trang hoặc truyện này không tồn tại trong catalog công khai.
      </p>
      <Link
        className="mt-6 inline-flex rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        href="/"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
