<template>
  <v-container fluid>
    <!-- Agenda -->
    <v-row>
      <v-col :md="10" :offset-md="1" class="consulta-container">
        <v-row>
          <!-- Coluna Marcar consulta, mini calendario, filtros -->
          <v-col :sm="12" :md="4" :lg="3">
            <v-row>
              <v-col>
                <client-only>
                  <v-btn v-if="['A'].includes($store.getters['login/me'].tipo)" color="primary" large @click="modalCreateAtivo = !modalCreateAtivo" block>
                    Marcar Consulta
                  </v-btn>
                </client-only>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-date-picker v-model="data_atual" width="100%" :no-title="true" @click:date="carregaConsultas" :allowed-dates="datasPermitidas"></v-date-picker>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-expansion-panels v-model="filtro_exp" active-class="consulta-container-filter">
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Consultas
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <ul class="consulta-container-filter-list">
                        <li>
                          <v-checkbox
                            v-model="filtros"
                            label="Aguardando Confirmação"
                            color="primary"
                            value="AC"
                            hide-details
                            @change="carregaConsultas(filtroDataInicio)"
                          />
                        </li>
                        <li>
                          <v-checkbox
                            v-model="filtros"
                            label="Aguardando Consulta"
                            color="#0049D6"
                            value="AA"
                            hide-details
                            @change="carregaConsultas(filtroDataInicio)"
                          />
                        </li>
                        <li>
                          <v-checkbox
                            v-model="filtros"
                            label="Atendimento Realizado"
                            color="#00BA34"
                            value="R"
                            hide-details
                            @change="carregaConsultas(filtroDataInicio)"
                          />
                        </li>
                        <li>
                          <v-checkbox
                            v-model="filtros"
                            label="Não compareceu"
                            color="#CE4B39"
                            value="C"
                            hide-details
                            @change="carregaConsultas(filtroDataInicio)"
                          />
                        </li>
                      </ul>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-col>
          <!-- Coluna Agendamentos -->
          <v-col :sm="12" :md="8" :lg="9">
            <div v-if="consultaLista && ((primeiroCarregamento && Object.keys(consultaLista).length > 0) || !primeiroCarregamento)" class="consulta-container-list" @scroll="scrollLista" ref="consultaList">
              <v-row>
                <v-col>
                  <div class="lds-dual-ring"></div>
                </v-col>
              </v-row>
              <br><br>
              <div class="consulta-container-list-items">
                <v-row v-for="(li, lidx) in consultaLista" :key="lidx">
                  <v-col :sm="12">
                    <!-- Dia em extenso/Dia da semana e contador de consultas -->
                    <v-row>
                      <v-col>
                        <b>{{ formataData(lidx) }}</b>
                        <b class="d-block">{{ buscaDiaSemana(lidx) }}</b>
                        <span class="consulta-container-list-count d-block">
                          {{ li.length }} consultas
                        </span>
                      </v-col>
                    </v-row>
                    <!-- Lista de Consultas -->
                    <v-row>
                      <v-col v-for="(l, ldx) in li" :key="ldx" :md="4" cols="12">
                        <v-card class="consulta-container-list-card" @click="abreModal(l.id)">
                          <v-row>
                            <!-- Icone -->
                            <v-col :sm="4" :lg="3" :cols="12">
                              <svg v-if="l.status == 'REALIZADO'" width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.29506 17.1629C9.07997 17.3793 8.7865 17.5 8.48166 17.5C8.17682 17.5 7.88336 17.3793 7.66827 17.1629L1.17224 10.6646C0.498089 9.99034 0.498089 8.89697 1.17224 8.22397L1.98563 7.41021C2.65999 6.73594 3.7519 6.73594 4.42604 7.41021L8.48166 11.4668L19.4405 0.505701C20.1149 -0.168567 21.2079 -0.168567 21.8809 0.505701L22.6943 1.31946C23.3685 1.99373 23.3685 3.08688 22.6943 3.7601L9.29506 17.1629Z" fill="#00BA34"/>
                              </svg>
                              <svg v-else-if="l.status == 'AGUARDANDOC'" width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.9482 3.07472V0.188436C10.9482 0.0280872 11.1528 -0.0570984 11.2908 0.0431199L17.3458 4.40262C17.4481 4.47778 17.4481 4.6231 17.3458 4.69826L11.2908 9.05776C11.1528 9.15798 10.9482 9.06778 10.9482 8.91244V6.03117C6.45811 6.10132 2.86296 9.83946 3.1698 14.3192C3.43062 18.1676 6.63199 21.2894 10.5595 21.5349C14.7223 21.7955 18.2612 18.8792 18.8954 15.0258C19.013 14.3092 19.6471 13.7881 20.3887 13.7881C21.3041 13.7881 22.0149 14.5848 21.8717 15.4667C20.9819 20.9637 15.8116 25.0877 9.81801 24.4312C4.80628 23.88 0.78156 19.9515 0.213906 15.0408C-0.537854 8.6168 4.5557 3.14488 10.9482 3.07472Z" fill="#008BD9"/>
                              </svg>
                              <svg v-else-if="l.status == 'AGUARDANDOA'" width="16" height="25" viewBox="0 0 16 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.3007 21.5314V17.6757C14.3007 16.3517 13.734 15.091 12.7453 14.2182L10.515 12.25L12.7453 10.2818C13.734 9.40901 14.3007 8.14826 14.3007 6.82425V2.96857C14.8886 2.75725 15.3126 2.19581 15.3126 1.53125C15.3126 0.687005 14.6316 0 13.7947 0H1.65123C0.814331 0 0.133301 0.687005 0.133301 1.53125C0.133301 2.19581 0.557326 2.75725 1.14524 2.96857V6.82425C1.14524 8.14826 1.71195 9.40901 2.7006 10.2818L4.93097 12.25L2.7006 14.2182C1.7119 15.091 1.14524 16.3517 1.14524 17.6757V21.5314C0.557326 21.7427 0.133301 22.3042 0.133301 22.9688C0.133301 23.813 0.814331 24.5 1.65123 24.5H13.7947C14.6316 24.5 15.3126 23.813 15.3126 22.9688C15.3126 22.3042 14.8886 21.7427 14.3007 21.5314ZM13.2887 21.4375H2.15723V17.6757C2.15723 16.6457 2.59843 15.6657 3.3665 14.9869L6.03199 12.6339C6.14228 12.5369 6.20504 12.397 6.20504 12.25C6.20504 12.103 6.14228 11.9632 6.03199 11.8662L3.3665 9.51323C2.59843 8.83436 2.15723 7.85436 2.15723 6.82435V3.0625H13.2888V6.82425C13.2888 7.85426 12.8476 8.83426 12.0795 9.51313L9.41399 11.8661C9.30366 11.9631 9.2409 12.103 9.2409 12.25C9.2409 12.397 9.30366 12.5369 9.41395 12.6338L12.0794 14.9868C12.8485 15.6657 13.2887 16.6457 13.2887 17.6757V21.4375Z" fill="#0049D6"/>
                                <path d="M12.1665 19.5876L8.11866 14.4835C7.9264 14.2415 7.52059 14.2415 7.32834 14.4835L3.28053 19.5876C3.1591 19.7408 3.13581 19.9511 3.21981 20.1276C3.30382 20.3043 3.4809 20.4165 3.67519 20.4165H11.7709C11.9651 20.4165 12.1422 20.3042 12.2272 20.1276C12.3111 19.9511 12.2879 19.7408 12.1665 19.5876Z" fill="#0049D6"/>
                                <path d="M10.2146 8.48219C10.1367 8.29131 9.95151 8.16675 9.74711 8.16675H5.6993C5.4949 8.16675 5.30972 8.29131 5.23178 8.48219C5.15285 8.67307 5.19635 8.89156 5.34107 9.03856L7.365 11.0802C7.46419 11.1792 7.59369 11.2293 7.72323 11.2293C7.85278 11.2293 7.98228 11.1793 8.08146 11.0802L10.1054 9.03856C10.25 8.89256 10.2936 8.67307 10.2146 8.48219Z" fill="#0049D6"/>
                              </svg>
                              <svg v-else-if="l.status == 'CANCELADO'" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.266602 14.2419L5.70622 8.74996L0.266602 3.25812L3.49369 0L8.93331 5.49192L14.3728 0L17.5999 3.25812L12.1603 8.75004L17.5999 14.2419L14.3728 17.5L8.93323 12.0081L3.49361 17.5L0.266602 14.2419Z" fill="#CE4B39"/>
                              </svg>
                            </v-col>
                            <v-col :sm="8" :lg="9" :cols="12">
                              <span class="d-block">
                                <b>{{ l.paciente.nome }}</b>
                              </span>
                              <span class="d-block consulta-container-list-card-subtext">
                                Cadastro em:
                                {{ formataDataSimples(lidx) }}
                              </span>
                              <span class="d-block consulta-container-list-card-subtext">
                                Status:
                                <span title="Realizado" v-if="l.status == 'REALIZADO'">Realizado</span>
                                <span title="Aguardando Consulta" v-else-if="l.status == 'AGUARDANDOC'">Aguardando Consulta</span>
                                <span title="Aguardando Atendimento" v-else-if="l.status == 'AGUARDANDOA'">Aguardando Atendimento</span>
                                <span title="Cancelado" v-else-if="l.status == 'CANCELADO'">Cancelado</span>
                              </span>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
              <br><br>
              <v-row>
                <v-col>
                  <div class="lds-dual-ring"></div>
                </v-col>
              </v-row>
            </div>
            <!-- Caso nao haja agendamentos -->
            <div v-else class="consulta-container-empty">
              <svg width="449" height="313" viewBox="0 0 449 313" fill="none" xmlns="http://www.w3.org/2000/svg"  class="consulta-container-empty-image">
                <g clip-path="url(#clip0)">
                <rect width="449" height="313" fill="white"/>
                <path d="M30.3357 84.9568H55.7752" stroke="#F2F2F0" stroke-width="0.62" stroke-miterlimit="10"/>
                <path d="M30.3357 87.8621H37.8202" stroke="#F2F2F0" stroke-width="0.62" stroke-miterlimit="10"/>
                <path d="M444.229 154.512C446.631 154.512 448.579 152.533 448.579 150.092C448.579 147.651 446.631 145.672 444.229 145.672C441.826 145.672 439.878 147.651 439.878 150.092C439.878 152.533 441.826 154.512 444.229 154.512Z" stroke="#F2F2F0" stroke-width="1.09" stroke-miterlimit="10"/>
                <path d="M6.6346 184.261C10.0663 184.261 12.8483 181.435 12.8483 177.95C12.8483 174.465 10.0663 171.64 6.6346 171.64C3.20287 171.64 0.420898 174.465 0.420898 177.95C0.420898 181.435 3.20287 184.261 6.6346 184.261Z" stroke="#F2F2F0" stroke-width="1.09" stroke-miterlimit="10"/>
                <path d="M243.161 46.4303C243.148 46.8908 243.001 47.3375 242.736 47.7145C242.472 48.0915 242.103 48.382 241.674 48.5498C241.246 48.7176 240.778 48.7552 240.328 48.6579C239.879 48.5605 239.468 48.3326 239.147 48.0026C238.826 47.6725 238.61 47.2551 238.524 46.8024C238.439 46.3497 238.489 45.8818 238.667 45.4573C238.846 45.0328 239.146 44.6705 239.529 44.4157C239.912 44.1609 240.362 44.0249 240.822 44.0248C241.449 44.0371 242.046 44.2964 242.484 44.7467C242.922 45.1969 243.165 45.8018 243.161 46.4303Z" stroke="#F2F2F0" stroke-width="1.09" stroke-miterlimit="10"/>
                <path d="M39.3638 33.5204H140.779C140.779 33.5204 140.295 29.4826 129.022 26.2571C117.748 23.0316 109.671 31.3024 96.9321 26.2571C84.1928 21.2119 77.4412 13.9799 61.0298 18.0098C44.6185 22.0397 39.3638 33.5204 39.3638 33.5204Z" stroke="#B7B7B7" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M360.886 69.1494H413.332C413.332 69.1494 413.074 66.6112 407.251 64.5806C401.427 62.55 397.24 67.7514 390.652 64.5806C384.064 61.4097 380.571 56.8565 372.089 59.3948C369.628 60.1106 367.351 61.3537 365.417 63.038C363.482 64.7223 361.936 66.8075 360.886 69.1494V69.1494Z" stroke="#B7B7B7" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M306.522 116.626H128.063V295.966H306.522V116.626Z" fill="#F2F2F0"/>
                <path d="M306.459 88.153V116.363H128V88.153C128 85.4602 129.068 82.8778 130.969 80.9737C132.869 79.0697 135.447 78 138.135 78H296.331C299.018 78.0021 301.594 79.0727 303.493 80.9765C305.392 82.8803 306.459 85.4616 306.459 88.153Z" fill="#008BD9"/>
                <path d="M278.868 104.193C283.505 104.193 287.265 100.427 287.265 95.7814C287.265 91.136 283.505 87.3701 278.868 87.3701C274.231 87.3701 270.471 91.136 270.471 95.7814C270.471 100.427 274.231 104.193 278.868 104.193Z" fill="#0049D6"/>
                <path d="M278.868 98.9445C280.144 98.9445 281.367 98.4368 282.269 97.5332C283.172 96.6295 283.678 95.4038 283.678 94.1258V72.3516C283.678 71.0736 283.172 69.8479 282.269 68.9442C281.367 68.0405 280.144 67.5328 278.868 67.5328C277.592 67.5328 276.369 68.0405 275.467 68.9442C274.564 69.8479 274.058 71.0736 274.058 72.3516V94.1258C274.058 95.4038 274.564 96.6295 275.467 97.5332C276.369 98.4368 277.592 98.9445 278.868 98.9445Z" fill="#9D9D9D"/>
                <path d="M219.616 104.193C224.253 104.193 228.012 100.427 228.012 95.7814C228.012 91.136 224.253 87.3701 219.616 87.3701C214.978 87.3701 211.219 91.136 211.219 95.7814C211.219 100.427 214.978 104.193 219.616 104.193Z" fill="#0049D6"/>
                <path d="M219.616 98.9445C220.892 98.9445 222.116 98.4371 223.02 97.5336C223.923 96.6301 224.432 95.4045 224.434 94.1258V72.3516C224.432 71.0729 223.923 69.8472 223.02 68.9437C222.116 68.0403 220.892 67.5328 219.616 67.5328C218.34 67.5328 217.116 68.0405 216.214 68.9442C215.312 69.8479 214.805 71.0736 214.805 72.3516V94.1258C214.805 95.4038 215.312 96.6295 216.214 97.5332C217.116 98.4368 218.34 98.9445 219.616 98.9445Z" fill="#9D9D9D"/>
                <path d="M160.363 104.193C165.001 104.193 168.76 100.427 168.76 95.7814C168.76 91.136 165.001 87.3701 160.363 87.3701C155.726 87.3701 151.967 91.136 151.967 95.7814C151.967 100.427 155.726 104.193 160.363 104.193Z" fill="#0049D6"/>
                <path d="M160.371 98.9445C161.647 98.9445 162.87 98.4368 163.773 97.5332C164.675 96.6295 165.181 95.4038 165.181 94.1258V72.3516C165.181 71.0736 164.675 69.8479 163.773 68.9442C162.87 68.0405 161.647 67.5328 160.371 67.5328C159.095 67.5328 157.87 68.0403 156.967 68.9437C156.064 69.8472 155.555 71.0729 155.553 72.3516V94.1258C155.555 95.4045 156.064 96.6301 156.967 97.5336C157.87 98.4371 159.095 98.9445 160.371 98.9445Z" fill="#9D9D9D"/>
                <path d="M246.225 179.442H280.154V145.453H246.225V179.442Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M201.084 179.442H235.013V145.453H201.084V179.442Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M155.927 179.442H189.857V145.453H155.927V179.442Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M246.225 222.584H280.154V188.595H246.225V222.584Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M201.084 222.584H235.013V188.595H201.084V222.584Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M155.927 222.584H189.857V188.595H155.927V222.584Z" fill="#CE4B39"/>
                <path d="M168.191 200.732L177.601 210.447" stroke="#F2F2F0" stroke-width="2.02" stroke-miterlimit="10"/>
                <path d="M177.601 200.732L168.191 210.447" stroke="#F2F2F0" stroke-width="2.02" stroke-miterlimit="10"/>
                <path d="M246.225 265.734H280.154V231.745H246.225V265.734Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M201.084 265.734H235.013V231.745H201.084V265.734Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M155.927 265.734H189.857V231.745H155.927V265.734Z" stroke="#D5BCB9" stroke-width="2.21" stroke-miterlimit="10"/>
                <path d="M303.465 177.794H286.953V188.689H303.465V177.794Z" fill="#9D9D9D"/>
                <path d="M306.007 180.621H284.411C283.231 180.621 282.098 180.151 281.263 179.315C280.428 178.479 279.959 177.344 279.959 176.162C279.958 175.575 280.073 174.995 280.296 174.453C280.519 173.911 280.847 173.418 281.261 173.003C281.674 172.588 282.165 172.259 282.706 172.035C283.246 171.81 283.826 171.694 284.411 171.694H306.007C307.19 171.694 308.324 172.165 309.16 173.003C309.997 173.841 310.467 174.977 310.467 176.162C310.465 177.345 309.994 178.479 309.158 179.315C308.322 180.152 307.188 180.621 306.007 180.621Z" fill="#9D9D9D"/>
                <path d="M255.167 194.321L245.856 203.648L252.422 210.225L261.733 200.898L255.167 194.321Z" fill="#9D9D9D"/>
                <path d="M258.106 193.945L245.102 206.972C244.472 207.602 243.618 207.956 242.728 207.956C241.838 207.956 240.984 207.602 240.354 206.972C239.725 206.341 239.372 205.486 239.372 204.594C239.372 203.702 239.725 202.847 240.354 202.216L253.358 189.189C253.988 188.559 254.842 188.205 255.732 188.205C256.622 188.205 257.476 188.559 258.106 189.189C258.735 189.82 259.088 190.675 259.088 191.567C259.088 192.459 258.735 193.314 258.106 193.945Z" fill="#9D9D9D"/>
                <path d="M295.014 295.818C325.839 295.818 350.828 270.786 350.828 239.907C350.828 209.027 325.839 183.995 295.014 183.995C264.189 183.995 239.2 209.027 239.2 239.907C239.2 270.786 264.189 295.818 295.014 295.818Z" fill="#9D9D9D"/>
                <path d="M295.014 292.811C324.182 292.811 347.827 269.125 347.827 239.907C347.827 210.688 324.182 187.002 295.014 187.002C265.847 187.002 242.202 210.688 242.202 239.907C242.202 269.125 265.847 292.811 295.014 292.811Z" fill="#9D9D9D"/>
                <path d="M295.014 286.837C320.888 286.837 341.863 265.825 341.863 239.907C341.863 213.988 320.888 192.976 295.014 192.976C269.141 192.976 248.166 213.988 248.166 239.907C248.166 265.825 269.141 286.837 295.014 286.837Z" fill="#F6F6F6"/>
                <path d="M295.248 203.551C294.936 203.549 294.638 203.424 294.418 203.204C294.198 202.983 294.073 202.684 294.071 202.372V199.599C294.104 199.312 294.241 199.047 294.457 198.854C294.673 198.662 294.951 198.556 295.24 198.556C295.529 198.556 295.808 198.662 296.023 198.854C296.239 199.047 296.377 199.312 296.41 199.599V202.372C296.41 202.682 296.288 202.98 296.07 203.2C295.853 203.421 295.558 203.547 295.248 203.551Z" fill="#008BD9"/>
                <path d="M295.248 281.963C294.935 281.961 294.636 281.835 294.415 281.613C294.195 281.39 294.071 281.09 294.071 280.776V278.011C294.052 277.846 294.068 277.679 294.118 277.52C294.168 277.362 294.251 277.215 294.361 277.091C294.472 276.967 294.607 276.868 294.759 276.8C294.91 276.732 295.074 276.697 295.24 276.697C295.406 276.697 295.57 276.732 295.722 276.8C295.873 276.868 296.009 276.967 296.119 277.091C296.23 277.215 296.313 277.362 296.363 277.52C296.413 277.679 296.429 277.846 296.41 278.011V280.776C296.412 281.087 296.291 281.387 296.073 281.609C295.856 281.832 295.559 281.959 295.248 281.963Z" fill="#008BD9"/>
                <path d="M268.553 214.626C268.241 214.625 267.942 214.501 267.719 214.282L265.77 212.322C265.549 212.1 265.425 211.799 265.425 211.486C265.425 211.173 265.549 210.872 265.77 210.65C265.991 210.429 266.291 210.304 266.604 210.304C266.917 210.304 267.217 210.429 267.439 210.65L269.395 212.611C269.505 212.72 269.592 212.85 269.652 212.994C269.711 213.137 269.742 213.291 269.742 213.446C269.742 213.602 269.711 213.755 269.652 213.899C269.592 214.042 269.505 214.172 269.395 214.282C269.171 214.503 268.868 214.627 268.553 214.626Z" fill="#008BD9"/>
                <path d="M323.9 270.069C323.745 270.07 323.591 270.04 323.448 269.981C323.305 269.922 323.175 269.835 323.065 269.725L321.124 267.765C320.903 267.543 320.779 267.242 320.779 266.929C320.779 266.616 320.903 266.315 321.124 266.093C321.345 265.872 321.645 265.747 321.958 265.747C322.271 265.747 322.571 265.872 322.793 266.093L324.749 268.054C324.859 268.163 324.946 268.293 325.006 268.437C325.065 268.58 325.096 268.734 325.096 268.889C325.096 269.045 325.065 269.198 325.006 269.342C324.946 269.485 324.859 269.615 324.749 269.725C324.638 269.837 324.506 269.925 324.36 269.984C324.214 270.043 324.057 270.072 323.9 270.069Z" fill="#008BD9"/>
                <path d="M266.596 270.069C266.441 270.066 266.288 270.032 266.146 269.969C266.004 269.906 265.876 269.815 265.77 269.702C265.66 269.592 265.573 269.462 265.514 269.318C265.454 269.175 265.423 269.021 265.423 268.866C265.423 268.711 265.454 268.557 265.514 268.413C265.573 268.27 265.66 268.14 265.77 268.03L267.727 266.07C267.948 265.848 268.248 265.724 268.561 265.724C268.874 265.724 269.174 265.848 269.395 266.07C269.617 266.292 269.741 266.592 269.741 266.906C269.741 267.219 269.617 267.52 269.395 267.741L267.431 269.702C267.323 269.816 267.194 269.907 267.051 269.97C266.908 270.033 266.753 270.067 266.596 270.069Z" fill="#008BD9"/>
                <path d="M321.943 214.626C321.632 214.613 321.338 214.478 321.124 214.251C321.014 214.141 320.927 214.011 320.868 213.868C320.808 213.724 320.778 213.57 320.778 213.415C320.778 213.26 320.808 213.106 320.868 212.963C320.927 212.819 321.014 212.689 321.124 212.579L323.081 210.619C323.302 210.397 323.602 210.273 323.915 210.273C324.228 210.273 324.528 210.397 324.749 210.619C324.971 210.841 325.095 211.141 325.095 211.455C325.095 211.768 324.971 212.069 324.749 212.29L322.777 214.251C322.67 214.366 322.541 214.458 322.398 214.523C322.254 214.587 322.1 214.622 321.943 214.626Z" fill="#008BD9"/>
                <path d="M257.498 241.367H254.73C254.565 241.386 254.398 241.37 254.24 241.32C254.082 241.27 253.936 241.187 253.812 241.076C253.688 240.965 253.589 240.83 253.521 240.678C253.453 240.526 253.418 240.362 253.418 240.195C253.418 240.029 253.453 239.865 253.521 239.713C253.589 239.561 253.688 239.426 253.812 239.315C253.936 239.204 254.082 239.121 254.24 239.071C254.398 239.021 254.565 239.005 254.73 239.024H257.498C257.785 239.057 258.05 239.195 258.242 239.411C258.434 239.627 258.54 239.906 258.54 240.195C258.54 240.485 258.434 240.764 258.242 240.98C258.05 241.196 257.785 241.334 257.498 241.367Z" fill="#008BD9"/>
                <path d="M335.766 241.367H332.998C332.833 241.386 332.666 241.37 332.508 241.32C332.349 241.27 332.204 241.187 332.08 241.076C331.956 240.965 331.856 240.83 331.789 240.678C331.721 240.526 331.686 240.362 331.686 240.195C331.686 240.029 331.721 239.865 331.789 239.713C331.856 239.561 331.956 239.426 332.08 239.315C332.204 239.204 332.349 239.121 332.508 239.071C332.666 239.021 332.833 239.005 332.998 239.024H335.766C335.931 239.005 336.098 239.021 336.256 239.071C336.414 239.121 336.56 239.204 336.684 239.315C336.808 239.426 336.907 239.561 336.975 239.713C337.043 239.865 337.078 240.029 337.078 240.195C337.078 240.362 337.043 240.526 336.975 240.678C336.907 240.83 336.808 240.965 336.684 241.076C336.56 241.187 336.414 241.27 336.256 241.32C336.098 241.37 335.931 241.386 335.766 241.367Z" fill="#008BD9"/>
                <path d="M298.063 239.743H292.434V215.289C292.434 214.542 292.73 213.825 293.258 213.296C293.786 212.767 294.502 212.47 295.248 212.47C295.618 212.469 295.984 212.541 296.326 212.683C296.668 212.824 296.979 213.032 297.24 213.294C297.502 213.556 297.709 213.867 297.85 214.209C297.991 214.552 298.064 214.919 298.063 215.289V239.743Z" fill="#008BD9"/>
                <path d="M295.248 246.209C298.813 246.209 301.704 243.314 301.704 239.743C301.704 236.171 298.813 233.276 295.248 233.276C291.683 233.276 288.793 236.171 288.793 239.743C288.793 243.314 291.683 246.209 295.248 246.209Z" fill="#0049D6"/>
                </g>
                <defs>
                <clipPath id="clip0">
                <rect width="449" height="313" fill="white"/>
                </clipPath>
                </defs>
              </svg>
              <h3>Nenhum agendamento marcado.</h3>
              <span>
                Clique no botão “<b>marcar consulta</b>” para registrar um novo atendimento,
              </span>
            </div>

          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <modalCreateConsulta v-model="modalCreateAtivo" :bloqueioSemana="bloqueioSemana" />
    <modalEditConsulta v-model="modalEditAtivo" v-bind:consultaId="consultaId" />
  </v-container>
