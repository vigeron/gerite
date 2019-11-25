<template>
  <v-container fluid fill-height>
    <v-layout align-center>
      <v-card class="mx-auto" width="300">
        <v-card-title>{{ $t('register') }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="register">
            <v-text-field
              v-model="user.username"
              :rules="rules.noEmpty"
              :label="$t('username')"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              :rules="rules.emailValid"
              :label="$t('email')"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :rules="rules.noEmpty"
              :label="$t('password')"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.confirmPassword"
              :rules="[confirmPasswordRules]"
              :label="$t('confirm-password')"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.avatarUrl"
              :rules="rules.noEmpty"
              :label="$t('url-to-image')"
              required
            ></v-text-field>
            <v-btn class="mr-4" type="submit" :disabled="!valid">{{ $t('send') }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios';

export default {
  name: 'register',
  that: this,
  data: () => ({
    valid: false,
    user: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatarUrl: '',
    },
    rules: {
      noEmpty: [val => !!val || 'This field is required'],
      emailValid: [
        val => !!val || 'E-mail is required',
        val => /.+@.+\..+/.test(val) || 'E-mail must be valid',
      ],
    },
  }),
  methods: {
    confirmPasswordRules() {
      return this.user.password === this.user.confirmPassword || 'Passwords do not match';
    },
    async register() {
      if (this.valid) {
        let res;
        try {
          res = await this.$http.post('/auth/register', this.user);
        } catch (err) {
          // eslint-disable-next-line
          console.log(err)
        }
        // eslint-disable-next-line
        console.log(res.data);
        this.$store.commit('login', res.data);
        this.$router.push(this.$route.query.redirect || '/dashboard');
      }
    },
  },
};
</script>
