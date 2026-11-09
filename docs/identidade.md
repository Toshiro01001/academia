# Identidade visual: Anilha Academia

Estudo curto feito antes do código. Tudo aqui é fictício: a academia, os instrutores, o endereço, os preços e as pessoas.

## Nome e posicionamento

**Anilha Academia**, academia de musculação e treino funcional de bairro em Cuiabá. Anilha é o disco de ferro que se coloca na barra: redondo, furado no meio, com o peso gravado.

Frase de posicionamento: **"Academia de bairro com plano que cabe no mês e aula com vaga contada."**

Diferença para o site `personal`: lá o cliente é uma pessoa que vende acompanhamento individual. Aqui é uma casa com porta aberta, plano mensal, grade de aulas, matrícula e área do aluno. Por isso o site fala de preço por mês, de vagas por aula e de armário, não de método de um profissional.

## Paleta

O universo é o do salão: azulejo de vestiário, piso de borracha, anilhas, número de armário. Fugimos do preto com neon ou vermelho de academia e do giz quente do site `personal`.

| Nome | Hex | Papel |
| --- | --- | --- |
| Azulejo | `#E3EAEC` | Fundo das telas claras. Um cinza-azulado frio, de parede de vestiário. |
| Rejunte claro | `#F6F9F9` | Blocos de apoio (formulários, resultados, cartões de aula). |
| Borracha | `#182024` | Texto principal e fundo das faixas escuras (grade de aulas, área do aluno, rodapé). Azul quase preto, de piso de borracha. |
| Anilha | `#4F6168` | Texto secundário e legendas. 5,3:1 sobre Azulejo e 6,1:1 sobre Rejunte claro. |
| Rejunte | `#BCC9CD` | Bordas de 1px, divisórias e anilhas vazias. Nunca usada como texto. |
| Turquesa | `#08687C` | O único destaque. Botão principal, total do plano, vaga reservada, dia selecionado. Texto branco sobre ele passa de 6:1. |
| Turquesa claro | `#7FD6E8` | O destaque nas faixas escuras (10:1 sobre Borracha). |

Regra de uso: o Turquesa aparece em um lugar por tela, no máximo dois quando um deles é o botão principal. Sem gradiente, sem sombra em cartão. Separação por linhas de 1px e pela alternância Azulejo / Borracha.

## Tipografia

Duas famílias, locais em `fonts/` (licença SIL OFL, texto da licença ao lado de cada arquivo), obtidas com `npm pack @fontsource-variable/...` e só o subconjunto latin.

- **Big Shoulders Display** (variável, peso 100 a 900): títulos, números grandes, preços, horários e as placas numeradas. Letra alta e estreita de letreiro de armazém e de placa de equipamento; os números lembram os gravados na anilha. Fica longe do "racing" e do neon.
- **Hanken Grotesk** (variável, peso 100 a 900): texto corrente, formulários, botões e legendas. Sem serifa, neutra e legível em tamanho pequeno.

Escala:

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| Título principal (h1) | Big Shoulders Display | 56px a 112px (fluido) | 800 |
| Título de seção (h2) | Big Shoulders Display | 40px a 64px | 800 |
| Subtítulo (h3) | Big Shoulders Display | 24px a 28px | 700 |
| Número grande (preço, vagas) | Big Shoulders Display | 56px a 88px, algarismos tabulares | 800 |
| Corpo | Hanken Grotesk | 17px, entrelinha 1,55 | 400 |
| Rótulo de campo e botão | Hanken Grotesk | 15px a 16px | 600 |
| Legenda e aviso | Hanken Grotesk | 13px a 14px | 500 |

Regra de peso: a Big Shoulders só em 700 e 800, e só em título ou número. A Hanken em 400, 500 e 600. Sem itálico. Caixa alta só dentro das placas numeradas.

## Layout

- Grade de 12 colunas no desktop, largura máxima de 1180px, margem lateral de 16px no celular e 40px no desktop.
- Espaçamento em múltiplos de 8: 8, 16, 24, 40, 64, 104.
- Alinhamento à esquerda em tudo. Centralização só no 404.
- Cantos: 4px nos campos e cartões (azulejo tem quina), círculo perfeito nas anilhas. Botões e campos com 48px de altura mínima.
- Cada seção começa com uma linha de 1px e o título condensado. Sem rótulo em caixa alta acima do título e sem numeração decorativa. Números só onde são dados: o número da vaga, o número do armário.

## Imagem forte

O hero tem uma fotografia (ver "Foto do hero") dentro de um contêiner 4:3. O elemento memorável do resto do site é a **anilha como unidade de contagem**: as vagas de cada aula são uma fileira de círculos furados (cheios quando ocupados, vazios quando livres) e o resultado do plano sai numa **placa de armário** numerada.

