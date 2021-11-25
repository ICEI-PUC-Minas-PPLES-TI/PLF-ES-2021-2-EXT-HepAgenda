<template>
  <div class="paciente">
    <v-row>
      <v-col cols="12" :sm="12" :md="9">
        <v-card class="paciente-container">
          <v-card-title>
            <span class="d-block" style="width: 100%;">
              <v-icon>mdi-clock-time-eight-outline</v-icon>
              Histórico do atendimento
              <client-only>
                <v-btn v-if="['A'].includes($store.getters['login/me'].tipo)" class="float-right" @click="modalCriaConsultaAtivo = true">
                  Marcar Consulta
                </v-btn>
              </client-only>
            </span>
          </v-card-title>
          <div v-for="(consulta, cidx) in consultas" :key="cidx" class="paciente-container-consultas" @click="verConsulta(consulta.id)">
            <v-row>
              <v-col :md="2">
                <span>Data: </span>
                {{ formataData(consulta.dt_inicio) }}
              </v-col>
              <v-col :md="3">
                <span>Status: </span>
                {{ formataStatus(consulta.status) }}
              </v-col>
              <v-col :md="5">
                <span>Médico: </span>
                {{ consulta.usuario_medico ? consulta.usuario_medico.nome : 'Não atribuído' }}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span>Descrição: </span>
                {{ consulta.descricao ? consulta.descricao: 'Em branco' }}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span>Detalhes: </span>
                {{ consulta.detalhes ? consulta.detalhes: 'Não detalhado' }}
              </v-col>
            </v-row>
          </div>
          <b v-if="consultas.length == 0" class="d-block text-center">
            <span v-if="listaCarregando">Carregando...</span>
            <span v-else>O paciente não tem nenhuma consulta</span>
          </b>
          <v-row v-else class="mt-5">
            <v-pagination
              v-model="listaPaginaAtual"
              :length="listaPaginas"
              style="width: 100%"
              @input="listaConsultas"
            />
          </v-row>
          <br>
        </v-card>
      </v-col>
      <v-col cols="12" :sm="12" :md="3">
        <v-card class="paciente-container">
          <v-card-title style="padding: 0">
            <small class="d-block" style="width: 100%;">
              <v-icon>mdi-account-outline</v-icon>
              Informações do Paciente
              <client-only>
                <v-icon v-if="['A','M'].includes($store.getters['login/me'].tipo)" color="primary" style="position: absolute; top:12px; right: 5px" @click="modalPacienteAtivo = true">
                  mdi-square-edit-outline
                </v-icon>
              </client-only>
            </small>
          </v-card-title>
          <section class="paciente-container-maininfo mt-3">
            <h4>Informações Básicas</h4>
            <p>
              <span>
                <v-icon>mdi-account-outline</v-icon>
                Nome:
              </span>
              {{ paciente.nome }}
            </p>
            <p>
              <span>
                <v-icon>mdi-calendar-range</v-icon>
                Data de Nascimento:
              </span>
              {{ formataData(paciente.data_nascimento) }}
            </p>
            <p>
              <span>
                <v-icon>mdi-account-outline</v-icon>
                Nome da mãe:
              </span>
              {{ paciente.nome_mae }}
            </p>
            <p>
              <span>
                <v-icon>mdi-card-account-details-outline</v-icon>
                Registro HC:
              </span>
              {{ paciente.registro_hc ? paciente.registro_hc: 'Não Definido' }}
            </p>
            <p>
              <span>
                <v-icon>mdi-gender-male-female</v-icon>
                Sexo:
              </span>
              {{ paciente.sexo == 'M' ? 'Masculino': 'Feminino' }}
            </p>
            <p>
              <span>
                <v-icon>mdi-phone-outline</v-icon>
                Telefone:
              </span>
              {{ paciente.telefone }}
            </p>
            <p>
              <span>
                <v-icon>mdi-at</v-icon>
                E-Mail:
              </span>
              {{ paciente.email ? paciente.email: 'Não Definido'}}
            </p>
            <p>
              <span>
                <v-icon>mdi-weight-kilogram</v-icon>
                Peso:
              </span>
              {{ paciente.peso ? paciente.peso + 'kg': 'Não Definido' }} {{paciente.peso_atualizacao ? `(${formataDataTempo(paciente.peso_atualizacao)})`: ''}}
            </p>
            <p>
              <span>
                <v-icon>mdi-human-male-height</v-icon>
                Altura:
              </span>
              {{ paciente.altura ? paciente.altura + 'm': 'Não Definido' }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Comorbidade:
              </span>
              {{ comorbidade }}
            </p>
          </section>
          <section v-if="paciente.hepatiteb" class="paciente-container-comorbidadeinfo mt-3">
            <h4>Hepatite B</h4>
            <p>
              <span>
                <v-icon>mdi-bottle-tonic-plus-outline</v-icon>
                Tratamento:
              </span>
              {{ paciente.hepatiteb.tratamento_id ? paciente.hepatiteb.tratamento.identificacao: 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-calendar-range</v-icon>
                Inicio do Tratamento:
              </span>
              {{ paciente.hepatiteb.inicio_tratamento ? formataData(paciente.hepatiteb.inicio_tratamento): 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Portador Inativo:
              </span>
              {{ paciente.hepatiteb.portador_inativo ? 'Sim': paciente.hepatiteb.portador_inativo == false ? 'Não': 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Cirrótico:
              </span>
              {{ paciente.hepatiteb.cirrotico ? 'Sim': paciente.hepatiteb.cirrotico == false ? 'Não': 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Fibrose:
              </span>
              {{ paciente.hepatiteb.fibrose ? paciente.hepatiteb.fibrose : 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Exame Alfafetoproteina:
              </span>
              {{ paciente.hepatiteb.ultimo_resultado_alfa ? paciente.hepatiteb.ultimo_resultado_alfa : 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-calendar-range</v-icon>
                Data Alfafetoproteina:
              </span>
              {{ paciente.hepatiteb.data_alfa ? formataData(paciente.hepatiteb.data_alfa) : 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Exame Ultrassom:
              </span>
              {{ paciente.hepatiteb.ultimo_resultado_ultra ? paciente.hepatiteb.ultimo_resultado_ultra : 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-calendar-range</v-icon>
                Data Ultrassom:
              </span>
              {{ paciente.hepatiteb.data_ultra ? formataData(paciente.hepatiteb.data_ultra) : 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Exame Carga Viral:
              </span>
              {{ paciente.hepatiteb.ultimo_resultado_carga ? paciente.hepatiteb.ultimo_resultado_carga : 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-calendar-range</v-icon>
                Data Carga Viral:
              </span>
              {{ paciente.hepatiteb.data_carga ? formataData(paciente.hepatiteb.data_carga) : 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-information-outline</v-icon>
                Exame HBeAg:
              </span>
              {{ paciente.hepatiteb.hbeag ? 'Sim': paciente.hepatiteb.hbeag == false ? 'Não': 'Não Definido'  }}
            </p>
            <p>
              <span>
                <v-icon>mdi-calendar-range</v-icon>
                Data HBeAg:
              </span>
              {{ paciente.hepatiteb.data_hbeag ? formataData(paciente.hepatiteb.data_hbeag) : 'Não Definido'  }}
            </p>
          </section>
          <template v-if="paciente.hepatitec">
            <section v-for="(hepc, hepcidx) in paciente.hepatitec" :key="hepcidx" class="paciente-container-comorbidadeinfo mt-3">
              <h4>Hepatite C</h4>
              <p>
                <span>
                  <v-icon>mdi-bottle-tonic-plus-outline</v-icon>
                  Tratamento:
                </span>
                {{ hepc.tratamento_id ? hepc.tratamento.identificacao: 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-information-outline</v-icon>
                  Tratado:
                </span>
                {{ hepc.tratado ? 'Sim': hepc.tratado == false ? 'Não': 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-information-outline</v-icon>
                  Cirrótico:
                </span>
                {{ hepc.cirrotico ? 'Sim': hepc.cirrotico == false ? 'Não': 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-information-outline</v-icon>
                  Fibrose:
                </span>
                {{ hepc.fibrose ? hepc.fibrose : 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-information-outline</v-icon>
                  Exame Alfafetoproteina:
                </span>
                {{ hepc.ultimo_resultado_alfa ? hepc.ultimo_resultado_alfa : 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-calendar-range</v-icon>
                  Data Alfafetoproteina:
                </span>
                {{ hepc.data_alfa ? formataData(hepc.data_alfa) : 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-information-outline</v-icon>
                  Exame Ultrassom:
                </span>
                {{ hepc.ultimo_resultado_ultra ? hepc.ultimo_resultado_ultra : 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-calendar-range</v-icon>
                  Data Ultrassom:
                </span>
                {{ hepc.data_ultra ? formataData(hepc.data_ultra) : 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-information-outline</v-icon>
                  Exame Carga Viral:
                </span>
                {{ hepc.ultimo_resultado_carga ? hepc.ultimo_resultado_carga : 'Não Definido'  }}
              </p>
              <p>
                <span>
                  <v-icon>mdi-calendar-range</v-icon>
                  Data Carga Viral:
                </span>
                {{ hepc.data_carga ? formataData(hepc.data_carga) : 'Não Definido'  }}
              </p>
            </section>
          </template>
        </v-card>
      </v-col>
      <client-only>
        <modalPaciente v-if="['A','M'].includes($store.getters['login/me'].tipo)" v-model="modalPacienteAtivo" :pacienteId="paciente.id" @listaPacientes="recarregaPaciente" />
        <modalCreateConsulta v-if="['A'].includes($store.getters['login/me'].tipo)" v-model="modalCriaConsultaAtivo" :paciente="{id: paciente.id, nome: paciente.nome}" @criado="listaPaginaAtual=1;listaConsultas()" />
        <modalEditConsulta v-model="modalEditaConsultaAtivo" :consultaId="consultaId" />
      </client-only>
    </v-row>
  </div>
</template>

<script>
import modalPaciente from "@/components/paciente/modal.vue";
import modalCreateConsulta from '@/components/consulta/modalCreate.vue'
import modalEditConsulta from '@/components/consulta/modalEdit.vue'
export default {
  layout: "main",
  components: {
    modalPaciente,
    modalCreateConsulta,
    modalEditConsulta
  },
  data(){
    return {
      paciente: null,
      consultas: [],
      listaCarregando: false,
      listaPaginaAtual: 1,
      listaPaginas: 1,
      modalPacienteAtivo: false,
      modalCriaConsultaAtivo: false,
      modalEditaConsultaAtivo: false,
      consultaId: null
    }
  },
  async asyncData({ params, app, error }) {
    let data = {
      paciente: null,
      consultas: [],
      listaPaginas: 1
    }

    await app.$axios
      .get(`/paciente/`+params.id)
      .then(res => {
        data.paciente = res.data
      }).catch(err => {
        console.log('err', err.response)
        error("Paciente não encontrado")
      })

    await app.$axios
      .get(`/consulta?limite=5&ordem=DESC&paciente_id=${params.id}`)
      .then(res => {
        data.consultas = res.data.dados
        data.listaPaginas = res.data.paginas
      }).catch(err => {
        console.log('err', err.response)
      })

    return data
  },
  computed: {
    comorbidade(){
      if(this.paciente) {
        switch(this.paciente.comorbidade){
          case 'HEPB':
            return 'Hepatite B'
          case 'HEPC':
            return 'Hepatite C'
          case 'HEPBC':
            return 'Hepatite B e Hepatite C'
          case 'OUTRO':
            return 'Outro'
          case null:
            return 'Não definido'
        }
      }
    }
  },
  methods: {
    listaConsultas(){
      this.listaCarregando = true
      this.consultas = []
      this.$axios
        .get(`/consulta?limite=5&ordem=DESC&paciente_id=${this.$route.params.id}&pagina=${this.listaPaginaAtual}`)
        .then(res => {
          this.consultas = res.data.dados
          this.listaPaginas = res.data.paginas
        }).catch(err => {
          console.log('err', err.response)
        }).finally(() => {
          this.listaCarregando = false
        })
    },
    recarregaPaciente(){
      this.$axios
        .get(`/paciente/`+this.paciente.id)
        .then(res => {
          this.paciente = res.data
        }).catch(err => {
          console.log('err', err.response)
        })
    },
    formataData(data) {
      let dArr = data.split("-"); // ex input "2010-01-18"
      return dArr[2] + "/" + dArr[1] + "/" + dArr[0]; //ex out: "18/01/10"
    },
    formataDataTempo(data) {
      let dArr = new Date(data)
      return dArr.toLocaleDateString()
    },
    formataStatus(status){
      switch(status){
        case 'AGUARDANDOA':
          return 'Aguardando Consulta'
        case 'AGUARDANDOC':
          return 'Em Confirmação'
        case 'REALIZADO':
          return 'Realizado'
        case 'CANCELADO':
          return 'Cancelado'
        default:
          return 'Erro'
      }
    },
    verConsulta(id){
      this.consultaId = id
      this.modalEditaConsultaAtivo = true
    }
  }
}
</script>

<style lang="scss">
  .paciente{
    padding: 0 20px;
    &-container{
      padding: 10px 20px;
      &-maininfo, &-comorbidadeinfo{
        p {
          margin: 3px 0;
          border-bottom: 1px solid #eee;
          span{
            font-size: .8rem;
            color: #333;
            font-weight: bold;
            display: block;
            i{
              font-size: 1.2rem !important;
            }
          }
        }
      }
      &-consultas{
        border: 1px solid #888;
        border-radius: 8px;
        padding: 20px;
        margin: 10px 0;
        span{
          font-size: .8rem;
          color: #333;
          font-weight: bold;
          display: block;
        }
        &:hover{
          background: #eee;
          cursor: pointer;
        }
      }
    }
  }
  .div-titulo-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between !important;
  }
</style>