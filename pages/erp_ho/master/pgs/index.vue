<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-cog"></i> <b>Data PGS</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <nuxt-link
                  :to="{ name: 'erp_ho-master-pgs-create' }"
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
                  title="Upload File"
                  class="btn btn-info"
                  @click="showModal"
                >
                  <i class="fa fa-file-upload"></i>
                </button>

                <button
                  title="Download Template Excel"
                  class="btn btn-info"
                  @click="exportDataTemplate"
                >
                  <i class="fa fa-file-alt"></i>
                </button>


                <!-- MODAL -->
                <b-modal ref="my-modal" hide-footer title="Form Upload File">
                  <!-- <div class="form-group">
                    <b-container fluid>
                      <b-row class="my-1">
                        <b-col sm="2">
                          <label for="input-small">Tahun :</label>
                        </b-col>
                        <b-col sm="10">
                          <multiselect
                            v-model="year_id"
                            :options="years"
                            label="year_at"
                            track-by="id"
                            :searchable="true"
                          ></multiselect>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container fluid>
                      <b-row class="my-1">
                        <b-col sm="2">
                          <label for="input-small">Bulan :</label>
                        </b-col>
                        <b-col sm="10">
                          <multiselect
                            v-model="month_id"
                            :options="months"
                            label="name"
                            track-by="id"
                            :searchable="true"
                          ></multiselect>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div> -->
                  <div class="form-group">
                    <b-container class="bv-example-row">
                      <b-row>
                        <b-col>
                          <p class="selected float-left">
                            <label class="mr-1">Pilih File :</label>
                            <!-- <br /> -->
                            <input
                              type="file"
                              name="file"
                              @change="upload"
                              id="actual-btn"
                              hidden
                            />

                            <!-- our custom upload button -->
                            <label for="actual-btn" class="f_upload">
                              Choose File
                            </label>
                            {{ files ? files.name : 'No File Chosen' }}
                          </p>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container class="bv-example-row">
                      <b-row>
                        <b-col>
                          <b-button
                            :disabled="files == null"
                            class="btn btn-info mr-1 btn-modal"
                            block
                            @click="submitFileUpload"
                          >
                            <i class="fa fa-upload"></i> UPLOAD
                          </b-button>
                        </b-col>
                        <b-col>
                          <b-button
                            class="btn btn-warning btn-modal"
                            block
                            @click="hideModal"
                          >
                            <i class="fa fa-redo"></i> BATAL
                          </b-button>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                </b-modal>

                <!-- END of Modal -->
               
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
                  name: 'erp_ho-master-pgs-edit-id',
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

            <template v-slot:cell(detail)="row">
              <b-button
                :to="{
                  name: 'erp_ho-master-pgs_detail-id',
                  params: { id: row.item.id },
                  query: {
                    pgs_detail_id: row.item.id,
                  },
                }"
                variant="link"
                size=""
                title="PGS"
              ><i class="fa fa-file-alt">
              </i>
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
      title: 'PGS',
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
          label: 'PGS',
          key: 'detail',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
       
        {
          label: 'Department',
          key: 'code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
      ],
        //posts data
        files: null,
        pgs:{},
        download_files:{},
        new_data: {},
        posts: [],
        year_id:'',
        month_id: '',
        years:[],
        months:[],
      }
    },


  
  watchQuery: ['q', 'page'],

  async asyncData({ $axios, query }) {
    //page

    const current = new Date()
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    // GET YEAR
    let year_id =[]

    let year_at = current.getFullYear()

    $axios.get(`/api/admin/lov_years?q_year_id=${year_at}`).then((response) => {
      year_id = response.data.data
    })


    // GET MONTH 
    let month_id = []
    let month_at = current.getMonth() + 1

    $axios
      .get(`/api/admin/lov_months?q_month_id=${month_at}`)
      .then((response) => {
        month_id = response.data.data
      })


    //fetching posts
    const posts = await $axios.$get(
      `/api/admin/pgs?q=${search}&page=${page}`
    )
    console.log('posts',posts)

    return {
      posts: posts.data.data,
      pagination: posts.data,
      search: search,
      rowcount: posts.data.total,
      year_id : year_id,
      month_id : month_id,
    }
  },

  methods: {

    showModal() {
      this.$refs['my-modal'].show()
    },

    hideModal() {
      this.$refs['my-modal'].hide()
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

            this.$axios.delete(`/api/admin/pgs/${id}`)
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
        url: `/api/admin/pgs-export?q=${this.search}`,
        method: 'get',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Pgs.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    async exportDataTemplate() {
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      let i_year =
        this.query_year_id === undefined ? year_at : this.query_year_id

      let i_month =
        this.query_month_id === undefined ? month_at : this.query_month_id

      await this.$axios
        .get(`/api/admin/lov_months?q_month_id=${i_month}`)
        .then((response) => {
          this.month_code = response.data.data
        })

      let month_code = this.month_code[0].name

      const headers = {
        'Content-Type': 'application/json',
      }

      await this.$axios({
        url: `/api/admin/template_pgs-export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Pgs_template_' + month_code + '_' + i_year + '.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    upload(e) {
      let files = e.target.files[0]
      this.files = files
    },


    // UPLOAD FILES METHOD
    async submitFileUpload() {
      const current = new Date()

      

      let formData = new FormData()
      formData.append('upload_file', this.files)
  
      await this.$axios
        .post('/api/admin/upload_file_pgs', formData)
        .then(() => {
          this.$swal.fire({
            title: 'BERHASIL!',
            text: 'Data Berhasil Disimpan!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          })


          this.$nuxt.refresh()
          this.hideModal()
          this.files = null;
        })
        .catch((error) => {
          //assign error to state "validation"
          this.validation = error.response.data
        })
    },

    fileDownload() {
      const headers = {
        'Content-Type': 'application/json',
      }


    const newData = this.$axios
        .get(`/api/admin/pgs/upload_file/${this.$route.params.id}`)
        .then((response) => {
          //data yang diambil
          this.newData = response.data.data.upload_file
     })


      this.$axios({
        url: `/api/admin/download_file?id=${this.$route.params.id}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = this.newData
        link.setAttribute('download', fileName) 
        document.body.appendChild(link)
        link.click()
      })
    },
      
    },


  mounted() {
    this.$axios.get(`/api/admin/pgs/upload_file/${this.$route.params.id}`)

    .then((response) => {
        this.pgs = response.data.data
          ? response.data.data.upload_file
          : null
    })

    
    
  }
}
</script>


<style scoped>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}

.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
.title-filter {
  font-size: 14px;
  margin-left: 8px;
}
.btn-modal {
  font-size: 16px;
  font-weight: bold;
}
.f_upload {
  background-color: rgba(82, 68, 190, 0.911);
  font-size: 14px;
  width: 150px;
  padding: 5px 0px 5px 0px;
  border-radius: 3px;
  color: white;
  box-shadow: 2px 3px #f7ebfd;
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: rgb(57, 50, 106);
  text-align: center;
  margin-right: 2px;
  font-weight: bold;
}

.f_upload:hover {
  background-color: rgb(64, 51, 161);
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: rgb(69, 61, 129);
}

#file-chosen {
  margin-left: 0.3rem;
  font-family: sans-serif;
}

</style>
