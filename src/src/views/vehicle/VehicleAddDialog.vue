<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue"
import {VehicleService} from "@/service/VehicleService";
import {ref} from "vue";

const emit = defineEmits(['confirm', 'cancel'])

const visible = defineModel('visible', {default: false});
const header = defineModel('header', {default: "New vehicle"});
let vehicleModelItems = defineModel('vehicleModelItems', {default: []});

const fieldRegistrationPlate = defineModel('fieldRegistrationPlate', {default: null});
const fieldVehicleModel = defineModel('fieldVehicleModel', {default: null});
const fieldFuelTankCapacity = defineModel('fieldFuelTankCapacity', {default: null});
const fieldAverageFuelConsumption = defineModel('fieldAverageFuelConsumption', {default: null});

const vehicleService = new VehicleService();

function reset() {
  fieldRegistrationPlate.value = null;
  fieldVehicleModel.value = null;
  fieldFuelTankCapacity.value = null;
  fieldAverageFuelConsumption.value = null;
}

function onConfirm() {
  vehicleService.create({
    registrationPlate: fieldRegistrationPlate.value,
    fuelTankCapacity: fieldFuelTankCapacity.value,
    averageFuelConsumption: fieldAverageFuelConsumption.value,
    vehicleModel: {
      data: {
        id: fieldVehicleModel.value,
        type: 'vehicle-models',
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
          <label for="field-registration-plate">Registration plate</label>
          <InputText v-model="fieldRegistrationPlate" id="field-registration-plate"/>
        </div>
        <div class="flex flex-col gap-2 mb-3">
          <label for="field-vehicle-model">Model</label>
          <Dropdown v-model="fieldVehicleModel" id="field-vehicle-model" filter optionLabel="label" optionValue="value"
                    :options="vehicleModelItems" placeholder="Select One"/>
        </div>
        <div class="flex flex-col gap-2 mb-3">
          <label for="field-fuel-tank-capacity">Fuel tank capacity, l</label>
          <InputNumber id="field-fuel-tank-capacity" v-model="fieldFuelTankCapacity" :min="0" :max="10000"
                       :minFractionDigits="3"
                       :maxFractionDigits="3"/>
        </div>
        <div class="flex flex-col gap-2 mb-3">
          <label for="field-average-fuel-consumption">Fuel tank capacity, l</label>
          <InputNumber id="field-average-fuel-consumption" v-model="fieldAverageFuelConsumption" :min="0" :max="1000"
                       :minFractionDigits="3"
                       :maxFractionDigits="3"/>
        </div>
      </form>
    </template>
  </ConfirmDialog>
</template>