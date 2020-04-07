<template>
  <div class="footer">
    <Toggle />

    <p class="new-game-trigger">
      <button class="button">New Game</button>
    </p>
  </div>
</template>

<script>
import Toggle from '@/components/Toggle';
export default {
  name: 'GameFooter',
  components: { Toggle },
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
}
</style>