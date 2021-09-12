<template>
    <v-container>
    <v-row>
      <v-col :md="10" :offset-md="1" class="consulta-container">
        <v-btn color="primary" large @click="modalCreateAtivo = !modalCreateAtivo">
          Marcar Consulta
        </v-btn>
        <modalCreateConsulta v-model="modalCreateAtivo" />
      </v-col>
    </v-row>
    <v-row>
      <v-col :md="10" :offset-md="1" class="consulta-container">
        <v-btn color="primary" large @click="modalEditAtivo = !modalEditAtivo">
          Editar Consulta
        </v-btn>
        <modalEditConsulta v-model="modalEditAtivo" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import modalCreateConsulta from '@/components/consulta/modalCreate.vue'
import modalEditConsulta from '@/components/consulta/modalEdit.vue'

export default {
  layout: 'main',
  components: {
    modalCreateConsulta,
    modalEditConsulta
  },
  data(){
    return {
      modalCreateAtivo: false,
      modalEditAtivo: false,
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