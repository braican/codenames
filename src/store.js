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
      boardId: null,
      board: null,
      turn: null,
      redScore: 0,
      blueScore: 0,
      winner: null,
    },
    locked: false,
    spymaster: false,
  },
  getters: {
    board: state => state.game.board,
    turn: state => state.game.turn,
    redScore: state => state.game.redScore,
    blueScore: state => state.game.blueScore,
    winner: state => state.game.winner,
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
    lockBoard(state) {
      state.locked = true;
    },
    unlockBoard(state) {
      state.locked = false;
    },
    setSpymaster(state, val) {
      state.spymaster = val;
    },
  },
  actions: {
    async createNewGame({ commit, dispatch }) {
      const board = await getGameboard();

      if (!board) {
        throw new Error('There was a problem getting the gameboard.');
      }

      const gameData = await dispatch('setupGame', board);

      return gamesCollection.add(gameData).then(docRef => {
        console.log(`Created game with ID of ${docRef.id}`);
        commit('setGameId', docRef.id);
        return docRef.id;
      });
    },

    async createNewBoard({ state, dispatch }) {
      if (!state.gameId) {
        return dispatch('createNewGame');
      }

      const board = await getGameboard();

      if (!board) {
        throw new Error('There was a problem getting the gameboard.');
      }

      const gameData = await dispatch('setupGame', board);
      return gamesCollection.doc(state.gameId).set(gameData);
    },

    updateGame({ commit, state }, newGameData) {
      const updatedGame = { ...state.game, ...newGameData };

      commit('setGame', updatedGame);

      gamesCollection
        .doc(state.gameId)
        .set(updatedGame, { merge: true })
        .catch(error => console.error(error));
    },

    setupGame({ commit }, board) {
      const redScore = board.filter(c => c.owner === 'red' && c.hidden).length;
      const blueScore = board.filter(c => c.owner === 'blue' && c.hidden).length;
      const turn = redScore > blueScore ? 'Red' : 'Blue';
      const gameData = {
        boardId: Date.now() + board[0].word,
        board,
        turn,
        redScore,
        blueScore,
        winner: null,
      };

      commit('setGame', gameData);
      return gameData;
    },

    bindGameboard: firestoreAction(({ bindFirestoreRef, commit }, gameId) => {
      return bindFirestoreRef('game', gamesCollection.doc(gameId)).then(gameData => {
        if (gameData === null) {
          commit('setGameId', false);
          return;
        }

        commit('setGame', gameData);
        commit('setGameId', gameId);
        if (gameData.winner) {
          commit('lockBoard');
        }
      });
    }),
  },
});

store.watch(
  state => (state.game ? state.game.boardId : null),
  () => {
    store.commit('unlockBoard');
    store.commit('setSpymaster', false);
  },
);

auth.onAuthStateChanged(user => {
  if (!user) {
    store.commit('setCurrentUser', false);
  } else {
    store.commit('setCurrentUser', user);
  }
});

export default store;
