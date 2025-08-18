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
            <i class="nav-icon fas fa-cog"></i> <b>Tambah Map Department People Hub</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">

            <div class="form-group">
              <label>SBU</label>
              <input
                type="text"
                v-model="field.sbu"
                placeholder="Masukkan SBU"
                class="form-control"
                ref="code"
              />
              <div v-if="validation.sbu" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.sbu[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Kode Organization</label>
              <input
                type="text"
                v-model="field.organization_code_peoplehub"
                placeholder="Masukkan kode organization People Hub"
                class="form-control"
                ref="code"
              />
              <div v-if="validation.organization_code_peoplehub" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.organization_code_peoplehub[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Nama Organization</label>
              <input
                type="text"
                v-model="field.organization_name_peoplehub"
                placeholder="Masukan Nama Organization PeopleHub"
                class="form-control"
              />
              <div v-if="validation.organization_name_peoplehub" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.organization_name_peoplehub[0]
                }}</b-alert>
              </div>
            </div>


            <div class="form-group">
              <label>Kode Department</label>
              <input
                type="text"
                v-model="field.department_code"
                placeholder="Masukan Nama Kode Department"
                class="form-control"
              />
              <div v-if="validation.department_code" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.department_code[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Aktif?</label>
              <b-form-select v-model="field.is_active">
                <b-form-select-option value="Y">Ya</b-form-select-option>
                <b-form-select-option value="N">Tidak</b-form-select-option>
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
              v-on:click="$router.push({ name: 'erp_ho-peoplehub-map_department' })"
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
      title: 'Tambah Map Lokasi People Hub',
    }
  },

  data() {
    return {
      is_active: { value: 'Y', text: 'Ya' },
      options: [
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],

      state: 'disabled',

      field: {
        sbu: '',
        organization_code_peoplehub: '',
        organization_name_peoplehub: '',
        department_code: '',
        is_active: 'Y',
        description:'',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
      },

      //state validation
      validation: [],
      show: 1,
    }
  },

  mounted() {
    this.field.created_at = this.currentDate()
    this.field.updated_at = this.currentDate()
    this.field.created_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    this.field.updated_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name

    this.$refs.code.focus()
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-peoplehub-map_location_peoplehub',
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
      this.show = 0

      //define formData
      let formData = new FormData()
      formData.append('sbu', this.field.sbu)
      formData.append('organization_code_peoplehub', this.field.organization_code_peoplehub)
      formData.append('organization_name_peoplehub', this.field.organization_name_peoplehub)
      formData.append('department_code', this.field.department_code)
      formData.append('is_active', this.field.is_active)
      formData.append('description', this.field.description)
      formData.append('created_at', this.field.created_at)
      formData.append('created_by', this.field.created_by)
      formData.append('updated_at', this.field.updated_at)
      formData.append('udpated_by', this.field.updated_by)

      //sending data to server
      await this.$axios
        .post('/api/admin/map_department', formData)
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
          this.$router.push({
            name: 'erp_ho-peoplehub-map_department',
          })
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
