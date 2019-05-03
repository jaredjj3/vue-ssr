<template>
  <div>
    {{ key }}
    {{ val }}
  </div>
</template>

<script>
export default {
  name: 'base-view',
  props: {
    key: String
  },
  computed: {
    val: () => this.$store.state[this.key].toString()
  }
}
</script>
