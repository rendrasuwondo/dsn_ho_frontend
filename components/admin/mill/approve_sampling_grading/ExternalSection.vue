<template>
  <div class="">
    <div v-if="show === 0">
      <b-img right src="\img/dsn_logo.png" alt="" class="img-logo"></b-img>
      <p class="txt-2">Loading</p>
      <div class="spinonediv-4 mt-5"></div>
    </div>

    <section class="content" v-if="show === 1">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-cog"></i>
            <b>Data Approve Sampling Grading External</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <b-card
            border-variant="primary"
            header="Filter"
            header-bg-variant="info"
            header-text-variant="white"
          >
            <b-card-text>
              <b-row>
                <!-- Left Section -->
                <b-col cols="6">
                  <b-row class="mt-2">
                    <b-col cols="3">Tanggal</b-col>
                    <b-col cols="9">
                      <b-form-datepicker
                        v-model="dateStart"
                        placeholder="Pilih tanggal awal"
                        class="mb-2"
                        :date-format-options="{
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          weekday: 'short',
                        }"
                      ></b-form-datepicker>
                      <b-form-datepicker
                        v-model="dateEnd"
                        placeholder="Pilih tanggal akhir"
                        :date-format-options="{
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          weekday: 'short',
                        }"
                      ></b-form-datepicker>
                    </b-col>
                  </b-row>
                </b-col>

                <!-- Right Section -->
                <b-col cols="6">
                  <b-row class="mt-2">
                    <b-col cols="3">Supplier</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="pt_id"
                        :options="pts"
                        label="supplier"
                        track-by="lifnr"
                        :searchable="true"
                        :multiple="true"
                        placeholder="Pilih Supplier"
                        :loading="isLoadingDropdown"
                      ></multiselect>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <!-- Apply Filters Button -->
              <b-row class="mt-3">
                <b-col class="text-center">
                  <b-button
                    class="btn btn-info"
                    variant="primary"
                    @click="applyFilters"
                  >
                    Apply Filters
                  </b-button>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>

          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <nuxt-link
                  to="/erp_ho/mill/approve_sampling_grading/create/external"
                  class="btn btn-info btn-sm"
                  style="padding-top: 8px"
                  title="Tambah"
                  ><i class="fa fa-plus-circle"></i>
                </nuxt-link>
                <button
                  title="Export To Excel"
                  class="btn btn-info"
                  @click="exportData"
                >
                  <i class="fa fa-file-excel"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- table -->
          <b-table
            :fields="filteredFields"
            :items="posts"
            small
            responsive
            striped
            bordered
            hover
            :tbody-tr-class="rowClass"
          >
            <!-- Custom grouped header -->
            <template v-slot:thead-top>
              <tr>
                <!-- <th rowspan="2">No</th> -->
                <th rowspan="2">
                  <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    v-model="selectAll"
                  />
                </th>
                <th rowspan="2">Actions</th>
                <th rowspan="2">Status</th>
                <th rowspan="2">Tanggal</th>
                <th rowspan="2">Supplier</th>
                <th rowspan="2">Driver</th>
                <th colspan="4" class="text-center">Total Janjang</th>
                <th rowspan="2">BJR</th>
                <th colspan="10" class="text-center">Kriteria TBS Normal</th>
                <th v-if="showSickFruit" colspan="6" class="text-center">
                  Kriteria TBS Abnormal
                </th>
                <th v-if="showSickFruit" rowspan="2">Tangkai Panjang</th>
                <th colspan="5" class="text-center">Berondolan</th>
                <th rowspan="2">No. NPB</th>
              </tr>
              <tr>
                <th>SPB</th>
                <th>Aktual</th>
                <th>Var(Jjg)</th>
                <th>Var(%)</th>

                <th>Unripe</th>
                <th>%</th>
                <th>Under</th>
                <th>%</th>
                <th>Ripe</th>
                <th>%</th>
                <th>Over</th>
                <th>%</th>
                <th>Jangkos</th>
                <th>%</th>

                <th v-if="showSickFruit">Ptherno</th>
                <th v-if="showSickFruit">%</th>
                <th v-if="showSickFruit">Hard B.</th>
                <th v-if="showSickFruit">%</th>
                <th v-if="showSickFruit">Unripe Brd</th>
                <th v-if="showSickFruit">%</th>

                <th>SPB</th>
                <th>Aktual</th>
                <th>Aktual(%)</th>
                <th>Var(Kg)</th>
                <th>Var(%)</th>
              </tr>
            </template>

            <template #cell(check)="row">
              <input
                type="checkbox"
                v-model="row.item.selected"
                :check="row.item.status === 'approved'"
                :disabled="row.item.status === 'cancel'"
                @change="handleSelectionChange"
              />
            </template>

            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-mill-approve_sampling_grading-edit-external-id',
                  params: { id: row.item.id },
                }"
                variant="link"
                size="sm"
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>
              <b-button
                variant="link"
                size="sm"
                @click="deletePost(row.item.id)"
                title="Hapus"
                ><i class="fa fa-trash"></i
              ></b-button>
            </template>

            <template #cell(qty_unripe)="row">
              <span v-if="row.item.qty_unripe > 0">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_unripe}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ parseFloat(row.item.qty_unripe).toFixed(0) }}
                </a>
              </span>
              <span v-else>
                {{ parseFloat(row.item.qty_unripe).toFixed(0) }}
              </span>
            </template>

            <template #cell(qty_underripe)="row">
              <span v-if="row.item.qty_underripe > 0">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_underripe}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ parseFloat(row.item.qty_underripe).toFixed(0) }}
                </a>
              </span>
              <span v-else>
                {{ parseFloat(row.item.qty_underripe).toFixed(0) }}
              </span>
            </template>

            <template #cell(qty_overripe)="row">
              <span v-if="row.item.qty_overripe > 0">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_overripe}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ parseFloat(row.item.qty_overripe).toFixed(0) }}
                </a>
              </span>
              <span v-else>
                {{ parseFloat(row.item.qty_overripe).toFixed(0) }}
              </span>
            </template>

            <template #cell(qty_empty_bunch)="row">
              <span v-if="row.item.qty_empty_bunch > 0">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_empty_bunch}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ parseFloat(row.item.qty_empty_bunch).toFixed(0) }}
                </a>
              </span>
              <span v-else>
                {{ parseFloat(row.item.qty_empty_bunch).toFixed(0) }}
              </span>
            </template>

            <template #cell(qty_tangkai_panjang)="row">
              <span v-if="row.item.qty_tangkai_panjang > 0">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_tangkai_panjang}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ parseFloat(row.item.qty_tangkai_panjang).toFixed(0) }}
                </a>
              </span>
              <span v-else>
                {{ parseFloat(row.item.qty_tangkai_panjang).toFixed(0) }}
              </span>
            </template>

            <template #cell(qty_sampah_kotoran)="row">
              <span v-if="row.item.qty_sampah_kotoran > 0">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_sampah_kotoran}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ parseFloat(row.item.qty_sampah_kotoran).toFixed(0) }}
                </a>
              </span>
              <span v-else>
                {{ parseFloat(row.item.qty_sampah_kotoran).toFixed(0) }}
              </span>
            </template>

            <template #cell(qty_tbs_sakit)="row">
              <span v-if="row.item.qty_tbs_sakit > 0">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_tbs_sakit}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ parseFloat(row.item.qty_tbs_sakit).toFixed(0) }}
                </a>
              </span>
              <span v-else>
                {{ parseFloat(row.item.qty_tbs_sakit).toFixed(0) }}
              </span>
            </template>

            <template #cell(driver)="row">
              <span v-if="row.item.img_driver != null">
                <a
                  :href="`${$axios.defaults.baseURL}${row.item.img_driver}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary"
                >
                  {{ row.item.driver }}
                </a>
              </span>
              <span v-else>
                {{ row.item.driver }}
              </span>
            </template>

            <template #cell(var_qty)="row">
              <span
                :style="
                  row.item.var_qty < -5 || row.item.var_qty > 5
                    ? 'color: green'
                    : 'color: blue'
                "
              >
                {{ formatToZeroDecimals(row.item.var_qty) }}
              </span>
            </template>

            <template v-slot:cell(loose_fruit_debt)="row">
              <input
                type="text"
                v-model="row.item.loose_fruit_debt"
                class="form-control input-fruit-debt"
                @keyup.enter="updateLooseFruitDebt(row.item)"
              />
            </template>

            <template v-slot:cell(percentage_fruit_after)="row">
              <span>{{
                formatToTwoDecimals(row.item.percentage_fruit_after)
              }}</span>
            </template>
          </b-table>
          <button
            :disabled="
              selectedItems.length === 0 && unselectedItems.length === 0
            "
            @click="approveSelected"
            class="btn btn-primary"
          >
            Approve
          </button>
          <!-- pagination -->
          <b-row>
            <b-col
              ><b-pagination
                v-model="pagination.current_page"
                :total-rows="pagination.total"
                :per-page="pagination.per_page"
                @change="changePage"
                align="left"
                class="mt-1"
              ></b-pagination
            ></b-col>
            <b-col class="text-right" align-self="center"
              >{{ rowcount }} data</b-col
            >
          </b-row>
          <b-col class="text-left" align-self="center"
            >NB : Jika Baris berwarna kuning, Silahkan dicek kembali no NPB,
            atau data WB belum ketarik ke iPlant
          </b-col>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`

    return {
      selectedItems: [],
      unselectedItems: [],
      fields: [
        // { key: 'no', label: '' }, // No label as custom header is used
        { key: 'check', label: '', sortable: false },
        {
          label: 'Actions',
          key: 'actions',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        { key: 'status', label: '' },
        { key: 'transaction_date', label: '', formatter: this.formatDate },
        { key: 'supplier', label: '' },
        { key: 'driver', label: '' },

        { key: 'qty_npb', label: '', formatter: this.formatToZeroDecimals },
        { key: 'total_qty', label: '', formatter: this.formatToZeroDecimals },
        { key: 'var_qty', label: '', formatter: this.formatToZeroDecimals },
        { key: 'percentage_qty', label: '', formatter: this.formatToThousand },

        { key: 'bjr', label: '', formatter: this.formatToTwoDecimals },

        { key: 'qty_unripe', label: '', formatter: this.formatToZeroDecimals },
        {
          key: 'percentage_unripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_underripe',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_underripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        { key: 'qty_ripe', label: '', formatter: this.formatToZeroDecimals },
        {
          key: 'percentage_ripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_overripe',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_overripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_empty_bunch',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_empty_bunch',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        {
          key: 'qty_parthenocarpy',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_parthenocarpy',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_hard_bunch',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_hard_bunch',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_unripe_fruit_fall',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_unripe_fruit_fall',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        {
          key: 'qty_long_stalk',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        { key: 'loose_fruit_npb', label: '', formatter: this.formatToThousand },
        { key: 'loose_fruit', label: '', formatter: this.formatToThousand },
        {
          key: 'percentage_fruit',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'var_loose_fruit',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'var_loose_fruit_percentage',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        // {
        //   key: 'loose_fruit_debt_expectation',
        //   label: '',
        //   formatter: this.formatToZeroDecimals,
        // },

        // {
        //   key: 'loose_fruit_debt',
        //   label: '',
        //   formatter: this.formatToZeroDecimals,
        // },
        // {
        //   key: 'percentage_fruit_after',
        //   label: '',
        //   formatter: this.formatToTwoDecimals,
        // },

        // { key: 'qty_abnormal', label: '' },
        // { key: 'percentage_abnormal', label: '', formatter: this.formatToTwoDecimals  },

        { key: 'npb', label: '' },
      ],
      dateStart: formatDate(yesterday), // Default to yesterday
      dateEnd: formatDate(yesterday), // Default to today
      showSickFruit: false,
      pt_id: [],
      pts: [],
      estate_id: [],
      estates: [],
      afdeling_id: [],
      afdelings: [],
      posts: [], // Data for the table
      pagination: {}, // Pagination data
      rowcount: 0,
      selectAll: false,
      sweet_alert: {
        title: '',
        icon: '',
      },
      show: 1,
      isLoadingDropdown: true, // Loading state for dropdowns
    }
  },
  watchQuery: ['q', 'page'],

  watch: {
    posts() {
      this.$nextTick(() => {
        this.addRowTooltips()
      })
    },
  },

  // watch: {
  //   posts: {
  //     handler(newPosts) {
  //       this.posts = newPosts.map(item => ({
  //         ...item,
  //         selected: item.status === 'approved', // Always check if status is approved
  //       }));
  //     },
  //     immediate: true, // Ensure this runs when the component is mounted
  //   },
  // },
  computed: {
    filteredFields() {
      return this.showSickFruit
        ? this.fields
        : this.fields.filter(
            (field) =>
              field.key !== 'qty_parthenocarpy' &&
              field.key !== 'percentage_parthenocarpy' &&
              field.key !== 'qty_hard_bunch' &&
              field.key !== 'percentage_hard_bunch' &&
              field.key !== 'qty_unripe_fruit_fall' &&
              field.key !== 'percentage_unripe_fruit_fall' &&
              field.key !== 'qty_long_stalk'
          )
    },
  },

  mounted() {
    this.loadData()
    this.$nextTick(() => {
      this.addRowTooltips()
    })
  },

  methods: {
    async loadData() {
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)

      const formatDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(date.getDate()).padStart(2, '0')}`

      const query = this.$route.query

      const dateStart = query.dateStart || formatDate(yesterday)
      const dateEnd = query.dateEnd || formatDate(yesterday)

      const params = {
        ...(query.page && { page: query.page }),
        ...(dateStart && { dateStart }),
        ...(dateEnd && { dateEnd }),
        ...(query.lifnr && {
          lifnr: query.lifnr,
        }),
        ...(query.department_code_plantation && {
          department_code_plantation: query.department_code_plantation,
        }),
        ...(query.afdeling_code && { afdeling_code: query.afdeling_code }),
        ffb_source: 'external',
      }

      try {
        const response = await this.$axios.$get('/api/admin/spot-cek', {
          params,
        })

        const postsFilter = response.data.data.map((item) => ({
          ...item,
          selected: item.status === 'approved',
        }))

        this.posts = postsFilter
        this.pagination = response.data
        this.rowcount = response.data.total

        const list_pt = await this.$axios.$get(
          `/api/admin/spot-cek-list-supplier`
        )

        this.pts = list_pt.data

        this.dateStart = dateStart
        this.dateEnd = dateEnd

        this.pt_id = query.lifnr
          ? this.pts.filter((item) =>
              query.lifnr.split(',').includes(item.lifnr.toString())
            )
          : []

        this.showSickFruit = query.showSickFruit === 'true'

        this.isLoadingDropdown = false
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    },
    addRowTooltips() {
      this.$nextTick(() => {
        const rows = document.querySelectorAll('.bg-yellow-row')
        rows.forEach((td) => {
          td.setAttribute('title', 'Silahkan dicek kembali no NPB')
        })
      })
    },
    getTonaseTooltip(item) {
      if (!item.tonase || item.tonase === 0) {
        return 'Tonase belum diisi atau bernilai nol'
      }
      return `Tonase: ${this.formatToThousand(item.tonase)} Kg`
    },
    rowClass(item) {
      if (!item) return ''
      console.log('rowClass called', item.tonase)

      if (item.tonase == null || item.tonase == 0) {
        return 'bg-yellow-row'
      }
      return ''
    },
    updateLooseFruitDebt(item) {
      const newValue = parseFloat(item.loose_fruit_debt)
      const oldValue = parseFloat(
        item.old_loose_fruit_debt || item.loose_fruit_debt
      )

      if (isNaN(newValue)) {
        this.$swal.fire({
          title: 'Error!',
          text: 'Masukkan angka yang valid!',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        })
        return
      }

      // Calculate the difference
      const difference = newValue - oldValue

      // Update percentage_fruit_after based on the change
      item.percentage_fruit_after =
        ((parseFloat(item.loose_fruit) + parseFloat(item.loose_fruit_debt)) /
          parseFloat(item.tonase)) *
        100

      // Store the new value as old value for future updates
      item.old_loose_fruit_debt = newValue

      // Send update to backend
      this.$axios
        .post('/api/admin/spot-cek-update-bayar', {
          id: item.id,
          loose_fruit_debt: newValue,
          // percentage_fruit_after: item.percentage_fruit_after,
        })
        .then(() => {
          this.$swal.fire({
            title: 'Berhasil!',
            text: 'Data berhasil diperbarui.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          })
        })
        .catch((error) => {
          console.error('Error updating loose_fruit_debt:', error)
          this.$swal.fire({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat memperbarui data.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          })
        })
    },

    calculatePercentage(looseFruitDebt) {
      const baseValue = 1000 // Adjust this based on actual calculation logic
      return ((looseFruitDebt / baseValue) * 100).toFixed(2)
    },
    formatToThousand(value) {
      if (!value) return '0' // Return 0 for empty or null values
      return new Intl.NumberFormat('id-ID').format(value)
    },
    formatToTwoDecimals(value) {
      if (!value) return '0.00' // Return 0.00 for empty values
      return parseFloat(value).toFixed(2)
    },
    formatToZeroDecimals(value) {
      if (!value || value === null) return '0' // Return 0.00 for empty values
      return parseFloat(value).toFixed(0)
    },
    toggleSelectAll() {
      this.posts.forEach((post) => {
        post.selected = this.selectAll
      })
      this.handleSelectionChange()
    },

    handleSelectionChange() {
      this.selectedItems = this.posts.filter(
        (item) => item.selected && item.status !== 'approved'
      )
      this.unselectedItems = this.posts.filter(
        (item) => !item.selected && item.status == 'approved'
      )
    },

    approveSelected() {
      // Show confirmation alert
      this.$swal
        .fire({
          title: 'APAKAH ANDA YAKIN?',
          text: 'INGIN MENYETUJUI DATA YANG DIPILIH?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#27ae60',
          cancelButtonColor: '#d33',
          confirmButtonText: 'YA!',
          cancelButtonText: 'TIDAK',
        })
        .then((result) => {
          if (result.isConfirmed) {
            // Prepare data for the API
            const updatedItemsSelected = this.posts
              .filter((item) => item.selected && item.status !== 'approved') // Send only items with changed status
              .map((item) => item.id)

            const updatedItemsUnselected = this.posts
              .filter((item) => !item.selected && item.status === 'approved') // Send only items with changed status
              .map((item) => item.id)

            if (
              updatedItemsSelected.length === 0 &&
              updatedItemsUnselected.length === 0
            ) {
              this.$swal.fire({
                title: 'Tidak ada perubahan!',
                text: 'Semua data sudah diapprove.',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
              })
              return
            }

            const apiCalls = []

            if (updatedItemsSelected.length !== 0) {
              apiCalls.push(
                this.$axios.post('/api/admin/spot-cek-approve', {
                  ids: updatedItemsSelected,
                })
              )
            }

            if (updatedItemsUnselected.length !== 0) {
              apiCalls.push(
                this.$axios.post('/api/admin/spot-cek-unapprove', {
                  ids: updatedItemsUnselected,
                })
              )
            }

            Promise.all(apiCalls)
              .then(async (responses) => {
                const allSuccess = responses.every(
                  (response) => response.data.success
                )

                if (allSuccess) {
                  this.sweet_alert.title = 'BERHASIL!'
                  this.sweet_alert.icon = 'success'
                } else {
                  this.sweet_alert.title = 'SEBAGIAN BERHASIL!'
                  this.sweet_alert.icon = 'warning'
                }

                this.$swal.fire({
                  title: this.sweet_alert.title,
                  text: 'Proses selesai!',
                  icon: this.sweet_alert.icon,
                  showConfirmButton: false,
                  timer: 2000,
                })

                this.show = 0
                await this.loadData() // Reload data after approval
                this.show = 1
              })
              .catch((error) => {
                console.error('API Error:', error)

                this.$swal.fire({
                  title: 'GAGAL!',
                  text: 'Terjadi kesalahan saat memproses data.',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 2000,
                })
              })
          }
        })
    },

    formatDate(value) {
      if (!value) return ''
      const date = new Date(value)

      const day = String(date.getDate()).padStart(2, '0')
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      const month = monthNames[date.getMonth()]
      const year = date.getFullYear()

      return `${day}-${month}-${year}`
    },

    changePage(page) {
      const query = {
        page,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      }

      if (this.pt_id && this.pt_id.length > 0) {
        query.lifnr = this.pt_id.map((pt) => pt.lifnr).join(',')
      }
      if (this.estate_id && this.estate_id.length > 0) {
        query.department_code_plantation = this.estate_id
          .map((estate) => estate.department_code_plantation)
          .join(',')
      }
      if (this.afdeling_id && this.afdeling_id.length > 0) {
        query.afdeling_code = this.afdeling_id
          .map((afdeling) => afdeling.afdeling_code)
          .join(',')
      }

      this.$router.push({ path: this.$route.path, query })
    },

    //searchData
    searchData() {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.search,
        },
      })
    },

    async applyFilters() {
      this.show = 0
      try {
        const query = {}

        // Dynamically add non-empty filters to the query
        if (this.dateStart) query.dateStart = this.dateStart
        if (this.dateEnd) query.dateEnd = this.dateEnd
        if (this.pt_id && this.pt_id.length > 0) {
          query.lifnr = this.pt_id.map((pt) => pt.lifnr).join(',')
        }

        if (this.search) query.search = this.search

        query.page = this.pagination.current_page || 1

        // Update the URL query dynamically
        this.$router.push({ path: this.$route.path, query })

        query.ffb_source = 'external'

        // Fetch the filtered data
        const response = await this.$axios.$get('/api/admin/spot-cek', {
          params: query,
        })

        const postsFilter = response.data.data.map((item) => ({
          ...item,
          selected: item.status === 'approved', // Check the checkbox if status is approved
        }))

        // Update table and pagination data
        this.posts = postsFilter
        this.pagination = response.data
        this.rowcount = response.data.total
        this.show = 1
      } catch (error) {
        console.error('Error applying filters:', error)
        this.show = 1
      }
    },

    exportData() {
      try {
        this.show = 0
        const queryParams = new URLSearchParams()

        // Add filters dynamically if they exist
        if (this.dateStart) queryParams.append('dateStart', this.dateStart)
        if (this.dateEnd) queryParams.append('dateEnd', this.dateEnd)
        if (this.pt_id && this.pt_id.length > 0) {
          queryParams.append(
            'lifnr',
            this.pt_id.map((pt) => pt.lifnr).join(',')
          )
        }
        if (this.search) queryParams.append('search', this.search)

        // Perform the export request
        this.$axios({
          url: `/api/admin/approve-sampling-grading-external-export?${queryParams.toString()}`,
          method: 'GET',
          responseType: 'blob', // Ensures the response is treated as a binary file
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const fileName = 'ApproveSamplingGradingExternal.xlsx' // You can customize the filename
            link.setAttribute('download', fileName) // Set the file name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) // Clean up the DOM
            this.show = 1
          })
          .catch((error) => {
            console.error('Error exporting data:', error)
            this.show = 1
          })
      } catch (error) {
        console.error('Error constructing export URL:', error)
        this.show = 1
      }
    },

    //deletePost method
    deletePost(id) {
      this.$swal
        .fire({
          title: 'APAKAH ANDA YAKIN ?',
          text: 'INGIN MENGHAPUS DATA INI !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'YA, HAPUS!',
          cancelButtonText: 'TIDAK',
        })
        .then((result) => {
          if (result.isConfirmed) {
            //delete tag from server

            this.$axios.delete(`/api/admin/spot-cek/${id}`).then((response) => {
              //feresh data
              this.$nuxt.refresh()
              if (response.data.success == true) {
                this.sweet_alert.title = 'BERHASIL!'
                this.sweet_alert.icon = 'success'
              } else {
                this.sweet_alert.title = 'GAGAL!'
                this.sweet_alert.icon = 'error'
              }

              //alert
              this.$swal.fire({
                title: this.sweet_alert.title,
                text: response.data.message,
                icon: this.sweet_alert.icon,
                showConfirmButton: false,
                timer: 2000,
              })
            })
          }
        })
    },
  },
}
</script>

