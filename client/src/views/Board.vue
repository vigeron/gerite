<template>
  <v-container class="container">
    <v-breadcrumbs icons divider=">" large>
      <v-breadcrumbs-item href="/dashboard">
        Dashboard
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        <template v-if="editName !== currentBoard">
          {{ currentBoard.name }}
          <v-btn text icon x-small @click="editBoardName">
            <v-icon x-small>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-text-field
            v-model="currentBoard.name"
            single-line
            dense
            solo
            flat
            outlined
            @blur="updateBoardName"
            v-on:keyup.enter="updateBoardName"
            class="inputBoardName"
            hide-details>
          </v-text-field>
        </template>
      </v-breadcrumbs-item>
    </v-breadcrumbs>
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
      isEditBoardName: false,
      inputName: false,
      isLoading: false,
      listName: '',
      breadcrumbs: [
        { text: 'Dashboard', disabled: false, to: '/dashboard' },
      ],
      form: {},
    };
  },
  mounted() {
    this.breadcrumbs.push({ text: `${this.$store.state.current_board.name} <v-icon>mdi-edit</v-icon>`, disabled: true });
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
    ...mapGetters({ lists: 'lists', currentBoard: 'currentBoard', editName: 'editName' }),
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
    editBoardName() {
      this.$store.commit('setEditName', this.currentBoard);
    },
    updateBoardName() {
      this.$store.commit('setEditName', null);
      this.$http.put(`/boards/${this.$route.params.id}`, { name: this.currentBoard.name });
      this.$store.commit('updateBoard');
      console.log('save boardname');
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

.v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot
{
  min-height:32px;
}

.v-btn:hover:before,
.v-btn:focus:before {
  color: blue;
}
</style>
