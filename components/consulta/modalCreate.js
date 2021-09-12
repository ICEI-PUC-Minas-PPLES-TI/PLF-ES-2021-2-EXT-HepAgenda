export default {
    name: 'modalCreate',
    props: ['value'],
    data() {
        return {
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dataConsulta: '',
            paciente:'',
            medico:'',
            descricao:'',
            menuDataConsulta:false

        }
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
        marcaConsulta(data){
            
        }

    }
}