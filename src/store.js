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
    },
    winner: 'Blue',
    redScore: 0,
    blueScore: 0,
  },
  getters: {
    board: state => state.game.board,
    turn: state => state.game.turn,
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
      state.game.board = val;
    },
    setTurn(state, val) {
      state.game.turn = val;
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

    async createNewGame({ commit, dispatch }, board) {
      const gameData = await dispatch('setupGame', { board });

      return gamesCollection.add(gameData).then(docRef => {
        console.log(`Created game with ID of ${docRef.id}`);
        commit('setGameId', docRef.id);
        return docRef.id;
      });
    },

    updateGame({ commit, state }, { board, swapTurn }) {
      const gameData = { board };

      commit('setGameboard', board);

      if (swapTurn) {
        const newTurn = state.game.turn === 'Red' ? 'Blue' : 'Red';
        gameData.turn = newTurn;
        commit('setTurn', newTurn);
      }

      gamesCollection
        .doc(state.gameId)
        .set(gameData, { merge: true })
        .catch(error => console.error(error));
    },

    setupGame({ commit }, { board, turn }) {
      const redScore = board.filter(c => c.owner === 'red' && c.hidden).length;
      const blueScore = board.filter(c => c.owner === 'blue' && c.hidden).length;

      if (turn === undefined) {
        turn = redScore > blueScore ? 'Red' : 'Blue';
      }

      commit('setGameboard', board);
      commit('setTurn', turn);
      commit('setRedScore', redScore);
      commit('setBlueScore', blueScore);

      return { board, turn };
    },

    bindGameboard: firestoreAction(({ bindFirestoreRef, dispatch, commit }, gameId) => {
      return bindFirestoreRef('game', gamesCollection.doc(gameId)).then(({ board, turn }) => {
        console.log(turn);

        dispatch('setupGame', { board, turn });
        commit('setGameId', gameId);
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
