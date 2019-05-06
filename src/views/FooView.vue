<template>
  <base-view :storeKey="'foo'"></base-view>
</template>

<script>
import BaseView from './BaseView.vue';

export default {
  name: 'foo-view',
  components: { BaseView }
}
</script>
