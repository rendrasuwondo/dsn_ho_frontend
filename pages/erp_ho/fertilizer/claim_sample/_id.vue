<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <table>
              <tr>
                <td>
                  <nuxt-link
                    :to="{ name: 'erp_ho-fertilizer-claim' }"
                    class="nav-link"
                  >
                    <i class="nav-icon fas fas fa-tasks"></i>
                    <b>KLAIM HAP</b>
                  </nuxt-link>
                </td>
                <td>/ KLAIM SAMPEL HAP</td>
              </tr>
            </table>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <b-table
              striped
              bordered
              hover
              :items="header"
              :fields="fields_header"
              show-empty
            ></b-table>
          </div>
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-fertilizer-claim_sample-create-id',
                    params: { id: claim_id, r: 1 },
                  }"
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
                <button
                  title="Detail Claim Calculation"
                  class="btn btn-info"
                  @click="exportData2"
                >
                  <i class="fa fa-file-invoice"></i>
                </button>
              </div>
              <input
                type="text"
                class="form-control"
                v-model="search"
                @keypress.enter="searchData"
                placeholder="cari berdasarkan nama tag"
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
            class="table-1"
            :items="posts"
            :fields="fields"
            show-empty
          >
            <template v-slot:cell(comments)="row">
              <i class="fa fa-comments"></i> {{ row.item.comments.length }}
            </template>

            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-claim_sample-edit-id',
                  params: { id: row.item.id, r: 1 },
                  query: {
                    claim_id: row.item.claim_id,
                    t_fertilizer_sample_id: row.item.t_fertilizer_sample_id,
                  },
                }"
                variant="link"
                size=""
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>

              <b-button
                variant="link"
                size=""
                title="Hapus"
                @click="deletePost(row.item.id)"
                ><i class="fa fa-trash"></i
              ></b-button>
            </template>

            <template v-slot:cell(detail_nilai)="row">
              <b-button
                title="Detail Nilai Klaim Outspek"
                class="btn"
                variant="link"
                @click="exportData2"
              >
                <i class="fa fa-file-invoice"></i>
              </b-button>
            </template>

            <template #cell(detail)="row">
              <b-button class="btn-info" size="sm" @click="row.toggleDetails">
                {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
              </b-button>
            </template>

            <template #row-details="row">
              <b-card>
                <!-- <b-container class="bv-example-row"> -->
                <b-row>
                  <b-col cols="2"> QTY PO</b-col>
                  <b-col cols="2">
                    :
                    <span class="float-right">
                      {{
                        new Intl.NumberFormat('es-US').format(row.item.po_qty)
                      }}
                    </span>
                  </b-col>
                  <b-col cols="2"></b-col>
                  <b-col cols="2">PO PRICE</b-col>
                  <b-col cols="2">
                    :
                    <span class="float-right">
                      {{
                        new Intl.NumberFormat('es-US').format(row.item.po_price)
                      }}
                    </span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2"> QTY GR</b-col>
                  <b-col cols="2">
                    :
                    <span class="float-right">
                      {{
                        new Intl.NumberFormat('es-US').format(row.item.gr_qty)
                      }}
                    </span>
                  </b-col>
                  <b-col cols="2"></b-col>
                  <b-col cols="2">Klaim Mutu Pupuk</b-col>
                  <b-col cols="2">
                    :
                    <span class="float-right">
                      {{
                        new Intl.NumberFormat('es-US').format(
                          row.item.claim_fertilizer
                        )
                      }}
                    </span>
                  </b-col>
                </b-row>
                <!-- </b-container> -->
              </b-card>
            </template>

            <template v-slot:cell(detail_hap)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-detail_claim_sample-id',
                  params: { id: row.item.t_fertilizer_sample_id },
                  query: {
                    input_sample_id: row.item.t_fertilizer_sample_id,
                    fertilizer_type_id: row.item.fertilizer_type_id,
                    claim_id: row.item.claim_id,
                  },
                }"
                variant="link"
                size=""
                title="Status HAP"
                class="table-1"
              >
                <div
                  v-if="row.item.status === 'OUTSPEK'"
                  class="text-danger table-1"
                >
                  {{ row.item.status }}
                </div>
                <div v-else class="table-1">{{ row.item.status }}</div>
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
  //layout
  layout: 'admin',

  //meta
  head() {
    return {
      title: 'Klaim Sample HAP',
    }
  },

  //data function
  data() {
    return {
      //table header
      fields: [
        {
          label: 'Actions',
          key: 'actions',
          tdClass: '',
        },
        {
          label: 'Detail Data',
          key: 'detail',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          label: 'Status',
          key: 'request_status_name',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Hasil Analisa',
          key: 'detail_hap',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          label: 'NO.PO',
          key: 'po',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Kode Sampel',
          key: 'sample_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Supplier',
          key: 'supplier',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
      ],

      // header: [],

      claim_id: this.$route.params.id,

      fields_header: [
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'No. Klaim',
          key: 'claim_no',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        // {
        //   label: 'Keterangan',
        //   key: 'Description',
        //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        // },
        // {
        //   label: 'Aktif',
        //   key: 'is_active_code',
        //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        // },
      ],
      sweet_alert: {
        title: '',
        icon: '',
      },

      //state search
      search: '',
    }
  },

  //watch query URL
  watchQuery: ['q', 'page'],

  async asyncData({ $axios, query, route }) {
    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //fetching posts
    // const posts = await $axios.$get(
    //   `/api/admin/site?q=${search}&page=${page}`
    // )

    const { id } = route.params
    //role
    const claim = await $axios.get(`/api/admin/master/claim/${id}`)

    const header = [claim.data.data]

    //user_has_role
    const posts = await $axios.$get(
      `/api/admin/detail/claim_sample/${id}?q=${search}&page=${page}`
    )

    console.log('tes')
    console.log(posts)

    return {
      posts: posts.data.data,
      pagination: posts.data,
      rowcount: posts.data.total,
      search: search,
      header: header,
    }
  },

  methods: {
    //change page pagination
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

            this.$axios
              .delete(`/api/admin/claim_sample/${id}`)
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
        url: `/api/admin/claim_sample/export?q=${this.search}&claim_id=${this.claim_id}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Klaim Sample HAP.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    exportData2() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/claim_calculation/export?q=${this.search}&claim_id=${this.claim_id}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Detail Nilai Klaim Outspek.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },
  },

  mounted() {
    // this.$axios
    //   .get(`/api/admin/master/role/${this.$route.params.id}`)
    //   // .get(`/api/admin/site/site_loc/${this.$route.params.id}`)
    //   .then((response) => {
    //     //console.log(JSON.stringify(response.data.data))
    //     // console.log('rdr')
    //     console.log(response.data.data.role_id)
    //     this.header.push(response.data.data)
    //     // this.detail(response.data)
    //     // console.log(this.detail)
    //   })
  },
}
</script>

<style>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title .nav-link {
  color: #504d8d;
}
.table-1 {
  font-size: 14px;
}
</style>
