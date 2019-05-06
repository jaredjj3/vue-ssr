<template>
  <base-view :storeKey="'baz'"></base-view>
</template>

<script>
import BaseView from './BaseView.vue';

export default {
  name: 'baz-view',
  components: { BaseView }
}
</script>
