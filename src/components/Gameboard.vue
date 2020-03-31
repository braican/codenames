<template>
  <div class="gameboard">
    <button
      :class="[
        'cell',
        { 'cell--red': cell.hidden === false && cell.owner === 'red' },
        { 'cell--blue': cell.hidden === false && cell.owner === 'blue' },
      ]"
      v-for="(cell, index) in board"
      :key="cell.word"
      @click="() => handleCellSelect(cell, index)"
    >
      {{ cell.word }}
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { gamesCollection } from '@/firebase';

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
    handleCellSelect(cell, index) {
      const newCell = { ...cell };
      const newBoard = [...this.board];
      const owner = cell.owner;
      newCell.hidden = false;

      newBoard[index] = newCell;

      this.$store.commit('setGameboard', newBoard);

      gamesCollection
        .doc(this.game)
        .set({ board: newBoard })
        .then(docRef => {
          console.log('Success');
        });
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
}
</style>
