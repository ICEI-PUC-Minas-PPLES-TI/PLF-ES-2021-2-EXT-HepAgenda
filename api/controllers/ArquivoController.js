const path = require("path");
const ArquivoService = require("../services/ArquivoService");

class ArquivoController {
  async download(request, response) {
    const arquivoService = new ArquivoService();
    const arquivo = await arquivoService.findById(request.params.id);

    const arquivoDir = path.resolve(process.cwd(), arquivo.dataValues.link);
    return response.download(arquivoDir);
  }

  async delete(request, response) {
    const arquivoService = new ArquivoService();
    await arquivoService.deleteById(request.params.id);

    return response.status(204).json();
  }
}

module.exports = ArquivoController;
