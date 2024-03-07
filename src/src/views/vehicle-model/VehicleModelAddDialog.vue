<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue"
import {VehicleModelService} from "@/service/VehicleModelService";

const emit = defineEmits(['confirm', 'cancel'])

const visible = defineModel('visible', {default: false});
const header = defineModel('header', {default: "New vehicle model"});
const vehicleBrandItems = defineModel('vehicleBrandItems', {default: []});

const fieldTitle = defineModel('fieldTitle', {default: null});
const fieldVehicleBrand = defineModel('fieldVehicleBrand', {default: null});

const vehicleModelService = new VehicleModelService();

function reset() {
  fieldTitle.value = null;
  fieldVehicleBrand.value = null;
}

function onConfirm() {
  vehicleModelService.create({
    title: fieldTitle.value,
    vehicleBrand: {
      data: {
        id: fieldVehicleBrand.value,
        type: 'vehicle-brands',
      }
    }
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
        <div class="flex flex-col gap-2 mb-3">
          <label for="field-vehicle-brand">Brand</label>
          <Dropdown v-model="fieldVehicleBrand" id="field-vehicle-brand" filter optionLabel="label" optionValue="value"
                    :options="vehicleBrandItems" placeholder="Select One"/>
        </div>
      </form>
    </template>
  </ConfirmDialog>
</template>