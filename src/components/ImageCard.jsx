import { X } from 'lucide-react';

function getBarClass(probability) {
  if (probability >= 0.6) return 'prediction__bar-fill--high';
  if (probability >= 0.3) return 'prediction__bar-fill--mid';
  return 'prediction__bar-fill--low';
}

export default function ImageCard({ image, onRemove }) {
  const { id, src, predictions } = image;
  const topLabel = predictions?.[0]?.className?.split(',')[0] || 'Unknown';

  return (
    <article className="image-card" id={`card-${id}`}>
      <div className="image-card__preview">
        <img
          className="image-card__img"
          src={src}
          alt={topLabel}
          loading="lazy"
        />
        <span className="image-card__top-label">{topLabel}</span>
        <button
          className="image-card__remove"
          onClick={() => onRemove(id)}
          aria-label="Remove image"
          title="Remove"
        >
          <X size={14} />
        </button>
      </div>
      <div className="image-card__body">
        <p className="image-card__predictions-title">Predictions</p>
        {predictions?.map((pred, i) => {
          const pct = (pred.probability * 100).toFixed(1);
          const label = pred.className?.split(',')[0] || `Class ${i}`;
          return (
            <div className="prediction" key={i}>
              <div className="prediction__header">
                <span className="prediction__label">{label}</span>
                <span className="prediction__score">{pct}%</span>
              </div>
              <div className="prediction__bar-bg">
                <div
                  className={`prediction__bar-fill ${getBarClass(pred.probability)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
