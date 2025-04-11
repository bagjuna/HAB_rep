<template>
  <div class="api-debug">
    <h2>API 연결 테스트</h2>
    <div v-if="loading">연결 테스트 중...</div>
    <div v-else-if="error" class="error">
      <p>API 연결 오류:</p>
      <p>
        {{ error }}
      </p>
    </div>
    <div v-else-if="data" class="success">
      <p>✅ API 연결 성공!</p>
      <p>{{ data.length }}개의 거래 내역을 불러왔습니다.</p>
      <button @click="testConnection">다시 테스트</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'ApiDebug',
  setup() {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const testConnection = async () => {
      loading.value = true
      error.value = null
      data.value = null

      try {
        const response = await axios.get('api/transactions')
        data.value = response.data
        console.log('API 응답:', response.data)
      } catch (err) {
        error.value = err.message
        console.error('API 오류:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      testConnection()
    })

    return {
      data,
      loading,
      error,
      testConnection,
    }
  },
}
</script>

<style scoped>
.api-debug {
  margin: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f8f8f8;
}

.error {
  color: red;
  background-color: #fff0f0;
  padding: 10px;
  border-radius: 4px;
}

.success {
  color: green;
  background-color: #f0fff0;
  padding: 10px;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
