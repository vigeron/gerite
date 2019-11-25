<template>
  <v-container class="container">
    <v-breadcrumbs :items="breadcrumbs" divider=">" large></v-breadcrumbs>
      <draggable
        v-model="mlist"
        filter=".ignore-elements"
        class="lists"
        handle=".handle"
        >
          <List lists="lists" v-for="list in lists" :item="list" :key="list._id" />
          <v-card class="lists--add" outlined>
            <v-card-text>
              <a @click="showFormName()" v-if="!inputName">+ {{ $t('add-list') }}</a>
              <v-form v-if="inputName">
                <v-text-field outlined v-model="listName" dense class="text-field"></v-text-field>
                <v-btn dark color="teal" small @click="createList()">{{ $t('add-list') }}</v-btn>
                <v-btn @click="hideFormName()" text><v-icon>mdi-close</v-icon></v-btn>
              </v-form>
            </v-card-text>
          </v-card>
      </draggable>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import List from '@/components/List.vue';

export default {
  name: 'board',
  components: {
    draggable,
    List,
  },
  data() {
    return {
      inputName: false,
      isLoading: false,
      boardName: null,
      listName: '',
      breadcrumbs: [
        { text: 'Dashboard', disabled: false, to: '/dashboard' },
      ],
      form: {},
    };
  },
  mounted() {
    this.breadcrumbs.push({ text: this.$store.state.current_board.name, disabled: true });
    this.loadLists();
  },
  computed: {
    mlist: {
      get() {
        return this.$store.state.lists;
      },
      set(lists) {
        this.$store.dispatch('updateSortList', lists);
      },
    },
    ...mapGetters({ lists: 'lists' }),
  },
  methods: {
    async loadLists() {
      this.isLoading = true;
      let result;
      try {
        result = await this.$http.get(`/lists/${this.$route.params.id}`);
        this.$store.commit('setLists', result.data);
      } catch (err) {
        if (err.response.status === 401) {
          this.$store.commit('logout', '/login');
        }
      }
      this.isLoading = false;
      return result.data;
    },
    showFormName() {
      this.inputName = true;
    },
    hideFormName() {
      this.inputName = false;
    },
    async createList() {
      if (this.listName) {
        const form = {
          name: this.listName,
          boardId: this.$route.params.id,
        };
        const result = await this.$http.post('/lists', form);
        this.lists.push(result.data);
        this.hideFormName();
        this.listName = '';
      }
    },
  },
};
</script>
<style lang="scss">
.container {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  max-width:100%;
  padding: 0;
}

.lists--add {
  min-width: 230px;
  position: relative;
  padding-right:0.5rem;
}

.text-field {
  height: 42px !important;
}
.sortable-ghost {
  opacity: 0;
}
.sortable-drag {
  transform: rotate(-0.1rad) !important;
  opacity: 1;
}

.lists {
  margin:0;
  display: flex;
  overflow: auto;
  padding-bottom: 1rem;
  height: calc(100% - 65px);
}
</style>
