import { useCallback } from 'react';
import { Upload } from 'lucide-react';

export default function ImageUploader({ onImageSelect, isClassifying, modelReady }) {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('upload-zone--active');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('upload-zone--active');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('upload-zone--active');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      files.forEach(file => onImageSelect(file));
    }
  }, [onImageSelect]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    files.forEach(file => onImageSelect(file));
    e.target.value = '';
  }, [onImageSelect]);

  const disabled = !modelReady || isClassifying;

  return (
    <section className="upload-section">
      <div
        id="upload-zone"
        className={`upload-zone ${disabled ? 'upload-zone--disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-zone__content">
          {isClassifying ? (
            <div className="upload-zone__classifying">
              <div className="spinner spinner--lg"></div>
              <span className="upload-zone__classifying-text">Classifying image...</span>
            </div>
          ) : (
            <>
              <div className="upload-zone__icon">
                <Upload size={24} />
              </div>
              <p className="upload-zone__title">
                Drop images here or click to upload
              </p>
              <p className="upload-zone__hint">
                Supports JPG, PNG, WebP — multiple files allowed
              </p>
            </>
          )}
        </div>
        {!isClassifying && (
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            className="upload-zone__input"
            onChange={handleFileChange}
            disabled={disabled}
          />
        )}
      </div>
    </section>
  );
}
