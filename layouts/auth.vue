<template>
  <div class="hold-transition login-page">
    <div class="login-box">
      <!-- /.login-logo -->
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  //middleware auth
  middleware: 'auth',
}
</script>

<style>
body {
  font-family: 'Quicksand', sans-serif;
}

.login-page {
  background: linear-gradient(90deg, #c7c5f4, #776bcc);
}

.card-info.card-outline {
  border-top: 5px solid #0385ca;
}

.btn-info {
  color: #fff;
  background-color: #186399;
  border-color: #186399;
  box-shadow: none;
}

.btn-info:hover {
  color: #fff;
  background-color: #12466b;
  border-color: #12466b;
  box-shadow: none;
}

.img-logoo {
  margin-bottom: 20px;
  height: 80px;
  object-fit: cover;
}

.download-apk {
  margin-top: 20px;
  margin-right: 20px;
  width: 210px;
  padding: 10px;
  background: #0c0d0e;
  font-size: 13px;
  box-shadow: 3px 2px #f5f6faf5;
}
.download-apk:hover {
  background: linear-gradient(
    to right,
    #dcdde1,
    #2f3542,
    #1e272e,
    black
  ) !important;
}

.download-pdf {
  margin-top: 20px;
  width: 240px;
  padding: 10px;
  background: #0c0d0e;
  font-size: 13px;
  box-shadow: 3px 2px #f5f6faf5;
}
.download-pdf:hover {
  background: linear-gradient(
    to right,
    #dcdde1,
    #2f3542,
    #1e272e,
    black
  ) !important;
}

.img-download {
  width: 25px;
  height: 25px;
  margin-right: 3px;
}

.login-box {
  width: 60%;
  height: 355px;
}
</style>
