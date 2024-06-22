<script lang="ts" setup>
import FormErrorAlert from "@/components/FormErrorAlert.vue";
import {ref} from "vue";
import {SearchResult, UserService} from "@/services/userService";
import {BaseUserResponse} from "@/dto/auth.dto";
import {VDataTable} from "vuetify/components";

const valid = ref(false);
const error = ref('');
const query = ref('');
const queryRules = [
  (value?: string) => value ? true : 'Please provide a search query'
];

const results = ref<BaseUserResponse[]>([]);
const headers: VDataTable['$props']['headers'] = [
  {title: 'Username', align: 'start', value: 'user_name'},
  {title: 'Full Name', align: 'start', value: 'full_name'},
  {title: 'Action', align: 'end', value: 'action'},
];

async function onSubmitSearch() {
  if (!valid.value) return;
  const result: SearchResult = await UserService.search({query: query.value});
  if (!result.success) {
    error.value = result.error;
    return;
  }

  results.value = result.response;
}
</script>

<template>
  <v-sheet :elevation="2" :max-width="600" class="mt-16 mx-auto pa-4" rounded="lg" width="95%">
    <FormErrorAlert :text="error" title="Error searching"/>
    <h2 class="text-center text-h2 font-weight-medium mt-4 mb-8">Search for users</h2>
    <v-form v-model="valid" class="my-4" @submit.prevent="onSubmitSearch">
      <v-text-field
        v-model="query"
        :rules="queryRules"
        clearable
        label="Email or username"
        placeholder=""
        type="text"
        variant="outlined"
      ></v-text-field>
      <v-btn block class="mt-2" color="primary" type="submit">Submit</v-btn>
    </v-form>
    <v-data-table v-if="results.length > 0" class="mt-4"
    :headers="headers"
    :items="results"
    item-key="user_id">
      <template v-slot:[`item.action`]="{ item }">
        <v-tooltip
          location="right">
          <template v-slot:activator="{ props }">
            <v-btn variant="flat" v-bind="props" icon="mdi-plus-box"></v-btn>
          </template>
          <span>Add to contacts</span>
        </v-tooltip>

      </template>
    </v-data-table>
  </v-sheet>
</template>

<style scoped>

</style>
