<template>
  <v-container fluid>
    <v-layout justify-center wrap class="my-4" align-center>
      <section>
        <v-btn x-large @click="login">
          <v-icon color="primary">{{ mdiGoogle }}</v-icon> Login using Google
        </v-btn>
      </section>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { mdiGoogle } from "@mdi/js";

export default {
  name: "Login",
  data() {
    return { mdiGoogle, authProvider: new firebase.auth.GoogleAuthProvider() };
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => {
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
