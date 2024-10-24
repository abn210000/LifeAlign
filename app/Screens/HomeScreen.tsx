// HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../src/context/TaskContext';
import { Task } from '../src/types/Tasks';


export default function HomeScreen() {
  const router = useRouter();
  const {
    tasks,
    selectedDate,
    isLoading,
    setSelectedDate,
    updateTask,
    markedDates
  } = useTaskContext();

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <TouchableOpacity 
      style={styles.taskItem}
      onPress={() => router.push({
        pathname: '/Screens/EditTaskList',
        params: { taskId: task.id }
      })}
    >
      <View style={styles.taskLeftContent}>
        <TouchableOpacity 
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={() => updateTask(task.id, { completed: !task.completed })}
        >
          {task.completed && <Feather name="check" size={16} color="#ffffff" />}
        </TouchableOpacity>
        <View style={styles.taskTextContent}>
          <Text style={[
            styles.taskTitle,
            task.completed && styles.taskTitleCompleted
          ]}>{task.title}</Text>
          <Text style={styles.taskCategory}>{task.category}</Text>
        </View>
      </View>
      <Text style={styles.taskTime}>{task.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Life Align</Text>
      
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: '#caddd7',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#77bba2',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#0d522c',
          dayTextColor: '#0d522c',
          textDisabledColor: '#d9e1e8',
          textMonthFontWeight: 'bold',
          arrowColor: '#0d522c',
        }}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: '#77bba2',
          },
        }}
        onDayPress={handleDayPress}
      />

      <View style={styles.taskListContainer}>
        <Text style={styles.dateHeader}>
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#0d522c" />
        ) : tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={({ item }) => <TaskItem task={item} />}
            keyExtractor={item => item.id}
            style={styles.taskList}
          />
        ) : (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No tasks for this day</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => router.push('/Screens/EditTaskList')}
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
  taskListContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 80,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d522c',
    marginBottom: 15,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  taskLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#77bba2',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#77bba2',
  },
  taskTextContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#0d522c',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b917f',
  },
  taskCategory: {
    fontSize: 14,
    color: '#6b917f',
  },
  taskTime: {
    fontSize: 14,
    color: '#0d522c',
    fontWeight: '500',
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 16,
    color: '#6b917f',
    fontStyle: 'italic',
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