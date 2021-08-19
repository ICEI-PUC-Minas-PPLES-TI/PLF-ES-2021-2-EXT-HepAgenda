<template>
  <div class="login">
    <div class="login-container">
      <div class="login-box">
        <span class="login-title">
          <h3>AGENDA</h3>
          <h4>HEPATITES</h4>
        </span>
        <v-text-field label="LOGIN" />
        <v-text-field label="SENHA" />
        <input v-model="text" type="text" name="" id="">
        {{ text }}
        <v-btn block color="#000" style="color: #fff">
          Acessar
        </v-btn>
        <v-checkbox
          v-model="checkValue"
          label="LEMBRAR SENHA"
        ></v-checkbox>
      </div>
      <span class="login-forget">Esqueci a Senha</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkValue: false,
      text: ''
    }
  },
  async asyncData({ $axios }) {}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Paytone+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap');
*{
  font-family: 'Paytone One', sans-serif;
}
.login {
  position: absolute;
  top: 0;
  left: 0;
  background: #000;
  height: 100vh;
  width: 100%;
}
.login-container{
  display: block;
  width: 400px;
  margin: 10% auto;
}
.login-box{
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.login-title{
  display: block;
  width: 50%;
  margin: 0 auto;
}

.login-box h3{
  font-size: 2.5rem;
  text-align: center;
}
.login-box h4{
  text-align: right;
}
.login-forget{
  font-family: 'Roboto', sans-serif;
  color: #fff;
  text-align: center;
  display: block;
  text-transform: uppercase;
  text-decoration: underline;
}
</style>
