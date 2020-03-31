<template>
  <div>
    <button class="button" @click="login">Login with Google</button>
  </div>
</template>

<script>
import { auth, authProvider } from '@/firebase';

export default {
  name: 'AuthForm',
  methods: {
    login() {
      auth.signInWithPopup(authProvider).catch(err => console.error(err));
    }
  }
}
</script>

<style lang="scss" scoped>

</style>