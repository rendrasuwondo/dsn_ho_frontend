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
              <i class="nav-icon fas fa-cog"></i> <b>Data Map Jabatan</b>
            </h3>
            <div class="card-tools"></div>
          </div>
          <div class="card-body">
            <!-- <b-card
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
                  </b-col>

                  <b-col cols="6">
                    <b-row class="mt-2">
                      <b-col cols="3">Produk</b-col>
                      <b-col cols="9">
                        <multiselect
                          v-model="produk_id"
                          :options="produks"
                          label="productName"
                          track-by="productName"
                          :searchable="true"
                          :multiple="true"
                          placeholder="Pilih Produk"
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
                          placeholder="Pilih Kebun"
                        ></multiselect>
                      </b-col>
                    </b-row>

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
                          placeholder="Pilih NPB"
                        ></multiselect>
                      </b-col>
                    </b-row>

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
                          placeholder="Pilih Driver"
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
                          placeholder="Pilih Plat"
                        ></multiselect>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="mt-3">
                  <b-col class="text-center">
                    <b-button class="btn btn-info" variant="primary" @click="applyFilters">
                      Apply Filters
                    </b-button>
                  </b-col>
                </b-row>
              </b-card-text>
            </b-card> -->
            
            <div class="form-group">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <nuxt-link
                    :to="{ name: 'erp_ho-mill-map_jabatan-create' }"
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
                >
            </b-table>
            <button
              :disabled="selectedItems.length === 0 && unselectedItems.length === 0"
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
                title: 'Map Jabatan',
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
              unselectedItems: [],
              fields: [
                  { key: 'position_code', label: 'Posisi'},
                  { key: 'station_code', label: 'Jabatan'},
                  { key: 'is_active_code', label: 'Status'},
                  { key: 'created_at', label: 'Tanggal Dibuat', formatter: this.formatDate},
              ],
              dateStart: formatDate(yesterday), // Default to yesterday
              dateEnd: formatDate(yesterday), // Default to today
              showSickFruit: false,
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
              pagination: {}, // Pagination data
              rowcount: 0,
              selectAll: false,
              sweet_alert: {
                title: '',
                icon: '',
              },
              show: 1,
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
            ...(query.kebuns && { kebuns: query.kebuns }),
            ...(query.kebuns && { produks: query.produks }),
            ...(query.npbs && { produks: query.npbs }),
            ...(query.drivers && { produks: query.drivers }),
            ...(query.plats && { produks: query.plats }),
            // ...(query.afdeling_code && { afdeling_code: query.afdeling_code }),
          };


          const response = await $axios.$get('/api/admin/map-jabatan', { params });

          const postsFilter = response.data.data.map((item) => ({
            ...item,
            selected: item.status === 'approved', // Check the checkbox if status is approved
          }));

        //   const list_produk = await $axios.$get(`/api/admin/map-jabatan-list-produk`);
        //   const list_kebun = await $axios.$get(`/api/admin/map-jabatan-list-kebun`);
        //   const list_driver = await $axios.$get(`/api/admin/map-jabatan-list-driver`);
        //   const list_plat = await $axios.$get(`/api/admin/map-jabatan-list-plat`);
        //   const list_npb = await $axios.$get(`/api/admin/map-jabatan-list-npb`);

          return {
            posts: postsFilter,
            pagination: response.data,
            search: query.search || '',
            rowcount: response.data.total,
            // produks: list_produk.data,
            // kebuns: list_kebun.data,
            // npbs: list_npb.data,
            // drivers: list_driver.data,
            // plats: list_plat.data,
            dateStart,
            dateEnd,
            showSickFruit: query.showSickFruit === 'true',
            // produk_id: query.produks
            //   ? query.produks.split(',').filter(Boolean).map((code) => ({ produks: code }))
            //   : [],
            // kebun_id: query.kebuns
            //   ? query.kebuns.split(',').filter(Boolean).map((code) => ({ kebuns: code }))
            //   : [],
            // afdeling_id: query.afdeling_code
            //   ? query.afdeling_code.split(',').filter(Boolean).map((code) => ({ afdeling_code: code }))
            //   : [],
          };
        },


        computed: {
          filteredFields() {
            return this.showSickFruit
              ? this.fields
              : this.fields.filter((field) => 
              field.key !== 'qty_parthenocarpy' && 
              field.key !== 'percentage_parthenocarpy'  && 
              field.key !== 'qty_hard_bunch'  && 
              field.key !== 'percentage_hard_bunch'  && 
              field.key !== 'qty_unripe_fruit_fall'  && 
              field.key !== 'percentage_unripe_fruit_fall'  && 
              field.key !== 'qty_long_stalk'
            );
          },
        },

        mounted() {
          this.applyFilters();
        },

        methods: {
          formatToThousand(value) {
            if (!value) return '0'; // Return 0 for empty or null values
            return new Intl.NumberFormat('id-ID').format(value);
          },
          formatToTwoDecimals(value) {
            if (!value) return '0.00'; // Return 0.00 for empty values
            return parseFloat(value).toFixed(2);
          },
          formatToZeroDecimals(value) {
            if (!value) return '0'; // Return 0.00 for empty values
            return parseFloat(value).toFixed(0);
          },
          toggleSelectAll() {
              this.posts.forEach(post => {
                  post.selected = this.selectAll;
              });
              this.handleSelectionChange()
          },

          handleSelectionChange() {
            this.selectedItems = this.posts.filter(item => item.selected  && item.status !== 'approved');
            this.unselectedItems = this.posts.filter(item => !item.selected  && item.status == 'approved');
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
                    .map((item) => item.id);

                  const updatedItemsUnselected = this.posts
                    .filter((item) => !item.selected && item.status === 'approved') // Send only items with changed status
                    .map((item) => item.id);

                  if (updatedItemsSelected.length === 0 && updatedItemsUnselected.length === 0) {
                    this.$swal.fire({
                      title: 'Tidak ada perubahan!',
                      text: 'Semua data sudah diapprove.',
                      icon: 'info',
                      showConfirmButton: false,
                      timer: 2000,
                    });
                    return;
                  }

                  const apiCalls = [];

                  if (updatedItemsSelected.length !== 0) {
                    apiCalls.push(
                      this.$axios.post('/api/admin/map-jabatan-approve', { ids: updatedItemsSelected })
                    );
                  }

                  if (updatedItemsUnselected.length !== 0) {
                    apiCalls.push(
                      this.$axios.post('/api/admin/map-jabatan-unapprove', { ids: updatedItemsUnselected })
                    );
                  }

                  Promise.all(apiCalls)
                    .then((responses) => {
                      const allSuccess = responses.every((response) => response.data.success);

                      if (allSuccess) {
                        this.sweet_alert.title = 'BERHASIL!';
                        this.sweet_alert.icon = 'success';
                      } else {
                        this.sweet_alert.title = 'SEBAGIAN BERHASIL!';
                        this.sweet_alert.icon = 'warning';
                      }

                      this.$swal.fire({
                        title: this.sweet_alert.title,
                        text: 'Proses selesai!',
                        icon: this.sweet_alert.icon,
                        showConfirmButton: false,
                        timer: 2000,
                      });

                      this.$nuxt.refresh();
                    })
                    .catch((error) => {
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
            // const query = {
            //   page,
            //   dateStart: this.dateStart,
            //   dateEnd: this.dateEnd,
            // };

            const query = {
              page
            };

            // Dynamically add non-empty filters to the query
            // if (this.dateStart) query.dateStart = this.dateStart;
            // if (this.dateEnd) query.dateEnd = this.dateEnd;
            // if (this.dateEnd) query.ddsfsd = this.dateEnd;

            // if (this.produk_id && this.produk_id.length > 0) {
            //   query.company_code_plantation = this.pt_id.map((pt) => pt.company_code_plantation).join(',');
            // }
            // if (this.estate_id && this.estate_id.length > 0) {
            //   query.department_code_plantation = this.estate_id.map((estate) => estate.department_code_plantation).join(',');
            // }
            // if (this.afdeling_id && this.afdeling_id.length > 0) {
            //   query.afdeling_code = this.afdeling_id.map((afdeling) => afdeling.afdeling_code).join(',');
            // }
            console.log('123-1')
            console.log(this.produk_id)
            console.log(this.produk_id.length)
            console.log(this.kebun_id)
            console.log(this.kebun_id.length)
            if (this.produk_id && this.produk_id.length > 0) {
              query.produks = this.produk_id.map((pt) => pt.productName).join(',');
            }
            if (this.kebun_id && this.kebun_id.length > 0) {
              console.log('masoookkkkkk')
              query.kebuns = this.kebun_id.map((estate) => estate.kebun).join(',');
            }
            if (this.npb_id && this.npb_id.length > 0) {
              query.npbs = this.npb_id.map((estate) => estate.npb).join(',');
            }
            if (this.driver_id && this.driver_id.length > 0) {
              query.drivers = this.driver_id.map((estate) => estate.driverName).join(',');
            }
            if (this.plat_id && this.plat_id.length > 0) {
              query.plats = this.plat_id.map((estate) => estate.transportVehiclePlateNo).join(',');
            }

            console.log('111sdfs')
            console.log(query)

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
            this.show = 0
            try {
              const query = {};

              // Dynamically add non-empty filters to the query
              if (this.dateStart) query.dateStart = this.dateStart;
              if (this.dateEnd) query.dateEnd = this.dateEnd;
              if (this.produk_id && this.produk_id.length > 0) {
                query.produks = this.produk_id.map((pt) => pt.productName).join(',');
              }
              if (this.kebun_id && this.kebun_id.length > 0) {
                query.kebuns = this.kebun_id.map((estate) => estate.kebun).join(',');
              }
              if (this.plat_id && this.plat_id.length > 0) {
                query.plats = this.plat_id.map((estate) => estate.transportVehiclePlateNo).join(',');
              }
              if (this.npb_id && this.npb_id.length > 0) {
                query.npbs = this.npb_id.map((estate) => estate.npb).join(',');
              }
              if (this.driver_id && this.driver_id.length > 0) {
                query.drivers = this.driver_id.map((estate) => estate.driverName).join(',');
              }
              if (this.search) query.search = this.search;

              query.page = this.pagination.current_page || 1;

              // Update the URL query dynamically
              this.$router.push({ path: this.$route.path, query });

              // Fetch the filtered data
              const response = await this.$axios.$get('/api/admin/map-jabatan', { params: query });

              const postsFilter = response.data.data.map((item) => ({
                ...item,
                selected: item.status === 'approved', // Check the checkbox if status is approved
              }));

              // Update table and pagination data
              this.posts = postsFilter;
              this.pagination = response.data;
              this.rowcount = response.data.total;
              this.show = 1
            } catch (error) {
              console.error('Error applying filters:', error);
              this.show = 1
            }
          },

          exportData() {
            try {
              this.show = 0
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
                url: `/api/admin/approve-sampling-grading-export?${queryParams.toString()}`,
                method: 'GET',
                responseType: 'blob', // Ensures the response is treated as a binary file
              })
                .then((response) => {
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  const fileName = 'ApproveSamplingGrading.xlsx'; // You can customize the filename
                  link.setAttribute('download', fileName); // Set the file name
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link); // Clean up the DOM
                  this.show = 1
                })
                .catch((error) => {
                  console.error('Error exporting data:', error);
                  this.show = 1
                });
            } catch (error) {
              console.error('Error constructing export URL:', error);
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

                  this.$axios.delete(`/api/admin/map-jabatan/${id}`).then((response) => {
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
    };
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
    /* .b-table td:nth-child(27), */
    .b-table td:nth-child(28),
    .b-table td:nth-child(29),
    .b-table td:nth-child(30) {
      text-align: end;
    }
  </style>
  