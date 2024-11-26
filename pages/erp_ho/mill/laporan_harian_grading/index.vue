<template>
    <div class="content-wrapper mb-5">
      <section class="content-header">
        <div class="container-fluid"></div>
      </section>
  
      <section class="content">
        <div class="card card-outline card-info">
          <div class="card-header">
            <h3 class="card-title">
              <i class="nav-icon fas fa-cog"></i> <b>Data Laporan Harian Grading</b>
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
                  <b-col cols="6">
                    <b-row class="mt-2">
                      <b-col cols="3">Tanggal</b-col>
                      <b-col cols="9">
                        <b-form-datepicker
                          v-model="dateStart"
                          placeholder="Pilih tanggal"
                          class="mb-2"
                          :date-format-options="{ 
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            weekday: 'short', }"
                        ></b-form-datepicker>
                      </b-col>
                    </b-row>
                  </b-col>

                  <b-col cols="6">
                    <b-row class="mt-2">
                      <b-col cols="3">Estate</b-col>
                      <b-col cols="9">
                        <multiselect
                          v-model="estate_id"
                          :options="estates"
                          label="department_code_plantation"
                          track-by="department_code_plantation"
                          :searchable="true"
                          placeholder="Pilih Estate"
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
              :items="tableData"
              :fields="tableFields"
              responsive
              bordered
              hover
              small
            >
              <!-- Custom Header for Grouped Layout -->
              <template v-slot:thead-top>
                
              </template>

              <!-- Row Rendering -->
              <template #cell(no)="data">
                {{ data.index + 1 }}
              </template>
            </b-table>
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
                title: 'Laporan Harian Grading',
            }
        },
        

        data() {
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          const formatDate = (date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

            return {
              columnGroups: [
                { label: "1", colspan: 1 },
                { label: "2", colspan: 1 },
                { label: "3", colspan: 1 },
                { label: "4", colspan: 1 },
                { label: "5", colspan: 1 },
              ],
              columnHeaders: [
                { label: "Data 1" },
                { label: "Data 2" },
                { label: "Data 3" },
                { label: "Data 4" },
                { label: "Data 5" },
              ],
              // Fields for the table
              tableFields: [
                { key: "no", label: "No" },
                { key: "deskripsi", label: "Deskripsi" },
                { key: "col_1", label: "1", class: "text-right" },
                { key: "col_2", label: "2", class: "text-right" },
                { key: "col_3", label: "3", class: "text-right" },
                { key: "col_4", label: "4", class: "text-right" },
                { key: "col_5", label: "5", class: "text-right" },
                { key: "total", label: "Total", class: "text-right" },
              ],
              // Dummy Data
              tableData: [
                {
                  no: 1,
                  deskripsi: "No. Bon Trip",
                  col_1: 3,
                  col_2: 7,
                  col_3: 6,
                  col_4: 7,
                  col_5: 5,
                  total: 28,
                },
                {
                  no: 2,
                  deskripsi: "Berat Netto",
                  col_1: 23340,
                  col_2: 51840,
                  col_3: 36330,
                  col_4: 53950,
                  col_5: 37170,
                  total: 202630,
                },
                {
                  no: 3,
                  deskripsi: "Unripe (TBS Mentah)",
                  col_1: 0,
                  col_2: 0,
                  col_3: 0,
                  col_4: 0,
                  col_5: 0,
                  total: 0,
                },
                {
                  no: 4,
                  deskripsi: "Over Ripe (TBS Lewat Matang)",
                  col_1: 1.86,
                  col_2: 3.50,
                  col_3: 4.20,
                  col_4: 5.50,
                  col_5: 5.01,
                  total: 20.07,
                },
              ],
              fields: [
                  // { key: 'no', label: '' }, // No label as custom header is used
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
            };

        },

        watchQuery: ['q', 'page'],

        async asyncData({ $axios, query }) {
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
          const posts = await $axios.$get('/api/admin/spot-cek', { params });

          // Fetching dropdown options
          const list_pt = await $axios.$get(`/api/admin/spot-cek-list-pt`);
          const list_estate = await $axios.$get(`/api/admin/spot-cek-list-estate`);
          const list_afdeling = await $axios.$get(`/api/admin/spot-cek-list-afdeling`);

          return {
            posts: posts.data.data,
            pagination: posts.data,
            search: query.search || '',
            rowcount: posts.data.total,
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

                // Update table and pagination data
                this.posts = response.data.data;
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
  .table th {
    text-align: left; /* Align header to the left */
    vertical-align: middle; /* Center vertically */
  }

  .table td {
    vertical-align: middle; /* Center vertically */
  }
</style>
  