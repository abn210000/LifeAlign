// Written by: Allison Nguyen
// Tested by: Linh Tran
// Debugged by: Evelyn Tran
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../src/context/TaskContext';
import { Task } from '../src/types/Tasks';
import { categories, getCategoryColor } from '../src/config/categories';
import moment from 'moment';
import { cancelNotification } from '../src/notifications';
import { scheduleNotification } from '../src/notifications';

// Home screen component
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

  // Filter tasks for selected date
  const filteredTasks = tasks.filter(task => {
    const taskDate = moment(task.date).format('YYYY-MM-DD');
    return taskDate === selectedDate;
  });

  // Handle day press on calendar
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  // Get category color by value
  const getCategoryDetails = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return {
      color: category?.color || '#6b917f',
      label: category?.label || categoryValue
    };
  };

  // Function to push the task to tomorrow
  const handlePushToTomorrow = async (task: Task) => {
    const tomorrow = moment(task.date).add(1, 'day').format('YYYY-MM-DD');
    try {
      // Cancel existing notifications
      if (task.notifId) {
        await cancelNotification(task.notifId);
      }
 
      // Schedule new notifications
      const ids = await scheduleNotification(
        task.title,
        tomorrow,
        task.startTime,
        task.alertType || ''
      );
 
      await updateTask(task.id, { date: tomorrow, notifId: ids });
    } catch (error) {
      console.error('Error pushing task to tomorrow:', error);
    }
  };

  // Task item component
  const TaskItem = ({ task }: { task: Task }) => {
    const categoryDetails = getCategoryDetails(task.category);
    const isLate = moment(`${task.date} ${task.startTime}`).isBefore(moment()) && !task.completed;
    
    // Format start and end times to 12-hour format
    const formattedStartTime = moment(task.startTime, 'HH:mm').format('h:mm A');
    const formattedEndTime = moment(task.endTime, 'HH:mm').format('h:mm A');
    
    return (
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
            <View style={styles.taskMetadata}>
              <View style={[
                styles.categoryBox,
                { backgroundColor: categoryDetails.color }
              ]}>
                <Text style={styles.categoryText}>{categoryDetails.label}</Text>
              </View>
              {isLate && !task.completed && (
                <Text style={[styles.lateText, { color: '#ee6b6e' }]}>LATE</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.taskRightContent}>
          <Text style={styles.taskTime}>
            {formattedStartTime} - {formattedEndTime}
          </Text>
          <TouchableOpacity
            style={styles.tomorrowButton}
            onPress={(e) => {
              e.stopPropagation();
              handlePushToTomorrow(task);
            }}
          >
            <Feather name="clock" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render the component
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
          {moment(selectedDate).format('dddd, MMMM D')}
        </Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#0d522c" />
        ) : filteredTasks.length > 0 ? (
          <FlatList
            data={filteredTasks}
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
          accessibilityLabel='Create New Task'
        >
          <AntDesign name="plus" size={32} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.historyButton]} 
          onPress={() => router.push('/Screens/TaskHistoryScreen')}
        >
          <Ionicons name="time-outline" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles definition for each component
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
  categoryBox: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
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
  taskMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lateText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  taskRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tomorrowButton: {
    backgroundColor: '#77bba2',
    padding: 6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
  },
});