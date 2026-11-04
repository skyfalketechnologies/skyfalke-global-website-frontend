'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import { adminApiGet, adminApiPost, adminApiPut } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const PayrollForm = () => {
  const { isSuperAdmin } = useAuth();
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState({
    employee: '',
    period: {
      startDate: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
      endDate: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0],
      month: currentMonth,
      year: currentYear
    },
    items: [],
    currency: 'KES',
    status: 'draft',
    paymentMethod: 'bank',
    paymentDate: '',
    paymentReference: '',
    notes: ''
  });

  const [newItem, setNewItem] = useState({
    type: 'earning',
    name: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    if (!isSuperAdmin()) {
      alert('Access denied. Super admin role required to access HR Management.');
      router.push('/system/dashboard');
      return;
    }
    if (isEditing) {
      fetchPayroll();
    }
    fetchEmployees();
  }, [id, isSuperAdmin, navigate, isEditing]);


  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const response = await adminApiGet(`/api/hr/payrolls/${id}`);
      if (response.success && response.data) {
        const payroll = response.data.data;
        setFormData({
          employee: payroll.employee?._id || payroll.employee || '',
          period: {
            startDate: payroll.period?.startDate ? new Date(payroll.period.startDate).toISOString().split('T')[0] : formData.period.startDate,
            endDate: payroll.period?.endDate ? new Date(payroll.period.endDate).toISOString().split('T')[0] : formData.period.endDate,
            month: payroll.period?.month || currentMonth,
            year: payroll.period?.year || currentYear
          },
          items: payroll.items || [],
          currency: payroll.currency || 'KES',
          status: payroll.status || 'draft',
          paymentMethod: payroll.paymentMethod || 'bank',
          paymentDate: payroll.paymentDate ? new Date(payroll.paymentDate).toISOString().split('T')[0] : '',
          paymentReference: payroll.paymentReference || '',
          notes: payroll.notes || ''
        });
        if (payroll.employee?._id) {
          const empResponse = await adminApiGet(`/api/hr/employees/${payroll.employee._id}`);
          if (empResponse.success) {
            setSelectedEmployee(empResponse.data.data);
          }
        }
      }
    } catch (err) {
      setError('Failed to fetch payroll details');
      console.error('Error fetching payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await adminApiGet('/api/hr/employees?status=active&limit=100');
      if (response.success && response.data) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleEmployeeChange = async (employeeId) => {
    setFormData(prev => ({ ...prev, employee: employeeId }));
    if (employeeId) {
      try {
        const response = await adminApiGet(`/api/hr/employees/${employeeId}`);
        if (response.success && response.data) {
          setSelectedEmployee(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching employee:', err);
      }
    } else {
      setSelectedEmployee(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');
    
    if (path.length === 2) {
      setFormData(prev => ({
        ...prev,
        [path[0]]: {
          ...prev[path[0]],
          [path[1]]: path[1] === 'month' || path[1] === 'year' ? parseInt(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPayrollItem = (item = null) => {
    const itemToAdd = item || newItem;
    if (itemToAdd.name && itemToAdd.amount) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          type: itemToAdd.type,
          name: itemToAdd.name,
          amount: parseFloat(itemToAdd.amount) || 0,
          description: itemToAdd.description || ''
        }]
      }));
      if (!item) {
        setNewItem({
          type: 'earning',
          name: '',
          amount: '',
          description: ''
        });
      }
    }
  };

  const removePayrollItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updatePeriodFromDates = () => {
    const startDate = new Date(formData.period.startDate);
    const endDate = new Date(formData.period.endDate);
    setFormData(prev => ({
      ...prev,
      period: {
        ...prev.period,
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear()
      }
    }));
  };

  const calculateTotals = () => {
    const earnings = formData.items
      .filter(item => item.type === 'earning')
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const deductions = formData.items
      .filter(item => item.type === 'deduction')
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    return {
      grossSalary: earnings,
      totalDeductions: deductions,
      netSalary: earnings - deductions
    };
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.employee) errors.push('Employee is required');
    if (!formData.period.startDate) errors.push('Start date is required');
    if (!formData.period.endDate) errors.push('End date is required');
    if (formData.items.length === 0) errors.push('At least one payroll item is required');
    if (new Date(formData.period.startDate) > new Date(formData.period.endDate)) {
      errors.push('Start date must be before end date');
    }

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
      const totals = calculateTotals();
      const submitData = {
        employee: formData.employee,
        period: {
          startDate: new Date(formData.period.startDate),
          endDate: new Date(formData.period.endDate),
          month: formData.period.month,
          year: formData.period.year
        },
        items: formData.items,
        grossSalary: totals.grossSalary,
        totalDeductions: totals.totalDeductions,
        netSalary: totals.netSalary,
        currency: formData.currency,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : undefined,
        paymentReference: formData.paymentReference || undefined,
        notes: formData.notes || undefined
      };

      let response;
      if (isEditing) {
        response = await adminApiPut(`/api/hr/payrolls/${id}`, submitData);
      } else {
        response = await adminApiPost('/api/hr/payrolls', submitData);
      }

      if (response.success) {
        setSuccess(isEditing ? 'Payroll updated successfully' : 'Payroll created successfully');
        setTimeout(() => {
          router.push('/system/dashboard/hr/payrolls');
        }, 1500);
      } else {
        setError(response.error?.message || 'Failed to save payroll');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Error saving payroll:', err);
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Payroll' : 'Create New Payroll'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Update payroll information' : 'Create a new payroll record'}
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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee *
            </label>
            <select
              name="employee"
              value={formData.employee}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.personalInfo?.firstName} {emp.personalInfo?.lastName} - {emp.employeeId}
                </option>
              ))}
            </select>
            {selectedEmployee && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Department: {selectedEmployee.employmentInfo?.department} | 
                Salary: {selectedEmployee.employmentInfo?.currency} {selectedEmployee.employmentInfo?.salary?.toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Period */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Pay Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="period.startDate"
                value={formData.period.startDate}
                onChange={(e) => {
                  handleInputChange(e);
                  setTimeout(updatePeriodFromDates, 100);
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="period.endDate"
                value={formData.period.endDate}
                onChange={(e) => {
                  handleInputChange(e);
                  setTimeout(updatePeriodFromDates, 100);
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Month
              </label>
              <input
                type="number"
                name="period.month"
                value={formData.period.month}
                onChange={handleInputChange}
                min="1"
                max="12"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year
              </label>
              <input
                type="number"
                name="period.year"
                value={formData.period.year}
                onChange={handleInputChange}
                min="2020"
                max="2100"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Payroll Items */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Payroll Items</h3>
          
          {/* Add New Item */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={newItem.type}
                  onChange={handleItemInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                >
                  <option value="earning">Earning</option>
                  <option value="deduction">Deduction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleItemInputChange}
                  placeholder="e.g., Base Salary, Tax"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newItem.amount}
                  onChange={handleItemInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newItem.description}
                  onChange={handleItemInputChange}
                  placeholder="Optional"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => addPayrollItem()}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <FaPlus className="inline mr-2" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {formData.items.length > 0 ? (
              <>
                <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-700 dark:text-gray-300 pb-2 border-b">
                  <div className="col-span-1">Type</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Action</div>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.type === 'earning'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="col-span-3 text-sm">{item.name}</div>
                    <div className="col-span-2 text-sm font-medium">
                      {formData.currency} {parseFloat(item.amount || 0).toLocaleString()}
                    </div>
                    <div className="col-span-4 text-sm text-gray-500 dark:text-gray-400">{item.description || '-'}</div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => removePayrollItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No payroll items added yet. Add earnings and deductions above.
              </p>
            )}
          </div>
        </div>

        {/* Totals Summary */}
        {formData.items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Summary</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Gross Salary:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formData.currency} {totals.grossSalary.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Total Deductions:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {formData.currency} {totals.totalDeductions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="font-bold text-gray-900 dark:text-gray-100">Net Salary:</span>
                <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                  {formData.currency} {totals.netSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              >
                <option value="bank">Bank</option>
                <option value="mpesa">M-Pesa</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Reference
              </label>
              <input
                type="text"
                name="paymentReference"
                value={formData.paymentReference}
                onChange={handleInputChange}
                placeholder="Transaction ID, Check #, etc."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
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
            onClick={() => router.push('/system/dashboard/hr/payrolls')}
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
            {saving ? 'Saving...' : isEditing ? 'Update Payroll' : 'Create Payroll'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollForm;

