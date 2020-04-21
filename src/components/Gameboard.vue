<template>
  <div class="gameboard-wrapper">
    <div class="gameboard">
      <button
        :class="['cell', getCellClass(cell)]"
        v-for="(cell, index) in board"
        :key="cell.word"
        @click="() => handleCellClick(cell, index)"
        :disabled="locked"
      >{{ cell.word }}</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Gameboard',
  computed: {
    ...mapState(['locked', 'spymaster', 'game']),
    ...mapGetters(['board']),
  },
  methods: {
    ...mapActions(['updateGame']),
    ...mapMutations(['lockBoard']),

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
      const { turn, redScore, blueScore } = this.game;
      const newBoard = [...this.board];
      const cellOwner = cell.owner;
      const swapTurn =
        cellOwner === 'neutral' ||
        (cellOwner === 'red' && turn !== 'Red') ||
        (cellOwner === 'blue' && turn !== 'Blue');

      newBoard[index] = newCell;

      const newGameData = { board: newBoard };

      if (swapTurn) {
        newGameData.turn = turn === 'Red' ? 'Blue' : 'Red';
      }

      if (cellOwner === 'black') {
        newGameData.winner = turn === 'Red' ? 'Blue' : 'Red';
        this.lockBoard();
      } else if (cellOwner === 'red') {
        const newRedScore = redScore - 1;
        newGameData.redScore = newRedScore;
        if (newRedScore < 1) {
          newGameData.winner = 'Red';
          this.lockBoard();
        }
      } else if (cellOwner === 'blue') {
        const newBlueScore = blueScore - 1;
        newGameData.blueScore = newBlueScore;
        if (newBlueScore < 1) {
          newGameData.winner = 'Blue';
          this.lockBoard();
        }
      }

      this.updateGame(newGameData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.gameboard-wrapper {
  @include mq($bp--desktop, max) {
    margin-left: -1rem;
    margin-right: -1rem;
  }
}
.gameboard {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(5, 1fr);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $c--gray-e;
  height: 12vh;
  min-height: 3.25rem;
  padding: 0.8rem;
  font-weight: $fw--bold;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  font-size: 2vw;

  &:focus {
    outline: 1px solid #ccc;
  }

  @include mq($bp--desktop) {
    font-size: 1rem;
  }

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

  &--neutral.cell--selected {
    background-color: $c--gray-c;
  }

  &--black {
    &.cell--spymaster {
      color: $c--black;
      background-color: rgba($c--black, 0.4);
    }
    &.cell--selected {
      background-color: $c--black;
      color: $c--white;
    }
  }
}
</style>
