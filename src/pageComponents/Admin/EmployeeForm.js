'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { adminApiGet, adminApiPost, adminApiPut } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeForm = () => {
  const { isSuperAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kenya'
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    employmentInfo: {
      department: '',
      position: '',
      jobTitle: '',
      employmentType: 'full-time',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active',
      manager: '',
      salary: '',
      currency: 'KES'
    },
    skills: [],
    notes: ''
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchEmployee();
    }
    fetchEmployees();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await adminApiGet(`/api/hr/employees/${id}`);
      if (response.success && response.data) {
        const employee = response.data.data;
        setFormData({
          personalInfo: {
            firstName: employee.personalInfo?.firstName || '',
            lastName: employee.personalInfo?.lastName || '',
            email: employee.personalInfo?.email || '',
            phone: employee.personalInfo?.phone || '',
            dateOfBirth: employee.personalInfo?.dateOfBirth ? new Date(employee.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
            gender: employee.personalInfo?.gender || '',
            address: {
              street: employee.personalInfo?.address?.street || '',
              city: employee.personalInfo?.address?.city || '',
              state: employee.personalInfo?.address?.state || '',
              zipCode: employee.personalInfo?.address?.zipCode || '',
              country: employee.personalInfo?.address?.country || 'Kenya'
            },
            emergencyContact: {
              name: employee.personalInfo?.emergencyContact?.name || '',
              relationship: employee.personalInfo?.emergencyContact?.relationship || '',
              phone: employee.personalInfo?.emergencyContact?.phone || ''
            }
          },
          employmentInfo: {
            department: employee.employmentInfo?.department || '',
            position: employee.employmentInfo?.position || '',
            jobTitle: employee.employmentInfo?.jobTitle || '',
            employmentType: employee.employmentInfo?.employmentType || 'full-time',
            hireDate: employee.employmentInfo?.hireDate ? new Date(employee.employmentInfo.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: employee.employmentInfo?.status || 'active',
            manager: employee.employmentInfo?.manager?._id || '',
            salary: employee.employmentInfo?.salary || '',
            currency: employee.employmentInfo?.currency || 'KES'
          },
          skills: employee.skills || [],
          notes: employee.notes || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch employee details');
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await adminApiGet('/api/hr/employees?limit=100');
      if (response.success && response.data) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const path = name.split('.');
    
    if (path.length === 3) {
      setFormData(prev => ({
        ...prev,
        [path[0]]: {
          ...prev[path[0]],
          [path[1]]: {
            ...prev[path[0]][path[1]],
            [path[2]]: value
          }
        }
      }));
    } else if (path.length === 2) {
      setFormData(prev => ({
        ...prev,
        [path[0]]: {
          ...prev[path[0]],
          [path[1]]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.personalInfo.firstName.trim()) errors.push('First name is required');
    if (!formData.personalInfo.lastName.trim()) errors.push('Last name is required');
    if (!formData.personalInfo.email.trim()) errors.push('Email is required');
    if (!formData.personalInfo.phone.trim()) errors.push('Phone is required');
    if (!formData.personalInfo.dateOfBirth) errors.push('Date of birth is required');
    if (!formData.personalInfo.gender) errors.push('Gender is required');
    if (!formData.employmentInfo.department.trim()) errors.push('Department is required');
    if (!formData.employmentInfo.position.trim()) errors.push('Position is required');
    if (!formData.employmentInfo.jobTitle.trim()) errors.push('Job title is required');
    if (!formData.employmentInfo.salary) errors.push('Salary is required');
    if (!formData.employmentInfo.hireDate) errors.push('Hire date is required');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        ...formData,
        employmentInfo: {
          ...formData.employmentInfo,
          salary: parseFloat(formData.employmentInfo.salary),
          manager: formData.employmentInfo.manager || undefined
        },
        personalInfo: {
          ...formData.personalInfo,
          dateOfBirth: new Date(formData.personalInfo.dateOfBirth)
        }
      };

      let response;
      if (isEditing) {
        response = await adminApiPut(`/api/hr/employees/${id}`, submitData);
      } else {
        response = await adminApiPost('/api/hr/employees', submitData);
      }

      if (response.success) {
        setSuccess(isEditing ? 'Employee updated successfully' : 'Employee created successfully');
        setTimeout(() => {
          router.push('/system/dashboard/hr/employees');
        }, 1500);
      } else {
        setError(response.error?.message || 'Failed to save employee');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Error saving employee:', err);
    } finally {
      setSaving(false);
    }
  };

  // Check if user is super admin before allowing access
  useEffect(() => {
    if (!isSuperAdmin()) {
      alert('Access denied. Super admin role required to create or edit employees.');
      router.push('/system/dashboard/hr/employees');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Access Denied</p>
          <p className="text-gray-600 mt-2">Super admin role required to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Update employee information' : 'Create a new employee record'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="personalInfo.firstName"
                value={formData.personalInfo.firstName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="personalInfo.lastName"
                value={formData.personalInfo.lastName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="personalInfo.email"
                value={formData.personalInfo.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="personalInfo.phone"
                value={formData.personalInfo.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="personalInfo.dateOfBirth"
                value={formData.personalInfo.dateOfBirth}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender *
              </label>
              <select
                name="personalInfo.gender"
                value={formData.personalInfo.gender}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street
                </label>
                <input
                  type="text"
                  name="personalInfo.address.street"
                  value={formData.personalInfo.address.street}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="personalInfo.address.city"
                  value={formData.personalInfo.address.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="personalInfo.address.state"
                  value={formData.personalInfo.address.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="personalInfo.address.zipCode"
                  value={formData.personalInfo.address.zipCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="personalInfo.address.country"
                  value={formData.personalInfo.address.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="personalInfo.emergencyContact.name"
                  value={formData.personalInfo.emergencyContact.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  name="personalInfo.emergencyContact.relationship"
                  value={formData.personalInfo.emergencyContact.relationship}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="personalInfo.emergencyContact.phone"
                  value={formData.personalInfo.emergencyContact.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department *
              </label>
              <input
                type="text"
                name="employmentInfo.department"
                value={formData.employmentInfo.department}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position *
              </label>
              <input
                type="text"
                name="employmentInfo.position"
                value={formData.employmentInfo.position}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="employmentInfo.jobTitle"
                value={formData.employmentInfo.jobTitle}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employment Type *
              </label>
              <select
                name="employmentInfo.employmentType"
                value={formData.employmentInfo.employmentType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hire Date *
              </label>
              <input
                type="date"
                name="employmentInfo.hireDate"
                value={formData.employmentInfo.hireDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                name="employmentInfo.status"
                value={formData.employmentInfo.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              >
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="terminated">Terminated</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manager
              </label>
              <select
                name="employmentInfo.manager"
                value={formData.employmentInfo.manager}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              >
                <option value="">None</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.personalInfo?.firstName} {emp.personalInfo?.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary *
              </label>
              <div className="flex">
                <select
                  name="employmentInfo.currency"
                  value={formData.employmentInfo.currency}
                  onChange={handleInputChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
                <input
                  type="number"
                  name="employmentInfo.salary"
                  value={formData.employmentInfo.salary}
                  onChange={handleInputChange}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Skills</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill"
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/hr/employees')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaTimes className="inline mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? (
              <FaSpinner className="inline mr-2 animate-spin" />
            ) : (
              <FaSave className="inline mr-2" />
            )}
            {saving ? 'Saving...' : isEditing ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;

