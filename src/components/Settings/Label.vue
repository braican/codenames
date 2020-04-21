<template>
  <div class="label">
    <p class="game-label">Game URL:</p>
    <p class="game-url">{{ gameUrl }}</p>
    <div class="copier">
      <button @click="copy" class="button--secondary copy-game-url" v-clipboard:copy="gameUrl">
        Copy game url
      </button>
      <p :class="['copy-message', copied && 'copy-message--visible']">Copied</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'GameSettingsLabel',
  data() {
    return {
      copied: false,
    };
  },
  computed: {
    ...mapState(['gameId']),
    gameUrl() {
      return `https://codenames.braican.com/${this.gameId}`;
    },
  },
  methods: {
    copy() {
      this.copied = true;
      setTimeout(() => (this.copied = false), 4000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.game-label {
  width: 100%;
  color: $c--gray-a;
}

.game-url {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: $c--white;
}

.copier {
  display: flex;
  align-items: center;
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
