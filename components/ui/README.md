# Bottom Modal Component

A fully configured and ready-to-use bottom sheet modal component built with `@gorhom/bottom-sheet`.

## Features

- ✅ **Fully Configured**: All necessary packages and dependencies are installed
- ✅ **Gesture Support**: Pan-to-close and backdrop tap-to-close gestures
- ✅ **Customizable**: Flexible props for different use cases
- ✅ **TypeScript**: Full TypeScript support with proper types
- ✅ **Performance**: Optimized with React.useCallback for better performance
- ✅ **Accessibility**: Proper accessibility support

## Installation Status

The following packages have been installed and configured:

- `@gorhom/bottom-sheet` - Main bottom sheet library
- `react-native-gesture-handler` - Gesture handling (already installed)
- `react-native-reanimated` - Animations (already installed)

## Configuration

The following files have been updated for proper setup:

### 1. Babel Configuration (`babel.config.js`)

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin", // Added for bottom sheet
    ],
  };
};
```

### 2. Root Layout (`app/_layout.tsx`)

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

## Usage

### Basic Usage

```tsx
import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomModal, {
  BottomSheetModalProvider,
} from "./components/ui/bottom-modal";

const MyComponent = () => {
  const bottomSheetModalRef = useRef(null);

  return (
    <BottomSheetModalProvider>
      <View>
        <TouchableOpacity
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <Text>Open Modal</Text>
        </TouchableOpacity>

        <BottomModal bottomSheetModalRef={bottomSheetModalRef} title="My Modal">
          <Text>Modal Content</Text>
        </BottomModal>
      </View>
    </BottomSheetModalProvider>
  );
};
```

### Controlled Usage

```tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomModal, {
  BottomSheetModalProvider,
} from "./components/ui/bottom-modal";

const MyComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <BottomSheetModalProvider>
      <View>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Text>Open Modal</Text>
        </TouchableOpacity>

        <BottomModal
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          title="Controlled Modal"
          snapPoints={["40%", "60%"]}
        >
          <Text>Modal Content</Text>
        </BottomModal>
      </View>
    </BottomSheetModalProvider>
  );
};
```

## Props

| Prop                   | Type                                | Default                  | Description                               |
| ---------------------- | ----------------------------------- | ------------------------ | ----------------------------------------- |
| `children`             | `React.ReactNode`                   | -                        | Content to display in the modal           |
| `bottomSheetModalRef`  | `React.RefObject<BottomSheetModal>` | -                        | Ref to control the modal programmatically |
| `isVisible`            | `boolean`                           | -                        | Controlled visibility state               |
| `onClose`              | `() => void`                        | -                        | Callback when modal is closed             |
| `snapPoints`           | `string[]`                          | `["50%", "75%", "100%"]` | Snap points for the modal                 |
| `enablePanDownToClose` | `boolean`                           | `true`                   | Enable pan-down-to-close gesture          |
| `showCloseButton`      | `boolean`                           | `true`                   | Show close button in header               |
| `title`                | `string`                            | -                        | Title to display in the modal             |

## Example Component

See `bottom-modal-example.tsx` for a complete working example with both ref-based and controlled usage patterns.

## Important Notes

1. **Provider Required**: Always wrap your app or the component using the modal with `BottomSheetModalProvider`
2. **Gesture Handler**: The root layout must be wrapped with `GestureHandlerRootView`
3. **Reanimated Plugin**: The babel plugin for react-native-reanimated must be configured
4. **Performance**: The component uses `React.useCallback` for optimal performance

## Troubleshooting

### Modal not appearing

- Ensure `BottomSheetModalProvider` wraps your component
- Check that `GestureHandlerRootView` is in your root layout
- Verify the babel configuration includes the reanimated plugin

### Gestures not working

- Make sure `react-native-gesture-handler` is properly installed
- Verify `GestureHandlerRootView` is wrapping your app

### Animation issues

- Ensure `react-native-reanimated` is installed and configured
- Check that the babel plugin is properly set up

## Next Steps

The bottom modal component is now fully configured and ready to use! You can:

1. Import and use it in any component
2. Customize the styling and behavior as needed
3. Add more features like custom animations or additional props
4. Test it in your app to ensure everything works correctly
