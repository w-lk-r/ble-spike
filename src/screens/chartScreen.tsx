import { Text, View, Button, Platform } from "react-native";
import { LegendList } from "@legendapp/list";
import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { synced } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv"
import { matchFont } from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native";


const state$ = observable(synced({
	initial: {
		data: [{ day: 0, highTmp: 0 }]
	},
	persist: {
		name: "firstPersist",
		plugin: ObservablePersistMMKV
	}

}));


export default function ChartScreen() {

	const addAnother = () => {
		state$.data.set((prev) => [...prev, { day: prev.length + 1, highTmp: 25 + 10 * Math.random() }])

	}

	const data = use$(state$.data)

	return (

		<View className="flex-1" >
			<View className="flex-1 justify-center align-center">
				<Button
					title="Add Another"
					onPress={addAnother}
				/>
			</View>
			<View className="p-12 flex-1 justify-center align-center">
				<CartesianChart
					data={data}
					xKey="day"
					yKeys={["highTmp"]}
				>
					{({ points }) => (
						<Line points={points.highTmp} color="red" strokeWidth={3} />
					)}
				</CartesianChart>
			</View>
			<View className="flex-1">

				<LegendList
					className="flex-1 justify-center align-center"
					data={data}
					renderItem={({ item }) => <Text className="text-center">{item.day}</Text>}
					keyExtractor={(item) => String(item.day)}
					recycleItems={true}
				/>
			</View>
		</View >
	);
}
