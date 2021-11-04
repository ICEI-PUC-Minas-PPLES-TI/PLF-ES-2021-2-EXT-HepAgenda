const multer = require("multer");
const { extensoesPermitidas } = require("./Extensoes");
const path = require("path");

const armazenamento = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./api/uploads");
  },

  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueSuffix + path.extname(file.originalname).toLowerCase()
    ); /* Tipo do arquivo/campo + data em unix time com número aleatório + a extensão do arquivo */
  }
});

const upload = multer({
  storage: armazenamento,
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname).toLowerCase();
    if (!extensoesPermitidas.includes(ext)) {
      return callback(
        new Error(
          `Somente estas extensões de arquivos são permitidas: ${extensoesPermitidas}`
        )
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2 * 1000000 /* Em bytes, 1 megabyte == 1000000 */
  }
});

module.exports = {
  upload
};
