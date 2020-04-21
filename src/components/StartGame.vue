<template>
  <div class="lets-go">
    <div v-if="loading" class="loading-screen">
      <p class="loading">Loading...</p>
    </div>
    <div class="game-input" v-else-if="creatingNewGame">
      <div v-if="error" class="error-wrapper">
        <p class="error">{{ error }}</p>
      </div>

      <label>Create a game ID</label><span>(you can change this later)</span>
      <input type="text" v-model="newGameId" />
      <button class="button" @click="newGame">Start</button>
    </div>
    <div class="game-input" v-else-if="joiningExistingGame">
      <div v-if="error" class="error-wrapper">
        <p class="error">{{ error }}</p>
      </div>
      <label>Enter the game ID to join:</label>
      <input type="text" v-model="joinGameId" />
      <button class="button" @click="joinGame">Join</button>
    </div>
    <div :class="['start', (creatingNewGame || joiningExistingGame || loading) && 'is-hidden']">
      <button class="button button--red-team" @click="creatingNewGame = true">
        Start new game
      </button>

      <span class="or">or</span>

      <button class="button button--blue-team" @click="joiningExistingGame = true">
        Join an existing game
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { gamesCollection } from '@/firebase';

export default {
  name: 'StartGame',
  data() {
    return {
      loading: false,
      error: false,
      creatingNewGame: false,
      joiningExistingGame: false,
      newGameId: '',
      joinGameId: '',
    };
  },
  methods: {
    ...mapActions(['createNewGame']),

    newGame() {
      this.loading = true;

      this.createNewGame(this.newGameId)
        .catch(error => {
          console.error(error);
          this.loading = false;
          this.error = error;
        })
        .then(gameId => {
          this.$router.push(`/${gameId}`);
        });
    },

    async joinGame() {
      this.loading = true;

      const doc = await gamesCollection.doc(this.joinGameId).get();

      if (!doc.exists) {
        this.loading = false;
        this.error = 'Invalid Game ID.';
        return;
      }

      this.$router.push(`/${this.joinGameId}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.lets-go {
  margin-top: 4vh;
  position: relative;
  margin-left: 8px;
}

.start .button {
  font-size: 1.4rem;

  @include mq($bp--tablet) {
    font-size: 1.8rem;
  }
}

.is-hidden {
  visibility: hidden;
}

.or {
  text-transform: uppercase;
  display: block;
  position: relative;
  margin-left: -8px;
  font-weight: $fw--bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.loading-screen,
.game-input {
  position: absolute;
  left: 0;
  top: 0;
}

.game-input {
  label {
    font-weight: $fw--bold;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }

  input[type='text'] {
    margin-top: 1rem;
    font-size: 1.4rem;
  }

  .button {
    font-size: 1.4rem;
    margin-left: 8px;
    margin-top: 1rem;
    padding-left: 1.5em;
    padding-right: 1.5em;
  }
}

.error-wrapper {
  margin-bottom: 1rem;
}

.error {
  color: $c--red;
}
</style>
