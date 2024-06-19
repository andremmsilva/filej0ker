<script lang="ts" setup>
import {AuthService} from "@/services/authService";
import {inject} from "vue";

const refreshAuthState = inject("refreshAuthState") as () => void;

function onLogoutClick() {
  AuthService.logout();
  refreshAuthState();
  window.location.reload();
}
</script>

<template>
  <v-btn class="mx-2" color="grey" prepend-icon="mdi-logout-variant" size="large" variant="elevated"
         @click="onLogoutClick">Logout
  </v-btn>
</template>

<style scoped>

</style>
