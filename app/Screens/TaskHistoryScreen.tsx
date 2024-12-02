import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTaskContext } from '../src/context/TaskContext';
import moment from 'moment';
import { categories } from '../src/config/categories';
import { Feather } from '@expo/vector-icons';
import { Task } from '../src/types/Tasks';

export default function TaskHistoryScreen() {
  const { allTasks } = useTaskContext();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter completed tasks and sort them by completion date
  const completedTasks = allTasks
    .filter(task => task.completed)
    .sort((a, b) => {
      const dateA = moment(`${a.date} ${a.time}`);
      const dateB = moment(`${b.date} ${b.time}`);
      return sortOrder === 'desc' 
        ? dateB.valueOf() - dateA.valueOf()
        : dateA.valueOf() - dateB.valueOf();
    });

  const getCategoryDetails = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return {
      color: category?.color || '#6b917f',
      label: category?.label || categoryValue
    };
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const categoryDetails = getCategoryDetails(item.category);
    const taskDate = moment(item.date).format('MMM D, YYYY');
    const taskTime = moment(item.time, 'HH:mm').format('h:mm A');

    return (
      <View style={styles.taskItem}>
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text style={[styles.taskTitle, styles.completedTask]}>
              {item.title}
            </Text>
            <Feather name="check-circle" size={20} color="#77bba2" />
          </View>
          <View style={styles.taskDetails}>
            <View style={[styles.categoryBox, { backgroundColor: categoryDetails.color }]}>
              <Text style={styles.categoryText}>{categoryDetails.label}</Text>
            </View>
            <Text style={styles.dateTimeText}>Completed on {taskDate} at {taskTime}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task History</Text>
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={toggleSortOrder}
        >
          <Feather 
            name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
            size={24} 
            color="#0d522c" 
          />
        </TouchableOpacity>
      </View>

      {completedTasks.length > 0 ? (
        <FlatList
          data={completedTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          style={styles.taskList}
        />
      ) : (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>No completed tasks found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caddd7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#caddd7',
    borderBottomWidth: 1,
    borderBottomColor: '#caddd7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d522c',
  },
  sortButton: {
    padding: 8,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryIndicator: {
    width: 8,
    height: '100%',
  },
  taskContent: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e2e2e',
    flex: 1,
    marginRight: 8,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  taskDetails: {
    flexDirection: 'column',
    gap: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#757575',
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noTasksText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  categoryBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
}); 