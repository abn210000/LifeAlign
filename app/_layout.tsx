import React, { useEffect } from 'react';
import { TaskProvider } from './src/context/TaskContext'; 
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerForPushNotificationsAsync } from './src/notifications';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
    setupNotifications();
  }, []);

  async function setupNotifications() {
    try {
      // Set up notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('task-alerts', {
          name: 'Task Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Set up notification handler
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response received:', response);
      });

    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  }

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
        name="Screens/EditTaskList" 
        options={{
          title: 'Current Task List',
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
      <Stack.Screen 
        name="Screens/TaskHistoryScreen" 
        options={{
          title: 'Task History',
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
