import React from 'react';
import { TaskProvider } from './src/context/TaskContext'; // Assuming your context is defined here
import { Stack } from 'expo-router';

export default function App() {
  return (
    <TaskProvider>
      <Layout />
    </TaskProvider>
  );
}

function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          title: 'LifeAlign',
          headerShown: false, // Hide the header for the home screen
        }} 
      />
      <Stack.Screen 
        name="Screens/CreateNewTaskScreen" 
        options={{
          title: 'Create New Task',
          headerStyle: {
            backgroundColor: '#93c4af',
          },
          headerTintColor: '#0d522c',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="Screens/EditExistingTaskScreen" 
        options={{
          title: 'Edit Task',
          headerStyle: {
            backgroundColor: '#93c4af',
          },
          headerTintColor: '#0d522c',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
    </Stack>
  );
}
