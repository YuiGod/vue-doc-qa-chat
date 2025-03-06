<script setup lang="ts">
import LayoutHeader from './components/base/LayoutHeader.vue'
import LayoutAside from './components/base/LayoutAside.vue'
import LayoutFooter from './components/base/LayoutFooter.vue'
</script>

<template>
  <el-container class="layout">
    <el-header>
      <LayoutHeader></LayoutHeader>
    </el-header>

    <el-container class="layout-body">
      <el-aside>
        <LayoutAside></LayoutAside>
      </el-aside>

      <el-main>
        <el-scrollbar class="layout-scrollbar">
          <div class="layout-main">
            <router-view v-slot="{ Component }">
              <keep-alive include="Chat">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
          <LayoutFooter class="el-footer" />
        </el-scrollbar>
        <el-backtop target=".layout-scrollbar .el-scrollbar__wrap" :right="50" :bottom="60" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;

  .el-header {
    padding: 0 10px;
    background-color: var(--el-color-primary-light-5);
  }

  .layout-body {
    height: 0;

    .el-main {
      padding: 0;
      background-color: var(--el-bg-color-page);
    }

    .el-footer {
      background-color: var(--el-bg-color-page);
    }
  }

  .layout-main {
    min-height: calc(100vh - var(--el-header-height) - var(--el-footer-height));
    padding: 20px;
  }
}
</style>
