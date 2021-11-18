<template>
  <!--Container-->
  <v-container fluid style="overflow: auto; padding:6vh;">
    <v-card class="mx-auto pa-5 mt-3" width="100%">
      <div class="div-titulo-btn">
        <v-card-title>
          <span class="text-h6">Tratamentos</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
            class="mr-2"
            color="primary"
            background="primary"
            @click="abreModal(0)"
          >
            Adicionar tratamento
          </v-btn>
          <modal v-model="modalAtivo" v-bind:tratamentoId="tratamentoId" />
        </v-card-actions>
      </div>
      <!-- Filtro Simples -->
      <v-card-text class="text-h5">
        <template>
          <v-data-table
            class="tratamento-table"
            v-if="tratamentos && tratamentos.length > 0"
            :headers="headers"
            :items="tratamentos"
            :loading="tabelaCarregando"
            :items-per-page="10"
            :disable-sort="true"
            :footer-props="{
              'disable-items-per-page': true,
              'disable-pagination': true,
              'items-per-page-options': [25]
            }"
          >
            <template v-slot:item.direcionado= "{ item }">
              {{item.direcionado == "HEPB" ? "Hepatite B":  "Hepatite C"}}
            </template>
            <template v-slot:item.ativo="{ item }">
              <v-switch 
                v-if=" item.ativo==0 "
                color="primary"
                inset
                v-model="item.ativo"
                @change="ativaTratamento(item.id)"
              ></v-switch>
              <v-switch 
                v-if=" item.ativo==1 "
                color="primary"
                inset
                v-model="item.ativo"
                @change="desativaTratamento(item.id)"
              ></v-switch>
            </template>
            <template v-slot:item.actions="{ item }">
            
              <v-icon color="primary" class="mr-2" @click="abreModal(item.id)">
                mdi-square-edit-outline
              </v-icon>

            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">
                Reset
              </v-btn>
            </template>
          </v-data-table>
          <span class="d-block text-center" v-else>Nenhum Registro Encontrado</span>
          <br>
          <span class="text-muted text-right d-block" id="tratamento-totalItems">
            Total de Items: {{ totalItems }}
          </span>
          <br>
          <v-pagination
            v-model="tabelaPaginaAtual"
            :length="tabelaPaginas"
            @input="listaTratamentos"
          />
        </template>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="toast" shaped>
      {{ toastMensagem }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="toast = false">
          Ok
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script src="./index.js"></script>

<style lang="scss">
.div-titulo-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between !important;
}

.tratamento-table{
  .v-data-footer{
    display: none;
  }
}

#tratamento-totalItems {
    font-size: 0.6em;
}

</style>

<script>
import modal from '@/components/tratamento/modal.vue'
export default {
  layout: "main",
  components: {
    modal,
  },

  data() {
    return {
      headers: [
        { text: 'Identificação', value: 'identificacao' },
        { text: 'Direcionamento', value: 'direcionado' },
        { text: 'Ativo', value: 'ativo' },
        { text: 'Ação', value: 'actions', sortable: false },
      ],
      tratamentos: [
        {
          id: '',
          identificacao: '',
          direcionado:'',
          ativo: false,
        },
      ],

      tratamentoId: 0,
      toast: false,
      toastMensagem: '',
      modalAtivo: false,
      dialog: false,

      totalItems: 0,
      tabelaPaginaAtual: 1,
      tabelaPaginas: 1,
      tabelaCarregando: false
    }
  },
  watch:{
    modalAtivo: function (value){
      if(value == false){
       this.listaTratamentos();
      }
    },

  },
  mounted() {
   this.listaTratamentos();
  },
  methods: {

    listaTratamentos() {
      this.tabelaCarregando = true;

      this.$axios.$get(`/tratamento?pagina=${this.tabelaPaginaAtual}`).then(response => {

          this.tratamentos = response.dados;      
          this.tabelaPaginas = response.paginas
          this.totalItems = response.total

      }).catch(error => {
        console.log(error)
      }).finally(() =>{
        this.tabelaCarregando = false
      })

    },

    abreModal(id){
      if(id){
        this.modalAtivo = !this.modalAtivo;
        this.tratamentoId = id;
      }else{
        this.modalAtivo = !this.modalAtivo;
        this.tratamentoId = 0;
      }
    },



    desativaTratamento(id){
      this.$axios.$delete('/tratamento/' + id).then(response => {
        this.abreToast('Tratamento desativado com sucesso!');
        this.listaTratamentos();
      }).catch(error => {
              console.log("Erro:");
        console.error(error)
      })
    },

    ativaTratamento(id){
      let tratamento = { ativo: 1 };
      this.$axios.$put('/tratamento/' + id,tratamento).then(response => {
        this.abreToast('Tratamento ativado com sucesso!');
        this.listaTratamentos()
        }).catch(error => {
          console.log("Erro:");
        console.error(error)
      })
    },

    abreToast(mensagem) {
      this.toastMensagem = mensagem;
      this.toast = true;
    },

  }

}

</script>