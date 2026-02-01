'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Content = () => {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl"
      >
        Content Management
      </motion.h2>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Content management features coming soon...</p>
      </div>
    </div>
  );
};

export default Content;
