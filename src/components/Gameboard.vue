<template>
  <div class="gameboard">
    <button
      :class="['cell', getCellClass(cell)]"
      v-for="(cell, index) in board"
      :key="cell.word"
      @click="() => handleCellClick(cell, index)"
    >
      {{ cell.word }}
      <br />
      {{ cell.owner }}
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Gameboard',
  props: {
    board: {
      type: Array,
      required: true,
    },
    game: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(['turn']),
  },
  methods: {
    getCellClass(cell) {
      if (cell.hidden) {
        return;
      }

      if (cell.owner === 'neutral') {
        return 'cell--neutral';
      } else if (cell.owner === 'red') {
        return 'cell--red';
      } else if (cell.owner === 'blue') {
        return 'cell--blue';
      } else if (cell.owner === 'black') {
        return 'cell--black';
      }

      return null;
    },
    handleCellClick(cell, index) {
      const newCell = { ...cell };
      const newBoard = [...this.board];
      const owner = cell.owner;
      newCell.hidden = false;

      newBoard[index] = newCell;

      this.$store.dispatch('updateGameboard', newBoard);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.gameboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 1rem;

  @include mq($bp--desktop) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $c--gray-e;
  height: 12vh;
  min-height: 100px;
  padding: 1rem;
  font-weight: $fw--bold;
  text-transform: uppercase;
  letter-spacing: 0.1px;

  &--red {
    background-color: $c--red;
    color: $c--white;
  }

  &--blue {
    background-color: $c--blue;
    color: $c--white;
  }

  &--neutral {
    background-color: $c--gray-c;
  }
}
</style>
