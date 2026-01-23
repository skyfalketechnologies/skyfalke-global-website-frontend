'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const TrainerForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    shortBio: '',
    avatar: '',
    expertise: [''],
    experience: '',
    education: [{ degree: '', institution: '', year: '' }],
    certifications: [{ name: '', issuer: '', date: '', expiry: '' }],
    workExperience: [{ company: '', position: '', duration: '', description: '' }],
    linkedin: '',
    twitter: '',
    website: '',
    languages: [{ language: '', proficiency: 'Intermediate' }],
    hourlyRate: '',
    availability: 'Available',
    timezone: 'UTC',
    isActive: true,
    isVerified: false
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchTrainer();
    }
  }, [isEdit, id]);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/academy/trainers/${id}`);
      const data = await response.json();
      
      if (data.trainer) {
        setFormData({
          ...data.trainer,
          education: data.trainer.education && data.trainer.education.length > 0 ? data.trainer.education : [{ degree: '', institution: '', year: '' }],
          certifications: data.trainer.certifications && data.trainer.certifications.length > 0 ? data.trainer.certifications : [{ name: '', issuer: '', date: '', expiry: '' }],
          workExperience: data.trainer.workExperience && data.trainer.workExperience.length > 0 ? data.trainer.workExperience : [{ company: '', position: '', duration: '', description: '' }],
          languages: data.trainer.languages && data.trainer.languages.length > 0 ? data.trainer.languages : [{ language: '', proficiency: 'Intermediate' }],
          expertise: data.trainer.expertise && data.trainer.expertise.length > 0 ? data.trainer.expertise : ['']
        });
      }
    } catch (error) {
      console.error('Error fetching trainer:', error);
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

  const handleArrayChange = (field, index, subField, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][subField] = value;
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayItem = (field, defaultItem) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], defaultItem] }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const updatedArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: updatedArray }));
    }
  };

  const handleSimpleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const addSimpleArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeSimpleArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const updatedArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: updatedArray }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEdit ? `/api/academy/trainers/${id}` : '/api/academy/trainers';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          expertise: formData.expertise.filter(item => item.trim() !== ''),
          education: formData.education.filter(edu => edu.degree.trim() !== ''),
          certifications: formData.certifications.filter(cert => cert.name.trim() !== ''),
          workExperience: formData.workExperience.filter(work => work.company.trim() !== ''),
          languages: formData.languages.filter(lang => lang.language.trim() !== '')
        })
      });

      if (response.ok) {
        router.push('/system/dashboard/academy/trainers');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save trainer');
      }
    } catch (error) {
      console.error('Error saving trainer:', error);
      alert('Error saving trainer');
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
          {isEdit ? 'Edit Trainer' : 'Add New Trainer'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update trainer information' : 'Create a new academy trainer profile'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#303661] mb-4">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio *</label>
              <textarea
                name="shortBio"
                value={formData.shortBio}
                onChange={handleInputChange}
                required
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.shortBio.length}/200 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Bio *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#303661] mb-4">Professional Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Areas of Expertise</h3>
            <button
              type="button"
              onClick={() => addSimpleArrayItem('expertise')}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Expertise
            </button>
          </div>

          {formData.expertise.map((expertise, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={expertise}
                onChange={(e) => handleSimpleArrayChange('expertise', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                placeholder="e.g., JavaScript, React, Node.js"
              />
              {formData.expertise.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSimpleArrayItem('expertise', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Education</h3>
            <button
              type="button"
              onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Education
            </button>
          </div>

          {formData.education.map((edu, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-[#303661]">Education {index + 1}</h4>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('education', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={edu.year}
                    onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Certifications</h3>
            <button
              type="button"
              onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '', expiry: '' })}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Certification
            </button>
          </div>

          {formData.certifications.map((cert, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-[#303661]">Certification {index + 1}</h4>
                {formData.certifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('certifications', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={cert.date}
                    onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={cert.expiry}
                    onChange={(e) => handleArrayChange('certifications', index, 'expiry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Work Experience */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Work Experience</h3>
            <button
              type="button"
              onClick={() => addArrayItem('workExperience', { company: '', position: '', duration: '', description: '' })}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Experience
            </button>
          </div>

          {formData.workExperience.map((work, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-[#303661]">Experience {index + 1}</h4>
                {formData.workExperience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('workExperience', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={work.company}
                    onChange={(e) => handleArrayChange('workExperience', index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={work.position}
                    onChange={(e) => handleArrayChange('workExperience', index, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={work.duration}
                    onChange={(e) => handleArrayChange('workExperience', index, 'duration', e.target.value)}
                    placeholder="e.g., 2 years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={work.description}
                    onChange={(e) => handleArrayChange('workExperience', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#303661]">Languages</h3>
            <button
              type="button"
              onClick={() => addArrayItem('languages', { language: '', proficiency: 'Intermediate' })}
              className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
            >
              Add Language
            </button>
          </div>

          {formData.languages.map((lang, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-[#303661]">Language {index + 1}</h4>
                {formData.languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('languages', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) => handleArrayChange('languages', index, 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => handleArrayChange('languages', index, 'proficiency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#303661] mb-4">Trainer Settings</h3>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active Trainer</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Verified Trainer</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/academy/trainers')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#e0ae00] text-[#303661] font-semibold rounded-md hover:bg-[#d4a000] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : (isEdit ? 'Update Trainer' : 'Create Trainer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerForm;

