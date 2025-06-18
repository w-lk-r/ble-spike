import "@/global.css"

import { Text, View, Button } from "react-native";
import { LegendList } from "@legendapp/list";
import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";




const state$ = observable({
	items: [
		{ id: "1", title: "Test" },
		{ id: "2", title: "Hello Expo / React Native" },
		{ id: "3", title: "Go Train" },
	]
});

export default function Index() {

	const addAnother = () => state$.items.set((prev) => [...prev, { id: String(prev.length + 1), title: "Another" }])

	const items = use$(state$.items)

	return (

		<View className="flex-1" >
			<View className="flex-1 justify-center align-center">
				<Button
					title="Add Another"
					onPress={addAnother}
				/>
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
		</View >
	);
}
