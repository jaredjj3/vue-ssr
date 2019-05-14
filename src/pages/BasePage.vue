<template>
  <div>{{ pageName }} created by (Vue, {{ createdBy }})</div>
</template>

<script>
import Counter from '../components/Counter.vue';

export default {
  name: 'base-page',
  components: {
    Counter
  },
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
