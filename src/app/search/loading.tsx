export default function SearchLoading() {
  return (
    <main className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="main-content">
      <section aria-label="Đang tải kết quả tìm kiếm" aria-live="polite" className="space-y-6" role="status">
        <div className="h-10 w-80 max-w-full animate-pulse rounded-lg bg-stone-200 motion-reduce:animate-none" />
        <div className="h-14 max-w-2xl animate-pulse rounded-xl bg-stone-200 motion-reduce:animate-none" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="h-48 animate-pulse rounded-2xl bg-stone-200 motion-reduce:animate-none" key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
