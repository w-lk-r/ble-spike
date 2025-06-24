import { Platform } from "react-native";
import { Tabs } from "expo-router";

export default function RootLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
				}}
			/>
			<Tabs.Protected guard={Platform.OS != "web"}>
				<Tabs.Screen
					name="activity"
					options={{
						title: "Activity",
					}}
				/>
			</Tabs.Protected >
			<Tabs.Screen
				name="devices"
				options={{
					title: "Devices",
					headerShown: false
				}}
			/>

		</Tabs >
	);
}
