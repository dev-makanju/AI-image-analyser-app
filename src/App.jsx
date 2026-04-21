import { useState, useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Brain, Zap, AlertCircle } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import Gallery from './components/Gallery';

export default function App() {
  const [model, setModel] = useState(null);
  const [modelStatus, setModelStatus] = useState('loading');
  const [images, setImages] = useState([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const idCounter = useRef(0);

  useEffect(() => {
    let cancelled = false;
    async function loadModel() {
      try {
        setModelStatus('loading');
        await tf.ready();
        const m = await mobilenet.load({ version: 2, alpha: 1.0 });
        if (!cancelled) {
          setModel(m);
          setModelStatus('ready');
        }
      } catch (err) {
        console.error('Model load error:', err);
        if (!cancelled) setModelStatus('error');
      }
    }
    loadModel();
    return () => { cancelled = true; };
  }, []);

  const classifyImage = useCallback(async (file) => {
    if (!model) return;
    setIsClassifying(true);
    try {
      const imgUrl = URL.createObjectURL(file);
      const imgEl = new Image();
      imgEl.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        imgEl.onload = resolve;
        imgEl.onerror = reject;
        imgEl.src = imgUrl;
      });
      const predictions = await model.classify(imgEl, 3);
      const id = ++idCounter.current;
      setImages(prev => [{ id, src: imgUrl, predictions, fileName: file.name }, ...prev]);
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsClassifying(false);
    }
  }, [model]);

  const removeImage = useCallback((id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setImages([]);
  }, []);

  return (
    <>
      <div className="app-bg-glow" />
      <div className="app-container">
        <header className="app-header">
          <div className="app-logo">
            <div className="app-logo-icon">
              <Brain size={24} />
            </div>
            <h1 className="app-title">VisionAI</h1>
          </div>
          <p className="app-subtitle">
            AI-powered image classification using MobileNet — runs entirely in your browser.
          </p>
          <StatusBadge status={modelStatus} />
        </header>
        <ImageUploader
          onImageSelect={classifyImage}
          isClassifying={isClassifying}
          modelReady={modelStatus === 'ready'}
        />
        <Gallery images={images} onRemove={removeImage} onClear={clearAll} />
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  if (status === 'loading') {
    return (
      <div className="model-status model-status--loading">
        <span className="status-dot status-dot--pulse" />
        Loading MobileNet model...
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="model-status model-status--error">
        <AlertCircle size={14} />
        Failed to load model
      </div>
    );
  }
  return (
    <div className="model-status model-status--ready">
      <Zap size={14} />
      Model ready
    </div>
  );
}
