<script lang="ts" setup>
defineProps<{ text: string, title: string }>();
</script>

<template>
  <v-alert
    v-if="text.length > 0"
    :text="text"
    border="top"
    class="text-left"
    prominent
    :title="title"
    type="error"
    variant="tonal"
  ></v-alert>
</template>

<style scoped>

</style>
