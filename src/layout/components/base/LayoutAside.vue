<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const route = useRoute()

const menus = computed(() => {
  const menu = router.options.routes.filter(item => item.children)
  return menu[0].children
})

const appStore = useAppStore()
const collapse = computed(() => {
  return appStore.collapse
})
</script>

<template>
  <el-scrollbar>
    <el-menu :default-active="route.path" :collapse="collapse" router>
      <template v-for="subItem in menus" :key="subItem.path">
        <el-sub-menu v-if="subItem.children" :index="subItem.path">
          <template #title>
            <el-icon>
              <component :is="subItem.meta?.icon"></component>
            </el-icon>
            <span>{{ subItem.meta?.title }}</span>
          </template>
          <template v-for="item in subItem.children" :key="item.path">
            <el-menu-item :index="item.path">
              <el-icon>
                <component :is="item.meta?.icon"></component>
              </el-icon>
              <template #title>
                <span>{{ item.meta?.title }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-sub-menu>

        <el-menu-item v-else :index="subItem.path">
          <el-icon>
            <component :is="subItem.meta?.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ subItem.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.el-menu {
  border-right: 0;
}

.el-menu-item {
  height: 40px;
  margin: 5px 8px;
  line-height: 40px;
  border-radius: 10px;
}

.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--el-color-primary-light-7);
}
</style>
