<template>
  <v-container fluid class="boards-container">
        <v-breadcrumbs :items="breadcrumbs" divider=">" large></v-breadcrumbs>
        <v-flex>
          <v-layout
            class="d-flex flex-wrap boards"
            flat
          >
          <v-card v-for="board in boards"
              v-bind:key="board.slug"
              @click.once="showBoard(board)"
              :style ="{ 'background': board.background }"
              class="boards__item"
              outlined
          >
              {{ board.name }}
          </v-card>
          <v-card class="boards__item boards__add" @click="openFormBoardModal" outlined>
            <v-icon>mdi-plus-circle</v-icon>
          </v-card>
        </v-layout>
        </v-flex>
         <v-overlay :absolute="absolute" :opacity="opacity" :value="overlay">
           <v-card color="#006064">
             <v-card-title>{{ $t('enter-name-board') }}</v-card-title>
              <v-form ref="form" v-model="valid" @submit.prevent="createBoard">
                <div class="modalBoardForm">
                  <div v-if="alert" class="error">{{ alertMessage }}</div>
                  <v-text-field
                    v-model="form.name"
                    required
                    outlined>
                  </v-text-field>
                  <template v-for="(bg, index) in backgrounds">
                    <label class="color-item" :key=index>
                      <input type="radio" v-model="form.background" :value=bg name="background">
                      <div class="select-color" :style = "{ 'background': bg }"></div>
                    </label>
                  </template>
                  <div class="modalBoardForm__buttons">
                    <v-btn type="submit">{{ $t('create-board') }}</v-btn>
                    <v-btn @click="closeFormBoardModal">{{ $t('cancel') }}</v-btn>
                  </div>
                </div>
                </v-form>
           </v-card>
         </v-overlay>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'dashboard',
  data() {
    return {
      absolute: true,
      alertMessage: '',
      alert: false,
      opacity: 0.9,
      overlay: false,
      valid: false,
      isLoading: false,
      backgrounds: ['white', 'green', 'lime', 'yellow', 'blue', 'red', 'orange', 'purple'],
      breadcrumbs: [
        { text: 'Dashboard', disabled: true },
      ],
      form: {},
    };
  },
  computed: {
    ...mapGetters({ boards: 'boards' }),
  },
  created() {
    this.$store.commit('setLists', []);
    this.loadBoards();
  },
  methods: {
    async loadBoards() {
      if (this.isLoading === true) {
        return;
      }
      let res;
      this.isLoading = true;
      try {
        res = await this.$http.get('/boards');
        this.$store.commit('setBoards', res.data);
      } catch (err) {
        if (err.response.status === 401) {
          this.$store.commit('logout', '/login');
        }
      }
      this.isLoading = false;
    },
    openFormBoardModal() {
      this.form = {};
      this.overlay = true;
    },
    closeFormBoardModal() {
      this.overlay = false;
      this.alert = false;
    },
    async createBoard() {
      let board;
      try {
        console.log(this.form);
        board = await this.$http.post('/boards', this.form);
        this.boards.push(board.data);
        this.closeFormBoardModal();
      } catch (err) {
        this.alert = true;
        this.alertMessage = this.$t(err.response.data.message);
      }
    },
    showBoard(board) {
      this.$store.commit('setBoard', board);
      /* eslint no-underscore-dangle: 0 */
      this.$router.push({ path: `/board/${board._id}/${board.slug}` });
    },
  },
};
</script>
<style lang="scss">
.boards-container {
  align-self: flex-start;
}
.boards {
  overflow: auto;
  &__item {
    cursor: pointer;
    margin: 0.5rem;
    padding: 0.5rem;
    height: 100px;
    width: 18%;
    min-width: 160px;
    position: relative;
    &:hover::after {
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      background: #000000;
      opacity: 0.1;
    }
  }

  &__add {
    line-height: 90px;
    text-align: center;
    background-color: #dddddd !important;
  }
}

.modalBoardForm {
  text-align: center;
  padding: 0 1rem;
  &__label {
    display: block;
    margin: 1rem;
  }

  &__buttons {
    margin: 1rem;

    button {
      margin: 0.5rem;
    }
  }

  .color-item {
    .select-color {
    display: inline-block;
    width:20%;
    height:50px;
    margin:5px;
    }
    & > input {
      visibility: hidden; /* Makes input not-clickable */
      position: absolute; /* Remove input from document flow */
    }
    & > input + div {
      cursor:pointer;
      border:2px solid transparent;
    }
    & > input:checked + div{
      border: 1px solid #000000;
    }
  }
}

.v-dialog__container {
    display: unset;
}


</style>
