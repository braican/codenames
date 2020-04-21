<template>
  <div class="game">
    <div v-if="gameId === false" class>
      <p>Invalid game ID.</p>
    </div>
    <div v-else-if="gameId" class="game-wrapper">
      <GameHeader />
      <Gameboard />

      <div class="game-footer">
        <SpymasterToggle />

        <GameSettings />
      </div>
    </div>
    <div v-else class="loading">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import GameHeader from '@/components/GameHeader';
import Gameboard from '@/components/Gameboard';
import SpymasterToggle from '@/components/SpymasterToggle';
import GameSettings from '@/components/GameSettings';

export default {
  name: 'Game',
  components: { GameHeader, Gameboard, SpymasterToggle, GameSettings },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState(['gameId']),
  },
  methods: {
    ...mapActions(['bindGameboard']),
  },
  mounted() {
    this.bindGameboard(this.$route.params.gameId);
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.game {
  width: 100%;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
