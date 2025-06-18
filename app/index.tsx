import "@/global.css"

import { Text, View } from "react-native";
import { LegendList } from "@legendapp/list";


const items = [
	{ id: "1", title: "Test" },
	{ id: "2", title: "Hello Expo / React Native" },
	{ id: "3", title: "Go Train" },
];

export default function Index() {
	return (
		<View className="flex-1">
			<View className="flex-1 justify-center align-center">
				<Text className="text-center">Top half</Text>
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
		</View>
	);
}
