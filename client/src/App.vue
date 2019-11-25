<template>
  <v-app>
    <v-app-bar dark dense color="blue darken-2" max-height="48">
      <v-toolbar-title class="logo">
        <router-link to="/">Gerite</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="this.isLogged()">
        <v-btn text :to="{ name: 'dashboard' }" v-if="showBtnDashboard()">Dashboard</v-btn>
        <TableMenu />
      </v-toolbar-items>
      <v-toolbar-items v-if="!this.isLogged()">
        <v-btn text :to="{ name: 'register' }" >
          {{ $t('register') }}
        </v-btn>
        <v-btn text :to="{ name: 'login' }">{{ $t('login') }}</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
        <router-view/>
    </v-content>
    <v-footer class="caption">
      <v-spacer></v-spacer>
      <div>&copy; Gerite Task Manager &copy;2019</div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import TableMenu from '@/components/TableMenu.vue';

export default Vue.extend({
  name: 'App',
  components: {
    TableMenu,
  },
  created() {
    this.$store.commit('initStore');
  },
  methods: {
    showBtnDashboard() {
      return (this.isLogged() && this.$router.currentRoute.name !== 'dashboard');
    },
    isLogged() {
      return this.$store.state.access_token;
    },
  },
});
</script>

<style lang="scss">
body, html {
  overflow: hidden;
}
.v-application {
  background: #a1bddb !important;
}
.logo a {
  text-decoration: none;
  color: #ffffff !important;
}
</style>
