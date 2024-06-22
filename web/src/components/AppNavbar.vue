<script lang="ts" setup>
import {inject} from "vue";
import {AuthStateType} from "@/components/providers/AuthProvider.vue";
import LogoutButton from "@/components/LogoutButton.vue";

const authState: AuthStateType = inject('authState') as AuthStateType;
</script>

<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-menu class="d-lg-none">
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon
            class="d-lg-none"
            v-bind="props"
          ></v-app-bar-nav-icon>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>Dark mode</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Language</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <v-app-bar-title class="">
      <RouterLink
        class="text-decoration-none text-on-background text-h4 font-weight-bold"
        to="/">
        filej0ker
      </RouterLink>
    </v-app-bar-title>

    <template v-slot:append>
      <v-tooltip location="bottom" text="Contacts">
        <template v-slot:activator="{ props }">
          <v-btn class="mx-1" icon="mdi-phone-log" to="/contacts" v-bind="props" variant="flat"></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip location="bottom" text="Find people">
        <template v-slot:activator="{ props }">
          <v-btn class="mx-1" icon="mdi-magnify" to="/search" v-bind="props" variant="flat"></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip location="bottom" text="Send files">
        <template v-slot:activator="{ props }">
          <v-btn class="mx-1" icon="mdi-send" to="/send" v-bind="props" variant="flat"></v-btn>
        </template>
      </v-tooltip>

      <template v-if="authState === null">
        <v-btn class="mx-2" color="primary" prepend-icon="mdi-login-variant" size="large" to="/login"
               variant="elevated">Login
        </v-btn>
      </template>
      <template v-else>
        <v-container class="d-flex align-center flex-row no-gutters ga-4">
          <p>{{ authState.user_name }}</p>
          <LogoutButton/>
        </v-container>
      </template>
    </template>
  </v-app-bar>
</template>

<style>
.text-on-background {
  color: var(--v-theme-on-background);
}
</style>
