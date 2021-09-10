<template>
  <v-dialog
    v-model="value"
    transition="dialog-bottom-transition"
    class="paciente-modal"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <v-card-title class="text-h5 paciente-modal-title">
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.25788 26C2.25309 25.9998 2.24166 25.9994 2.22457 25.9981C2.18963 25.9957 2.13319 25.9902 2.06284 25.9785C1.91739 25.9542 1.73875 25.9076 1.57221 25.8243C1.40959 25.743 1.27739 25.6368 1.18361 25.4961C1.09401 25.3617 1 25.1375 1 24.75C1 23.8818 1.46304 21.8887 3.23836 20.1134C4.98436 18.3673 8.08589 16.75 13.5 16.75C18.9141 16.75 22.0156 18.3673 23.7616 20.1134C25.537 21.8887 26 23.8818 26 24.75C26 25.1375 25.906 25.3617 25.8164 25.4961C25.7226 25.6368 25.5904 25.743 25.4278 25.8243C25.2613 25.9076 25.0826 25.9542 24.9372 25.9785C24.8668 25.9902 24.8104 25.9957 24.7754 25.9981C24.7583 25.9994 24.7469 25.9998 24.7421 26H2.25788ZM17.5659 10.8159C16.4875 11.8942 15.025 12.5 13.5 12.5C11.975 12.5 10.5125 11.8942 9.43414 10.8159C8.3558 9.73753 7.75 8.27499 7.75 6.75C7.75 5.22501 8.3558 3.76247 9.43414 2.68414C10.5125 1.6058 11.975 1 13.5 1C15.025 1 16.4875 1.6058 17.5659 2.68414C18.6442 3.76247 19.25 5.22501 19.25 6.75C19.25 8.27499 18.6442 9.73753 17.5659 10.8159Z" stroke="black" stroke-width="2"/>
        </svg>
        <h4>
          <span>
            Cadastrar paciente
          </span>
        </h4>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form>
            <v-row>
              <span class="paciente-modal-subtitle">Informações Básicas</span>
            </v-row>
            <!-- Secao 1 - Nome, Nascimento, Sexo, Email, Telefone, Registro HC, Nome da Mãe -->
            <v-row class="mt-0">
              <v-col :md="7" :sm="12" :xl="4" cols="12">
                <v-text-field v-model="formData.nome" outlined :hide-details="true" label="Nome" />
              </v-col>
              <v-col :md="2" :sm="12" :xl="2" cols="12">
                <v-menu
                  v-model="menuNascimento"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="formatDate(formData.data_nascimento)"
                      outlined
                      :hide-details="true"
                      label="Data de Nascimento"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formData.data_nascimento"
                    @input="menuNascimento = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col :md="3" :sm="12" :xl="2" cols="12">
                <span>Sexo</span>
                <v-radio-group
                  v-model="formData.sexo"
                  row
                  style="margin: 0"
                  :hide-details="true"
                >
                  <v-radio
                    label="Masculino"
                    value="M"
                  ></v-radio>
                  <v-radio
                    label="Feminino"
                    value="F"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col :md="7" :sm="12" :xl="4" cols="12">
                <v-text-field v-model="formData.email" type="email" outlined :hide-details="true" label="E-Mail (Opcional)" />
              </v-col>
              <v-col :md="2" :sm="12" :xl="2" cols="12">
                <v-text-field v-model="formData.telefone" outlined :hide-details="true" label="Telefone" />
              </v-col>
              <v-col :md="3" :sm="12" :xl="2" cols="12">
                <v-text-field v-model="formData.registro_hc" outlined :hide-details="true" label="Registro HC" />
              </v-col>
              <v-col :md="7" :sm="12" :xl="4" cols="12">
                <v-text-field v-model="formData.nome_mae" outlined label="Nome da Mãe" />
              </v-col>
            </v-row>
            <br>
            <v-row>
              <span class="paciente-modal-subtitle">Informações Clinicas</span>
            </v-row>
            <!-- Seção Informações clínicas - Peso, Altura, IMC,  Comorbidade e Desfecho -->
            <v-row>
              <v-col :md="2" :sm="12" cols="12">
                <v-text-field v-model="formData.peso" type="number" outlined :hide-details="true" label="Peso (Opcional)" />
              </v-col>
              <v-col :md="2" :sm="12" cols="12">
                <v-text-field v-model="formData.altura" type="number" outlined :hide-details="true" label="Altura (Opcional)" />
              </v-col>
              <v-col :md="2" :sm="12" cols="12">
                <v-text-field class="mt-0" outlined :readonly="true" :hide-details="true" label="IMC" v-model="calculoIMC" />
              </v-col>
              <v-col :md="2" :sm="12" cols="12">
                <v-select
                  v-model="formData.comorbidade"
                  :items="comorbidadeItems"
                  label="Comorbidade (Opcional)"
                  item-text="label"
                  item-value="value"
                  outlined
                />
              </v-col>
              <v-col :md="4" :sm="12" cols="12">
                <v-select
                  v-model="formData.desfecho"
                  :items="desfechoItems"
                  :clearable="true"
                  label="Desfecho (Opcional)"
                  item-text="label"
                  item-value="value"
                  outlined
                />
              </v-col>
            </v-row>
            <!-- Secao HEPB se Marcada -->
            <div v-if="formData.comorbidade == 'HEPB'">
              <v-row>
                <span class="paciente-modal-subtitle">Hepatite B</span>
              </v-row>
              <v-row>
                <!-- Tratamento -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-select
                    v-model="formData.hepatiteb.tratamento"
                    :items="tratamentoBItems"
                    label="Tratamento (Opcional)"
                    item-text="label"
                    item-value="value"
                    outlined
                    :hide-details="true"
                  />
                </v-col>
                <!-- Inicio do Tratamento -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuInicioTratamento"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatiteb.inicio_tratamento)"
                        outlined
                        :hide-details="true"
                        label="Inicio do Tratamento (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatiteb.inicio_tratamento"
                      @input="menuInicioTratamento = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Fibrose -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-select
                    v-model="formData.hepatiteb.fibrose"
                    :items="fibroseItems"
                    label="Fibrose (Opcional)"
                    outlined
                    :hide-details="true"
                  />
                </v-col>
                <!-- Cirrotico -->
                <v-col :md="3" :sm="12" cols="12">
                  <span>Cirrotico (Opcional)</span>
                  <v-radio-group
                    row
                    v-model="formData.hepatiteb.cirrotico"
                    style="margin: 0"
                    :hide-details="true"
                  >
                    <v-radio
                      label="Não"
                      :value="false"
                    ></v-radio>
                    <v-radio
                      label="Sim"
                      :value="true"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <!-- Data - Alfafetoproteina -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuAlfa"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatiteb.data_alfa)"
                        outlined
                        :hide-details="true"
                        label="Data - Alfafetoproteina (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatiteb.data_alfa"
                      @input="menuAlfa = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Resultado - Alfafetoproteina -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-text-field v-model="formData.hepatiteb.resultado_alfa" type="text" outlined :hide-details="true" label="Resultado - Alfafetoproteina (Opcional)" />
                </v-col>
                <!-- Data - Antiretroviral -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuAntir"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatiteb.data_antiretroviral)"
                        outlined
                        :hide-details="true"
                        label="Data - Antiretroviral (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatiteb.data_antiretroviral"
                      @input="menuAntir = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Portador Inativo -->
                <v-col :md="3" :sm="12" cols="12">
                  <span>Portador Inativo (Opcional)</span>
                  <v-radio-group
                    row
                    v-model="formData.hepatiteb.portador_inativo"
                    style="margin: 0"
                    :hide-details="true"
                  >
                    <v-radio
                      label="Não"
                      :value="false"
                    ></v-radio>
                    <v-radio
                      label="Sim"
                      :value="true"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <!-- Data - Ultrassom -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuUltra"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatiteb.data_ultrasom)"
                        outlined
                        :hide-details="true"
                        label="Data - Ultrassom (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatiteb.data_ultrasom"
                      @input="menuUltra = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Resultado - Ultrassom -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-text-field v-model="formData.hepatiteb.resultado_ultrasom" type="text" outlined :hide-details="true" label="Resultado - Ultrassom (Opcional)" />
                </v-col>
                <!-- Data - Carga Viral -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuCarga"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatiteb.data_cargaviral)"
                        outlined
                        :hide-details="true"
                        label="Data - Carga Viral (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatiteb.data_cargaviral"
                      @input="menuCarga = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Resultado - Carga Viral -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-text-field v-model="formData.hepatiteb.resultado_cargaviral" type="number" outlined :hide-details="true" label="Resultado - Carga Viral (Opcional)" />
                </v-col>
              </v-row>
            </div>
            <!-- Secao HEPC se Marcada -->
            <div v-else-if="formData.comorbidade == 'HEPC'" class="paciente-model-hepatitec">
              <v-row>
                <span class="paciente-modal-subtitle">Hepatite C</span>
              </v-row>
              <v-row v-for="(linha, lidx) in formData.hepatitec" :key="lidx" class="paciente-model-hepatitec-row">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-if="lidx > 0" class="paciente-model-hepatitec-button-delete" v-bind="attrs" v-on="on" @click="formData.hepatitec.splice(lidx)">
                      <v-icon color="red">mdi-close-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Remover tratamento</span>
                </v-tooltip>
                <!-- Tratamento -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-select
                    v-model="formData.hepatitec[lidx].tratamento"
                    :items="tratamentoCItems"
                    label="Tratamento (Opcional)"
                    item-text="label"
                    item-value="value"
                    outlined
                    :hide-details="true"
                  />
                </v-col>
                <!-- Inicio Tratamento -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuHepatiteC[lidx].menuInicioTratamento"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatitec[lidx].inicio_tratamento)"
                        outlined
                        :hide-details="true"
                        label="Inicio do Tratamento (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatitec[lidx].inicio_tratamento"
                      @input="menuHepatiteC[lidx].menuInicioTratamento = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Fibrose -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-select
                    v-model="formData.hepatitec[lidx].fibrose"
                    :items="fibroseItems"
                    label="Fibrose (Opcional)"
                    outlined
                    :hide-details="true"
                  />
                </v-col>
                <!-- Tratado -->
                <v-col :md="3" :sm="12" cols="12">
                  <span>Tratado (Opcional)</span>
                  <v-radio-group
                    row
                    v-model="formData.hepatitec[lidx].tratado"
                    style="margin: 0"
                    :hide-details="true"
                  >
                    <v-radio
                      label="Não"
                      :value="false"
                    ></v-radio>
                    <v-radio
                      label="Sim"
                      :value="true"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <!-- Data - Alfafetoproteina -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuHepatiteC[lidx].menuAlfa"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatitec[lidx].data_alfa)"
                        outlined
                        :hide-details="true"
                        label="Data - Alfafetoproteina (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatitec[lidx].data_alfa"
                      @input="menuHepatiteC[lidx].menuAlfa = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Resultado - Alfafetoproteina -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-text-field v-model="formData.hepatitec[lidx].resultado_alfa" type="text" outlined :hide-details="true" label="Resultado - Alfafetoproteina (Opcional)" />
                </v-col>
                <!-- Cirrotico -->
                <v-col :md="3" :sm="12" cols="12">
                  <span>Cirrotico (Opcional)</span>
                  <v-radio-group
                    row
                    v-model="formData.hepatitec[lidx].cirrotico"
                    style="margin: 0"
                    :hide-details="true"
                  >
                    <v-radio
                      label="Não"
                      :value="false"
                    ></v-radio>
                    <v-radio
                      label="Sim"
                      :value="true"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <!-- Portador Inativo -->
                <v-col :md="3" :sm="12" cols="12">
                  <span>Portador Inativo (Opcional)</span>
                  <v-radio-group
                    row
                    v-model="formData.hepatitec[lidx].portador_inativo"
                    style="margin: 0"
                    :hide-details="true"
                  >
                    <v-radio
                      label="Não"
                      :value="false"
                    ></v-radio>
                    <v-radio
                      label="Sim"
                      :value="true"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <!-- Data - Ultrassom -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuHepatiteC[lidx].menuUltra"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatitec[lidx].data_ultrasom)"
                        outlined
                        :hide-details="true"
                        label="Data - Ultrassom (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatitec[lidx].data_ultrasom"
                      @input="menuHepatiteC[lidx].menuUltra = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Resultado - Ultrassom -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-text-field v-model="formData.hepatitec[lidx].resultado_ultrasom" type="text" outlined :hide-details="true" label="Resultado - Ultrassom (Opcional)" />
                </v-col>
                <!-- Data - Carga Viral -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-menu
                    v-model="menuHepatiteC[lidx].menuCarga"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(formData.hepatitec[lidx].data_cargaviral)"
                        outlined
                        :hide-details="true"
                        label="Data - Carga Viral (Opcional)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.hepatitec[lidx].data_cargaviral"
                      @input="menuHepatiteC[lidx].menuCarga = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Resultado - Carga Viral -->
                <v-col :md="3" :sm="12" cols="12">
                  <v-text-field v-model="formData.hepatitec[lidx].resultado_cargaviral" type="number" outlined :hide-details="true" label="Resultado - Carga Viral (Opcional)" />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn color="#E3E3E3" @click="adicionarHepatiteC">
                    Adicionar outro tratamento de hepatite C
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <v-row>
              <v-col :offset-md="8" :md="2">
                <v-btn block large>
                  Cancelar
                </v-btn>
              </v-col>
              <v-col :md="2">
                <v-btn block large color="primary">
                  Salvar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['value'],
  data(){
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      comorbidadeItems: [
        {
          label: 'Hepatite B',
          value: 'HEPB'
        },{
          label: 'Hepatite C',
          value: 'HEPC'
        },{
          label: 'Outro',
          value: 'OUTRO'
        }
      ],
      desfechoItems: [
        {
          label: 'ALTA DO SERVIÇO PÓS RVS',
          value: 1
        },{
          label: 'ALTA POR OUTROS MOTIVOS',
          value: 2
        },{
          label: 'ACOMPANHAMENTO  SEMESTRAL OU ANUAL',
          value: 3
        },{
          label: 'HCC',
          value: 4
        },{
          label: 'ÓBITO',
          value: 5
        },{
          label: 'RVS PARA VÍRUS C',
          value: 6
        },{
          label: 'ABANDONO',
          value: 7
        }
      ],
      formData: {
        nome: null,
        data_nascimento: null,
        sexo: null,
        email: null,
        telefone: null,
        registro_hc: null,
        nome_mae: null,
        altura: null,
        peso: null,
        comorbidade: null,
        desfecho: null,
        hepatiteb: {
          tratamento: null,
          inicio_tratamento: null,
          fibrose: null,
          cirrotico: false,
          data_alfa: null,
          resultado_alfa: null,
          data_antiretroviral: null,
          portador_inativo: false,
          data_ultrasom: null,
          resultado_ultrasom: null,
          data_cargaviral: null,
          resultado_cargaviral: null
        },
        hepatitec: []
      },
      tratamentoBItems: [
        {
          value: 1,
          label: 'ENTECAVIR 0,5 MG 01COMP/DIA'
        },{
          value: 2,
          label: 'ENTECAVIR 0,5 MG 02 COMP/DIA'
        },{
          value: 3,
          label: 'TENOFOVIR 300 MG'
        },{
          value: 4,
          label: 'INTERFERON'
        }
      ],
      tratamentoCItems: [
        {
          value: 1,
          label: 'sofo/vel'
        },{
          value: 2,
          label: 'sofo/led'
        },{
          value: 3,
          label: 'GP'
        },{
          value: 4,
          label: 'outros esquemas'
        }
      ],
      fibroseItems: ['F1','F2','F3','F4','F5'],
      menuNascimento: false,
      menuInicioTratamento: false,
      menuAlfa: false,
      menuAntir: false,
      menuUltra: false,
      menuCarga: false,
      menuHepatiteC: []
    }
  },
  computed: {
    calculoIMC(){
      const result = this.formData.peso / (this.formData.altura * this.formData.altura)
      return isFinite(result) ? result.toFixed(3): 0;
    },
  },
  mounted(){
    this.adicionarHepatiteC()
  },
  methods: {
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    adicionarHepatiteC(){
      this.formData.hepatitec.push({
        tratamento: null,
        tratado: null,
        inicio_tratamento: null,
        fibrose: null,
        cirrotico: null,
        data_alfa: null,
        resultado_alfa: null,
        portador_inativo: null,
        data_ultrasom: null,
        resultado_ultrasom: null,
        data_cargaviral: null,
        resultado_cargaviral: null
      })
      this.menuHepatiteC.push({
        menuAlfa: false,
        menuAntir: false,
        menuUltra: false,
        menuCarga: false
      })
    }
  }
}
</script>

<style>
  .paciente-modal-subtitle{
    margin-left: 10px;
    color: #000;
  }
  .paciente-modal-title{
    margin-left: 40px;
  }
  .paciente-modal-title h4{
    width: calc(100% - 27px); 
    text-align: left; 
    border-bottom: 1px solid #B7B7B7; 
    line-height: 0.1em;
    margin: 20px 0 20px; 
  }
  .paciente-modal-title h4 span{
    background:#fff; 
    padding:0 10px; 
  }
  .paciente-model-hepatitec .paciente-model-hepatitec-row{
    position: relative;
    border-bottom: 1px solid rgb(209, 209, 209);
    margin-top: 20px !important;
    padding-bottom: 20px;
  }
  .paciente-model-hepatitec-button-delete{
    position: absolute !important;
    right: 0;
    top: 0;
  }
</style>