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

        <div v-if="winner" class="winner">
          <p :class="['winner-status', `winner-status--${winner.toLowerCase()}`]">
            {{ winner }} team wins
          </p>

          <div class="postgame-actions">
            <button v-if="!loading" class="button play-again-btn" @click="playAgain">
              Play again
            </button>

            <p v-else>Loading...</p>
          </div>
        </div>
      </header>

      <button @click="reset">Reset</button>

      <Gameboard />
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
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState(['redScore', 'blueScore', 'gameId', 'winner']),
    ...mapGetters(['board', 'turn']),
  },
  methods: {
    ...mapActions(['updateGame', 'createNewBoard']),

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

    playAgain() {
      this.loading = true;
      this.createNewBoard();
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
  align-items: center;
  height: 60px;
}

.winner-status {
  font-size: 2rem;
  margin-right: 2rem;
  font-weight: $fw--bold;

  &--blue {
    color: $c--blue;
  }
  &--red {
    color: $c--red;
  }
}

.postgame-actions {
  text-align: right;
  width: 120px;
}
</style>
