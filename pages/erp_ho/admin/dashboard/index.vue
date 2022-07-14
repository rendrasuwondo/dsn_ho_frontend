<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-8 col-pos">
              <p class="m-0 text-1">
                <!-- <b> Hello, {{ this.$auth.user.employee.name }} </b> -->
                <br />
                <span class="text-2">
                  selamat datang di halaman dashboard website eLHM
                </span>
              </p>
            </div>

            <!-- /.col -->
            <div class="col-sm-4">
              <ol class="breadcrumb float-sm-right">
                <b-img
                  class="img-icon"
                  src="\img/dsn_logo.png"
                  alt="logo"
                ></b-img>
              </ol>
            </div>

            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <div>
        <b-img
          center
          class="img-logo"
          src="\img/dsn_img.png"
          alt="logo"
        ></b-img>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  //layout
  layout: 'admin',

  //meta
  head() {
    return {
      title: 'DSN - ERP HO',
    }
  },

  async asyncData({ $axios, $auth }) {
    //fetching dashboard
    const dashboard = await $axios.$get('/api/admin/dashboard')
    console.log('cek data')
    console.log($auth.user.employee.name)
    return {
      users: dashboard.data.users,
      posts: dashboard.data.posts,
      categories: dashboard.data.categories,
      comments: dashboard.data.comments,
    }
  },

  mounted() {
    console.log('cek data')
    console.log($auth.user.employee.name)
  },
}
</script>

<style>
.img-logo {
  height: 250px;
  margin-top: 5%;
}
.text-1 {
  font-size: 18px;
  color: #685f8c;
  letter-spacing: 1.5px;
  text-transform: capitalize;
  text-shadow: 2px 2px 4px #e5e5e5e9;
  font-family: 'Josefin Sans', sans-serif;
}
.text-2 {
  font-size: 16px;
}
.img-icon {
  height: 70px;
}
.col-pos {
  display: flex;
  align-items: center;
}
</style>
