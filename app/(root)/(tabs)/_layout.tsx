import { Tabs } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import React from "react";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { HomeIcon } from "react-native-heroicons/solid";

const TabIcon = ({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused?: boolean;
}) => {
  return <View className={`flex flex-1`}>{children}</View>;
};

const Layout: React.FC = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          color: "black",
          fontFamily: "HostGrotesk-Bold",
        },
        tabBarStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          height: 66,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={1} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <HomeIcon
                color={focused ? "#3b82f6" : "black"}
                className={`${focused ? " color-blue-500" : "color-black"}`}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={1} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <UserCircleIcon color={focused ? "blue" : "black"} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
