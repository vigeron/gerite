<template>
    <v-card
      class="lists__list"
      outlined
    >
      <v-toolbar dense flat color="blue-grey lighten-5 handle" height="38">
        <template v-if="editName !== item">
          {{ item.name }}
          <v-btn text icon x-small @click="editListName(item)">
            <v-icon x-small>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-text-field
            v-model="item.name"
            single-line
            dense
            solo
            flat
            outlined
            @blur="updateListName(item)"
            v-on:keyup.enter="updateListName(item)"
            class="inputListName ignore-elements"
            hide-details>
          </v-text-field>
        </template>
        <v-spacer></v-spacer>
        <ListMenu :list="item" />
      </v-toolbar>
        <draggable group="lists"
          :list="cards"
          @change="moveCard"
          filter=".filtered"
          class="lists__wrapper"
        >
          <template v-for="card in cards">
            <v-hover v-slot:default="{ hover }" :key="card.id">
            <div
            class="lists__item-card"
            :class="[ card === editingCard ? 'edit-card' : '' ]"
            @mouseover="showEdit=!showEdit"
            @mouseleave="showEdit=!showEdit"
          >
              <v-btn
                text icon
                v-if="hover && card !== editingCard"
                class="edit-button"
                @click="editCard(card)">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <span v-if="card !== editingCard" v-html="textToHTML(card.text)"></span>
              <v-form v-if="card === editingCard" class="edit-form filtered">
                <v-textarea
                  class="edit-textarea"
                  outlined
                  v-model="editingCard.text"
                  dense
                  rows="1"
                  auto-grow
                  hide-details
                />
                <v-btn dark color="mt-2 teal" small @click="updateCard(card)">
                  {{ $t('save') }}
                </v-btn>
                <v-btn absolute right text small class="remove-button" @click="removeCard(card)">
                  {{ $t('remove') }}
                </v-btn>
              </v-form>
          </div>
          </v-hover>
          </template>
        <v-form v-if="inputText" class="lists__item-card filtered">
          <v-textarea
            outlined
            v-model="cardText"
            dense rows="1"
            auto-grow
            hide-details
          />
          <v-btn dark color="teal" small @click="createCard()">{{ $t('add-card') }}</v-btn>
          <v-btn @click="hideFormName()" text><v-icon>mdi-close</v-icon></v-btn>
        </v-form>

        </draggable>
        <div v-if="!inputText" class="lists__list--footer">
        <a @click="showFormName()" v-if="!inputText">+ {{ $t('add-card') }}</a>
       </div>
    </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import ListMenu from '@/components/ListMenu.vue';

