'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const CourseForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    image: '',
    price: '',
    originalPrice: '',
    category: 'ICT',
    level: 'Beginner',
    duration: '',
    durationHours: '',
    difficulty: 'Easy',
    syllabus: [{ week: 1, title: '', topics: [''], duration: '' }],
    prerequisites: [''],
    learningOutcomes: [''],
    trainer: '',
    isActive: true,
    isFeatured: false,
    tags: [''],
    startDate: '',
    endDate: '',
    maxStudents: 50,
    certificate: true
  });

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTrainers();
    if (isEdit) {
      fetchCourse();
    }
  }, [isEdit, id]);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/academy/trainers');
      const data = await response.json();
      setTrainers(data.trainers || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/academy/courses/${id}`);
      const data = await response.json();
      
      if (data.course) {
        setFormData({
          ...data.course,
          startDate: data.course.startDate ? new Date(data.course.startDate).toISOString().split('T')[0] : '',
          endDate: data.course.endDate ? new Date(data.course.endDate).toISOString().split('T')[0] : '',
          syllabus: data.course.syllabus && data.course.syllabus.length > 0 ? data.course.syllabus : [{ week: 1, title: '', topics: [''], duration: '' }],
          prerequisites: data.course.prerequisites && data.course.prerequisites.length > 0 ? data.course.prerequisites : [''],
          learningOutcomes: data.course.learningOutcomes && data.course.learningOutcomes.length > 0 ? data.course.learningOutcomes : [''],
          tags: data.course.tags && data.course.tags.length > 0 ? data.course.tags : ['']
        });
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSyllabusChange = (index, field, value) => {
    const updatedSyllabus = [...formData.syllabus];
    if (field === 'topics') {
      updatedSyllabus[index][field] = value.split(',').map(topic => topic.trim());
    } else {
      updatedSyllabus[index][field] = value;
    }
    setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
  };

  const addSyllabusWeek = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { week: prev.syllabus.length + 1, title: '', topics: [''], duration: '' }]
    }));
  };

  const removeSyllabusWeek = (index) => {
    if (formData.syllabus.length > 1) {
      const updatedSyllabus = formData.syllabus.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const updatedArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: updatedArray }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEdit ? `/api/academy/courses/${id}` : '/api/academy/courses';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          durationHours: parseInt(formData.durationHours),
          maxStudents: parseInt(formData.maxStudents),
          syllabus: formData.syllabus.filter(week => week.title.trim() !== ''),
          prerequisites: formData.prerequisites.filter(item => item.trim() !== ''),
          learningOutcomes: formData.learningOutcomes.filter(item => item.trim() !== ''),
          tags: formData.tags.filter(tag => tag.trim() !== '')
        })
      });

      if (response.ok) {
        router.push('/system/dashboard/academy/courses');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-300 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#303661] mb-2">
          {isEdit ? 'Edit Course' : 'Add New Course'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update course information' : 'Create a new academy course'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#303661] mb-4">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                required
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.shortDescription.length}/200 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Image URL *</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trainer *</label>
              <select
                name="trainer"
                value={formData.trainer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              >
                <option value="">Select a trainer</option>
                {trainers.map(trainer => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#303661] mb-4">Course Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                >
                  <option value="ICT">ICT</option>
                  <option value="AI">AI</option>
                  <option value="Digital Transformation">Digital Transformation</option>
                  <option value="Cloud Innovation">Cloud Innovation</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Software Development">Software Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 4 weeks"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours) *</label>
                <input
                  type="number"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Syllabus */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Course Syllabus</h3>
            <button
              type="button"
              onClick={addSyllabusWeek}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Week
            </button>
          </div>

          {formData.syllabus.map((week, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-[#303661]">Week {week.week}</h4>
                {formData.syllabus.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSyllabusWeek(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={week.title}
                    onChange={(e) => handleSyllabusChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={week.duration}
                    onChange={(e) => handleSyllabusChange(index, 'duration', e.target.value)}
                    placeholder="e.g., 2 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topics (comma-separated)</label>
                  <input
                    type="text"
                    value={week.topics.join(', ')}
                    onChange={(e) => handleSyllabusChange(index, 'topics', e.target.value)}
                    placeholder="e.g., Introduction, Basics, Examples"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prerequisites */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Prerequisites</h3>
            <button
              type="button"
              onClick={() => addArrayItem('prerequisites')}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Prerequisite
            </button>
          </div>

          {formData.prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={prerequisite}
                onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
              {formData.prerequisites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('prerequisites', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Learning Outcomes */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Learning Outcomes</h3>
            <button
              type="button"
              onClick={() => addArrayItem('learningOutcomes')}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Outcome
            </button>
          </div>

          {formData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
              {formData.learningOutcomes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('learningOutcomes', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Tags</h3>
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Tag
            </button>
          </div>

          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#303661] mb-4">Course Settings</h3>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active Course</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Featured Course</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="certificate"
                checked={formData.certificate}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Issue Certificate</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/academy/courses')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#e0ae00] text-[#303661] font-semibold rounded-md hover:bg-[#d4a000] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : (isEdit ? 'Update Course' : 'Create Course')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
