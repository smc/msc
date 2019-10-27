<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline">
        <v-icon large color="primary">{{ mdiTextToSpeech }}</v-icon>
        Malayalam Speech Corpus
      </v-toolbar-title>
      <v-spacer />
      <v-menu v-if="user" left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>{{ mdiAccountCircle }}</v-icon>
          </v-btn>
        </template>

        <v-list shaped>
          <v-list-item>
            <v-list-item-title>
              <v-icon>{{ mdiAccountCircle }}</v-icon>
              {{ user.displayName }}</v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon>{{ mdiExitRun }}</v-icon>
              Logout</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <v-bottom-navigation>
      <v-btn value="record" to="record">
        <span>Record</span>
        <v-icon>{{ mdiMicrophone }}</v-icon>
      </v-btn>

      <v-btn value="review" to="review">
        <span>Review</span>
        <v-icon>{{ mdiCommentCheckOutline }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import {
  mdiExitRun,
  mdiCommentCheckOutline,
  mdiMicrophone,
  mdiAccountCircle,
  mdiTextToSpeech
} from "@mdi/js";
import { mapState } from "vuex";
import firebase from "firebase/app";
import { db } from "./plugins/db";

export default {
  name: "App",
  data: () => ({
    mdiTextToSpeech,
    mdiExitRun,
    mdiMicrophone,
    mdiAccountCircle,
    mdiCommentCheckOutline
  }),
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  watch: {
    user: function() {
      if (this.user) {
        this.saveUser(this.user);
      }
    }
  },
  methods: {
    saveUser(user) {
      db.collection("users")
        .doc(user.uid)
        .set({
          name: user.displayName,
          email: user.email
        });
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.commit("setUser", null);
          this.$store.commit("setIsAuthenticated", false);
          this.$router.push("/login");
        });
    }
  }
};
</script>
