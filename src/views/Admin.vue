<template>
  <div class="admin-page">
    <h2>Admin</h2>
    <AuthForm v-if="currentUser === false" />
    <WordAdmin v-else-if="currentUser" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AuthForm from '@/components/AuthForm';
import WordAdmin from '@/components/WordAdmin';

export default {
  name: 'Admin',
  components: { AuthForm, WordAdmin },
  computed: {
    ...mapState(['currentUser']),
  },
};
</script>

<style lang="scss" scoped>
.admin-page {
  align-self: flex-start;
  width: 100%;
}
</style>
