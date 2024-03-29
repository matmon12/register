<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="themeStore.theme"
      v-model="checkboxValue"
      @change="toggleCheckbox"
    />
    <div class="slider">
      <div class="round">
        <LineMdMoonToSunnyOutlineLoopTransition
          v-if="!themeStore.theme"
          class="round-img"
        />
        <LineMdSunnyOutlineToMoonLoopTransition
          v-else
          class="round-img"
        />
      </div>
    </div>
  </label>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useThemeStore } from "@/stores/theme.js";
import LineMdSunnyOutlineToMoonLoopTransition from '~icons/line-md/sunny-outline-to-moon-loop-transition';
import LineMdMoonToSunnyOutlineLoopTransition from '~icons/line-md/moon-to-sunny-outline-loop-transition';

const checkboxValue = ref();
const emit = defineEmits(["toggleSwitch"]);
const themeStore = useThemeStore();

const toggleCheckbox = () => {
  themeStore.setTheme();
  emit("toggleSwitch", checkboxValue.value);
};
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    display: none;
  }
}
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: all 0.4s;
  border-radius: 34px;
}
.round {
  position: absolute;
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: #fff;
  transition: all 0.4s;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &-img{
    width: 90%;
  }
}

input:checked + .slider {
  background-color: #079c70;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider .round {
  transform: translateX(26px);
}
</style>
