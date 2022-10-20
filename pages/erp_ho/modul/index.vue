<template>
  <div>
    <div class="container-2">
      <div>
        <b-card no-body>
          <template #header>
            <h5>
              <b>
                <i class="nav-icon fas fa-swatchbook mr-1"></i> DOKUMEN
                MONITORING HAP
              </b>
            </h5>
          </template>

          <b-list-group flush>
            <b-list-group-item>
              <a href="#" class="card-link" @click="fileDownload('Manual_RNA')">
                <i class="nav-icon fas fa-file-pdf mr-1"></i> Manual User RNA
              </a>
              <br />
              <a href="#" class="card-link" @click="fileDownload('Manual_PRC')">
                <i class="nav-icon fas fa-file-pdf mr-1"></i> Manual User PRC
              </a>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </div>
    </div>

    <div class="footer" varian="light">
      <div class="float-right d-none d-sm-block"><b>Version</b> 1.0.0</div>
      <strong>Copyright &copy; 2022 ERP HO DSN</strong> All rights reserved.
    </div>
  </div>
</template>
<script>
export default {
  //meta
  head() {
    return {
      title: 'Modul Monitoring HAP',
    }
  },
  setup() {},
  methods: {
    fileDownload(file_name) {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/modul_hap?file_name=` + file_name,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = file_name
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },
  },
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap');
body {
  background: linear-gradient(70deg, #c7c5f4, #776bcc);
  /* background-image: url('/img/bg2.jpg'); */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
  background-attachment: fixed;
}
.container-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0px;
  margin-top: 50px;
  width: 80%;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 15px;
  width: 100%;
  color: white;
  background: linear-gradient(30deg, #c7c5f4, #776bcc);
  background-color: #ffffff;
}
.btn-modul2 {
  font-size: 16px;
  font-weight: bold;
  width: 200px;
  height: 100px;
  /* color: ; */
  padding: auto;
  margin-top: 20px;
  background-color: #776bcc;
  box-shadow: 2px 2px #7e7f7b9f;
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: #cdcdf1;
}
h5 {
  color: #4c3cc4;
  font-weight: bold;
  text-shadow: 1px 2px #c7c5f4;
  font-family: 'Teko', sans-serif;
  font-size: 35px;
}

.card-link {
  margin-top: 20px;
  font-size: 16px;
}
</style>