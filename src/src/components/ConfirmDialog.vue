<script setup lang="ts">
const emit = defineEmits(['confirm', 'cancel'])

const visible = defineModel('visible', {default: false});
const header = defineModel('header', {default: "Header title"});

function onConfirm() {
  visible.value = false;
  emit('confirm');
}

function onCancel() {
  visible.value = false;
  emit('cancel');
}
</script>

<template>
  <Dialog v-model:visible="visible" modal v-model:header="header" :style="{ width: '50rem' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <slot></slot>
    <template #footer>
      <Button label="Cancel" icon="pi pi-check" @click="onCancel" severity="secondary"/>
      <Button label="Save" icon="pi pi-check" @click="onConfirm" severity="success"/>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">

</style>