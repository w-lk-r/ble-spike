import { View, Button, Text } from "react-native";
import { useBle } from "@/src/hooks/useBle";
import { observer } from '@legendapp/state/react'; // Import observer for React components
import { bleState$, isBlePoweredOn$, startScan, foundDevices$ } from "@/src/state/bleStore";
import { LegendList } from "@legendapp/list";


const DeviceScreen = observer(function DeviceScreen() {
	useBle();

	const currentBleState = bleState$.get();
	const isBlePoweredOn = isBlePoweredOn$.get();

	const devices = foundDevices$.get();


	const handlePress = () => {
		startScan()
		console.log(devices)
	}


	return (
		<View className="flex-1 justify-center align-center">
			<Text className="text-center">Ble state: {currentBleState} </Text>
			<Button title="scan" onPress={handlePress} />

			<LegendList
				className="flex-1 justify-center align-center"
				data={devices}
				renderItem={({ item }) => <Text className="text-center">{item.id}</Text>}
				keyExtractor={(item) => String(item.id)}
			/>
		</View>
	)
})

export default DeviceScreen
