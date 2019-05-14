<template>
  <base-page :pageName="'baz'"></base-page>
</template>

<script>
import BasePage from './BasePage.vue';

export default {
  name: 'baz-page',
  components: {
    BasePage
  },
}
</script>
