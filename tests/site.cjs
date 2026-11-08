/* Testes do site Anilha Academia com Playwright.
   Uso: node tests/site.cjs
   Sobe um servidor estático (python3 -m http.server) na porta 8319, se não houver um,
   e testa em três tamanhos: computador 1280x900, iPhone 13 e 320px.
   Verifica: erros de console, pedidos de rede para fora, rolagem horizontal, texto cortado,
   a foto do hero e as funções (plano, grade de aulas, minha semana, matrícula e área do aluno).
   Com CAPTURAS=1 também salva capturas PNG (em SHOTS_DIR, se definido, senão em docs/).
   As capturas do README são essas PNG convertidas para webp (Pillow). */

const { chromium, devices } = require("playwright");
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const PORTA = Number(process.env.PORTA) || 8319;
const BASE = `http://127.0.0.1:${PORTA}/`;
const RAIZ = path.resolve(__dirname, "..");
const CAPTURAS = process.env.CAPTURAS === "1";
const SHOTS_DIR = process.env.SHOTS_DIR || "";

const CENARIOS = [
  { nome: "computador", opcoes: { viewport: { width: 1280, height: 900 } } },
  { nome: "iphone13", opcoes: { ...devices["iPhone 13"] } },
  { nome: "320px", opcoes: { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } }
];

function servidorAtivo() {
  return new Promise((res) => {
    const req = http.get(BASE, (r) => { r.resume(); res(true); });
    req.on("error", () => res(false));
    req.setTimeout(1500, () => { req.destroy(); res(false); });
  });
}

async function subirServidor() {
  if (await servidorAtivo()) return null;
  const proc = spawn("python3", ["-m", "http.server", String(PORTA), "--bind", "127.0.0.1"], { cwd: RAIZ, stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 150));
    if (await servidorAtivo()) return proc;
  }
  throw new Error("Servidor não subiu na porta " + PORTA);
}

const falhas = [];
function checar(cond, msg) { if (!cond) falhas.push(msg); return cond; }

