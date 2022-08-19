<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-object-ungroup"></i>
            <b>IN PROCESS</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <nuxt-link
                  :to="{ name: 'erp_ho-fertilizer-join_sampling-create' }"
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
            <template v-slot:head(selected)="data">
              <span
                ><b-form-checkbox
                  @click.native.stop
                  @change="select"
                  v-model="allSelected"
                >
                </b-form-checkbox
              ></span>
            </template>
            <template v-slot:cell(selected)="row">
              <b-form-group>
                <input type="checkbox" v-model="row.item.selected" />
              </b-form-group>
            </template>
            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-join_sampling-edit-id',
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
            <template v-slot:custom-foot="data">
              <b-tr>
                <b-td colspan="14">
                  <b-button
                    size="sm"
                    variant="outline-primary"
                    @click="Submit"
                    v-if="rowcount > 0"
                  >
                    Submit
                  </b-button>
                </b-td>
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
      <div v-if="loading" class="loading-page">
        <p>Loading...</p>
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
      loading: false,
      allSelected: false,
      show_submit: true,

      fields: [
        {
          label: 'Approve',
          key: 'selected',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass ',
          sortable: false,
        },
        // {
        //   label: 'Actions',
        //   key: 'actions',
        //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        // },
        {
          label: 'Status',
          key: 'request_status_name',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
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
          label: 'Jenis Pupuk',
          key: 'fertilizer_type_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'PT',
          key: 'company_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Estate',
          key: 'department_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'QTY PO',
          key: 'qty',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-IN', {
              minimumFractionDigits: 2,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Satuan',
          key: 'unit_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'QTY GR',
          key: 'gr_qty',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-IN', {
              minimumFractionDigits: 2,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Tanggal GR',
          key: 'k_gr_date',
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Tanggal Kedatangan',
          key: 'k_arrived_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Join Sampling',
          key: 'k_join_sampling_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Klaim Untuk Pupuk',
          key: 'fertilizer_analysis_calculation',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-IN', {
              minimumFractionDigits: 2,
            })
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
      `/api/admin/in_process_prc?q=${search}&page=${page}`
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
              .delete(`/api/admin/t_fertilizer_sample/${id}`)
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

    select() {
      // alert('sa')
      // this.allSelected = !this.allSelected;
      this.posts.forEach((el) => {
        el.selected = this.allSelected
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
            //REJECT
            this.selectedData = []
            this.posts.forEach((el) => {
              if (el.selected_rna == true) {
                this.selectedData.push(el)
              }
            })
            // console.log('rendra')
            // console.log(this.selectedData)

            var i = 0
            let n = this.selectedData.length

            this.$axios
              .post(
                `/api/admin/update_request_status_prc_reject`,
                this.selectedData
              )
              .then((response) => {
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
          } else if (result.isDenied) {
            //APPROVE
            this.selectedData = []
            this.posts.forEach((el) => {
              if (el.selected == true) {
                this.selectedData.push(el)
              }
            })
            console.log('rendra')
            console.log(this.selectedData)

            var i = 0
            let n = this.selectedData.length

            this.$axios
              .post(
                `/api/admin/update_request_status_prc_approve`,
                this.selectedData
              )
              .then((response) => {
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
      // this.$swal
      //   .fire({
      //     title: 'APAKAH ANDA YAKIN ?',
      //     text: 'Melakukan Approved !',
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: '#d33',
      //     cancelButtonColor: '#3085d6',
      //     confirmButtonText: 'YA',
      //     cancelButtonText: 'TIDAK',
      //   })
      //   .then((result) => {
      //     if (result.isConfirmed) {
      //       this.selectedData = []
      //       this.posts.forEach((el) => {
      //         // if (el.selected == true) {
      //         //   this.selectedData.push(el)
      //         // }
      //         // this.selectedData.push(el)
      //       })
      //       console.log(this.selectedData)

      //       var i = 0
      //       let n = this.selectedData.length

      //       this.$axios
      //         .post(`/api/admin/update_request_status`, this.selectedData)
      //         .then(() => {
      //           this.$swal.fire({
      //             title: 'BERHASIL!',
      //             text: 'Data Berhasil Diupdate!',
      //             icon: 'success',
      //             showConfirmButton: false,
      //             timer: 2000,
      //           })

      //           this.$nuxt.refresh()
      //         })
      //     }
      //   })
    },

    exportData() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/in_process_prc/export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'In Process PRC.xlsx'
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
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
}
</style>
