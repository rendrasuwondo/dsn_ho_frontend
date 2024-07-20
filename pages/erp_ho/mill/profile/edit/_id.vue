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
            <i class="nav-icon fas fa-folder"></i> <b>EDIT DATA MILL PROFILE</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update"> 
          <div class="form-group">
            <label>Department</label>
            <multiselect
              v-model="field.department_id"
              :options="department"
              label="code"
              track-by="id"
              :searchable="true"
            ></multiselect>
            <div v-if="validation.department_id" class="mt-2">
              <b-alert show variant="danger">{{
                validation.department_id[0]
              }}</b-alert>
            </div>
          </div>
          <div class="form-group">
            <label>Mill PM</label>
            <input
              type="text"
              v-model="field.mill_pm"
              placeholder="Masukkan Nama Mill PM"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Mill Head</label>
            <input
              type="text"
              v-model="field.mill_head"
              placeholder="Masukkan Nama Mill Head"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Throughput</label>
            <input
              type="number"
              v-model="field.throughput"
              placeholder="Masukkan Throughput"
              class="form-control"
            />
            <div v-if="validation.throughput" class="mt-2">
              <b-alert show variant="danger">{{
                validation.throughput[0]
              }}</b-alert>
            </div>
          </div>

          <div class="form-group">
            <label>Man Power</label>
            <input
              type="number"
              v-model="field.man_power"
              placeholder="Masukkan Man Power"
              class="form-control"
            />
            <div v-if="validation.man_power" class="mt-2">
              <b-alert show variant="danger">{{
                validation.man_power[0]
              }}</b-alert>
            </div>
          </div>

          <div class="form-group">
            <label>Running Hour</label>
            <input
              type="number"
              v-model="field.running_hour"
              placeholder="Masukkan Running Hour"
              class="form-control"
            />
            <div v-if="validation.running_hour" class="mt-2">
              <b-alert show variant="danger">{{
                validation.running_hour[0]
              }}</b-alert>
            </div>
          </div>

          <div class="form-group">
            <label>Aktif?</label>
            <b-form-select v-model="field.is_active" :options="options">
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
      title: 'Edit Mill Profile',
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
        department_id: '',
        mill_pm:'',
        mill_head: '',
        throughput: '',
        man_power: '',
        running_hour: '',
        description: '',
        is_active: 'Y',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: ''
      },

      validation: [],
      
      department: [],
      show: 1
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/MillProfile/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil

         this.field.department_id = response.data.data.department_id
        this.field.department_code = response.data.data.department_code
        this.field.mill_pm = response.data.data.mill_pm
        this.field.mill_head = response.data.data.mill_head
        this.field.throughput = response.data.data.throughput
        this.field.man_power = response.data.data.man_power
        this.field.running_hour = response.data.data.running_hour
        this.field.is_active = response.data.data.is_active
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
      })


  this.$axios
  .get('/api/admin/t_department')

  .then((response) => {
    this.department = response.data.data
  })


    // this.$refs.code.focus()
  },
  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-mill-station',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()
      this.show = 0

      //send data ke Rest API untuk update
      await this.$axios.put(`/api/admin/MillProfile/${this.$route.params.id}`, {
          //data yang dikirim

          department_id : this.field.department_id ? this.field.department_id.id: '',
          mill_pm:  this.field.mill_pm,
          mill_head :  this.field.mill_head,
          throughput :this.field.throughput,
          man_power : this.field.man_power,
          running_hour : this.field.running_hour,
          is_active: this.field.is_active,
          description: this.field.description,
          created_at: this.field.created_at,
          updated_at: this.field.updated_at,
          created_by: this.field.created_by,
          updated_by: this.field.updated_by,
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
            name: 'erp_ho-mill-profile',
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
