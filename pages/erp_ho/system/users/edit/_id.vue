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
            <i class="nav-icon fas fa-user"></i> EDIT USER
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
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
              <label>Status User</label>
              <b-form-group>
                <b-form-radio v-model="field.user_status" :value="true">Aktif</b-form-radio>
                <b-form-radio v-model="field.user_status" :value="false">Tidak Aktif</b-form-radio>
              </b-form-group>
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
      title: 'Edit User',
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
        user_status: null,
      },

      employee: [],

      //state validation
      validation: [],
      show: 1,
    }
  },

  mounted() {
    //Data employee
    this.$axios
      .get('/api/admin/lov_employee')

      .then((response) => {
        this.employee = response.data.data
      })

    //get data field by ID
    this.$axios
      .get(`/api/admin/users/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.user_name = response.data.data.user_name
        this.field.name = response.data.data.name
        this.field.email = response.data.data.email
        this.field.employee_id = {
          id: response.data.data.employee.id,
          employee_description:
            response.data.data.employee.nik +
            '-' +
            response.data.data.employee.name,
        }
        console.log(response.data.data.employee.nik)
        this.field.password = response.data.data.password
        this.field.created_at = response.data.data.created_at
        this.field.updated_at = response.data.data.updated_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_by = response.data.data.updated_by
        this.field.user_status = response.data.data.user_status === 'A'
      })

    this.$refs.user_name.focus()
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-system-users',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()
      this.show = 0

      console.log('23423423423423423423')

      //send data ke Rest API untuk update
      await this.$axios
        .put(`/api/admin/users/${this.$route.params.id}`, {
          //data yang dikirim
          id: this.$route.params.id,
          user_name: this.field.user_name,
          name: this.field.name,
          email: this.field.email,
          employee_id: this.field.employee_id ? this.field.employee_id.id : '',
          password: this.field.password,
          created_at: this.field.created_at,
          updated_at: this.field.updated_at,
          created_by: this.field.created_by,
          updated_by: this.field.updated_by,
          user_status: this.field.user_status ? 'A' : 'I',
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
            name: 'erp_ho-system-users',
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
