const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db/cars_db.js');
const { usuarios } = require('../db/db.js'); // ajuste o caminho se precisar


const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res.status(404).json({ mensage: "Preencha os dados corretamente" });
    }

    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuário não encontrado" });
    }

    const senhaValida = bcrypt.compareSync(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Senha inválida" });
    }

    // Aqui você pode gerar um token se quiser:
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, "segredoFord", {
      expiresIn: 3600 // 1 hora
    });

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      },
      token
    });

    
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ mensage: "Erro interno" });
  }
};

module.exports = login;
