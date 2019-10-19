import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import dictaphone from "./plugins/dictaphone";
import { firestorePlugin } from "vuefire";
import router from "./router";
import store from "./store";

Vue.use(firestorePlugin);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  dictaphone,
  render: h => h(App),
  created() {
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      this.$router.push(redirect);
    }
  }
}).$mount("#app");
