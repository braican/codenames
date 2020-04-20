<template>
  <div class="lets-go">
    <button :class="['button', { 'is-hidden': loading || error }]" @click="startGame">Start a game</button>
    <p class="loading" v-if="loading">Loading...</p>
    <p class="error" v-if="error">There was an error setting up the game.</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'StartGame',
  data() {
    return {
      loading: false,
      error: false,
    };
  },
  methods: {
    ...mapActions(['createNewGame']),

    async startGame() {
      this.loading = true;

      this.$store
        .dispatch('createNewGame')
        .catch(error => {
          this.loading = false;
          this.error = true;
        })
        .then(gameId => {
          this.$router.push(`/${gameId}`);
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
  font-size: 1.4rem;

  @include mq($bp--tablet) {
    font-size: 1.8rem;
  }

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
