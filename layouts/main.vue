<template>
  <v-app class="main">
    <header class="main-header">
      <v-container>
        <v-row>
          <v-col cols="8" :sm="8" :md="3" :offset-md="1" class="d-md-block" :class="!pesquisaMobile ? 'd-block': 'd-none'">
            <router-link to="/">
              <svg width="214" viewBox="0 0 274 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.6798" y="4.7904" width="37.0125" height="37.0125" stroke="#008BD9" stroke-width="2.64039" stroke-linejoin="round"/>
                <rect x="7.77393" width="3.81912" height="8.40207" fill="#C4C4C4"/>
                <rect x="28.9701" width="3.81912" height="8.40207" fill="#C4C4C4"/>
                <path d="M47.2777 53.673L48.4663 55.618L49.0925 53.4263C51.2521 45.8676 48.1893 36.3708 39.8657 32.5502C33.4557 29.6079 28.1567 30.0273 26.1117 30.7102C25.0335 30.9983 23.4697 31.5176 22.2863 32.1618C21.7095 32.4757 21.0967 32.8852 20.7205 33.4044C20.5222 33.6781 20.3471 34.0409 20.3396 34.4746C20.3325 34.8828 20.4756 35.2459 20.7008 35.5458C20.8122 35.7408 20.9646 35.9338 21.1795 36.0906C21.4346 36.2766 21.7096 36.3621 21.9627 36.3979C22.3908 36.4586 22.9046 36.3885 23.3747 36.3244L23.4015 36.3207C23.4527 36.3138 23.5053 36.3065 23.5594 36.2991C24.6059 36.1552 26.2092 35.9348 28.8083 35.9938C30.1579 36.0245 31.0098 36.1932 31.5275 36.3966C32.0313 36.5945 32.136 36.7889 32.1614 36.8498C32.1948 36.9301 32.213 37.0793 32.1258 37.3461C32.0393 37.611 31.8809 37.8908 31.7087 38.1491C31.479 38.4938 31.082 38.9 30.0165 39.1239C28.8902 39.3605 27.0513 39.3826 24.0085 38.8691C22.4526 38.6065 20.7524 37.7332 19.0009 36.4798C18.6831 36.2524 18.3661 36.0143 18.0506 35.7676L18.3548 34.8887C18.8705 33.3991 19.0042 31.6135 18.9526 30.1618C18.9266 29.429 18.8523 28.7487 18.7429 28.1996C18.6884 27.9263 18.6214 27.666 18.539 27.4394C18.4681 27.2447 18.3439 26.9524 18.117 26.7254C17.4907 26.0992 16.6067 26.1024 15.9873 26.3503C15.677 26.4744 15.3758 26.6796 15.1383 26.9587C15.1035 26.8188 15.0697 26.6847 15.0371 26.5573C14.8914 25.9877 14.7467 25.4569 14.6324 25.1903C14.2866 24.3834 13.6196 23.8444 13.0227 23.5184C12.4345 23.1972 11.7629 23 11.2332 23C9.82414 23 8.86389 24.3359 9.03142 26.0111C9.09347 26.6316 9.39835 27.2848 9.75451 27.8823C9.18105 27.325 8.64466 26.8349 8.1747 26.4821C7.93646 26.3033 7.68829 26.1391 7.4399 26.019C7.20717 25.9065 6.87737 25.7845 6.50605 25.8093C5.5613 25.8723 4.81469 26.1935 4.37281 26.8008C3.94402 27.3901 3.9458 28.0553 4.07968 28.5016L4.14649 28.7243L4.30471 28.8947C6.33971 31.0862 7.79989 33.0616 9.0321 34.834C9.34437 35.2831 9.6457 35.725 9.94045 36.1572C10.7929 37.4073 11.5903 38.5766 12.4377 39.6071C13.6041 41.0254 14.9089 42.2413 16.707 43.2115C18.4949 44.1761 20.719 44.8702 23.6921 45.3211C33.3535 46.7863 38.6266 47.8517 41.8253 49.0819C43.4 49.6875 44.4286 50.318 45.2165 51.0269C46.0092 51.7401 46.6067 52.5751 47.2777 53.673ZM15.9089 33.5918C15.9824 33.7866 16.0568 33.9753 16.1312 34.1557C15.9716 34.0132 15.8127 33.8696 15.6547 33.725L15.9089 33.5918Z" fill="#0049D6" stroke="white" stroke-width="2"/>
                <path d="M18.821 34.543L18.8379 35.0547L19.2314 34.7272C19.4369 34.5562 19.6916 34.2227 19.9326 33.8412C20.1781 33.4526 20.4253 32.9885 20.6102 32.5366C20.7922 32.0919 20.9258 31.6305 20.9178 31.2572C20.9138 31.0686 20.8732 30.8754 20.757 30.7196C20.6343 30.5552 20.452 30.4652 20.2346 30.4453C19.8476 30.4098 19.5696 30.6437 19.3861 30.9371C19.2044 31.2276 19.0822 31.6216 18.9984 32.0355C18.8296 32.8685 18.7989 33.8731 18.821 34.543Z" fill="#0049D6" stroke="white" stroke-width="0.500746"/>
                <circle cx="21.5418" cy="17.9547" r="4.69655" fill="#00BA34" stroke="white" stroke-width="2"/>
                <circle cx="30.783" cy="24.1916" r="4.96059" fill="#00BA34" stroke="white" stroke-width="2"/>
                <circle cx="38.7043" cy="12.9379" r="5.48867" fill="#00BA34" stroke="white" stroke-width="2"/>
                <path d="M82.7632 16.5463C85.0175 16.5463 86.8254 17.227 88.1869 18.5885C89.5707 19.95 90.2626 22.0035 90.2626 24.7488V35.1944H82.6963V26.0545C82.6963 23.9564 81.9486 22.9074 80.4531 22.9074C79.605 22.9074 78.9131 23.2087 78.3774 23.8113C77.8641 24.3917 77.6074 25.3179 77.6074 26.5902V35.1944H70.041V10.3526H77.6074V18.3542C79.0135 17.1489 80.7321 16.5463 82.7632 16.5463ZM113.361 26.021C113.361 26.1326 113.327 26.7241 113.26 27.7954H100.538C100.806 28.4873 101.252 29.023 101.877 29.4024C102.502 29.7595 103.283 29.9381 104.221 29.9381C105.024 29.9381 105.694 29.8377 106.23 29.6368C106.788 29.4359 107.39 29.09 108.037 28.5989L111.988 32.583C110.202 34.5471 107.535 35.5292 103.986 35.5292C101.777 35.5292 99.8349 35.1274 98.1609 34.3239C96.487 33.4981 95.1924 32.3598 94.2773 30.909C93.3622 29.4582 92.9047 27.8289 92.9047 26.021C92.9047 24.1908 93.351 22.5614 94.2438 21.133C95.1589 19.6822 96.3977 18.5551 97.9601 17.7515C99.5448 16.948 101.319 16.5463 103.283 16.5463C105.136 16.5463 106.821 16.9146 108.339 17.6511C109.879 18.3877 111.095 19.4702 111.988 20.8986C112.903 22.3271 113.361 24.0345 113.361 26.021ZM103.35 21.7021C102.569 21.7021 101.922 21.9142 101.408 22.3382C100.895 22.7623 100.56 23.365 100.404 24.1461H106.296C106.14 23.3873 105.805 22.7958 105.292 22.3717C104.779 21.9253 104.131 21.7021 103.35 21.7021ZM127.968 16.5463C129.575 16.5463 131.049 16.9369 132.388 17.7181C133.749 18.4769 134.821 19.5818 135.602 21.0325C136.405 22.4833 136.807 24.1573 136.807 26.0545C136.807 27.9517 136.405 29.6256 135.602 31.0764C134.821 32.5049 133.749 33.6097 132.388 34.3909C131.049 35.1498 129.575 35.5292 127.968 35.5292C125.937 35.5292 124.386 35.0047 123.315 33.9557V41.6894H115.748V16.8811H122.947V18.3877C124.04 17.1601 125.714 16.5463 127.968 16.5463ZM126.161 29.6368C127.031 29.6368 127.745 29.3243 128.303 28.6994C128.861 28.0744 129.14 27.1928 129.14 26.0545C129.14 24.9162 128.861 24.0345 128.303 23.4096C127.745 22.7623 127.031 22.4387 126.161 22.4387C125.29 22.4387 124.576 22.7623 124.018 23.4096C123.46 24.0345 123.181 24.9162 123.181 26.0545C123.181 27.1928 123.46 28.0744 124.018 28.6994C124.576 29.3243 125.29 29.6368 126.161 29.6368Z" fill="#0049D6"/>
                <path d="M147.393 16.5463C150.607 16.5463 153.062 17.2717 154.759 18.7225C156.455 20.1509 157.303 22.3606 157.303 25.3514V35.1944H150.272V32.7839C149.402 34.6141 147.672 35.5292 145.083 35.5292C143.632 35.5292 142.394 35.2837 141.367 34.7926C140.362 34.2793 139.592 33.5985 139.057 32.7504C138.543 31.8799 138.287 30.909 138.287 29.8377C138.287 28.0298 138.979 26.6571 140.362 25.7197C141.746 24.7823 143.844 24.3135 146.657 24.3135H149.703C149.458 22.8851 148.308 22.1708 146.255 22.1708C145.429 22.1708 144.592 22.3048 143.744 22.5726C142.896 22.8181 142.17 23.1641 141.568 23.6105L139.157 18.622C140.206 17.9747 141.467 17.4726 142.94 17.1154C144.436 16.736 145.92 16.5463 147.393 16.5463ZM147.36 30.976C147.895 30.976 148.375 30.8309 148.799 30.5407C149.223 30.2506 149.536 29.8153 149.737 29.235V27.9628H147.862C146.322 27.9628 145.552 28.4762 145.552 29.5029C145.552 29.9269 145.708 30.2841 146.02 30.5742C146.355 30.8421 146.802 30.976 147.36 30.976ZM181.029 16.8811V31.5451C181.029 35.027 180.058 37.6384 178.116 39.3793C176.197 41.1426 173.452 42.0242 169.88 42.0242C168.05 42.0242 166.343 41.8233 164.758 41.4216C163.173 41.0422 161.823 40.4842 160.707 39.7476L163.251 34.5918C163.966 35.1274 164.87 35.5627 165.963 35.8975C167.057 36.2323 168.106 36.3997 169.11 36.3997C170.628 36.3997 171.733 36.076 172.425 35.4288C173.117 34.7815 173.463 33.8329 173.463 32.583V32.2482C172.324 33.5427 170.639 34.19 168.407 34.19C166.845 34.19 165.383 33.8329 164.022 33.1187C162.682 32.3821 161.611 31.3442 160.807 30.0051C160.004 28.6436 159.602 27.0923 159.602 25.3514C159.602 23.6105 160.004 22.0704 160.807 20.7312C161.611 19.392 162.682 18.3653 164.022 17.6511C165.383 16.9146 166.845 16.5463 168.407 16.5463C170.907 16.5463 172.715 17.3498 173.831 18.9568V16.8811H181.029ZM170.416 28.2976C171.309 28.2976 172.045 28.0298 172.626 27.4941C173.228 26.9361 173.53 26.2219 173.53 25.3514C173.53 24.4809 173.228 23.7779 172.626 23.2422C172.045 22.7065 171.309 22.4387 170.416 22.4387C169.501 22.4387 168.742 22.7065 168.139 23.2422C167.559 23.7779 167.269 24.4809 167.269 25.3514C167.269 26.2219 167.57 26.9361 168.173 27.4941C168.776 28.0298 169.523 28.2976 170.416 28.2976ZM203.86 26.021C203.86 26.1326 203.827 26.7241 203.76 27.7954H191.037C191.305 28.4873 191.752 29.023 192.377 29.4024C193.002 29.7595 193.783 29.9381 194.72 29.9381C195.524 29.9381 196.193 29.8377 196.729 29.6368C197.287 29.4359 197.89 29.09 198.537 28.5989L202.487 32.583C200.702 34.5471 198.035 35.5292 194.486 35.5292C192.276 35.5292 190.334 35.1274 188.66 34.3239C186.986 33.4981 185.692 32.3598 184.777 30.909C183.862 29.4582 183.404 27.8289 183.404 26.021C183.404 24.1908 183.85 22.5614 184.743 21.133C185.658 19.6822 186.897 18.5551 188.459 17.7515C190.044 16.948 191.819 16.5463 193.783 16.5463C195.635 16.5463 197.32 16.9146 198.838 17.6511C200.378 18.3877 201.595 19.4702 202.487 20.8986C203.403 22.3271 203.86 24.0345 203.86 26.021ZM193.85 21.7021C193.069 21.7021 192.421 21.9142 191.908 22.3382C191.395 22.7623 191.06 23.365 190.903 24.1461H196.796C196.64 23.3873 196.305 22.7958 195.792 22.3717C195.278 21.9253 194.631 21.7021 193.85 21.7021ZM218.97 16.5463C221.224 16.5463 223.032 17.227 224.394 18.5885C225.778 19.95 226.469 22.0035 226.469 24.7488V35.1944H218.903V26.0545C218.903 23.9564 218.155 22.9074 216.66 22.9074C215.812 22.9074 215.12 23.2087 214.584 23.8113C214.071 24.3917 213.814 25.3179 213.814 26.5902V35.1944H206.248V16.8811H213.446V18.689C214.16 17.9747 214.986 17.4391 215.923 17.082C216.861 16.7248 217.876 16.5463 218.97 16.5463ZM250.338 10.3526V35.1944H243.139V33.6878C242.046 34.9154 240.372 35.5292 238.118 35.5292C236.51 35.5292 235.026 35.1498 233.665 34.3909C232.326 33.6097 231.254 32.4937 230.451 31.0429C229.669 29.5922 229.279 27.9182 229.279 26.021C229.279 24.1238 229.669 22.461 230.451 21.0325C231.254 19.5818 232.326 18.4769 233.665 17.7181C235.026 16.9369 236.51 16.5463 238.118 16.5463C240.149 16.5463 241.7 17.0708 242.771 18.1198V10.3526H250.338ZM239.925 29.6368C240.796 29.6368 241.51 29.3243 242.068 28.6994C242.626 28.0521 242.905 27.1593 242.905 26.021C242.905 24.8827 242.626 24.0011 242.068 23.3761C241.51 22.7512 240.796 22.4387 239.925 22.4387C239.055 22.4387 238.341 22.7512 237.783 23.3761C237.225 24.0011 236.946 24.8827 236.946 26.021C236.946 27.1593 237.225 28.0521 237.783 28.6994C238.341 29.3243 239.055 29.6368 239.925 29.6368ZM261.891 16.5463C265.105 16.5463 267.56 17.2717 269.256 18.7225C270.952 20.1509 271.801 22.3606 271.801 25.3514V35.1944H264.77V32.7839C263.899 34.6141 262.17 35.5292 259.581 35.5292C258.13 35.5292 256.891 35.2837 255.864 34.7926C254.86 34.2793 254.09 33.5985 253.554 32.7504C253.041 31.8799 252.784 30.909 252.784 29.8377C252.784 28.0298 253.476 26.6571 254.86 25.7197C256.244 24.7823 258.342 24.3135 261.154 24.3135H264.201C263.955 22.8851 262.806 22.1708 260.752 22.1708C259.926 22.1708 259.089 22.3048 258.241 22.5726C257.393 22.8181 256.668 23.1641 256.065 23.6105L253.655 18.622C254.704 17.9747 255.965 17.4726 257.438 17.1154C258.933 16.736 260.418 16.5463 261.891 16.5463ZM261.857 30.976C262.393 30.976 262.873 30.8309 263.297 30.5407C263.721 30.2506 264.033 29.8153 264.234 29.235V27.9628H262.359C260.819 27.9628 260.049 28.4762 260.049 29.5029C260.049 29.9269 260.205 30.2841 260.518 30.5742C260.853 30.8421 261.299 30.976 261.857 30.976Z" fill="#008BD9"/>
                <circle cx="109.711" cy="32.4033" r="3.70075" fill="#00BA34" stroke="white" stroke-width="2.01859"/>
                <rect x="105.001" y="28.3661" width="1.34573" height="8.07437" fill="white"/>
              </svg>
            </router-link>
          </v-col>
          <v-col :sm="8" :md="4" class="d-md-block" :class="pesquisaMobile ? 'd-block': 'd-none'">
            
            <v-input
              class="main-input"
              hide-details="true"
            >
              <v-autocomplete
                style="padding: 0;"
                ref="elFiltro"
                solo
                flat
                background-color="transparent"
                append-icon=""
                prepend-icon="mdi-magnify"
                hide-details="true"
                placeholder="Data da consulta, nome do paciente, mãe ou registro HC"
                :items="pesquisaItems"
                item-text="label"
                item-value="id"
                :search-input.sync="pesquisaTxt"
                :filter="customFiltro"
                clearable
                @change="clicaFiltro"
              >
                <template v-slot:item="data">
                  <div v-if="data.item.tipo == 'P'" style="white-space: nowrap;border-bottom: 1px solid #eee;width:100%" class="d-block">
                    <b class="d-block">{{ data.item.nome }}</b>
                    <small class="d-block">Reg. HC: {{ data.item.registro_hc }}</small>
                    <small class="d-block">Mãe: {{ data.item.nome_mae }}</small>
                  </div>
                  <div v-else>
                    <b class="d-block">{{ formataData(data.item.dt_inicio) }}</b>
                    <small class="d-block">Descrição: {{ data.item.descricao }}</small>
                    <small class="d-block">Paciente: {{ data.item.paciente.nome }}</small>
                  </div>
                </template>
              </v-autocomplete>
            </v-input>
          </v-col>
          <v-col cols="4" :sm="3" :md="4">
            <ul class="main-menu d-none d-md-block">
              <li>
                <router-link to="/" class="main-menu-link">Agenda </router-link>
              </li>
              <li>
                <router-link to="/paciente" class="main-menu-link">Pacientes</router-link>
              </li>
              <li>
              <client-only>
                <v-menu v-if="['A'].includes($store.getters['login/me'].tipo)" offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <svg style="width:24px;height:24px;" viewBox="0 -5 24 24" v-bind="attrs" v-on="on">
                      <path fill="currentColor" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
                    </svg>
                  </template>
                  <v-list dense>
                    <v-list-item v-if="['A'].includes($store.getters['login/me'].tipo)" to="/usuario">
                      <v-list-item-icon>
                        <v-icon>mdi-shield-account-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Gerenciar Usuários</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="['A'].includes($store.getters['login/me'].tipo)" to="/bloqueiodata">
                      <v-list-item-icon>
                        <v-icon>mdi-calendar-range</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Gerenciar Datas Bloqueadas</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="['A'].includes($store.getters['login/me'].tipo)" to="/tratamento">
                      <v-list-item-icon>
                        <v-icon>mdi-bottle-tonic-plus-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Gerenciar Tratamentos</v-list-item-title>
                    </v-list-item>
                    <!--
                    <v-list-item to="/relatorio" disabled>
                      <v-list-item-icon>
                        <v-icon>mdi-chart-line</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Relatórios</v-list-item-title>
                    </v-list-item>
                    -->
                  </v-list>
                </v-menu>
              </client-only>
              </li>
              <!-- Menu Usuário -->
              <li>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <svg class="main-menu-user" width="30" height="30" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="attrs" v-on="on">
                      <circle cx="28.5" cy="28.5" r="27.5" stroke="black" stroke-width="2"/>
                      <path d="M17.2579 41C17.2531 40.9998 17.2417 40.9994 17.2246 40.9981C17.1896 40.9957 17.1332 40.9902 17.0628 40.9785C16.9174 40.9542 16.7387 40.9076 16.5722 40.8243C16.4096 40.743 16.2774 40.6368 16.1836 40.4961C16.094 40.3617 16 40.1375 16 39.75C16 38.8818 16.463 36.8887 18.2384 35.1134C19.9844 33.3673 23.0859 31.75 28.5 31.75C33.9141 31.75 37.0156 33.3673 38.7616 35.1134C40.537 36.8887 41 38.8818 41 39.75C41 40.1375 40.906 40.3617 40.8164 40.4961C40.7226 40.6368 40.5904 40.743 40.4278 40.8243C40.2613 40.9076 40.0826 40.9542 39.9372 40.9785C39.8668 40.9902 39.8104 40.9957 39.7754 40.9981C39.7583 40.9994 39.7469 40.9998 39.7421 41H17.2579ZM32.5659 25.8159C31.4875 26.8942 30.025 27.5 28.5 27.5C26.975 27.5 25.5125 26.8942 24.4341 25.8159C23.3558 24.7375 22.75 23.275 22.75 21.75C22.75 20.225 23.3558 18.7625 24.4341 17.6841C25.5125 16.6058 26.975 16 28.5 16C30.025 16 31.4875 16.6058 32.5659 17.6841C33.6442 18.7625 34.25 20.225 34.25 21.75C34.25 23.275 33.6442 24.7375 32.5659 25.8159Z" stroke="black" stroke-width="2"/>
                    </svg>
                  </template>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title>{{ $store.getters['login/me'].nome }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                      <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
                      <v-list-item-title>Sair</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </li>
            </ul>
            <ul class="main-menu d-md-none d-block">
              <li @click="pesquisaMobile = !pesquisaMobile">
                <v-icon v-if="!pesquisaMobile">mdi-magnify</v-icon>
                <v-icon v-else>mdi-arrow-left-circle</v-icon>
              </li>
              <li>
                <v-icon @click="drawerMobile = !drawerMobile">mdi-menu</v-icon>
              </li>
            </ul>
            <v-navigation-drawer
              v-model="drawerMobile"
              absolute
              right
              temporary
            >
              <client-only>
                <v-list
                  nav
                  dense
                >
                  <v-list-item-group
                    active-class="deep-purple--text text--accent-4"
                  >
                    <v-subheader>Menu</v-subheader>
                    <v-list-item to="/">
                      <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Agenda</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/paciente">
                      <v-list-item-icon>
                        <v-icon>mdi-account-group-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Pacientes</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="['A'].includes($store.getters['login/me'].tipo)" to="/usuario">
                      <v-list-item-icon>
                        <v-icon>mdi-shield-account-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Gerenciar Usuários</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="['A'].includes($store.getters['login/me'].tipo)" to="/bloqueiodata">
                      <v-list-item-icon>
                        <v-icon>mdi-calendar-range</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Gerenciar Datas Bloqueadas</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="['A'].includes($store.getters['login/me'].tipo)" to="/tratamento">
                      <v-list-item-icon>
                        <v-icon>mdi-bottle-tonic-plus-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Gerenciar Tratamentos</v-list-item-title>
                    </v-list-item>
                    <v-subheader>Conta</v-subheader>
                    <v-list-item disabled>
                      <v-list-item-icon>
                        <v-icon>mdi-account-circle-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title><b>{{ $store.getters['login/me'].nome }}</b></v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                      <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
                      <v-list-item-title>Sair</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </client-only>
            </v-navigation-drawer>
          </v-col>
        </v-row>
      </v-container>

    </header>
    <Nuxt />
  </v-app>
</template>

<script>
export default {
  data(){
    return {
      pesquisaTxt: '',
      pesquisaItems: [],
      pesquisaMobile: false,
      drawerMobile: false
    }
  },
  watch: {
    pesquisaTxt(val){
      if(val && val.length >= 3) {
        // Testar se a pesquisa é uma data Formato (dd/mm/yyyy)
        if(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(val)) {
          // É data - Pesquisar consultas
          this.$axios
            .$get(`/consulta?dataInicio=${this.formataData2(val)}&dataFim=${this.formataData2(val)} 23:59:59`)
            .then((response) => {
              let t = this
              let res = response.dados.map(function(elem) {
                elem.tipo = 'C'
                elem.label = `${t.formataData(elem.dt_inicio)}`
                return elem;
              })
              this.pesquisaItems = res;
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // Nao é data - Pesquisar por paciente
          this.$axios
            .$get(`/paciente?limite=10&pesquisar=${val}&ativos=1`)
            .then((response) => {
              let res = response.dados.map(function(elem) {
                elem.tipo = 'P'
                elem.label = elem.nome
                return elem;
              })
              this.pesquisaItems = res;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  },
  methods: {
    logout(){
      this.$store.dispatch('login/userLogout', {
        router: this.$router
      })
    },
    customFiltro(item, queryText){
      if(item.tipo == 'P') {
        const textOne = item.nome.toLowerCase()
        const textTwo = item.nome_mae.toLowerCase()
        const textThree = item.registro_hc?.toLowerCase()
        const searchText = queryText.toLowerCase()
        return textOne?.indexOf(searchText) > -1 || textTwo?.indexOf(searchText) > -1 || textThree?.indexOf(searchText) > -1
      } else {
        const textOne = item.dt_inicio
        const textTwo = this.formataData(item.dt_inicio)
        return textOne.indexOf(queryText) > -1 || textTwo.indexOf(queryText) > -1
      }
    },
    clicaFiltro(val){
      if(val) {
        const item = this.pesquisaItems.filter(elem => elem.id == val)[0]
        if(item.tipo == 'P')
          this.$router.push('/paciente/' + val)
        else if(item.tipo == 'C')
          this.$router.push('/?cid=' + val)
      }
    },
    formataData(data) {
      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    },
    formataData2(data) {
      const [dia, mes, ano] = data.split("/");
      return `${ano}-${mes}-${dia}`;
    }
  }
}
</script>

<style>
  .main{
    background: #F2F2F0 !important;
    height: 100%;
    width: 100%;
    padding:0;
    margin:0;
    top:0;
    left:0;
    position: fixed;
  }
  .main-header{
    background: #fff;
    box-shadow: 1px 1px 10px rgb(194, 194, 194);
    margin-bottom: 10px;
  }
  .main-input{
    background: #F2F2F0;
    border-radius: 10px;
    padding: 5px 10px;
  }
  .main-menu{
    list-style: none;
    margin-top: 5px;

  }
  .main-menu-link{
    color: #000 !important;
  }
  .main-menu-link:hover{
    font-weight: bold;
  }
  .main-menu a{
    text-decoration: none;
    color: inherit;
  }
  .main-menu li{
    position: relative;
    display: inline;
    margin-right: 5px;
  }
  .main-menu li:nth-child(4) svg{
    position: absolute;
    left: 10px;
    transform: translateY(-10%);
    margin-top: 5px;
  }
  .main-menu-user{
    position: absolute;
  }
</style>
