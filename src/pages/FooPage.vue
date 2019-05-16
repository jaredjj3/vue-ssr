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
  asyncData(context) {
    console.log('foo page async data');
  }
}
</script>
