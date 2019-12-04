<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>
      <v-list dense>
          <v-list-item-group v-model="current_item">
            <template v-for="item in items">
              <v-list-item v-if="item.condition" :key="item._id" @click="item.action()">
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
/* eslint no-underscore-dangle: 0 */
export default {
  name: 'list-menu',
  props: ['list'],
  data() {
    return {
      current_route: null,
      current_item: null,
      items: [],
    };
  },
  mounted() {
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
          icon: 'mdi-delete',
          title: this.$root.$t('delete-list'),
          action: this.deleteList,
          condition: true,
        },
        {
          icon: 'mdi-archive',
          title: this.$t('archive-list'),
          action: this.archiveList,
          condition: true,
        },
      ];
    },
    async deleteList() {
      this.$store.dispatch('deleteList', this.$props.list._id);
    },
    async archiveList() {
      alert('The method is not yet implemented');
    },
  },
};
</script>
