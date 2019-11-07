import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import Recorder from "@/views/Recorder";
import Review from "@/views/Review";
import Settings from "@/views/Settings";
import Faq from "@/views/Faq";
import store from "@/store";
import firebase from "firebase/app";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/record",
      name: "Record",
      component: Recorder,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/review",
      name: "Review",
      component: Review,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/faq",
      name: "Faq",
      component: Faq
    },
    {
      path: "/profile",
      name: "Settings",
      component: Settings,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (currentUser) {
    console.log(`${currentUser.displayName} Logged in`);
    store.commit("setUser", currentUser);
    store.commit("setIsAuthenticated", true);
    requiresAuth = false;
  }
  if (requiresAuth) {
    if (!currentUser) {
      next("login");
    } else {
      next("record");
    }
  } else {
    next();
  }
});

export default router;
