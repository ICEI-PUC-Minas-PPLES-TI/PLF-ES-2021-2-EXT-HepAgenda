<template>
    <v-container>
    <v-row>
      <v-col :md="10" :offset-md="1" class="consulta-container">
        <v-btn color="primary" large @click="modalAtivo = !modalAtivo">
          Marcar Consulta
        </v-btn>
        <modalCreateConsulta v-model="modalAtivo" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import modalCreateConsulta from '@/components/consulta/modalCreate.vue'
export default {
  layout: 'main',
  components: {
    modalCreateConsulta
  },
  data(){
    return {
      modalAtivo: false
    }
  }
}
</script>

<style>
  .consulta-container{
    margin-top: 20px;
    border-radius: 10px;
    background: #fff;
  }
</style>