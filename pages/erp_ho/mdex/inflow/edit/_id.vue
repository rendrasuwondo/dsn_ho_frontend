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
            <i class="nav-icon fas fa-industry"></i> EDIT INFLOW
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>Id</label>
              <input
                type="text"
                v-model="field.id"
                placeholder=""
                class="form-control"
                ref="id"
                readonly
              />
              <div v-if="validation.id" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.id[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Product</label>
              <multiselect
                v-model="field.product_id"
                :options="product"
                label="code"
                track-by="id"
                :searchable="true"
              ></multiselect>
              <div v-if="validation.product_id" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.product_id[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Inflow Date</label>
              <b-form-datepicker
                v-model="field.inflow_date"
                :date-format-options="{
                    year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }">
                  </b-form-datepicker>
            </div>
            
            <div class="form-group">
              <label>Account Status</label>
              <b-form-select v-model="field.account_status">
                <b-form-select-option value="ACTUAL">ACTUAL</b-form-select-option>
                <b-form-select-option value="PLAN">PLAN</b-form-select-option>
              </b-form-select>
              <div v-if="validation.account_status" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.account_status[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Inflow </label>
              <input
                type="text"
                v-model="field.inflow"
                placeholder="Masukkan Inflow"
                class="form-control"
                ref="inflow"
              />
              <div v-if="validation.inflow" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.inflow[0]
                }}</b-alert>
              </div>
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
      title: 'Edit PIC',
    }
  },

  data() {
    return {
      options: [
        { value: 'ACTUAL', text: 'ACTUAL' },
        { value: 'PLAN', text: 'PLAN' },
      ],
      state: 'disabled',
      field: {
        id:             '',
        product_id:     '',
        inflow_date:    '',
        account_status: '',
        inflow:         '',
        description:    '',
        created_at:     '',
        updated_at:     '',
        created_by:     '',
        updated_by:     '',
      },

      product: [],
      //state validation
      validation: [],
      show: 1,
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/inflow/${this.$route.params.id}`)
      .then((response) => {
        this.field.id = response.data.data.id
        this.field.product_id = response.data.data.product.code
        this.field.inflow_date = response.data.data.inflow_date
        this.field.account_status = response.data.data.account_status
        this.field.inflow = response.data.data.inflow
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
      })
    this.$refs.id.focus()
    //Data Product
    this.$axios
      .get('/api/admin/lov_product')

      .then((response) => {
        // console.log(response.data.data[0])
        this.product = response.data.data
      })
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-mdex-inflow',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()
      this.show = 0

      //send data ke Rest API untuk update
      await this.$axios
        .put(`/api/admin/inflow/${this.$route.params.id}`, {
          id: this.field.id,
          product_id: this.field.product_id.id,
          inflow_date: this.field.inflow_date,
          account_status: this.field.account_status,
          inflow: this.field.inflow,
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
            name: 'erp_ho-mdex-inflow',
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