async function textoCortado(page) {
  return page.evaluate(() => {
    const seletores = "h1,h2,h3,h4,p,a,button,label,legend,li,dt,dd,span,summary,code";
    const larguraTela = document.documentElement.clientWidth;
    const problemas = [];
    for (const el of document.querySelectorAll(seletores)) {
      if (!el.textContent.trim() || el.closest("[hidden]")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (el.closest(".menu") && !el.closest(".menu.aberto") && getComputedStyle(el.closest(".menu")).display === "none") continue;
      if (el.scrollWidth > el.clientWidth + 1 && cs.display !== "inline" && cs.overflow !== "visible") {
        problemas.push("corta: " + el.textContent.trim().slice(0, 30));
      }
      if (r.right > larguraTela + 1 || r.left < -1) {
        problemas.push("fora da tela: " + el.textContent.trim().slice(0, 30));
      }
    }
    return problemas.slice(0, 6);
  });
}

async function rolagemHorizontal(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

async function checarHero(page) {
  return page.evaluate(() => {
    const img = document.querySelector("img.hero-foto");
    if (!img) return { existe: false };
    const r = img.getBoundingClientRect();
    const caixa = img.parentElement.getBoundingClientRect();
    let sobreposto = 0;
    for (const t of document.querySelectorAll(".abertura-texto h1, .abertura-texto p, .abertura-texto a, .abertura-texto dl")) {
      const b = t.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      const w = Math.min(b.right, r.right) - Math.max(b.left, r.left);
      const h = Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top);
      if (w > 1 && h > 1) sobreposto++;
    }
    return {
      existe: true,
      carregou: img.complete && img.naturalWidth >= 1000,
      alt: (img.getAttribute("alt") || "").length > 20,
      proporcao: Math.round((caixa.width / caixa.height) * 100) / 100,
      cabe: r.left >= -1 && r.right <= document.documentElement.clientWidth + 1,
      sobreposto
    };
  });
}

async function capturar(page, nome, cenario) {
  if (!CAPTURAS) return;
  const pasta = SHOTS_DIR || path.join(RAIZ, "docs");
  fs.mkdirSync(pasta, { recursive: true });
  await page.screenshot({ path: path.join(pasta, `${nome}-${cenario}.png`) });
}

async function irPara(page, id) {
  await page.evaluate((id) => document.getElementById(id).scrollIntoView({ behavior: "instant" }), id);
  await page.waitForTimeout(250);
}

async function textoDe(page, sel) { return (await page.locator(sel).first().innerText()).replace(/\s+/g, " ").trim(); }

async function testarFuncoes(page, c) {
  /* ---- 1. Simulador de plano ---- */
  await irPara(page, "plano");
  const m1 = await textoDe(page, "#pl-mensal");
  checar(m1 === "89,10", `[${c}] plano inicial deveria ser 89,10 e é ${m1}`);
  await page.locator('label.opcao:has(input[value="funcional"])').click();
  const m2 = await textoDe(page, "#pl-mensal");
  checar(m2 === "152,19", `[${c}] musculação + funcional, 3 vezes, mensal deveria ser 152,19 e é ${m2}`);
  await page.locator('label.opcao:has(input[name="periodo"][value="12"])').click();
  await page.selectOption("#pessoas", "2");
  const total = await textoDe(page, "#pl-total");
  checar(/R\$\s*\d/.test(total) && (await textoDe(page, "#pl-total-rotulo")).includes("12 meses"), `[${c}] total do plano de 12 meses não apareceu (${total})`);
  checar((await textoDe(page, "#pl-taxa")) === "Grátis", `[${c}] taxa deveria ser grátis em 12 meses`);
  // desmarcar tudo mostra o erro
  await page.locator('label.opcao:has(input[value="musculacao"])').click();
  await page.locator('label.opcao:has(input[value="funcional"])').click();
  checar(await page.isVisible("#erro-mod"), `[${c}] sem modalidade deveria mostrar erro`);
  checar(await page.isDisabled("#usar-plano"), `[${c}] botão de usar plano deveria estar desligado`);
  await page.locator('label.opcao:has(input[value="musculacao"])').click();
  await page.locator('label.opcao:has(input[value="ritmos"])').click();
  checar(!(await page.isVisible("#erro-mod")), `[${c}] erro de modalidade deveria sumir`);
  await page.click("#usar-plano");
  await page.waitForTimeout(500);
  const opMeu = await page.locator('#m-plano option[value="meu"]').count();
  checar(opMeu === 1, `[${c}] o plano montado deveria entrar na matrícula`);
  checar((await page.inputValue("#m-plano")) === "meu", `[${c}] a matrícula deveria vir com o plano montado`);

  /* ---- 2. Grade de aulas ---- */
  await irPara(page, "aulas");
  await page.click('#filtro-dia button[data-dia="1"]');
  const todas = await page.locator("#lista-aulas > li.aula").count();
  checar(todas > 3, `[${c}] segunda deveria ter várias aulas (${todas})`);
  await page.selectOption("#filtro-mod", "funcional");
  const funcionais = await page.locator("#lista-aulas > li.aula").count();
  checar(funcionais > 0 && funcionais < todas, `[${c}] filtro por aula não funcionou (${funcionais}/${todas})`);
  await page.selectOption("#filtro-mod", "todas");
  await page.click('#filtro-hora button[data-hora="noite"]');
  const noite = await page.locator("#lista-aulas > li.aula .aula-hora").allInnerTexts();
  checar(noite.length > 0 && noite.every((h) => Number(h.slice(0, 2)) >= 18), `[${c}] filtro de noite trouxe horário fora da noite: ${noite.join(",")}`);
  await page.click('#filtro-hora button[data-hora="todas"]');
  await page.selectOption("#filtro-mod", "funcional");
  await page.click('#filtro-hora button[data-hora="manha"]');
  const alvo = page.locator("#lista-aulas > li.aula").first();
  const antes = await alvo.locator(".vaga-texto").innerText();
  await alvo.locator("button.botao-principal").click();
  const depois = await alvo.locator(".vaga-texto").innerText();
  checar(/Sua vaga/.test(depois) && antes !== depois, `[${c}] reserva não mudou a contagem (${antes} / ${depois})`);
  checar((await page.locator("#lista-reservas li").count()) === 1, `[${c}] a reserva deveria aparecer em Minhas reservas`);
  checar(/Vaga reservada/.test(await textoDe(page, "#aviso-aulas")), `[${c}] faltou o aviso de reserva`);
  // conflito: mesma aula/horário em outra modalidade no mesmo dia
  await page.selectOption("#filtro-mod", "todas");
  await page.click('#filtro-hora button[data-hora="todas"]');
  await page.click('#filtro-dia button[data-dia="1"]');
  const alvoCancelar = page.locator("#lista-aulas > li.aula button.botao-contorno").first();
  checar((await alvoCancelar.count()) === 1, `[${c}] botão de cancelar não apareceu`);
  await alvoCancelar.click();
  checar((await page.locator("#lista-reservas li").count()) === 0, `[${c}] cancelar não removeu a reserva`);
  // reservar de novo para a captura e para a área do aluno
  await page.selectOption("#filtro-mod", "funcional");
  await page.click('#filtro-hora button[data-hora="manha"]');
  await page.locator("#lista-aulas > li.aula button.botao-principal").first().click();
  await page.selectOption("#filtro-mod", "todas");
  await page.click('#filtro-hora button[data-hora="todas"]');
  await capturarSe(page, "aulas", c);

  /* ---- 3. Minha semana ---- */
  await irPara(page, "semana");
  const trein3 = await page.locator("#dias-semana li.treino").count();
  checar(trein3 === 3, `[${c}] 3 dias livres e iniciante deveriam dar 3 treinos (${trein3})`);
  await page.selectOption("#s-dias", "7");
  const trein7 = await page.locator("#dias-semana li.treino").count();
  checar(trein7 === 3, `[${c}] iniciante com 7 dias deveria limitar a 3 treinos (${trein7})`);
  checar(await page.isVisible("#semana-ajuste"), `[${c}] faltou o aviso de ajuste para iniciante`);
  const descanso = await page.locator("#dias-semana li:not(.treino):not(.leve)").count();
  checar(descanso >= 1, `[${c}] a semana precisa ter ao menos um dia de descanso`);
  await page.selectOption("#s-exp", "2");
  const trein7b = await page.locator("#dias-semana li.treino").count();
  checar(trein7b === 5, `[${c}] avançado com 7 dias deveria dar 5 treinos (${trein7b})`);
  await page.selectOption("#s-dias", "4");
  await page.selectOption("#s-min", "60");
  checar(/4 treinos de 60 minutos, 240 minutos/.test(await textoDe(page, "#semana-total")), `[${c}] total semanal errado: ${await textoDe(page, "#semana-total")}`);
  checar(await page.isVisible(".aviso-saude"), `[${c}] aviso de saúde sumiu`);
  await capturarSe(page, "semana", c);

  /* ---- 4. Matrícula ---- */
  await irPara(page, "matricula");
  await page.click('#form-matricula button[type="submit"]');
  checar(await page.isVisible("#e-nome"), `[${c}] matrícula vazia deveria apontar o nome`);
  checar(await page.isVisible("#e-geral"), `[${c}] faltou o aviso geral`);
  await page.fill("#m-nome", "Maria Teste");
  await page.fill("#m-nasc", "2015-05-10");
  await page.dispatchEvent("#m-nasc", "change");
  checar(await page.isVisible("#campo-resp"), `[${c}] menor de idade deveria pedir responsável`);
  await page.fill("#m-nasc", "1995-05-10");
  await page.dispatchEvent("#m-nasc", "change");
  checar(!(await page.isVisible("#campo-resp")), `[${c}] adulto não deveria pedir responsável`);
  await page.fill("#m-zap", "6599990000");
  checar((await page.inputValue("#m-zap")) === "(65) 9999-0000" || (await page.inputValue("#m-zap")) === "(65) 99990-000", `[${c}] máscara do WhatsApp estranha: ${await page.inputValue("#m-zap")}`);
  await page.fill("#m-zap", "");
  await page.type("#m-zap", "65999990000");
  checar((await page.inputValue("#m-zap")) === "(65) 99999-0000", `[${c}] máscara do WhatsApp: ${await page.inputValue("#m-zap")}`);
  await page.fill("#m-email", "errado");
  await page.click('#form-matricula button[type="submit"]');
  checar(await page.isVisible("#e-email"), `[${c}] e-mail inválido deveria dar erro`);
  checar(await page.isVisible("#e-saude") && await page.isVisible("#e-termos"), `[${c}] faltaram os erros dos avisos`);
  await page.fill("#m-email", "maria@exemplo.com");
  await page.check("#m-saude");
  await page.check("#m-termos");
  await page.click('#form-matricula button[type="submit"]');
  await page.waitForTimeout(200);
  checar(await page.isVisible("#comprovante"), `[${c}] o resumo da matrícula não apareceu`);
  checar(/DEMO-\d{4}/.test(await textoDe(page, "#comprovante-lista")), `[${c}] faltou o protocolo`);
  await capturarSe(page, "matricula", c);

  /* ---- 5. Área do aluno ---- */
  await irPara(page, "aluno");
  await page.fill("#l-user", "aluno.demo");
  await page.fill("#l-senha", "errada");
  await page.click('#form-login button[type="submit"]');
  checar(await page.isVisible("#e-login"), `[${c}] senha errada deveria dar erro`);
  await page.fill("#l-senha", "treino-demo");
  await page.click('#form-login button[type="submit"]');
  checar(await page.isVisible("#painel-aluno"), `[${c}] login de demonstração não funcionou`);
  checar((await page.locator("#aluno-reservas li.reserva").count()) >= 1, `[${c}] a reserva deveria aparecer na área do aluno`);
  await page.click("#checkin");
  checar((await page.locator("#presencas li.feita").count()) === 1, `[${c}] a presença de hoje não foi marcada`);
  checar(await page.isDisabled("#checkin"), `[${c}] o botão de presença deveria desligar`);
  await capturarSe(page, "aluno", c);
}

async function capturarSe(page, nome, cenario) {
  if (CAPTURAS) { await page.waitForTimeout(250); await capturar(page, nome, cenario); }
}

(async () => {
  const servidor = await subirServidor();
  const navegador = await chromium.launch();
  try {
    for (const cenario of CENARIOS) {
      const contexto = await navegador.newContext(cenario.opcoes);
      const page = await contexto.newPage();
      const errosConsole = [];
      const pedidosFora = [];
      page.on("console", (m) => { if (m.type() === "error") errosConsole.push(m.text()); });
      page.on("pageerror", (e) => errosConsole.push("pageerror: " + e.message));
      page.on("request", (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith("data:")) pedidosFora.push(r.url()); });

      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);

      checar(errosConsole.length === 0, `[${cenario.nome}] erros de console: ${errosConsole.join(" | ")}`);
      checar(pedidosFora.length === 0, `[${cenario.nome}] pedidos para fora: ${pedidosFora.join(", ")}`);
      checar(!(await rolagemHorizontal(page)), `[${cenario.nome}] há rolagem horizontal`);
      const cortados = await textoCortado(page);
      checar(cortados.length === 0, `[${cenario.nome}] texto cortado: ${cortados.join("; ")}`);
      checar(await page.evaluate(() => document.fonts.check('800 1em "Big Shoulders Display"') && document.fonts.check('400 1em "Hanken Grotesk"')), `[${cenario.nome}] fontes locais não carregaram`);

      const hero = await checarHero(page);
      checar(hero.existe && hero.carregou, `[${cenario.nome}] a foto do hero não carregou`);
      checar(hero.existe && hero.alt, `[${cenario.nome}] a foto do hero está sem alt descritivo`);
      checar(hero.existe && Math.abs(hero.proporcao - 1.33) < 0.02, `[${cenario.nome}] contêiner do hero fora de 4:3 (${hero.proporcao})`);
      checar(hero.existe && hero.cabe && hero.sobreposto === 0, `[${cenario.nome}] a foto sai da tela ou há texto sobre ela (${hero.sobreposto})`);

      // menu no celular
      if (cenario.nome !== "computador") {
        await page.click("#menu-botao");
        checar((await page.getAttribute("#menu-botao", "aria-expanded")) === "true", `[${cenario.nome}] menu não abriu`);
        checar(await page.isVisible('#menu a[href="#aulas"]'), `[${cenario.nome}] link do menu não apareceu`);
        await page.click('#menu a[href="#aulas"]');
        checar((await page.getAttribute("#menu-botao", "aria-expanded")) === "false", `[${cenario.nome}] menu não fechou`);
        await page.evaluate(() => window.scrollTo(0, 0));
      }

      await capturar(page, "capa", cenario.nome);
      await page.evaluate(() => window.scrollTo(0, 0));
      if (CAPTURAS) { await page.waitForTimeout(200); }
      await irPara(page, "plano");
      await capturarSe(page, "plano", cenario.nome);
      await page.evaluate(() => window.scrollTo(0, 0));
      await testarFuncoes(page, cenario.nome);

      checar(!(await rolagemHorizontal(page)), `[${cenario.nome}] rolagem horizontal depois de usar as funções`);
      const cortados2 = await textoCortado(page);
      checar(cortados2.length === 0, `[${cenario.nome}] texto cortado depois de usar: ${cortados2.join("; ")}`);
      checar(errosConsole.length === 0, `[${cenario.nome}] erros de console depois de usar: ${errosConsole.join(" | ")}`);

      // reduced motion: nenhuma animação ativa
      await contexto.close();

      const ctx2 = await navegador.newContext({ ...cenario.opcoes, reducedMotion: "reduce" });
      const p2 = await ctx2.newPage();
      await p2.goto(BASE, { waitUntil: "networkidle" });
      const anim = await p2.evaluate(() => getComputedStyle(document.querySelector(".abertura h1 .linha")).animationName);
      checar(anim === "none", `[${cenario.nome}] animação não foi desligada com reduced-motion (${anim})`);
      await ctx2.close();

      const ctx3 = await navegador.newContext(cenario.opcoes);
      const p3 = await ctx3.newPage();
      await p3.goto(BASE + "404.html", { waitUntil: "networkidle" });
      checar(await p3.isVisible("h1"), `[${cenario.nome}] 404 sem título`);
      checar(!(await rolagemHorizontal(p3)), `[${cenario.nome}] 404 com rolagem horizontal`);
      await ctx3.close();
      console.log(`${cenario.nome}: ok`);
    }

    if (CAPTURAS && SHOTS_DIR) {
      fs.mkdirSync(SHOTS_DIR, { recursive: true });
      const c1 = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
      const p1 = await c1.newPage();
      await p1.goto(BASE, { waitUntil: "networkidle" }); await p1.waitForTimeout(1500);
      await p1.screenshot({ path: path.join(SHOTS_DIR, "academia-desk.png") });
      await c1.close();
      const c2 = await navegador.newContext({ ...devices["iPhone 13"] });
      const p2 = await c2.newPage();
      await p2.goto(BASE, { waitUntil: "networkidle" }); await p2.waitForTimeout(1500);
      await p2.screenshot({ path: path.join(SHOTS_DIR, "academia-cel.png") });
      await c2.close();
    }
  } finally {
    await navegador.close();
    if (servidor) servidor.kill();
  }

  if (falhas.length) {
    console.error("\nFALHAS:\n" + falhas.map((f) => " - " + f).join("\n"));
    process.exit(1);
  }
  console.log("\nTodos os testes passaram.");
})().catch((e) => { console.error(e); process.exit(1); });
