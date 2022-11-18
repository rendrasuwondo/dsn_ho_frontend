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
                      name: this.$route.query.url,
                      query: {
                        q_month_id: this.$route.query.q_month_id,
                        q_year_id: this.$route.query.q_year_id,
                      },
                    }"
                    class="nav-link"
                  >
                    <i class="nav-icon fas fa-file-archive"></i>
                    <b>{{ this.$route.query.tab_header }}</b>
                  </nuxt-link>
                </td>
                <td>/ Detail Upload</td>
              </tr>
            </table>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
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
            <template v-slot:cell(download_file)="row">
              <b-button
                variant="link"
                size=""
                @click="fileDownload(row.item.HISTORY_FILE_ID)"
                title="Download File"
                class="table-1"
              >
                <i class="nav-icon fas fa-file-download"></i>
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
      title: 'Data Detail Upload',
    }
  },

  //data function
  data() {
    return {
      files: null,
      upload_files: {},
      donwload_file: {},
      newData: {},
      fields: [
        {
          label: 'Download File',
          key: 'download_file',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          label: 'Nama File',
          key: 'FILE_HISTORY',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Tanggal Upload',
          key: 'update_date',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Diupload Oleh',
          key: 'UPDATE_BY',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
      ],

      // header: [],
      account: this.$route.query.account,

      sweet_alert: {
        title: '',
        icon: '',
      },
    }
  },

  //watch query URL
  watchQuery: ['q', 'page'],

  async asyncData({ $axios, query, route }) {
    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //account
    const account = route.query.account

    //q_year_id
    const q_year_id = route.query.q_year_id ? route.query.q_year_id : ''

    //q_month_id
    const q_month_id = route.query.q_month_id ? route.query.q_month_id : ''

    //user_has_role
    const posts = await $axios.$get(
      `/api/admin/history_upload_file?q=${search}&page=${page}&account=${account}&q_month_id=${q_month_id}&q_year_id=${q_year_id}`
    )

    return {
      posts: posts.data.data,
      rowcount: posts.data.total,
      search: search,
      rowcount: posts.data.total,
      pagination: posts.data,
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
          account: this.$route.query.account,
          url: this.$route.query.url,
          tab_header: this.$route.query.tab_header,
        },
      })
    },

    //searchData
    searchData() {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.search,
          account: this.$route.query.account,
          url: this.$route.query.url,
          tab_header: this.$route.query.tab_header,
        },
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

    fileDownload(history_id) {
      const headers = {
        'Content-Type': 'application/json',
      }

      const newData = this.$axios
        .get(`/api/admin/master/data_file_history/${history_id}`)
        .then((response) => {
          //data yang diambil
          this.newData = response.data.data.FILE_HISTORY
        })

      this.$axios({
        url: `/api/admin/download_history?history_id=${history_id}`,
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
  },

  mounted() {
    let newData = []
    this.posts.forEach((value, index) => {
      newData.push(value.status)
      // console.log("newData", newData);
    })
  },

  computed: {
    // KESIMPULAN() {
    //   return 'data'
    // },
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
.btn-upd {
  background-color: #8177cf;
  font-size: 13px;
  width: 120px;
  padding: 5px 0px 5px 0px;
  border-radius: 3px;
  color: white;
  border: none;
  box-shadow: 2px 3px #f7ebfd;
  margin-top: 5px;
}
.btn-upd:hover {
  background-color: rgb(100, 87, 200);
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
