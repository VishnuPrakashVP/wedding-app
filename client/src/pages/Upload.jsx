import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Camera, Video, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { albumsAPI, mediaAPI } from '../services/api';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchAlbums = async () => {
    try {
      const response = await albumsAPI.getAll();
      setAlbums(response.data);
      if (response.data.length > 0) {
        setSelectedAlbum(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAlbums();
  }, [user, navigate]);

  

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });
    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedAlbum || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('album_id', selectedAlbum);
        formData.append('caption', '');

        await mediaAPI.upload(formData);

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Reset form
      setSelectedFiles([]);
      setUploadProgress(0);
      alert('Upload successful!');
      navigate(`/albums/${selectedAlbum}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Upload Memories</h1>
        <p className="text-gray-600">
          Share your precious wedding moments with friends and family
        </p>
      </div>

      <div className="card space-y-6">
        {/* Album Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Album
          </label>
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="input-field"
            disabled={albums.length === 0}
          >
            {albums.length === 0 ? (
              <option>No albums available</option>
            ) : (
              albums.map(album => (
                <option key={album._id} value={album._id}>
                  {album.title}
                </option>
              ))
            )}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Photos & Videos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Click to select files or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                Supports images and videos
              </p>
            </label>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith('image/') ? (
                      <Camera className="h-5 w-5 text-pink-500" />
                    ) : (
                      <Video className="h-5 w-5 text-purple-500" />
                    )}
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={uploading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <UploadIcon className="h-5 w-5" />
              <span>Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Upload; 