import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, File, X, CheckCircle } from 'lucide-react';
import { uploadAudio } from '../lib/api';
import { formatFileSize } from '../lib/utils';
import type { UploadProgress } from '../lib/types';

/**
 * Upload page with drag & drop functionality
 */
export const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: 'idle',
    progress: 0,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/wav', 'audio/x-m4a'];
  const MAX_SIZE = 1024 * 1024 * 1024; // 1GB
  // const MAX_DURATION = 120 * 60; // 120分 - 将来使用予定

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        message: 'サポートされていないファイル形式です。mp3, m4a, wavファイルをアップロードしてください。',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        message: 'ファイルサイズが大きすぎます。1GB以下のファイルをアップロードしてください。',
      });
      return;
    }

    setFile(file);
    setUploadProgress({ status: 'idle', progress: 0 });
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadProgress({ status: 'uploading', progress: 0 });

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev.progress >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, progress: prev.progress + 10 };
      });
    }, 300);

    try {
      // 将来: ここでGoogle Drive署名URLを取得してResumable Uploadを実行
      const response = await uploadAudio(file);
      
      clearInterval(progressInterval);
      setUploadProgress({ status: 'processing', progress: 100, message: '文字起こし中...' });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (response.ok) {
        setUploadProgress({ status: 'completed', progress: 100, message: 'アップロード完了！' });
        
        // Navigate to meeting detail page after short delay
        setTimeout(() => {
          navigate(`/meetings/${response.meetingId}`);
        }, 1000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress({
        status: 'error',
        progress: 0,
        message: 'アップロードに失敗しました。もう一度お試しください。',
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress({ status: 'idle', progress: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">音声ファイルをアップロード</h1>
        <p className="text-gray-600">会議の録音ファイルをアップロードして、文字起こしと要約を生成します</p>
      </div>

      {!file ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive ? 'border-accent-500 bg-accent-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.m4a,.wav"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          
          <p className="text-lg font-medium text-gray-900 mb-2">
            ファイルをドラッグ&ドロップ
          </p>
          <p className="text-sm text-gray-500 mb-4">または</p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            ファイルを選択
          </button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>対応形式: mp3, m4a, wav</p>
            <p>最大サイズ: 1GB / 最大120分</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <File className="w-8 h-8 text-accent-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            
            {uploadProgress.status === 'idle' && (
              <button
                onClick={removeFile}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {uploadProgress.status !== 'idle' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {uploadProgress.status === 'uploading' && 'アップロード中...'}
                  {uploadProgress.status === 'processing' && '文字起こし中...'}
                  {uploadProgress.status === 'completed' && 'アップロード完了！'}
                  {uploadProgress.status === 'error' && 'エラー'}
                </span>
                <span className="text-sm text-gray-600">{uploadProgress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    uploadProgress.status === 'error' ? 'bg-red-500' : 'bg-accent-600'
                  }`}
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            </div>
          )}

          {uploadProgress.message && (
            <p className={`text-sm mb-4 ${
              uploadProgress.status === 'error' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {uploadProgress.message}
            </p>
          )}

          {uploadProgress.status === 'idle' && (
            <button
              onClick={handleUpload}
              className="w-full btn-primary"
            >
              アップロード開始
            </button>
          )}

          {uploadProgress.status === 'completed' && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">アップロード完了</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};