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
            TAMBAH PGS DETAIL
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">

            

            <div class="form-group">
              <label>Nama Karyawan</label>
              <multiselect
                v-model="field.employee_id"
                :options="employee"
                label="employee_description"
                track-by="id"
                :searchable="true"
              ></multiselect>
              <div v-if="validation.employee_id" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.employee_id[0]
                }}</b-alert>
              </div>
            </div>


            <div class="form-group">
              <label>Start Date</label>
              <input
                type="date"
                v-model="field.start_date"
                placeholder=""
                class="form-control"
              />
              <div v-if="validation.start_date" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.start_date[0] 
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>End Date</label>
              <input
                type="date"
                v-model="field.end_date"
                placeholder=""
                class="form-control"
              />
              <div v-if="validation.end_date" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.end_date[0]
                }}</b-alert>
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
import el from '~/static/plugins/fullcalendar/locales/el'
export default {
  //layout
  layout: 'admin',

  //meta
  head() {
    return {
      title: 'Tambah PGS Detail',
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
      field: {
        pgs_id : '',
        employee_id: '',
        start_date: '',
        end_date: '',
        description: '',
        create_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
      },

      //state validation
      validation: [],
      employee: [],
      pgs:[],
      show: 1,

    }
  },

  mounted() {
  console.log('test',this.$route.params.id)
    this.field.created_at = this.currentDate()
    this.field.updated_at = this.currentDate()
    this.field.created_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    this.field.updated_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name


    //Data Employee
    this.$axios.get(`/api/admin/t_employee`)

      .then((response) => {
        this.employee = response.data.data

      })

     

    //Data Pgs
    this.$axios.get(`/api/admin/pgs/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.pgs_id = response.data.data.pgs_id
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
        name: 'erp_ho-master-pgs_detail-id',
        params: { id: this.$route.params.id, r: 1 },
        query: { employee_id: this.$route.params.id },
      })
    },

    isNumber(e) {
      let char = String.fromCharCode(e.keyCode)
      if (/^[0-9]+$/.test(char)) return true
      else e.preventDefault()
    },

    async storePost() {
      this.show = 0

      //define formData
      let formData = new FormData()

      formData.append(
        'employee_id',
        this.field.employee_id ? this.field.employee_id.id : ''
      )
      formData.append('pgs_id', this.$route.params.id)
      formData.append('start_date', this.field.start_date)
      formData.append('end_date', this.field.end_date)
      formData.append('description', this.field.description)
      formData.append('created_at', this.field.created_at)
      formData.append('created_by', this.field.created_by)
      formData.append('updated_at', this.field.updated_at)
      formData.append('udpated_by', this.field.udpated_by)

      await this.$axios
        .post(`/api/admin/pgs_detail`, formData)
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
          this.show = 1

          //assign error to state "validation"
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
