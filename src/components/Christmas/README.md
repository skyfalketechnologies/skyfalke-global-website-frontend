# Christmas Theme Implementation

A lightweight, non-intrusive Christmas theme system using React Context API.

## Features

- ✅ Automatic activation in December (with manual override)
- ✅ Toggleable without page reload
- ✅ Subtle festive decorations (snowflakes and stars)
- ✅ Soft red/green accent colors
- ✅ Minimal performance impact
- ✅ Accessible (sufficient contrast, no flashing effects)
- ✅ Easily removable after the season

## Usage

### Basic Usage

The Christmas theme is automatically enabled in December. Users can manually toggle it using the `ChristmasThemeToggle` component.

### Using the Theme Context

```jsx
import { useTheme } from '../../contexts/ThemeContext';

function MyComponent() {
  const { isChristmasTheme, toggleChristmasTheme } = useTheme();

  return (
    <div>
      {isChristmasTheme && <p>Merry Christmas! 🎄</p>}
      <button onClick={toggleChristmasTheme}>
        Toggle Christmas Theme
      </button>
    </div>
  );
}
```

### Using the Toggle Button Component

```jsx
import ChristmasThemeToggle from './components/Christmas/ChristmasThemeToggle';

function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
        <ChristmasThemeToggle />
      </nav>
    </header>
  );
}
```

### Using Festive Styled Components

```jsx
import FestiveButton from './components/Christmas/FestiveButton';

function MyPage() {
  return (
    <FestiveButton onClick={() => console.log('Clicked!')}>
      Click Me
    </FestiveButton>
  );
}
```

### Conditional Styling Based on Theme

```jsx
import { useTheme } from '../../contexts/ThemeContext';

function MyComponent() {
  const { isChristmasTheme } = useTheme();

  return (
    <div className={isChristmasTheme ? 'bg-christmas-green' : 'bg-dark-blue'}>
      Content
    </div>
  );
}
```

### Using CSS Classes

The Christmas theme automatically adds a `christmas` class to the document root when active. You can use this in your CSS:

```css
/* Regular styles */
.my-button {
  background: #303661;
}

/* Christmas theme styles */
.christmas .my-button {
  background: linear-gradient(135deg, #16a34a, #dc2626);
}
```

## Components

### `ChristmasDecorations`
Automatically renders subtle snowflakes and stars when the Christmas theme is active. Already included in `App.js`.

### `ChristmasThemeToggle`
A button component that allows users to toggle the Christmas theme on/off.

### `FestiveButton`
An example button component that demonstrates how to apply festive styling based on the theme context.

## Context API

The `ThemeContext` provides:

- `isChristmasTheme`: Boolean indicating if Christmas theme is active
- `toggleChristmasTheme`: Function to toggle the theme
- `isDarkMode`: Boolean for dark mode (separate feature)
- `toggleTheme`: Function to toggle dark mode

## CSS Variables

The theme uses CSS variables for easy customization:

```css
--christmas-red: #dc2626;
--christmas-green: #16a34a;
--christmas-gold: #fbbf24;
--christmas-snow: #ffffff;
--christmas-bg: #0f172a;
```

## Removing After Season

To remove the Christmas theme after the season:

1. Remove the `ChristmasDecorations` import and component from `App.js`
2. Delete the `client/src/components/Christmas/` directory
3. Remove Christmas-related CSS from `index.css` (look for `.christmas` selectors)
4. The `ThemeContext` can remain as it's used for dark mode as well

## Accessibility

- All decorative elements have `aria-hidden="true"`
- Toggle button has proper `aria-label` attributes
- No flashing animations (all animations are smooth and subtle)
- Sufficient color contrast maintained
- No auto-playing sounds or music

## Performance

- Decorations only render when theme is active
- CSS animations use GPU-accelerated properties
- Minimal DOM elements (12 snowflakes, 8 stars)
- No heavy JavaScript calculations
- Theme state persisted in localStorage

