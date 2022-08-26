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
                    :to="{ name: this.$route.query.url }"
                    class="nav-link"
                  >
                    <i class="nav-icon fas fas fa-chart-bar"></i>
                    <b>{{ this.$route.query.tab_header }}</b>
                  </nuxt-link>
                </td>
                <td>/ HASIL ANALISA</td>
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
            :items="posts"
            :fields="fields"
            outlined
            show-empty
          >
            <template v-slot:cell(comments)="row">
              <i class="fa fa-comments"></i> {{ row.item.comments.length }}
            </template>
            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-input_hasil_analisa-edit-id',
                  params: { id: row.item.id, r: 1 },
                  query: {
                    fertilizer_type_id: fertilizer_type_id,
                    input_sample_id: input_sample_id,
                    url: url,
                    tab_header: tab_header,
                  },
                }"
                variant="link"
                size=""
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>
            </template>
            <template v-slot:custom-foot="data">
              <b-tr>
                <b-td colspan="5" align="right"><b>Kesimpulan</b></b-td>
                <b-td align="center">{{ summary }}</b-td>
              </b-tr>
            </template>
          </b-table>

          <div class="form-group mt-4 mb-4 dashed">
            <h6>
              <b> <i class="nav-icon fas fa-file-upload"></i> UPLOAD FILE </b>
            </h6>
            <b-container class="mb-1">
              <b-row>
                <b-col cols="8">
                  <p class="selected">
                    File Tersimpan : <b> {{ upload_files }}</b>
                  </p>
                </b-col>
                <b-col cols="4">
                  <button
                    v-if="upload_files !== null"
                    @click="fileDownload"
                    class="btn-info btn-upload"
                    title="Download File"
                  >
                    <i class="nav-icon fas fa-download"></i> Download
                  </button>
                  <button
                    v-else
                    class="btn-upload"
                    title="File Tidak Ditemukan"
                    disabled
                  >
                    <i class="nav-icon fas fa-download"></i> Download
                  </button>
                </b-col>
              </b-row>
            </b-container>
            <b-container>
              <b-row>
                <b-col cols="8">
                  <p class="selected">
                    <label class="choose-file">
                      Enter Your File
                      <input
                        type="file"
                        name="file"
                        @change="upload"
                        class="choose-file"
                      />
                    </label>

                    Selected file: <b>{{ files ? files.name : null }}</b>
                  </p>
                </b-col>
                <b-col cols="4">
                  <button
                    v-if="files !== null"
                    @click="submitFileUpload"
                    class="btn-info btn-upload"
                    title="Upload File"
                  >
                    <i class="nav-icon fas fa-upload"></i> upload
                  </button>
                  <button
                    v-else
                    class="btn-upload"
                    disabled
                    title="Enter Your File"
                  >
                    <i class="nav-icon fas fa-upload"></i> upload
                  </button>
                </b-col>
              </b-row>
            </b-container>
          </div>
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
      title: 'Input Hasil Analisa',
    }
  },

  //data function
  data() {
    return {
      files: null,
      upload_files: {},
      donwload_file: {},
      newData: {},
      //table header
      fields: [
        {
          label: 'Actions',
          key: 'actions',
          tdClass: '',
        },
        {
          label: 'Parameter',
          key: 'parameter_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Nilai Standar',
          key: 'sni',
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Minimal Nilai',
          key: 'min_value',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat({
              minimumFractionDigits: 2,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Hasil Analisa',
          key: 'value',
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Status',
          key: 'status',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
      ],

      // header: [],
      fertilizer_type_id: this.$route.query.fertilizer_type_id,
      input_sample_id: this.$route.params.id,
      url: this.$route.query.url,
      tab_header: this.$route.query.tab_header,
      po: this.header,

      fields_header: [
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
          label: 'Jenis Pupuk',
          key: 'fertilizer_type_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Lab Analisa',
          key: 'laboratory_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
      ],
      sweet_alert: {
        title: '',
        icon: '',
      },

      //state search
      search: '',
      summary: '',
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
    const input_sampel = await $axios.get(
      `/api/admin/master/input_sampel/${id}`
    )

    const header = [input_sampel.data.data]

    const i_fertilizer_type_id = route.query.fertilizer_type_id

    //user_has_role
    const posts = await $axios.$get(
      `/api/admin/detail/table_hasil/${id}?q=${search}&page=${page}&fertilizer_type_id=${i_fertilizer_type_id}`
    )

    return {
      posts: posts.data,
      pagination: posts.data,
      rowcount: posts.data.length,
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
          fertilizer_type_id: this.$route.query.fertilizer_type_id,
          input_sample_id: this.$route.params.id,
          url: this.$route.query.url,
          tab_header: this.$route.query.tab_header,
        },
      })
    },

    upload(e) {
      // uploaded file
      let files = e.target.files[0]

      this.files = files
      console.log(this.files)
    },

    async submitFileUpload() {
      let formData = new FormData()
      formData.append('upload_file', this.files)
      formData.append('input_sample_id', this.$route.params.id)

      await this.$axios
        .post('/api/admin/upload_file', formData)
        .then(() => {
          //sweet alert

          this.$swal.fire({
            title: 'BERHASIL!',
            text: 'Data Berhasil Disimpan!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          })

          this.$nuxt.refresh()
          const upload_files = this.$axios
            .get(`/api/admin/master/upload_file/${this.$route.params.id}`)
            .then((response) => {
              //data yang diambil

              this.upload_files = response.data.data.upload_file
            })
          this.files = null
        })
        .catch((error) => {
          //assign error to state "validation"
          this.validation = error.response.data
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
              .delete(`/api/admin/input_hasil/${id}`)
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

    fileDownload() {
      const headers = {
        'Content-Type': 'application/json',
      }

      const newData = this.$axios
        .get(`/api/admin/master/upload_file/${this.$route.params.id}`)
        .then((response) => {
          //data yang diambil

          this.newData = response.data.data.upload_file
        })

      this.$axios({
        url: `/api/admin/download?fertilizer_sampel_id=${this.$route.params.id}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = this.newData
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    exportData() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/input_hasil/export?q=${this.search}&fertilizer_type_id=${this.fertilizer_type_id}&input_sampel_id=${this.input_sampel_id}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Hasil Analisa.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },
  },

  mounted() {
    let newData = []
    this.posts.forEach((value, index) => {
      newData.push(value.status)
      // console.log("newData", newData);
    })

    if (newData.includes('OUTSPEK') == true) {
      this.summary = 'OUTSPEK'
    } else {
      this.summary = 'INSPEK'
    }

    this.$axios
      .get(`/api/admin/master/upload_file/${this.$route.params.id}`)
      .then((response) => {
        //Mendapatkan nama file yang telah diupload
        this.upload_files = response.data.data
          ? response.data.data.upload_file
          : null
      })
  },

  computed: {
    totalStatus() {
      // var kesimpulan = ''
      // var int_outspek = 0
      // console.log(this.visibleRows)
      // this.fields.forEach((e) => {
      //   console.log('da')
      //   console.log(this.item)
      //   if ((e.status = 'OUTSPEK')) {
      //     int_outspek = 1
      //   }
      //   // return kesimpulan
      // })
      // if ((int_outspek = 1)) {
      //   kesimpulan = 'OUTSPEK'
      // } else {
      //   kesimpulan = 'INSPEK'
      // }
      // return kesimpulan
    },
    KESIMPULAN() {
      return 'data'
    },
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
.input-file {
  width: 100%;
}
.btn-upload {
  float: right;
  width: 110px;
  border-radius: 3px;
  padding: 2px 0px 2px 0px;
}
.dashed {
  border-style: dashed;
  padding: 10px;
  border-color: rgb(230, 242, 252);
}
h6 {
  color: #504d8d;
}
.choose-file {
  background-color: #504d8d;
  font-size: 13px;
  padding: 4px 10px 4px 10px;
  border-radius: 3px;
  color: white;
  box-shadow: 2px 3px #f7ebfd;
}
.selected {
  font-size: 13px;
}
input[type='file'] {
  display: none;
}
</style>
