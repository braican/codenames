import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from '@/firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    gameboard: null,
    turn: null,
    redScore: 0,
    blueScore: 0,
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setGameboard(state, val) {
      const redScore = val.filter(c => c.owner === 'red').length;
      const blueScore = val.filter(c => c.owner === 'blue').length;
      const turn = redScore > blueScore ? 'Red' : 'Blue';

      state.gameboard = val;
      state.turn = turn;
      state.redScore = redScore;
      state.blueScore = blueScore;
    },
    setTurn(state, val) {
      state.turn = val;
    },
    setRedScore(state, val) {
      state.redScore = val;
    },
    setBlueScore(state, val) {
      state.blueScore = val;
    },
  },
  actions: {},
});

auth.onAuthStateChanged(user => {
  if (!user) {
    store.commit('setCurrentUser', false);
  } else {
    store.commit('setCurrentUser', user);
  }
});

export default store;
