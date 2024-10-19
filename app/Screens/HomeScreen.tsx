import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Get today's date in 'YYYY-MM-DD' format
const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Life Align</Text>
      
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: '#caddd7',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#ffffff', 
          dayTextColor: '#0d522c',
          textDisabledColor: '#d9e1e8',
          textMonthFontWeight: 'bold',
          arrowColor: '#0d522c',
        }}
        markedDates={{
          [today]: {
            selected: true,
            marked: true,
            dotColor: '#ffffff', 
            selectedColor: '#77bba2', 
          },
        }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/Screens/CreateNewTaskScreen')}        >
          <Text style={styles.buttonText}>Create New Task</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => console.log('Edit Existing Task')}>
          <Text style={styles.buttonText}>Edit Existing Task</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => console.log('Task History')}>
          <Text style={styles.buttonText}>Task History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caddd7',
    padding: 20,
  },
  title: {
    fontSize: 48,
    color: '#0d522c',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#77bba2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#0d522c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
