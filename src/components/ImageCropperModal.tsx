import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, RotateCcw, X, Check, RotateCw } from 'lucide-react';
import getCroppedImg from '../utils/cropImage';

interface ImageCropperModalProps {
  imageSrc: string;
  fileName: string;
  aspectRatio?: number; // If not provided, user can select
  helperText?: string;
  onCancel: () => void;
  onCropCompleteAction: (croppedFile: File) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  fileName,
  aspectRatio: fixedAspect,
  helperText,
  onCancel,
  onCropCompleteAction,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(fixedAspect || 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      
      if (croppedFile) {
        // preserve original filename or extension if needed, cropImage generates .jpeg
        onCropCompleteAction(croppedFile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Editor Gambar</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{fileName}</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative w-full h-[400px] sm:h-[500px] bg-slate-900 shrink-0">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        {/* Controls */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {helperText && (
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-medium text-center">
              {helperText}
            </div>
          )}

          {!fixedAspect && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Rasio Gambar</label>
              <div className="flex gap-2">
                <button onClick={() => setAspect(1)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${aspect === 1 ? 'bg-primary text-white border-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'}`}>1:1</button>
                <button onClick={() => setAspect(4/3)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${aspect === 4/3 ? 'bg-primary text-white border-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'}`}>4:3</button>
                <button onClick={() => setAspect(16/9)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${aspect === 16/9 ? 'bg-primary text-white border-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'}`}>16:9</button>
                <button onClick={() => setAspect(9/16)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${aspect === 9/16 ? 'bg-primary text-white border-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'}`}>9:16</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zoom Control */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Zoom</label>
                <span className="text-[10px] text-slate-500">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <ZoomOut size={16} className="text-slate-400" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <ZoomIn size={16} className="text-slate-400" />
              </div>
            </div>

            {/* Rotation Control */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Rotasi</label>
                <span className="text-[10px] text-slate-500">{rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={16} className="text-slate-400" />
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <RotateCw size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all"
          >
            {isProcessing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Potong & Simpan
          </button>
        </div>

      </div>
    </div>
  );
};
