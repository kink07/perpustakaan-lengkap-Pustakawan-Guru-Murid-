import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Camera, X, RotateCcw, Check, Crop, Download, Upload } from 'lucide-react';

interface CameraUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCapture: (file: File) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function CameraUploadModal({ isOpen, onClose, onImageCapture }: CameraUploadModalProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Performance optimization refs
  const lastMouseMoveRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Memoized crop area calculations for better performance
  const cropAreaStyle = useMemo(() => {
    if (!imageRef.current || cropArea.width <= 0 || cropArea.height <= 0) {
      return null;
    }
    
    const img = imageRef.current;
    return {
      left: `${(cropArea.x / img.naturalWidth) * 100}%`,
      top: `${(cropArea.y / img.naturalHeight) * 100}%`,
      width: `${(cropArea.width / img.naturalWidth) * 100}%`,
      height: `${(cropArea.height / img.naturalHeight) * 100}%`,
    };
  }, [cropArea]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsCapturing(true);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera tidak didukung di browser ini');
      }

      // Try different camera configurations
      let stream: MediaStream | null = null;
      const constraints = [
        // Try back camera first
        { 
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'environment'
          } 
        },
        // Try front camera if back camera fails
        { 
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'user'
          } 
        },
        // Try any camera with lower resolution
        { 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        },
        // Try basic camera access
        { video: true }
      ];

      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch (err) {
          console.warn('Camera constraint failed:', constraint, err);
          continue;
        }
      }

      if (!stream) {
        throw new Error('Tidak dapat mengakses kamera dengan konfigurasi apapun');
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
      
      let errorMessage = 'Tidak dapat mengakses kamera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Izin kamera ditolak. Silakan berikan izin kamera di pengaturan browser.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'Kamera tidak ditemukan. Pastikan kamera terhubung.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain yang menggunakan kamera atau coba refresh halaman.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Kamera tidak mendukung resolusi yang diminta.';
      } else if (error.name === 'SecurityError') {
        errorMessage += 'Akses kamera diblokir karena alasan keamanan.';
      } else {
        errorMessage += `Error: ${error.message || 'Tidak diketahui'}`;
      }
      
      alert(errorMessage);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        setShowCrop(true);
        stopCamera();
      }
    }
  }, [stopCamera]);

  // Optimized auto crop detection for book objects
  const autoCrop = useCallback(() => {
    if (imageRef.current && !isProcessing) {
      setIsProcessing(true);
      
      const img = imageRef.current;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      // Validate image dimensions
      if (!imgWidth || !imgHeight || imgWidth <= 0 || imgHeight <= 0) {
        console.warn('Invalid image dimensions:', { imgWidth, imgHeight });
        // Fallback to center crop
        const fallbackWidth = Math.min(400, img.clientWidth || 400);
        const fallbackHeight = Math.min(400, img.clientHeight || 400);
        const x = (fallbackWidth - fallbackWidth * 0.8) / 2;
        const y = (fallbackHeight - fallbackHeight * 0.8) / 2;
        
        setCropArea({ 
          x: Math.max(0, x), 
          y: Math.max(0, y), 
          width: fallbackWidth * 0.8, 
          height: fallbackHeight * 0.8 
        });
        setIsProcessing(false);
        return;
      }
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        try {
          // Create canvas to analyze image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsProcessing(false);
            return;
          }
          
          canvas.width = imgWidth;
          canvas.height = imgHeight;
          ctx.drawImage(img, 0, 0);
          
          // Get image data for analysis
          const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
          const data = imageData.data;
          
          // Optimized book detection algorithm
          let bestCrop = { x: 0, y: 0, width: imgWidth, height: imgHeight, score: 0 };
          
          // Reduced crop sizes for better performance
          const cropSizes = [0.7, 0.8, 0.9];
          
          for (const sizeRatio of cropSizes) {
            const cropWidth = imgWidth * sizeRatio;
            const cropHeight = imgHeight * sizeRatio;
            
            // Larger steps for better performance
            const stepX = Math.max(1, Math.floor(imgWidth * 0.15));
            const stepY = Math.max(1, Math.floor(imgHeight * 0.15));
            
            for (let x = 0; x <= imgWidth - cropWidth; x += stepX) {
              for (let y = 0; y <= imgHeight - cropHeight; y += stepY) {
                const score = calculateCropScore(data, imgWidth, imgHeight, x, y, cropWidth, cropHeight);
                
                if (score > bestCrop.score) {
                  bestCrop = { x, y, width: cropWidth, height: cropHeight, score };
                }
              }
            }
          }
          
          // If no good crop found, use center crop as fallback
          if (bestCrop.score < 0.3) {
            const minDimension = Math.min(imgWidth, imgHeight);
            const cropSize = minDimension * 0.8;
            const x = (imgWidth - cropSize) / 2;
            const y = (imgHeight - cropSize) / 2;
            
            bestCrop = { 
              x: Math.max(0, x), 
              y: Math.max(0, y), 
              width: Math.min(cropSize, imgWidth), 
              height: Math.min(cropSize, imgHeight),
              score: 0.5
            };
          }
          
          setCropArea({ 
            x: Math.round(bestCrop.x), 
            y: Math.round(bestCrop.y), 
            width: Math.round(bestCrop.width), 
            height: Math.round(bestCrop.height) 
          });
        } catch (error) {
          console.error('Auto crop error:', error);
        } finally {
          setIsProcessing(false);
        }
      });
    }
  }, [isProcessing]);

  // Optimized crop score calculation with better performance
  const calculateCropScore = useCallback((data: Uint8ClampedArray, imgWidth: number, imgHeight: number, 
                             x: number, y: number, width: number, height: number): number => {
    // Validate parameters
    if (!data || data.length === 0 || imgWidth <= 0 || imgHeight <= 0 || width <= 0 || height <= 0) {
      return 0;
    }
    
    let edgeCount = 0;
    let contrastSum = 0;
    let pixelCount = 0;
    
    // Optimized sampling - larger step for better performance
    const step = Math.max(2, Math.floor(Math.min(width, height) / 30));
    
    // Pre-calculate bounds for better performance
    const maxX = Math.min(x + width, imgWidth);
    const maxY = Math.min(y + height, imgHeight);
    
    for (let py = y; py < maxY; py += step) {
      for (let px = x; px < maxX; px += step) {
        if (px >= 0 && py >= 0) {
          const idx = (py * imgWidth + px) * 4;
          
          // Validate index bounds
          if (idx + 2 >= data.length) continue;
          
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          
          // Calculate brightness
          const brightness = (r + g + b) / 3;
          
          // Optimized edge detection - only check if we have enough pixels
          if (px > 0 && py > 0 && px < imgWidth - 1 && py < imgHeight - 1) {
            const leftIdx = (py * imgWidth + (px - 1)) * 4;
            const topIdx = ((py - 1) * imgWidth + px) * 4;
            
            // Validate edge detection indices
            if (leftIdx + 2 < data.length && topIdx + 2 < data.length) {
              const leftBrightness = (data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2]) / 3;
              const topBrightness = (data[topIdx] + data[topIdx + 1] + data[topIdx + 2]) / 3;
              
              const edgeStrength = Math.abs(brightness - leftBrightness) + Math.abs(brightness - topBrightness);
              if (edgeStrength > 25) { // Slightly lower threshold for better detection
                edgeCount++;
              }
            }
          }
          
          contrastSum += brightness;
          pixelCount++;
        }
      }
    }
    
    if (pixelCount === 0) return 0;
    
    // Calculate scores
    const avgContrast = contrastSum / pixelCount;
    const edgeDensity = edgeCount / pixelCount;
    const aspectRatio = width / height;
    
    // Optimized scoring
    const aspectScore = aspectRatio > 0.6 && aspectRatio < 1.8 ? 1 : 0.6;
    const contrastScore = avgContrast > 60 && avgContrast < 180 ? 1 : 0.4;
    const edgeScore = Math.min(edgeDensity * 8, 1);
    
    return (contrastScore * 0.4 + edgeScore * 0.4 + aspectScore * 0.2);
  }, []);

  // Handle mouse events for manual crop and resize
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Check if clicking inside crop area for moving
    const currentCrop = cropArea;
    if (x >= currentCrop.x && x <= currentCrop.x + currentCrop.width &&
        y >= currentCrop.y && y <= currentCrop.y + currentCrop.height) {
      setIsDragging(true);
      setDragStart({ x: x - currentCrop.x, y: y - currentCrop.y });
      return;
    }
    
    // Start new crop selection
    setIsDragging(true);
    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  };

  // Optimized mouse move with throttling for better performance
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    // Throttle mouse move events for better performance
    const now = Date.now();
    if (now - lastMouseMoveRef.current < 16) { // ~60fps
      return;
    }
    lastMouseMoveRef.current = now;
    
    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      const scaleX = imageRef.current.naturalWidth / rect.width;
      const scaleY = imageRef.current.naturalHeight / rect.height;
      
      const currentX = (e.clientX - rect.left) * scaleX;
      const currentY = (e.clientY - rect.top) * scaleY;
      
      if (isResizing && dragHandle) {
        // Handle resize with optimized calculations
        const newCrop = { ...cropArea };
        
        switch (dragHandle) {
          case 'nw':
            newCrop.width = cropArea.width + (cropArea.x - currentX);
            newCrop.height = cropArea.height + (cropArea.y - currentY);
            newCrop.x = Math.max(0, currentX);
            newCrop.y = Math.max(0, currentY);
            break;
          case 'ne':
            newCrop.width = currentX - cropArea.x;
            newCrop.height = cropArea.height + (cropArea.y - currentY);
            newCrop.y = Math.max(0, currentY);
            break;
          case 'sw':
            newCrop.width = cropArea.width + (cropArea.x - currentX);
            newCrop.height = currentY - cropArea.y;
            newCrop.x = Math.max(0, currentX);
            break;
          case 'se':
            newCrop.width = currentX - cropArea.x;
            newCrop.height = currentY - cropArea.y;
            break;
        }
        
        // Ensure minimum size and bounds
        newCrop.width = Math.max(50, Math.min(newCrop.width, imageRef.current.naturalWidth - newCrop.x));
        newCrop.height = Math.max(50, Math.min(newCrop.height, imageRef.current.naturalHeight - newCrop.y));
        
        setCropArea(newCrop);
      } else if (isDragging) {
        if (cropArea.width === 0 && cropArea.height === 0) {
          // Creating new crop area
          const width = Math.abs(currentX - dragStart.x);
          const height = Math.abs(currentY - dragStart.y);
          const x = Math.min(dragStart.x, currentX);
          const y = Math.min(dragStart.y, currentY);
          
          setCropArea({ 
            x: Math.max(0, x), 
            y: Math.max(0, y), 
            width: Math.min(width, imageRef.current.naturalWidth - x), 
            height: Math.min(height, imageRef.current.naturalHeight - y) 
          });
        } else {
          // Moving existing crop area
          const newX = currentX - dragStart.x;
          const newY = currentY - dragStart.y;
          
          setCropArea({
            x: Math.max(0, Math.min(newX, imageRef.current.naturalWidth - cropArea.width)),
            y: Math.max(0, Math.min(newY, imageRef.current.naturalHeight - cropArea.height)),
            width: cropArea.width,
            height: cropArea.height
          });
        }
      }
    });
  }, [isResizing, dragHandle, isDragging, cropArea, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragHandle(null);
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);


  // Compress and crop image
  const compressAndCropImage = useCallback(async (imageData: string, crop: CropArea): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Set canvas size to crop area
        canvas.width = crop.width;
        canvas.height = crop.height;
        
        // Draw cropped image
        ctx.drawImage(
          img,
          crop.x, crop.y, crop.width, crop.height,
          0, 0, crop.width, crop.height
        );
        
        // Compress to target size (500KB max)
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Reduce quality until under 500KB
        while (dataUrl.length > 500 * 1024 * 0.75 && quality > 0.1) { // 0.75 factor for base64 overhead
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        // Convert to File
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const file = new File([ab], 'captured-image.jpg', { type: mimeString });
        resolve(file);
      };
      img.src = imageData;
    });
  }, []);

  // Save cropped image
  const saveCroppedImage = useCallback(async () => {
    if (capturedImage && cropArea.width > 0 && cropArea.height > 0) {
      try {
        const file = await compressAndCropImage(capturedImage, cropArea);
        onImageCapture(file);
        onClose();
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Gagal memproses gambar');
      }
    }
  }, [capturedImage, cropArea, compressAndCropImage, onImageCapture, onClose]);

  // Handle file upload as fallback
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        setShowCrop(true);
        setShowFallback(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Reset modal
  const resetModal = useCallback(() => {
    setCapturedImage(null);
    setShowCrop(false);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setShowFallback(false);
    stopCamera();
  }, [stopCamera]);

  // Close modal
  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  // Auto crop when image loads
  React.useEffect(() => {
    if (capturedImage && showCrop && imageRef.current) {
      const img = imageRef.current;
      
      // Wait for image to load completely
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        autoCrop();
      } else {
        // Wait for image load event
        const handleImageLoad = () => {
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            autoCrop();
          }
        };
        
        img.addEventListener('load', handleImageLoad);
        
        return () => {
          img.removeEventListener('load', handleImageLoad);
        };
      }
    }
  }, [capturedImage, showCrop, autoCrop]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {showCrop ? 'Crop & Edit Foto' : 'Ambil Foto dengan Kamera'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!showCrop ? (
            /* Camera View */
            <div className="space-y-4">
              {!showFallback ? (
                <>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-96 object-cover"
                    />
                    {!isCapturing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <button
                          onClick={startCamera}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Buka Kamera</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isCapturing && (
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={capturePhoto}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Ambil Foto</span>
                      </button>
                      <button
                        onClick={stopCamera}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                        <span>Tutup Kamera</span>
                      </button>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={() => setShowFallback(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Kamera tidak bisa diakses? Upload file dari galeri
                    </button>
                  </div>
                </>
              ) : (
                /* Fallback Upload */
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fallback-upload"
                    />
                    <label htmlFor="fallback-upload" className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Pilih foto dari galeri</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowFallback(false)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Kembali ke kamera
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Crop View */
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={capturedImage!}
                  alt="Captured"
                  className="w-full h-96 object-contain cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                
                {/* Optimized Crop overlay */}
                {cropArea.width > 0 && cropArea.height > 0 && imageRef.current && (
                  <>
                    {/* Dark overlay outside crop area */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none">
                      <div
                        className="absolute bg-transparent"
                        style={cropAreaStyle}
                      />
                    </div>
                    
                    {/* Crop area border */}
                    <div
                      className="absolute border-2 border-blue-500 bg-transparent cursor-move"
                      style={cropAreaStyle}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        if (!isResizing) {
                          setIsDragging(true);
                          const rect = imageRef.current?.getBoundingClientRect();
                          if (rect) {
                            const scaleX = imageRef.current?.naturalWidth! / rect.width;
                            const scaleY = imageRef.current?.naturalHeight! / rect.height;
                            const x = (e.clientX - rect.left) * scaleX;
                            const y = (e.clientY - rect.top) * scaleY;
                            setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
                          }
                        }
                      }}
                    >
                      {/* Corner handles */}
                      <div 
                        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize hover:bg-blue-600 transition-colors z-10"
                        style={{ left: '-8px', top: '-8px' }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDragHandle('nw');
                          setIsResizing(true);
                        }}
                      ></div>
                      <div 
                        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize hover:bg-blue-600 transition-colors z-10"
                        style={{ right: '-8px', top: '-8px' }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDragHandle('ne');
                          setIsResizing(true);
                        }}
                      ></div>
                      <div 
                        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize hover:bg-blue-600 transition-colors z-10"
                        style={{ left: '-8px', bottom: '-8px' }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDragHandle('sw');
                          setIsResizing(true);
                        }}
                      ></div>
                      <div 
                        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize hover:bg-blue-600 transition-colors z-10"
                        style={{ right: '-8px', bottom: '-8px' }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDragHandle('se');
                          setIsResizing(true);
                        }}
                      ></div>
                      
                      {/* Center handle for moving */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 border border-white rounded-full opacity-50"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>


              <div className="flex justify-center space-x-4">
                <button
                  onClick={autoCrop}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  <Crop className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Auto Crop'}</span>
                </button>
                <button
                  onClick={resetModal}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ambil Ulang</span>
                </button>
                <button
                  onClick={saveCroppedImage}
                  disabled={cropArea.width === 0 || cropArea.height === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Foto</span>
                </button>
              </div>

              <div className="text-sm text-gray-600 text-center">
                <p>• <strong>Auto Crop:</strong> Otomatis mendeteksi objek buku dalam foto</p>
                <p>• <strong>Manual Crop:</strong> Drag untuk memilih area, tarik lingkaran biru untuk resize</p>
                <p>• <strong>Move Crop:</strong> Klik dan drag di dalam area crop untuk memindahkan</p>
                <p>• Foto akan dikompres otomatis menjadi HD dengan ukuran maksimal 500KB</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default CameraUploadModal;