## Movimento

Um único momento na abertura: as palavras do título sobem e aparecem em sequência, e a foto entra com um leve deslize. Depois disso só respostas a ações: a placa do plano troca de número rolando, a anilha da vaga reservada preenche. Tudo desligado com `prefers-reduced-motion`.

## Foto do hero

Proporção esperada: **4:3** (1600 x 1200 px), exibida em `img/hero.webp`.

Prompt em português para o Canva:

> Fotografia editorial de produto, estilo de site premium de academia, 4:3. Uma pilha de anilhas de ferro fundido de diferentes tamanhos apoiada sobre piso de borracha cinza-azulado, ao lado de um cronômetro de parede analógico redondo e de um pó de magnésio branco espalhado de leve. Luz natural lateral suave de janela alta, sombras macias, foco nítido nas bordas das anilhas. Fundo de parede de azulejo cinza-azulado claro, quase sem textura, com um único detalhe em turquesa petróleo (uma toalha dobrada). Composição com bastante espaço livre, paleta fria e sóbria, sem preto absoluto, sem neon, sem vermelho. Sem texto, sem logotipos, sem pessoas, sem rostos, sem marcas visíveis.

## Design systems aplicados (leva final)

Dupla escolhida no catálogo da Mil e Uma Linhas!: **oemsz26-design-system** (claro, feito para fitness e acompanhamento de treino) e **sora-design-system** (escuro, vidro branco sobre fundo preto). A paleta e as fontes acima não mudaram: os dois sistemas entram só como padrões de superfície, componente e movimento.

**Como se misturam.** As seções claras (`#plano`, `#semana`, `#matricula`, `#como-funciona`) usam os padrões do oemsz26 com as cores da identidade: Rejunte claro no lugar do branco, Rejunte no lugar do anel stone-200, Turquesa no lugar do stone-900, e a sombra em seis passos fica a 4% para respeitar a regra de quase nenhuma sombra. As faixas escuras (`#aulas`, `#aluno`, `.rodape`) usam os padrões do sora sobre Borracha: vidro branco a 4% com blur de 24px, pílulas de filtro com aba ativa em Turquesa claro e texto Borracha, callout de informação em Turquesa claro a 10% com borda a 20%, rodapé em colunas com hairline no topo.

Componentes aplicados:

| Padrão | De | Onde |
| --- | --- | --- |
| Card com anel e sombra em seis passos a 4% | oemsz26 | `.painel`, `.placa-bloco`, `.matricula-resumo`, `.semana-resultado` |
| Week strip (faixa de sete dias, dia selecionado preenchido) | oemsz26 | `#filtro-dia` em `#aulas` (domingo aparece como fechado) |
| Status pill ("vagas abertas", "reservada", "lotada") | oemsz26 | Cada aula de `#lista-aulas` e cada reserva de `#lista-reservas` |
| Progress with value (barra de 8px com "8 de 12" ao lado) | oemsz26 | Linha de vagas de cada aula, acima das anilhas. Sobre Borracha o preenchimento é Turquesa claro e o trilho é Rejunte a 25%, para a barra não ficar mais clara que o preenchimento |
| Goal row / Workout row (linha de 64px com tile de 40px) | oemsz26 | `#dias-semana li` (ícone da modalidade, nome, legenda e pílula) e `#presencas li` |
| Primary pill com seta final que anda 4px no hover | oemsz26 | `.botao-principal` em todas as seções |
| Hero photo with ink scrim | oemsz26 | `.hero-moldura` com degradê Borracha a 70% e legenda "Seg a sex, 5h30 às 22h" |
| Media card com véu de tinta | oemsz26 | `.midia-cartao` em `#aulas` (funcional e spinning) |
| Navigation pill (vidro a 5%, blur 12px, hairline a 10%) | sora | `.topo` e `.menu`; a partir de 20px de rolagem o cabeçalho fica Borracha a 80% com blur |
| Glass card (vidro a 4%, blur 24px, hairline a 10%, raio 4px) | sora | `.painel-escuro`, `.painel-aluno`, `.minhas` |
| Selected tab com preenchimento de cor | sora | `.chip` de `#filtro-hora` (texto branco a 80%, ativo em Turquesa claro) |
| Information callout com ação à direita, sem ícone | sora | `.aviso-saude` em `#semana` (Turquesa a 10%) e `.credenciais` em `#aluno` (Turquesa claro a 10%, botão "Preencher por mim") |
| Footer em colunas (marca e endereço, atalhos, aviso) com linha legal | sora | `.rodape` |
| Soft fade-in orquestrado e revelação ao rolar | sora | Fatos da abertura em escada de 80ms; cada `.secao > .grade` sobe 12px e aparece em 600ms quando entra 12% na tela (IntersectionObserver). Desligado com `prefers-reduced-motion` |
| Campo de luz suave (versão em canvas 2D do campo cósmico) | sora | `#aulas` e `#aluno`: canvas desenhado uma vez com mancha radial de Turquesa claro a 6% e grão a cerca de 3% no canto superior direito. Não é desenhado com `prefers-reduced-motion` |

