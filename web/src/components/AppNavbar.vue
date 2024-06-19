<script setup lang="ts">

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
        to="/"
        >filej0ker</RouterLink
      >
    </v-app-bar-title>

    <template v-slot:append>
      <v-btn variant="flat" class="mx-1" icon="mdi-contacts" to="/contacts"></v-btn>
      <v-btn variant="flat" class="mx-1" icon="mdi-magnify" to="/search"></v-btn>
      <v-btn variant="flat" class="mx-1" icon="mdi-send" to="/send"></v-btn>
      <v-btn variant="elevated" class="mx-2" size="large" color="primary" prepend-icon="mdi-login-variant" to="/login">Login</v-btn>
    </template>
  </v-app-bar>
</template>

<style>
.text-on-background {
  color: var(--v-theme-on-background);
}
</style>
