<template>
  <div>
    <h1>{{ storeKey }}</h1>
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: 'base-view',
  props: {
    storeKey: String
  },
  created() {
    if (typeof this.$store.state[this.storeKey] === 'undefined') {
      this.$store.commit('SET_VALUE', {
        storeKey: this.storeKey,
        value: `created on ${process.env.VUE_ENV}`,
      });
    }
  },
  computed: {
    value() {
      return this.$store.state[this.storeKey];
    }
  }
}
</script>
