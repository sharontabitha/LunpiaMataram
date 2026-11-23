import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon, Link as LinkIcon } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';

interface ImageUploaderProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  label?: string;
  bucketName?: string;
  folderPath?: string;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  onUrlChange,
  label = 'Foto',
  bucketName = 'lunpia-images',
  folderPath = 'uploads',
  required = false
}) => {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(e.target.value);
    setPreviewUrl(e.target.value);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar (JPG, PNG, WEBP, dll).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5MB.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const client = getSupabaseClient();

    if (client) {
      // Upload to Supabase Storage
      try {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${folderPath}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data, error } = await client.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (error) {
          // Fallback: use base64 if storage bucket not configured
          console.warn('Supabase Storage error, using base64 fallback:', error.message);
          await convertToBase64AndSave(file);
        } else {
          // Get public URL
          const { data: urlData } = client.storage.from(bucketName).getPublicUrl(fileName);
          const publicUrl = urlData.publicUrl;
          onUrlChange(publicUrl);
          setPreviewUrl(publicUrl);
        }
      } catch (err) {
        console.warn('Upload failed, using base64 fallback:', err);
        await convertToBase64AndSave(file);
      }
    } else {
      // No Supabase: convert to base64 and store locally
      await convertToBase64AndSave(file);
    }

    setIsUploading(false);
  };

  const convertToBase64AndSave = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUrlChange(base64);
        setPreviewUrl(base64);
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleClear = () => {
    onUrlChange('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold text-gray-700 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Mode Toggle */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs font-medium w-fit">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
            mode === 'url' ? 'bg-[#143826] text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>URL</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
            mode === 'upload' ? 'bg-[#143826] text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Foto</span>
        </button>
      </div>

      {/* URL Input Mode */}
      {mode === 'url' && (
        <input
          type="url"
          value={currentUrl.startsWith('data:') ? '' : currentUrl}
          onChange={handleUrlChange}
          placeholder="https://contoh.com/foto.jpg"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
          required={required && !currentUrl}
        />
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!previewUrl || previewUrl === '' ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#143826] hover:bg-[#FAF7F0] transition-all cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-[#143826] animate-spin" />
                  <span className="text-xs text-gray-600">Mengunggah...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">Klik untuk pilih foto</span>
                  <span className="text-[11px] text-gray-400">JPG, PNG, WEBP · Maks 5MB</span>
                </>
              )}
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover"
                onError={() => setPreviewUrl('')}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow"
                >
                  Ganti Foto
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow"
                >
                  Hapus
                </button>
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#143826] animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preview (always shown if URL mode and URL is set) */}
      {mode === 'url' && previewUrl && !previewUrl.startsWith('data:') && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 h-24">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setPreviewUrl('')}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}

      {!getSupabaseClient() && mode === 'upload' && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg leading-relaxed">
          <strong>Supabase belum terhubung.</strong> Foto disimpan sebagai data lokal (base64). Hubungkan Supabase Storage untuk penyimpanan cloud permanen.
        </p>
      )}
    </div>
  );
};
