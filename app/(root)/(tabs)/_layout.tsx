import { Stack, Tabs } from "expo-router";
import { View } from "react-native";
import { HomeIcon, ChartPieIcon } from "react-native-heroicons/outline";

const TabIcon = ({ focused }: { focused: boolean }) => (
  <View
    className={` rounded-full w-12 h-12 flex justify-center items-center mb-5 ${
      focused ? "bg-general-400" : ""
    }`}
  >
    <HomeIcon color={"black"} />
  </View>
);

const Layout = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1E1E1E",
          position: "absolute",
          display: "flex",
          overflow: "hidden",
          height: 66,
          paddingTop: 23,
          marginBottom: 20,
          marginHorizontal: 20,
          paddingBottom: 0,
          paddingHorizontal: 0,
          borderRadius: 90,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <HomeIcon color={"black"} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          headerShown: false,
          tabBarIcon: ({ focused }) => <ChartPieIcon color={"black"} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
