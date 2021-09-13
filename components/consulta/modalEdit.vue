<template>
<v-dialog v-model="value" transition="dialog-bottom-transition" class="consulta-modal" @click:outside="$emit('input', false)" @keydown.esc="$emit('input', false)">
    <v-card>
        <v-card-title class="text-h5 consulta-modal-title">
            <h4>
                <span>
                    Consulta #1
                </span>
            </h4>

            <v-btn icon @click="$emit('input', false)">
                <v-icon>mdi-close</v-icon>
            </v-btn>

        </v-card-title>
        <v-card-text>
            <v-container fluid id="input-usage">
                <v-form>
                    <!-- paciente -->
                    <v-row>
                        <v-col :md="8" :sm="12" :xl="8" cols="12">
                            <v-row class="mt-0">
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-input :messages="paciente.nome" label="Paciente">
                                    </v-input>
                                </v-col>
                            </v-row>
                            <!-- Data da consulta -->
                            <v-row>
                                <v-col :md="12" :sm="12" :xl="2" cols="12">
                                    <v-input :messages="dataConsulta" label="Data da consulta"></v-input>
                                </v-col>
                            </v-row>
                            <!-- Descrição -->
                            <v-row>
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-textarea row-height="10" auto-grow v-model="descricao" label="Descrição do agendamento">
                                    </v-textarea>
                                </v-col>
                            </v-row>
                            <!-- Status -->
                            <v-row class="mt-n3 mx-auto">
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-select v-model="statusAtual" :items="status" menu-props="auto" label="Status"  outlined />
                                </v-col>
                            </v-row>
                            <!-- Medico -->
                            <v-row class="mt-n3 mx-auto">
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-select v-model="medicoAtual" :items="medicos" menu-props="auto" label="Médico" outlined />
                                </v-col>
                            </v-row>
                            <!-- Relatório do atendimento -->
                            <v-row class="mt-n3 mx-auto">
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-textarea outlined label="Relatório do atendimento" auto-grow></v-textarea>
                                </v-col>
                            </v-row>

                        </v-col>
                        <!-- Linha vertical -->
                        <v-col :md="1" :sm="0" :xl="1">
                            <div class="vertical-line"></div>
                        </v-col>
                        <v-col :md="3" :sm="12" :xl="3" cols="12" class="mt-n6 mx-auto">
                            <!-- Icone -->
                            <v-row>
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <div class="text-center">
                                        <svg width="70" height="70" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.25788 26C2.25309 25.9998 2.24166 25.9994 2.22457 25.9981C2.18963 25.9957 2.13319 25.9902 2.06284 25.9785C1.91739 25.9542 1.73875 25.9076 1.57221 25.8243C1.40959 25.743 1.27739 25.6368 1.18361 25.4961C1.09401 25.3617 1 25.1375 1 24.75C1 23.8818 1.46304 21.8887 3.23836 20.1134C4.98436 18.3673 8.08589 16.75 13.5 16.75C18.9141 16.75 22.0156 18.3673 23.7616 20.1134C25.537 21.8887 26 23.8818 26 24.75C26 25.1375 25.906 25.3617 25.8164 25.4961C25.7226 25.6368 25.5904 25.743 25.4278 25.8243C25.2613 25.9076 25.0826 25.9542 24.9372 25.9785C24.8668 25.9902 24.8104 25.9957 24.7754 25.9981C24.7583 25.9994 24.7469 25.9998 24.7421 26H2.25788ZM17.5659 10.8159C16.4875 11.8942 15.025 12.5 13.5 12.5C11.975 12.5 10.5125 11.8942 9.43414 10.8159C8.3558 9.73753 7.75 8.27499 7.75 6.75C7.75 5.22501 8.3558 3.76247 9.43414 2.68414C10.5125 1.6058 11.975 1 13.5 1C15.025 1 16.4875 1.6058 17.5659 2.68414C18.6442 3.76247 19.25 5.22501 19.25 6.75C19.25 8.27499 18.6442 9.73753 17.5659 10.8159Z" stroke="black" stroke-width="1" />
                                        </svg>
                                    </div>
                                </v-col>
                            </v-row>
                            <!-- Nome -->
                            <v-row>
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-input :messages="paciente.nome" label="Paciente">
                                    </v-input>
                                </v-col>
                            </v-row>
                            <!-- Data Nascimento -->
                            <v-row>
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-input :messages="paciente.dataNascimento" label="Data de Nascimento"></v-input>
                                </v-col>
                            </v-row>
                            <!-- Mae -->
                            <v-row>
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-input :messages="paciente.mae" label="Nome da Mãe"></v-input>
                                </v-col>
                            </v-row>
                            <!-- Registro HC -->
                            <v-row>
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-input :messages="paciente.registroHc" label="Registro HC"></v-input>
                                </v-col>
                            </v-row>
                            <!-- Barra horizontal -->
                            <v-row class="mt-n6 mx-auto">
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <div class="historico-divider">
                                    </div>
                                    <v-input label="Histórico do Agendamento"></v-input>
                                </v-col>
                            </v-row>
                            <!-- historico -->
                            <v-row class="mt-0">
                                <v-col :md="12" :sm="12" :xl="12" cols="12">
                                    <v-card elevation="0" max-width="100%" class="mx-auto">
                                        <v-virtual-scroll :items="items" height="200" item-height="120">
                                            <template v-slot:default="{ item }">
                                                {{item.mensagem}}
                                                <div class="text-right">
                                                    <br>
                                                    {{item.data}}
                                                </div>
                                                <v-divider></v-divider>
                                            </template>
                                        </v-virtual-scroll>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <!-- Botão de marcarConsulta -->
                    <v-row class="mt-0">
                        <v-col class="consulta-modal-marcar text-center">
                            <v-btn color="white" large @click="editConsulta">
                                Cancelar Consulta
                            </v-btn>
                            <v-btn color="primary" large @click="editConsulta">
                                Salvar Alterações
                            </v-btn>
                        </v-col>
                    </v-row>

                </v-form>
            </v-container>
        </v-card-text>

    </v-card>
</v-dialog>
</template>

<script src="./modalEdit.js"></script>

<style>
.consulta-modal-title {
    margin-left: 40px;
}

.consulta-modal-title h4 {
    width: calc(100% - 37px);
    text-align: left;
    border-bottom: 1px solid #B7B7B7;
    line-height: 0.1em;
    margin: 20px 0 20px;
}

.vertical-line {
    border-left: 1px solid #B7B7B7;
    line-height: 0.1em;
    height: calc(100% - 50px);
    margin: auto 0 auto 40px;
}

.historico-divider {
    width: calc(100%);
    border-bottom: 1px solid #B7B7B7;
    line-height: 0.1em;
    margin: 20px 0 20px;
}

.consulta-modal-title h4 span {
    background: #fff;
    padding: 0 10px;
}

.consulta-modal-marcar .v-btn {
    border-radius: 10px;
    margin-right: 20px;
}

.consulta-modal-marcar .white {
    color: #CE4B39;
}

#input-usage .v-messages,
#input-usage .v-input__slot {
    color: black;
    font-size: 1.1em;
}
</style>
