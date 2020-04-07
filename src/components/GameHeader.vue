<template>
  <header class="header">
    <div class="score">
      <span class="red-team">{{ redScore }}</span> &mdash;
      <span class="blue-team">{{ blueScore }}</span>
    </div>

    <div
      v-if="winner === null"
      :class="['turn', turn === 'Red' ? 'red-team' : 'blue-team']"
    >Turn: {{ turn }}</div>

    <div v-if="winner === null">
      <button
        type="button"
        :class="['button', turn === 'Red' ? 'button--red-team' : 'button--blue-team']"
        @click="swapTurns"
      >End {{ turn }}'s turn</button>
    </div>

    <div v-if="winner" class="winner">
      <p :class="['winner-status', `winner-status--${winner.toLowerCase()}`]">{{ winner }} team wins</p>

      <div class="postgame-actions">
        <button class="button play-again-btn" @click="createNewBoard">Play again</button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'GameHeader',
  computed: {
    ...mapGetters(['turn', 'redScore', 'blueScore', 'winner']),
  },
  methods: {
    ...mapActions(['updateGame', 'createNewBoard']),
    swapTurns() {
      this.updateGame({ swapTurn: true });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.red-team {
  color: $c--red;
}
.blue-team {
  color: $c--blue;
}

.header {
  position: relative;
  margin-bottom: 1rem;
  font-size: 1.5rem;

  @include mq($bp--small) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.score {
  @include mq($bp--small, max) {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.turn {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: $fw--bold;

  @include mq($bp--small) {
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: 0;
    margin-bottom: 0;
  }
}

.winner {
  display: flex;
  align-items: center;
}

.winner-status {
  font-size: 1.6rem;
  margin-right: 2rem;
  font-weight: $fw--bold;

  &--blue {
    color: $c--blue;
  }
  &--red {
    color: $c--red;
  }
}

.postgame-actions {
  text-align: right;
  width: 120px;
}
</style>