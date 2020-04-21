<template>
  <header class="header">
    <div v-if="winner === null" :class="['turn', turn === 'Red' ? 'red-team' : 'blue-team']">
      Turn: {{ turn }}
    </div>

    <div v-if="winner === null">
      <button
        type="button"
        :class="['button', turn === 'Red' ? 'button--red-team' : 'button--blue-team']"
        @click="swapTurns"
      >
        End {{ turn }}'s turn
      </button>
    </div>

    <div class="score">
      <span class="red-team">{{ redScore }}</span> &mdash;
      <span class="blue-team">{{ blueScore }}</span>
    </div>

    <div v-if="winner" class="winner">
      <p :class="['winner-status', `winner-status--${winner.toLowerCase()}`]">
        {{ winner }} team wins
      </p>

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
      this.updateGame({ turn: this.turn === 'Red' ? 'Blue' : 'Red' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.score {
  @include mq($bp--small) {
    order: -1;
  }

  .red-team {
    color: $c--red;
  }
  .blue-team {
    color: $c--blue;
  }
}

.turn {
  @include transition(background-color);
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: $fw--bold;
  padding: 1rem 2rem;
  color: $c--white;
  text-align: center;
  width: 100%;

  &.red-team {
    background-color: $c--red;
  }
  &.blue-team {
    background-color: $c--blue;
  }

  @include mq($bp--small) {
    width: auto;
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
