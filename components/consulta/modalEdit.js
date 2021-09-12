export default {
    name: 'modalEdit',
    props: ['value'],
    data() {
        return {
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dataConsulta: '01/01/1111',
            paciente: {
                nome: 'João Silva',
                dataNascimento: '11/11/1111 - 55 Anos',
                mae: 'Neide Braulia',
                registroHc: 'XXXXX XX',
            },
            historico: {
                mensagem: ['Usuario x1 alterou o status do atendimento para aguardando consulta',
                        'Usuario x2 alterou o status do atendimento para aguardando consulta',
                        'Usuario x3 alterou o status do atendimento para aguardando consulta'],
                data: ['01/01/11 11:11', '01/01/11 11:12', '01/01/11 11:13']
            },
            descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at dignissim orci. Mauris aliquet est diam, ac tincidunt ipsum tristique a.Cras ut pretium metus',
            status: '',
            medico: '',
            menuDataConsulta: false

        }
    },
    computed: {
        items() {
            const mensagemLenght = this.historico.mensagem.length

            return Array.from({ length: mensagemLenght }, (k, v) => {
                const mensagem = this.historico.mensagem[v]
                const data = this.historico.data[v]

                return {
                    mensagem: `${mensagem}`,
                    data: `${data}`
                }
            })
        },

    },
    mounted() {
        //this.listaPacientes();
    },
    methods: {
        formatDate(date) {
            if (!date) return null
            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        editConsulta() {

        }

    }
}