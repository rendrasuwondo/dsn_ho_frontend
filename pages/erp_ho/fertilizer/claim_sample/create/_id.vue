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
            <i class="nav-icon fas fa-swatchbook"></i>
            <b>TAMBAH KLAIM SAMPEL HAP</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">
            <div class="form-group">
              <label>NO.PO</label>
              <multiselect
                v-model="field.t_fertilizer_sample_id"
                :options="po_no"
                label="po"
                track-by="id"
                :searchable="true"
              ></multiselect>
              <div v-if="validation.t_fertilizer_sample_id" class="mt-2">
                <b-alert show variant="danger">
                  {{ validation.t_fertilizer_sample_id[0] }}
                </b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Apakah Sudah Lengkap?</label>
              <b-form-select v-model="field.is_completed" :options="options">
              </b-form-select>
              <div v-if="validation.is_completed" class="mt-2">
                <b-alert show variant="danger">
                  {{ validation.is_completed[0] }}
                </b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Keterangan</label>
              <textarea
                v-model="field.description"
                class="form-control"
                rows="3"
                placeholder="Masukkan Deskripsi Singkat"
              ></textarea>
              <div v-if="validation.description" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.description[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <b-row>
                <b-col>
                  <label>Tanggal Buat </label>
                  <b-form-datepicker
                    v-model="field.created_at"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }"
                    :disabled="disabled"
                  ></b-form-datepicker>
                </b-col>
                <b-col
                  ><label>Pembuat</label>
                  <input
                    type="text"
                    v-model="field.created_by"
                    class="form-control"
                    readonly
                /></b-col>
              </b-row>
            </div>

            <div class="form-group">
              <b-row>
                <b-col
                  ><label>Tanggal Ubah </label>

                  <b-form-datepicker
                    v-model="field.updated_at"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }"
                    :disabled="disabled"
                  ></b-form-datepicker
                ></b-col>
                <b-col>
                  <label>Pengubah</label>
                  <input
                    type="text"
                    v-model="field.updated_by"
                    class="form-control"
                    readonly
                  />
                </b-col>
              </b-row>
            </div>

            <div class="form-group"></div>

            <button class="btn btn-info mr-1 btn-submit" type="submit">
              <i class="fa fa-paper-plane"></i> SIMPAN
            </button>
            <button
              v-on:click="back()"
              class="btn btn-warning btn-reset"
              type="reset"
            >
              <i class="fa fa-redo"></i> BATAL
            </button>
          </form>
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
      title: 'Tambah Klaim Sampel HAP',
    }
  },

  components: {
    'ckeditor-nuxt': () => {
      if (process.client) {
        return import('@blowstack/ckeditor-nuxt')
      }
    },
  },

  data() {
    return {
      options: [
        { value: 1, text: 'Ya' },
        { value: 0, text: 'Tidak' },
      ],

      state: 'disabled',
      value: undefined,

      field: {
        claim_id: '',
        t_fertilizer_sample_id: '',
        is_completed: 0,
        description: '',
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
      },

      claim_id: '',

      po_no: [],

      //state validation
      validation: [],

      show: 1,

      //config CKEDITOR
      editorConfig: {
        removePlugins: ['Title'],
        simpleUpload: {
          uploadUrl: 'http://localhost:8000/api/web/posts/storeImage',
        },
      },
    }
  },

  mounted() {
    this.field.created_at = this.currentDate()
    this.field.updated_at = this.currentDate()
    this.field.created_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    this.field.updated_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    // this.$refs.user_name.focus()

    this.$axios
      .get(`/api/admin/master/claim/${this.$route.params.id}`)

      .then((response) => {
        this.claim_id = response.data.data.id

        this.$nuxt.$loading.start()
      })

    //Data Users
    this.$axios
      .get('/api/admin/lov_fertilizer_sample_claim')

      .then((response) => {
        this.po_no = response.data.data
      })
  },

  methods: {
    currentDate() {
      const current = new Date()
      const date = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()}`

      return date
    },

    back() {
      this.$router.push({
        name: 'erp_ho-fertilizer-claim_sample-id',
        params: { id: this.$route.params.id, r: 1 },
        query: { claim_id: this.$route.params.id },
      })
    },

    async storePost() {
      //define formData
      this.show = 0

      let formData = new FormData()

      formData.append(
        't_fertilizer_sample_id',
        this.field.t_fertilizer_sample_id
          ? this.field.t_fertilizer_sample_id.id
          : ''
      )
      formData.append('claim_id', this.$route.params.id)
      formData.append('is_completed', this.field.is_completed)
      formData.append('description', this.field.description)
      formData.append('created_at', this.field.created_at)
      formData.append('created_by', this.field.created_by)
      formData.append('updated_at', this.field.updated_at)
      formData.append('updated_by', this.field.updated_by)

      await this.$axios
        .post('/api/admin/claim_sample', formData)
        .then(() => {
          this.show = 1

          //sweet alert
          this.$swal.fire({
            title: 'BERHASIL!',
            text: 'Data Berhasil Disimpan!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          })
          this.back()
        })
        .catch((error) => {
          //assign error to state "validation"
          // alert(error)
          // console.log(error.response.data.message)
          this.show = 1

          this.$swal.fire({
            title: 'ERROR!',
            text: error.response.data.message,
            icon: 'error',
            showConfirmButton: true,
          })

          this.validation = error.response.data
        })
    },
  },

  computed: {
    disabled() {
      return this.state === 'disabled'
    },
    readonly() {
      return this.state === 'readonly'
    },
  },
}
</script>

<style>
.ck-editor__editable {
  min-height: 200px;
}
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
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
