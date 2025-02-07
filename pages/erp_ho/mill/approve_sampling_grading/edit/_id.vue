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
            <i class="nav-icon fas fa-address-card"></i> <b>EDIT GRADING</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>No NPB</label>
              <input
                type="text"
                v-model="field.npb"
                placeholder="Masukkan NPB"
                class="form-control"
                ref="npb"
              />
              <div v-if="validation.npb" class="mt-2">
                <b-alert show variant="danger">{{ validation.npb[0] }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Estate</label>

              <multiselect
                v-model="field.department_id"
                :options="estate"
                label="department_code_plantation"
                track-by="department_code_plantation"
                :searchable="true"
              ></multiselect>
            </div>

            <div class="form-group">
              <label>Afdeling</label>

              <multiselect
                v-model="field.afdeling_id"
                :options="afdeling"
                label="afdeling_code"
                track-by="afdeling_code"
                :searchable="true"
              ></multiselect>
            </div>

            <div class="form-group">
              <label>Jumlah Brondolan (KG)</label>
              <input
                type="text"
                v-model="field.loose_fruit"
                placeholder="Masukkan Jumlah Brondolan (KG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Jumlah Brondolan NPB (KG)</label>
              <input
                type="text"
                v-model="field.loose_fruit_npb"
                placeholder="Masukkan Jumlah Brondolan NPB (KG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Unripe (JJG)</label>
              <input
                type="text"
                v-model="field.qty_unripe"
                placeholder="Masukkan Unripe (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Underripe (JJG)</label>
              <input
                type="text"
                v-model="field.qty_underripe"
                placeholder="Masukkan Underripe (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Ripe (JJG)</label>
              <input
                type="text"
                v-model="field.qty_ripe"
                placeholder="Masukkan Ripe (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Overripe (JJG)</label>
              <input
                type="text"
                v-model="field.qty_overripe"
                placeholder="Masukkan Overripe (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Empty Bunch (JJG)</label>
              <input
                type="text"
                v-model="field.qty_empty_bunch"
                placeholder="Masukkan Empty Bunch (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Jumlah Janjang (JJG)</label>
              <input
                type="text"
                v-model="field.total_qty"
                placeholder="Masukkan Jumlah Janjang (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Jumlah Janjang NPB (JJG)</label>
              <input
                type="text"
                v-model="field.qty_npb"
                placeholder="Masukkan Jumlah Janjang NPB (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Jumlah Tangkai Panjang (JJG)</label>
              <input
                type="text"
                v-model="field.qty_long_stalk"
                placeholder="Masukkan Tangkai Panjang (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Jumlah Sampah Kotoran (KG)</label>
              <input
                type="text"
                v-model="field.qty_garbage"
                placeholder="Masukkan Sampah Kotoran (KG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Jumlah TBS Sakit (JJG)</label>
              <input
                type="text"
                v-model="field.qty_abnormal"
                placeholder="Masukkan TBS Sakit (JJG)"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Tonase Timbang</label>
              <input
                type="text"
                v-model="field.tonase"
                placeholder="Masukkan Tonase Timbang"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Driver</label>
              <input
                type="text"
                v-model="field.driver"
                placeholder="Masukkan Driver"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Bayar Utang Berondol</label>
              <input
                type="text"
                v-model="field.loose_fruit_debt"
                placeholder="Masukkan Jumlah Bayar Utang Berondol"
                class="form-control"
              />
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
      title: 'Edit Grading',
    }
  },

  data() {
    return {
      options: [
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],
      options_status: [
        { value: null, text: '' },
        { value: 'SKU', text: 'SKU' },
        { value: 'BHL', text: 'BHL' },
      ],

      state: 'disabled',

      field: {

        npb: '',
        afdeling_id: {
          afdeling_code: ''
        },
        department_id: {
          department_code_plantation: ''
        },
        loose_fruit: '',
        loose_fruit_npb: '',
        qty_unripe: '',
        qty_underripe: '',
        qty_overripe: '',
        qty_ripe: '',
        qty_empty_bunch: '',
        qty_npb: '',
        qty_long_stalk: '',
        qty_garbage: '',
        qty_abnormal: '',
        driver: '',
        is_active: '',
        employee_status: '',
        description: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
        activity_group_id: '',
        employee_id: '',
        q_afdeling_id: '',
        total_qty: '',
        loose_fruit_debt: '',
        tonase: '',
      },

      company: [],

      department: [],

      location: [],

      position: [],

      afdeling: [],

      estate: [],

      //state validation
      validation: [],

      activity_group: [],
      show: 1,
    }
  },

  mounted() {
    //get data field by ID
    this.show = 0
    this.$axios
      .get(`/api/admin/spot-cek/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.npb = response.data.data.npb
        this.field.location_id = response.data.data.location
        this.field.afdeling_id.afdeling_code = response.data.data.afdeling_code
        this.field.department_id.department_code_plantation = response.data.data.department_code_plantation
        this.field.loose_fruit = response.data.data.loose_fruit
        this.field.loose_fruit_npb = response.data.data.loose_fruit_npb
        this.field.qty_unripe = response.data.data.qty_unripe
        this.field.qty_underripe = response.data.data.qty_underripe
        this.field.qty_ripe = response.data.data.qty_ripe
        this.field.qty_overripe = response.data.data.qty_overripe
        this.field.qty_empty_bunch = response.data.data.qty_empty_bunch
        this.field.qty_npb = response.data.data.qty_npb
        this.field.qty_long_stalk = response.data.data.qty_long_stalk
        this.field.qty_garbage = response.data.data.qty_garbage
        this.field.qty_abnormal = response.data.data.qty_abnormal
        this.field.driver = response.data.data.driver
        this.field.total_qty = response.data.data.total_qty
        this.field.loose_fruit_debt = response.data.data.loose_fruit_debt
        this.field.tonase = response.data.data.tonase



        this.field.company_id = response.data.data.company
        this.field.position_id = response.data.data.position
        this.field.activity_group_id = response.data.data.activity_group
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
        this.field.description = response.data.data.description
        this.field.nik = response.data.data.nik
        this.field.name = response.data.data.name
        this.field.email = response.data.data.email
        this.field.is_active = response.data.data.is_active
        this.field.employee_status = response.data.data.employee_status
        this.show = 1

      })

    ///Data Estate
    this.$axios
      .get('/api/admin/spot-cek-list-estate')

      .then((response) => {
        this.estate = response.data.data
        // this.field.department_id =
        //   response.data.data.department_code_plantation
      })

    //Data Afdeling
    this.$axios
      .get('/api/admin/spot-cek-list-afdeling')

      .then((response) => {
        this.afdeling = response.data.data
      })
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-mill-approve_sampling_grading',
        params: { id: this.$route.params.id, r: 1 },
        query: {
          q: this.$route.query.q,
        },
      })
    },

    async update(e) {
      e.preventDefault();
      this.show = 0;

      try {
        let formData = new FormData();
        formData.append('afdeling_code', this.field.afdeling_id.afdeling_code);
        formData.append('department_code', this.field.department_id.department_code_plantation);

        const response = await this.$axios.post('/api/agro-dashboard/afdeling', formData);

        await this.$axios.put(`/api/admin/spot-cek/${this.$route.params.id}`, {
          afdeling_id: response.data.data.id,
          loose_fruit: this.field.loose_fruit,
          loose_fruit_npb: this.field.loose_fruit_npb,
          qty_unripe: this.field.qty_unripe,
          qty_underripe: this.field.qty_underripe,
          qty_ripe: this.field.qty_ripe,
          qty_overripe: this.field.qty_overripe,
          qty_empty_bunch: this.field.qty_empty_bunch,
          qty_npb: this.field.qty_npb,
          qty_long_stalk: this.field.qty_long_stalk,
          qty_garbage: this.field.qty_garbage,
          qty_abnormal: this.field.qty_abnormal,
          driver: this.field.driver,
          total_qty: this.field.total_qty,
          loose_fruit_debt: this.field.loose_fruit_debt,
          tonase: this.field.tonase,
          npb: this.field.npb,
        });

        this.show = 1;

        this.$swal.fire({
          title: 'BERHASIL!',
          text: 'Data Berhasil Diupdate!',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });

        this.$router.push({
          name: 'erp_ho-mill-approve_sampling_grading',
          query: {
            q: this.$route.query.q,
          },
        });
      } catch (error) {
        // 5. Handle errors
        this.show = 1;

        // Assign validation error if any
        if (error.response && error.response.data) {
          this.validation = error.response.data;
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }
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
