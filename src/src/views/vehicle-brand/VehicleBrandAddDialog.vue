<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue"
import {VehicleBrandService} from "@/service/VehicleBrandService";

const emit = defineEmits(['confirm', 'cancel'])

const visible = defineModel('visible', {default: false});
const header = defineModel('header', {default: "New vehicle brand"});

const fieldTitle = defineModel('fieldTitle', {default: null});

const vehicleBrandService = new VehicleBrandService();

function reset() {
  fieldTitle.value = null;
}

function onConfirm() {
  vehicleBrandService.create({
    title: fieldTitle.value
  }).then(() => {
    emit('confirm');
    reset();
  });
}

function onCancel() {
  emit('cancel');
  reset();
}
</script>

<template>
  <ConfirmDialog v-model:visible="visible" v-model:header="header" @confirm="onConfirm" @cancel="onCancel">
    <template #default>
      <form class="w-full max-w-lg">
        <div class="flex flex-col gap-2 mb-3">
          <label for="field-title">Title</label>
          <InputText v-model="fieldTitle" id="field-title"/>
        </div>
      </form>
    </template>
  </ConfirmDialog>
</template>