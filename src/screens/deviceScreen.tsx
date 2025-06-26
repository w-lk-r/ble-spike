import { View, Text } from "react-native";
import { useBle } from "@/src/hooks/useBle";
import { observer } from '@legendapp/state/react'; // Import observer for React components
import { bleState$, isBlePoweredOn$ } from "@/src/state/bleStore";

const DeviceScreen = observer(function DeviceScreen() {
	useBle();

	const currentBleState = bleState$.get();
	const isBlePoweredOn = isBlePoweredOn$.get();


	return (
		<View className="flex-1 justify-center align-center">

			<Text className="text-center">Ble state: {currentBleState} </Text>
		</View>
	)
})

export default DeviceScreen
