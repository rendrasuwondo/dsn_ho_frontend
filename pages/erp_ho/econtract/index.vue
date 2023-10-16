<template>
  <div class="content-nowrapper ml-3 mb-5 mr-3">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-list"></i> List SPK
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <div>
                <b-card
                  title="027/SWA/LJ1/2023"
                  img-src="https://seeklogo.com/images/A/acrobat-file-pdf-logo-37A1BFDE35-seeklogo.com.png"
                  img-alt="Image"
                  img-top
                  tag="article"
                  style="max-width: 10rem;"
                  class="mb-2"
                >
                  <b-card-text>

                  </b-card-text>

                  <b-button pill href="http://192.168.202.43:2024/upload/2023/KM18/002_DWT_KM18_2023/SPK-FINAL_002_DWT_KM18_2023_VER2.pdf" variant="outline-primary">Go To PDF</b-button>
                </b-card>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'view',

  head() {
    return {
      title: 'E-Contract',
    }
  },
  data() {
    return {
      //
  };
},

methods: {
 //
}
}
</script>

<style>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
</style>
