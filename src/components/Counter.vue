<template>
  <div>
    {{ count }}
    <button>Click Me</button>
  </div>
</template>

<script>
export default {
  name: 'counter',
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    onClick() {
      this.count++;
    }
  }
}
</script>
