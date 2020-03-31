<template>
  <div class="game">
    <p class="game-label">Game - {{ $route.params.gameId }}</p>

    <div v-if="gameboard">
      <header class="meta">
        <div class="score">
          <span class="red-team">{{ redScore }}</span> &mdash;
          <span class="blue-team">{{ blueScore }}</span>
        </div>

        <div :class="['turn', turn === 'Red' ? 'red-team' : 'blue-team']">Turn: {{ turn }}</div>

        <div class="turn-trigger">
          <button
            type="button"
            :class="['button', turn === 'Red' ? 'button--red-team' : 'button--blue-team']"
          >
            End {{ turn }}'s turn
          </button>
        </div>
      </header>

      <Gameboard :board="gameboard" :game="$route.params.gameId" />
    </div>

    <div v-else class="loading">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { gamesCollection } from '@/firebase';
import Gameboard from '@/components/Gameboard';

export default {
  name: 'Game',
  components: { Gameboard },
  computed: {
    ...mapState(['gameboard', 'turn', 'redScore', 'blueScore']),
  },
  mounted() {
    if (!this.gameboard) {
      gamesCollection.doc(this.$route.params.gameId).onSnapshot(doc => {
        const { board } = doc.data();
        this.$store.commit('setGameboard', board);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.game {
  width: 100%;
}

.game-label {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  font-size: 1.5rem;
}

.turn {
  margin-left: 1rem;
  margin-right: 1rem;
}

.red-team {
  color: $c--red;
}
.blue-team {
  color: $c--blue;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
