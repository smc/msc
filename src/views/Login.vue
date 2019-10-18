<template>
  <section>
    <h5 class="center-align">
      Redirecting...
    </h5>
  </section>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Login",
  data() {
    return {};
  },
  mounted() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithRedirect(provider)
      .then(function(result) {
        // if (result.credential) {
        //   // This gives you a Google Access Token. You can use it to access the Google API.
        //   var token = result.credential.accessToken;
        // }
        // The signed-in user info.
        const user = result.user;
        this.$store.commit("setUser", user);
        this.$store.commit("setIsAuthenticated", true);
        this.$router.push("/");
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // eslint-disable-next-line no-console
        console.error(errorCode, errorMessage);
      });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setUser", user);
        this.$store.commit("setIsAuthenticated", true);
        this.$router.push("/");
      } else {
        // Show sign in screen with button above.
      }
    });
  }
};
</script>

<style></style>
