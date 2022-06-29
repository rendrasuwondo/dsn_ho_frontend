<template>
  <nav class="mt-2">
    <ul
      class="nav nav-pills nav-sidebar flex-column list-menu"
      data-widget="treeview"
      role="menu"
      data-accordion="false"
    >
      <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
      <div v-html="menu"></div>
    </ul>
  </nav>
  <!-- /.sidebar-menu -->
</template>

<script>
export default {
  data() {
    return {
      mountains: [],
      menu: '',
      loading: false,
    }
  },
  // async fetch() {
  // this.mountains = await fetch('https://api.nuxtjs.dev/mountains').then(
  //   (res) => res.json()
  // )
  // },
  mounted() {
    this.$axios
      .get(`/api/admin/menu_user/${this.$route.path.replaceAll('/', '*')}`)

      .then((response) => {
        //console.log(JSON.stringify(response.data.data))
        // console.log('rdr')
        // console.log(
        //   `/api/admin/menu_user/${this.$route.path.replaceAll('/', '*')}`
        // )
        this.menu = response.data.data
        // this.detail(response.data)
        // console.log(this.detail)
      })

    //check akses Menu oleh User
    this.$axios
      .get(
        `/api/admin/check_user_menu/${this.$route.path.replaceAll('/', '*')}`
      )
      .then((response) => {
        if (response.data.data == 'Tidak') {
          this.$router.push('/erp_ho/admin/dashboard')
        }
      })
  },
}
</script>
<style scoped>
a.nuxt-link-active {
  background-color: rgba(54, 17, 80, 0.395);
}
</style>
