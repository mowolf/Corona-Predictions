import firebase from 'firebase';
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyDkaxQI7fx47w8ljrDkM0OXqCuU0QqJkH8",
  authDomain: "corona-791bb.firebaseapp.com",
  databaseURL: "https://corona-791bb.firebaseio.com",
  projectId: "corona-791bb",
  storageBucket: "corona-791bb.appspot.com",
  messagingSenderId: "1016480842033",
  appId: "1:1016480842033:web:a3a8f993d57ffa8b38b010",
  measurementId: "G-01PRTGBR0K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// initialize the app only when we are sure Firebase Auth object is ready to use
firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
