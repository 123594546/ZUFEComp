<template><el-result icon="info" title="404" :sub-title="t('result.notFound')" /></template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
