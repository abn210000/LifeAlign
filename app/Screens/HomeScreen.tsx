import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';

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
          style={[styles.button, styles.editButton]} 
          onPress={() => router.push('/Screens/EditExistingTaskScreen')}
        >
          <Feather name="edit-2" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.createButton]} 
          onPress={() => router.push('/Screens/CreateNewTaskScreen')}
        >
          <AntDesign name="plus" size={32} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.historyButton]} 
          onPress={() => console.log('Task History')}
        >
          <Ionicons name="time-outline" size={28} color="#ffffff" />
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButton: {
    backgroundColor: '#77bba2',
  },
  createButton: {
    backgroundColor: '#0d522c',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  historyButton: {
    backgroundColor: '#77bba2',
  },
});