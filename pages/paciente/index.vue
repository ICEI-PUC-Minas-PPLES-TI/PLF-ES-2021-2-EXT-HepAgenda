<template>
  <v-container fluid style="overflow: auto; padding: 5vh">
    <modalPaciente v-model="modalAtivo" v-bind:pacienteId="pacienteId" />

    <v-card class="mx-auto pa-5 mt-3" width="100%">
      <div class="div-titulo-btn">
        <v-card-title>
          <span class="text-h6">Pacientes</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
            color="primary"
            background="primary"
            class="div-titulo-btn"
            @click="abreModal(0)"
          >
            Adicionar Paciente
          </v-btn>
        </v-card-actions>
      </div>
      <v-card-text>
        <!-- Filtro Profundo -->
        <ul v-if="tipoFiltro == 1" class="paciente-filtro">
          <li>
            <v-icon @click="tipoFiltro = 0">mdi-arrow-left</v-icon>
            <v-icon>mdi-filter-outline</v-icon>
            Filtros
          </li>
          <span v-for="(fsitem, fsindex) in filtrosSelecionados" :key="fsindex">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <li v-if="fsindex > 0" v-bind="attrs" v-on="on">
                  {{filtroOperador == 'AND'? 'e':'ou'}}
                </li>
              </template>
              <v-list>
                <v-list-item  @click="filtroOperador = 'AND';listaPacientes()">
                  <v-list-item-title>E</v-list-item-title>
                </v-list-item>
                <v-list-item @click="filtroOperador = 'OR';listaPacientes()">
                  <v-list-item-title>OU</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <li class="paciente-filtro-item">
              {{ `${fsitem.label} ${fsitem.comparador != 'NAOEXISTE' ? fsitem.comparador.toLowerCase(): 'não possui valor'} ${fsitem.valor?fsitem.valor:''}`  }}
              <v-icon class="paciente-filtro-item-icon" @click="filtrosSelecionados.splice(fsindex, 1);listaPacientes()" color="red">
                mdi-close-box
              </v-icon>
            </li>
          </span>
          <v-menu
            top
            :close-on-content-click="false"
            v-model="filtroMenuAtivo"
          >
            <template v-slot:activator="{ on, attrs }">
              <li v-bind="attrs" v-on="on" class="paciente-filtro-add">
                Adicionar
                <v-icon>
                  mdi-plus-circle-outline
                </v-icon>
              </li>
            </template>
            <div>
              <v-list v-if="filtroStep == 1" dense>
                <v-list-item
                  v-for="(fil, index) in filtros"
                  :key="index"
                  @click="selecionaFiltro(fil)"
                >
                  <v-list-item-icon>
                    <v-icon v-if="fil.type == 'text'">mdi-format-color-text</v-icon>
                    <v-icon v-else-if="fil.type == 'number'">mdi-numeric</v-icon>
                    <v-icon v-else-if="fil.type == 'date'">mdi-calendar-range</v-icon>
                    <v-icon v-else-if="fil.type == 'enum'">mdi-ab-testing</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ fil.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-list v-if="filtroStep == 2">
                <v-list-item>
                  <v-list-item-title>
                    <v-radio-group v-model="filtroComparador" @change="filtroValor = null">
                      <v-radio label="Igual á" value="IGUAL" />
                      <v-text-field v-if="filtroComparador == 'IGUAL' && filtroMarcando.type != 'enum'" :type="filtroMarcando.type" v-model="filtroValor" outlined/>
                      <v-select
                        v-if="filtroMarcando.type == 'enum' && filtroComparador == 'IGUAL'"
                        v-model="filtroValor"
                        :items="filtroMarcando.values"
                        label="Selecione"
                        outlined
                      />
                      <v-radio v-if="filtroMarcando.type == 'text'" label="Começa com" value="COMECA" />
                      <v-text-field v-if="filtroComparador == 'COMECA'" v-model="filtroValor" outlined/>
                      <v-radio v-if="filtroMarcando.type == 'text'" label="Termina com" value="TERMINA" />
                      <v-text-field v-if="filtroComparador == 'TERMINA'" v-model="filtroValor" outlined/>
                      <v-radio v-if="filtroMarcando.type == 'text'" label="Contém" value="CONTEM" />
                      <v-text-field v-if="filtroComparador == 'CONTEM'" v-model="filtroValor" outlined/>
                      <v-radio v-if="['number','date'].includes(filtroMarcando.type)" :label="filtroMarcando.type == 'number' ? 'Maior que':'Depois de'" value="MAIOR" />
                      <v-text-field v-if="filtroComparador == 'MAIOR' && filtroMarcando.type == 'number'" type="number" v-model="filtroValor" outlined/>
                      <v-text-field v-if="filtroComparador == 'MAIOR' && filtroMarcando.type == 'date'" type="date" v-model="filtroValor" outlined/>
                      <v-radio v-if="['number','date'].includes(filtroMarcando.type)" :label="filtroMarcando.type == 'number' ? 'Menor que':'Antes de'" value="MENOR" />
                      <v-text-field v-if="filtroComparador == 'MENOR' && filtroMarcando.type == 'number'" type="number" v-model="filtroValor" outlined/>
                      <v-text-field v-if="filtroComparador == 'MENOR' && filtroMarcando.type == 'date'" type="date" v-model="filtroValor" outlined/>
                      <v-radio label="Possui Valor" value="EXISTE" />
                      <v-radio label="Não está definido" value="NAOEXISTE" />
                    </v-radio-group>
                    <v-row>
                      <v-col>
                        <v-btn @click="filtroComparador=null;filtroStep = 1">
                          Voltar
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn color="accent" @click="adicionarFiltro">
                          Filtrar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-menu>
        </ul>
        <!-- Filtro Simples -->
        <v-text-field
          v-if="tipoFiltro == 0"
          v-model="pesquisa"
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-filter-plus-outline"
          label="Nome do Paciente, mãe ou registro HC"
          filled
          rounded
          dense
          @click:append="tipoFiltro = 1"
        ></v-text-field>
        <br>
        <template>
          <v-data-table
            v-if="pacientes && pacientes.length > 0"
            :headers="headers"
            :items="pacientes"
            :items-per-page="30"
            :loading="tabelaCarregando"
            :disable-sort="true"
            :footer-props="{
              'disable-items-per-page': true,
              'disable-pagination': true,
              'items-per-page-options': [50]
            }"
            class="elevation-1 paciente-table"
          >
            <template v-slot:item.data_nascimento="{ item }">
              {{ formataData(item.data_nascimento) }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon color="primary" class="mr-2" @click="abreModal(item.id)">
                mdi-square-edit-outline
              </v-icon>
              <v-icon
                color="primary"
                class="mr-2"
                @click="abreModalConfirm(item.id)"
              >
                mdi-trash-can-outline
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
          </v-data-table>
          <span class="d-block text-center" v-else>Nenhum Registro Encontrado</span>
          <br>
          <span class="text-muted text-right d-block">
            Total de Items: {{ totalItems }}
          </span>
          <br>
          <v-pagination
            v-model="tabelaPaginaAtual"
            :length="tabelaPaginas"
            @input="listaPacientes"
          />
        </template>
      </v-card-text>

      <v-dialog
        class="modal-delete-cofirm"
        v-model="modalConfirm"
        persistent
        max-width="500"
      >
        <v-card>
          <v-card-title>
            Deseja realmente &nbsp;
            <span style="color: red"> desativar o paciente </span>

            do sistema?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="white" x-large @click="modalConfirm = false">
              Não
            </v-btn>
            <v-btn depressed x-large color="error" @click="deletePaciente()">
              Sim
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
import modalPaciente from "@/components/paciente/modal.vue";
import filtroPaciente from "@/assets/js/filtroPaciente.js";

export default {
  layout: "main",
  components: {
    modalPaciente,
  },
  data() {
    return {
      headers: [
        { text: "PACIENTE", value: "nome" },
        { text: "MÃE", value: "nome_mae" },
        { text: "NASCIMENTO", value: "data_nascimento" },
        { text: "ÚLTIMA CONSULTA", value: "ultima_consulta" },
        { text: "AÇÕES", value: "actions", sortable: false },
      ],
      pacientes: [
        {
          id: "",
          nome: "",
          data_nascimento: "",
          ultima_consulta: "",
          nome_mae: "",
        },
      ],
      tabelaCarregando: false,
      tabelaPaginaAtual: 1,
      tabelaPaginas: 1,
      totalItems: 1,
      tipoFiltro: 0,
      filtros: filtroPaciente,
      filtrosSelecionados: [],
      filtroStep: 1,
      filtroMarcando: null,
      filtroComparador: null,
      filtroValor: null,
      filtroOperador: 'AND',
      filtroMenuAtivo: false,
      pesquisa: "",

      pacienteId: 0,
      modalAtivo: false,
      modalConfirm: false,
    };
  },
  mounted() {
    this.listaPacientes();
    console.log(filtroPaciente)
  },
  methods: {
    listaPacientes() {
      this.tabelaCarregando = true
      if(this.tipoFiltro == 0) {
        this.$axios
          .$get(`/paciente?pagina=${this.tabelaPaginaAtual}`)
          .then((response) => {
            this.pacientes = response.dados;
            this.tabelaPaginas = response.paginas
            this.totalItems = response.registros
          })
          .catch((error) => {
            console.log(error);
          }).finally(() => {
            this.tabelaCarregando = false
          });
      } else if(this.tipoFiltro == 1) {
        if(this.filtrosSelecionados.length <= 1)
          this.filtroOperador = 'AND'
        this.$axios
          .$post(`/paciente/pesquisa?pagina=${this.tabelaPaginaAtual}`, {
            campos: this.filtrosSelecionados,
            operador: this.filtroOperador
          })
          .then((response) => {
            this.pacientes = response.dados;
            this.tabelaPaginas = response.paginas
            this.totalItems = response.registros
          })
          .catch((error) => {
            console.log(error);
          }).finally(() => {
            this.tabelaCarregando = false
          });;
      }
    },
    abreModal(id) {
      this.pacienteId = id;

      this.modalAtivo = !this.modalAtivo;
    },
    deletePaciente() {
      console.log(this.pacienteId);
      this.pacienteId = 0;
    },
    abreModalConfirm(id) {
      this.pacienteId = id;
      this.modalConfirm = !this.modalConfirm;
    },
    formataData(data) {
      let dArr = data.split("-"); // ex input "2010-01-18"
      return dArr[2] + "/" + dArr[1] + "/" + dArr[0]; //ex out: "18/01/10"
    },
    selecionaFiltro(filtro){
      this.filtroStep = 2
      this.filtroMarcando = filtro
    },
    adicionarFiltro(){
      this.filtrosSelecionados.push({
        label: this.filtroMarcando.label,
        campo: this.filtroMarcando.field,
        comparador: this.filtroComparador,
        valor: this.filtroValor,
      })
      this.filtroValor = null
      this.filtroMarcando = null
      this.filtroStep = 1
      this.filtroMenuAtivo = false
      this.listaPacientes()
    }
  },
};
</script>

<style lang="scss">
.paciente-container {
  margin-top: 20px;
  border-radius: 10px;
  background: #fff;
}

.div-titulo-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between !important;
}
.paciente-table{
  .v-data-footer{
    display: none;
  }
}
.paciente-filtro{
  list-style: none;
  padding-left: 0 !important;
  & li {
    border: 1px solid #ccc;
    padding: 5px 20px;
    display: inline;
  }
  &-add{
    border: 1px solid #333 !important;
    color: #333;
    cursor: pointer;
    border-radius: 0 20px 20px 0;
  }
  &-item{
    &-icon{
      visibility: hidden;
    }
    &:hover{
      .paciente-filtro-item-icon{
        visibility: visible;
      }
    }
  }
  span{
    margin-bottom: 10px;
    display: inline-block;
  }
}
</style>
