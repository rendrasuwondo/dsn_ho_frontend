<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-cog"></i> <b>Data Map Department</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <nuxt-link
                  :to="{ name: 'erp_ho-people-map_department-create' }"
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
                placeholder="Cari data..."
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
                  name: 'erp_ho-people-map_department-edit-id',
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
                @click="deleteRole(row.item.id)"
                title="Hapus"
                ><i class="fa fa-trash"></i
              ></b-button>
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
      title: 'Map Department',
    }
  },
  
  
    data() {
      return {
        //header table  
        fields: [
        {
          label: 'Actions',
          key: 'actions',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'SBU',
          key: 'sbu',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Organization Code',
          key: 'organization_code_peoplehub',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Organization Name',
          key: 'organization_name_peoplehub',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Department Code',
          key: 'department_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Aktif',
          key: 'is_active_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
      ],
        //posts data
        posts: [],
      }
    },

   
  watchQuery: ['q', 'page'],

  async asyncData({ $axios, query }) {
    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //fetching posts
    const posts = await $axios.$get(
      `/api/admin/map_department_people?q=${search}&page=${page}`
    )
    console.log('posts',posts)

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

    //deletePost method
    deleteRole(id) {
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

            this.$axios.delete(`/api/admin/map_department_people/${id}`)
              .then((response) => {
                //feresh data
                 this.$nuxt.refresh()
                if (response.data.success == true) {
                  this.$swal.fire({
                  title: 'BERHASIL!',
                  text: 'Data Berhasil Dihapus!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2000,
                })
                  
                } else {
                  this.$swal.fire({
                  title: 'GAGAL!',
                  text: 'Data Gagal dihapus!',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 2000,
                })
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

   exportData() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/map_department_people-export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Map_department.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
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
