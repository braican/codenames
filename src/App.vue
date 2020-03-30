<template>
  <div id="app" class="app">
    <div>
      <h1 class="app-title">Codenames</h1>
      <router-view/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.app {
  padding: 4vw;
  display: flex;
  min-height: 100vh;
  align-items: center;
}

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
