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
            <i class="nav-icon fas fa-user"></i> <b>TAMBAH USER</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">
            <div class="form-group">
              <label>User Name</label>
              <input
                type="text"
                v-model="field.user_name"
                placeholder="Masukkan User Name"
                class="form-control"
                ref="user_name"
              />
              <div v-if="validation.user_name" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.user_name[0]
                }}</b-alert>
              </div>
            </div>

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
              <label>Email</label>
              <input
                type="emial"
                v-model="field.email"
                placeholder="Masukkan Alamat Email "
                class="form-control"
              />
              <div v-if="validation.email" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.email[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Password</label>
              <input
                type="password"
                v-model="field.password"
                placeholder="Masukkan Password"
                class="form-control"
              />
              <div v-if="validation.password" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.password[0]
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
      title: 'Tambah User',
    }
  },

  data() {
    return {
      state: 'disabled',

      field: {
        user_name: '',
        name: '',
        email: '',
        password: '',
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        employee_id: '',
      },

      employee: [],
      show: 1,

      //state validation
      validation: [],
    }
  },

  mounted() {
    this.field.created_at = this.currentDate()
    this.field.updated_at = this.currentDate()
    this.field.created_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    this.field.updated_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name

    this.$refs.user_name.focus()

    //Data Employee
    this.$axios
      .get('/api/admin/lov_employee')

      .then((response) => {
        this.employee = response.data.data
      })
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-system-users',
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
      formData.append(
        'employee_id',
        this.field.employee_id ? this.field.employee_id.id : ''
      )
      formData.append('user_name', this.field.user_name)
      formData.append('name', this.field.name)
      formData.append('email', this.field.email)
      formData.append('password', this.field.password)
      formData.append('created_at', this.field.created_at)
      formData.append('updated_at', this.field.updated_at)
      formData.append('created_by', this.field.created_by)
      formData.append('updated_by', this.field.updated_by)
      //sending data to server
      await this.$axios
        .post('/api/admin/users', formData)
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
            name: 'erp_ho-system-users',
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
