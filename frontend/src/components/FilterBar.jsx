export default function FilterBar({ categories, filters, onChange, onSearch }) {
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
      <input
        type="search"
        placeholder="Tìm sản phẩm..."
        defaultValue={filters.search}
        onChange={(e) => onSearch(e.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-700"
      />
      <select value={filters.category} onChange={(e) => onChange('category', e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">
        <option value="">Tất cả loại dây</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <select value={filters.size} onChange={(e) => onChange('size', e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">
        <option value="">Tất cả kích thước</option>
        <option value="6mm">6mm</option>
        <option value="10mm">10mm</option>
        <option value="16mm">16mm</option>
        <option value="20mm">20mm</option>
      </select>
      <select value={filters.price} onChange={(e) => onChange('price', e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">
        <option value="">Tất cả giá</option>
        <option value="100000">Dưới 100.000đ</option>
        <option value="500000">Dưới 500.000đ</option>
        <option value="1000000">Dưới 1.000.000đ</option>
      </select>
    </div>
  )
}
