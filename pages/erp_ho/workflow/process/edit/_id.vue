<template>
  <div class="content-wrapper">
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
            <i class="nav-icon fas fa-sync-alt"></i> <b>EDIT Proses</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>Proses</label>
              <input
                type="text"
                v-model="field.PROC_NAME"
                placeholder="Masukkan Nama Dokument"
                class="form-control"
                ref="PROC_NAME"
              />
              <div v-if="validation.PROC_NAME" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.PROC_NAME[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Display</label>
              <input
                type="text"
                v-model="field.DISPLAY_NAME"
                placeholder="Masukkan Display"
                class="form-control"
              />
              <div v-if="validation.DISPLAY_NAME" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.DISPLAY_NAME[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>File Taksbox</label>
              <input
                type="text"
                v-model="field.TASKBOX_FILE"
                placeholder="Masukkan  File Taksbox"
                class="form-control"
              />
              <div v-if="validation.TASKBOX_FILE" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.TASKBOX_FILE[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Before Submit</label>
              <input
                type="text"
                v-model="field.SUBMIT_BEFORE"
                placeholder="Masukkan Before Submit"
                class="form-control"
              />
              <div v-if="validation.SUBMIT_BEFORE" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.SUBMIT_BEFORE[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>After Submit</label>
              <input
                type="text"
                v-model="field.SUBMIT_AFTER"
                placeholder="Masukkan After Submit"
                class="form-control"
              />
              <div v-if="validation.SUBMIT_AFTER" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.SUBMIT_AFTER[0]
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
      title: 'Edit Proses',
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
        PROC_NAME: '',
        DISPLAY_NAME: '',
        TASKBOX_FILE: '',
        SUBMIT_BEFORE: '',
        SUBMIT_AFTER: '',
        P_APPLICATION_ID: '',
        IS_ACTIVE: '',
        DESCRIPTION: '',
        CREATE_DATE: '',
        UPDATE_DATE: '',
        CREATE_BY: '',
        UPDATE_BY: '',
      },

      parent: [],

      //state validation
      validation: [],
      show: 1,
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/process_workflow/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.PROC_NAME = response.data.data.PROC_NAME
        this.field.DISPLAY_NAME = response.data.data.DISPLAY_NAME
        this.field.TASKBOX_FILE = response.data.data.TASKBOX_FILE
        this.field.SUBMIT_BEFORE = response.data.data.SUBMIT_BEFORE
        this.field.SUBMIT_AFTER = response.data.data.SUBMIT_AFTER
        this.field.P_APPLICATION_ID = response.data.data.P_APPLICATION_ID
        this.field.IS_ACTIVE = response.data.data.IS_ACTIVE
        this.field.DESCRIPTION = response.data.data.DESCRIPTION
        this.field.CREATE_DATE = response.data.data.CREATE_DATE
        this.field.UPDATE_DATE = response.data.data.UPDATE_DATE
        this.field.CREATE_BY = response.data.data.CREATE_BY
        this.field.UPDATE_BY = response.data.data.UPDATE_BY
      })
    this.$refs.PROC_NAME.focus()
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-workflow-process',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()
      this.show = 0

      //send data ke Rest API untuk update
      await this.$axios
        .put(`/api/admin/process_workflow/${this.$route.params.id}`, {
          //data yang dikirim
          PROC_NAME: this.field.PROC_NAME,
          DISPLAY_NAME: this.field.DISPLAY_NAME,
          TASKBOX_FILE: this.field.TASKBOX_FILE,
          SUBMIT_BEFORE: this.field.SUBMIT_BEFORE,
          SUBMIT_AFTER: this.field.SUBMIT_AFTER,
          P_APPLICATION_ID: this.field.P_APPLICATION_ID,
          IS_ACTIVE: this.field.IS_ACTIVE,
          DESCRIPTION: this.field.DESCRIPTION,
          CREATE_DATE: this.field.CREATE_DATE,
          UPDATE_DATE: this.field.UPDATE_DATE,
          CREATE_BY: this.field.CREATE_BY,
          UPDATE_BY: this.field.UPDATE_BY,
        })
        .then(() => {
          this.show = 1

          //sweet alert
          this.$swal.fire({
            title: 'BERHASIL!',
            text: 'Data Berhasil Diupdate!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          })
          //redirect ke route "post"
          this.$router.push({
            name: 'erp_ho-workflow-process',
          })
        })
        .catch((error) => {
          this.show = 1

          //assign error validasi
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
