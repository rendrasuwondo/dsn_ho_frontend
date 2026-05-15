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
            <i class="nav-icon fas fa-cog"></i> <b>Data Monitoring WB</b>
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
                  <b-row class="mt-3">
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

                  <!-- DROPDOWN PKS -->
                  <b-row class="mt-3">
                    <b-col cols="3">PKS</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="pks_id"
                        :options="pks_list"
                        label="code"
                        track-by="code"
                        :searchable="true"
                        :multiple="false"
                        placeholder="Pilih PKS (Pilih dulu untuk memuat dropdown lain)"
                        :loading="isLoadingPks"
                      ></multiselect>
                    </b-col>
                  </b-row>
                  <!-- END DROPDOWN PKS -->

                  <b-row class="mt-3">
                    <b-col cols="3">NPB</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="npb_id"
                        :options="npbs"
                        label="npb"
                        track-by="npb"
                        :searchable="true"
                        :multiple="true"
                        :disabled="
                          !pks_id || pks_id.length === 0 || isLoadingDropdowns
                        "
                        :loading="isLoadingDropdowns"
                        placeholder="Pilih NPB"
                      ></multiselect>
                    </b-col>
                  </b-row>

                  <b-row class="mt-3">
                    <b-col cols="3">Produk</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="produk_id"
                        :options="produks"
                        label="productName"
                        track-by="productName"
                        :searchable="true"
                        :multiple="true"
                        :disabled="
                          !pks_id || pks_id.length === 0 || isLoadingDropdowns
                        "
                        :loading="isLoadingDropdowns"
                        placeholder="Pilih Produk"
                      ></multiselect>
                    </b-col>
                  </b-row>
                </b-col>

                <!-- Right Section -->
                <b-col cols="6">
                  <b-row class="mt-3">
                    <b-col cols="3">Driver</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="driver_id"
                        :options="drivers"
                        label="driverName"
                        track-by="driverName"
                        :searchable="true"
                        :multiple="true"
                        :disabled="
                          !pks_id || pks_id.length === 0 || isLoadingDropdowns
                        "
                        :loading="isLoadingDropdowns"
                        placeholder="Pilih Driver"
                      ></multiselect>
                    </b-col>
                  </b-row>

                  <b-row class="mt-3">
                    <b-col cols="3">Kebun</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="kebun_id"
                        :options="kebuns"
                        label="kebun"
                        track-by="kebun"
                        :searchable="true"
                        :multiple="true"
                        :disabled="
                          !pks_id || pks_id.length === 0 || isLoadingDropdowns
                        "
                        :loading="isLoadingDropdowns"
                        placeholder="Pilih Kebun"
                      ></multiselect>
                    </b-col>
                  </b-row>

                  <b-row class="mt-3">
                    <b-col cols="3">Plat</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="plat_id"
                        :options="plats"
                        label="transportVehiclePlateNo"
                        track-by="transportVehiclePlateNo"
                        :searchable="true"
                        :multiple="true"
                        :disabled="
                          !pks_id || pks_id.length === 0 || isLoadingDropdowns
                        "
                        :loading="isLoadingDropdowns"
                        placeholder="Pilih Plat"
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
            show-empty
            empty-text="Belum ada data. Silahkan pilih filter dan klik Apply Filters."
          >
          </b-table>
          <!-- <button
            :disabled="
              selectedItems.length === 0 && unselectedItems.length === 0
            "
            @click="approveSelected"
            class="btn btn-primary"
            v-if="posts.length > 0"
          >
            Approve
          </button> -->
          <!-- pagination -->
          <b-row v-if="posts.length > 0">
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
            <b-col class="text-right" align-self="center">
              {{ formatToThousand(rowcount) }} data
            </b-col>
          </b-row>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'admin',

  head() {
    return {
      title: 'Monitoring WB HO',
    }
  },

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
        { key: 'dtTransaction', label: 'Tanggal', formatter: this.formatDate },
        { key: 'originSiteName', label: 'PKS' },
        { key: 'productName', label: 'Produk' },
        { key: 'kebun', label: 'Kebun' },
        { key: 'npb', label: 'NPB' },
        { key: 'driverName', label: 'Driver' },
        { key: 'transportVehiclePlateNo', label: 'Plat' },
        { key: 'originWeighOutKg', label: 'Ton' },
        { key: 'janjang', label: 'Janjang' },
      ],
      dateStart: formatDate(yesterday), // Default to yesterday
      dateEnd: formatDate(yesterday), // Default to today
      showSickFruit: false,
      pks_id: [], // State PKS
      pks_list: [], // Option list PKS
      produk_id: [],
      kebun_id: [],
      npb_id: [],
      driver_id: [],
      plat_id: [],
      kebuns: [],
      npbs: [],
      drivers: [],
      plats: [],
      produks: [],
      pt_id: [],
      pts: [],
      estate_id: [],
      estates: [],
      afdeling_id: [],
      afdelings: [],
      posts: [], // Data for the table
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      }, // Pagination data initialized
      search: '',
      rowcount: 0,
      selectAll: false,
      sweet_alert: {
        title: '',
        icon: '',
      },
      show: 1, // Start with 1 to show filter form
      isLoadingDropdowns: false, // Menambah state lokal khusus untuk dropdown dependent
      isLoadingPks: false, // Menambah state lokal khusus untuk dropdown PKS
    }
  },

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

  watch: {
    // Watch ketika pks_id berubah
    pks_id: {
      handler(newVal) {
        // Reset list option dropdown dependent ketika pks berubah
        this.produk_id = []
        this.kebun_id = []
        this.npb_id = []
        this.driver_id = []
        this.plat_id = []

        if (newVal) {
          console.log('newVal :>> ', newVal)
          // Ambil value "code" yang dipisahkan oleh koma untuk diparsing ke backend
          // const pksString = newVal.map((pks) => pks.code).join(',')
          this.fetchDependentDropdowns(newVal.code)
        } else {
          // Jika PKS dikosongkan, list dropdown yang lain dihilangkan
          this.produks = []
          this.kebuns = []
          this.npbs = []
          this.drivers = []
          this.plats = []
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.fetchInitialPks()
  },

  methods: {
    async fetchInitialPks() {
      try {
        this.isLoadingPks = true
        const response = await this.$axios.$get(
          '/api/admin/spot-cek-get_pks_dropdown-report'
        )
        this.pks_list = response.data || []
      } catch (error) {
        console.error('Error fetching PKS list:', error)
      } finally {
        this.isLoadingPks = false
      }
    },

    async fetchDependentDropdowns(pksString) {
      // Mengubah loading khusus dropdown, bukan memanggil "this.show = 0"
      this.isLoadingDropdowns = true

      try {
        const params = { pks: pksString }

        // Eksekusi semua secara paralel
        const [produkRes, kebunRes, driverRes, platRes, npbRes] =
          await Promise.all([
            this.$axios.$get('/api/admin/monitoring-wb-list-produk', {
              params,
            }),
            this.$axios.$get('/api/admin/monitoring-wb-list-kebun', { params }),
            this.$axios.$get('/api/admin/monitoring-wb-list-driver', {
              params,
            }),
            this.$axios.$get('/api/admin/monitoring-wb-list-plat', { params }),
            this.$axios.$get('/api/admin/monitoring-wb-list-npb', { params }),
          ])

        this.produks = produkRes.data || []
        this.kebuns = kebunRes.data || []
        this.drivers = driverRes.data || []
        this.plats = platRes.data || []
        this.npbs = npbRes.data || []
      } catch (error) {
        console.error('Error fetching dependent dropdowns:', error)
      } finally {
        this.isLoadingDropdowns = false // Matikan loading dropdown
      }
    },

    formatToThousand(value) {
      if (!value) return '0'
      return new Intl.NumberFormat('id-ID').format(value)
    },
    formatToTwoDecimals(value) {
      if (!value) return '0.00'
      return parseFloat(value).toFixed(2)
    },
    formatToZeroDecimals(value) {
      if (!value) return '0'
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
            const updatedItemsSelected = this.posts
              .filter((item) => item.selected && item.status !== 'approved')
              .map((item) => item.id)

            const updatedItemsUnselected = this.posts
              .filter((item) => !item.selected && item.status === 'approved')
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
                this.$axios.post('/api/admin/monitoring-wb-approve', {
                  ids: updatedItemsSelected,
                })
              )
            }

            if (updatedItemsUnselected.length !== 0) {
              apiCalls.push(
                this.$axios.post('/api/admin/monitoring-wb-unapprove', {
                  ids: updatedItemsUnselected,
                })
              )
            }

            Promise.all(apiCalls)
              .then((responses) => {
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

                this.applyFilters() // Refresh via CSR applyFilters
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
      this.pagination.current_page = page
      this.applyFilters()
    },

    searchData() {
      this.pagination.current_page = 1 // Reset halaman
      this.applyFilters()
    },

    async applyFilters() {
      this.show = 0 // Munculkan loading indicator full page untuk data table
      try {
        const params = {
          page: this.pagination.current_page || 1,
        }

        if (this.dateStart) params.dateStart = this.dateStart
        if (this.dateEnd) params.dateEnd = this.dateEnd

        // if (this.pks_id && this.pks_id.length > 0) {
        //   params.pks = this.pks_id.map((pks) => pks.code).join(',')
        // }

        params.pks = this.pks_id ? this.pks_id.code : ''
        if (this.produk_id && this.produk_id.length > 0) {
          params.produks = this.produk_id.map((pt) => pt.productName).join(',')
        }
        if (this.kebun_id && this.kebun_id.length > 0) {
          params.kebuns = this.kebun_id.map((estate) => estate.kebun).join(',')
        }
        if (this.plat_id && this.plat_id.length > 0) {
          params.plats = this.plat_id
            .map((estate) => estate.transportVehiclePlateNo.trim())
            .join(',')
        }
        if (this.npb_id && this.npb_id.length > 0) {
          params.npbs = this.npb_id.map((estate) => estate.npb).join(',')
        }
        if (this.driver_id && this.driver_id.length > 0) {
          params.drivers = this.driver_id
            .map((estate) => estate.driverName)
            .join(',')
        }
        if (this.search) params.search = this.search

        // Fetch the filtered data
        const response = await this.$axios.$get('/api/admin/monitoring-wb', {
          params,
        })

        const postsFilter = response.data.data.map((item) => ({
          ...item,
          selected: item.status === 'approved',
        }))

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

        // Tanggal
        if (this.dateStart) queryParams.append('dateStart', this.dateStart)
        if (this.dateEnd) queryParams.append('dateEnd', this.dateEnd)

        // PKS (single object karena :multiple="false")
        if (this.pks_id && this.pks_id.code) {
          queryParams.append('pks', this.pks_id.code)
        }

        // Produk
        if (this.produk_id && this.produk_id.length > 0) {
          queryParams.append(
            'produks',
            this.produk_id.map((pt) => pt.productName).join(',')
          )
        }

        // Kebun
        if (this.kebun_id && this.kebun_id.length > 0) {
          queryParams.append(
            'kebuns',
            this.kebun_id.map((estate) => estate.kebun).join(',')
          )
        }

        // Plat
        if (this.plat_id && this.plat_id.length > 0) {
          queryParams.append(
            'plats',
            this.plat_id
              .map((estate) => estate.transportVehiclePlateNo.trim())
              .join(',')
          )
        }

        // NPB
        if (this.npb_id && this.npb_id.length > 0) {
          queryParams.append(
            'npbs',
            this.npb_id.map((estate) => estate.npb).join(',')
          )
        }

        // Driver
        if (this.driver_id && this.driver_id.length > 0) {
          queryParams.append(
            'drivers',
            this.driver_id.map((estate) => estate.driverName).join(',')
          )
        }

        // Search text
        if (this.search) queryParams.append('search', this.search)

        // Panggil endpoint export
        this.$axios({
          url: `/api/admin/monitoring-wb-export?${queryParams.toString()}`,
          method: 'GET',
          responseType: 'blob',
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            // Ubah nama file sesuai dengan modul
            const fileName = 'MonitoringWb.xlsx'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
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
            this.$axios
              .delete(`/api/admin/monitoring-wb/${id}`)
              .then((response) => {
                if (response.data.success == true) {
                  this.sweet_alert.title = 'BERHASIL!'
                  this.sweet_alert.icon = 'success'
                } else {
                  this.sweet_alert.title = 'GAGAL!'
                  this.sweet_alert.icon = 'error'
                }

                this.$swal.fire({
                  title: this.sweet_alert.title,
                  text: response.data.message,
                  icon: this.sweet_alert.icon,
                  showConfirmButton: false,
                  timer: 2000,
                })

                this.applyFilters() // Refresh via CSR applyFilters
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
.b-table td:nth-child(28),
.b-table td:nth-child(29),
.b-table td:nth-child(30) {
  text-align: end;
}
</style>
