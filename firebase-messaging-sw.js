importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// Initialize Firebase in Service Worker (Configured via Admin Settings)
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
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
