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
