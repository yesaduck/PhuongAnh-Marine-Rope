export default function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Liên hệ</h1>
          <p className="mt-3 text-slate-600">Gửi yêu cầu báo giá hoặc đặt hàng dây ngư nghiệp cho xưởng Phương Anh.</p>
          <div className="mt-8 space-y-6">
            <p><strong>Hotline:</strong> 0901 234 567</p>
            <p><strong>Email:</strong> contact@phuonganhrope.vn</p>
            <p><strong>Địa chỉ:</strong> Khu công nghiệp Phương Anh, tỉnh ven biển.</p>
          </div>
          <form className="mt-8 space-y-4">
            <input type="text" placeholder="Họ tên" className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
            <input type="email" placeholder="Email" className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
            <textarea placeholder="Nội dung liên hệ" rows="5" className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
            <button type="button" className="rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Gửi tin nhắn</button>
          </form>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-sm">
          <iframe title="Google Maps" width="100%" height="100%" className="min-h-[420px]" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6620786908475!2d106.629722!3d10.823098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b0b8d2b5f%3A0xa7e61af24c7cb55c!2zSOG7kyBuaMOgIEjhqG4gQW5o!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" allowFullScreen loading="lazy"></iframe>
        </div>
      </div>
    </div>
  )
}
