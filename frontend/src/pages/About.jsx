export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-900">Về chúng tôi</p>
          <h1 className="text-4xl font-semibold text-slate-900">Xưởng sản xuất dây ngư nghiệp uy tín của Phương Anh</h1>
          <p className="text-slate-600">Với nhiều năm kinh nghiệm, chúng tôi cung cấp dây neo tàu, dây thừng và lưới đánh cá đáp ứng nhu cầu ngư nghiệp toàn quốc.</p>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" alt="Xưởng dây" className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-brand-900">10+</h2>
          <p className="mt-2 text-slate-600">Năm hoạt động</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-brand-900">50+</h2>
          <p className="mt-2 text-slate-600">Sản phẩm dây và lưới</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-brand-900">100%</h2>
          <p className="mt-2 text-slate-600">Cam kết chất lượng</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-brand-900">Giao hàng</h2>
          <p className="mt-2 text-slate-600">Hỗ trợ giao hàng nhanh cho khách sỉ và ngư dân.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Cam kết chất lượng</h2>
        <p className="mt-4 text-slate-600">Mỗi sản phẩm được kiểm tra kỹ lưỡng trước khi giao, đảm bảo độ bền, độ chịu tải và chống mài mòn theo tiêu chuẩn ngư nghiệp.</p>
      </section>
    </div>
  )
}
