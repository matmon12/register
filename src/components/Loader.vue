<template>
  <div class="loader">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loader{
width: 100%;
display: flex;
align-items: center;
justify-content: center;
}
</style>
