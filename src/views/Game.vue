<template>
  <div class="game">
    <div v-if="gameId === false" class>
      <p>Invalid game ID.</p>
    </div>
    <div v-else-if="gameId" class="game-wrapper">
      <GameHeader />
      <Gameboard />
      <GameFooter />

      <div class="game-info">
        <p class="game-label">Game {{ this.$route.params.gameId }}</p>
        <button
          @click="copy"
          class="button--secondary copy-game-url"
          v-clipboard:copy="gameUrl"
        >Copy game url</button>
        <p :class="['copy-message', copied && 'copy-message--visible']">Copied</p>
      </div>
    </div>
    <div v-else class="loading">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import GameHeader from '@/components/GameHeader';
import Gameboard from '@/components/Gameboard';
import GameFooter from '@/components/GameFooter';

export default {
  name: 'Game',
  components: { GameHeader, Gameboard, GameFooter },
  data() {
    return {
      loading: false,
      copied: false,
    };
  },
  computed: {
    ...mapState(['gameId']),
    gameUrl() {
      return `https://codenames.braican.com/g/${this.$route.params.gameId}`;
    },
  },
  methods: {
    copy() {
      this.copied = true;
      setTimeout(() => (this.copied = false), 5000);
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

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-info {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.game-label {
  width: 100%;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: $c--gray-a;
}

.copy-message {
  transition: opacity 0.2s;
  opacity: 0;
  color: $c--orange;
  margin-left: 1rem;
}
.copy-message--visible {
  opacity: 1;
}
</style>
