<script lang="ts" setup>
import {onMounted, provide, ref} from "vue";
import {AuthResponseDto} from "@/dto/auth.dto";
import {AuthService} from "@/services/authService";

export type AuthStateType = AuthResponseDto | null;
const authState = ref<AuthStateType>(null);

const refreshAuthState = () => {
  const user = AuthService.getCurrentUser();
  const auth = AuthService.getCurrentAuth();
  if (!user || !auth) {
    authState.value = null;
    return;
  }

  authState.value = {user, auth};
};

provide('authState', authState);
provide('refreshAuthState', refreshAuthState);

onMounted(() => {
  refreshAuthState();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>
