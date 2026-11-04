import React from 'react';
import { FaChartLine, FaEye, FaStar, FaShare } from 'react-icons/fa';

const BlogStats = ({ stats }) => {
  if (!stats) return null;

  const { overview, categoryStats, recentBlogs } = stats;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blog Statistics</h3>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-4 rounded-lg">
          <div className="flex items-center">
            <FaChartLine className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Blogs</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{overview.totalBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 p-4 rounded-lg">
          <div className="flex items-center">
            <FaEye className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Published</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{overview.publishedBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 p-4 rounded-lg">
          <div className="flex items-center">
            <FaStar className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Views</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{overview.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 p-4 rounded-lg">
          <div className="flex items-center">
            <FaShare className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Shares</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{overview.totalShares}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      {categoryStats && categoryStats.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Posts by Category</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryStats.slice(0, 6).map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">{stat._id}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stat.count} posts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Blogs */}
      {recentBlogs && recentBlogs.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Recent Posts</h4>
          <div className="space-y-2">
            {recentBlogs.slice(0, 3).map((blog) => (
              <div key={blog._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{blog.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{blog.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogStats;
