import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { App } from 'expo-router/build/qualified-entry'; // Assuming your app is at this entry point

LoadSkiaWeb({
	locateFile: (file: string) => `${file}`,
}).then(async () => {
	renderRootComponent(App);
}).catch((error) => {
	console.error("Failed to load Skia for web with Expo Router:", error);
});
