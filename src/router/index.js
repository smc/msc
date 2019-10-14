import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import SpeechSampler from "@/views/SpeechSampler";
import store from "@/store";

import firebase from "firebase/app";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: "/",
      name: "home",
      component: SpeechSampler,
      meta: {
        authRequired: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        store.commit("setUser", user);
        store.commit("setIsAuthenticated", true);
        next();
      } else {
        next({
          path: "/login"
        });
      }
    });
  } else {
    next();
  }
});

export default router;
