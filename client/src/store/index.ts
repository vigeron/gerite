/* eslint no-underscore-dangle: 0 */
import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
import axios from '../plugins/axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: null,
    access_token: null,
    avatar: null,
    cardMoveTo: null,
    boards: [],
    lists: [],
    current_board: {
      name: '',
    },
  },
  getters: {
    boards: state => state.boards,
    lists: state => state.lists,
  },
  mutations: {
    initStore(state) {
      state.username = localStorage.username;
      state.avatar = localStorage.avatar;
      state.access_token = localStorage.access_token;
      state.current_board.name = localStorage.name;
      axios.defaults.headers.common.Authorization = `Bearer ${state.access_token}`;
    },
    logout(state, point) {
      localStorage.removeItem('auth');
      state.access_token = null;
      state.username = null;
      state.avatar = null;
      delete axios.defaults.headers.common.Authorization;
      router.push({ path: point });
    },
    login(state, data) {
      state.access_token = data.access_token;
      state.username = data.username;
      state.avatar = data.avatar;
      axios.defaults.headers.common.Authorization = `Bearer ${state.access_token}`;
      router.push({ path: '/dashboard' });
    },
    setBoard(state, board) {
      state.current_board = board;
      localStorage.name = board.name;
    },
    setBoards(state, items) {
      state.boards = items;
    },
    setLists(state, items) {
      state.lists = items;
    },
  },
  actions: {
    async deleteList({ commit }, listId) {
      let result = window.confirm('Are you sure to delete?');
      if (!result) {
        return;
      }
      try {
        result = await axios.delete(`/lists/${listId}`);
        const index = this.state.lists.findIndex((item:any) => item._id === listId);
        this.state.lists.splice(index, 1);
      } catch (err) {
        if (err.response.status === 401) {
          this.commit('logout', '/login');
        }
      }
    },
    async updateSortList({ commit }, lists) {
      /* eslint no-underscore-dangle: 0 */
      const items = lists.map((item: any, index: any) => item._id);
      commit('setLists', lists);
      try {
        await axios.post('/lists/ordering', items);
      } catch (err) {
        if (err.response.status === 401) {
          commit('logout', '/login');
        }
      }
    },
  },
  plugins: [
    (store) => {
      store.subscribe((mutation, state) => {
        localStorage.username = state.username;
        localStorage.avatar = state.avatar;
        localStorage.access_token = state.access_token;
      });
    },
  ],
});
