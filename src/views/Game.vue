<template>
  <div class="game">
    <p class="game-label">Game - {{ $route.params.gameId }}</p>

    <div v-if="board" class="game-wrapper">
      <header class="meta">
        <div class="score">
          <span class="red-team">{{ redScore }}</span> &mdash;
          <span class="blue-team">{{ blueScore }}</span>
        </div>

        <div v-if="winner === null" :class="['turn', turn === 'Red' ? 'red-team' : 'blue-team']">
          Turn: {{ turn }}
        </div>

        <div class="turn-trigger" v-if="winner === null">
          <button
            type="button"
            :class="['button', turn === 'Red' ? 'button--red-team' : 'button--blue-team']"
            @click="swapTurns"
          >
            End {{ turn }}'s turn
          </button>
        </div>
      </header>

      <button @click="reset">Reset</button>

      <Gameboard />

      <div v-if="winner" :class="['winner', `winner--${winner.toLowerCase()}`]">
        {{ winner }} team wins
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { gamesCollection } from '@/firebase';
import Gameboard from '@/components/Gameboard';

export default {
  name: 'Game',
  components: { Gameboard },
  computed: {
    ...mapState(['redScore', 'blueScore', 'gameId', 'winner']),
    ...mapGetters(['board', 'turn']),
  },
  methods: {
    ...mapActions(['updateGame']),

    // @TODO: remove
    reset() {
      if (!this.board) {
        return;
      }

      const cleanGameboard = this.board.map(c => ({ ...c, hidden: true }));
      const redScore = cleanGameboard.filter(c => c.owner === 'red').length;
      const blueScore = cleanGameboard.filter(c => c.owner === 'blue').length;
      const turn = redScore > blueScore ? 'Red' : 'Blue';
      this.updateGame({ board: cleanGameboard, swapTurn: this.turn !== turn });
    },

    swapTurns() {
      this.updateGame({ board: this.board, swapTurn: true });
    },
  },
  mounted() {
    if (!this.gameId) {
      this.$store.dispatch('bindGameboard', this.$route.params.gameId);
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.game {
  width: 100%;
}

.game-wrapper {
  position: relative;
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

.winner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($c--white, 0.9);
  font-size: 2rem;
  font-weight: $fw--bold;

  &--blue {
    color: $c--blue;
  }
  &--red {
    color: $c--red;
  }
}
</style>
