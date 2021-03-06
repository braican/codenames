<template>
  <div class="settings">
    <button class="trigger" @click="panelActive = true">
      <span class="hover-label">Game settings</span>
      <span class="icon">
        <Cog />
      </span>
    </button>

    <div :class="['panel', panelActive && 'panel--active']">
      <div class="header">
        <router-link class="home-link" to="/"><Home /> <span>Home</span></router-link>
        <button class="close-button" @click="panelActive = false">
          <span>Close</span>
          <Close />
        </button>
      </div>

      <div class="actions">
        <Label />

        <Renamer class="renamer" />
      </div>

      <p class="new-game-trigger">
        <button class="button button--full" @click="createNewBoard">New Board</button>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Label from '@/components/Settings/Label';
import Renamer from '@/components/Settings/Renamer';
import Cog from '@/static/svg/settings.svg';
import Home from '@/static/svg/home.svg';
import Close from '@/static/svg/close.svg';

export default {
  name: 'GameSettings',
  components: { Label, Renamer, Cog, Home, Close },
  data() {
    return {
      panelActive: false,
    };
  },
  methods: {
    ...mapActions(['createNewBoard']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.trigger {
  @include transition(color);
  display: flex;
  align-items: center;
  top: 0;
  right: 0;
  padding-left: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  z-index: 9;
  color: $c--gray-a;

  &:focus {
    outline: none;
  }

  .hover-label {
    font-size: $fz--sm;
  }

  .icon {
    display: block;
    padding-left: 1rem;

    svg {
      @include transition(fill);
      display: block;
      fill: currentColor;
      width: 32px;
    }
  }

  &:hover {
    color: $c--gray-3;
  }

  @media (min-height: 840px) and (min-width: $bp--desktop) {
    position: absolute;
    padding-right: 1rem;
  }
}

.panel {
  @include transition(transform);
  position: fixed;
  z-index: 10;
  display: flex;
  flex-direction: column;
  top: 0;
  bottom: 0;
  right: 0;
  transform: translateX(110%);
  width: 100vw;
  max-width: 400px;
  background-color: $c--gray-3;
  box-shadow: 10px 0 10px 10px rgba(0, 0, 0, 0.6);
  padding: 2rem;

  .actions {
    flex: 1;
  }

  &--active {
    transform: translateX(0);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.home-link {
  @include transition(color);
  display: flex;
  align-items: center;
  text-decoration: none;
  color: $c--gray-a;
  font-size: $fz--sm;

  svg {
    width: 18px;
    fill: currentColor;
    margin-right: 0.5rem;
  }

  &:hover {
    color: $c--gray-e;
  }
}

.close-button {
  @include transition(color);
  color: $c--gray-c;
  display: flex;
  align-items: center;
  color: $c--gray-a;

  span {
    font-size: $fz--sm;
    margin-right: 1rem;
  }

  svg {
    width: 22px;
    fill: currentColor;
  }

  &:hover {
    color: $c--gray-e;
  }
}

.renamer {
  margin-top: 2rem;
}

.new-game-trigger {
  margin-top: 2rem;
}
</style>
