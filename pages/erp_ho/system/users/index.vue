<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-users"></i> <b> USERS</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <nuxt-link
                  :to="{ name: 'erp_ho-system-users-create' }"
                  class="btn btn-info btn-sm"
                  style="padding-top: 8px"
                  title="Tambah"
                  ><i class="fa fa-plus-circle"></i>
                </nuxt-link>
                <button
                  title="Export To Excel"
                  class="btn btn-info"
                  @click="exportData"
                >
                  <i class="fa fa-file-excel"></i>
                </button>
              </div>
              <input
                type="text"
                class="form-control"
                v-model="search"
                @keypress.enter="searchData"
                placeholder=""
              />
              <div class="input-group-append">
                <button @click="searchData" class="btn btn-info">
                  <i class="fa fa-search"></i>
                  CARI
                </button>
              </div>
            </div>
          </div>
          <!-- table -->
          <b-table
            small
            responsive
            striped
            bordered
            hover
            :items="posts"
            :fields="fields"
            show-empty
          >
            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-system-users-edit-id',
                  params: { id: row.item.id },
                }"
                variant="link"
                size="sm"
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>
              <b-button
                variant="link"
                size="sm"
                @click="deletePost(row.item.id)"
                title="Hapus"
                ><i class="fa fa-trash"></i
              ></b-button>
            </template>
            <template v-slot:cell(sub_menu)="row">
              <b-button
                :to="{
                  name: 'system-sub_menu-id',
                  params: { id: row.item.id },
                  query: {
                    menu_id: row.item.id,
                  },
                }"
                variant="link"
                size=""
                title="Sub Menu"
              >
                <i class="fa fa-file-alt"></i>
              </b-button>
            </template>
            <template v-slot:cell(role)="row">
              <b-button
                :to="{
                  name: 'erp_ho-system-user_has_role_2-id',
                  params: { id: row.item.id },
                  query: {
                    menu_id: row.item.id,
                  },
                }"
                variant="link"
                size=""
                title="Role"
              >
                <i class="fa fa-file-alt"></i>
              </b-button>
            </template>
            <template v-slot:cell(company)="row">
              <b-button
                :to="{
                  name: 'erp_ho-system-user_company-id',
                  params: { id: row.item.id },
                  query: {
                    menu_id: row.item.id,
                  },
                }"
                variant="link"
                size=""
                title="Company"
              >
                <i class="fa fa-file-alt"></i>
              </b-button>
            </template>
          </b-table>
          <!-- pagination -->
          <b-row>
            <b-col
              ><b-pagination
                v-model="pagination.current_page"
                :total-rows="pagination.total"
                :per-page="pagination.per_page"
                @change="changePage"
                align="left"
                class="mt-1"
              ></b-pagination
            ></b-col>
            <b-col class="text-right" align-self="center"
              >{{ rowcount }} data</b-col
            >
          </b-row>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'admin',

  head() {
    return {
      title: 'Users',
    }
  },
  data() {
    return {
      fields: [
        {
          label: 'Actions',
          key: 'actions',
          tdClass: 'text-nowrap',
        },
        {
          label: 'Role',
          key: 'role',
          tdClass: 'align-middle text-center',
        },
        {
          label: 'PT',
          key: 'company',
          tdClass: 'align-middle text-center',
        },
        {
          label: 'User Name',
          key: 'user_name',
          tdClass: 'text-nowrap nameOfTheClass',
        },
        {
          label: 'Nama',
          key: 'name_employee',
          tdClass: 'text-nowrap',
        },
        {
          label: 'Jabatan',
          key: 'position_code',
          tdClass: 'text-nowrap',
        },
        {
          label: 'Departemen',
          key: 'department_code',
        },
        {
          label: 'Afdeling',
          key: 'afdeling_description',
        },
        {
          label: 'Email',
          key: 'email',
        },
        {
          label: 'Status',
          key: 'user_status',
        },
      ],
      sweet_alert: {
        title: '',
        icon: '',
      },
    }
  },
  watchQuery: ['q', 'page'],

  async asyncData({ $axios, query }) {
    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //fetching posts
    const posts = await $axios.$get(`/api/admin/users?q=${search}&page=${page}`)

    return {
      posts: posts.data.data,
      pagination: posts.data,
      search: search,
      rowcount: posts.data.total,
    }
  },

  methods: {
    changePage(page) {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          page: page,
        },
      })
    },
    //searchData
    searchData() {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.search,
        },
      })
    },

    exportData() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/users/export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Users.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    //deletePost method
    deletePost(id) {
      this.$swal
        .fire({
          title: 'APAKAH ANDA YAKIN ?',
          text: 'INGIN MENGHAPUS DATA INI !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'YA, HAPUS!',
          cancelButtonText: 'TIDAK',
        })
        .then((result) => {
          if (result.isConfirmed) {
            //delete tag from server

            this.$axios.delete(`/api/admin/users/${id}`).then((response) => {
              //feresh data
              this.$nuxt.refresh()

              if (response.data.success == true) {
                this.sweet_alert.title = 'BERHASIL!'
                this.sweet_alert.icon = 'success'
              } else {
                this.sweet_alert.title = 'GAGAL!'
                this.sweet_alert.icon = 'error'
              }

              //alert
              this.$swal.fire({
                title: this.sweet_alert.title,
                text: response.data.message,
                icon: this.sweet_alert.icon,
                showConfirmButton: false,
                timer: 2000,
              })
            })
          }
        })
    },
  },
}
</script>

<style scoped>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
</style>
