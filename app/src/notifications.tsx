import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import moment from 'moment';
import { TaskService } from '../src/services/TaskService';
import { router } from 'expo-router';

//Set Notification Handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

//Registers notifications and asks for permissions from device
export async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found');
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(token);
        } catch (e) {
            token = `${e}`;
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

//Main setup for notifications
export default function Notification() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
}

//Values needed for scheduling gradual notifications
const diffs = [
    moment.duration(30, 'm'), moment.duration(1, 'h'), moment.duration(3, 'h'),
    moment.duration(1, 'd'), moment.duration(3, 'd'), moment.duration(1, 'w'),
    moment.duration(2, 'w'), moment.duration(1, 'M'), moment.duration(2, 'M')];
const numbers = [30, 1, 3, 1, 3, 1, 2, 1, 2];
const periods = ['minutes', 'hour', 'hours', 'day', 'days', 'week', 'weeks', 'month', 'months'];

//Set categories for interactive notifications
Notifications.setNotificationCategoryAsync("standard", [
    {
        buttonTitle: "Mark As Completed",
        identifier: "completed",
        options: { opensAppToForeground: false }
    }, {
        buttonTitle: "Push To Tomorrow",
        identifier: "push",
        options: { opensAppToForeground: false }
    }, {
        buttonTitle: "Edit Task",
        identifier: "edit",
        options: { opensAppToForeground: true }
    }, {
        buttonTitle: "Delete Task",
        identifier: "delete",
        options: { opensAppToForeground: false }
    },
]);

//Handles responses from users from interactive notifications
Notifications.addNotificationResponseReceivedListener((response) => {
    Notifications.getNotificationCategoriesAsync().then(async (category) => {
        const task = await TaskService.getTaskByNotification(response.notification.request.identifier);
        if (response.actionIdentifier === "completed") {
            //Cancel task's notifications
            if (task?.notifId) {
                await cancelNotification(task.notifId);
            }
            //Update task to be completed and make the array of notification ids empty
            if (task?.id) {
                const completedTask = { ...task, completed: true, notifId: [''] };
                await TaskService.updateTask(task.id, completedTask);
            }
        } else if (response.actionIdentifier === "push") {
            if (task?.date) {
                //Cancel old notifications
                if (task?.notifId) {
                    await cancelNotification(task.notifId);
                }
                //Create new date one day after old
                let newDate = new Date(task.date);
                let newDay = newDate.getUTCDate() + 1;
                newDate.setDate(newDay);
                //Schedule new notifications and update task
                let newNotifIds;
                if (task?.alertType) {
                    newNotifIds = await scheduleNotification(task.title, moment(newDate).format('YYYY-MM-DD'), task.time, task.alertType)
                }
                if (task?.id) {
                    const completedTask = { ...task, date: moment(newDate).format('YYYY-MM-DD'), notifId: newNotifIds };
                    await TaskService.updateTask(task.id, completedTask);
                }
            }
        } else if (response.actionIdentifier === "edit") {
            //Open app to the task's edit screen
            if (task) {
                router.push({
                    pathname: '/Screens/EditExistingTaskScreen',
                    params: { taskId: task.id }
                });
            }
        } else if (response.actionIdentifier === "delete") {
            //Cancel task's notifications
            if (task?.notifId) {
                await cancelNotification(task.notifId);
            }
            //Delete task
            if (task?.id) {
                await TaskService.deleteTask(task.id);
            }
        }
    });
});

//Schedule notifications based on alert type and return their notification ids
export async function scheduleNotification(title: String, date: String, time: String, type: string) {
    const ids = [''];
    const day = new Date(date + "T" + time);
    let stan = type.localeCompare('standard');
    let grad = type.localeCompare('gradual');
    //Standard Notification: one-time alert at specified date and time
    if (stan == 0 || grad == 0) {
        let id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "LifeAlign",
                body: title + " is due now!",
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                categoryIdentifier: "standard"
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: day
            },
        });
        ids.push(id);
        //Gradual Notifications: scheduled at certain times before the due date
        if (grad == 0) {
            for (let i = 0; i < 9; i++) {
                let d = moment(day).subtract(diffs[i]).toDate();
                let now = new Date();
                if (d > now) {
                    let id = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "LifeAlign",
                            body: title + " is due in " + numbers[i] + " " + periods[i] + "!",
                            categoryIdentifier: "standard"
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.DATE,
                            date: d
                        },
                    });
                    ids.push(id);
                }
            }
        }
    }

    return ids;
}

//Cancels a task's notifications
export async function cancelNotification(ids: string[]) {
    ids.forEach((id) =>
        Notifications.cancelScheduledNotificationAsync(id)
    );
}

