// Contratos (JSON Schema) das respostas validadas.

const usuarioSchema = {
  type: 'object',
  required: ['message', '_id'],
  properties: {
    message: { type: 'string' },
    _id: { type: 'string' },
  },
};

const loginSchema = {
  type: 'object',
  required: ['message', 'authorization'],
  properties: {
    message: { type: 'string' },
    authorization: {
      type: 'string',
      pattern: '^Bearer .+',
    },
  },
};

module.exports = { usuarioSchema, loginSchema };