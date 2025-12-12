import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuotationList from '../components/Admin/QuotationList';
import QuotationForm from '../components/Admin/QuotationForm';
import QuotationView from '../components/Admin/QuotationView';
import QuotationStats from '../components/Admin/QuotationStats';

const QuotationsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<QuotationList />} />
      <Route path="/stats" element={<QuotationStats />} />
      <Route path="/new" element={<QuotationForm />} />
      <Route path="/:id" element={<QuotationView />} />
      <Route path="/:id/edit" element={<QuotationForm />} />
    </Routes>
  );
};

export default QuotationsPage;