</template>

<script>
import modalCreateConsulta from '@/components/consulta/modalCreate.vue'
import modalEditConsulta from '@/components/consulta/modalEdit.vue'
import debounce from '@/assets/js/debounce.js'
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
      data_atual: null,
      filtro_exp: 0,
      filtros: ['AC','AA','R','C'],
      consultas: [],
      filtroDataInicio: null,
      filtroDataFim: null,
      primeiroCarregamento: true, // Verificar se está recarregando a página, caso não haja consultas na semana vai aparecer a tela de "Nenhum agendamento marcado. "
      bloqueioSemana: [],
      bloqueioDia: [],
      mesCalendario: null,
      consultaId:''
    }
  },
  async asyncData({ params, app }) {
    let data = {
      consultas: [],
      bloqueioSemana: [],
      bloqueioDia: [],
      filtroDataInicio: null,
      filtroDataFim: null,
      mesCalendario: null,
    }
    const dtInicio = new Date();
    const dtFim = new Date()
    dtFim.setDate(new Date().getDate() + 7);
    data.filtroDataInicio = new Date(dtInicio.getTime() - (dtInicio.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
    data.filtroDataFim = new Date(dtFim.getTime() - (dtFim.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
    data.mesCalendario = dtInicio.getMonth() + 1

    await app.$axios
      .get(`/consulta?dataInicio=${data.filtroDataInicio}&dataFim=${data.filtroDataFim}`)
      .then(res => {
        data.consultas = res.data.dados
      }).catch(err => {
        console.log('err', err.response)
      })

    await app.$axios
      .get(`/bloqueio/semana`)
      .then(res => {
        data.bloqueioSemana = res.data
      }).catch(err => {
        console.log('err', err.response)
      })

    const dt = new Date()
    await app.$axios
      .get(`/bloqueio/dia?mes=${dt.getMonth() + 1}&ano=${dt.getFullYear()}&simples=0&ativo=1`)
      .then(res => {
        data.bloqueioDia = res.data
      }).catch(err => {
        console.log('err', err.response)
      })

    return data
  },
  watch:{
      modalCreateAtivo: function(val){
        if(val == false){
          let d = new Date()
          d = d.toISOString().split('T')[0]
          this.carregaConsultas(d);
        }
      },

      modalEditAtivo: function(val){
        if(val == false){
          let d = new Date()
          d = d.toISOString().split('T')[0]
          this.carregaConsultas(d);
        }
      },
      $route(to, from) {
        if(to.query.cid) {
          this.consultaId = to.query.cid
          this.modalEditAtivo = true
        }
      }

  },
  mounted(){
    const offset = new Date().getTimezoneOffset()
    this.data_atual = new Date(new Date().getTime() - (offset*60*1000)).toISOString().split('T')[0]
    if(this.$refs['consultaList'])
      this.$refs['consultaList'].scrollTop = 130

    if(this.$route.query.cid) {
      this.consultaId = this.$route.query.cid
      this.modalEditAtivo = true
    }
  },
  computed: {
    consultaLista(){
      if(this.consultas) {
        if(this.consultas.length == 0 && this.primeiroCarregamento)
          return []
        else {
          const c = this.consultas.reduce((r, a) => { // Agrupa os dados vindo da API pela data
                    r[a.dt_inicio] = [...r[a.dt_inicio] || [], a];
                    return r;
                  }, {});

          for(let i=1;i<=7;i++) { // Completa com os dias que não vieram na api
            const dtInicioCopia = new Date(this.filtroDataInicio)
            dtInicioCopia.setDate(new Date(this.filtroDataInicio).getDate() + i)
            const chave = new Date(dtInicioCopia.getTime() - (dtInicioCopia.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
            if(!c[chave]){
              const diaSemana = new Date(chave + " 00:00").getDay()
              if(!this.bloqueioSemana[diaSemana].ativo) {
                var results = this.bloqueioDia.filter(function(item){
                  return chave == item.data;
                })
                if(results.length == 0)
                  c[chave] = []
              }
            }
          }
          let c2 = {}
          Object.keys(c).sort(function(a, b) { // Ordenar pela data
            return a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join(''));
          }).forEach(function(key) {
            c2[key] = c[key];
          })

          return c2
        }
      } else return []
    }
  },
  methods: {
    formataData(data){
      const [ano, mes, dia] = data.split('-')
      const mesExtensos = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro']
      return `${dia} de ${mesExtensos[parseInt(mes) - 1]} de ${ano}`
    },
    formataDataSimples(data){
      const [ano, mes, dia] = data.split('-')
      return `${dia}/${mes}/${ano}`
    },
    buscaDiaSemana(data){
      const d = new Date(data + ' 00:00:00')
      switch(d.getDay()){
        case 0: return "Domingo"
        case 1: return "Segunda-feira"
        case 2: return "Terça-feira"
        case 3: return "Quarta-feira"
        case 4: return "Quinta-feira"
        case 5: return "Sexta-feira"
        case 6: return "Sábado"
      }
    },
    abreModal(id){
      this.consultaId = id;
      this.modalEditAtivo = !this.modalEditAtivo;
    },
    scrollLista: debounce(function(ev){
      const t = this
      if(ev.target.scrollTop/ev.target.offsetHeight < 0.12) { // Menos de 12% do scroll da div
        setTimeout(() => { // Esperar um tempo para que não seja engano
          if(ev.target.scrollTop/ev.target.offsetHeight < 0.12) { // Verificar novamente se o usuário continua no canto superior
            //console.log(ev.target.offsetHeight, ev.target.scrollTop)
            const dataInicio = t.filtroDataInicio + ' 00:00:00'
            const dtInicio = new Date(dataInicio);
            dtInicio.setDate(new Date(dataInicio).getDate() - 7);
            t.carregaConsultas(new Date(dtInicio.getTime() - (dtInicio.getTimezoneOffset() * 60000 )).toISOString().split("T")[0])
          }
        }, 1000)
      }else if(ev.target.scrollTop === (ev.target.scrollHeight - ev.target.offsetHeight)) { // No final da barra de rolagem da div
        setTimeout(() => { // Esperar um tempo para que não seja engano
          if(ev.target.scrollTop === (ev.target.scrollHeight - ev.target.offsetHeight)) { // Verificar novamente se o usuário continua no canto superior
            const dataInicio = t.filtroDataInicio + ' 00:00:00'
            const dtInicio = new Date(dataInicio);
            dtInicio.setDate(new Date(dataInicio).getDate() + 7);
            t.carregaConsultas(new Date(dtInicio.getTime() - (dtInicio.getTimezoneOffset() * 60000 )).toISOString().split("T")[0])
          }
        }, 1000)
      }
    }, 500),
    carregaConsultas(dataInicio) {
      dataInicio += ' 00:00:00'
      const dtInicio = new Date(dataInicio);
      const dtFim = new Date()
      dtFim.setDate(new Date(dtInicio).getDate() + 7);
      this.filtroDataInicio = new Date(dtInicio.getTime() - (dtInicio.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
      this.filtroDataFim = new Date(dtFim.getTime() - (dtFim.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
      this.consultas = []
      this.$axios
        .get(`/consulta?dataInicio=${this.filtroDataInicio}&dataFim=${this.filtroDataFim}&status=${this.filtros.join()}`)
        .then(res => {
          this.primeiroCarregamento = false
          this.consultas = res.data.dados
          let t = this
          setTimeout(() => {
            t.$refs['consultaList'].scrollTop = 130
          },500)
        }).catch(err => {
          console.log('err', err.response)
          this.$Message.alert(err.response.data.message,'Erro', {type: 'error', msgBody: {style: {width: '30%'}}})
        })
    },
    mudaMesCalendario(mes, ano){
      this.mesCalendario = mes
      this.$axios
        .get(`/bloqueio/dia?mes=${mes}&ano=${ano}&simples=0&ativo=1`)
        .then(res => {
          this.bloqueioDia = res.data
        }).catch(err => {
          console.log('err', err.response)
          this.$Message.alert(err.response.data.message,'Erro', {type: 'error', msgBody: {style: {width: '30%'}}})
        })
    },
    datasPermitidas(val){
      const dt = new Date(val + " 00:00")
      const diaSemana = dt.getDay() // Bloquear dia da semana
      if(this.bloqueioSemana[diaSemana].ativo)
        return false;
      else {
        var results = this.bloqueioDia.filter(function(item){
          return val == item.data;
        })
        if(this.mesCalendario != (dt.getMonth() + 1)) // Se apertar no botão de trocar mes no calendario
          this.mudaMesCalendario(dt.getMonth() + 1, dt.getFullYear())
        return results.length > 0 ? false: true // Bloquear dias
      }
    }
  }
}
</script>

<style lang="scss">
  .consulta-container{
    margin-top: 20px;
    border-radius: 10px;
    background: #fff;
  }
  .consulta-container-empty{
    width: 460px;
  }
  .consulta-container-empty, .consulta-container-empty-image{
    display: block;
    margin: 0 auto;
    text-align: center;
    color: #9D9D9D;
  }
  .consulta-container-filter-list{
    list-style: none;
    padding-left: 0 !important;
  }
  .consulta-container-filter-list label {
    font-size: .9rem ;
    color: #000 !important;
  }
  .consulta-container-filter::before{
    box-shadow: none !important;
  }
  .consulta-container-list{
    max-height: 600px;
    padding: 15px;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 10px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px #EFEFEF;
      border-radius: 10px;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #D0D0D0;
      border-radius: 1px;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: darken(#D0D0D0, 20%);
    }
  }
  .consulta-container-list-items{
    min-height: 100vh;
  }
  .consulta-container-list-count{
    text-align: right;
  }
  .consulta-container-list-card svg{
    display: block;
    margin: 10px auto;
  }
  .consulta-container-list-card-subtext{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: .8rem;
  }
  /* Icone de Loading */
  .lds-dual-ring {
    display: block;
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #555;
    border-color: #555 transparent #555 transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
