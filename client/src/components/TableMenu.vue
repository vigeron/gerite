<template>
  <v-menu bottom left min-width="200">
    <template v-slot:activator="{ on }">
      <v-btn text
        v-on="on"
      >
        <v-avatar size="32">
          <img :src="$store.state.avatar" class="avatar" alt="">
        </v-avatar>
        {{ $store.state.username }}
      </v-btn>
    </template>
      <v-list dense>
          <v-subheader>Menu</v-subheader>
          <v-list-item-group v-model="current_item">
            <template v-for="item in items">
              <v-list-item v-if="item.condition" :key="item.title" @click="menuAction(item.action)">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
      </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'table-menu',
  data() {
    return {
      current_route: null,
      current_item: null,
      items: [],
    };
  },
  mounted() {
    console.log(this.$store.state.avatar);
    this.generateMenu();
    this.$router.afterEach((to, from) => {
      this.current_route = to.name;
      this.generateMenu();
    });
  },
  methods: {
    generateMenu() {
      this.items = [
        {
          icon: 'mdi-logout',
          title: this.$t('logout'),
          condition: true,
          action: 'logout',
        },
        {
          icon: 'mdi-wrench',
          title: this.$t('settings'),
          condition: true,
          action: 'settings',
        },
        {
          icon: 'mdi-delete',
          title: this.$t('delete-board'),
          condition: this.current_route === 'board',
          action: 'delete-board',
        },
      ];
    },
    async menuAction(action) {
      if (action === 'delete-board') {
        const result = window.confirm('Are you sure you want to delete this board');
        if (!result) {
          return;
        }
        try {
          /* eslint no-underscore-dangle: 0 */
          const boardId = this.$store.state.current_board._id;
          await this.$http.delete(`/boards/${boardId}`);
          const index = this.$store.state.boards.map(item => item._id === boardId);
          this.$store.state.boards.splice(index, 1);
          this.$router.push('dashboard');
        } catch (err) {
          console.log(err);
        }
      }

      if (action === 'logout') {
        this.$store.commit('logout', '/');
      }
    },
  },
};
</script>
<style>
.v-avatar img {
  margin-right:0.3rem;
}
</style>
