<script setup lang="ts">
import { computed } from 'vue'
import { addUnit } from './addUnit'

const {
  width = '100%',
  height = '100%',
  radius = 12,
  top = 'auto',
  left = 'auto',
  right = 'auto',
  bottom = 'auto',
  padding = 0,
  absolute = false
} = defineProps<{
  width?: string | number
  height?: string | number
  radius?: string | number
  top?: string | number
  left?: string | number
  right?: string | number
  bottom?: string | number
  padding?: string | number
  absolute?: boolean
}>()

// 判断是否添加px
const c_width = computed(() => addUnit(width))
const c_height = computed(() => addUnit(height))
const c_radius = computed(() => addUnit(radius))
const c_padding = computed(() => addUnit(padding))
const c_top = top
const c_right = right
const c_bottom = bottom
const c_left = left
const c_absolute = computed(() => (absolute ? 'absolute' : 'static'))
</script>

<template>
  <div class="Glassmorphism relative overflow-hidden">
    <div class="circle absolute top-0 left-0"></div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
$circlePath: calc(v-bind(c_radius) * 2);
$radius: v-bind(c_radius);
$padding: v-bind(c_padding);
.Glassmorphism {
  margin: v-bind(c_top) v-bind(c_right) v-bind(c_bottom) v-bind(c_left);
  width: v-bind(c_width);
  height: v-bind(c_height);
  position: v-bind(c_absolute);
  border-radius: $radius;
  padding: 0 $padding 0;
  background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1));
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(6px);
  box-shadow: 0.8rem 0.8rem 1.3rem 0 rgba(0, 0, 0, 0.15);

  &::before,
  &::after {
    position: absolute;
    content: '';
    display: block;
    z-index: 2;
    border-radius: $radius;
  }

  &::before {
    width: calc(100% - v-bind(c_radius) * 2);
    height: 1px;
    top: 0;
    left: $radius;
    background: linear-gradient(to right, #fff, transparent);
  }

  &::after {
    width: 1px;
    height: calc(100% - v-bind(c_radius) * 2);
    top: $radius;
    left: 0;
    background: linear-gradient(to bottom, #fff, transparent);
  }
}

.circle {
  width: $circlePath;
  height: $circlePath;
  border-radius: 50%;
  border: 1px solid #fff;
  clip: rect(0, $radius, $radius, 0);
  z-index: -1;
}
</style>
