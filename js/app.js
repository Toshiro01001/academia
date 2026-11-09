/* Anilha Academia: funções do site (JavaScript puro, sem dependências).
   Nada sai do navegador. localStorage guarda só reservas, presenças e o resumo do plano. */
(function () {
  "use strict";

  var DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  var DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  var NOMES_MOD = {
    musculacao: "Sala de musculação",
    funcional: "Treino funcional",
    spinning: "Spinning",
    ritmos: "Ritmos (dança)",
    mobilidade: "Alongamento e mobilidade"
  };
  var NOMES_AULA = {
    musculacao: "Musculação para iniciantes",
    funcional: "Treino funcional",
    spinning: "Spinning",
    ritmos: "Ritmos (dança)",
    mobilidade: "Alongamento e mobilidade"
  };

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  /* Armazenamento seguro: funciona mesmo se o navegador bloquear o localStorage. */
  var memoria = {};
  function ler(chave, padrao) {
    try {
      var v = window.localStorage.getItem(chave);
      if (v !== null) return JSON.parse(v);
    } catch (e) { /* segue com a memória */ }
    return Object.prototype.hasOwnProperty.call(memoria, chave) ? memoria[chave] : padrao;
  }
  function gravar(chave, valor) {
    memoria[chave] = valor;
    try { window.localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* ignora */ }
  }

  function brl(centavos) {
    var v = centavos / 100;
    var inteiro = Math.abs(centavos) % 100 === 0;
    return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: inteiro ? 0 : 2, maximumFractionDigits: 2 });
  }

  /* ---------- Menu no celular ---------- */
  (function menu() {
    var botao = $("menu-botao");
    var nav = $("menu");
    function fechar() { nav.classList.remove("aberto"); botao.setAttribute("aria-expanded", "false"); }
    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") fechar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });

    /* Cabeçalho ganha fundo translúcido depois de 20px de rolagem (sora: navigation pill). */
    var cabecalho = document.querySelector(".cabecalho");
    var marcado = false;
    function aoRolar() {
      var rolou = window.scrollY > 20;
      if (rolou !== marcado) { marcado = rolou; cabecalho.classList.toggle("rolou", rolou); }
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
  })();

  var MOVIMENTO_OK = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- Revelação ao rolar (sora: soft fade-in) ---------- */
  (function revelar() {
    if (!MOVIMENTO_OK || !("IntersectionObserver" in window)) return;
    var alvos = document.querySelectorAll(".secao > .grade");
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visto"); obs.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" }); // dispara quando o bloco entra 12% na tela
    for (var i = 0; i < alvos.length; i++) {
      var r = alvos[i].getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) continue; // já está na tela: não esconde
      alvos[i].classList.add("revela");
      obs.observe(alvos[i]);
    }
  })();

  /* ---------- Campo de luz nas faixas escuras (sora: versão em canvas 2D do campo cósmico) ---------- */
  (function campoDeLuz() {
    if (!MOVIMENTO_OK) return;
    var faixas = document.querySelectorAll(".secao.escuro");
    var telas = [];
    for (var i = 0; i < faixas.length; i++) {
      var c = document.createElement("canvas");
      c.className = "campo-luz";
      c.setAttribute("aria-hidden", "true");
      faixas[i].insertBefore(c, faixas[i].firstChild);
      telas.push({ canvas: c, faixa: faixas[i] });
    }
    function desenhar() {
      telas.forEach(function (t) {
        var w = Math.max(1, Math.round(t.faixa.clientWidth / 2));
        var h = Math.max(1, Math.round(t.faixa.clientHeight / 2));
        if (h > 2000) h = 2000;
        t.canvas.width = w;
        t.canvas.height = h;
        var ctx = t.canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, w, h);
        var raio = Math.max(w, h) * 0.55;
        var g = ctx.createRadialGradient(w * 0.92, 0, 0, w * 0.92, 0, raio);
        g.addColorStop(0, "rgba(127, 214, 232, 0.06)");
        g.addColorStop(0.5, "rgba(127, 214, 232, 0.025)");
        g.addColorStop(1, "rgba(127, 214, 232, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        var grao = ctx.createImageData(w, Math.min(h, 240));
        var d = grao.data;
        for (var p = 0; p < d.length; p += 4) {
          var v = Math.random() < 0.5 ? 255 : 0;
          d[p] = v; d[p + 1] = v; d[p + 2] = v; d[p + 3] = Math.random() < 0.25 ? 5 : 0; // grão a cerca de 2% a 3%
        }
        for (var y = 0; y < h; y += grao.height) ctx.putImageData(grao, 0, y);
      });
    }
    var espera;
    window.addEventListener("resize", function () { clearTimeout(espera); espera = setTimeout(desenhar, 200); });
    desenhar();
    window.setTimeout(desenhar, 600); // depois que as listas montam e a altura muda
  })();

  /* Ícones em SVG criados pelo código (sem biblioteca). */
  var SVG_NS = "http://www.w3.org/2000/svg";
  var ICONES = {
    halter: "M4 9v6M8 7v10M16 7v10M20 9v6M8 12h8M2 12h2M20 12h2",
    corrida: "M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0M6 20l3-7 3 2v5M9 13l2-4 4 1 3 3M11 9l-4 2-2 3",
    passos: "M8 3c2 0 3 2 3 5s-1 4-3 4-3-2-3-5 1-4 3-4zM7 14h3l1 3-1 3H7l-1-3zM16 8c2 0 3 2 3 5s-1 4-3 4-3-2-3-5 1-4 3-4zM15 19h3l1 2h-5z",
    bike: "M5 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0M13 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0M8 17l3-7h5l2 7M11 10l-2-4h3M15 7h2",
    marca: "M5 12l4 4L19 6"
  };
  function icone(nome) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", ICONES[nome] || ICONES.halter);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
  }
  function pilula(tipo, texto) {
    return el("span", "pilula pilula-" + tipo, texto);
  }

  /* ---------- 1. Simulador de plano ---------- */
  var PESSOAS_PCT = [100, 85, 80, 75];
  var TAXA = 6000; // centavos, por pessoa, só nos períodos de 1 e 3 meses
  var PERIODO_PCT = { 1: 100, 3: 95, 6: 90, 12: 85 };

  function calcularPlano(mods, freqPct, meses, pessoas) {
    var base = 0, i;
    for (i = 0; i < mods.length; i++) base += mods[i];
    var n = mods.length;
    var comboPct = n >= 3 ? 90 : (n === 2 ? 95 : 100);
    var porPessoa = Math.round(base * comboPct * freqPct * PERIODO_PCT[meses] / 1000000);
    var soma = 0;
    for (i = 0; i < pessoas; i++) soma += PESSOAS_PCT[i];
    var mensal = Math.round(porPessoa * soma / 100);
    var taxa = meses >= 6 ? 0 : TAXA * pessoas;
    var total = mensal * meses + taxa;
    var referencia = Math.round(base * freqPct / 100) * pessoas * meses + (meses >= 6 ? 0 : TAXA * pessoas);
    return { n: n, porPessoa: porPessoa, mensal: mensal, taxa: taxa, total: total, economia: Math.max(0, referencia - total), meses: meses, pessoas: pessoas };
  }

  var planoAtual = null;
  var formPlano = $("form-plano");

  function lerPlano() {
    var mods = [], nomes = [], marcados = formPlano.querySelectorAll('input[name="mod"]:checked');
    for (var i = 0; i < marcados.length; i++) {
      mods.push(Number(marcados[i].getAttribute("data-preco")));
      nomes.push(marcados[i].value);
    }
    return {
      mods: mods, nomes: nomes,
      freq: Number(formPlano.querySelector('input[name="freq"]:checked').value),
      meses: Number(formPlano.querySelector('input[name="periodo"]:checked').value),
      pessoas: Number($("pessoas").value)
    };
  }

  function rotuloFreq(f) { return f === 80 ? "2 vezes por semana" : (f === 90 ? "3 vezes por semana" : "uso livre"); }
  function rotuloPeriodo(m) { return m === 1 ? "mensal" : m + " meses"; }

  function atualizarPlano() {
    var p = lerPlano();
    var erro = $("erro-mod");
    if (!p.mods.length) {
      erro.hidden = false;
      $("pl-mensal").textContent = "0";
      $("usar-plano").disabled = true;
      planoAtual = null;
      return;
    }
    erro.hidden = true;
    $("usar-plano").disabled = false;
    var r = calcularPlano(p.mods, p.freq, p.meses, p.pessoas);
    planoAtual = { calc: r, nomes: p.nomes, freq: p.freq };

    $("pl-titulo").textContent = "Plano com " + r.n + (r.n === 1 ? " modalidade" : " modalidades");
    var novoValor = (r.mensal / 100).toLocaleString("pt-BR", { minimumFractionDigits: r.mensal % 100 ? 2 : 0, maximumFractionDigits: 2 });
    var alvo = $("pl-mensal");
    if (alvo.textContent !== novoValor) {
      alvo.textContent = novoValor;
      var placa = $("placa-plano");
      placa.classList.remove("troca");
      void placa.offsetWidth;
      placa.classList.add("troca");
    }
    $("pl-pessoa").textContent = brl(r.porPessoa) + " por mês";
    $("pl-pessoas").textContent = String(r.pessoas);
    $("pl-taxa").textContent = r.taxa ? brl(r.taxa) : "Grátis";
    $("pl-total-rotulo").textContent = r.meses === 1 ? "Total do primeiro mês" : "Total em " + r.meses + " meses";
    $("pl-total").textContent = brl(r.total);
    $("pl-economia").textContent = r.economia ? brl(r.economia) : "Nada ainda";
    $("pl-nota").textContent = "Plano: " + p.nomes.map(function (n) { return NOMES_MOD[n]; }).join(", ") + ", " + rotuloFreq(p.freq) + ", " + rotuloPeriodo(r.meses) + ". Valores de demonstração.";
    atualizarOpcoesMatricula();
  }
  formPlano.addEventListener("change", atualizarPlano);
  formPlano.addEventListener("submit", function (e) { e.preventDefault(); });

  function resumoPlano(p) {
    if (!p) return null;
    return {
      titulo: p.nomes.map(function (n) { return NOMES_MOD[n]; }).join(" + "),
      freq: rotuloFreq(p.freq),
      periodo: rotuloPeriodo(p.calc.meses),
      pessoas: p.calc.pessoas,
      mensal: p.calc.mensal,
      total: p.calc.total
    };
  }

  /* Planos prontos do formulário de matrícula (calculados com a mesma função). */
  var PRONTOS = {
    basico: { nomes: ["musculacao"], precos: [9900], freq: 90, meses: 1, pessoas: 1 },
    combo: { nomes: ["musculacao", "funcional"], precos: [9900, 7900], freq: 100, meses: 6, pessoas: 1 }
  };
  function prontoResumo(chave) {
    var d = PRONTOS[chave];
    var r = calcularPlano(d.precos, d.freq, d.meses, d.pessoas);
    return resumoPlano({ nomes: d.nomes, freq: d.freq, calc: r });
  }

  /* ---------- 4. Matrícula ---------- */
  var formMat = $("form-matricula");
  var selPlano = $("m-plano");
  var planoEscolhido = ler("anilha.plano", null);

  function atualizarOpcoesMatricula() {
    var b = prontoResumo("basico"), c = prontoResumo("combo");
    var ops = selPlano.options;
    ops[1].textContent = "Plano básico: " + b.titulo + ", " + b.freq + ", " + b.periodo + " (" + brl(b.mensal) + " por mês)";
    ops[2].textContent = "Plano combinado: " + c.titulo + ", " + c.freq + ", " + c.periodo + " (" + brl(c.mensal) + " por mês)";
    var existente = selPlano.querySelector('option[value="meu"]');
    if (planoEscolhido) {
      if (!existente) {
        existente = el("option"); existente.value = "meu"; selPlano.appendChild(existente);
      }
      existente.textContent = "O plano que montei: " + planoEscolhido.titulo + ", " + planoEscolhido.freq + ", " + planoEscolhido.periodo + " (" + brl(planoEscolhido.mensal) + " por mês)";
    }
  }

  $("usar-plano").addEventListener("click", function () {
    if (!planoAtual) return;
    planoEscolhido = resumoPlano(planoAtual);
    gravar("anilha.plano", planoEscolhido);
    atualizarOpcoesMatricula();
    selPlano.value = "meu";
    mostrarErro("e-plano", "");
    atualizarAluno();
    $("matricula").scrollIntoView({ behavior: "smooth" });
    selPlano.focus({ preventScroll: true });
  });

  function mostrarErro(id, msg) {
    var e = $(id);
    e.hidden = !msg;
    e.textContent = msg || "";
    var campoId = { "e-nome": "m-nome", "e-nasc": "m-nasc", "e-resp": "m-resp", "e-zap": "m-zap", "e-email": "m-email", "e-plano": "m-plano", "e-saude": "m-saude", "e-termos": "m-termos" }[id];
    if (campoId) {
      var campo = $(campoId);
      if (msg) campo.setAttribute("aria-invalid", "true"); else campo.removeAttribute("aria-invalid");
    }
  }

  function idadeEm(dataIso) {
    var p = dataIso.split("-");
    if (p.length !== 3) return null;
    var nasc = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    if (isNaN(nasc.getTime())) return null;
    var hoje = new Date();
    var idade = hoje.getFullYear() - nasc.getFullYear();
    var m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  function mascaraZap(v) {
    var d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length > 6) return "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(d.length - 4);
    if (d.length > 2) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    return d;
  }
  $("m-zap").addEventListener("input", function (e) { e.target.value = mascaraZap(e.target.value); });

  $("m-nasc").addEventListener("change", function () {
    var idade = idadeEm($("m-nasc").value);
    $("campo-resp").hidden = !(idade !== null && idade >= 0 && idade < 18);
  });

  function validarMatricula() {
    var ok = true, primeiro = null;
    function falha(id, msg, campo) { mostrarErro(id, msg); ok = false; if (!primeiro) primeiro = $(campo); }
    ["e-nome", "e-nasc", "e-resp", "e-zap", "e-email", "e-plano", "e-saude", "e-termos"].forEach(function (i) { mostrarErro(i, ""); });

    var nome = $("m-nome").value.trim().replace(/\s+/g, " ");
    if (nome.split(" ").length < 2 || nome.length < 5) falha("e-nome", "Escreva nome e sobrenome.", "m-nome");
    else if (/[^A-Za-zÀ-ÿ' .-]/.test(nome)) falha("e-nome", "Use só letras no nome.", "m-nome");

    var idade = $("m-nasc").value ? idadeEm($("m-nasc").value) : null;
    if (idade === null) falha("e-nasc", "Informe a data de nascimento.", "m-nasc");
    else if (idade < 0 || idade > 110) falha("e-nasc", "Essa data não parece certa.", "m-nasc");
    else if (idade < 14) falha("e-nasc", "A matrícula é a partir de 14 anos.", "m-nasc");
    else if (idade < 18 && $("m-resp").value.trim().split(/\s+/).length < 2) falha("e-resp", "Menores de 18 anos precisam do nome do responsável.", "m-resp");

    var zap = $("m-zap").value.replace(/\D/g, "");
    if (zap.length !== 11 || zap.charAt(2) !== "9") falha("e-zap", "Use o formato (65) 99999-0000.", "m-zap");

    var email = $("m-email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) falha("e-email", "Escreva um e-mail como nome@exemplo.com.", "m-email");

    if (!selPlano.value) falha("e-plano", "Escolha um plano.", "m-plano");
    if (!$("m-saude").checked) falha("e-saude", "Marque que leu o aviso de saúde.", "m-saude");
    if (!$("m-termos").checked) falha("e-termos", "Marque que entendeu que é uma demonstração.", "m-termos");

    if (!ok && primeiro) primeiro.focus();
    return ok;
  }

  function protocolo() {
    var n = 1000 + Math.floor(Math.random() * 9000);
    return "DEMO-" + n;
  }

  function linha(dt, dd) {
    var d = el("div");
    d.appendChild(el("dt", null, dt));
    d.appendChild(el("dd", null, dd));
    return d;
  }

  formMat.addEventListener("submit", function (e) {
    e.preventDefault();
    var geral = $("e-geral");
    geral.hidden = true;
    if (!validarMatricula()) {
      geral.textContent = "Corrija os campos marcados e tente de novo.";
      geral.hidden = false;
      return;
    }
    var nome = $("m-nome").value.trim().replace(/\s+/g, " ");
    var plano = selPlano.value === "meu" ? planoEscolhido : prontoResumo(selPlano.value);
    var lista = $("comprovante-lista");
    lista.textContent = "";
    var prot = el("div");
    prot.appendChild(el("dt", null, "Protocolo"));
    var ddp = el("dd", "protocolo", protocolo());
    prot.appendChild(ddp);
    lista.appendChild(prot);
    lista.appendChild(linha("Aluno", nome));
    lista.appendChild(linha("Plano", plano.titulo));
    lista.appendChild(linha("Frequência", plano.freq));
    lista.appendChild(linha("Contrato", plano.periodo));
    lista.appendChild(linha("Pessoas", String(plano.pessoas)));
    lista.appendChild(linha("Mensalidade", brl(plano.mensal)));
    lista.appendChild(linha("Horário preferido", formMat.querySelector('input[name="turno"]:checked').value));
    lista.appendChild(linha("Primeiro passo", "Venha à recepção com um documento para a avaliação inicial (de mentira)."));
    $("matricula-vazio").hidden = true;
    $("comprovante").hidden = false;
    $("matricula-resumo").focus();
  });

  $("nova-matricula").addEventListener("click", function () {
    formMat.reset();
    $("campo-resp").hidden = true;
    $("comprovante").hidden = true;
    $("matricula-vazio").hidden = false;
    ["e-nome", "e-nasc", "e-resp", "e-zap", "e-email", "e-plano", "e-saude", "e-termos"].forEach(function (i) { mostrarErro(i, ""); });
    $("e-geral").hidden = true;
    $("m-nome").focus();
  });

  /* ---------- 2. Grade de aulas ---------- */
  // mod | dias | horas | vagas | instrutor | minutos
  var TABELA = [
    ["musculacao", [1, 3, 5], ["07:30", "17:30"], 10, "Helena", 50],
    ["musculacao", [6], ["08:00"], 10, "Helena", 50],
    ["funcional", [1, 3, 5], ["06:00", "18:30", "19:30"], 12, "Caio", 45],
    ["funcional", [2, 4], ["07:00", "12:10"], 12, "Dani", 40],
    ["funcional", [6], ["09:00"], 16, "Caio", 60],
    ["spinning", [2, 4], ["06:15", "19:00"], 14, "Bruna", 45],
    ["spinning", [6], ["08:00"], 14, "Bruna", 45],
    ["ritmos", [2, 4], ["20:00"], 20, "Edu", 50],
    ["ritmos", [6], ["10:15"], 20, "Edu", 50],
    ["mobilidade", [1, 3], ["12:15"], 15, "Fabi", 40],
    ["mobilidade", [2, 4, 5], ["17:30"], 15, "Fabi", 40]
  ];

  function minutosDe(h) { var p = h.split(":"); return Number(p[0]) * 60 + Number(p[1]); }

  var AULAS = [];
  TABELA.forEach(function (t) {
    t[1].forEach(function (dia) {
      t[2].forEach(function (hora) {
        var id = dia + "-" + hora.replace(":", "") + "-" + t[0];
        // lotação fixa, calculada do próprio id (sem sorteio)
        var h = (dia * 31 + minutosDe(hora) * 7 + t[3] * 13) % 97;
        var ocupadas = h % 9 === 0 ? t[3] : Math.round(t[3] * (0.3 + (h % 60) / 100));
        AULAS.push({ id: id, mod: t[0], dia: dia, hora: hora, ini: minutosDe(hora), min: t[5], vagas: t[3], ocupadas: Math.min(ocupadas, t[3]), instrutor: t[4] });
      });
    });
  });
  AULAS.sort(function (a, b) { return a.dia - b.dia || a.ini - b.ini || a.mod.localeCompare(b.mod); });

  var reservas = ler("anilha.reservas", []);
  if (!Array.isArray(reservas)) reservas = [];
  reservas = reservas.filter(function (id) { return AULAS.some(function (a) { return a.id === id; }); });

  var filtro = { dia: new Date().getDay() === 0 ? 1 : new Date().getDay(), mod: "todas", hora: "todas" };
  var LIMITE_RESERVAS = 5;

  function aulaPorId(id) { for (var i = 0; i < AULAS.length; i++) if (AULAS[i].id === id) return AULAS[i]; return null; }
  function periodoDe(a) { return a.ini < 720 ? "manha" : (a.ini < 1080 ? "tarde" : "noite"); }
  function fim(a) { var t = a.ini + a.min; return ("0" + Math.floor(t / 60)).slice(-2) + ":" + ("0" + (t % 60)).slice(-2); }

  function avisarAulas(msg, erro) {
    var a = $("aviso-aulas");
    a.textContent = msg || "";
    a.className = "aviso-vivo" + (erro ? " erro" : "");
  }

  function montarDias() {
    var box = $("filtro-dia");
    box.textContent = "";
    // faixa de sete dias (oemsz26: week strip); domingo aparece, mas fechado
    var ordem = [1, 2, 3, 4, 5, 6, 0];
    ordem.forEach(function (d) {
      var b = el("button", "dia-pilula");
      b.type = "button";
      b.appendChild(el("span", null, DIAS_CURTOS[d]));
      b.setAttribute("data-dia", String(d));
      if (d === 0) {
        b.disabled = true;
        b.appendChild(el("small", null, "fechado"));
        b.setAttribute("aria-label", "Domingo, academia fechada");
      } else {
        var n = AULAS.filter(function (a) { return a.dia === d; }).length;
        b.appendChild(el("small", null, n + (n === 1 ? " aula" : " aulas")));
        b.setAttribute("aria-label", DIAS[d] + ", " + n + " aulas");
        b.setAttribute("aria-pressed", filtro.dia === d ? "true" : "false");
        b.addEventListener("click", function () { filtro.dia = d; avisarAulas(""); montarDias(); montarAulas(); });
      }
      box.appendChild(b);
    });
  }

  function vagasTexto(a, minha) {
    var livres = a.vagas - a.ocupadas - (minha ? 1 : 0);
    if (livres <= 0 && !minha) return "Turma cheia";
    if (minha) return "Sua vaga é a número " + (a.ocupadas + 1) + (livres > 0 ? ". Ainda há " + livres + (livres === 1 ? " vaga livre" : " vagas livres") : "");
    return livres + (livres === 1 ? " vaga livre" : " vagas livres") + " de " + a.vagas;
  }

  function montarAulas() {
    var ul = $("lista-aulas");
    ul.textContent = "";
    var visiveis = AULAS.filter(function (a) {
      return a.dia === filtro.dia && (filtro.mod === "todas" || a.mod === filtro.mod) && (filtro.hora === "todas" || periodoDe(a) === filtro.hora);
    });
    if (!visiveis.length) {
      var vazio = el("li", "nota", "Nenhuma aula com esses filtros neste dia. Troque o dia, a aula ou o período.");
      ul.appendChild(vazio);
    }
    visiveis.forEach(function (a) {
      var minha = reservas.indexOf(a.id) !== -1;
      var cheia = !minha && a.ocupadas >= a.vagas;
      var li = el("li", "aula");
      li.setAttribute("data-aula", a.id);
      li.appendChild(el("span", "aula-hora", a.hora));
      var corpo = el("div");
      var cabeca = el("div", "aula-cabeca");
      cabeca.appendChild(el("h3", "aula-nome", NOMES_AULA[a.mod]));
      // pílula de estado (oemsz26: status pill)
      cabeca.appendChild(minha ? pilula("minha", "reservada") : (cheia ? pilula("cheia", "lotada") : pilula("aberta", "vagas abertas")));
      corpo.appendChild(cabeca);
      corpo.appendChild(el("p", "aula-info", "com " + a.instrutor + ", " + a.min + " minutos, até " + fim(a)));
      li.appendChild(corpo);
      var vagas = el("div", "vagas");
      vagas.setAttribute("role", "img");
      vagas.setAttribute("aria-label", vagasTexto(a, minha));
      // barra de lotação com número ao lado (oemsz26: progress with value)
      var ocupadasAgora = a.ocupadas + (minha ? 1 : 0);
      var lot = el("div", "lotacao");
      var trilho = el("span", "lotacao-trilho");
      var cheio = el("span", "lotacao-cheio");
      cheio.style.width = Math.round(100 * ocupadasAgora / a.vagas) + "%";
      trilho.appendChild(cheio);
      lot.appendChild(trilho);
      lot.appendChild(el("span", "lotacao-valor", ocupadasAgora + " de " + a.vagas));
      vagas.appendChild(lot);
      for (var i = 0; i < a.vagas; i++) {
        var cls = "vaga";
        if (i < a.ocupadas) cls += " cheia";
        else if (minha && i === a.ocupadas) cls += " minha";
        vagas.appendChild(el("span", cls));
      }
      var txt = el("span", "vaga-texto", vagasTexto(a, minha));
      txt.setAttribute("aria-hidden", "true");
      vagas.appendChild(txt);
      li.appendChild(vagas);
      var acao = el("div", "aula-acao");
      var b = el("button", "botao " + (minha ? "botao-contorno" : "botao-principal"), minha ? "Cancelar reserva" : (cheia ? "Turma cheia" : "Reservar vaga"));
      b.type = "button";
      b.disabled = cheia;
      b.setAttribute("aria-label", (minha ? "Cancelar reserva de " : (cheia ? "Turma cheia: " : "Reservar vaga em ")) + NOMES_AULA[a.mod] + ", " + DIAS[a.dia] + " às " + a.hora);
      b.addEventListener("click", function () { alternarReserva(a.id); });
      acao.appendChild(b);
      li.appendChild(acao);
      ul.appendChild(li);
    });
    montarReservas();
  }

  function alternarReserva(id) {
    var a = aulaPorId(id);
    var pos = reservas.indexOf(id);
    if (pos !== -1) {
      reservas.splice(pos, 1);
      avisarAulas("Reserva cancelada: " + NOMES_AULA[a.mod] + ", " + DIAS[a.dia] + " às " + a.hora + ".");
    } else {
      if (reservas.length >= LIMITE_RESERVAS) {
        avisarAulas("Você já tem " + LIMITE_RESERVAS + " reservas. Cancele uma para reservar outra.", true);
        return;
      }
      var choque = reservas.map(aulaPorId).filter(function (o) { return o.dia === a.dia && a.ini < o.ini + o.min && o.ini < a.ini + a.min; })[0];
      if (choque) {
        avisarAulas("Esse horário bate com " + NOMES_AULA[choque.mod] + " às " + choque.hora + ". Cancele uma das duas.", true);
        return;
      }
      reservas.push(id);
      avisarAulas("Vaga reservada: " + NOMES_AULA[a.mod] + ", " + DIAS[a.dia] + " às " + a.hora + ". Sua vaga é a número " + (a.ocupadas + 1) + ".");
    }
    gravar("anilha.reservas", reservas);
    montarAulas();
    atualizarAluno();
  }

  function listarReservas(ul, comCancelar) {
    ul.textContent = "";
    reservas.map(aulaPorId).sort(function (a, b) { return a.dia - b.dia || a.ini - b.ini; }).forEach(function (a) {
      var li = el("li", "reserva");
      var info = el("span", "reserva-info");
      info.appendChild(el("span", null, DIAS[a.dia] + " às " + a.hora + ", " + NOMES_AULA[a.mod]));
      info.appendChild(pilula("minha", "reservada"));
      li.appendChild(info);
      if (comCancelar) {
        var b = el("button", "botao botao-contorno", "Cancelar");
        b.type = "button";
        b.setAttribute("aria-label", "Cancelar reserva de " + NOMES_AULA[a.mod] + ", " + DIAS[a.dia] + " às " + a.hora);
        b.addEventListener("click", function () { alternarReserva(a.id); });
        li.appendChild(b);
      }
      ul.appendChild(li);
    });
  }

  function montarReservas() {
    listarReservas($("lista-reservas"), true);
    $("sem-reservas").hidden = reservas.length > 0;
  }

  $("filtro-mod").addEventListener("change", function (e) { filtro.mod = e.target.value; avisarAulas(""); montarAulas(); });
  $("filtro-hora").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    filtro.hora = b.getAttribute("data-hora");
    var todos = $("filtro-hora").querySelectorAll("button");
    for (var i = 0; i < todos.length; i++) todos[i].setAttribute("aria-pressed", todos[i] === b ? "true" : "false");
    avisarAulas("");
    montarAulas();
  });

  /* ---------- 3. Minha semana (frequência) ---------- */
  var formSem = $("form-semana");

  function espalhar(n) {
    // escolhe n dos 7 dias (0 = segunda) o mais espaçados possível
    var out = [];
    for (var i = 0; i < n; i++) out.push(Math.floor((i * 7) / n));
    return out;
  }

  function atualizarSemana() {
    var dias = Number(formSem.dias.value);
    var min = Number(formSem.min.value);
    var exp = Number(formSem.exp.value);
    var obj = formSem.obj.value;

    var maximo = [3, 4, 5][exp];
    var treinos = Math.min(dias, maximo);
    var leves = Math.min(dias - treinos, exp === 0 ? 2 : 1);
    // sempre pelo menos um dia sem nada
    if (treinos + leves > 6) leves = 6 - treinos;

    var ajuste = $("semana-ajuste");
    if (dias > maximo) {
      ajuste.hidden = false;
      ajuste.textContent = "Você tem " + dias + " dias livres, mas para quem " + ["está começando", "treina há alguns meses", "treina há mais de 2 anos"][exp] + " usamos no máximo " + maximo + " dias de treino pesado. " + (leves ? "O resto ficou como atividade leve, como caminhada." : "O resto ficou como descanso.");
    } else { ajuste.hidden = true; }

    var plano = [];
    for (var i = 0; i < 7; i++) plano.push(null);
    var posTreino = espalhar(treinos);
    // para 7 dias livres, espalhar devolve 0..n-1; com ≤ 5 treinos ficam dias espaçados
    var nomesTreino;
    if (treinos <= 3) nomesTreino = ["Corpo inteiro A", "Corpo inteiro B", "Corpo inteiro C"];
    else if (treinos === 4) nomesTreino = ["Parte de cima", "Parte de baixo", "Parte de cima", "Parte de baixo"];
    else nomesTreino = ["Peito e braços", "Pernas", "Costas e ombros", "Pernas e abdômen", "Corpo inteiro leve"];

    function variar(nome, i) {
      if (obj === "folego" && i % 2 === 1) return { nome: "Funcional ou spinning", det: "Ritmo contínuo, sem esgotar" };
      if (obj === "forca") return { nome: nome, det: "Exercícios básicos, com descanso maior entre as séries" };
      return { nome: nome, det: obj === "folego" ? "Séries com pouco descanso" : "Ritmo confortável, boa técnica" };
    }
    posTreino.forEach(function (p, i) {
      var v = variar(nomesTreino[i % nomesTreino.length], i);
      plano[p] = { tipo: "treino", nome: v.nome, det: v.det + ", " + min + " minutos" };
    });
    // atividade leve nos dias vazios mais afastados dos treinos
    var colocados = 0, d;
    [5, 4, 3, 2, 1, 0, 6].forEach(function (x) {
      if (colocados < leves && !plano[x]) { plano[x] = { tipo: "leve", nome: "Caminhada ou alongamento", det: "Leve, conversando sem falta de ar" }; colocados++; }
    });

    var ol = $("dias-semana");
    ol.textContent = "";
    var nomes = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    // linhas com tile de ícone (oemsz26: goal row / workout row)
    for (d = 0; d < 7; d++) {
      var item = plano[d] || { tipo: "descanso", nome: "Descanso", det: "Deixe o corpo se recuperar" };
      var li = el("li", "dia " + (item.tipo === "treino" ? "treino" : (item.tipo === "leve" ? "leve" : "descanso")));
      var tile = el("span", "tile");
      tile.setAttribute("aria-hidden", "true");
      if (item.tipo === "treino") tile.appendChild(icone(/Funcional|spinning/i.test(item.nome) ? "bike" : "halter"));
      else if (item.tipo === "leve") tile.appendChild(icone("passos"));
      li.appendChild(tile);
      var corpo = el("div", "dia-corpo");
      var texto = el("div", "dia-texto");
      texto.appendChild(el("span", "dia-nome", nomes[d]));
      texto.appendChild(el("span", "dia-tarefa", item.nome));
      texto.appendChild(el("span", "dia-detalhe", item.det));
      corpo.appendChild(texto);
      corpo.appendChild(pilula(item.tipo, item.tipo === "treino" ? "treino" : (item.tipo === "leve" ? "leve" : "descanso")));
      li.appendChild(corpo);
      ol.appendChild(li);
    }

    var total = treinos * min;
    $("semana-total").textContent = treinos + (treinos === 1 ? " treino" : " treinos") + " de " + min + " minutos, " + total + " minutos na semana";
    var ref = total >= 150
      ? "Orientações gerais de saúde costumam citar cerca de 150 minutos de atividade moderada por semana como referência. Seu total passa disso, mas é só uma conta, não uma meta para você."
      : "Orientações gerais de saúde costumam citar cerca de 150 minutos de atividade moderada por semana como referência. Seu total fica abaixo disso, e tudo bem: começar pequeno e manter a rotina vale mais do que exagerar.";
    $("semana-explica").textContent = ref + " Entre dois treinos que usam os mesmos músculos, costuma-se deixar cerca de 48 horas; por isso os dias foram espalhados.";
  }
  formSem.addEventListener("change", atualizarSemana);
  formSem.addEventListener("submit", function (e) { e.preventDefault(); });

  /* ---------- 5. Área do aluno ---------- */
  var USUARIO = "aluno.demo";
  var SENHA = "treino-demo";
  var logado = false;
  var presencas = ler("anilha.presencas", []);
  if (!Array.isArray(presencas)) presencas = [];

  function chaveData(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function segundaDaSemana(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = x.getDay() === 0 ? 6 : x.getDay() - 1;
    x.setDate(x.getDate() - dow);
    return x;
  }

  function atualizarAluno() {
    if (!logado) return;
    var lp = $("aluno-plano");
    lp.textContent = "";
    var pl = planoEscolhido || prontoResumo("basico");
    lp.appendChild(linha("Plano", pl.titulo));
    lp.appendChild(linha("Frequência", pl.freq));
    lp.appendChild(linha("Mensalidade", brl(pl.mensal)));
    lp.appendChild(linha("Situação", "Em dia (de mentira)"));

    var ol = $("presencas");
    ol.textContent = "";
    var seg = segundaDaSemana(new Date());
    var hoje = chaveData(new Date());
    for (var i = 0; i < 7; i++) {
      var dia = new Date(seg.getFullYear(), seg.getMonth(), seg.getDate() + i);
      var k = chaveData(dia);
      var feita = presencas.indexOf(k) !== -1;
      // linha de presença com tile (oemsz26: goal row)
      var li = el("li", "presenca" + (feita ? " feita" : "") + (k === hoje ? " hoje" : ""));
      var tile = el("span", "tile");
      tile.setAttribute("aria-hidden", "true");
      if (feita) tile.appendChild(icone("marca")); else tile.appendChild(el("i"));
      li.appendChild(tile);
      var corpo = el("div", "presenca-corpo");
      var texto = el("div");
      texto.appendChild(el("span", "presenca-nome", DIAS[dia.getDay()] + (k === hoje ? " (hoje)" : "")));
      texto.appendChild(el("span", "presenca-detalhe", ("0" + dia.getDate()).slice(-2) + "/" + ("0" + (dia.getMonth() + 1)).slice(-2) + (feita ? ", presença marcada" : ", sem presença")));
      corpo.appendChild(texto);
      corpo.appendChild(feita ? pilula("feita", "presente") : pilula("vazia", k === hoje ? "hoje" : "sem registro"));
      li.appendChild(corpo);
      li.setAttribute("aria-label", DIAS[dia.getDay()] + (feita ? ": presença marcada" : ": sem presença"));
      ol.appendChild(li);
    }
    var b = $("checkin");
    var jaFez = presencas.indexOf(hoje) !== -1;
    b.disabled = jaFez;
    b.textContent = jaFez ? "Presença de hoje já marcada" : "Marcar presença de hoje";
    listarReservas($("aluno-reservas"), false);
    if (!reservas.length) $("aluno-reservas").appendChild(el("li", "nota", "Nenhuma aula reservada. Reserve na grade de aulas."));
  }

  $("form-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var erro = $("e-login");
    if ($("l-user").value.trim() === USUARIO && $("l-senha").value === SENHA) {
      erro.hidden = true;
      logado = true;
      $("form-login").hidden = true;
      $("painel-aluno").hidden = false;
      document.querySelector(".aluno-layout").classList.add("logado");
      atualizarAluno();
      $("aluno-ola").setAttribute("tabindex", "-1");
      $("aluno-ola").focus();
    } else {
      erro.textContent = "Usuário ou senha incorretos. Use os dados que estão na tela.";
      erro.hidden = false;
    }
  });

  $("preencher-login").addEventListener("click", function () {
    $("l-user").value = USUARIO;
    $("l-senha").value = SENHA;
    $("e-login").hidden = true;
    $("form-login").querySelector('button[type="submit"]').focus();
  });

  $("sair").addEventListener("click", function () {
    logado = false;
    $("painel-aluno").hidden = true;
    $("form-login").hidden = false;
    $("l-senha").value = "";
    document.querySelector(".aluno-layout").classList.remove("logado");
    $("l-user").focus();
  });

  $("checkin").addEventListener("click", function () {
    var hoje = chaveData(new Date());
    if (presencas.indexOf(hoje) === -1) presencas.push(hoje);
    presencas = presencas.slice(-60);
    gravar("anilha.presencas", presencas);
    $("aviso-presenca").textContent = "Presença de hoje marcada. Bom treino!";
    atualizarAluno();
  });

  /* ---------- Início ---------- */
  montarDias();
  montarAulas();
  atualizarPlano();
  atualizarOpcoesMatricula();
  atualizarSemana();
})();
