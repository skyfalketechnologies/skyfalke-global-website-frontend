/**
 * Logger utility that only logs in development mode
 * Prevents sensitive information from being logged in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      // Use a Set to track circular references
      const seen = new WeakSet();
      
      // Better error serialization for objects
      const serializedArgs = args.map(arg => {
        // Handle null or undefined
        if (arg === null || arg === undefined) {
          return arg;
        }
        
        // Handle Error instances
        if (arg instanceof Error) {
          const errorObj = {
            message: arg.message || 'No error message',
            name: arg.name || 'Error',
            ...(arg.stack && { stack: arg.stack }),
            ...(arg.code && { code: arg.code }),
            ...(arg.type && { type: arg.type }),
            ...(arg.config && {
              config: {
                url: arg.config.url,
                method: arg.config.method,
                baseURL: arg.config.baseURL
              }
            }),
            ...(arg.response && {
              response: {
                status: arg.response.status,
                statusText: arg.response.statusText,
                data: arg.response.data
              }
            })
          };
          return errorObj;
        }
        
        // Handle objects
        if (arg && typeof arg === 'object') {
          // Check if it's an empty object
          const keys = Object.keys(arg);
          if (keys.length === 0) {
            return '[Empty Object]';
          }
          
          try {
            // Create a new object to avoid modifying the original
            const result = {};
            let hasAnyValue = false;
            
            // Manually extract known properties
            for (const key of keys) {
              try {
                const value = arg[key];
                
                // Skip functions and undefined
                if (typeof value === 'function') {
                  result[key] = '[Function]';
                  hasAnyValue = true;
                  continue;
                }
                
                if (value === undefined) {
                  continue;
                }
                
                // Handle nested objects
              if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    result[key] = '[Circular]';
                    hasAnyValue = true;
                    continue;
                }
                seen.add(value);
                  
                  // Try to serialize nested object
                  try {
                    const nestedKeys = Object.keys(value);
                    if (nestedKeys.length > 0) {
                      result[key] = `[Object with keys: ${nestedKeys.slice(0, 5).join(', ')}]`;
                    } else {
                      result[key] = '[Empty Object]';
                    }
                    hasAnyValue = true;
                  } catch {
                    result[key] = String(value).substring(0, 100);
                    hasAnyValue = true;
                  }
                } else {
                  // Primitive values
                  result[key] = value;
                  hasAnyValue = true;
                }
              } catch (e) {
                result[key] = '[Error accessing property]';
                hasAnyValue = true;
              }
            }
            
            // If we have any values, return the result
            if (hasAnyValue) {
              return result;
            }
            
            // Fallback: try JSON.stringify
            const jsonStr = JSON.stringify(arg, (key, val) => {
              if (typeof val === 'function') return '[Function]';
              if (val === undefined) return null;
              if (typeof val === 'object' && val !== null) {
                if (seen.has(val)) return '[Circular]';
                seen.add(val);
              }
              return val;
            });
            
            if (jsonStr && jsonStr !== '{}') {
              return JSON.parse(jsonStr);
            }
            
            // Last resort: return object info
            return {
              _type: arg.constructor?.name || 'Object',
              _keys: keys.slice(0, 10),
              _note: 'Could not fully serialize object'
            };
          } catch (e) {
            // If all serialization fails, return basic info
            return {
              _error: 'Serialization failed',
              _type: arg.constructor?.name || 'Object',
              _keys: keys.slice(0, 10),
              _string: String(arg).substring(0, 200)
            };
          }
        }
        
        // Return primitive values as-is
        return arg;
      });
      
      // Always log something meaningful
      // Filter out empty objects and undefined values
      const filteredArgs = serializedArgs.filter(arg => {
        if (arg === undefined || arg === null) return false;
        if (arg === '[Empty Object]') return false;
        if (typeof arg === 'object' && Object.keys(arg).length === 0) return false;
        return true;
      });
      
      if (filteredArgs.length === 0) {
        console.error('Error occurred but no details available');
      } else {
        console.error(...filteredArgs);
      }
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

export default logger;

