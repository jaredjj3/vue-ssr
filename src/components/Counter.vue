<template>
  <div>
    <button @click="increment">Clicked {{count}} times!</button>
  </div>
</template>

<script>
export default {
  name: 'counter',
  props: {
    initialCount: Number,
  },
  data() {
    return {
      count: 0,
    }
  },
  created() {
    if (this.initialCount) {
      this.count = this.initialCount;
    }
  },
  methods: {
    increment() {
      this.count++;
    }
  }
}
</script>
