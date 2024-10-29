import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../src/context/TaskContext';
import { Task } from '../src/types/Tasks';
import { categories } from '../src/config/categories';

export default function EditTaskList() {
  const router = useRouter();
  const { tasks } = useTaskContext();

  const getCategoryDetails = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return {
      color: category?.color || '#6b917f',
      label: category?.label || categoryValue
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const categoryDetails = getCategoryDetails(item.category);
    
    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => router.push({
          pathname: '/Screens/EditExistingTaskScreen',
          params: { taskId: item.id }
        })}
      >
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View style={styles.taskDetails}>
            <View style={[
              styles.categoryBox,
              { backgroundColor: categoryDetails.color }
            ]}>
              <Text style={styles.categoryText}>{categoryDetails.label}</Text>
            </View>
            <Text style={styles.taskDateTime}>
              {formatDate(item.date)} at {item.time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
  taskContent: {
    gap: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d522c',
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  categoryBox: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskDateTime: {
    fontSize: 14,
    color: '#6b917f',
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