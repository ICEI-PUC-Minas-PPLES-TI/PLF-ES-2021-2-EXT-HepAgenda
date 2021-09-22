<template>
  <v-container>
    <v-row>
      <v-col :md="10" :offset-md="1" class="paciente-container">
        <v-btn color="primary" large @click="modalAtivo = !modalAtivo">
          Adicionar Paciente
        </v-btn>
        <modalPaciente v-model="modalAtivo" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import modalPaciente from '@/components/paciente/modal.vue'
export default {
  layout: 'main',
  components: {
    modalPaciente
  },
  data(){
    return {
      modalAtivo: false
    }
  }
}
</script>

<style>
  .paciente-container{
    margin-top: 20px;
    border-radius: 10px;
    background: #fff;
  }
</style>