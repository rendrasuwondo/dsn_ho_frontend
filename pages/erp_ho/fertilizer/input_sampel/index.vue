<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-file-signature"></i>
            <b>INPUT SAMPLE</b>
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
            v-model="visibleRows"
            class="table-1"
          >
            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-input_sampel-edit-id',
                  params: { id: row.item.id },
                  query: {
                    url: 'erp_ho-fertilizer-input_sampel',
                    tab_header: 'INPUT SAMPLE',
                  },
                }"
                variant="link"
                size="sm"
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>
            </template>
            <template v-slot:cell(input_hasil)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-input_hasil_analisa-id',
                  params: { id: row.item.id },
                  query: {
                    input_sample_id: row.item.id,
                    fertilizer_type_id: row.item.fertilizer_type_id,
                    url: 'erp_ho-fertilizer-input_sampel',
                    tab_header: 'INPUT SAMPLE',
                  },
                }"
                variant="link"
                size=""
                title="Hasil"
              >
                <i class="fa fa-file-alt"></i>
              </b-button>
            </template>

            <template v-slot:cell(hasil_status)="row">
              <b-link
                v-if="
                  row.item.upload_file !== null &&
                  (row.item.type_file === 'png' || row.item.type_file === 'jpg')
                "
                :href="`${$axios.defaults.baseURL}/storage/HAP/${row.item.upload_file}`"
                target="_blank"
              >
                {{ row.item.status }}
              </b-link>
              <b-link
                v-else-if="row.item.upload_file !== null"
                :href="`${$axios.defaults.baseURL}/storage/HAP/${row.item.upload_file}`"
              >
                <div v-if="row.item.status === 'OUTSPEK'" class="text-danger">
                  {{ row.item.status }}
                </div>
                <div v-else>{{ row.item.status }}</div>
              </b-link>
              <b-link
                v-else
                :href="`${$axios.defaults.baseURL}/storage/HAP/${row.item.upload_file}`"
                disabled
              >
                <div v-if="row.item.status === 'OUTSPEK'" class="text-danger">
                  {{ row.item.status }}
                </div>
                <div v-else>{{ row.item.status }}</div>
              </b-link>
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
                    <b-col cols="5">Supplier : {{ row.item.supplier }}</b-col>
                    <b-col cols="4">
                      Join Sampling : {{ row.item.k_join_sampling_at }}
                    </b-col>
                    <b-col cols="3">
                      QTY PO :
                      {{
                        row.item.qty.replace(
                          /(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
                          '$1\.'
                        )
                      }}
                    </b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col cols="5">PT : {{ row.item.company_name }}</b-col>
                    <b-col cols="4">
                      Tanggal GR : {{ row.item.k_gr_date }}
                    </b-col>
                    <b-col cols="3">
                      QTY GR :
                      {{
                        row.item.gr_qty.replace(
                          /(\d)(?=(\d{3})+(?:\.\d)?$)/g,
                          '$1\.'
                        )
                      }}
                    </b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col cols="5">
                      Department : {{ row.item.department_name }}
                    </b-col>
                    <b-col cols="4">
                      Jenis Pupuk : {{ row.item.fertilizer_type_code }}
                    </b-col>
                    <b-col cols="3">
                      PO Price :
                      {{
                        row.item.po_price.replace(
                          /(\d)(?=(\d{3})+(?:\.\d)?$)/g,
                          '$1\.'
                        )
                      }}
                    </b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col cols="5">Parameter : {{ row.item.parameter }}</b-col>
                    <b-col cols="4">Satuan : {{ row.item.unit_code }}</b-col>
                    <b-col cols="3">
                      Total Price :
                      {{ row.item.po_price * row.item.qty }}
                    </b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col cols="5">
                      Parameter Outspek : {{ row.item.parameter_outspek }}
                    </b-col>
                    <b-col cols="4"></b-col>
                    <b-col cols="3"></b-col>
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
      visibleRows: [],

      // items: [
      //   {
      //     supplier: '',
      //   },
      // ],
      fields: [
        {
          label: 'Actions',
          key: 'actions',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          label: 'Hasil Analisa',
          key: 'input_hasil',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          label: 'Detail Data',
          key: 'detail',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          label: 'PO',
          key: 'po',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Kode Sampel',
          key: 'sample_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Tanggal Terima',
          key: 'k_receipt_sampling_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Lab Analisa',
          key: 'laboratory_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Kirim Ke Lab',
          key: 'k_lab_send_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Terima Lab',
          key: 'k_lab_receipt_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Status',
          key: 'hasil_status',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Klaim Mutu Pupuk',
          key: 'fertilizer_analysis_calculation',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-IN')
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
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
    console.log('da')
    console.log(`/api/admin/input_sampel?q=${search}&page=${page}`)
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
        url: `/api/admin/input_sampel/export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Input Sampel.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },
  },

  computed: {
    // QTY_GR() {
    //   this.visibleRows = (value, key, item) => {
    //     let formatter = new Intl.NumberFormat('es-IN', {
    //       minimumFractionDigits: 2,
    //     })
    //     return visibleRows.format(value)
    //   }
    // },
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
.table-1 {
  font-size: 15px;
}
</style>
