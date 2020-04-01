import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { auth, gamesCollection } from '@/firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    gameId: null,
    game: {
      board: null,
      turn: null,
      redScore: 0,
      blueScore: 0,
    },
  },
  mutations: {
    ...vuexfireMutations,

    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setGameId(state, val) {
      state.gameId = val;
    },
    setGame(state, val) {
      state.game = val;
    },
    setGameboard(state, val) {
      state.game = { ...state.game, board: val };
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
    setupNewGame({ commit, dispatch }, board) {
      return gamesCollection.add({ board }).then(docRef => {
        console.log(`Created game with ID of ${docRef.id}`);
        commit('setGameId', docRef.id);
        dispatch('setupGameboard', board);
        return docRef.id;
      });
    },
    setupGameboard({ commit }, board) {
      const redScore = board.filter(c => c.owner === 'red').length;
      const blueScore = board.filter(c => c.owner === 'blue').length;
      const turn = redScore > blueScore ? 'Red' : 'Blue';
      commit('setGame', { board, turn, redScore, blueScore });
    },
    updateGameboard({ commit, state }, board) {
      commit('setGameboard', board);
      gamesCollection
        .doc(state.gameId)
        .set({ board })
        .catch(error => console.error(error));
    },
    bindGameboard: firestoreAction(({ bindFirestoreRef }, gameId) => {
      return bindFirestoreRef('game', gamesCollection.doc(gameId));
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
