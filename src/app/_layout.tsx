import "../global.css";
import { Slot, Stack, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ClerkProvider } from '@clerk/clerk-expo'
export default function Layout() {
  return (
    <ClerkProvider>
      <Slot/>
    </ClerkProvider>
    // <Tabs>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "Home",
    //       headerShown: false,
    //       tabBarIcon: ({ color, size }) => (
    //         <AntDesign name="home" color={color} size={size} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       title: "Profile",
    //       headerShown: false,
    //       tabBarIcon: ({ color, size }) => (
    //         <AntDesign name="user" color={color} size={size} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="history"
    //     options={{
    //       title: "History",
    //       headerShown: false,
    //       tabBarIcon: ({ color, size }) => (
    //         <AntDesign name="clockcircle" color={color} size={size} />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
}
