<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-file-invoice"></i>
            <b>MONITORING PUPUK</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
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
                  name: 'erp_ho-fertilizer-input_sampel-edit-id',
                  params: { id: row.item.id },
                }"
                variant="link"
                size="sm"
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>
            </template>
            <template #cell(detail)="row">
              <b-button class="btn-info" size="sm" @click="row.toggleDetails">
                {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
              </b-button>
            </template>

            <template #row-details="row">
              <b-card>
                <b-container class="bv-example-row">
                  <b-row>
                    <b-col>Supplier : {{ row.item.supplier }}</b-col>
                    <b-col>PT : {{ row.item.company_name }}</b-col>
                    <b-col>Department : {{ row.item.department_name }}</b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col>
                      Joint Sampling : {{ row.item.f_joint_sampling }}
                    </b-col>
                    <b-col>
                      Jenis Pupuk : {{ row.item.fertilizer_type_code }}
                    </b-col>
                    <b-col>Parameter : {{ row.item.parameter }}</b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col>Satuan : {{ row.item.unit_code }}</b-col>
                    <b-col>QTY PO : {{ row.item.qty }}</b-col>
                    <b-col></b-col>
                  </b-row>
                </b-container>
              </b-card>
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
      title: 'Input Sampel',
    }
  },
  data() {
    return {
      allSelected: false,
      show_submit: true,

      fields: [
        // {
        //   label: 'Actions',
        //   key: 'actions',
        //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        // },
        // {
        //   label: 'Detail Data',
        //   key: 'detail',
        //   tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        // },
        {
          label: 'PO',
          key: 'po',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Supplier',
          key: 'supplier',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Kode Sampel',
          key: 'kode_sampel',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'PT',
          key: 'company_name',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Department',
          key: 'department_name',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Joint Sampling',
          key: 'f_joint_sampling',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Tanggal Terima',
          key: 'f_tgl_terima',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Lab Analisa',
          key: 'laboratory_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Kirim Ke Lab',
          key: 'f_kirim_lab',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Terima Lab',
          key: 'f_terima_lab',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Jenis Pupuk',
          key: 'fertilizer_type_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },

        {
          label: 'Parameter',
          key: 'parameter',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Satuan',
          key: 'unit_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'QTY PO',
          key: 'qty',
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Status',
          key: 'status',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
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
    const posts = await $axios.$get(
      `/api/admin/input_sampel?q=${search}&page=${page}`
    )

    console.log(posts.data.data)

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

            this.$axios
              .delete(`/api/admin/input_sampel/${id}`)
              .then((response) => {
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
        url: `/api/admin/monitoring_pupuk/export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Monitoring Pupuk.xlsx'
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
