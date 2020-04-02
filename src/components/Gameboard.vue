<template>
  <div class="gameboard">
    <button
      :class="['cell', getCellClass(cell)]"
      v-for="(cell, index) in board"
      :key="cell.word"
      @click="() => handleCellClick(cell, index)"
      :disabled="locked"
    >
      {{ cell.word }}
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Gameboard',
  computed: {
    ...mapState(['locked', 'spymaster']),
    ...mapGetters(['board', 'turn']),
  },
  methods: {
    ...mapActions(['decrementRed', 'decrementBlue', 'updateGame']),
    ...mapMutations(['setWinner']),

    getCellClass(cell) {
      if (cell.hidden && !this.spymaster) {
        return;
      }

      const classes = [];

      if (cell.hidden === false) {
        classes.push('cell--selected');
      }

      if (this.spymaster) {
        classes.push('cell--spymaster');
      }

      if (cell.owner === 'neutral') {
        classes.push('cell--neutral');
      } else if (cell.owner === 'red') {
        classes.push('cell--red');
      } else if (cell.owner === 'blue') {
        classes.push('cell--blue');
      } else if (cell.owner === 'black') {
        classes.push('cell--black');
      }

      return classes.join(' ');
    },
    handleCellClick(cell, index) {
      if (this.locked || cell.hidden === false) {
        return;
      }

      const newCell = { ...cell, hidden: false };
      const newBoard = [...this.board];
      const cellOwner = cell.owner;
      const activeTurn = this.turn;
      const swapTurn =
        cellOwner === 'neutral' ||
        (cellOwner === 'red' && activeTurn !== 'Red') ||
        (cellOwner === 'blue' && activeTurn !== 'Blue');

      newBoard[index] = newCell;

      if (cellOwner === 'black') {
        this.setWinner(activeTurn === 'Red' ? 'Blue' : 'Red');
      } else if (cellOwner === 'red') {
        this.decrementRed();
      } else if (cellOwner === 'blue') {
        this.decrementBlue();
      }

      this.updateGame({ board: newBoard, swapTurn });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.gameboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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
    &.cell--spymaster {
      color: $c--red;
    }
    &.cell--selected {
      background-color: $c--red;
      color: $c--white;
    }
  }

  &--blue {
    &.cell--spymaster {
      color: $c--blue;
    }

    &.cell--selected {
      background-color: $c--blue;
      color: $c--white;
    }
  }

  &--neutral {
    background-color: $c--gray-c;
  }

  &--black {
    &.cell--spymaster {
      color: $c--black;
    }
    &.cell--selected {
      background-color: $c--black;
      color: $c--white;
    }
  }
}
</style>
