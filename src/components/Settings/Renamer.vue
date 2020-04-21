<template>
  <div class="renamer">
    <button @click="renaming = true" v-if="!renaming" class="button--secondary">
      Rename game
    </button>
    <input type="text" v-if="renaming" v-model="newName" />
    <div class="actions">
      <button class="save button" @click="rename" v-if="renaming">Save</button>
      <button class="cancel" @click="cancelRename" v-if="renaming">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'GameSettingsRenamer',
  data() {
    return {
      renaming: false,
      newName: this.gameId,
    };
  },
  methods: {
    ...mapActions(['renameGameboard']),
    rename() {
      this.renameGameboard(this.newName)
        .then(() => {
          this.renaming = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    cancelRename() {
      this.renaming = false;
      this.newName = this.gameId;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/_abstracts.scss';

.actions {
  margin-top: 1em;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.save {
  margin-left: 8px;
  margin-right: 1rem;
}
.cancel {
  color: $c--gray-e;
}
</style>