export default {
  name: 'list',
  props: ['item'],
  data() {
    return {
      isEditName: false,
      inputText: false,
      showEdit: false,
      editingCard: null,
      cardText: '',
      cards: [],
    };
  },
  computed: {
    ...mapGetters({ editName: 'editName' }),
  },
  mounted() {
    this.loadLists();
  },
  methods: {
    showFormName() {
      this.inputText = true;
      this.editingCard = null;
      setTimeout(() => {
        const container = this.$el.querySelector('.lists__wrapper');
        container.scrollTop = container.scrollHeight;
      }, 50);
    },
    hideFormName() {
      this.inputText = false;
    },
    async loadLists() {
      this.isLoading = true;
      let result;
      try {
        result = await this.$http.get(`/cards/${this.item.boardId}/${this.item._id}`);
        this.cards = result.data;
      } catch (err) {
        if (err.response.status === 401) {
          this.$store.commit('logout', '/login');
        }
      }
      this.isLoading = false;
    },
    async createCard() {
      if (this.cardText) {
        const form = {
          text: this.cardText,
          boardId: this.item.boardId,
          /* eslint no-underscore-dangle: 0 */
          listId: this.item._id,
        };
        const result = await this.$http.post('/cards', form);
        this.cards.push(result.data);
      }
      this.cardText = '';
      this.hideFormName();
    },
    editCard(card) {
      this.editingCard = card;
      setTimeout(() => {
        const container = this.$el.querySelector('.lists__wrapper');
        const current = this.$el.querySelector('.edit-card');
        const scroll = current.offsetTop - 38 + current.clientHeight;
        if (scroll > container.clientHeight) {
          container.scrollTop = scroll - container.clientHeight;
        }
      }, 100);
    },
    async updateCard(card) {
      try {
        const result = await this.$http.put(`/cards/${card._id}`, card);
      } catch (err) {
        if (err && err.response.status === 401) {
          this.$store.commit('logout', '/login');
        }
      }
      this.editingCard = null;
    },
    async removeCard(card) {
      try {
        const result = await this.$http.delete(`/cards/${card._id}`);
        const index = this.cards.findIndex(item => item._id === card._id);
        this.cards.splice(index, 1);
      } catch (err) {
        if (err.response.status === 401) {
          this.$store.commit('logout', '/login');
        }
      }
      this.editingCard = null;
    },
    async moveCard(evt) {
      if (evt.added) {
        const index = this.cards.findIndex(item => item._id === evt.added.element._id);
        const form = {
          id: this.cards[index]._id,
          boardId: this.cards[index].boardId,
          removedListId: this.cards[index].listId,
          addedListId: this.item._id,
        };
        try {
          const result = await this.$http.post('/cards/move', form);
        } catch (err) {
          if (err.response.status === 401) {
            this.$store.commit('logout', '/login');
          }
        }
        this.cards[index].listId = this.item._id;
        this.saveOrdering();
      }
    },
    async saveOrdering() {
      /* eslint no-underscore-dangle: 0 */
      const res = this.cards.map((item, index) => item._id);
      try {
        await this.$http.post('/cards/ordering', res);
      } catch (err) {
        if (err.response.status === 401) {
          this.$store.commit('logout', '/login');
        }
      }
    },
    textToHTML(str) {
      // eslint-disable-line prefer-template
      const result = str.replace(/\*+(.*)?/gi, '<ul><li>$1</li></ul>').replace(/(<\/ul>\n(.*)<ul>*)+/gi, '');
      return result.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
    },
    editListName(_item) {
      this.$store.commit('setEditName', _item);
    },
    async updateListName(listItem) {
      this.$store.commit('setEditName', null);
      try {
        await this.$http.put(`/lists/${listItem._id}`, { boardId: listItem.boardId, name: listItem.name });
      } catch (err) {
        if (err.response.status === 401) {
          this.$store.commit('logout', '/login');
        }
      }
    },
  },
  components: {
    draggable,
    ListMenu,
  },
};
</script>
<style lang="scss" scope>

.theme--light.v-card {
  background: transparent;
  border:0 !important;
}
.lists__list{
  min-width:270px;
  width: 270px;
  height: 100%;
  margin: 0 0.5rem;
  font-size: 14px;
  &--footer {
    background: #eceff1;
    padding: 6px;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-radius: 3px;
  }
}
.v-textarea {
  background: #ffffff;
  textarea {
    font-size:14px;
  }
}

.lists--add .v-card__text {
  background:#f5f5f5 !important;
}
.lists__wrapper {
  overflow: auto;
  max-height: calc(100% - 10px - 48px - 20px);
  background: #eceff1 !important;
}
.lists__item-card {
  background:#ffffff;
  margin: 6px;
  padding: 6px;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  &:hover {
    background:#f5f5f5;
  }
}


.v-input {
  font-size: 14px;
}

.v-textarea textarea {
  margin-top: 0 !important;
}
.remove-button {
  bottom: 4px;
}

.edit-button {
  position: absolute;
  top: 6px;
  right: 6px;
  opacity: 0.9;
  background:#f5f5f5;
  border-radius:4px;
  width:24px !important;
  height:24px !important;
  &:hover {
    background:#dddddd;
  }
}

.v-toolbar__content > .v-btn.v-btn--icon:first-child {
  margin-left: 0;
}

.v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot
{
  margin-top:5px;
  min-height:32px;
}

.handle {
  cursor: move;
}


</style>
