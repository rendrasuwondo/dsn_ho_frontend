<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-project-diagram"></i>
            <b>TAMBAH MAPPING LABORATORY</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">
            <div class="form-group">
              <label>Nama Vendor</label>
              <multiselect
                v-model="field.vendors_id"
                :options="vendors"
                label="code"
                track-by="id"
                :searchable="true"
              ></multiselect>
              <div v-if="validation.vendors_id" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.vendors_id[0]
                }}</b-alert>
              </div>
            </div>
            <div class="form-group">
              <label>Nama Laboratory</label>
              <multiselect
                v-model="field.laboratory_id"
                :options="laboratory"
                label="code"
                track-by="id"
                :searchable="true"
              ></multiselect>
              <div v-if="validation.laboratory_id" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.laboratory_id[0]
                }}</b-alert>
              </div>
            </div>
            <div class="form-group">
              <label>Aktif?</label>
              <b-form-select v-model="field.is_active" :options="options">
              </b-form-select>
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
      title: 'Tambah Mapping Laboratory',
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

      state: 'disabled',
      value: undefined,

      field: {
        vendors_id: '',
        laboratory_id: '',
        is_active: 'Y',
        description: '',
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
      },

      laboratory: [],

      vendors: [],

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
    // this.$refs.user_name.focus()

    //Data vendors
    this.$axios
      .get('/api/admin/lov_vendors')

      .then((response) => {
        this.vendors = response.data.data
      })

    //data laboratory
    this.$axios
      .get('/api/admin/lov_laboratory')

      .then((response) => {
        this.laboratory = response.data.data
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
        name: 'erp_ho-fertilizer-fertilizer_vendor_laboratory',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    async storePost() {
      //define formData
      let formData = new FormData()

      formData.append(
        'vendors_id',
        this.field.vendors_id ? this.field.vendors_id.id : ''
      )
      formData.append(
        'laboratory_id',
        this.field.laboratory_id ? this.field.laboratory_id.id : ''
      )
      formData.append('is_active', this.field.is_active)
      formData.append('description', this.field.description)
      formData.append('created_at', this.field.created_at)
      formData.append('created_by', this.field.created_by)
      formData.append('update_at', this.field.update_at)
      formData.append('udpate_by', this.field.udpate_by)

      await this.$axios
        .post('/api/admin/fertilizer_vendor_laboratory', formData)
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
          // alert(error)
          // console.log(error.response.data.message)

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
</style>
