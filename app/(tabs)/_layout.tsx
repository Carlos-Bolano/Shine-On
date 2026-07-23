import { Colors } from "@/src/core/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.slate[500] ?? "#999",
        animation: "fade",
        tabBarStyle: {
          backgroundColor: Colors.background?.light ?? "#fff",
          borderTopColor: "rgba(238, 95, 43, 0.24)",
          borderRadius: 20,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "comment-quote" : "comment-quote-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "My Collection",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "bookmarks" : "bookmarks-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
