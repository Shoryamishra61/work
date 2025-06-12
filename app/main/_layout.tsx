import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Compass, PlusSquare, MessageSquare, User as UserIcon } from 'lucide-react-native';
import theme from '../../styles/theme'; // Assuming theme is two levels up from app/main/_layout.tsx

export default function TabLayout() {
  const iconColor = theme.colors.white; // Base color for icons
  const activeColor = theme.colors.white; // Color for active (focused) icon, can be same or different
  const inactiveColor = theme.colors.textSecondary; // Color for inactive icons (if not just using fill)

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // No text labels
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: theme.colors.black, // Pure black background
          borderTopWidth: 0, // No border top for a cleaner look
          height: Platform.OS === 'ios' ? 80 : 60, // Standard height
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index" // Points to root index.tsx
        href="/" // Explicitly link to root index.tsx
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Home
              size={focused ? size + 2 : size}
              color={focused ? activeColor : color}
              fill={focused ? activeColor : 'none'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover_tab" // Use a unique name for the route if discover.tsx is also a global route
        href="/discover"   // Points to root discover.tsx
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Compass
              size={focused ? size + 2 : size}
              color={focused ? activeColor : color}
              fill={focused ? activeColor : 'none'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create_tab"
        href="/create"    // Points to root create.tsx (to be created)
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <PlusSquare // Using PlusSquare as it's common for "create"
              size={focused ? size + 4 : size + 2} // Make create button slightly larger
              color={focused ? activeColor : color} // Or a distinct color like theme.colors.primary
              fill={focused ? activeColor : 'none'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox_tab"
        href="/inbox"     // Points to root inbox.tsx (to be created)
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MessageSquare // Using MessageSquare for Inbox
              size={focused ? size + 2 : size}
              color={focused ? activeColor : color}
              fill={focused ? activeColor : 'none'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile_tab"
        href="/profile"   // Points to root profile.tsx
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <UserIcon
              size={focused ? size + 2 : size}
              color={focused ? activeColor : color}
              fill={focused ? activeColor : 'none'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
