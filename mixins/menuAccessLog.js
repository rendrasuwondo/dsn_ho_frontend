// mixins/menuAccessLog.js
export default {
  methods: {
    async recordMenuLog(menuName) {
      try {
        // Ganti URL endpoint sesuai dengan route API baru di Laravel Anda
        await this.$axios.post('/api/admin/access_logs/daily', {
          action: menuName,
          version: 'web',
        })
      } catch (error) {
        // Silent error agar jika gagal insert log, halaman tetap berjalan normal
        console.error(
          'Gagal mencatat log menu:',
          error.response?.data || error.message
        )
      }
    },
  },
}
