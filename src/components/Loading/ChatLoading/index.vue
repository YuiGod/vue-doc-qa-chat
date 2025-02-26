<script setup lang="ts"></script>

<template>
  <div class="loading">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  width: 54px;
  height: 18px;
  font-size: 0;
  color: #7f7522;
}

.loading.la-dark {
  color: #7f7522;
}

.loading > div {
  float: none;
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 4px;
  background-color: currentcolor;
  border: 0 solid currentcolor;
  border-radius: 100%;
  animation: ball-beat 0.7s -0.15s infinite linear;
}

.loading > div:nth-child(2n-1) {
  animation-delay: -0.5s;
}

@keyframes ball-beat {
  50% {
    opacity: 0.2;
    transform: scale(0.75);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
