import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { auth, gamesCollection } from '@/firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    gameId: null,
    game: null,
    turn: null,
    redScore: 0,
    blueScore: 0,
  },
  mutations: {
    ...vuexfireMutations,

    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setGameId(state, val) {
      state.gameId = val;
    },
    setGameboard(state, val) {
      state.game = { board: val };
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
  actions: {
    decrementRed({ state, commit }) {
      commit('setRedScore', state.redScore - 1);
    },
    decrementBlue({ state, commit }) {
      commit('setBlueScore', state.blueScore - 1);
    },
    swapTurn({ state, commit }) {
      commit('setTurn', state.turn === 'Red' ? 'Blue' : 'Red');
    },
    setupNewGame({ commit }, board) {
      return gamesCollection.add({ board }).then(docRef => {
        console.log(`Created game with ID of ${docRef.id}`);
        commit('setGameId', docRef.id);
        commit('setGameboard', board);
        return docRef.id;
      });
    },
    updateGameboard({ commit, state }, board) {
      commit('setGameboard', board);
      gamesCollection
        .doc(state.gameId)
        .set({ board })
        .catch(error => console.error(error));
    },
    updateGame({ commit }, board) {
      const redScore = board.filter(c => c.owner === 'red').length;
      const blueScore = board.filter(c => c.owner === 'blue').length;
      const turn = redScore > blueScore ? 'Red' : 'Blue';
      commit('setTurn', turn);
      commit('setRedScore', redScore);
      commit('setBlueScore', blueScore);
    },
    bindGameboard: firestoreAction(({ bindFirestoreRef, dispatch }, gameId) => {
      return bindFirestoreRef('game', gamesCollection.doc(gameId)).then(({ board }) => {
        dispatch('updateGame', board);
      });
    }),
  },
});

auth.onAuthStateChanged(user => {
  if (!user) {
    store.commit('setCurrentUser', false);
  } else {
    store.commit('setCurrentUser', user);
  }
});

export default store;
