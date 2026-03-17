
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.palette.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.palette.white,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ color }) => <MaterialIcons name="group" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-medication"
        options={{
          title: 'Add Medication',
          tabBarIcon: ({ color }) => <MaterialIcons name="add" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="biometrics"
        options={{
          title: 'Biometría',
          tabBarIcon: ({ color }) => <MaterialIcons name="monitor-heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Análisis',
          tabBarIcon: ({ color }) => <MaterialIcons name="leaderboard" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
