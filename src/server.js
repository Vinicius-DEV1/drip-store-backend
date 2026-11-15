require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco MySQL com sucesso');
  } catch (error) {
    console.error('Erro ao conectar no MySQL:', error.message);
  }
});
