import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import moment from 'moment';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTaskContext } from '../src/context/TaskContext';
import { categories } from '../src/config/categories';
import { scheduleNotification, cancelNotification } from '../src/notifications';
import { Feather } from '@expo/vector-icons';

const numChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const periods = ['-', 'Days', 'Weeks', 'Months', 'Years'];

const EditExistingTaskScreen = () => {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const { updateTask, deleteTask, tasks } = useTaskContext();

  const [form, setForm] = useState({
    id: '',
    title: '',
    category: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    alertType: '',
    repeatNum: 0,
    repeatPeriod: '',
    completed: false,
    notifId: ['']
  });

  const [mode, setMode] = useState('date');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  
  const showMode = (currentMode) => {
    setShowDateTimePicker(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showStartTimepicker = () => {
    showMode('startTime');
  };

  const showEndTimepicker = () => {
    showMode('endTime');
  };

  // Load existing task data
  useEffect(() => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setForm({
        id: task.id,
        title: task.title || '',
        category: task.category || '',
        date: moment(task.date).toDate(),
        startTime: moment(task.startTime, 'HH:mm').toDate(),
        endTime: moment(task.endTime, 'HH:mm').toDate(),
        alertType: task.alertType || '',
        repeatNum: task.repeatNum || 0,
        repeatPeriod: task.repeatPeriod || '',
        completed: task.completed || false,
        notifId: task.notifId || [''],
      });
    } else {
      // Handle case where task is not found
      console.warn('Task not found');
      router.back(); // Optionally navigate back
    }
  }, [taskId, tasks]);

  const checkTimeConflict = (startTime: Date, endTime: Date) => {
    return tasks.some(task => {
      if (task.id === form.id) return false; // Skip the current task
      const taskStart = moment(task.startTime, 'HH:mm');
      const taskEnd = moment(task.endTime, 'HH:mm');
      return (
        (moment(startTime).isBetween(taskStart, taskEnd, null, '[)') ||
        moment(endTime).isBetween(taskStart, taskEnd, null, '(]')) ||
        (moment(taskStart).isBetween(startTime, endTime, null, '[)') ||
        moment(taskEnd).isBetween(startTime, endTime, null, '(]'))
      );
    });
  };

  const handleSubmit = async () => {
    // Check if end time is before start time
    if (moment(form.endTime).isBefore(moment(form.startTime))) {
        Alert.alert(
            "Invalid Time Range",
            "End time cannot be before start time. Please adjust the times.",
            [{ text: "OK" }]
        );
        return;
    }

    const hasConflict = checkTimeConflict(form.startTime, form.endTime);

    if (hasConflict) {
        Alert.alert(
            "Time Conflict",
            "There is an existing task at this time, are you sure you would like to proceed?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => updateTaskDetails() }
            ]
        );
    } else {
        updateTaskDetails();
    }
  };

  const updateTaskDetails = async () => {
    try {
      // Cancel existing notifications
      if (form.notifId) {
        await cancelNotification(form.notifId);
      }

      // Schedule new notifications
      const ids = await scheduleNotification(
        form.title,
        moment(form.date).format('YYYY-MM-DD'),
        moment(form.startTime).format('HH:mm'),
        form.alertType
      );

      const updatedTask = {
        title: form.title,
        category: form.category,
        date: moment(form.date).format('YYYY-MM-DD'),
        startTime: moment(form.startTime).format('HH:mm'),
        endTime: moment(form.endTime).format('HH:mm'),
        alertType: form.alertType,
        repeatNum: form.repeatNum,
        repeatPeriod: form.repeatPeriod,
        completed: form.completed,
        notifId: ids,
        updatedAt: moment().toISOString()
      };

      await updateTask(form.id, updatedTask);
      router.back();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (form.notifId) {
        await cancelNotification(form.notifId);
      }
      await deleteTask(taskId as string);
      router.back();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async () => {
    try {
      const updatedTask = {
        ...form,
        completed: !form.completed
      };
      setForm(updatedTask);
      await updateTask(taskId as string, { completed: !form.completed });
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || form.date;
    setForm({ ...form, date: currentDate });
    setShowDateTimePicker(false);
  };

  const handleStartTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || form.startTime;
    setForm({ ...form, startTime: currentTime });
    setShowDateTimePicker(false);
  };

  const handleEndTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || form.endTime;
    setForm({ ...form, endTime: currentTime });
    setShowDateTimePicker(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.completeButton, form.completed && styles.completedButton]}
              onPress={toggleComplete}
            >
              <Feather
                name={form.completed ? "check-circle" : "circle"}
                size={24}
                color={form.completed ? "#ffffff" : "#6b917f"}
              />
              <Text style={[
                styles.completeButtonText,
                form.completed && styles.completedButtonText
              ]}>
                {form.completed ? 'Completed' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              accessibilityLabel="Delete Task"
            >
              <Feather name="trash-2" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.inputBox}
            placeholder="Title"
            placeholderTextColor="#6b917f"
            value={form.title}
            onChangeText={(val) => setForm({ ...form, title: val })}
          />

          <View style={styles.inputBox}>
            <Text style={styles.labelText}>Category</Text>
            <View style={styles.categoryButtonContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: category.color },
                    form.category === category.value && styles.selectedCategory
                  ]}
                  onPress={() => setForm({ ...form, category: category.value })}
                >
                  <Text style={styles.categoryButtonText}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.dateTimeBox} onPress={showDatepicker}>
            <Text style={styles.labelText}>Date</Text>
            {(showDateTimePicker && mode=='date') ?
            <DateTimePicker
              mode="date"
              display="default"
              value={form.date}
              onChange={handleDateChange}
              style={styles.dateTimePicker}
            /> : <Text>{moment(form.date).format('YYYY-MM-DD')}</Text>
          }
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateTimeBox} onPress={showStartTimepicker}>
            <Text style={styles.labelText}>Start Time</Text>
            {showDateTimePicker && mode=='startTime' ?
            <DateTimePicker
              mode="time"
              display="default"
              value={form.startTime}
              onChange={handleStartTimeChange}
              style={styles.dateTimePicker}
              /> : <Text>{moment(form.startTime).format('HH:mm')}</Text>
            }
            </TouchableOpacity>
  
          <TouchableOpacity style={styles.dateTimeBox} onPress={showEndTimepicker}>
            <Text style={styles.labelText}>End Time</Text>
            {showDateTimePicker && mode=='endTime' ?
            <DateTimePicker
              mode="time"
              display="default"
              value={form.endTime}
              onChange={handleEndTimeChange}
              style={styles.dateTimePicker}
            /> : <Text>{moment(form.endTime).format('HH:mm')}</Text>
            }
          </TouchableOpacity>

          <View style={styles.repeatContainer}>
            <Text style={styles.repeatLabel}>Repeat Every</Text>
            <View style={styles.repeatBox}>
              <WheelPicker
                data={numChoices}
                selectedIndex={form.repeatNum}
                onChangeValue={(val) => setForm({ ...form, repeatNum: val })}
                infiniteScroll={false}
                containerStyle={styles.wheelPicker}
                restElements={1}
              />
              <WheelPicker
                data={periods}
                selectedIndex={0}
                onChangeValue={(val) => setForm({ ...form, repeatPeriod: periods[val] })}
                infiniteScroll={false}
                containerStyle={styles.wheelPicker}
                restElements={1}
              />
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.labelText}>Alert Type</Text>
            <View style={styles.alertButtonContainer}>
              {[
                { label: 'None', value: 'none' },
                { label: 'Standard', value: 'standard' },
                { label: 'Gradual', value: 'gradual' }
              ].map((alert) => (
                <TouchableOpacity
                  key={alert.value}
                  style={[
                    styles.alertButton,
                    form.alertType === alert.value && styles.selectedAlert
                  ]}
                  onPress={() => setForm({ ...form, alertType: alert.value })}
                >
                  <Text style={styles.alertButtonText}>
                    {alert.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caddd7'
  },
  safeArea: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  checkBoxContainer: {
    width: '90%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 15,
    padding: 0,
  },
  inputBox: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 50,
    width: '90%',
    fontSize: 16,
    color: '#0d522c',
    marginBottom: 15,
  },
  categoryContainer: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '90%',
    marginBottom: 15,
  },
  categoryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryButton: {
    padding: 6,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#0d522c',
  },
  categoryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  dateTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 50,
    width: '90%',
    marginBottom: 15,
  },
  labelText: {
    fontSize: 16,
    color: '#6b917f',
    marginRight: 10
  },
  dateTimePicker: {
    flex: 1
  },
  repeatContainer: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    width: '90%',
    padding: 10,
    marginBottom: 10,
  },
  repeatLabel: {
    fontSize: 16,
    color: '#6b917f',
    marginBottom: 10
  },
  repeatBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    height: 100 
  },
  switchLabel: {
    fontSize: 16,
    color: '#6b917f'
  },
  alertButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  alertButton: {
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedAlert: {
    backgroundColor: '#77bba2',
    borderWidth: 2,
    borderColor: '#0d522c',
  },
  alertButtonText: {
    color: '#0d522c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  wheelPicker: {
    flex: 1,
    height: 80,
  },
  submitButton: {
    backgroundColor: '#77bba2',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#0d522c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 8,
    borderWidth: 2,
    borderColor: '#77bba2',
  },
  completedButton: {
    backgroundColor: '#77bba2',
    borderColor: '#0d522c',
  },
  completeButtonText: {
    color: '#6b917f',
    fontSize: 16,
    fontWeight: '600',
  },
  completedButtonText: {
    color: '#ffffff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 10,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const newStyles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  completedButton: {
    backgroundColor: '#77bba2',
  },
  completeButtonText: {
    color: '#0d522c',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 10,
  },
});

export default EditExistingTaskScreen;