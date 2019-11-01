<template>
  <v-container fluid>
    <v-layout justify-center wrap class="my-4" align-center>
      <section>
        <loading :active.sync="isLoading"> </loading>
        <v-btn x-large @click="login">
          <v-icon color="primary">{{ mdiGoogle }}</v-icon>
          Login using Google
        </v-btn>
        <p>
          <strong>Note</strong>
        </p>
        <p>
          By using this application you agree to release your contributions
          under CC-BY-SA License
        </p>
        <p>
          You also agree to publish your Name and email for attribution purposes
        </p>
      </section>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { mdiGoogle } from "@mdi/js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "Login",
  data() {
    return {
      mdiGoogle,
      authProvider: new firebase.auth.GoogleAuthProvider(),
      isLoading: false
    };
  },
  components: {
    Loading
  },
  mounted: function() {
    this.isLoading = true;
    firebase.auth().onAuthStateChanged(user => {
      this.isLoading = false;
      if (user) {
        this.$router.replace("/record");
      }
    });
  },
  methods: {
    login() {
      firebase.auth().signInWithRedirect(this.authProvider);
    }
  }
};
</script>
