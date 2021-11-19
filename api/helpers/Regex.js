const telefoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

/*
  /^
    (?=.*\d)          // deve ter no mínimo 1 número
    (?=.*[a-z])       // deve ter no mínimo 1 letra minúscula
    (?=.*[A-Z])       // deve ter no mínimo 1 letra maiúscula
    [a-zA-Z0-9]{8,}   // deve ter no mínimo 8 caracteres alfanuméricos
  $/
*/
const senhaRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

module.exports = {
  telefoneRegExp,
  senhaRegEx
};
