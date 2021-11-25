<template>
  <v-container>
    <v-row>
      <v-col cols="12" :md="6" offset-md="3">
        <v-card>
          <v-tabs
            v-model="tabValue"
            align-with-title
            fixed-tabs
          >
            <v-tab>SEMANA</v-tab>
            <v-tab>DIA</v-tab>
            <!-- Conteudo aba SEMANA -->
            <v-tab-item class="databloqueio-semana">
              <ul class="databloqueio-semana-lista">
                <li>
                  <h3>
                    Gerenciamento por dia de semana
                  </h3>
                  <span>
                    Marque os dias da semana bloqueados de agendamentos.
                  </span>
                </li>
                <li>
                  <label>
                    Domingo
                    <v-checkbox
                      v-model="dia_semanaBloqueio"
                      :value="0"
                      class="databloqueio-semana-lista-check"
                      @click.native="$event.preventDefault()"
                    />
                  </label>
                </li>
                <li>
                  <label>
                    Segunda-feira
                    <v-checkbox
                      v-model="dia_semanaBloqueio"
                      :value="1"
                      class="databloqueio-semana-lista-check"
                      @click.native="$event.preventDefault()"
                    />
                  </label>
                </li>
                <li>
                  <label>
                    Terça-feira
                    <v-checkbox
                      v-model="dia_semanaBloqueio"
                      :value="2"
                      class="databloqueio-semana-lista-check"
                      @click.native="$event.preventDefault()"
                    />
                  </label>
                </li>
                <li>
                  <label>
                    Quarta-feira
                    <v-checkbox
                      v-model="dia_semanaBloqueio"
                      :value="3"
                      class="databloqueio-semana-lista-check"
                      @click.native="$event.preventDefault()"
                    />
                  </label>
                </li>
                <li>
                  <label>
                    Quinta-feira
                    <v-checkbox
                      v-model="dia_semanaBloqueio"
                      :value="4"
                      class="databloqueio-semana-lista-check"
                      @click.native="$event.preventDefault()"
                    />
                  </label>
                </li>
                <li>
                  <label>
                    Sexta-feira
                    <v-checkbox
                      v-model="dia_semanaBloqueio"
                      :value="5"
                      class="databloqueio-semana-lista-check"
                      @click.native="$event.preventDefault()"
                    />
                  </label>
                </li>
                <li>
                  <label>
                    Sábado
                    <v-checkbox
                      v-model="dia_semanaBloqueio"
                      :value="6"
                      class="databloqueio-semana-lista-check"
                      @click.native="$event.preventDefault()"
                    />
                  </label>
                </li>
              </ul>
              <br>
              <v-row>
                <v-col :cols="12" :md="10" :offset-md="1">
                  <v-btn block color="primary" @click="mudaBloqueioSemana">
                    MARCAR DIAS DA SEMANA
                  </v-btn>
                </v-col>
              </v-row>
              <br>
            </v-tab-item>
            <v-tab-item class="databloqueio-dia">
              <span class="databloqueio-dia-titulo">
                <h3>
                  Gerenciamento diário
                </h3>
                <span>
                  Marque o dia do mês  que deseja bloquear o agendamento.
                </span>
              </span>
              <br><br>
              <v-row>
                <v-col>
                  <v-menu
                    v-model="menuDia"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dataDiaBloqueio"
                        outlined
                        hide-details="auto"
                        label="Bloquear Dia"
                        type="date"
                        :min="new Date().toISOString().split('T')[0]"
                        max="2050-06-30"
                        @change="mudaDiaSelecionado"
                      >
                        <span slot="append">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-calendar
                          </v-icon>
                        </span>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dataDiaBloqueio"
                      :allowed-dates="datasPermitidas"
                      @input="menuDia = false;mudaDiaSelecionado()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <br>
              <v-row>
                <v-col>
                  <v-btn block color="primary" @click="bloqueiaDia">
                    BlOQUEAR DATA
                  </v-btn>
                </v-col>
              </v-row>
              <br>
              <hr>
              <v-row>
                <v-col v-if="diasBloqueados && diasBloqueados.length == 0" class="databloqueio-dia-sembloqueio">
                  <img src="/img/calendario.svg" alt="Icone de Calendario" class="d-block">
                  <span class="d-block text-center">
                    Nenhuma data bloqueada no mês selecionado no momento
                  </span>
                </v-col>
                <v-col v-else>
                  <v-row>
                    <v-col>
                      <b class="d-block text-center">Datas Bloqueadas no mês {{mesAtual}}/{{anoAtual}}</b>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-for="(bloqueio, bidx) in diasBloqueados" :key="bidx" cols="12" :md="6" :sm="12" class="databloqueio-dia-cartao">
                      <div>
                        <span class="d-block">
                          <v-icon>
                            mdi-calendar
                          </v-icon>
                          {{ formataData(bloqueio.data) }}
                        </span>
                        <span>
                          Autor: {{ bloqueio.usuario.nome }}
                        </span>
                        <span class="databloqueio-dia-cartao-excluir" @click="modalIDBloqueio = bloqueio.id;modalConfirm = true">
                          <v-icon>
                            mdi-close
                          </v-icon>
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <br>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
        v-model="modalConfirm"
        persistent
        max-width="500"
      >
        <v-card>
          <v-card-title>
            Deseja realmente &nbsp;
            <span style="color: red"> remover o bloqueio </span>
            de data do sistema?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="white" x-large @click="modalConfirm = false">
              Não
            </v-btn>
            <v-btn depressed x-large color="error" @click="deleteDiaBloqueado()">
              Sim
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
export default {
  layout: "main",
  data(){
    return {
      tabValue: null,
      dia_semanaBloqueio: [],
      menuDia: false,
      dataDiaBloqueio: null,
      mesAtual: null,
      anoAtual: null,
      diasBloqueados: [],
      modalConfirm: false,
      modalIDBloqueio: null
    }
  },
  async asyncData({ params, app }) {
    let data = {
      dia_semanaBloqueio: []
    }

    await app.$axios
      .get(`/bloqueio/semana`)
      .then(res => {
        let result = res.data
        result = result.map(function(obj) {
          return obj.ativo ? obj.diasemana: null;
        })
        result = result.filter(n => n)
        data.dia_semanaBloqueio = result
      }).catch(err => {
        console.log('err', err.response)
      })

    return data
  },
  mounted(){
    const dt = new Date()
    this.mesAtual = dt.getMonth() + 1
    this.anoAtual = dt.getFullYear()
  },
  methods: {
    mudaBloqueioSemana(){
      for(let i=0; i<7;i++){
        this.$axios
          .post(`/bloqueio/semana`, {
            dia_semana: i,
            ativo: this.dia_semanaBloqueio.indexOf(i) >= 0
          })
          .catch(err => {
            this.$Message.alert(err.response.data.message,'Erro', {type: 'error', msgBody: {style: {width: '30%'}}})
          })
      }
    },
    datasPermitidas(val){
      const dt = new Date(val + ' 00:00')
      if(dt < new Date()) // Bloquear datas anteriores a atual
        return false;

      let dtb = this.diasBloqueados.filter(function(el) {
        return el.data === val
      })
      if(dtb.length > 0) // Bloquear datas que já estejam bloqueadas
        return false

      return !(this.dia_semanaBloqueio.indexOf(dt.getDay()) >= 0)
    },
    bloqueiaDia(){
      this.$axios
        .post(`/bloqueio/dia`, {
          data: this.dataDiaBloqueio,
          ativo: true
        }).then(() => {
          this.atualizaListaDias()
        }).catch(err => {
          console.log(err.response)
          this.$Message.alert(err.response.data.message,'Erro', {type: 'error', msgBody: {style: {width: '30%'}}})
        })
    },
    mudaDiaSelecionado(){
      const dt = new Date(this.dataDiaBloqueio)
      this.mesAtual = dt.getMonth() + 1
      this.anoAtual = dt.getFullYear()
    },
    formataData(data) {
      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    },
    deleteDiaBloqueado(){
      this.$axios
        .delete(`/bloqueio/dia?id=${this.modalIDBloqueio}`)
        .then(() => {
          this.atualizaListaDias()
          this.modalConfirm = false
        }).catch(err => {
          console.log(err.response)
          this.$Message.alert(err.response.data.message,'Erro', {type: 'error', msgBody: {style: {width: '30%'}}})
        })
    },
    atualizaListaDias(){
      this.$axios
        .get(`/bloqueio/dia?mes=${this.mesAtual}&ano=${this.anoAtual}`)
        .then(res => {
          this.diasBloqueados = res.data
        })
    }

  },
  watch: {
    mesAtual(){
      this.atualizaListaDias()
    }
  }
}
</script>

<style lang="scss">
  .databloqueio-semana{
    &-lista{
      margin-top: 20px;
      list-style: none;
      padding: 0;
      li{
        &:not(:first-child){
          border-bottom: 1px solid #C4C4C4;
        }
        label{
          display: block;
          position: relative;
          margin: 15px 0;
        }
      }
      &-check {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
      }
    }
  }
  .databloqueio-dia{
    margin: 20px 24px 0px 24px;
    input[type="date"]::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }
    &-sembloqueio{
      img{
        margin: 0 auto;
      }
    }
    &-cartao{
      position: relative;
      margin-top: 10px;
      border: 1px solid #555555;
      &-excluir{
        position: absolute;
        top: 25%;
        right: 5px;
        padding: 5px;
        &:hover i{
          cursor: pointer;
          color: red;
        }
      }
    }
  }
</style>