<style scoped>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
.b-table td:nth-child(4),
.b-table th:nth-child(4) {
  min-width: 120px;
  max-width: 200px;
  text-align: center;
  white-space: nowrap;
}
</style>

<style>
.input-fruit-debt {
  min-width: 120px;
  max-width: 200px;
  display: flex;
}
.b-table thead tr:nth-child(3) {
  display: none;
}
.b-table td:nth-child(7),
    .b-table td:nth-child(9),
    .b-table td:nth-child(10),
    .b-table td:nth-child(11),
    .b-table td:nth-child(12),
    .b-table td:nth-child(13),
    .b-table td:nth-child(14),
    .b-table td:nth-child(15),
    .b-table td:nth-child(16),
    .b-table td:nth-child(17),
    .b-table td:nth-child(18),
    .b-table td:nth-child(19),
    .b-table td:nth-child(20),
    .b-table td:nth-child(21),
    .b-table td:nth-child(22),
    .b-table td:nth-child(23),
    .b-table td:nth-child(24),
    .b-table td:nth-child(25),
    .b-table td:nth-child(26),
    /* .b-table td:nth-child(27), */
    .b-table td:nth-child(28),
    .b-table td:nth-child(29),
    .b-table td:nth-child(30) {
  text-align: end;
}
.bg-yellow-row {
  background-color: yellow !important; /* Bootstrap warning background */
}
</style>
