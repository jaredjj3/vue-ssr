<template>
  <base-page :pageName="'bar'"></base-page>
</template>

<script>
import BasePage from './BasePage.vue';

export default {
  name: 'bar-page',
  components: {
    BasePage
  },
}
</script>
