<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <div v-if="show === 0">
      <b-img right src="\img/dsn_logo.png" alt="" class="img-logo"></b-img>
      <p class="txt-2">Loading</p>
      <div class="spinonediv-4"></div>
    </div>

    <section class="content" v-if="show === 1">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-file-signature"></i>
            <b>IN PROCESS</b>
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
            outlined
            hover
            :items="posts"
            :fields="fields"
            show-empty
            v-model="visibleRows"
            class="table-1"
            :tbody-tr-class="rowClass"
          >
            <template v-slot:head(selected_rna)="data">
              <span
                ><b-form-checkbox
                  v-show="false"
                  @click.native.stop
                  @change="select"
                  v-model="allSelected"
                >
                </b-form-checkbox
              ></span>
            </template>
            <template v-slot:cell(selected_rna)="row">
              <b-form-group>
                <input
                  type="checkbox"
                  v-model="row.item.selected_rna"
                  :disabled="row.item.status == null"
                />
              </b-form-group>
            </template>
            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-input_sampel-edit-id',
                  params: { id: row.item.id },
                  query: {
                    url: 'erp_ho-fertilizer-in_process_rna',
                    tab_header: 'IN PROCESS',
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
                    url: 'erp_ho-fertilizer-in_process_rna',
                    tab_header: 'IN PROCESS (RNA)',
                  },
                }"
                variant="link"
                size=""
                title="Input Hasil Analisa"
              >
                <span v-if="row.item.status !== null">
                  {{ row.item.status }}
                </span>
                <span v-else>Data belum Terinput</span>
              </b-button>
            </template>

            <template v-slot:cell(detail_klaim)="row">
              <div v-if="row.item.status != null">
                {{
                  new Intl.NumberFormat('es-US').format(
                    row.item.fertilizer_analysis_calculation
                  )
                }}
              </div>
            </template>

            <template v-slot:cell(detail_hap)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-detail_hap-id',
                  params: { id: row.item.id },
                  query: {
                    input_sample_id: row.item.id,
                    fertilizer_type_id: row.item.fertilizer_type_id,
                    url: 'erp_ho-fertilizer-in_process_rna',
                    tab_header: 'IN PROCESS (RNA)',
                  },
                }"
                variant="link"
                size=""
                title="Status"
                class="table-1"
              >
                {{ row.item.status }}
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
                  <b-col cols="2">Supplier</b-col>
                  <b-col cols="3">: {{ row.item.supplier }}</b-col>
                  <b-col cols="1">Tanggal GR</b-col>
                  <b-col cols="2">: {{ row.item.k_gr_date }}</b-col>
                </b-row>
                <b-row>
                  <b-col cols="2">PT</b-col>
                  <b-col cols="3">: {{ row.item.company_name }}</b-col>
                  <b-col cols="1">Satuan</b-col>
                  <b-col cols="2">: {{ row.item.unit_code }}</b-col>
                </b-row>
                <b-row>
                  <b-col cols="2">Dept.</b-col>
                  <b-col cols="3">: {{ row.item.department_name }}</b-col>
                  <b-col cols="1">QTY PO</b-col>
                  <b-col cols="2">
                    :
                    <span class="float-right">
                      {{ new Intl.NumberFormat('es-US').format(row.item.qty) }}
                    </span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2">Jenis Pupuk</b-col>
                  <b-col cols="3">
                    : {{ row.item.fertilizer_type_code }}
                  </b-col>
                  <b-col cols="1">QTY GR</b-col>
                  <b-col cols="2">
                    :
                    <span class="float-right">
                      {{
                        new Intl.NumberFormat('es-US').format(row.item.gr_qty)
                      }}
                    </span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2">Parameter</b-col>
                  <b-col cols="3"> : {{ row.item.parameter }} </b-col>
                  <b-col cols="1">PO Price</b-col>
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
                  <b-col cols="2">Parameter Outspek</b-col>
                  <b-col cols="3"> : {{ row.item.parameter_outspek }} </b-col>
                  <b-col cols="1">Total Price</b-col>
                  <b-col cols="2">
                    :
                    <span class="float-right">
                      {{
                        new Intl.NumberFormat('es-US').format(row.item.t_price)
                      }}
                    </span>
                  </b-col>
                </b-row>
                <!-- </b-container> -->
              </b-card>
            </template>
            <template v-slot:custom-foot="data">
              <b-tr>
                <b-td colspan="13"
                  ><b-button
                    size="sm"
                    variant="outline-primary"
                    @click="Submit"
                    v-if="rowcount > 0"
                    >Submit</b-button
                  ></b-td
                >
              </b-tr>
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
      title: 'In Process',
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
          label: 'Approve',
          key: 'selected_rna',
          thClass: 'text-right',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass ',
          sortable: false,
        },
        {
          label: 'Actions',
          key: 'actions',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Hasil Analisa',
          key: 'input_hasil',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Detail Data',
          key: 'detail',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Status',
          key: 'request_status_name',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        // {
        //   thClass: 'align-middle text-left text-nowrap nameOfTheClass',
        //   label: 'Hasil',
        //   key: 'detail_hap',
        //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        // },
        {
          label: 'PO',
          key: 'po',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Kode Sampel',
          key: 'sample_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Joint Sampling',
          key: 'k_join_sampling_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Tanggal Terima',
          key: 'k_receipt_sampling_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Lab Analisa',
          key: 'laboratory_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Kirim Ke Lab',
          key: 'k_lab_sent_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Terima Lab',
          key: 'k_lab_receipt_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },

        {
          thClass: 'align-middle text-left text-nowrap nameOfTheClass',
          label: 'Klaim Mutu Pupuk',
          key: 'detail_klaim',
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
      ],
      sweet_alert: {
        title: '',
        icon: '',
      },

      show: 1,
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
      `/api/admin/input_sampel?q=${search}&page=${page}&request_status_code=j`
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
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'OUTSPEK') return 'table-danger'
    },

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
        url: `/api/admin/in_process_rna/export?q=${this.search}&request_status_code=j`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'In Process.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    select() {
      // alert('sa')
      // this.allSelected = !this.allSelected;
      this.posts.forEach((el) => {
        el.selected_rna = !this.allSelected
      })
    },

    Submit() {
      this.$swal
        .fire({
          title: 'Message',
          input: 'text',
          icon: 'warning',
          inputPlaceholder: 'Hanya diisi jika melakukan Reject...',
          showDenyButton: true,
          reverseButtons: true,
          confirmButtonText: 'Reject',
          denyButtonText: 'Approve',
          confirmButtonColor: 'red',
          denyButtonColor: '#3085d6',
          allowOutsideClick: true,
          customClass: {
            validationMessage: 'my-validation-message',
          },
          preConfirm: (value) => {
            if (!value) {
              this.$swal.showValidationMessage(
                '<i class="fa fa-info-circle"></i> Message harus diisi!'
              )
            }
          },
          preDeny: (value) => {
            if (!value) {
              this.$swal.showValidationMessage(
                '<i class="fa fa-info-circle"></i> Message harus diisi!'
              )
            }
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.show = 0

            //REJECT
            this.selectedData = []
            this.posts.forEach((el) => {
              if (el.selected_rna == true) {
                this.selectedData.push(el)
              }
            })
            console.log('rendra')
            console.log(result.value)
            console.log(this.selectedData)

            var i = 0
            let n = this.selectedData.length

            let formData = [this.selectedData, result.value]

            this.$axios
              .post(`/api/admin/update_request_status_rna_reject`, formData)
              .then((response) => {
                this.$swal.fire({
                  title: 'BERHASIL!',
                  text: 'Data Berhasil Di Approve!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2000,
                })
              })

            this.$router.push({
              name: 'erp_ho-fertilizer-in_process_rna',
              params: {},
              query: {},
            })
            this.show = 1
            this.$nuxt.refresh()
            // alert(result.value)
            //  this.$swal.fire('Changes are not saved', '', 'info')
            // this.$swal.fire.showValidationMessage(
            //       '<i class="fa fa-info-circle"></i> Your name is required'
            //     )
          } else if (result.isDenied) {
            //APPROVE
            this.show = 0

            this.selectedData = []
            this.posts.forEach((el) => {
              if (el.selected_rna == true) {
                this.selectedData.push(el)
              }
            })

            var i = 0
            let n = this.selectedData.length

            let formData = [this.selectedData]

            // console.log('rendra')
            // console.log(formData)

            this.$axios
              .post(`/api/admin/update_request_status_rna_approve`, formData)
              .then((response) => {
                this.show = 1

                this.$swal.fire({
                  title: 'BERHASIL!',
                  text: 'Data Berhasil Di Approve!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2000,
                })
              })

            this.$nuxt.refresh()
            // alert(result.value)
            //  this.$swal.fire('Changes are not saved', '', 'info')
            // this.$swal.fire.showValidationMessage(
            //       '<i class="fa fa-info-circle"></i> Your name is required'
            //     )
          }
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
.cs-1 {
  font-size: 12px;
}
.img-logo {
  width: 160px;
  padding-top: 10px;
  padding-right: 20px;
}
.txt-2 {
  color: #be65e2;
  padding-top: 17%;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  font-size: 27px;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.148);
  font-weight: bold;
}
</style>
