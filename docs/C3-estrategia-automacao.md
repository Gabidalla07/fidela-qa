# C3 — Estratégia de automação

**O que automatizar primeiro** (em uma suíte de regressão predominantemente manual), por ordem de prioridade:

1. **Risco e impacto no negócio:** fluxos que, se quebrarem, geram perda financeira, de dados ou de confiança (por exemplo, acúmulo e resgate de pontos, login, cadastro).
2. **Frequência de execução:** cenários rodados a cada entrega (smoke) trazem retorno mais rápido.
3. **Histórico de defeitos:** áreas com defeitos recorrentes ou regressões já ocorridas.
4. **Estabilidade e determinismo:** regras claras, dados controláveis e resultado objetivo.
5. **Custo de manter:** começar por API e regras de negócio (rápidas e estáveis) antes de fluxos longos de interface (lentos e frágeis).

**O que manter manual:** exploração e usabilidade, cenários executados raramente, funcionalidades ainda instáveis ou em mudança, cenários que dependem de julgamento humano (layout, textos) e cenários cujo custo de automação supera o ganho.

**Como saber se a automação gera valor:**

- Tempo de regressão antes vs. depois (horas de execução manual economizadas).
- Defeitos encontrados pela automação antes da homologação e escapes para produção.
- Taxa de testes instáveis (flaky) e tempo gasto em manutenção (se manutenção consome mais do que economiza, o critério de seleção precisa ser revisto).
- Cobertura dos riscos críticos, não o número de testes.
- Frequência de execução (suíte que ninguém roda não gera valor): idealmente em todo build, via pipeline.
