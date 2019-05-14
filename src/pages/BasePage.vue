<template>
  <div>
    <h1>{{ pageName }}</h1>
    <p>This page was rendered by Vue on the {{ createdBy }}.</p>
  </div>
</template>

<script>
export default {
  name: 'base-page',
  props: {
    pageName: String
  },
  created() {
    if (typeof this.$store.state[this.pageName] === 'string') {
      return;
    }

    this.$store.commit('SET_CREATED_BY', {
      pageName: this.pageName,
      createdBy: process.env.VUE_ENV,
    });
  },
  computed: {
    createdBy() {
      return this.$store.state[this.pageName];
    }
  }
}
</script>
