importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDX5QQPVMX_voM8yu91UUSVfNjx_o2LZu4",
  projectId: "gonullu-platformu",
  messagingSenderId: "856922058895",
  appId: "1:856922058895:web:58c745ab02a54e98e600fa",
});

const messaging = firebase.messaging();