import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { 
  Users, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  BarChart3,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [flaggedMedia, setFlaggedMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, flaggedResponse] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getFlaggedMedia()
      ]);
      
      setDashboardData(dashboardResponse.data);
      setFlaggedMedia(flaggedResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMedia = async (mediaId) => {
    try {
      await adminAPI.approveMedia(mediaId);
      setFlaggedMedia(prev => prev.filter(media => media.id !== mediaId));
      fetchDashboardData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error approving media:', err);
    }
  };

  const handleRejectMedia = async (mediaId) => {
    try {
      await adminAPI.rejectMedia(mediaId);
      setFlaggedMedia(prev => prev.filter(media => media.id !== mediaId));
      fetchDashboardData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error rejecting media:', err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your wedding app platform</p>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{dashboardData.total_users}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          
          <div className="card text-center">
            <Camera className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{dashboardData.total_media}</h3>
            <p className="text-gray-600">Total Media</p>
          </div>
          
          <div className="card text-center">
            <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{dashboardData.flagged_media}</h3>
            <p className="text-gray-600">Flagged Content</p>
          </div>
          
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{dashboardData.recent_uploads}</h3>
            <p className="text-gray-600">Recent Uploads</p>
          </div>
        </div>
      )}

      {/* Flagged Media Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Moderation</h2>
        
        {flaggedMedia.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">No flagged content to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedMedia.map((media) => (
              <div key={media.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={media.url}
                    alt={media.filename}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{media.filename}</h3>
                    <p className="text-sm text-gray-600">{media.caption}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(media.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveMedia(media.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectMedia(media.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="h-4 w-4 inline mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 