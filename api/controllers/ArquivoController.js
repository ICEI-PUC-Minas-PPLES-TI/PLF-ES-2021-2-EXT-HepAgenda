const Arquivo = require("../models/Arquivo");
const path = require("path");
const AppError = require("../errors/AppError");

class ArquivoController {
  async download(request, response) {
    const arquivo = await Arquivo.findOne({
      where: {
        id: request.params.id
      }
    });

    if (!arquivo) throw new AppError("Arquivo não encontrado!", 404, ["'id' do arquivo não encontrado!"]);

    const arquivoDir = path.resolve(process.cwd(), arquivo.dataValues.link);

    return response.download(arquivoDir);
  }
}

module.exports = ArquivoController;
