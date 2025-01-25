require('dotenv').config();
const app = require('./src/app'); // Importa o app de dentro da pasta src
const PORT = process.env.PORT;

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
