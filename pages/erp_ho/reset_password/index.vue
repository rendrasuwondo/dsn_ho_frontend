<template>
  <div class="container reset-password-container">
    <div class="screen">
      <div class="screen__content">
        <div v-if="show === 0">
          <div class="spinonediv-4"></div>
        </div>
        <form class="reset_password" @submit.prevent="resetPassword">
          <div class="reset_password__field">
            <b-img class="dsn-logo" src="/img/dsn_logo.png" alt="logo"></b-img>
          </div>
          <div class="reset_password__field">
            <i class="reset_password__icon fas fa-user"></i>
            <input
              type="text"
              v-model="user.user_name"
              :class="{ 'is-invalid': validation.user_name }"
              class="reset_password__input"
              placeholder="User name"
              autofocus
              ref="user_name"
            />
          </div>
          <!-- <div v-if="validation.user_name" class="">
            <b-alert show variant="danger">{{
              validation.user_name[0]
            }}</b-alert>
          </div> -->
          <button class="button reset_password__submit" type="submit">
            <span class="button__text">Reset Password</span>
            <i class="button__icon fas fa-chevron-right"></i>
          </button>
        </form>
      </div>
      <div class="screen__background">
        <span
          class="screen__background__shape screen__background__shape4"
        ></span>
        <span
          class="screen__background__shape screen__background__shape3"
        ></span>
        <span
          class="screen__background__shape screen__background__shape2"
        ></span>
        <span
          class="screen__background__shape screen__background__shape1"
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  //meta
  head() {
    return {
      title: 'Reset Password',
    }
  },
  data() {
    return {
      //state user
      show: 1,
      user: {
        user_name: '',
        password: '',
      },
      //validation
      validation: [],
    }
  },
  setup() {},
  methods: {
    async resetPassword() {
      let formData = new FormData()

      const currentDomain = window.location.origin

      formData.append('username', this.user.user_name)
      formData.append('redirect_to', `${currentDomain}/erp_ho/login`)

      this.show = 0

      //profile
      this.$axios
        .post(
          this.$config.grievanceBaseURL + '/api/erp-ho/forgot-password',
          formData
        )
        .then((response) => {
          if (response.data.status == 'Success') {
            this.$swal
              .fire({
                title: 'BERHASIL!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
              })
              .then(() => {
                //redirect
                this.$router.push({
                  name: 'erp_ho-login',
                })
              })
          } else {
            this.$swal.fire({
              title: 'GAGAL!',
              text: response.data.message,
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
            })
          }
          this.show = 1
        })
        .catch((error) => {
          //assign validation
          this.validation = error.response.data
        })
    },
  },
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Raleway, sans-serif;
}

body {
  background: linear-gradient(90deg, #c7c5f4, #776bcc);
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 87vh;
  padding-bottom: 0px;
  margin-top: -50px;
  width: 400px;
}

.reset-password-container {
  min-height: 128vh;
}

.screen {
  background: linear-gradient(90deg, #6758db, #a5a0f0);
  position: relative;
  height: 550px;
  width: 400px;
  margin-top: -20%;
  padding-bottom: 0px;
  box-shadow: 0px 0px 24px #463c9c;
  border-radius: 10px;
}

.screen__content {
  z-index: 1;
  position: relative;
  height: 100%;
}

.screen__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  -webkit-clip-path: inset(0 0 0 0);
  clip-path: inset(0 0 0 0);
}

.screen__background__shape {
  transform: rotate(45deg);
  position: absolute;
}

.screen__background__shape1 {
  height: 560px;
  width: 520px;
  background: #fff;
  top: -60px;
  right: 170px;
  border-radius: 0 72px 0 0;
}

.screen__background__shape2 {
  height: 220px;
  width: 235px;
  background: #6c63ac;
  top: -172px;
  right: 5px;
  border-radius: 32px;
}

.screen__background__shape3 {
  height: 570px;
  width: 165px;
  background: linear-gradient(270deg, #5d54a4, #6a679e);
  top: -55px;
  right: 0;
  border-radius: 32px;
}

.screen__background__shape4 {
  height: 415px;
  width: 215px;
  background: #635fbd;
  top: 370px;
  right: 10px;
  border-radius: 60px;
}

.dsn-logo {
  height: 65px;
  margin-left: 0px;
}

.logo-modul {
  height: 20px;
  margin-left: 0px;
}

.reset_password {
  width: 320px;
  padding: 30px;
  padding-top: 35px;
}

.reset_password__field {
  padding: 17px 0px;
  position: relative;
}

.reset_password__icon {
  position: absolute;
  top: 30px;
  color: #7875b5;
}

.reset_password__input {
  border: none;
  border-bottom: 2px solid #d1d1d4;
  background: none;
  padding: 10px;
  padding-left: 24px;
  font-weight: 700;
  width: 75%;
  transition: 0.2s;
  color: #6a679e;
  font-size: 15px;
  margin-top: -4px;
  font-family: 'Barlow Condensed', sans-serif;
}

.reset_password__input:active,
.reset_password__input:focus,
.reset_password__input:hover {
  outline: none;
  border-bottom-color: #6a679e;
}

.reset_password__submit {
  background: #fff;
  font-size: 13px;
  margin-top: 20px;
  margin-left: 15px;
  padding: 13px 20px;
  border-radius: 30px;
  border: 1px solid #d4d3e8;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  width: 90%;
  color: #5d59b0;
  box-shadow: 0px 2px 2px #5c5696;
  cursor: pointer;
  transition: 0.2s;
  margin-bottom: 0px;
}

.reset_password__submit:active,
.reset_password__submit:focus,
.reset_password__submit:hover {
  border-color: #6a679e;
  outline: none;
}

.button__icon {
  font-size: 24px;
  margin-left: auto;
  color: #7875b5;
}

.social-reset_password {
  position: absolute;
  height: 145px;
  width: 160px;
  text-align: right;
  margin-right: 15px;
  bottom: 0px;
  right: 0px;
  color: #fff;
}

.social-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #d4d3e8;
}

.social-reset_password__icon {
  padding: 20px 10px;
  color: #fff;
  text-decoration: none;
  text-shadow: 0px 0px 8px #7875b5;
}

.social-reset_password__icon:hover {
  transform: scale(1.5);
}
h4 {
  margin-top: 20px;
}
alert {
  margin-bottom: 0px;
}
.alert-danger {
  font-size: 14px;
  padding: 7px 0px 7px 10px;
  margin-bottom: 5px;
}
.btn-modul {
  font-size: 12px;
  color: #463c9c;
  border-radius: 3px;
  padding: 6px 0px 4px 0px;
  width: 140px;
  border: none;
  background-color: #ffffff;
  box-shadow: 2px 2px #7e7f7b9f;
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: #cdcdf1;
}
</style>
