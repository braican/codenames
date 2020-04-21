import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { auth, gamesCollection } from '@/firebase';
import router from '@/router';
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
    board: state => (state.game ? state.game.board : null),
    turn: state => (state.game ? state.game.turn : null),
    redScore: state => (state.game ? state.game.redScore : null),
    blueScore: state => (state.game ? state.game.blueScore : null),
    winner: state => (state.game ? state.game.winner : null),
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
    async createNewGame({ commit, dispatch }, gameId) {
      const board = await getGameboard();

      if (!board) {
        throw new Error('There was a problem getting the gameboard.');
      }

      const gameData = await dispatch('setupGame', board);

      const handleSuccess = docRef => {
        console.log(`Created game with ID of ${docRef.id}`);
        commit('setGameId', docRef.id);
        return docRef.id;
      };

      if (!gameId) {
        return gamesCollection.add(gameData).then(handleSuccess);
      }

      const filteredGameId = gameId.replace(/\s/g, '-');
      const ref = gamesCollection.doc(filteredGameId);
      const doc = await ref.get();

      if (doc.exists) {
        throw new Error('That Game ID already exists. Please pick a new one.');
      }

      return ref.set(gameData).then(() => handleSuccess({ id: filteredGameId }));
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
      return bindFirestoreRef('game', gamesCollection.doc(gameId), { reset: false }).then(
        gameData => {
          if (gameData === null) {
            commit('setGameId', false);
            return;
          }

          commit('setGame', gameData);
          commit('setGameId', gameId);
          if (gameData.winner) {
            commit('lockBoard');
          }
        },
      );
    }),

    async renameGameboard({ dispatch, state }, newId) {
      const ref = gamesCollection.doc(newId);
      const doc = await ref.get();
      const oldId = state.gameId;

      if (doc.exists) {
        throw new Error('Name already exists.');
      }

      await ref.set(state.game);

      return dispatch('bindGameboard', newId).then(() => {
        router.replace(`/${newId}`, () => {
          gamesCollection.doc(oldId).delete();
        });
      });
    },
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
