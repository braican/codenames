<template>
  <div class="footer">
    <Toggle />

    <p class="new-game-trigger">
      <button class="button" @click="createNewBoard">New Game</button>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Toggle from '@/components/Toggle';

export default {
  name: 'GameFooter',
  components: { Toggle },
  methods: {
    ...mapActions(['createNewBoard']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.footer {
  margin-top: 2rem;

  @include mq($bp--small) {
    display: flex;
    align-items: center;
  }
}

.new-game-trigger {
  margin-left: auto;

  @include mq($bp--small, max) {
    margin-top: 2rem;

    .button {
      width: 100%;
    }
  }
}
</style>