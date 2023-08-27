const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase.json");

// Inicialize o Firebase com as credenciais corretas
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const BUCKET_NAME = "easymarket-ac275.appspot.com";

const bucket = admin.storage().bucket(BUCKET_NAME);

const uploadImage = (req, res, next) => {
  if (!req.file) return next();

  const imagem = req.file;
  const nomeArquivo = Date.now() + "." + imagem.originalname.split(".").pop();
  const file = bucket.file(nomeArquivo);

  const stream = file.createWriteStream({
    metadata: {
      contentType: imagem.mimetype,
    },
  });

  stream.on("error", (e) => {
    console.error(e);
    next(e); // Passe o erro para o próximo middleware
  });

  stream.on("finish", async () => {
    try {
      // Tornar o arquivo público
      await file.makePublic();

      // Obter a URL pública
      const firebaseUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${nomeArquivo}`;

      // Defina a URL da imagem no objeto de produto no request
      req.produtoFirebaseUrl = firebaseUrl;

      next();
    } catch (error) {
      console.error(error);
      next(error); // Passe o erro para o próximo middleware
    }
  });

  stream.end(imagem.buffer);
};

module.exports = uploadImage;
