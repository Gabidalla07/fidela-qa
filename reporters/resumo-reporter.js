// Gera reports/ULTIMA-EXECUCAO.md com data/hora (Brasília) e resultado de cada teste.
const fs = require('fs');

class ResumoReporter {
  constructor() {
    this.testes = new Map();
  }

  onTestEnd(test, result) {
    // Em caso de retry, a última tentativa sobrescreve a anterior.
    this.testes.set(test.id, {
      nome: test.titlePath().filter(Boolean).join(' › '),
      status: result.status,
      duracao: result.duration,
    });
  }

  onEnd(result) {
    const lista = [...this.testes.values()];
    const total = lista.length;
    const passou = lista.filter((t) => t.status === 'passed').length;
    const falhou = lista.filter((t) => t.status !== 'passed').length;
    const agora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const linhas = [
      '# Relatório da última execução',
      '',
      `- **Data/hora (Brasília):** ${agora}`,
      `- **Resultado geral:** ${result.status}`,
      `- **Total:** ${total} | **Passaram:** ${passou} | **Falharam:** ${falhou}`,
      `- **Duração total:** ${(result.duration / 1000).toFixed(1)} s`,
      '',
      '| Teste | Status | Duração (ms) |',
      '| --- | --- | --- |',
      ...lista.map((t) => `| ${t.nome} | ${t.status} | ${t.duracao} |`),
      '',
    ];

    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync('reports/ULTIMA-EXECUCAO.md', linhas.join('\n'));
  }
}

module.exports = ResumoReporter;
