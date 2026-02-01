'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AcademyTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/academy/trainers');
      const data = await response.json();
      setTrainers(data.trainers || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        const response = await fetch(`/api/academy/trainers/${trainerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setTrainers(trainers.filter(trainer => trainer._id !== trainerId));
        } else {
          alert('Failed to delete trainer');
        }
      } catch (error) {
        console.error('Error deleting trainer:', error);
        alert('Error deleting trainer');
      }
    }
  };

  const handleToggleStatus = async (trainerId, currentStatus) => {
    try {
      const response = await fetch(`/api/academy/trainers/${trainerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setTrainers(trainers.map(trainer => 
          trainer._id === trainerId 
            ? { ...trainer, isActive: !currentStatus }
            : trainer
        ));
      } else {
        alert('Failed to update trainer status');
      }
    } catch (error) {
      console.error('Error updating trainer:', error);
      alert('Error updating trainer');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#303661] mb-2">Manage Trainers</h1>
          <p className="text-gray-600">Add, edit, and manage academy trainers</p>
        </div>
        <Link href="/system/dashboard/academy/trainers/new"
          className="inline-flex items-center px-6 py-3 bg-[#e0ae00] hover:bg-[#d4a000] text-[#303661] font-semibold rounded-lg transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Trainer
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expertise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No trainers found. <Link href="/system/dashboard/academy/trainers/new" className="text-[#e0ae00] hover:underline">Add your first trainer</Link>
                  </td>
                </tr>
              ) : (
                trainers.map((trainer) => (
                  <tr key={trainer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {trainer.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={trainer.avatar} alt={trainer.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#e0ae00] flex items-center justify-center">
                              <span className="text-[#303661] font-semibold text-sm">
                                {trainer.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{trainer.name}</div>
                          <div className="text-sm text-gray-500">{trainer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {trainer.expertise.slice(0, 2).join(', ')}
                        {trainer.expertise.length > 2 && (
                          <span className="text-gray-500"> +{trainer.expertise.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trainer.experience} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(trainer.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {trainer.rating.toFixed(1)} ({trainer.reviewCount} reviews)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(trainer._id, trainer.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trainer.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {trainer.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/system/dashboard/academy/trainers/${trainer._id}/edit`}
                          className="text-[#e0ae00] hover:text-[#d4a000]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteTrainer(trainer._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AcademyTrainers;

