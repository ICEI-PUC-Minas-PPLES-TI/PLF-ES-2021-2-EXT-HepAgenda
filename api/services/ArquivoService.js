const Arquivo = require("../models/Arquivo");

class ArquivoService {
  async create(consulta_id, arquivos) {
    arquivos.forEach(async (arquivo) => {
      console.log(consulta_id, arquivo.originalname, arquivo.path);
      await Arquivo.create({
        consulta_id: consulta_id,
        nome: arquivo.originalname,
        link: arquivo.path
      });
    });
  }
}

module.exports = ArquivoService;
