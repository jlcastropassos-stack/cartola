// data.js — carrega JSONs do GitHub + CSV do SofaScore

window.__CARTOLA_DATA = (() => {

  const GITHUB_RAW = 'https://raw.githubusercontent.com/jlcastropassos-stack/cartola/main/dados';

  const TEAMS = [
    { id: '262',  sigla: 'FLA', name: 'Flamengo',      color: '#c8102e', crest: 'img/flamengo.png' },
    { id: '263',  sigla: 'BOT', name: 'Botafogo',      color: '#1a1a1a', crest: 'img/botafogo.png' },
    { id: '264',  sigla: 'COR', name: 'Corinthians',   color: '#1a1a1a', crest: 'img/corinthians.png' },
    { id: '265',  sigla: 'BAH', name: 'Bahia',         color: '#1d4ba8', crest: 'img/bahia.png' },
    { id: '266',  sigla: 'FLU', name: 'Fluminense',    color: '#7a1f2b', crest: 'img/fluminense.png' },
    { id: '267',  sigla: 'VAS', name: 'Vasco',         color: '#1a1a1a', crest: 'img/vasco.png' },
    { id: '275',  sigla: 'PAL', name: 'Palmeiras',     color: '#0a6e3a', crest: 'img/palmeiras.png' },
    { id: '276',  sigla: 'SAO', name: 'São Paulo',     color: '#cf2027', crest: 'img/sao-paulo.png' },
    { id: '277',  sigla: 'SAN', name: 'Santos',        color: '#1a1a1a', crest: 'img/santos.png' },
    { id: '280',  sigla: 'RBB', name: 'Bragantino',    color: '#cc0000', crest: 'img/red-bull-bragantino.png' },
    { id: '282',  sigla: 'CAM', name: 'Atlético-MG',   color: '#1a1a1a', crest: 'img/atletico-mg.png' },
    { id: '283',  sigla: 'CRU', name: 'Cruzeiro',      color: '#1d4ba8', crest: 'img/cruzeiro.png' },
    { id: '284',  sigla: 'GRE', name: 'Grêmio',        color: '#1f6cb8', crest: 'img/gremio.png' },
    { id: '285',  sigla: 'INT', name: 'Internacional', color: '#c8102e', crest: 'img/internacional.png' },
    { id: '287',  sigla: 'VIT', name: 'Vitória',       color: '#c8102e', crest: 'img/vitoria.png' },
    { id: '293',  sigla: 'CAP', name: 'Athletico-PR',  color: '#c8102e', crest: 'img/athletico-pr.png' },
    { id: '294',  sigla: 'CFC', name: 'Coritiba',      color: '#0a6e3a', crest: 'img/coritiba.png' },
    { id: '315',  sigla: 'CHA', name: 'Chapecoense',   color: '#0a6e3a', crest: 'img/chapecoense.png' },
    { id: '364',  sigla: 'REM', name: 'Remo',          color: '#1a1a7a', crest: 'img/remo.png' },
    { id: '2305', sigla: 'MIR', name: 'Mirassol',      color: '#0a6e3a', crest: 'img/mirassol.png' },
  ];

  // SofaScore usa shortName — mapear para clube_id do Cartola
  // Os shortNames vêm do scraper: ev["homeTeam"]["shortName"]
  const SOFA_NAME_TO_ID = {
    'Flamengo':'262','Botafogo':'263','Corinthians':'264','Bahia':'265',
    'Fluminense':'266','Vasco':'267','Palmeiras':'275','São Paulo':'276',
    'Santos':'277','Bragantino':'280','Atlético-MG':'282','Cruzeiro':'283',
    'Grêmio':'284','Internacional':'285','Vitória':'287','Athletico-PR':'293',
    'Coritiba':'294','Chapecoense':'315','Remo':'364','Mirassol':'2305',
    // aliases comuns do SofaScore
    'Atletico Mineiro':'282','Atletico MG':'282','Atlético Mineiro':'282',
    'Red Bull Bragantino':'280','RB Bragantino':'280',
    'Athletico Paranaense':'293','Athletico PR':'293',
    'Sao Paulo':'276','São Paulo FC':'276',
    'Gremio':'284',
  };

  const SOFA_TO_CARTOLA = {
    'FLA':'262','BOT':'263','COR':'264','BAH':'265','FLU':'266',
    'VAS':'267','PAL':'275','SAO':'276','SAN':'277','RBB':'280',
    'CAM':'282','CRU':'283','GRE':'284','INT':'285','VIT':'287',
    'CAP':'293','CFC':'294','CHA':'315','REM':'364','MIR':'2305',
  };

  const POSITIONS = [
    { id: 'gol', sigla: 'GOL', name: 'Goleiro' },
    { id: 'lat', sigla: 'LAT', name: 'Lateral' },
    { id: 'zag', sigla: 'ZAG', name: 'Zagueiro' },
    { id: 'mei', sigla: 'MEI', name: 'Meia' },
    { id: 'ata', sigla: 'ATA', name: 'Atacante' },
    { id: 'tec', sigla: 'TEC', name: 'Técnico' },
  ];

  const POS_MAP    = { 1:'gol', 2:'lat', 3:'zag', 4:'mei', 5:'ata', 6:'tec' };
  const STATUS_MAP = { 2:'duvida', 3:'suspenso', 5:'contundido', 6:'nulo', 7:'provavel' };

  const STATUSES = [
    { id: 'provavel',   label: 'Provável' },
    { id: 'duvida',     label: 'Dúvida' },
    { id: 'nulo',       label: 'Nulo' },
    { id: 'suspenso',   label: 'Suspenso' },
    { id: 'contundido', label: 'Contundido' },
  ];

  let PLAYERS      = [];
  let MATCHES      = [];
  let SOFA_GAMES   = [];   // linhas do CSV do SofaScore
  let rodadaAtual  = 14;
  let loaded       = false;
  let onReadyCallbacks = [];

  // ── CSV parser mínimo ──────────────────────────────────────────────────────
  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^\uFEFF/, ''));
    return lines.slice(1).map(line => {
      // lida com vírgulas dentro de aspas
      const vals = [];
      let cur = '', inQ = false;
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
        else { cur += ch; }
      }
      vals.push(cur.trim());
      const obj = {};
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
      return obj;
    });
  }

  // ── Resolve shortName do SofaScore -> clube_id ─────────────────────────────
  function resolveTeamId(shortName) {
    return SOFA_NAME_TO_ID[shortName] || null;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatTimestamp(ts) {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    return `${dias[d.getDay()]} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  function geraMatchesFallback() {
    const ids = Object.values(SOFA_TO_CARTOLA);
    return Array.from({length:10}, (_,i) => ({
      id:`m${i+1}`, home:ids[i*2], away:ids[i*2+1],
      date:'A confirmar', venue:'',
    }));
  }

  // ── Load principal ─────────────────────────────────────────────────────────
  async function load() {
    try {
      const [cartolaRes, sofaRes, sofaCsvRes] = await Promise.all([
        fetch(`${GITHUB_RAW}/cartola-mercado.json?t=${Date.now()}`),
        fetch(`${GITHUB_RAW}/sofascore-rodada.json?t=${Date.now()}`),
        fetch(`${GITHUB_RAW}/base_sofascore.csv?t=${Date.now()}`),
      ]);

      if (!cartolaRes.ok) throw new Error('cartola-mercado.json não encontrado');
      if (!sofaRes.ok)    throw new Error('sofascore-rodada.json não encontrado');

      const [cartola, sofa] = await Promise.all([cartolaRes.json(), sofaRes.json()]);

      rodadaAtual = sofa.round || cartola.rodada || 14;

      // Atletas — suporta array (mercado) e objeto (pontuados)
      const atletasRaw = cartola.atletas || [];
      const atletasArr = Array.isArray(atletasRaw) ? atletasRaw : Object.values(atletasRaw);
      PLAYERS = atletasArr.map(a => ({
        id:         String(a.atleta_id),
        name:       a.apelido || '',
        position:   POS_MAP[a.posicao_id] || 'mei',
        team:       String(a.clube_id),
        price:      a.preco_num    || 0,
        status:     STATUS_MAP[a.status_id] || 'provavel',
        mediaPts:   a.media_num    || 0,
        lastPts:    a.pontos_num   || 0,
        minToValue: a.variacao_num || 0,
        jogos:      a.jogos_num    || 0,
      }));

      // Confrontos da rodada
      MATCHES = (sofa.matches || [])
        .filter(m => SOFA_TO_CARTOLA[m.homeSigla] && SOFA_TO_CARTOLA[m.awaySigla])
        .map((m, i) => ({
          id:     `m${i+1}`,
          home:   SOFA_TO_CARTOLA[m.homeSigla],
          away:   SOFA_TO_CARTOLA[m.awaySigla],
          date:   formatTimestamp(m.timestamp),
          venue:  m.venue || '',
          sofaId: m.id,
        }));

      if (MATCHES.length === 0) MATCHES = geraMatchesFallback();

      // CSV SofaScore — opcional, não quebra se não existir
      if (sofaCsvRes.ok) {
        const csvText = await sofaCsvRes.text();
        const rows = parseCSV(csvText);
        SOFA_GAMES = rows.map(r => ({
          rodada:        parseInt(r.rodada) || 0,
          event_id:      r.event_id,
          casaNome:      r.casa,
          foraNome:      r.fora,
          casaId:        resolveTeamId(r.casa),
          foraId:        resolveTeamId(r.fora),
          gols_casa:     parseFloat(r.gols_casa) || 0,
          gols_fora:     parseFloat(r.gols_fora) || 0,
          res_casa:      r.resultado_casa,   // V / E / D
          res_fora:      r.resultado_fora,
          xg_casa:       parseFloat(r.xg_casa) || null,
          xg_fora:       parseFloat(r.xg_fora) || null,
          chutes_casa:   parseFloat(r.chutes_casa) || null,
          chutes_fora:   parseFloat(r.chutes_fora) || null,
          chutes_gol_casa: parseFloat(r.chutes_no_gol_casa) || null,
          chutes_gol_fora: parseFloat(r.chutes_no_gol_fora) || null,
          escanteios_casa: parseFloat(r.escanteios_casa) || null,
          escanteios_fora: parseFloat(r.escanteios_fora) || null,
          faltas_casa:   parseFloat(r.faltas_casa) || null,
          faltas_fora:   parseFloat(r.faltas_fora) || null,
        }));
        console.log(`[CartolaDashboard] SofaScore: ${SOFA_GAMES.length} jogos carregados`);
      } else {
        console.warn('[CartolaDashboard] base_sofascore.csv não encontrado — usando dados simulados');
      }

    } catch (err) {
      console.warn('[CartolaDashboard] Erro no load:', err.message);
      MATCHES = geraMatchesFallback();
    } finally {
      loaded = true;
      onReadyCallbacks.forEach(fn => fn());
      onReadyCallbacks = [];
    }
  }

  function onReady(fn) {
    if (loaded) fn();
    else onReadyCallbacks.push(fn);
  }

  load();

  // ── Helpers do SofaScore ────────────────────────────────────────────────────

  // Últimos N jogos de um time com um determinado mando (home|away|all)
  function getJogosTime(teamId, side, n = 3) {
    const jogos = [];
    // percorre do mais recente para o mais antigo
    const sorted = [...SOFA_GAMES].sort((a, b) => b.rodada - a.rodada);
    for (const g of sorted) {
      if (jogos.length >= n) break;
      const ehCasa = g.casaId === teamId;
      const ehFora = g.foraId === teamId;
      if (!ehCasa && !ehFora) continue;
      const lado = ehCasa ? 'home' : 'away';
      if (side !== 'all' && lado !== side) continue;
      jogos.push({ ...g, lado });
    }
    return jogos;
  }

  // ── makeLast3 — REAL ────────────────────────────────────────────────────────
  function makeLast3(teamId, side) {
    const jogos = getJogosTime(teamId, side, 3);

    // Se não tem dados reais suficientes, usa fallback simulado
    if (jogos.length === 0) return makeLast3Fallback(teamId, side);

    return jogos.map(g => {
      const ehCasa = g.casaId === teamId;
      const oppId   = ehCasa ? g.foraId   : g.casaId;
      const oppNome = ehCasa ? g.foraNome : g.casaNome;
      const gf      = ehCasa ? g.gols_casa : g.gols_fora;
      const ga      = ehCasa ? g.gols_fora : g.gols_casa;
      const res     = gf > ga ? 'W' : gf < ga ? 'L' : 'D';
      const opp     = TEAMS.find(t => t.id === oppId);
      return {
        opp:     oppId || '',
        oppSigla: opp ? opp.sigla : oppNome?.slice(0,3).toUpperCase() || '???',
        gf, ga, res,
        side: ehCasa ? 'home' : 'away',
        round: g.rodada,
      };
    });
  }

  function makeLast3Fallback(teamId, side) {
    const others = TEAMS.filter(t => t.id !== teamId);
    const seed   = teamId.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    return [0,1,2].map(i => {
      const opp = others[(seed + i*7) % others.length];
      const gf  = (seed + i*3) % 4;
      const ga  = (seed + i*5) % 4;
      return { opp:opp.id, oppSigla:opp.sigla, gf, ga,
               res:gf>ga?'W':gf<ga?'L':'D', side, round: rodadaAtual-1-i };
    });
  }

  // ── makeDefStats — REAL ─────────────────────────────────────────────────────
  function makeDefStats(teamId) {
    const jogos = getJogosTime(teamId, 'all', 5);

    if (jogos.length === 0) return makeDefStatsFallback(teamId);

    const avg = (arr, key) => {
      const vals = arr.map(g => {
        const ehCasa = g.casaId === teamId;
        return ehCasa ? g[`${key}_casa`] : g[`${key}_fora`];
      }).filter(v => v !== null && !isNaN(v));
      return vals.length ? vals.reduce((a,b) => a+b, 0) / vals.length : null;
    };

    const avgOp = (arr, key) => {
      const vals = arr.map(g => {
        const ehCasa = g.casaId === teamId;
        return ehCasa ? g[`${key}_fora`] : g[`${key}_casa`];
      }).filter(v => v !== null && !isNaN(v));
      return vals.length ? vals.reduce((a,b) => a+b, 0) / vals.length : null;
    };

    const gf = +(jogos.reduce((s,g) => {
      const ehCasa = g.casaId === teamId;
      return s + (ehCasa ? g.gols_casa : g.gols_fora);
    }, 0) / jogos.length).toFixed(1);

    const ga = +(jogos.reduce((s,g) => {
      const ehCasa = g.casaId === teamId;
      return s + (ehCasa ? g.gols_fora : g.gols_casa);
    }, 0) / jogos.length).toFixed(1);

    const cs = jogos.filter(g => {
      const ehCasa = g.casaId === teamId;
      return (ehCasa ? g.gols_fora : g.gols_casa) === 0;
    }).length;

    const xgFor  = avg(jogos, 'xg');
    const xgAg   = avgOp(jogos, 'xg');
    const shots  = avg(jogos, 'chutes');
    const shotsAg = avgOp(jogos, 'chutes');
    const keeperSaves   = avg(jogos, 'chutes_gol');    // chutes no gol a favor = defesas do goleiro adv
    const keeperConceded = avgOp(jogos, 'chutes_gol'); // chutes no gol do adv = gol keeper sofreu

    return {
      gf, ga, cs,
      xgFor:  xgFor  !== null ? +xgFor.toFixed(1)   : 1.2,
      xgAg:   xgAg   !== null ? +xgAg.toFixed(1)    : 1.1,
      shots:  shots  !== null ? +shots.toFixed(0)   : 12,
      shotsAg: shotsAg !== null ? +shotsAg.toFixed(0) : 11,
      keeperSaves:    keeperSaves   !== null ? +keeperSaves.toFixed(0)   : 5,
      keeperConceded: keeperConceded !== null ? +keeperConceded.toFixed(0) : 4,
    };
  }

  function makeDefStatsFallback(teamId) {
    const seed = teamId.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    const r = (off,min,max) => +((((seed*off)%100)/100)*(max-min)+min).toFixed(1);
    return {
      gf:r(3,.5,4.5), ga:r(7,.5,4), cs:(seed+2)%3,
      xgFor:r(11,.5,2.5), xgAg:r(13,.4,2.2),
      keeperSaves:(seed%6)+2, keeperConceded:(seed%5)+3,
      shots:(seed%12)+5, shotsAg:(seed%11)+4,
    };
  }

  // ── makeConcedeByPos — usa pontuação real dos atletas do Cartola ─────────────
  // Lógica: pega os últimos N jogos do adversário com o mesmo mando,
  // cruza com as pontuações dos atletas do Cartola que jogaram contra ele,
  // agrupa por posição e tira média.
  // Como o CSV do SofaScore não tem pontuação individual (só stats do jogo),
  // usamos os scouts acumulados do cartola-mercado para estimar.
  // A versão real precisaria do base_cartola_pontuacoes.csv.
  // Por enquanto usa o fallback com seed mas preparado para upgrade.
  function makeConcedeByPos(teamId) {
    // TODO: quando base_cartola_pontuacoes.csv estiver disponível,
    // cruzar jogos do SofaScore onde teamId jogou como adversário
    // com as pontuações dos atacantes/meias/etc do time mandante.
    // Por ora usa seed determinístico mas visualmente consistente.
    return makeConcedeByPosFallback(teamId);
  }

  function makeConcedeByPosFallback(teamId) {
    const seed = teamId.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    const r = off => +((Math.sin(seed*off)+1)*7+2).toFixed(1);
    return { gol:r(1), lat:r(2), zag:r(3), mei:r(4), ata:r(5) };
  }

  // ── makeTop5 — REAL: top pontuadores que jogaram contra esse time ────────────
  function makeTop5(teamId) {
    // Pega jogos onde teamId foi adversário
    const jogosComoAdv = SOFA_GAMES.filter(g =>
      (g.casaId === teamId || g.foraId === teamId)
    ).sort((a,b) => b.rodada - a.rodada).slice(0, 5);

    if (jogosComoAdv.length === 0) return makeTop5Fallback(teamId);

    // Times que enfrentaram teamId
    const timesQueEnfrentaram = new Set(jogosComoAdv.map(g =>
      g.casaId === teamId ? g.foraId : g.casaId
    ));

    // Pega os jogadores desses times com maior média
    const candidatos = PLAYERS
      .filter(p =>
        timesQueEnfrentaram.has(p.team) &&
        p.position !== 'tec' &&
        p.position !== 'gol' &&
        p.mediaPts > 0 &&
        p.jogos >= 2
      )
      .sort((a, b) => b.mediaPts - a.mediaPts)
      .slice(0, 5);

    if (candidatos.length < 3) return makeTop5Fallback(teamId);

    return candidatos.map((p, i) => ({
      id:       p.id,
      name:     p.name,
      team:     p.team,
      teamSigla: TEAMS.find(t => t.id === p.team)?.sigla || '',
      pos:      p.position,
      pts:      +p.mediaPts.toFixed(1),
    }));
  }

  function makeTop5Fallback(teamId) {
    const seed = teamId.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    return PLAYERS
      .filter(p => p.team !== teamId && p.position !== 'tec' && p.position !== 'gol')
      .map(p => {
        const pidNum = parseInt(p.id, 10) || 0;
        return { p, sortKey: ((seed*31 + pidNum*17) % 9973)/9973 + p.mediaPts*0.1 };
      })
      .sort((a,b) => b.sortKey - a.sortKey)
      .slice(0,5)
      .map((x,i) => ({
        id: x.p.id, name: x.p.name, team: x.p.team,
        teamSigla: TEAMS.find(t => t.id === x.p.team)?.sigla || '',
        pos: x.p.position,
        pts: +((22 - i*2.5) + ((seed + parseInt(x.p.id,10)*7) % 30)/10).toFixed(1),
      }));
  }

  // ── API pública ─────────────────────────────────────────────────────────────
  return {
    get TEAMS()       { return TEAMS; },
    get POSITIONS()   { return POSITIONS; },
    get STATUSES()    { return STATUSES; },
    get PLAYERS()     { return PLAYERS; },
    get MATCHES()     { return MATCHES; },
    get SOFA_GAMES()  { return SOFA_GAMES; },
    get rodadaAtual() { return rodadaAtual; },
    get loaded()      { return loaded; },
    POS_MAP, STATUS_MAP,
    onReady, load,
    teamById:   id => TEAMS.find(t => t.id === String(id)),
    posById:    id => POSITIONS.find(p => p.id === id),
    statusById: id => STATUSES.find(s => s.id === id),
    makeLast3, makeDefStats, makeConcedeByPos, makeTop5,
    // expõe helpers para debug
    getJogosTime,
  };
})();
