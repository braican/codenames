<template>
  <div class="game">
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

      <Gameboard />

      <div class="footer">
        <div class="toggle">
          <button
            :class="spymaster === false ? 'toggle--active' : ''"
            @click="() => setSpymaster(false)"
          >
            Player
          </button>
          <button
            :class="spymaster === true ? 'toggle--active' : ''"
            @click="() => setSpymaster(true)"
          >
            Spymaster
          </button>
        </div>

        <p class="game-label">
          <span>Game {{ this.$route.params.gameId }}</span>
          <button class="copy-game-url" v-clipboard:copy="gameUrl">Copy game url</button>
        </p>
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
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
    ...mapState(['gameId', 'winner', 'spymaster']),
    ...mapGetters(['board', 'turn', 'redScore', 'blueScore']),
    gameUrl() {
      return `https://codenames.braican.com/g/${this.$route.params.gameId}`;
    },
  },
  methods: {
    ...mapActions(['updateGame', 'createNewBoard']),
    ...mapMutations(['setSpymaster']),

    swapTurns() {
      this.updateGame({ board: this.board, swapTurn: true });
    },

    playAgain() {
      this.loading = true;
      this.createNewBoard().then(() => {
        this.loading = false;
      });
    },
  },
  mounted() {
    this.$store.dispatch('bindGameboard', this.$route.params.gameId);
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

.meta {
  position: relative;
  margin-bottom: 1rem;
  font-size: 1.5rem;

  @include mq($bp--small) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.postgame-actions {
  text-align: right;
  width: 120px;
}

.score {
  @include mq($bp--small, max) {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.turn {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: $fw--bold;

  @include mq($bp--small) {
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: 0;
    margin-bottom: 0;
  }
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

.footer {
  margin-top: 2rem;

  @include mq($bp--small) {
    display: flex;
    align-items: center;
  }
}

.toggle {
  margin-right: 2rem;

  button {
    display: inline-block;
    padding: 0.5em;
    background-color: $c--gray-e;
    opacity: 0.4;
    color: $c--gray-3;

    + button {
      margin-left: 6px;
    }

    &.toggle--active {
      color: $c--black;
      opacity: 1;
    }
  }
}

.game-label {
  display: flex;
  align-items: center;
}

.copy-game-url {
  display: inline-block;
  background-color: $c--gray-e;
  margin-left: 2rem;
  padding: 0.5em 0.7em;
}
</style>
