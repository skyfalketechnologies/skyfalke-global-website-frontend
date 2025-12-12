import React, { useState, useEffect } from 'react';
import { 
  FaLink, 
  FaExternalLinkAlt, 
  FaCheck, 
  FaTimes, 
  FaLightbulb,
  FaArrowRight,
  FaSearch
} from 'react-icons/fa';

const InternalLinkingSuggestions = ({ 
  pageType, 
  content = '', 
  keywords = [], 
  onLinkSelect 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLinks, setSelectedLinks] = useState([]);

  useEffect(() => {
    generateSuggestions();
  }, [pageType, content, keywords]);

  useEffect(() => {
    filterSuggestions();
  }, [suggestions, searchTerm]);

  const generateSuggestions = () => {
    const { getInternalLinkingSuggestions, getKeywordBasedSuggestions } = require('../../utils/internalLinking');
    
    const pageSuggestions = getInternalLinkingSuggestions(pageType, content);
    const keywordSuggestions = getKeywordBasedSuggestions(keywords);
    
    const allSuggestions = [...pageSuggestions, ...keywordSuggestions];
    
    // Remove duplicates and prioritize by relevance
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.url === suggestion.url)
    );
    
    setSuggestions(uniqueSuggestions);
  };

  const filterSuggestions = () => {
    if (!searchTerm) {
      setFilteredSuggestions(suggestions);
      return;
    }
    
    const filtered = suggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (suggestion.context && suggestion.context.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredSuggestions(filtered);
  };

  const handleLinkSelect = (suggestion) => {
    const isSelected = selectedLinks.some(link => link.url === suggestion.url);
    
    if (isSelected) {
      setSelectedLinks(selectedLinks.filter(link => link.url !== suggestion.url));
    } else {
      setSelectedLinks([...selectedLinks, suggestion]);
    }
    
    if (onLinkSelect) {
      onLinkSelect(suggestion, !isSelected);
    }
  };

  const handleApplyLinks = () => {
    if (onLinkSelect) {
      selectedLinks.forEach(link => onLinkSelect(link, true));
    }
    setSelectedLinks([]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💡';
      default: return '🔗';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaLightbulb className="text-yellow-500 text-lg" />
          <h3 className="text-lg font-semibold text-gray-900">Internal Linking Suggestions</h3>
        </div>
        <div className="text-sm text-gray-500">
          {filteredSuggestions.length} suggestions
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search suggestions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaLink className="mx-auto text-4xl mb-2 text-gray-300" />
            <p>No suggestions found</p>
            <p className="text-sm">Try adjusting your search or content</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion, index) => {
            const isSelected = selectedLinks.some(link => link.url === suggestion.url);
            
            return (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleLinkSelect(suggestion)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {suggestion.text}
                      </span>
                      {suggestion.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                          {getPriorityIcon(suggestion.priority)} {suggestion.priority}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <FaExternalLinkAlt className="text-xs" />
                      <span className="font-mono">{suggestion.url}</span>
                    </div>
                    
                    {suggestion.context && (
                      <p className="text-sm text-gray-500 italic">
                        "{suggestion.context}"
                      </p>
                    )}
                    
                    {suggestion.keyword && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Keyword: {suggestion.keyword}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {isSelected ? (
                      <FaCheck className="text-blue-500 text-lg" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      {selectedLinks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedLinks.length} link{selectedLinks.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedLinks([])}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="inline mr-1" />
                Clear
              </button>
              <button
                onClick={handleApplyLinks}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaArrowRight className="inline mr-1" />
                Apply Links
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <FaLightbulb className="text-blue-500 text-sm mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tips for Internal Linking:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use descriptive anchor text that describes the linked page</li>
              <li>Link to relevant, high-value pages on your site</li>
              <li>Don't over-optimize - use links naturally in context</li>
              <li>Prioritize high-priority suggestions for better SEO impact</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalLinkingSuggestions;
