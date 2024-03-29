<template>
  <Line :data="dataUsers" :options="optionsUsers"/>
</template>

<script setup>
import { defineProps } from 'vue';
import { Line } from "vue-chartjs";


const props = defineProps({
  dataUsers: Object,
  optionsUsers: Object
})

</script>

<style lang="scss" scoped></style>
