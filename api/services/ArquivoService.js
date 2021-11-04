const AppError = require("../errors/AppError");
const Arquivo = require("../models/Arquivo");

const fs = require('fs')
global.__basedir = __dirname;

class ArquivoService {

  async create(consulta_id, arquivos) {
    arquivos.forEach(async arquivo => {
      await Arquivo.create({
        consulta_id: consulta_id,
        nome: arquivo.originalname,
        link: arquivo.path
      });
    });
  }

  async findById(id) {
    const arquivo = await Arquivo.findOne({
      where: {
        id: id
      }
    });

    if (!arquivo) throw new AppError("Arquivo não encontrado!", 404);

    return arquivo;
  }

  async deleteById(id) {
    const arquivo = await this.findById(id);
    
    // Deletando o arquivo binário
    fs.unlink(arquivo.dataValues.link, (erro) => {
      if (erro) {
        throw new AppError("Erro ao deletar o arquivo!" + erro, 500);
      }
    })

    // Removendo do banco de dados
    arquivo.destroy();
  }
}

module.exports = ArquivoService;
