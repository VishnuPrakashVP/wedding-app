import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { albumsAPI } from '../services/api';
import { Camera, Music, Palette, Calendar, Save, ArrowLeft } from 'lucide-react';

const CreateAlbum = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    music_url: '',
    cover_photo: '',
    is_public: true,
    expires_at: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const albumData = {
        ...formData,
        host_id: user._id || user.id, // Handle both _id and id fields
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      };

      const response = await albumsAPI.create(albumData);
      
      alert('Album created successfully!');
      navigate(`/albums/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
        <p className="text-gray-600">You need to be logged in to create an album.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/albums')}
          className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Albums</span>
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Create New Album</h1>
        <p className="text-gray-600">Set up your wedding album and start sharing memories</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-6">
            {/* Album Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Album Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter album title..."
              />
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="h-4 w-4 inline mr-2" />
                Theme
              </label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a theme</option>
                <option value="romantic">Romantic</option>
                <option value="elegant">Elegant</option>
                <option value="rustic">Rustic</option>
                <option value="modern">Modern</option>
                <option value="vintage">Vintage</option>
                <option value="tropical">Tropical</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>

            {/* Music URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Music className="h-4 w-4 inline mr-2" />
                Background Music URL
              </label>
              <input
                type="url"
                name="music_url"
                value={formData.music_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="https://example.com/music.mp3"
              />
            </div>

            {/* Cover Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Camera className="h-4 w-4 inline mr-2" />
                Cover Photo URL
              </label>
              <input
                type="url"
                name="cover_photo"
                value={formData.cover_photo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="https://example.com/cover-photo.jpg"
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Album Expiration Date
              </label>
              <input
                type="date"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty for no expiration
              </p>
            </div>

            {/* Public/Private Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Make album public (visible to all guests)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/albums')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-5 w-5" />
                <span>Create Album</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlbum;