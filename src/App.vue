<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.app {
  padding: 1rem;
  min-height: 100vh;

  @include mq($bp--desktop) {
    display: flex;
    align-items: center;
    padding: 4vw;
  }
}
</style>
