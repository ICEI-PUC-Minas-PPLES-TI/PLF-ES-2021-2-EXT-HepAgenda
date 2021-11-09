const Arquivo = require("../models/Arquivo");
global.__basedir = __dirname;
class ArquivoService {
  async create(consulta_id, arquivos) {
    arquivos.forEach(async arquivo => {
      // c/onsole.log(consulta_id, arquivo.originalname, arquivo.path);
      await Arquivo.create({
        consulta_id: consulta_id,
        nome: arquivo.originalname,
        link: arquivo.path
      });
    });
  }

  async findById(arquivo_id) {
    const arquivo = await Arquivo.findOne({
      where: {
        id: arquivo_id
      }
    });
    return arquivo;
  }
}

module.exports = ArquivoService;
