<template>
  <div class="lets-go">
    <button :class="['button', { 'is-hidden': loading || error }]" @click="startGame">
      Start a game
    </button>
    <p class="loading" v-if="loading">Loading...</p>
    <p class="error" v-if="error">There was an error setting up the game.</p>
  </div>
</template>

<script>
import { getGameboard } from '@/utils';

export default {
  name: 'StartGame',
  data() {
    return {
      loading: false,
      error: false,
    };
  },
  methods: {
    async startGame() {
      this.loading = true;

      const gameboard = await getGameboard();

      if (!gameboard) {
        this.loading = false;
        this.error = true;
        return;
      }

      this.$store.dispatch('setupNewGame', gameboard).then(gameId => {
        this.$router.push(`/g/${gameId}`);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.lets-go {
  margin-top: 4vh;
  position: relative;
}

.button {
  font-size: 2rem;

  &.is-hidden {
    visibility: hidden;
  }
}

.loading,
.error {
  position: absolute;
  left: 0;
  top: 0;
}

.error {
  color: $c--red;
}
</style>
