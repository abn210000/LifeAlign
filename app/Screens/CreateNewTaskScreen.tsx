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
} from "react-native";
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTaskContext } from '../src/context/TaskContext';
import { categories, getCategoryColor } from '../src/config/categories';

const CreateNewTaskScreen = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    category: '',
    date: new Date(),
    time: new Date(),
    alertType: '',
    repeatNum: 0,
    repeatPeriod: ''
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryItems] = useState(categories);

  const [open, setOpen] = useState(false);
  const [alertTyp, setAlertTyp] = useState('');
  const [items, setItems] = useState([
    { label: 'None', value: 'none' },
    { label: 'Standard', value: 'standard' },
    { label: 'Gradual', value: 'gradual' }
  ]);

  const numChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const periods = ['-', 'Days', 'Weeks', 'Months', 'Years'];

  const { addTask } = useTaskContext();

  const handleSubmit = async () => {
    const newTask = {
      title: form.title,
      category: form.category,
      date: moment(form.date).format('YYYY-MM-DD'),
      time: moment(form.time).format('HH:mm'),
      alertType: alertTyp,
      repeatNum: form.repeatNum,
      repeatPeriod: form.repeatPeriod,
      completed: false
    };

    await addTask(newTask);
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
                selectedIndex={0}
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
              placeholder="Select Alert Type"
              style={styles.dropdownPicker}
              dropDownContainerStyle={styles.dropdownList}
              textStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={1000}
            />
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
  dropdownContainer: {
    width: '90%',
    marginBottom: 15,
    zIndex: 1000,
  },
  dropdownPicker: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    height: 50,
    borderWidth: 0,
    borderColor: 'transparent',
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