<template>
  <PageLayout>
    <a-card :bordered="false">
      {{ message }}
    </a-card>
  </PageLayout>
</template>
<script>
import api from '@/api'
import { PageLayout } from '@/layouts'
export default {
  components: {
    PageLayout,
  },
  mounted() {
    console.log('mounted')
  },
  data() {
    return {
      message: 'hello world',
    }
  },
}
</script>
