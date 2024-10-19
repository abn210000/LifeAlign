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
  ScrollView,
} from "react-native";
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

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

  const [open, setOpen] = useState(false);
  const [alertTyp, setAlertTyp] = useState('');
  const [items, setItems] = useState([
    { label: 'None', value: 'none' },
    { label: 'Standard', value: 'standard' },
    { label: 'Gradual', value: 'gradual' }
  ]);

  const numChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const periods = ['-', 'Days', 'Weeks', 'Months', 'Years'];

  const handleSubmit = () => {
    let dateFin = moment(form.date).format('YYYY-MM-DD');
    let timeFin = moment(form.time).format('HH:mm:ss');
    setForm({ ...form, alertType: alertTyp });
    
    console.log('Title: ', form.title);
    console.log('Category: ', form.category);
    console.log('Date: ', dateFin);
    console.log('Time: ', timeFin);
    console.log('Repeat Number: ', form.repeatNum);
    console.log('Repeat Period: ', form.repeatPeriod);
    console.log('Alert Type: ', form.alertType);

    // Navigate back to the home screen after submitting
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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TextInput
            style={styles.inputBox}
            placeholder='Title'
            placeholderTextColor="#6b917f"
            onChangeText={(val) => setForm({ ...form, title: val })}
          />

          <TextInput
            style={styles.inputBox}
            placeholder='Category'
            placeholderTextColor="#6b917f"
            onChangeText={(val) => setForm({ ...form, category: val })}
          />

          <View style={styles.dateTimeBox}>
            <Text style={styles.labelText}>Date</Text>
            <DateTimePicker
              mode='date'
              display='default'
              value={form.date}
              onChange={handleDateChange}
              style={styles.dateTimePicker}
            />
          </View>

          <View style={styles.dateTimeBox}>
            <Text style={styles.labelText}>Time</Text>
            <DateTimePicker
              mode='time'
              display='default'
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

          <View style={styles.dropdownContainer}>
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
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caddd7',
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
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
  labelText: {
    fontSize: 16,
    color: '#6b917f',
    marginRight: 10,
  },
  dateTimePicker: {
    flex: 1,
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
    marginBottom: 10,
  },
  repeatBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  wheelPicker: {
    flex: 1,
    height: 150,
  },
  dropdownContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
  },
  dropdownPicker: {
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    borderWidth: 0,
    height: 50,
    width: '100%',
  },
  dropdownList: {
    backgroundColor: '#fcfcfc',
    borderColor: '#77bba2',
    borderWidth: 0,
    width: '100%',
  },
  dropdownText: {
    fontSize: 16,
    color: '#0d522c',
  },
  dropdownPlaceholder: {
    color: '#6b917f',
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