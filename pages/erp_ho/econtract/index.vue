<template>
  <div class="content-nowrapper ml-3 mb-5 mr-3">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-list"></i> LIST SPK
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
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
              <a :href="concatenateLink(row.item.FILE_INTERNAL)" target="_blank">
                <b-button variant="link" size="sm" title="Pdf">
              <i class="fa fa-file-pdf"></i>            

              </b-button>
              </a>
            </template>
            </b-table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'view',

  head() {
    return {
      title: 'E-Contract',
    }
  },
  data() {
    return {
      account: this.$route.query.q_account,

      query_account: '',

      account: [],
      fields: [
          {
            label: 'Link',
            key: 'actions',
            tdClass: 'align-middle text-center',
          },
          {
            label: 'NO SPK',
            key: 'T_CONTRACT_ID',
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
          // {
          //   label: 'ACCOUNT',
          //   key: 'ACCOUNT',
          //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          // },
          // {
          //   label: 'Nama File',
          //   key: 'FILE_NAME',
          //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          // },
          {
            label: 'JUDUL',
            key: 'title',
            tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
          },
        ],  };
},
watchQuery: ['q', 'page', 'pr_no', 'q_account'],

  async asyncData({ $axios, query }) {

      //pr_no
      let pr_no = query.pr_no ? query.pr_no : ''

    //fetching posts
    const posts = await $axios.get(
      `/api/admin/econtract?pr_no=${pr_no}`
    )

    return {
      posts: posts.data.data,
    }
  },
  // mounted() {
      
  //     //fething ke Rest API 
  //     this.$axios.get('/api/admin/econtract')
  //       .then(response => {
          
  //         //assign response ke state "posts"
  //         this.posts = response.data.data

  //       })
  //       .catch(error => {
  //         console.log(error.response.data)
  //       })
  //   },
  methods: {
    concatenateLink(filePath) {
      const baseUrl = "http://192.168.202.43:2024"; // Your base URL
      const fullUrl = baseUrl + filePath;
      // console.log(fullUrl.replace("..", ""));
      // Use the router to navigate to the concatenated URL
      return(fullUrl.replace("..", ""));
    },
  },
}
</script>

<style>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
  font-size: 1.1rem;
  font-weight: bolder;
}
</style>
