// NotificationService.js
import PushNotification from 'react-native-push-notification';

const configureNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
};

const showNotification = (title, message) => {
  PushNotification.localNotification({
    title: title,
    message: message,
    channelId: 'pomodoro-channel', // Android: Crie um canal de notificação
    playSound: true,
    soundName: 'default',
  });
};

export { configureNotifications, showNotification };