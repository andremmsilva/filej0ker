<script lang="ts" setup>
import {inject, ref} from "vue";
import {AuthResult, AuthService} from "@/services/authService";
import FormErrorAlert from "@/components/FormErrorAlert.vue";
import {useRouter} from "vue-router";

const valid = ref(false);
const email = ref('');
const password = ref('');
const error = ref('');

const refreshAuthState = inject("refreshAuthState") as () => void;
const router = useRouter();

const emailRules = [
  (value?: string) => value ? true : "Email is required",
  (value?: string) => {
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return value?.match(emailRegex) ? true : "Invalid email address";
  }
];
const passwordRules = [
  (value?: string) => value ? true : "Password is required",
  (value?: string) => value && value.length > 8 ? true : "Password must contain at least 8 characters",
];

async function onLogin() {
  if (!valid.value) return;
  const result: AuthResult = await AuthService.login({email: email.value, password: password.value});
  if (!result.success) {
    error.value = result.error;
    return;
  }

  refreshAuthState();
  await router.replace("/");
}
</script>

<template>
  <v-sheet :elevation="2" :max-width="600" class="mt-16 mx-auto text-center pa-4" rounded="lg" width="95%">
    <FormErrorAlert :text="error" title="Error logging in"/>
    <h2 class="text-h2 font-weight-medium mt-4 mb-8">Login</h2>
    <v-form v-model="valid" class="my-4" @submit.prevent="onLogin">
      <v-text-field
        v-model="email"
        :rules="emailRules"
        clearable
        label="Email"
        placeholder="user@example.com"
        type="email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        type="password"
      ></v-text-field>
      <v-btn block class="mt-2" color="primary" type="submit">Submit</v-btn>
    </v-form>
    <v-container>
      <v-row no-gutters>
        <v-col class="text-left" cols="6">
          <p class="text-body-2">Don't have an account yet?</p>
          <RouterLink class="text-primary font-weight-medium text-body-1" to="/signup">Sign up.</RouterLink>
        </v-col>
        <v-col class="text-right" cols="6">
          <RouterLink class="text-primary" to="/forgot-password">Forgot password?</RouterLink>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
