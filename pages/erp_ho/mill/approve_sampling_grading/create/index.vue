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
              <i class="nav-icon fas fa-address-card"></i> <b>TAMBAH GRADING</b>
            </h3>
            <div class="card-tools"></div>
          </div>
          <div class="card-body">
            <form @submit.prevent="storePost">
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
                        <b-col>
                            <label>Pembuat</label>
                            <input
                                type="text"
                                v-model="field.created_by"
                                class="form-control"
                                readonly
                            />
                        </b-col>
                    </b-row>
                </div>

                <!-- <div class="form-group">
                    <b-row>
                        <b-col>
                            <label>Tanggal Ubah </label>
                            <b-form-datepicker
                                v-model="field.updated_at"
                                :date-format-options="{
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                weekday: 'short',
                                }"
                                :disabled="disabled"
                            ></b-form-datepicker>
                        </b-col>
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
                </div> -->
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
  /* import { VNumber  } from '@coders-tm/vue-number-format' */
  /* import { number } from '@coders-tm/vue-number-format' */
  
  export default {
    //layout
    layout: 'admin',
  
    //meta
    head() {
      return {
        title: 'Tambah Employee',
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
  
      this.$refs.npb.focus()

      this.show = 0
  
      console.log('cek data')
      console.log(this.field.created_at)
      console.log(this.field.updated_at)
  
        this.$axios
            .get('/api/admin/spot-cek-list-estate')
            .then((response) => {
                this.estate = response.data.data
                this.show = 1
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
        })
      },
  
      currentDate() {
        const current = new Date()
        const date = `${current.getFullYear()}-${
          current.getMonth() + 1
        }-${current.getDate()}`
  
        return date
      },
  
      async storePost(e) {
        e.preventDefault();
        this.show = 0;

        try {
            let formData = new FormData();
            formData.append('afdeling_code', this.field.afdeling_id.afdeling_code);
            formData.append('department_code', this.field.department_id.department_code_plantation);

            const response = await this.$axios.post('/api/agro-dashboard/afdeling', formData);

            await this.$axios.post(`/api/agro-dashboard/uploadsamplingffb`, {
            npb: this.field.npb,
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
            transaction_date: this.field.created_at,
            department_id: this.$auth.user.employee.department_id,
            created_by: this.field.created_by,
            created_at: this.field.created_at,
            updated_by: this.field.created_by,
            updated_at: this.field.created_at,
            });

            this.show = 1;

            this.$swal.fire({
            title: 'BERHASIL!',
            text: 'Data Berhasil Diinput!',
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
            this.show = 1;

            if (error.response && error.response.data) {
            this.validation = error.response.data;
            this.$swal.fire({
              title: 'ERROR!',
              text: error.response.data.statusText,
              icon: 'error',
              showConfirmButton: false,
              timer: 3500,
            })

            } else {
              console.error('Unexpected error:', error);
              this.$swal.fire({
                title: 'ERROR!',
                text: error,
                icon: 'error',
                showConfirmButton: false,
                timer: 3500,
              })

            }
        }
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
  