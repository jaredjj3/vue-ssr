<template>
  <base-page :pageName="'foo'"></base-page>
</template>

<script>
import BasePage from './BasePage.vue';

export default {
  name: 'foo-page',
  components: {
    BasePage
  },
}
</script>
