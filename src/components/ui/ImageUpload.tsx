'use client';

import React, { useRef, useState } from 'react';
import { FiCamera, FiTrash2, FiX } from 'react-icons/fi';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: string[] = [];
    const remaining = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remaining);

    filesToProcess.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 800;
            let width = img.width;
            let height = img.height;
            
            if (width > height && width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            newImages.push(compressed);
            if (newImages.length === filesToProcess.length) {
              onChange([...images, ...newImages]);
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-[#A0A0A0]">Photos</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 transition-colors ${
          isDragging ? 'border-[#FF6B35] bg-[#FF6B35]/10' : 'border-[#333] hover:border-[#666]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        {images.length === 0 ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 flex flex-col items-center text-[#666] hover:text-[#A0A0A0] transition-colors"
          >
            <FiCamera size={32} className="mb-2" />
            <p className="text-sm">Tap to add photos</p>
            <p className="text-xs text-[#666] mt-1">or drag and drop</p>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-[#0F0F0F]">
                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-[#FF4757]"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
            {images.length < maxImages && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-[#333] flex items-center justify-center text-[#666] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
              >
                <FiCamera size={20} />
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-[#666]">{images.length}/{maxImages} photos</p>
    </div>
  );
}
