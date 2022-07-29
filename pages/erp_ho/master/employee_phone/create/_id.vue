<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-phone-alt"></i> TAMBAH NO TELEPON
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">
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
              <!-- </div>-->
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
      title: 'Tambah No Telepon',
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

      //state post
      post: {
        image: '',
        title: '',
        category_id: '',
        content: '',
        description: '',
        tags: [],
      },

      field: {
        employee_id: '',
        phone_number: '',
        is_active: 'Y',
        is_default: 'N',
        description: '',
        create_at: '',
        update_at: '',
        created_by: '',
        updated_by: '',
      },

      employee_id: '',

      //state validation
      validation: [],

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

    // this.$refs.code.focus()

    //Data Employee
    this.$axios
      .get(`/api/admin/master/employee/${this.$route.params.id}`)

      .then((response) => {
        this.employee_id = response.data.data.id

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
      //define formData
      let formData = new FormData()

      formData.append('phone_number', this.field.phone_number)
      formData.append('is_default', this.field.is_default)
      formData.append('employee_id', this.$route.params.id)
      formData.append('is_active', this.field.is_active)
      formData.append('description', this.field.description)
      formData.append('created_at', this.field.created_at)
      formData.append('created_by', this.field.created_by)
      formData.append('update_at', this.field.update_at)
      formData.append('udpate_by', this.field.udpate_by)

      await this.$axios
        .post('/api/admin/employee_phone', formData)
        .then(() => {
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
</style>
