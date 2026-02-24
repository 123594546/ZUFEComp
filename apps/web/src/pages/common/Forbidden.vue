<template><el-result icon="warning" title="403" :sub-title="t('result.forbidden')" /></template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
