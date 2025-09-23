# Sora Font Usage Guide

## Available Font Classes

### Regular Weight (400)

- `font-sora` - Regular Sora font
- Use for: Body text, descriptions, general content

### Medium Weight (600)

- `font-sora-medium` - Semi-bold Sora font
- Use for: Labels, form fields, secondary headings

### Bold Weight (700)

- `font-sora-bold` - Bold Sora font
- Use for: Main headings, buttons, important text

## Examples

```tsx
// Main heading
<Text className="text-2xl font-sora-bold text-gray-900">
  Welcome to MadeMeSmile
</Text>

// Subheading
<Text className="text-lg font-sora-medium text-gray-700">
  Sign in to continue
</Text>

// Body text
<Text className="text-base font-sora text-gray-600">
  This is regular body text using Sora font.
</Text>

// Button text
<Text className="text-white font-sora-bold">
  Sign In
</Text>
```

## Default Font

The app is configured to use Sora as the default font family, so you don't need to specify `font-sora` for regular text unless you want to be explicit.
