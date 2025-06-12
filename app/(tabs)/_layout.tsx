import React from 'react';
import { Tabs } from 'expo-router';
import { BookOpen, Search, Users, User } from 'lucide-react-native'; // Adjusted UserCircle to User
import { Platform } from 'react-native';

const ACTIVE_COLOR = '#8B5CF6'; // Primary app color
const INACTIVE_COLOR = '#666666'; // Muted color

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#000000', // Black background for the tab bar
          borderTopColor: '#222222', // Subtle top border
          paddingBottom: Platform.OS === 'android' ? 5 : 0, // Padding for Android notch/navbar
          height: Platform.OS === 'android' ? 60 : 50, // Standard height
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 10,
          marginTop: -5, // Adjust label position
          marginBottom: Platform.OS === 'ios' ? -5 : 5, // Adjust label position for iOS
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 5 : 0, // Adjust icon position for iOS
        }
      }}
    >
      <Tabs.Screen
        name="index" // This will point to app/(tabs)/index.tsx
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen color={focused ? ACTIVE_COLOR : color} size={focused ? 26 : 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover" // This will point to app/(tabs)/discover.tsx
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Search color={focused ? ACTIVE_COLOR : color} size={focused ? 26 : 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="community" // This will point to app/(tabs)/community.tsx
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <Users color={focused ? ACTIVE_COLOR : color} size={focused ? 26 : 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // This will point to app/(tabs)/profile.tsx
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User color={focused ? ACTIVE_COLOR : color} size={focused ? 26 : 24} />
          ),
        }}
      />
    </Tabs>
  );
}
