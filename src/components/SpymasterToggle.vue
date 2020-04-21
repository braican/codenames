<template>
  <div class="toggle">
    <button
      :class="['toggle-label', spymaster === false && 'toggle--active']"
      @click="() => setSpymaster(false)"
    >Player</button>
    <button
      :class="['track', spymaster ? 'track--right' : 'track--left']"
      @click="() => setSpymaster(!spymaster)"
    />
    <button
      :class="['toggle-label', spymaster === true && 'toggle--active']"
      @click="() => setSpymaster(true)"
    >Spymaster</button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'Toggle',
  computed: {
    ...mapState(['spymaster']),
  },
  methods: {
    ...mapMutations(['setSpymaster']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';
.toggle {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.toggle-label {
  display: inline-block;
  opacity: 0.4;
  color: $c--gray-3;
  font-weight: $fw--bold;

  &:focus {
    outline: 1px solid $c--gray-e;
  }

  &.toggle--active {
    color: $c--black;
    opacity: 1;
  }
}

.track {
  position: relative;
  display: block;
  background-color: $c--gray-3;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 0;

  &:focus {
    outline: none;
  }

  &:before {
    @include transition;
    content: '';
    position: absolute;
    z-index: 2;
    display: block;
    width: 12px;
    height: 12px;
    top: 4px;
    left: 4px;
    background-color: $c--orange;
    border-radius: 100%;
  }

  &.track--right:before {
    transform: translate3d(20px, 0, 0);
  }
}
</style>