import { View, Button, Text } from "react-native";
import { useBle } from "@/src/ble/useBle";
import { observer } from '@legendapp/state/react'; // Import observer for React components
import { bleManagerState$, scan, foundDevices$, connectToDevice, connectionStates$ } from "@/src/ble/bleStore";
import { LegendList } from "@legendapp/list";
import { ConnectionStates } from "@/src/ble/types";


const DeviceScreen = observer(function DeviceScreen() {
	useBle();

	const currentBleState = bleManagerState$.get();
	const devices = foundDevices$.get();
	const connections = connectionStates$.get();
	
	// Filter devices to show only connected ones
	const connectedDevices = devices.filter(device => 
		device.connectionState === ConnectionStates.Connected
	);


	return (
		<View className="flex-1 justify-center align-center">
			<Text className="text-center">Ble state: {currentBleState} </Text>
			<Button title="scan" onPress={() => scan()} />

			<LegendList
				className="flex-1 justify-center align-center"
				data={devices}
				renderItem={({ item }) => <Text onPress={() => connectToDevice(item.id)} className="text-center">{item.id}</Text>}
				keyExtractor={(item) => String(item.id)}


			/>
			<Text className="text-center">Connected Devices: {connectedDevices.length} </Text>
			<LegendList
				className="flex-1 justify-center align-center"
				data={connectedDevices}
				renderItem={({ item }) => <Text className="text-center">{item.name || item.id}</Text>}
				keyExtractor={(item) => String(item.id)}


			/>

		</View>
	)
})

export default DeviceScreen
