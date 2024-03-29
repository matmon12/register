<template>
  <div class="home">
    <p>Вы -</p>
    <span v-if="roleStore.role === 'GUEST'">гость</span>
    <span v-else-if="roleStore.role === 'USER'">юзер</span>
    <span v-else>админ</span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAbility } from "@casl/vue";
import { useRolesStore } from "@/stores/roles";
// roles
const roleStore = useRolesStore();
</script>

<style scoped lang="scss">
.home{
  display: flex;
  gap: 5px;
}
p,
span {
  display: inline;
}
</style>
