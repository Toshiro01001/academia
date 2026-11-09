# Vistoria de segurança: Anilha Academia

Feita em 08/11/2026 sobre o código desta pasta. Site estático, sem servidor, sem banco de dados e sem contas reais.

## O que foi verificado

| Ponto | Resultado |
| --- | --- |
| Política de segurança de conteúdo (CSP) | Em todas as páginas: `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `connect-src 'none'`, `form-action 'none'`, `object-src 'none'`, `base-uri 'none'`. A 404 usa `script-src 'none'`. |
| Script e estilo inline | Nenhum. Não há atributo `style=`, nem `<script>` com código, nem `onclick`. O JavaScript cria elementos com `textContent`, nunca com `innerHTML` a partir de texto digitado. |
| Envio de dados | Nenhum. Não existe `fetch`, `XMLHttpRequest`, `WebSocket` nem `<form action>`. O teste automático falha se qualquer pedido sair do próprio site. |
| Recursos externos | Nenhum. Fontes, imagens e scripts são locais. O único link externo é para https://mileumalinhas.com.br. |
| Dependências | Nenhuma (nem em produção, nem no site). O teste usa Playwright, que não é publicado com o site. |
| Segredos | Nenhuma chave, token ou senha real. O login da área do aluno (`aluno.demo` e `treino-demo`) é de demonstração, está visível na tela e não protege nada. |
| Dados pessoais | A matrícula não grava nada: o resumo some ao recarregar a página. O aviso na tela pede dados inventados. |

## O que fica no localStorage

| Chave | Conteúdo | Para quê |
| --- | --- | --- |
| `anilha.reservas` | Lista de códigos de aulas reservadas, como `1-0600-funcional` | Manter as reservas ao recarregar |
| `anilha.presencas` | Datas (AAAA-MM-DD) das presenças marcadas, no máximo 60 | Mostrar a semana na área do aluno |
| `anilha.plano` | Resumo do plano montado: modalidades, frequência, período, pessoas e valores | Preencher a matrícula e a área do aluno |

Nada disso é dado pessoal. Se o navegador bloquear o `localStorage`, o site continua funcionando só com a memória da página.

## Riscos residuais

- O login de demonstração é só visual: qualquer pessoa vê a senha no código. É proposital e não há nada a proteger.
- Quem abrir o console do navegador pode alterar as chaves acima. Só afeta o próprio navegador.
- O cálculo de preço roda no navegador. Num site real, o valor cobrado teria de ser recalculado no servidor.
- Se este modelo for adaptado para uma academia de verdade, será preciso HTTPS, servidor para matrículas e pagamentos, política de privacidade (LGPD) e cuidado especial com dados de saúde.

## Revisão de 08/11/2026 (leva final de design)

Revisão feita depois de aplicar os design systems da leva final e encaixar as fotos geradas por IA no Canva.

- **CSP:** a política do `index.html` é a mesma de antes da leva (conferida linha a linha). Continua sem `unsafe-inline`, sem `unsafe-eval` e sem origem externa.
- **Script e estilo inline:** nenhum `<script>` inline, nenhum `<style>` e nenhum atributo `style` nas páginas. Os efeitos novos mudam só classes, `textContent` e propriedades CSS pelo CSSOM, que a CSP permite.
- **Recursos externos:** nenhum script, fonte, imagem ou folha de estilo de fora. Os únicos links externos são de navegação comum (mileumalinhas.com.br e o perfil do GitHub).
- **Bibliotecas:** nenhuma entrou. Movimento, vidro, contadores e revelação ao rolar são CSS e JavaScript escritos à mão, desligados com `prefers-reduced-motion`.
- **innerHTML:** nenhum uso no JavaScript.
- **eval e Function:** nenhum uso.
- **Armazenamento:** `localStorage` continua só com o que já existia (`anilha.reservas`, `anilha.presencas` e `anilha.plano`), sem chave nova nesta leva.
- **Dados pessoais:** nenhum dado pessoal real entrou. Pessoas, empresas, telefones e endereços seguem fictícios. As fotos não retratam pessoas reais.
- **Imagens:** arquivos webp locais em `img/`, com `width`/`height`, `loading="lazy"` e `decoding="async"`. Nenhuma é carregada de outro domínio.
- **Testes:** `tests/site.cjs` passa em 1280x900, iPhone 13 e 320px, sem erro de console e sem rolagem horizontal.
