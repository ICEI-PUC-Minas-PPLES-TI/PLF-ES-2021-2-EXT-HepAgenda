<template>
    <v-dialog
        v-model="value"
        scrollable
        max-width="500px"
        transition="dialog-bottom-transition"
        @click:outside="$emit('input', false)"
        @keydown.esc="$emit('input', false)"
    >
        <v-card>
            <v-card-title>
                <span class="text-h5">Criar novo usuário</span>
            </v-card-title>
            <!--NOME-->
            <v-card-text>
                <v-col class="img" cols="12" sm="6" md="12">
                    <svg
                        class="pos"
                        width="308"
                        height="104"
                        viewBox="0 0 308 104"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M77.0508 60.3644H83.7627C84.1487 60.3644 84.5844 60.575 84.937 60.9489C85.2878 61.321 85.5 61.7966 85.5 62.2373V68.7627C85.5 69.2034 85.2878 69.679 84.937 70.0511C84.5844 70.425 84.1487 70.6356 83.7627 70.6356H77.0508C76.3182 70.6356 75.6353 71.0182 75.1489 71.5341C74.6607 72.0519 74.3136 72.7628 74.3136 73.5085V80.6272C74.3136 81.0679 74.1014 81.5434 73.7506 81.9155C73.398 82.2894 72.9623 82.5 72.5762 82.5H66.4238C66.0377 82.5 65.602 82.2894 65.2494 81.9155C64.8986 81.5434 64.6864 81.0679 64.6864 80.6272V73.5085C64.6864 72.7628 64.3393 72.0519 63.8511 71.5341C63.3647 71.0182 62.6818 70.6356 61.9492 70.6356H55.2373C54.8513 70.6356 54.4156 70.425 54.063 70.0511C53.7122 69.679 53.5 69.2034 53.5 68.7627V62.2373C53.5 61.7966 53.7122 61.321 54.063 60.9489C54.4156 60.575 54.8513 60.3644 55.2373 60.3644H61.9492C62.6818 60.3644 63.3647 59.9818 63.8511 59.4659C64.3393 58.9481 64.6864 58.2372 64.6864 57.4915V50.3728C64.6864 49.9321 64.8986 49.4566 65.2494 49.0845C65.602 48.7106 66.0377 48.5 66.4238 48.5H72.5762C72.9623 48.5 73.398 48.7106 73.7506 49.0845C74.1014 49.4566 74.3136 49.9321 74.3136 50.3728V57.4915C74.3136 58.2372 74.6607 58.9481 75.1489 59.4659C75.6353 59.9818 76.3182 60.3644 77.0508 60.3644Z"
                            fill="white"
                            stroke="#008BD9"
                        />
                        <path
                            d="M295.254 27.4492H304.813C305.436 27.4492 306.109 27.7863 306.64 28.3509C307.169 28.9135 307.5 29.6435 307.5 30.339V39.661C307.5 40.3565 307.169 41.0865 306.64 41.6491C306.109 42.2137 305.436 42.5508 304.813 42.5508H295.254C294.284 42.5508 293.363 43.0611 292.699 43.7677C292.033 44.4763 291.568 45.4412 291.568 46.4407V56.6102C291.568 57.3057 291.237 58.0356 290.708 58.5982C290.177 59.1628 289.504 59.5 288.881 59.5H280.119C279.496 59.5 278.823 59.1628 278.292 58.5982C277.763 58.0356 277.432 57.3057 277.432 56.6102V46.4407C277.432 45.4412 276.967 44.4763 276.301 43.7677C275.637 43.0611 274.716 42.5508 273.746 42.5508H264.187C263.564 42.5508 262.891 42.2137 262.36 41.6491C261.831 41.0865 261.5 40.3565 261.5 39.661V30.339C261.5 29.6435 261.831 28.9135 262.36 28.3509C262.891 27.7863 263.564 27.4492 264.187 27.4492H273.746C274.716 27.4492 275.637 26.9389 276.301 26.2323C276.967 25.5237 277.432 24.5588 277.432 23.5593V13.3898C277.432 12.6943 277.763 11.9644 278.292 11.4018C278.823 10.8372 279.496 10.5 280.119 10.5H288.881C289.504 10.5 290.177 10.8372 290.708 11.4018C291.237 11.9644 291.568 12.6943 291.568 13.3898V23.5593C291.568 24.5588 292.033 25.5237 292.699 26.2323C293.363 26.9389 294.284 27.4492 295.254 27.4492Z"
                            fill="white"
                            stroke="#008BD9"
                        />
                        <path
                            d="M32.767 20.6311H41.9418C43.1164 20.6311 44 21.5023 44 22.7573V31.2427C44 32.4977 43.1164 33.3689 41.9418 33.3689H32.767C30.4465 33.3689 28.7088 35.1773 28.7088 37.4951V46.8738C28.7088 48.1287 27.8252 49 26.6505 49H18.3495C17.1748 49 16.2913 48.1287 16.2913 46.8738V37.4951C16.2913 35.1773 14.5535 33.3689 12.233 33.3689H3.05825C1.88359 33.3689 1.00001 32.4977 1.00001 31.2427V22.7573C1.00001 21.5023 1.88359 20.6311 3.05825 20.6311H12.233C14.5535 20.6311 16.2913 18.8227 16.2913 16.5049V7.12623C16.2913 5.87126 17.1748 5 18.3495 5H26.6505C27.8252 5 28.7088 5.87126 28.7088 7.12623V16.5049C28.7088 18.8227 30.4465 20.6311 32.767 20.6311Z"
                            stroke="#00BA34"
                            stroke-width="2"
                        />
                        <circle cx="157" cy="52" r="50" stroke="#008BD9" stroke-width="4" />
                        <path
                            d="M136.491 74.6318C136.483 74.6315 136.465 74.6307 136.44 74.6289C136.381 74.6247 136.283 74.6152 136.161 74.5949C135.907 74.5526 135.599 74.4717 135.315 74.3298C135.04 74.1919 134.825 74.0163 134.674 73.7905C134.532 73.5772 134.368 73.2029 134.368 72.5265C134.368 70.9874 135.196 67.396 138.401 64.1908C141.548 61.0441 147.159 58.1055 157 58.1055C166.841 58.1055 172.452 61.0441 175.599 64.1908C178.804 67.396 179.632 70.9874 179.632 72.5265C179.632 73.2029 179.468 73.5772 179.326 73.7905C179.175 74.0163 178.96 74.1919 178.685 74.3298C178.401 74.4717 178.093 74.5526 177.839 74.5949C177.717 74.6152 177.619 74.6247 177.56 74.6289C177.535 74.6307 177.517 74.6315 177.509 74.6318H136.491ZM164.294 46.9788C162.36 48.9134 159.736 50.0002 157 50.0002C154.264 50.0002 151.64 48.9134 149.706 46.9788C147.771 45.0442 146.684 42.4204 146.684 39.6844C146.684 36.9485 147.771 34.3247 149.706 32.3901C151.64 30.4555 154.264 29.3687 157 29.3687C159.736 29.3687 162.36 30.4555 164.294 32.3901C166.229 34.3247 167.316 36.9485 167.316 39.6844C167.316 42.4204 166.229 45.0442 164.294 46.9788Z"
                            stroke="#008BD9"
                            stroke-width="4"
                        />
                        <path
                            d="M245.966 77.3814H253.491C253.951 77.3814 254.456 77.6228 254.858 78.0353C255.259 78.4468 255.5 78.9715 255.5 79.4576V86.5424C255.5 87.0285 255.259 87.5532 254.858 87.9647C254.456 88.3772 253.951 88.6186 253.491 88.6186H245.966C245.172 88.6186 244.422 89.0212 243.883 89.5749C243.343 90.1294 242.958 90.8929 242.958 91.6949V99.4238C242.958 99.9099 242.716 100.435 242.315 100.846C241.914 101.259 241.409 101.5 240.949 101.5H234.051C233.591 101.5 233.086 101.259 232.685 100.846C232.284 100.435 232.042 99.9099 232.042 99.4238V91.6949C232.042 90.8929 231.657 90.1294 231.117 89.5749C230.578 89.0212 229.828 88.6186 229.034 88.6186H221.509C221.049 88.6186 220.544 88.3772 220.142 87.9647C219.741 87.5532 219.5 87.0285 219.5 86.5424V79.4576C219.5 78.9715 219.741 78.4468 220.142 78.0353C220.544 77.6228 221.049 77.3814 221.509 77.3814H229.034C229.828 77.3814 230.578 76.9788 231.117 76.4251C231.657 75.8706 232.042 75.1071 232.042 74.3051V66.5762C232.042 66.0901 232.284 65.5655 232.685 65.1539C233.086 64.7415 233.591 64.5 234.051 64.5H240.949C241.409 64.5 241.914 64.7415 242.315 65.1539C242.716 65.5655 242.958 66.0901 242.958 66.5762V74.3051C242.958 75.1071 243.343 75.8706 243.883 76.4251C244.422 76.9788 245.172 77.3814 245.966 77.3814Z"
                            stroke="#00BA34"
                        />
                    </svg>
                </v-col>
                <v-container>
                    <v-form ref="formData" lazy-validation class="formData">
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                    dense
                                    hide-details="auto"
                                    v-model="formData.nome"
                                    label="NOME"
                                    outlined
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-col>
                            <!--LOGIN-->
                            <v-col cols="12" sm="12">
                                <v-text-field
                                    dense
                                    hide-details="auto"
                                    v-model="formData.email"
                                    label="EMAIL"
                                    outlined
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-col>
                            <!--SENHA-->
                            <v-col cols="12" sm="12">
                                <v-text-field
                                    dense
                                    v-model="formData.senha"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[rules.required, rules.min]"
                                    :type="show1 ? 'text' : 'password'"
                                    label="SENHA"
                                    hint="Pelo menos 8 caracteres, 1 número, 1 letra minúscula e 1 letra maiúscula"
                                    hide-details="auto"
                                    @click:append="show1 = !show1"
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <!--FIM CONFIRMAR SENHA-->
                            <v-col cols="12" sm="12">
                                <v-text-field
                                    dense
                                    hide-details="auto"
                                    v-model="formData.telefone"
                                    label="TELEFONE"
                                    outlined
                                    v-mask="['(##) ####-####', '(##) #####-####']"
                                    :rules="[(v) => (v || '' ).length <= 15 || 'Maximo de 15 caracteres']"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-select
                                    :items="[
                                        {
                                            value: 'A',
                                            text: 'Administrador'
                                        },
                                        {
                                            value: 'M',
                                            text: 'Médico'
                                        },
                                        {
                                            value: 'V',
                                            text: 'Visualizador'
                                        }
                                    ]"
                                    label="TIPO"
                                    v-model="formData.tipo"
                                    :hide-details="true"
                                    outlined
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-menu
                                    v-model="menuExpira"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="formData.data_expira"
                                    outlined
                                    :hide-details="true"
                                    label="Data de Expiração (Opcional)"
                                    clearable
                                    type="date"
                                    max="3000-01-01"
                                    @click:clear="formData.data_expira = null"
                                    >
                                    <span slot="append">
                                        <v-icon v-bind="attrs" v-on="on">
                                        mdi-calendar
                                        </v-icon>
                                    </span>
                                    </v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="formData.data_expira"
                                    @input="menuExpira = false"
                                ></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <br>
                    </v-form>
                    <!--BOTAO-->
                    <v-row class="mb-6" no-gutters>
                        <v-btn color="#008BD9" large block @click="criarUsuario">
                            <h3 class="w">Criar usuário</h3>
                        </v-btn>
                    </v-row>
                </v-container>
                <!-- <small>*indicates required field</small> -->
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mask} from 'vue-the-mask'
export default {
    name: "modal-usuario",
    props: ["value"],
    /*SENHA*/
    directives: {mask},
    data() {
        return {
            show1: false,
            show2: false,
            menuExpira: false,
            formData: {
                nome: null,
                email: null,
                senha: null,
                data_expira: null,
                tipo: "",
                telefone: null
            },
            rules: {
                required: value => !!value || "Obrigatório!",
                min: v => {
                    if (
                        v &&
                        v.length >= 8 &&
                        /\d/.test(v) &&
                        /[a-z]/g.test(v) &&
                        /[A-Z]/g.test(v)
                    )
                        return true;
                    else
                        return "Min 8 caracteres, 1 número, 1 letra minúscula e 1 letra maiúscula";
                }
            }
        };
    },
    watch:{
        value(val){
            if(this.$refs.formData){
                this.$refs.formData.reset()
            }
        }
    },
    methods: {
        limparDados() {
            this.formData = {
                nome: null,
                email: null,
                senha: null,
                tipo: " "
            }
        },
        criarUsuario() {
            if (this.$refs.formData.validate()){
                if(this.formData.telefone)
                    this.formData.telefone = this.formData.telefone.replace(/\D/g,'')

                this.$axios
                    .post("/usuario", this.formData)
                    .then(res => {
                        this.limparDados();
                        this.$emit('input', false)
                        this.$emit('listaUsuarios')
                        this.$emit('toast', "Usuario Cadastrado com sucesso!")
                    })
                    .catch(err => {
                        console.log(err.response.data);
                        this.$Message.alert(err.response.data.message, 'Erro', { type: 'error', msgBody: { style: { width: '30%' } } })
                    });
            }
        }
    }
}
</script>

<style>
.img {
    text-align: center;
}
.formData input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>
