// Contratos (JSON Schema) das respostas validadas.
const usuarioSchema = {
  type: 'object',
  required: ['nome', 'email', 'password', 'administrador', '_id'],
  properties: {
    nome: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    administrador: { type: 'string', enum: ['true', 'false'] },
    _id: { type: 'string' },
  },
};

const loginSchema = {
  type: 'object',
  required: ['message', 'authorization'],
  properties: {
    message: { type: 'string' },
    authorization: { type: 'string', pattern: '^Bearer .+' },
  },
};

module.exports = { usuarioSchema, loginSchema };
