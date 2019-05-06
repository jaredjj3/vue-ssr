<template>
  <base-view :storeKey="'bar'"></base-view>
</template>

<script>
import BaseView from './BaseView.vue';

export default {
  name: 'bar-view',
  components: { BaseView }
}
</script>
