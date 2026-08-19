importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// Initialize Firebase in Service Worker
const firebaseConfig = {
  apiKey: "AIzaSyBp1yyC1IF_rmOWwFdZRcbcsCHNbJ3Sdro",
  authDomain: "mnr-devops-2e97d.firebaseapp.com",
  projectId: "mnr-devops-2e97d",
  storageBucket: "mnr-devops-2e97d.firebasestorage.app",
  messagingSenderId: "464172080556",
  appId: "1:464172080556:web:97cecddd2e236f387aee09",
  measurementId: "G-9SXTYCDF9W"
};

if (firebaseConfig.apiKey && typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("[firebase-messaging-sw.js] Received background message: ", payload);
      const notificationTitle = payload.notification?.title || "FITNESS Notification";
      const notificationOptions = {
        body: payload.notification?.body || "You have a new update from FITNESS.",
        icon: "assets/images/icon.png",
        badge: "assets/images/icon.png"
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (e) {
    console.warn("[firebase-messaging-sw.js] Init notice:", e);
  }
}
