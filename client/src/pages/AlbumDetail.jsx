import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Heart, Calendar, Users, Play } from 'lucide-react';
import { albumsAPI, mediaAPI } from '../services/api';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAlbumDetails();
  }, [id]);

  const fetchAlbumDetails = async () => {
    try {
      setLoading(true);
      const [albumResponse, mediaResponse] = await Promise.all([
        albumsAPI.getById(id),
        mediaAPI.getByAlbum(id)
      ]);
      setAlbum(albumResponse.data);
      setMedia(mediaResponse.data);
    } catch (err) {
      setError('Failed to load album details');
      console.error('Error fetching album details:', err);
    } finally {
      setLoading(false);
    }
  };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
//       </div>
//     );
//   }

  if (error || !album) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error || 'Album not found'}</p>
        <button onClick={fetchAlbumDetails} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Album Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{album.title}</h1>
            <p className="text-gray-600 text-lg">{album.theme || 'Beautiful Wedding'}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(album.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Public Album</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="text-gray-600">{media.length} memories</span>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {media.length === 0 ? (
        <div className="text-center py-20">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Photos Yet</h3>
          <p className="text-gray-500">Be the first to add memories to this album!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <div key={item._id} className="group relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {item.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption || 'Wedding memory'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
              </div>
              {item.caption && (
                <p className="mt-2 text-sm text-gray-600">{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumDetail; 