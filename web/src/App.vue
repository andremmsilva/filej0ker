<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

const callback = (obj: { matches: boolean }) => {
  theme.global.name.value = obj.matches ? "dark" : "light";
};

onMounted(() => {
  callback({matches: window.matchMedia("(prefers-color-scheme: dark)").matches});
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", callback);
});

onUnmounted(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", callback);
});
</script>
