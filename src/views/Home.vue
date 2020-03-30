<template>
  <div class="lets-go">
    <button :class="['button', {'is-loading': loading}]" @click="startGame">Start a game</button>
    <p class="loading" v-if="loading">Loading...</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    startGame() {
      this.loading = true;

    }
  }
}
</script>


<style lang="scss" scoped>
.lets-go {
  margin-top: 4vh;
  position: relative;
}

.button {
  font-size: 2rem;

  &.is-loading {
    visibility: hidden;
  }
}

.loading {
  position: absolute;
  left: 0;
  top: 0;
}

</style>

