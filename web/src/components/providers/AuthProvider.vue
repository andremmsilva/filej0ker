<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from 'vue';
import { BaseUserResponse } from '@/dto/auth.dto';
import { AuthService } from '@/services/authService';

export type AuthStateType = BaseUserResponse | null;
const authState = ref<AuthStateType>(null);

const refreshAuthState = () => {
  const user = AuthService.getCurrentUser();
  if (!user) {
    authState.value = null;
    return;
  }

  authState.value = user;
};

const onLogout = (_event: Event) => {
  refreshAuthState();
};

provide('authState', authState);
provide('refreshAuthState', refreshAuthState);

onMounted(() => {
  refreshAuthState();
  console.log("adding the event listener");
  window.addEventListener('logout', onLogout);
});

onUnmounted(() => {
  window.removeEventListener('logout', onLogout);
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
