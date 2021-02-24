<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>

export default {
  name: 'App',
  mounted () {
    this.$router.push('/app/cemetery-areas', () => {})
  }
}
</script>
