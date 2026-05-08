export default function Gallery({ images }) {
  if (!images?.length) {
    return <img src="https://via.placeholder.com/760x460?text=No+Image" alt="No image" className="w-full rounded-3xl object-cover" />
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Hình ảnh ${index + 1}`} className="h-52 w-full rounded-3xl object-cover" />
        ))}
      </div>
    </div>
  )
}
