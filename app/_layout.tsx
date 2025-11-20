import { Stack, Tabs } from "expo-router";
import { ActivityProvider } from "../context/ActivityContext";
import {Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return( 
   
    <ActivityProvider>
      
    
    <Tabs>
      <Tabs.Screen
      name="index"
      options={{ title: "Home",
        tabBarIcon: ({ color, size}) => (
          <Ionicons name="home-outline" size={size} color={color}/>
        ),
      }}
      />
      <Tabs.Screen
      name="activities"
      options={{ title: "Activities",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="list-outline" size={size} color={color} />
        ),
      }}
      />
    </Tabs>
    </ActivityProvider>
    
  );
}
