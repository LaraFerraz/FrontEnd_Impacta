const {
  Usuario,
  Projeto,
  Favoritos,
  Participacoes
} = require('../middleware/models');

const getStats = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.count();
    const totalProjetos = await Projeto.count();
    const totalFavoritos = await Favoritos.count();
    const totalParticipacoes = await Participacoes.count();

    return res.json({
      usuarios: totalUsuarios,
      projetos: totalProjetos,
      favoritos: totalFavoritos,
      participacoes: totalParticipacoes
    });
  } catch (error) {
    console.error('ERRO DASHBOARD:', error);

    return res.status(500).json({
      message: 'Erro ao carregar dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getStats
};