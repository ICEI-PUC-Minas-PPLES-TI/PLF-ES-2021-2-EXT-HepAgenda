const yup = require('yup');
const { telefoneRegExp } = require('../helpers/Regex');

const hepatiteRequiredScheme = yup.object().shape({
    fibrose: yup.mixed().oneOf(['F0', 'F1', 'F2', 'F3', 'F4', 'F5',null]),
    cirrotico: yup.boolean().required("Cirrótico obrigatória!"),
    portador_inativo: yup.boolean().required("Portador Inativo obrigatória!"),
})

const hepatiteCCreateScheme = yup.object().shape({
    tratamento_id: yup.number(),
    fibrose: yup.mixed().oneOf(['F0', 'F1', 'F2', 'F3', 'F4', 'F5',null]),
    cirrotico: yup.boolean().required("cirrotico obrigatória!"),
    data_alfa: yup.date().nullable(),
    ultimo_resultado_alfa: yup.number(),
    data_antiretroviral: yup.date().nullable(),
    portador_inativo: yup.boolean().required("portador_inativo obrigatória!"),
    data_ultra: yup.date().nullable(),
    ultimo_resultado_ultra: yup.string().max(200),
    data_carga: yup.date().nullable(),
    ultimo_resultado_carga: yup.number()
});

const hepatiteBCreateScheme = yup.object().shape({
    tratamento_id: yup.number(),
    inicio_tratamento: yup.date().nullable(),
    fibrose: yup.mixed().oneOf(['F0', 'F1', 'F2', 'F3', 'F4', 'F5',null]),
    cirrotico: yup.boolean().required("cirrotico obrigatória!"),
    data_alfa: yup.date().nullable(),
    ultimo_resultado_alfa: yup.number(),
    data_antiretroviral: yup.date(),
    portador_inativo: yup.boolean().required("portador_inativo obrigatória!"),
    data_ultra: yup.date(),
    ultimo_resultado_ultra: yup.string().max(200),
    data_carga: yup.date(),
    ultimo_resultado_carga: yup.number()
})

const pacienteCreateScheme = yup.object({
    nome: yup.string().max(120).required("nome obrigatório!"),
    data_nascimento: yup.date().required("data_nascimento obrigatória!"),
    registro_hc: yup.string().max(20).required("registro_hc obrigatório!"),
    sexo: yup.mixed().oneOf(['M', 'F']).required("sexo obrigatório!"),
    telefone: yup.string().max(15).matches(telefoneRegExp).required("telefone obrigatório!"),
    nome_mae: yup.string().max(120).required("nome_mae obrigatório!"),
    email: yup.string().email().max(50).nullable(),
    peso: yup.number().min(0).nullable(),
    altura: yup.number().min(0).nullable(),
    desfecho: yup.number().nullable(),
    comorbidade: yup.mixed().oneOf(['HEPB', 'HEPC', 'AMBAS', 'OUTRO']).nullable()
}).concat(yup.object().shape({
    hepatiteb: hepatiteBCreateScheme.default(null).nullable(),
    hepatitec: yup.array().of( hepatiteCCreateScheme )
}))

const hepatiteCUpdateScheme = yup.object().shape({
    tratamento_id: yup.number(),
    fibrose: yup.mixed().oneOf(['F0', 'F1', 'F2', 'F3', 'F4', 'F5',null]),
    cirrotico: yup.boolean().required("cirrotico obrigatória!"),
    data_alfa: yup.date(),
    ultimo_resultado_alfa: yup.number(),
    data_antiretroviral: yup.date(),
    portador_inativo: yup.boolean().required("portador_inativo obrigatória!"),
    data_ultra: yup.date(),
    ultimo_resultado_ultra: yup.string().max(200),
    data_carga: yup.date(),
    ultimo_resultado_carga: yup.number()
});

const hepatiteBUpdateScheme = yup.object().shape({
    tratamento_id: yup.number(),
    inicio_tratamento: yup.date(),
    fibrose: yup.mixed().oneOf(['F0', 'F1', 'F2', 'F3', 'F4', 'F5',null]),
    cirrotico: yup.boolean().required("cirrotico obrigatória!"),
    data_alfa: yup.date(),
    ultimo_resultado_alfa: yup.number(),
    data_antiretroviral: yup.date(),
    portador_inativo: yup.boolean().required("portador_inativo obrigatória!"),
    data_ultra: yup.date(),
    ultimo_resultado_ultra: yup.string().max(200),
    data_carga: yup.date(),
    ultimo_resultado_carga: yup.number()
})

const pacienteUpdateScheme = yup.object({
    nome: yup.string().max(120),
    data_nascimento: yup.date(),
    registro_hc: yup.string().max(20),
    sexo: yup.mixed().oneOf(['M', 'F']),
    telefone: yup.string().max(15).matches(telefoneRegExp),
    nome_mae: yup.string().max(120),
    email: yup.string().email().max(50),
    peso: yup.number().min(0),
    altura: yup.number().min(0),
    desfecho: yup.number(),
    comorbidade: yup.mixed().oneOf(['HEPB', 'HEPC', 'AMBAS', 'OUTRO']).nullable()
}).concat(yup.object().shape({
    hepatiteb: hepatiteBUpdateScheme.default(null).nullable(),
    hepatitec: yup.array().of( hepatiteCUpdateScheme )
}))

module.exports = {
    pacienteCreateScheme,
    pacienteUpdateScheme,

    hepatiteRequiredScheme
}