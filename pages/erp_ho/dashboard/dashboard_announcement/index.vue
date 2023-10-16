<template>
    <div class="content-wrapper mb-5">
      <section class="content-header">
        <div class="container-fluid"></div>
      </section>
  
      <section class="content">
        <div class="card card-outline card-info">
          <div class="card-header">
            <h3 class="card-title">
              <i class="nav-icon fas fa-bullhorn"></i> Announcement
            </h3>
            <div class="card-tools"></div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <nuxt-link
                    :to="{ name: 'erp_ho-dashboard-dashboard_announcement-create' }"
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
                  name: 'erp_ho-dashboard-dashboard_announcement-edit-id',
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
        title: 'Announcement',
      }
    },
    data() {
      return {
        fields: [
          {
            label: 'Actions',
            key: 'actions',
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
          {
            label: 'No.Urut',
            key: 'sort',
            sortable: true,
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
          {
            label: 'Pengumuman',
            key: 'pengumuman',
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
          {
            label: 'Baru?',
            key: 'is_new_code',
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
          {
            label: 'Berlaku dari',
            key: 'date_start',
            formatter: (value, key, item) => {
              let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
            let date = new Date(value)
            let day  = date.getDate()
            let month = monthNames[date.getMonth()+1]
            let year  = date.getFullYear()
            if (day < 10) {
              day = '0' + day;
            }
            let format = `${day}-${month}-${year}`;
            return format
          },
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
          {
            label: 'Sampai',
            key: 'date_end',
            formatter: (value, key, item) => {
              let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
            if(value == null || value == '') {
              return '';
            }

            let date = new Date(value)
            let day  = date.getDate()
            let month = monthNames[date.getMonth()+1]
            let year  = date.getFullYear()
            if (day < 10) {
              day = '0' + day;
            }
            let format = `${day}-${month}-${year}`;
            return format
          },
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
        ],
        sweet_alert: {
          title: '',
          icon: '',
      },
    };
  },
  watchQuery: ['q', 'page'],

  async asyncData({ $axios, query }) {
    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //fetching posts
    const posts = await $axios.$get(
      `/api/admin/dashboard_announcement?q=${search}&page=${page}`
    )

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

            this.$axios.delete(`/api/admin/dashboard_announcement/${id}`).then((response) => {
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

    exportData() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/dashboard_announcement/export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'DasboardAnnouncement.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },
  }
}
  </script>
  
  <style>
  .card-info.card-outline {
    border-top: 5px solid #504d8d;
  }
  .card-title {
    color: #504d8d;
  }
  </style>
  