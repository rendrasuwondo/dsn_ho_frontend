<template>
    <div class="content-wrapper mb-5">
      <section class="content-header">
        <div class="container-fluid"></div>
      </section>
  
      <section class="content">
        <div class="card card-outline card-info">
          <div class="card-header">
            <h3 class="card-title">
              <i class="nav-icon fas fa-cog"></i> <b>Data Approve Sampling Grading</b>
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
                            weekday: 'short', }"
                        ></b-form-datepicker>
                        <b-form-datepicker
                          v-model="dateEnd"
                          placeholder="Pilih tanggal akhir"
                          :date-format-options="{ 
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            weekday: 'short', }"
                            ></b-form-datepicker>
                      </b-col>
                    </b-row>

                    <b-row class="mt-3">
                      <b-col cols="6">Tampilkan Buah Sakit?</b-col>
                      <b-col cols="6">
                        <b-form-checkbox v-model="showSickFruit" switch>
                          Ya
                        </b-form-checkbox>
                      </b-col>
                    </b-row>
                  </b-col>

                  <!-- Right Section -->
                  <b-col cols="6">
                    <b-row class="mt-2">
                      <b-col cols="3">PT</b-col>
                      <b-col cols="9">
                        <multiselect
                          v-model="pt_id"
                          :options="pts"
                          label="company_code_plantation"
                          track-by="company_code_plantation"
                          :searchable="true"
                          :multiple="true"
                          placeholder="Pilih PT"
                        ></multiselect>
                      </b-col>
                    </b-row>

                    <b-row class="mt-3">
                      <b-col cols="3">Estate</b-col>
                      <b-col cols="9">
                        <multiselect
                          v-model="estate_id"
                          :options="estates"
                          label="department_code_plantation"
                          track-by="department_code_plantation"
                          :searchable="true"
                          :multiple="true"
                          placeholder="Pilih Estate"
                        ></multiselect>
                      </b-col>
                    </b-row>

                    <b-row class="mt-3">
                      <b-col cols="3">Afdeling</b-col>
                      <b-col cols="9">
                        <multiselect
                          v-model="afdeling_id"
                          :options="afdelings"
                          label="afdeling_code"
                          track-by="afdeling_code"
                          :searchable="true"
                          :multiple="true"
                          placeholder="Pilih Afdeling"
                        ></multiselect>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <!-- Apply Filters Button -->
                <b-row class="mt-3">
                  <b-col class="text-center">
                    <b-button class="btn btn-info" variant="primary" @click="applyFilters">
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
                >
                <!-- Custom grouped header -->
                <template v-slot:thead-top>
                    <tr>
                        <!-- <th rowspan="2">No</th> -->
                        <th rowspan="2">
                            <input type="checkbox" @change="toggleSelectAll" v-model="selectAll" />
                        </th>
                        <th rowspan="2">Status</th>
                        <th rowspan="2">Tanggal</th>
                        <th rowspan="2">PT</th>
                        <th rowspan="2">Estate</th>
                        <th rowspan="2">Afd</th>
                        <th rowspan="2">Jlh Sampling</th>
                        <th rowspan="2">Driver</th>
                        <th rowspan="2">No. NFB</th>
                        <th colspan="2" class="text-center">Jlh Janjang</th>
                        <th rowspan="2">Selisih JJG</th>
                        <th rowspan="2">Variance JJG (%)</th>
                        <th rowspan="2">Tonase Timbang</th>
                        <th colspan="2" class="text-center">Brondolan</th>
                        <th v-if="showSickFruit" colspan="12" class="text-center">Kualitas TBS (Ripeness)</th>
                        <th v-if="!showSickFruit" colspan="10" class="text-center">Kualitas TBS (Ripeness)</th>
                        <th rowspan="2">BJR</th>
                        <th rowspan="2">Image</th>
                    </tr>
                    <tr>
                        <th>SPB/Bontrip</th>
                        <th>Aktual</th>
                        <th>KG</th>
                        <th>%</th>
                        <th>Unripe</th>
                        <th>%</th>
                        <th>Underripe</th>
                        <th>%</th>
                        <th>Ripe</th>
                        <th>%</th>
                        <th>Over</th>
                        <th>%</th>
                        <th>Jankos</th>
                        <th>%</th>
                        <th v-if="showSickFruit">Buah Sakit</th>
                        <th v-if="showSickFruit">%</th>
                    </tr>
                </template>

                <template #cell(check)="row">
                  <input
                    type="checkbox"
                    v-model="row.item.selected"
                    :check="row.item.status === 'approved'"
                    @change="handleSelectionChange"
                  />
                </template>
            </b-table>
            <button
              :disabled="selectedItems.length === 0"
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
                title: 'Approve Sampling Grading',
            }
        },
        

        data() {
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          const formatDate = (date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

            return {
              selectedItems: [],
              fields: [
                  // { key: 'no', label: '' }, // No label as custom header is used
                  { key: 'check', label: '', sortable: false },
                  { key: 'status', label: ''},
                  { key: 'transaction_date', label: '', formatter: this.formatDate },
                  { key: 'company_code_plantation', label: '' },
                  { key: 'department_code_plantation', label: '' },
                  { key: 'afdeling_code', label: '' },
                  { key: 'jlh_sampling', label: '' },
                  { key: 'driver', label: '' },
                  { key: 'npb', label: '' },
                  { key: 'qty_npb', label: '' },
                  { key: 'total_qty', label: '' },
                  { key: 'var_qty', label: '' },
                  { key: 'percentage_qty', label: '' },
                  { key: 'tonase', label: '' },
                  { key: 'loose_fruit', label: '' },
                  { key: 'percentage_fruit', label: '' },
                  { key: 'qty_unripe', label: '' },
                  { key: 'percentage_unripe', label: '' },
                  { key: 'qty_underripe', label: '' },
                  { key: 'percentage_underripe', label: '' },
                  { key: 'qty_ripe', label: '' },
                  { key: 'percentage_ripe', label: '' },
                  { key: 'qty_over', label: '' },
                  { key: 'percentage_over', label: '' },
                  { key: 'qty_empty_bunch', label: '' },
                  { key: 'percentage_empty_bunch', label: '' },
                  { key: 'qty_abnormal', label: '' },
                  { key: 'percentage_abnormal', label: '' },
                  { key: 'bjr', label: '' },
                  { key: 'image', label: '' },
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
            };

        },
        watchQuery: ['q', 'page'],

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

        async asyncData({ $axios, query }) {
          console.log("hggwgpwpg")
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          const formatDate = (date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

          // Set default dates
          const dateStart = query.dateStart || formatDate(yesterday);
          const dateEnd = query.dateEnd || formatDate(yesterday);

          // Initialize params object dynamically
          const params = {
            ...(query.page && { page: query.page }),
            ...(dateStart && { dateStart }),
            ...(dateEnd && { dateEnd }),
            ...(query.company_code_plantation && { company_code_plantation: query.company_code_plantation }),
            ...(query.department_code_plantation && { department_code_plantation: query.department_code_plantation }),
            ...(query.afdeling_code && { afdeling_code: query.afdeling_code }),
          };

          // Fetching posts with filters
          // const posts = await $axios.$get('/api/admin/spot-cek', { params });

          const response = await $axios.$get('/api/admin/spot-cek', { params });

          const postsFilter = response.data.data.map((item) => ({
            ...item,
            selected: item.status === 'approved', // Check the checkbox if status is approved
          }));

          // Fetching dropdown options
          const list_pt = await $axios.$get(`/api/admin/spot-cek-list-pt`);
          const list_estate = await $axios.$get(`/api/admin/spot-cek-list-estate`);
          const list_afdeling = await $axios.$get(`/api/admin/spot-cek-list-afdeling`);

          return {
            posts: postsFilter,
            pagination: response.data,
            search: query.search || '',
            rowcount: response.data.total,
            pts: list_pt.data,
            estates: list_estate.data,
            afdelings: list_afdeling.data,
            dateStart,
            dateEnd,
            showSickFruit: query.showSickFruit === 'true',
            pt_id: query.company_code_plantation
              ? query.company_code_plantation.split(',').filter(Boolean).map((code) => ({ company_code_plantation: code }))
              : [],
            estate_id: query.department_code_plantation
              ? query.department_code_plantation.split(',').filter(Boolean).map((code) => ({ department_code_plantation: code }))
              : [],
            afdeling_id: query.afdeling_code
              ? query.afdeling_code.split(',').filter(Boolean).map((code) => ({ afdeling_code: code }))
              : [],
          };
        },


        computed: {
          filteredFields() {
            return this.showSickFruit
              ? this.fields
              : this.fields.filter((field) => field.key !== 'qty_abnormal' && field.key !== 'percentage_abnormal');
          },
        },

        mounted() {
          this.applyFilters();
        },

        methods: {
          toggleSelectAll() {
              this.posts.forEach(post => {
                  post.selected = this.selectAll;
              });
              this.handleSelectionChange()
          },

          handleSelectionChange() {
            this.selectedItems = this.posts.filter(item => item.selected);
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
                  
                  const updatedItems = this.posts
                    .filter(item => item.selected && item.status !== 'approved') // Send only items with changed status
                    .map(item => item.id);

                  if (updatedItems.length === 0) {
                    this.$swal.fire({
                      title: 'Tidak ada perubahan!',
                      text: 'Semua data sudah diapprove.',
                      icon: 'info',
                      showConfirmButton: false,
                      timer: 2000,
                    });
                    return;
                  }

                  // Make POST request to the API
                  this.$axios
                    .post('/api/admin/spot-cek-approve', { ids: updatedItems })
                    .then((response) => {
                      // Refresh data
                      this.$nuxt.refresh();

                      // Determine the success or failure of the operation
                      if (response.data.success) {
                        this.sweet_alert.title = 'BERHASIL!';
                        this.sweet_alert.icon = 'success';
                      } else {
                        this.sweet_alert.title = 'GAGAL!';
                        this.sweet_alert.icon = 'error';
                      }

                      // Show feedback to the user
                      this.$swal.fire({
                        title: this.sweet_alert.title,
                        text: response.data.message,
                        icon: this.sweet_alert.icon,
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    })
                    .catch((error) => {
                      // Handle API errors
                      console.error('API Error:', error);
                      this.$swal.fire({
                        title: 'GAGAL!',
                        text: 'Terjadi kesalahan saat memproses data.',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    });
                }
              });
          },

          formatDate(value) {
            if (!value) return '';
            const date = new Date(value);

            const day = String(date.getDate()).padStart(2, '0');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
          },
          
          changePage(page) {
            const query = {
              page,
              dateStart: this.dateStart,
              dateEnd: this.dateEnd,
            };

            if (this.pt_id && this.pt_id.length > 0) {
              query.company_code_plantation = this.pt_id.map((pt) => pt.company_code_plantation).join(',');
            }
            if (this.estate_id && this.estate_id.length > 0) {
              query.department_code_plantation = this.estate_id.map((estate) => estate.department_code_plantation).join(',');
            }
            if (this.afdeling_id && this.afdeling_id.length > 0) {
              query.afdeling_code = this.afdeling_id.map((afdeling) => afdeling.afdeling_code).join(',');
            }

            this.$router.push({ path: this.$route.path, query });
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
              try {
                const query = {};

                // Dynamically add non-empty filters to the query
                if (this.dateStart) query.dateStart = this.dateStart;
                if (this.dateEnd) query.dateEnd = this.dateEnd;
                if (this.pt_id && this.pt_id.length > 0) {
                  query.company_code_plantation = this.pt_id.map((pt) => pt.company_code_plantation).join(',');
                }
                if (this.estate_id && this.estate_id.length > 0) {
                  query.department_code_plantation = this.estate_id.map((estate) => estate.department_code_plantation).join(',');
                }
                if (this.afdeling_id && this.afdeling_id.length > 0) {
                  query.afdeling_code = this.afdeling_id.map((afdeling) => afdeling.afdeling_code).join(',');
                }
                if (this.search) query.search = this.search;

                query.page = this.pagination.current_page || 1;

                // Update the URL query dynamically
                this.$router.push({ path: this.$route.path, query });

                // Fetch the filtered data
                const response = await this.$axios.$get('/api/admin/spot-cek', { params: query });

                const postsFilter = response.data.data.map((item) => ({
                  ...item,
                  selected: item.status === 'approved', // Check the checkbox if status is approved
                }));

                // Update table and pagination data
                this.posts = postsFilter;
                this.pagination = response.data;
                this.rowcount = response.data.total;
              } catch (error) {
                console.error('Error applying filters:', error);
              }
            },

            exportData() {
              try {
                const queryParams = new URLSearchParams();

                // Add filters dynamically if they exist
                if (this.dateStart) queryParams.append('dateStart', this.dateStart);
                if (this.dateEnd) queryParams.append('dateEnd', this.dateEnd);
                if (this.pt_id && this.pt_id.length > 0) {
                  queryParams.append('company_code_plantation', this.pt_id.map((pt) => pt.company_code_plantation).join(','));
                }
                if (this.estate_id && this.estate_id.length > 0) {
                  queryParams.append('department_code_plantation', this.estate_id.map((estate) => estate.department_code_plantation).join(','));
                }
                if (this.afdeling_id && this.afdeling_id.length > 0) {
                  queryParams.append('afdeling_code', this.afdeling_id.map((afdeling) => afdeling.afdeling_code).join(','));
                }
                if (this.search) queryParams.append('search', this.search);

                // Perform the export request
                this.$axios({
                  url: `/api/admin/spot-cek-export?${queryParams.toString()}`,
                  method: 'GET',
                  responseType: 'blob', // Ensures the response is treated as a binary file
                })
                  .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    const fileName = 'SpotCek.xlsx'; // You can customize the filename
                    link.setAttribute('download', fileName); // Set the file name
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link); // Clean up the DOM
                  })
                  .catch((error) => {
                    console.error('Error exporting data:', error);
                  });
              } catch (error) {
                console.error('Error constructing export URL:', error);
              }
            },
        },
    };
</script>
  
  <style scoped>
  .card-info.card-outline {
    border-top: 5px solid #504d8d;
  }
  .card-title {
    color: #504d8d;
  }
  .b-table td:nth-child(3),
  .b-table th:nth-child(3) {
    min-width: 120px;
    max-width: 200px;
    text-align: center;
    white-space: nowrap;
  }
  </style>
  