<template>
  <div id="app" class="app">
    <router-view/>
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

</style>
