"use client";

export default function Error({
  reset,
}: {
  readonly reset: () => void;
}) {
  return (
    <main className="mx-auto min-w-0 max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8" id="main-content">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-rose-700">Có lỗi xảy ra</p>
      <h1 className="mt-3 font-display text-4xl font-black text-stone-950">Không thể tải catalog</h1>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-stone-600">
        Hãy thử tải lại khu vực này. Dữ liệu và thông tin kỹ thuật nội bộ không được hiển thị.
      </p>
      <button
        className="mt-6 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        onClick={reset}
        type="button"
      >
        Thử lại
      </button>
    </main>
  );
}
