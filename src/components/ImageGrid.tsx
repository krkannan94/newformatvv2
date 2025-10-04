import React, { useState } from 'react';
import { Replace, Type, ArrowUpDown, Trash2, X } from 'lucide-react';
import { ImageData } from '../types';

interface ImageGridProps {
  images: ImageData[];
  type: 'before' | 'after';
  onImagesChange: (images: ImageData[]) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, type, onImagesChange }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [editingImage, setEditingImage] = useState<string | null>(null);

  // Create a 2x2 grid with empty slots
  const gridItems = Array(4).fill(null).map((_, index) => images[index] || null);

  const handleReplace = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage: ImageData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            url: event.target?.result as string,
            type,
          };
          
          const newImages = [...images];
          newImages[index] = newImage;
          onImagesChange(newImages);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddText = (imageId: string) => {
    setEditingImage(imageId);
    const image = images.find(img => img.id === imageId);
    setTextInput(image?.text || '');
  };

  const saveText = () => {
    if (editingImage) {
      const newImages = images.map(img => 
        img.id === editingImage ? { ...img, text: textInput } : img
      );
      onImagesChange(newImages);
      setEditingImage(null);
      setTextInput('');
    }
  };

  const handleSwap = (index1: number, index2: number) => {
    if (images[index1] && images[index2]) {
      const newImages = [...images];
      [newImages[index1], newImages[index2]] = [newImages[index2], newImages[index1]];
      onImagesChange(newImages);
    }
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {type} Pictures
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          type === 'before' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {images.length} / 4
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {gridItems.map((image, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 relative group overflow-hidden"
          >
            {image ? (
              <>
                <img
                  src={image.url}
                  alt={`${type} ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedImage(image.url)}
                />
                
                {/* Image text overlay */}
                {image.text && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                    {image.text}
                  </div>
                )}

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleReplace(index)}
                    className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors"
                    title="Replace"
                  >
                    <Replace className="w-3 h-3 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleAddText(image.id)}
                    className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors"
                    title="Add Text"
                  >
                    <Type className="w-3 h-3 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-500 shadow-sm transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium">{index + 1}</span>
                  </div>
                  <p className="text-sm">Empty Slot</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Text Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Text to Image</h3>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none"
              rows={3}
              placeholder="Enter descriptive text..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveText}
                className="flex-1 bg-cbre-primary text-white py-2 px-4 rounded-lg hover:bg-cbre-accent transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingImage(null);
                  setTextInput('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;