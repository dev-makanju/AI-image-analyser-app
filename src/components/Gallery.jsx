import { Images } from 'lucide-react';
import ImageCard from './ImageCard';

export default function Gallery({ images, onRemove, onClear }) {
  if (images.length === 0) {
    return (
      <section className="gallery-section">
        <div className="gallery-empty">
          <div className="gallery-empty__icon">
            <Images size={28} />
          </div>
          <p className="gallery-empty__text">No images classified yet</p>
          <p className="gallery-empty__hint">Upload an image to get started</p>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-header">
        <h2 className="gallery-title">
          Gallery
          <span className="gallery-count">{images.length}</span>
        </h2>
        <button className="gallery-clear-btn" onClick={onClear} id="clear-gallery-btn">
          Clear all
        </button>
      </div>
      <div className="gallery-grid">
        {images.map((img) => (
          <ImageCard key={img.id} image={img} onRemove={onRemove} />
        ))}
      </div>
    </section>
  );
}
