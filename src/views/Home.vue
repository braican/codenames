<template>
  <div class="view-home">
    <h1 class="app-title">Codenames</h1>
    <StartGame />
  </div>
</template>

<script>
import StartGame from '@/components/StartGame';

export default {
  name: 'Home',
  components: { StartGame },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.view-home {
  padding: 2rem 1rem 1rem 1rem;

  @include mq($bp--small) {
    padding: 3rem;
  }
}

.app-title {
  font-weight: $fw--bold;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 1em;

  @include mq($bp--tablet) {
    font-size: 3vw;
    letter-spacing: 2em;
  }
}
</style>
