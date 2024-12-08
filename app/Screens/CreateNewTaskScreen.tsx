import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTaskContext } from '../src/context/TaskContext';
import { categories, getCategoryColor } from '../src/config/categories';
import { scheduleNotification } from '../src/notifications';



const CreateNewTaskScreen = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    category: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    alertType: '',
    repeatNum: 0,
    repeatPeriod: ''
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryItems] = useState(categories);
  const [mode, setMode] = useState('date');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const numChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const periods = ['-', 'Days', 'Weeks', 'Months', 'Years'];

  const { addTask, tasks } = useTaskContext();

  const checkTimeConflict = (startTime: Date, endTime: Date) => {
    return tasks.some(task => {
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
                { text: "OK", onPress: () => scheduleTask() }
            ]
        );
    } else {
        scheduleTask();
    }
  };

  const scheduleTask = async () => {
    try {
      // Schedule notifications and get notification ids
      const ids = await scheduleNotification(
        form.title,
        moment(form.date).format('YYYY-MM-DD'),
        moment(form.startTime).format('HH:mm'),
        form.alertType
      );
      
      const newTask = {
        id: Date.now().toString(),
        title: form.title,
        category: form.category,
        date: moment(form.date).format('YYYY-MM-DD'),
        startTime: moment(form.startTime).format('HH:mm'),
        endTime: moment(form.endTime).format('HH:mm'),
        alertType: form.alertType,
        repeatNum: form.repeatNum,
        repeatPeriod: form.repeatPeriod,
        completed: false,
        notifId: ids,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString()
      };

      await addTask(newTask);
      router.back();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

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
            /> : <Text>{moment(form.date).format('YYYY-MM-DD')}</Text>}
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
            <Text style={styles.submitButtonText}>Create Task</Text>
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
    padding: 15,
    marginBottom: 15,
  },
  repeatLabel: { 
    fontSize: 16, 
    color: '#6b917f', 
    marginBottom: 10 
  },
  repeatBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
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
    height: 150,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
});

export default CreateNewTaskScreen;