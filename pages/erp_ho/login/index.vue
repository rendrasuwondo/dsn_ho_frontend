<template>
  <div class="container">
    <div class="screen">
      <div class="screen__content">
        <form class="login" @submit.prevent="login">
          <div class="login__field">
            <b-img class="dsn-logo" src="/img/dsn_logo.png" alt="logo"></b-img>
          </div>
          <div v-if="validation.message" class="mt-2 fs-valid">
            <b-alert show variant="danger">
              {{ validation.message }}
            </b-alert>
          </div>
          <div class="login__field">
            <i class="login__icon fas fa-user"></i>
            <input
              type="text"
              v-model="user.user_name"
              :class="{ 'is-invalid': validation.user_name }"
              class="login__input"
              placeholder="User name"
              autofocus
              ref="user_name"
            />
          </div>
          <div v-if="validation.user_name" class="">
            <b-alert show variant="danger">{{
              validation.user_name[0]
            }}</b-alert>
          </div>
          <div class="login__field">
            <i class="login__icon fas fa-lock"></i>
            <input
              type="password"
              v-model="user.password"
              :class="{ 'is-invalid': validation.password }"
              class="login__input"
              placeholder="Password"
            />
          </div>
          <div v-if="validation.password" class="">
            <b-alert show variant="danger">{{
              validation.password[0]
            }}</b-alert>
          </div>
          <button class="button login__submit" type="submit">
            <span class="button__text">Log In Now</span>
            <i class="button__icon fas fa-chevron-right"></i>
          </button>
        </form>
        <div class="social-login">
          <h4><b>ERP - HO</b></h4>
          <div class="social-icons">
            Enterprise Resource Planning <br />
            Head Office
          </div>
        </div>
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
  //layout
  layout: 'auth',

  //meta
  head() {
    return {
      title: 'Login - ERP-HO',
    }
  },

  data() {
    return {
      //state user
      user: {
        user_name: '',
        password: '',
      },
      //validation
      validation: [],
    }
  },

  mounted() {
    this.$refs.user_name.focus()
  },

  methods: {
    async login() {
      await this.$auth
        .loginWith('local', {
          data: {
            user_name: this.user.user_name,
            password: this.user.password,
          },
        })

        .then(() => {
          //remove cookies
          this.$cookies.removeAll()
          //profile
          this.$axios.get('/api/admin/profile').then((response) => {
            response.data.data.forEach((dt) => {
              this.$cookies.set('department_code', dt.department_code, {})
              this.$cookies.set('company_code', dt.company_code, {})
              this.$cookies.set('activity_group_id', dt.activity_group_id, {})
              this.$cookies.set(
                'activity_group_code',
                dt.activity_group_code,
                {}
              )
            })
          })

          //redirect
          this.$router.push({
            name: 'erp_ho-main-dashboard',
          })
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

.login {
  width: 320px;
  padding: 30px;
  padding-top: 35px;
}

.login__field {
  padding: 17px 0px;
  position: relative;
}

.login__icon {
  position: absolute;
  top: 30px;
  color: #7875b5;
}

.login__input {
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

.login__input:active,
.login__input:focus,
.login__input:hover {
  outline: none;
  border-bottom-color: #6a679e;
}

.login__submit {
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

.login__submit:active,
.login__submit:focus,
.login__submit:hover {
  border-color: #6a679e;
  outline: none;
}

.button__icon {
  font-size: 24px;
  margin-left: auto;
  color: #7875b5;
}

.social-login {
  position: absolute;
  height: 130px;
  width: 160px;
  text-align: center;
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

.social-login__icon {
  padding: 20px 10px;
  color: #fff;
  text-decoration: none;
  text-shadow: 0px 0px 8px #7875b5;
}

.social-login__icon:hover {
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
</style>
