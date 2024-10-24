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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CheckBox } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useTaskContext } from '../src/context/TaskContext';
import { TaskService } from '../src/services/TaskService';

const EditExistingTaskScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    category: '',
    date: new Date(),
    time: new Date(),
    alertType: '',
    repeatNum: 0,
    repeatPeriod: '',
    completed: false,
  });

  const [open, setOpen] = useState(false);
  const [alertTyp, setAlertTyp] = useState('');
  const [items, setItems] = useState([
    { label: 'None', value: 'none' },
    { label: 'Standard', value: 'standard' },
    { label: 'Gradual', value: 'gradual' },
  ]);

  const numChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const periods = ['-', 'Days', 'Weeks', 'Months', 'Years'];

  const { updateTask, deleteTask } = useTaskContext();
  const { taskId } = useLocalSearchParams();

  // Ensure taskId is treated as a string
  const stringTaskId = Array.isArray(taskId) ? taskId[0] : taskId;

  // Load existing task data
  useEffect(() => {
    const loadTask = async () => {
      try {
        const task = await TaskService.getTask(stringTaskId);
        if (task) {
          // Parse the date and time strings into Date objects
          const taskDate = new Date(task.date);
          const [hours, minutes] = task.time.split(':').map(Number);
          const taskTime = new Date();
          taskTime.setHours(hours, minutes);

          setForm({
            title: task.title,
            category: task.category || '',
            date: taskDate,
            time: taskTime,
            alertType: task.alertType || '',
            repeatNum: task.repeatNum || 0,
            repeatPeriod: task.repeatPeriod || '',
            completed: task.completed || false,
          });
          setAlertTyp(task.alertType || '');
        }
      } catch (error) {
        console.error('Error loading task:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [stringTaskId]);

  const handleSubmit = async () => {
    const updates = {
      title: form.title,
      category: form.category,
      date: moment(form.date).format('YYYY-MM-DD'),
      time: moment(form.time).format('HH:mm'),
      alertType: alertTyp,
      repeatNum: form.repeatNum,
      repeatPeriod: form.repeatPeriod,
      completed: form.completed
    };

    await updateTask(stringTaskId, updates);
    router.back();
  };

  const handleDelete = async () => {
    await deleteTask(stringTaskId);
    router.back();
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || form.date;
    setForm({ ...form, date: currentDate });
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || form.time;
    setForm({ ...form, time: currentTime });
  };

  const toggleCompletion = () => {
    setForm((prevForm) => ({ ...prevForm, completed: !prevForm.completed }));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0d522c" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <CheckBox
            title="Mark as Complete"
            checked={form.completed}
            onPress={toggleCompletion}
            containerStyle={styles.checkBoxContainer}
            textStyle={styles.switchLabel}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Title"
            placeholderTextColor="#6b917f"
            value={form.title}
            onChangeText={(val) => setForm({ ...form, title: val })}
          />

          <TextInput
            style={styles.inputBox}
            placeholder="Category"
            placeholderTextColor="#6b917f"
            value={form.category}
            onChangeText={(val) => setForm({ ...form, category: val })}
          />

          <View style={styles.dateTimeBox}>
            <Text style={styles.labelText}>Date</Text>
            <DateTimePicker
              mode="date"
              display="default"
              value={form.date}
              onChange={handleDateChange}
              style={styles.dateTimePicker}
            />
          </View>

          <View style={styles.dateTimeBox}>
            <Text style={styles.labelText}>Time</Text>
            <DateTimePicker
              mode="time"
              display="default"
              value={form.time}
              onChange={handleTimeChange}
              style={styles.dateTimePicker}
            />
          </View>

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
                selectedIndex={periods.indexOf(form.repeatPeriod)}
                onChangeValue={(val) => setForm({ ...form, repeatPeriod: periods[val] })}
                infiniteScroll={false}
                containerStyle={styles.wheelPicker}
                restElements={1}
              />
            </View>
          </View>

          <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
            <DropDownPicker
              open={open}
              value={alertTyp}
              items={items}
              setOpen={setOpen}
              setValue={setAlertTyp}
              setItems={setItems}
              placeholder='Select Alert Type'
              style={styles.dropdownPicker}
              dropDownContainerStyle={styles.dropdownList}
              textStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={1000}
            />
          </View>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Feather name="trash-2" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#caddd7' },
  safeArea: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 50,
    width: '90%',
    fontSize: 16,
    color: '#0d522c',
    marginBottom: 15,
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
  labelText: { fontSize: 16, color: '#6b917f', marginRight: 10 },
  dateTimePicker: { flex: 1 },
  repeatContainer: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    width: '90%',
    padding: 15,
    marginBottom: 15,
  },
  repeatLabel: { fontSize: 16, color: '#6b917f', marginBottom: 10 },
  repeatBox: { flexDirection: 'row', justifyContent: 'space-around' },
  switchLabel: { fontSize: 16, color: '#6b917f' },
  dropdownContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkBoxContainer: { width: '90%', backgroundColor: 'transparent', borderWidth: 0 },
  
  dropdownPicker: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    height: 50,
    width: '100%',
    borderWidth: 0, // Remove border width
    borderColor: 'transparent', // Set border color to transparent
  },
  dropdownList: {
    backgroundColor: '#fcfcfc',
  },
  dropdownText: {
    fontSize: 16,
    color: '#6b917f',
  },
  dropdownPlaceholder: {
    color: '#6b917f',
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
    marginVertical: 15,
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default EditExistingTaskScreen;