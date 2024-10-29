import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../src/context/TaskContext';
import { Task } from '../src/types/Tasks';

export default function EditTaskList() {
  const router = useRouter();
  const { tasks } = useTaskContext();

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => router.push({
        pathname: '/Screens/EditExistingTaskScreen',
        params: { taskId: item.id }
      })}
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Task To Edit</Text>
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
        />
      ) : (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>No tasks available to edit</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caddd7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d522c',
    marginBottom: 20,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d522c',
  },
  taskDate: {
    fontSize: 14,
    color: '#6b917f',
    marginTop: 5,
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 18,
    color: '#6b917f',
    fontStyle: 'italic',
  },
});