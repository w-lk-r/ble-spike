import { Stack } from "expo-router";

export default function devices() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Devices"
				}}


			/>



		</Stack>
	)
}
