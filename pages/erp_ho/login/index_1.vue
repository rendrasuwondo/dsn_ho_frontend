<template>
  <div>
    <div class="card card-outline">
      <b-row>
        <b-col class="form-layout">
          <div class="text-center">
            <div class="title-2">
              WELCOME <br />
              <i>
                i - Plant <br />
                Integration of Information in Plantation Managemen
              </i>
            </div>
          </div>
        </b-col>
        <b-col class="form-login">
          <div class="card-body">
            <div class="title-3">
              <center>LOGIN</center>
            </div>
            <div v-if="validation.message" class="mt-2">
              <b-alert show variant="danger">{{ validation.message }}</b-alert>
            </div>
            <form @submit.prevent="login">
              <div c ass="form-group">
                <label class="font-weight-bold text-uppercase text-size"
                  ><i class="fas fa-user-alt"></i> User</label
                >
                <input
                  type="text"
                  v-model="user.user_name"
                  :class="{ 'is-invalid': validation.user_name }"
                  class="form-control form-content"
                  placeholder="Masukkan User Name"
                  autofocus
                  ref="user_name"
                />
                <div class="form-border"></div>
              </div>
              <div v-if="validation.user_name" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.user_name[0]
                }}</b-alert>
              </div>

              <div class="form-group">
                <label class="font-weight-bold text-uppercase text-size"
                  ><i class="fas fa-lock"></i> Password</label
                >
                <input
                  type="password"
                  v-model="user.password"
                  :class="{ 'is-invalid': validation.password }"
                  class="form-control form-content"
                  placeholder="Masukkan Password"
                />

                <div class="form-border"></div>
              </div>
              <div v-if="validation.password" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.password[0]
                }}</b-alert>
              </div>

              <center>
                <button type="submit" class="btn btn-block submit-btn">
                  LOGIN
                </button>
              </center>
            </form>
          </div></b-col
        >
      </b-row>
      <!-- /.card-body -->
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
      title: 'Login - ERP-WHU',
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
            name: 'erp_ho-admin-dashboard',
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
.form-login {
  background-image: url('/img/1.jpg');
  /* background-color: #cccccc; */
  background-repeat: no-repeat;
  background-size: cover;
  height: 360px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
  opacity: 0.9;
}
/* .card {
  padding: 10px 15px 5px 15px;
} */
.submit-btn {
  background: #0385ca;
  border-radius: 21px;
  box-shadow: 0px 5px 5px #a8adb1;
  cursor: pointer;
  color: white;
  transition: 0.25s;
  border: none;
  left: 50%;
  margin-top: 25px;
  margin-bottom: 5px;
  width: 50%;
  font-weight: 600;
}
.submit-btn:hover {
  font-weight: 600;
  color: white;
  box-shadow: 0px 1px 12px #a8adb1;
  background: linear-gradient(#000046, #1cb5e0);
}
.form-border {
  background: linear-gradient(#000046, #1cb5e0);
  height: 1px;
  width: 100%;
  margin-bottom: 10px;
}
.form-content {
  border: none;
  outline: none;
  font-size: 14px;
}
.text-size {
  font-size: 14px;
  margin-top: 5px;
}
.title-1 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 3px 2px 1px #bdc3c7;
}
.title-2 {
  margin-top: 5px;
  margin-bottom: 5px;
}

.card {
  height: 100%;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.495);
  border-radius: 5px;
}

.title-3 {
  font-weight: bold;
  font-size: 25px;
}
.form-layout {
  display: flex;
  align-items: center;
}
</style>
