// Polyfill for react-quill compatibility with React 18
// react-quill expects findDOMNode on react-dom's default export
// This file patches react-dom to ensure compatibility

// React 18 compatible findDOMNode implementation
// Since findDOMNode was removed in React 18, we provide a polyfill
function findDOMNodePolyfill(componentOrElement) {
  if (componentOrElement == null) {
    return null;
  }
  
  // If it's already a DOM element, return it
  if (componentOrElement.nodeType === 1) {
    return componentOrElement;
  }
  
  // If it's a React component instance, try to find the DOM node
  // React 18 uses Fiber architecture, so we need to traverse the fiber tree
  if (componentOrElement._reactInternalFiber || componentOrElement._reactInternalInstance) {
    let fiber = componentOrElement._reactInternalFiber || componentOrElement._reactInternalInstance;
    
    while (fiber) {
      // Check if this fiber has a DOM node
      if (fiber.stateNode) {
        if (fiber.stateNode.nodeType === 1) {
          return fiber.stateNode;
        }
        // If stateNode is a component, continue searching
        if (fiber.stateNode._reactInternalFiber || fiber.stateNode._reactInternalInstance) {
          fiber = fiber.stateNode._reactInternalFiber || fiber.stateNode._reactInternalInstance;
          continue;
        }
      }
      // Move to child or sibling
      fiber = fiber.child || fiber.sibling || fiber.return;
    }
  }
  
  // Fallback: check if component has refs
  if (componentOrElement.refs) {
    const refs = componentOrElement.refs;
    for (const key in refs) {
      const ref = refs[key];
      if (ref && ref.nodeType === 1) {
        return ref;
      }
      if (ref && ref.current && ref.current.nodeType === 1) {
        return ref.current;
      }
    }
  }
  
  return null;
}

// Import react-dom and patch it immediately
import * as ReactDOM from 'react-dom';

// Patch react-dom synchronously before any other code runs
// This ensures react-quill gets the patched version when it imports react-dom
const findDOMNode = ReactDOM.findDOMNode || findDOMNodePolyfill;

// Create default export with findDOMNode
// This is what react-quill expects: react_dom_1.default.findDOMNode
// react-quill uses TypeScript compilation which creates: react_dom_1.default.findDOMNode
if (!ReactDOM.default) {
  // Create default export object with all ReactDOM exports plus findDOMNode
  ReactDOM.default = {
    ...ReactDOM,
    findDOMNode: findDOMNode,
  };
} else {
  // Ensure findDOMNode exists on default export
  ReactDOM.default.findDOMNode = findDOMNode;
}

// Also ensure it's on the main export for compatibility
if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = findDOMNode;
}

// Double-check that default export has findDOMNode (in case it was created without it)
if (ReactDOM.default && !ReactDOM.default.findDOMNode) {
  ReactDOM.default.findDOMNode = findDOMNode;
}

export default ReactDOM;

