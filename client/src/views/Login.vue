<template>
  <v-container fluid fill-height>
    <v-layout align-center>
      <v-card class="mx-auto" width="300">
        <v-card-title>Login to Gerite</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="login">
            <v-text-field
              v-model="user.username"
              :rules="rules.noEmpty"
              :label="$t('username')"
              @click="clearError"
              required
            ></v-text-field>
            <v-text-field
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              v-model="user.password"
              :rules="rules.noEmpty"
              :label="$t('password')"
              @click="clearError"
              required
              :error-messages="alertMessage"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <div class="mt-4">
              <v-btn type="submit" :disabled="!valid">{{ $t('login') }}</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios';

export default {
  name: 'login',
  data: () => ({
    valid: false,
    alert: false,
    showPassword: false,
    alertMessage: null,
    user: {
      username: '',
      password: '',
    },
    rules: {
      noEmpty: [val => !!val || 'This field is required'],
    },
  }),
  methods: {
    async login() {
      if (this.valid) {
        let res;
        try {
          res = await this.$http.post('/auth/login', this.user);
          console.log(res.data);
          this.$store.commit('login', res.data);
        } catch (err) {
          // eslint-disable-next-line
          if(err.response.status === 400) {
            this.alertMessage = this.$t('wrong-password');
            this.alert = true;
          }
        }
      }
    },
    clearError() {
      this.alertMessage = null;
      this.alert = false;
    },
  },
};
</script>
