<template>
  <v-container fluid>
    <v-flex xs12 lg12>
      <v-form ref="form" v-if="user">
        <v-text-field
          disabled
          label="Name"
          :value="user.displayName"
        ></v-text-field>

        <v-text-field
          label="E-mail"
          required
          disabled
          :value="user.email"
        ></v-text-field>
        <v-select
          v-model="gender"
          :items="genderOptions"
          label="Gender that match your voice"
          required
        />
        <v-select
          v-model="ageGroup"
          :items="ageGroups"
          label="Age group"
          required
        />
        <v-row>
          <v-col cols="12" offset-lg="5" offset-sm="5" offset-xs="5">
            <v-btn color="success" @click="saveUser(user)">
              <v-icon>{{ mdiContentSave }}</v-icon> Save
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-flex>
  </v-container>
</template>

<script>
import { mdiContentSave } from "@mdi/js";
import { db } from "../plugins/db";
import { mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      mdiContentSave,
      gender: "Male",
      genderOptions: ["Male", "Female", "Other"],
      ageGroup: "20-30",
      ageGroups: [
        "0-5",
        "5-10",
        "10-15",
        "15-20",
        "20-30",
        "30-40",
        "40-50",
        "50-60",
        "60-70",
        "70-80",
        "80 and above"
      ],
      isLoading: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  mounted: function() {
    if (this.user) {
      db.collection("users")
        .doc(this.user.uid)
        .get()
        .then(doc => {
          const docDict = doc.data();
          this.ageGroup = docDict.ageGroup;
          this.gender = docDict.gender;
        });
    }
  },
  methods: {
    saveUser(user) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            gender: this.gender,
            ageGroup: this.ageGroup
          },
          { merge: true }
        );
    }
  }
};
</script>
