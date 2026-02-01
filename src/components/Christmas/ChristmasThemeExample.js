import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ChristmasThemeToggle from './ChristmasThemeToggle';
import FestiveButton from './FestiveButton';
import { FaTree, FaGift } from 'react-icons/fa';

/**
 * Example component demonstrating Christmas theme usage
 * This component shows how to:
 * 1. Access the theme context
 * 2. Conditionally apply styles
 * 3. Use the toggle button
 * 4. Use festive-styled components
 */
const ChristmasThemeExample = () => {
  const { isChristmasTheme } = useTheme();

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h2 className="heading-2 mb-6 flex items-center gap-2">
            {isChristmasTheme ? (
              <>
                <FaTree className="text-christmas-green" />
                <span>Christmas Theme Active</span>
              </>
            ) : (
              'Theme Example'
            )}
          </h2>
          
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-lg mb-2">Toggle Christmas Theme</h3>
                <p className="text-sm text-gray-600">
                  Click the button below to enable/disable the Christmas theme
                </p>
              </div>
              <ChristmasThemeToggle />
            </div>

            {/* Status Display */}
            <div className={`p-4 rounded-lg border-2 ${
              isChristmasTheme 
                ? 'bg-gradient-to-r from-green-50 to-red-50 border-christmas-green' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className="font-medium flex items-center gap-2">
                Current Theme: <span className="font-bold flex items-center gap-1">
                  {isChristmasTheme ? (
                    <>
                      <span>Christmas</span>
                      <FaTree className="text-christmas-green" />
                    </>
                  ) : (
                    'Default'
                  )}
                </span>
              </p>
              {isChristmasTheme && (
                <p className="text-sm mt-2 text-gray-600">
                  Enjoy the festive decorations and colors!
                </p>
              )}
            </div>

            {/* Example Buttons */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Example Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <FestiveButton onClick={() => alert('Button clicked!')}>
                  Festive Button
                </FestiveButton>
                <button className="btn-primary">
                  Standard Primary Button
                </button>
                <button className="btn-secondary">
                  Standard Secondary Button
                </button>
              </div>
            </div>

            {/* Conditional Content */}
            {isChristmasTheme && (
              <div className="p-6 bg-gradient-to-br from-green-100 to-red-100 rounded-lg border-2 border-christmas-gold">
                <h3 className="font-bold text-xl mb-2 text-christmas-red flex items-center gap-2">
                  <FaGift className="text-christmas-red" />
                  <span>Merry Christmas!</span>
                </h3>
                <p className="text-gray-700">
                  This content only appears when the Christmas theme is active.
                  Notice how the colors change subtly throughout the interface.
                </p>
              </div>
            )}

            {/* Usage Instructions */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg mb-2">How to Use</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Import <code className="bg-white px-1 rounded">useTheme</code> from <code className="bg-white px-1 rounded">contexts/ThemeContext</code></li>
                <li>Use <code className="bg-white px-1 rounded">isChristmasTheme</code> to conditionally apply styles</li>
                <li>Use <code className="bg-white px-1 rounded">toggleChristmasTheme</code> to toggle the theme</li>
                <li>Add <code className="bg-white px-1 rounded">.christmas</code> class selectors in CSS for theme-specific styles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChristmasThemeExample;

