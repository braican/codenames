<template>
  <div class="word-admin">
    <form @submit.prevent="addNewWord">
      <h3>Add new words</h3>

      <div class="input-wrap">
        <input
          v-for="(word, index) in words"
          :key="`${word}-${index}`"
          type="text"
          :value="word"
          @change="event => handleInput(event.target.value, index)"
        />

        <button class="add-new-input" type="button" @click="addNewInput">&plus;</button>
      </div>

      <button
        class="button"
        type="submit"
      >Add {{ newWords.length }} word{{ newWords.length === 1 ? '' : 's' }}</button>
    </form>

    <div class="word-list">
      <h3>Words ({{ storedWords.length }})</h3>

      <ul>
        <li v-for="(word, index) in storedWords" :key="`${word}-${index}`">{{ word }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { gameWords } from '@/firebase';
import { retrieveWords } from '@/utils';

export default {
  name: 'AddWordForm',
  data() {
    return {
      words: [''],
      storedWords: [],
    };
  },
  computed: {
    newWords() {
      return this.words.filter(v => v !== '');
    },
  },
  async mounted() {
    const dbWords = await retrieveWords();
    this.storedWords = dbWords;
  },
  methods: {
    handleInput(value, index) {
      this.words[index] = value;
      const newWords = this.words.filter(v => v !== '');
      if (newWords.length === 0) {
        newWords.push('');
      }
      this.words = newWords;
    },
    addNewInput(event) {
      this.words.push('');

      setTimeout(() => {
        event.target.previousElementSibling.focus();
      }, 0);
    },
    async addNewWord() {
      const lowercaseWords = this.storedWords.map(w => w.toLowerCase());
      const newWords = this.words.filter(
        w => w !== '' && !lowercaseWords.includes(w.toLowerCase()),
      );
      const newStoreWords = [...this.storedWords, ...newWords];
      const chunks = {};
      let index = 1;

      this.storedWords = [...newStoreWords];

      while (newStoreWords.length > 0) {
        const chunk = newStoreWords.splice(0, 100);
        chunks[`chunk${index}`] = chunk;
        index += 1;
      }

      gameWords
        .set(chunks)
        .then(() => {
          console.log('Saved');
        })
        .catch(error => {
          console.error(error);
        });

      this.words = [''];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.word-admin {
  display: flex;
}

.input-wrap {
  position: relative;
  margin-bottom: 1rem;
  padding-right: 54px;

  input {
    margin-top: 1rem;
  }
}

.add-new-input {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  font-weight: $fw--bold;
  background-color: $c--primary;
}

.word-list {
  flex: 1;
  width: 50%;
  margin-left: 4rem;

  ul {
    max-height: calc(100vh - 8vw - 6rem);
    overflow: auto;
    border: 1px solid $c--gray-e;
    padding-top: 5px;
    padding-bottom: 5px;

    li {
      padding: 5px 10px;
    }
  }
}
</style>