## Fotos das seções (geradas por IA no Canva)

Além do hero, o site reserva lugar para seis fotos, todas ilustrativas e geradas por IA no Canva pelo Rodrigo Jr. Os arquivos finais estão em `img/`, em webp, com o nome e a proporção certos.

| Arquivo | Proporção | Onde | Prompt (em português, para o Canva) |
| --- | --- | --- | --- |
| `img/sala-musculacao.webp` | 16:9 (1456 x 816) | `.plano-foto` em `#plano`, entre a introdução e o simulador | Fotografia editorial de site premium de academia de bairro, horizontal 16:9. Sala de musculação ampla e arrumada: suporte de anilhas de ferro fundido em ordem de tamanho, dois bancos pretos, barras apoiadas no rack, piso de borracha cinza-azulado escuro e parede de azulejo cinza-azulado claro. Luz natural lateral de janela alta, sombras macias, sem neon e sem vermelho; um único detalhe em turquesa petróleo (uma toalha dobrada sobre o banco). Sem pessoas, sem texto, sem logotipos, sem marcas visíveis nos aparelhos. |
| `img/aula-funcional.webp` | 3:2 (1456 x 970) | Cartão de mídia em `#aulas`, entre os filtros e a lista | Fotografia editorial de site premium de academia, horizontal 3:2. Turma de cinco adultos vistos de costas e de perfil distante, em fila, cada um segurando um kettlebell preto, sobre piso de borracha cinza-azulado escuro, em sala com parede de azulejo cinza-azulado claro e janela alta ao fundo. Rostos fora de foco ou fora do quadro. Roupas em tons neutros, um só detalhe turquesa petróleo em uma camiseta. Luz natural fria e difusa, sombras suaves, paleta sóbria. Sem texto, sem logotipos, sem marcas. |
| `img/spinning-sala.webp` | 4:3 (1456 x 1088) | Segundo cartão de mídia em `#aulas`, ao lado do funcional | Fotografia editorial de site premium de academia, horizontal 4:3. Fileira de seis bicicletas de spinning pretas alinhadas em diagonal, sala com piso de borracha cinza-azulado escuro e parede de azulejo cinza claro, luz ambiente baixa com uma única faixa de luz turquesa petróleo refletida no piso. Sem pessoas, sem texto, sem logotipos, sem neon colorido além do turquesa. Composição com espaço livre à esquerda. |
| `img/instrutor-prancheta.webp` | 3:4 (1088 x 1456) | `.semana-foto`, coluna à esquerda do formulário em `#semana` | Fotografia editorial de site premium de academia, vertical 3:4. Instrutor adulto visto de costas e em leve perfil, rosto fora do quadro, segurando uma prancheta com folha pautada desfocada, camiseta turquesa petróleo, diante de uma parede de azulejo cinza-azulado com um quadro branco vazio. Luz natural lateral fria, sombras suaves, fundo limpo. Sem texto legível, sem logotipos, sem marcas. |
| `img/armarios-vestiario.webp` | 4:3 (1456 x 1088) | Fundo do estado vazio do resumo da matrícula (`#matricula-vazio`), com véu Borracha a 60% | Fotografia editorial de site premium de academia, horizontal 4:3. Corredor de vestiário limpo com armários de metal cinza-azulado, cada um com uma pequena placa numerada em branco (sem números legíveis), banco baixo de madeira clara no centro, piso de borracha escuro e parede de azulejo cinza-azulado claro. Uma toalha turquesa petróleo dobrada sobre o banco como único ponto de cor. Luz fria e difusa de teto, sombras suaves. Sem pessoas, sem texto legível, sem logotipos. |
| `img/catraca-entrada.webp` | 1:1 (1024 x 1024) | `.aluno-foto`, ao lado do formulário de entrada em `#aluno` | Fotografia editorial de site premium de academia, quadrada 1:1. Catraca de entrada em aço escovado com um pequeno leitor de cartão aceso em luz turquesa petróleo, piso de borracha cinza-azulado escuro, parede de azulejo cinza claro ao fundo, luz natural rasante de manhã entrando por uma porta de vidro à direita. Sem pessoas, sem texto, sem logotipos, sem telas com conteúdo legível. |
