import { Text, View } from "react-native";
import { usePathname, Link } from "expo-router";


export default function PlaceholderScreen() {
	return (
		<View className="flex-1 justify-center align-center">
			<Text className="text-center">Location: {usePathname()} </Text>
			<Link href="/" className="text-center">Home</Link>
			<Link href="/_sitemap" className="text-center">Sitemap</Link>
		</View>
	)
}

