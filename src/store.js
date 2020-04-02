import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { auth, gamesCollection } from '@/firebase';
import { getGameboard } from '@/utils';

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
    winner: null,
    locked: false,
    spymaster: false,
  },
  getters: {
    board: state => state.game.board,
    turn: state => state.game.turn,
    redScore: state => state.game.redScore,
    blueScore: state => state.game.blueScore,
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
      state.game.redScore = val;
    },
    setBlueScore(state, val) {
      state.game.blueScore = val;
    },
    setWinner(state, val) {
      state.winner = val;
      if (val !== null) {
        state.locked = true;
      }
    },
    unlockBoard(state) {
      state.locked = false;
    },
    setSpymaster(state, val) {
      state.spymaster = val;
    },
  },
  actions: {
    decrementRed({ state, commit }) {
      const newScore = state.game.redScore - 1;
      commit('setRedScore', newScore);
      if (newScore < 1) {
        commit('setWinner', 'Red');
      }
    },
    decrementBlue({ state, commit }) {
      const newScore = state.game.blueScore - 1;
      commit('setBlueScore', newScore);
      if (newScore < 1) {
        commit('setWinner', 'Blue');
      }
    },

    async createNewGame({ commit, dispatch }) {
      const board = await getGameboard();

      if (!board) {
        throw new Error('There was a problem getting the gameboard.');
      }

      const gameData = await dispatch('setupGame', { board });

      return gamesCollection.add(gameData).then(docRef => {
        console.log(`Created game with ID of ${docRef.id}`);
        commit('setGameId', docRef.id);
        return docRef.id;
      });
    },

    async createNewBoard({ commit, state, dispatch }) {
      if (!state.gameId) {
        return dispatch('createNewGame');
      }

      const board = await getGameboard();

      if (!board) {
        throw new Error('There was a problem getting the gameboard.');
      }

      commit('setWinner', null);
      commit('unlockBoard');

      const gameData = await dispatch('setupGame', { board });

      return gamesCollection.doc(state.gameId).set(gameData);
    },

    updateGame({ commit, state }, { board, swapTurn }) {
      const gameData = { board, redScore: state.game.redScore, blueScore: state.game.blueScore };

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
      commit('setRedScore', redScore);
      commit('setBlueScore', blueScore);
      commit('setTurn', turn);

      if (redScore < 1) {
        commit('setWinner', 'Red');
      } else if (blueScore < 1) {
        commit('setWinner', 'Blue');
      }

      return { board, turn, redScore, blueScore };
    },

    bindGameboard: firestoreAction(({ bindFirestoreRef, dispatch, commit }, gameId) => {
      return bindFirestoreRef('game', gamesCollection.doc(gameId)).then(({ board, turn }) => {
        dispatch('setupGame', { board, turn });
        commit('setGameId', gameId);

        console.log('tracking', gameId);
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
