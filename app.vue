<template>
  <div>
    <VitePwaManifest />
    <span class="branding">Made by SysWhite</span>
    <NuxtPage />
  </div>
</template>



<style scoped>
.branding {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.1;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #fff;
}
</style>