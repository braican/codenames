<template>
  <div>
    <h1 class="app-title">Codenames</h1>
    <StartGame />
  </div>
</template>

<script>
import StartGame from '@/components/StartGame';

export default {
  name: 'Home',
  components: { StartGame },
}
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.app-title {
  font-weight: $fw--bold;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 1em;

  @include mq($bp--tablet) {
    font-size: 3vw;
  }
}
</style>
