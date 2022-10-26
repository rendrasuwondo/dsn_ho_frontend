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
            <i class="nav-icon fas fa-chart-bar"></i>
            <b>TAMBAH CHART</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">
            <div class="form-group">
              <label>Jenis</label>
              <multiselect
                v-model="field.P_WF_ID"
                :options="init"
                label="DOC_NAME"
                track-by="P_WF_ID"
                :searchable="true"
              >
              </multiselect>
              <div v-if="validation.P_WF_ID" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.P_WF_ID[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Proses Sebelum</label>
              <multiselect
                v-model="field.P_WF_PROC_ID_PREV"
                :options="process"
                label="PROC_NAME"
                track-by="P_WF_PROC_ID_PREV"
                :searchable="true"
              >
              </multiselect>
              <div v-if="validation.P_WF_PROC_ID_PREV" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.P_WF_PROC_ID_PREV[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Proses Sesudah</label>
              <multiselect
                v-model="field.P_WF_PROC_ID_NEXT"
                :options="process"
                label="PROC_NAME"
                track-by="P_WF_PROC_ID_NEXT"
                :searchable="true"
              >
              </multiselect>
              <div v-if="validation.P_WF_PROC_ID_NEXT" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.P_WF_PROC_ID_NEXT[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Status Sebelum</label>
              <input
                type="text"
                v-model="field.DOC_STATUS_PREV"
                placeholder="Masukkan Status Sebelum"
                class="form-control"
              />
              <div v-if="validation.DOC_STATUS_PREV" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.DOC_STATUS_PREV[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Status Sesudah</label>
              <input
                type="text"
                v-model="field.DOC_STATUS_NEXT"
                placeholder="Masukkan Status Sesudah"
                class="form-control"
              />
              <div v-if="validation.DOC_STATUS_NEXT" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.DOC_STATUS_NEXT[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>No Sebelum</label>
              <input
                type="text"
                v-model="field.LISTING_NO"
                placeholder="Masukkan No Sebelum"
                class="form-control"
              />
              <div v-if="validation.LISTING_NO" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.LISTING_NO[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>No Sesudah</label>
              <input
                type="text"
                v-model="field.LISTING_NO_NEXT"
                placeholder="Masukkan No Sesudah"
                class="form-control"
              />
              <div v-if="validation.LISTING_NO_NEXT" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.LISTING_NO_NEXT[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Aktif?</label>
              <b-form-select v-model="field.IS_ACTIVE" :options="options">
              </b-form-select>
            </div>

            <div class="form-group">
              <label>Keterangan</label>
              <textarea
                v-model="field.DESCRIPTION"
                class="form-control"
                rows="3"
                placeholder="Masukkan Deskripsi Singkat"
              ></textarea>
              <div v-if="validation.DESCRIPTION" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.DESCRIPTION[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <b-row>
                <b-col>
                  <label>Tanggal Buat </label>
                  <b-form-datepicker
                    v-model="field.CREATE_DATE"
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
                    v-model="field.CREATE_BY"
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
                    v-model="field.UPDATE_DATE"
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
                    v-model="field.UPDATE_BY"
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
      title: 'Tambah Chart',
    }
  },

  data() {
    return {
      options: [
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],

      state: 'disabled',

      field: {
        P_WF_ID: '',
        P_WF_PROC_ID_PREV: '',
        P_WF_PROC_ID_NEXT: '',
        DOC_STATUS_PREV: '',
        DOC_STATUS_NEXT: '',
        LISTING_NO: '',
        LISTING_NO_NEXT: '',
        IS_ACTIVE: 'Y',
        DESCRIPTION: '',
        CREATE_DATE: '',
        UPDATE_DATE: '',
        CREATE_BY: '',
        UPDATE_BY: '',
      },

      init: [],
      process: [],

      //state validation
      validation: [],
      show: 1,
    }
  },

  mounted() {
    this.field.CREATE_DATE = this.currentDate()
    this.field.UPDATE_DATE = this.currentDate()
    this.field.CREATE_BY =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    this.field.UPDATE_BY =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name

    //Data Jenis
    this.$axios
      .get('/api/admin/lov_init_workflow')

      .then((response) => {
        this.init = response.data.data
      })

    //Data Process
    this.$axios
      .get('/api/admin/lov_process_workflow')

      .then((response) => {
        this.process = response.data.data
      })
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-workflow-chart',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    currentDate() {
      const current = new Date()
      const date = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()}`

      return date
    },

    async storePost() {
      //define formData
      this.show = 0

      let formData = new FormData()

      formData.append(
        'P_WF_ID',
        this.field.P_WF_ID.P_WF_ID ? this.field.P_WF_ID.P_WF_ID : ''
      )
      formData.append(
        'P_WF_PROC_ID_PREV',
        this.field.P_WF_PROC_ID_PREV.P_WF_PROC_ID
          ? this.field.P_WF_PROC_ID_PREV.P_WF_PROC_ID
          : ''
      )
      formData.append(
        'P_WF_PROC_ID_NEXT',
        this.field.P_WF_PROC_ID_NEXT.P_WF_PROC_ID
          ? this.field.P_WF_PROC_ID_NEXT.P_WF_PROC_ID
          : ''
      )
      formData.append('DOC_STATUS_PREV', this.field.DOC_STATUS_PREV)
      formData.append('DOC_STATUS_NEXT', this.field.DOC_STATUS_NEXT)
      formData.append('LISTING_NO', this.field.LISTING_NO)
      formData.append('LISTING_NO_NEXT', this.field.LISTING_NO_NEXT)
      formData.append('IS_ACTIVE', this.field.IS_ACTIVE)
      formData.append('DESCRIPTION', this.field.DESCRIPTION)
      formData.append('CREATE_DATE', this.field.CREATE_DATE)
      formData.append('CREATE_BY', this.field.CREATE_BY)
      formData.append('UPDATE_DATE', this.field.UPDATE_DATE)
      formData.append('UPDATE_BY', this.field.UPDATE_BY)

      //sending data to server
      await this.$axios
        .post('/api/admin/chart_workflow', formData)
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

          //redirect, if success store data
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
