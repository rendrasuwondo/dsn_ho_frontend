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
            <i class="nav-icon fas fa-phone-alt"></i> EDIT NO TELEPON
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateData">
            <div class="form-group">
              <label>No. Telepon</label>

              <input
                type="text"
                class="form-control"
                placeholder="Masukkan No Telepon Karyawan"
                v-model="field.phone_number"
                v-on:keypress="isNumber($event)"
                maxlength="13"
              />
              <div v-if="validation.phone_number" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.phone_number[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Aktif?</label>
              <b-form-select v-model="field.is_active" :options="options">
              </b-form-select>
            </div>

            <div class="form-group">
              <label>Default?</label>
              <b-form-select
                v-model="field.is_default"
                :options="options_default"
              >
              </b-form-select>
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
      title: 'Edit Nomor Telepon',
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
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],

      options_default: [
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],

      state: 'disabled',
      value: undefined,

      field: {
        phone_number: '',
        employee_id: '',
        is_active: '',
        is_default: '',
        description: '',
        create_at: '',
        update_at: '',
        created_by: '',
        updated_by: '',
      },

      id_employee: '',

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
    // this.$refs.code.focus()

    //data employee
    this.$axios
      .get(`/api/admin/master/employee/${this.$route.params.id}`)

      .then((response) => {
        //  console.log(response.data.data.afdeling_id)
        this.id_employee = response.data.data.id

        this.$nuxt.$loading.start()
      })

    this.$axios
      .get(`/api/admin/employee_phone/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.employee_id = response.data.data.employee_id
        this.field.phone_number = response.data.data.phone_number
        this.field.is_active = response.data.data.is_active
        this.field.is_default = response.data.data.is_default
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by

        this.$nuxt.$loading.start()
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
        name: 'erp_ho-master-employee_phone-id',
        params: { id: this.field.employee_id, r: 1 },
        query: { employee_id: this.field.employee_id },
      })
    },

    isNumber(e) {
      let char = String.fromCharCode(e.keyCode)
      if (/^[0-9]+$/.test(char)) return true
      else e.preventDefault()
    },

    // update method
    async updateData(e) {
      e.preventDefault()
      this.show = 0

      //send data ke Rest API untuk update
      await this.$axios
        .put(`api/admin/employee_phone/${this.$route.params.id}`, {
          //data yang dikirim
          employee_id: this.field.employee_id,
          phone_number: this.field.phone_number,
          is_active: this.field.is_active,
          is_default: this.field.is_default,
          description: this.field.description,
          created_by: this.field.created_by,
          created_at: this.field.created_at,
          updated_by: this.field.updated_by,
          updated_at: this.field.updated_at,
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
          //redirect ke route "location"
          this.back()
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
