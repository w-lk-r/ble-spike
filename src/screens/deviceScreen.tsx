import { View, Button, Text } from "react-native";
import { useBle } from "@/src/ble/useBle";
import { observer } from '@legendapp/state/react'; // Import observer for React components
import { bleManagerState$, scan, foundDevices$ } from "@/src/ble/bleStore";
import { LegendList } from "@legendapp/list";


const DeviceScreen = observer(function DeviceScreen() {
	useBle();

	const currentBleState = bleManagerState$.get();
	const devices = foundDevices$.get();

	return (
		<View className="flex-1 justify-center align-center">
			<Text className="text-center">Ble state: {currentBleState} </Text>
			<Button title="scan" onPress={() => scan()} />

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
