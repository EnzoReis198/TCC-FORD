const bcrypt = require('bcrypt');

// Criação de senhas criptografadas simuladas
const usuarios = [
  {
    id: 1,
    nome: "Administrador Ford",
    email: "admin@ford.com",
    senhaHash: bcrypt.hashSync("123456", 8),
    role: "admin"
  },
  {
    id: 2,
    nome: "João Motorista",
    email: "joao@ford.com",
    senhaHash: bcrypt.hashSync("senha123", 8),
    role: "user"
  },
  {
    id: 3,
    nome: "Maria Técnica",
    email: "maria@ford.com",
    senhaHash: bcrypt.hashSync("fordtech", 8),
    role: "tecnico"
  }
];

module.exports = { usuarios };
