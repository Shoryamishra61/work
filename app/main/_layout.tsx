import React from 'react';
import { Tabs } from 'expo-router';
import { BookOpen, Compass, Users, User as UserIcon } from 'lucide-react-native'; // User as UserIcon to avoid conflict
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Common practice for tabs, can be overridden per screen
        tabBarActiveTintColor: '#8B5CF6', // Example active color
        tabBarInactiveTintColor: '#A1A1AA', // Example inactive color
        tabBarStyle: {
          backgroundColor: '#18181B', // Example tab bar background
          borderTopColor: '#27272A',
          height: Platform.OS === 'ios' ? 90 : 70, // Adjust height for platform
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium', // Assuming Inter font is used as in RootLayout
        },
      }}
      initialRouteName="index" // Set "Learn" (index) as the default tab
    >
      <Tabs.Screen
        name="index" // This will map to app/main/index.tsx (or root index.tsx if configured globally)
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="discover" // Will map to app/main/discover.tsx (or root discover.tsx)
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="community" // Will map to app/main/community.tsx (or root community.tsx)
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile" // Will map to app/main/profile.tsx (or root profile.tsx)
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
        }}
      />
      {/* Add a screen for index.tsx to ensure it's part of the (tabs) layout if needed */}
      {/* <Tabs.Screen name="index" options={{ href: null }} /> */}
    </Tabs>
  );
}
