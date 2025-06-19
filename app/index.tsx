import "@/global.css"

import { Text, View, Button } from "react-native";
import { LegendList } from "@legendapp/list";
import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { synced } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv"
import { CartesianChart, Line } from "victory-native";



const state$ = observable(synced({
	initial: {
		items: [
			{ id: "1", title: "Test" },
			{ id: "2", title: "Hello Expo / React Native" },
			{ id: "3", title: "Go Train" },
		]
	},
	persist: {
		name: "firstPersist",
		plugin: ObservablePersistMMKV
	}

}));


const statetwo$ = observable({
	items: [
		{ id: "1", title: "Test" },
		{ id: "2", title: "Hello Expo / React Native" },
		{ id: "3", title: "Go Train" },
	]
});


export default function Index() {

	const addAnother = () => {
		state$.items.set((prev) => [...prev, { id: String(prev.length + 1), title: "Another" }])
		statetwo$.items.set((prev) => [...prev, { id: String(prev.length + 1), title: "Another" }])

	}

	const items = use$(state$.items)
	const itemstwo = use$(statetwo$.items)
	const DATA = Array.from({ length: 31 }, (_, i) => ({
		day: i,
		highTmp: 40 + 30 * Math.random(),
	}));

	return (

		<View className="flex-1" >
			<View className="flex-1 justify-center align-center">
				<Button
					title="Add Another"
					onPress={addAnother}
				/>
			</View>
			<View className="flex-1 justify-center align-center">
				<CartesianChart data={DATA} xKey="day" yKeys={["highTmp"]}>
					{/* 👇 render function exposes various data, such as points. */}
					{({ points }) => (
						// 👇 and we'll use the Line component to render a line path.
						<Line points={points.highTmp} color="red" strokeWidth={3} />
					)}
				</CartesianChart>
			</View>
			<View className="flex-1">

				<LegendList
					className="flex-1 justify-center align-center"
					data={items}
					renderItem={({ item }) => <Text className="text-center">{item.title}</Text>}
					keyExtractor={(item) => item.id}
					recycleItems={true}
				/>
			</View>
			<View className="flex-1">

				<LegendList
					className="flex-1 justify-center align-center"
					data={itemstwo}
					renderItem={({ item }) => <Text className="text-center">{item.title}</Text>}
					keyExtractor={(item) => item.id}
					recycleItems={true}
				/>
			</View>
		</View >
	);
}
