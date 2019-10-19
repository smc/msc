<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline">
        <v-icon large color="primary">{{ mdiTextToSpeech }}</v-icon>
        Malayalam Speech Corpus
      </v-toolbar-title>
      <v-spacer />
      <v-menu v-if="username" left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>{{ mdiAccountCircle }}</v-icon>
          </v-btn>
        </template>

        <v-list shaped>
          <v-list-item>
            <v-list-item-title>
              <v-icon>{{ mdiAccountCircle }}</v-icon>
              {{ username }}</v-list-item-title
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
  </v-app>
</template>

<script>
import { mdiExitRun, mdiAccountCircle, mdiTextToSpeech } from "@mdi/js";
import { mapState } from "vuex";
import firebase from "firebase/app";

export default {
  name: "App",
  data: () => ({
    mdiTextToSpeech,
    mdiExitRun,
    mdiAccountCircle
  }),
  computed: {
    ...mapState({
      username: state => state.user && state.user.displayName
    })
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.commit("setUser", null);
          this.$store.commit("setIsAuthenticated", false);
        });
    }
  }
};
</script>
