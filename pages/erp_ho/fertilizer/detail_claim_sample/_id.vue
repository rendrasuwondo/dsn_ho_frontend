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
                    :to="{
                      name: 'erp_ho-fertilizer-claim_sample-id',
                      params: { id: this.$route.query.claim_id },
                    }"
                    class="nav-link"
                  >
                    <i class="nav-icon fas fa-chart-bar"></i>
                    <b>Klaim Sampel HAP</b>
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
              class="table-1"
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
            class="table-1"
          >
            <template v-slot:cell(comments)="row">
              <i class="fa fa-comments"></i> {{ row.item.comments.length }}
            </template>
            <template v-slot:custom-foot="data">
              <b-tr>
                <b-td colspan="4" align="right"><b>Kesimpulan</b></b-td>
                <b-td align="center">{{ summary }}</b-td>
              </b-tr>
            </template>
          </b-table>

          <div class="form-group mt-4 mb-4 dashed">
            <h6>
              <b>
                <i class="nav-icon fas fa-file-download"></i> DONWLOAD FILE
              </b>
            </h6>
            <b-container class="mb-1">
              <b-row>
                <b-col cols="12">
                  <p class="selected">
                    <span v-if="upload_files != null" class="cf-1">
                      <i class="nav-icon fas fa-file-alt cf-1 logo-file"></i>
                      <br />

                      File Tersimpan :<br />
                      <b>
                        {{ upload_files }}
                      </b>
                      <br />
                      <button
                        @click="fileDownload"
                        class="btn-info btn-upload"
                        title="Download File"
                      >
                        <i class="nav-icon fas fa-download"></i> Download
                      </button>
                    </span>
                    <span v-else class="cf-2">
                      <i class="nav-icon fas fa-file-alt logo-file"></i> <br />
                      Tidak Terdapat File Dalam Data Ini! <br />
                      <br />
                    </span>
                  </p>
                </b-col>
                <b-col cols="4"> </b-col>
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
            let formatter = new Intl.NumberFormat('es-IN', {
              minimumFractionDigits: 2,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          label: 'Hasil Analisa',
          key: 'value',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-IN')
            return formatter.format(value)
          },
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
      po: this.header,

      fields_header: [
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
          key: 'sample_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Jenis Pupuk',
          key: 'fertilizer_type_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Status Wf',
          key: 'request_status_name',
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
        url: `/api/admin/input_hasil/export?q=${this.search}&fertilizer_type_id=${this.fertilizer_type_id}&input_sampel_id=${this.input_sample_id}`,
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
  width: 120px;
  border-radius: 3px;
  padding: 3px 0px 3px 0px;
  margin-top: 10px;
  font-size: 14px;
  background-color: rgb(89, 89, 224);
  border: 1.5px solid rgb(111, 65, 228);
  box-shadow: 2px 2px 0px rgb(234, 228, 247);
  float: none;
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
  font-size: 15px;
  margin-bottom: 2px;
  margin-top: 2px;
  text-align: center;
}
input[type='file'] {
  display: none;
}
.table-1 {
  font-size: 15px;
}
.logo-file {
  font-size: 45px;
  border: 3px solid;
  padding: 15px;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  margin-bottom: 7px;
}
.cf-1 {
  color: rgb(163, 163, 255);
}
.cf-2 {
  color: rgb(205, 228, 235);
}
</style>
