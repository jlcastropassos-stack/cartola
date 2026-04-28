// data.js — carrega JSONs estáticos salvos pelo admin no GitHub

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

  let PLAYERS = [];
  let MATCHES = [];
  let rodadaAtual = 14;
  let loaded  = false;
  let onReadyCallbacks = [];

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

  async function load() {
    try {
      const [cartolaRes, sofaRes] = await Promise.all([
        fetch(`${GITHUB_RAW}/cartola-mercado.json?t=${Date.now()}`),
        fetch(`${GITHUB_RAW}/sofascore-rodada.json?t=${Date.now()}`),
      ]);

      if (!cartolaRes.ok) throw new Error('cartola-mercado.json não encontrado');
      if (!sofaRes.ok)    throw new Error('sofascore-rodada.json não encontrado');

      const [cartola, sofa] = await Promise.all([cartolaRes.json(), sofaRes.json()]);

      rodadaAtual = sofa.round || cartola.rodada || 14;

      // Parseia atletas
      const atletasRaw = cartola.atletas || {};
      PLAYERS = Object.entries(atletasRaw).map(([id, a]) => ({
        id:         String(id),
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

      // Parseia confrontos
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

    } catch (err) {
      console.warn('[CartolaDashboard] Usando fallback:', err.message);
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

  function makeLast3(teamId, side) {
    const others = TEAMS.filter(t => t.id !== teamId);
    const seed = teamId.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    return [0,1,2].map(i => {
      const opp = others[(seed + i*7) % others.length];
      const gf = (seed + i*3) % 4;
      const ga = (seed + i*5) % 4;
      return { opp:opp.id, oppSigla:opp.sigla, gf, ga,
               res:gf>ga?'W':gf<ga?'L':'D', side, round: rodadaAtual-1-i };
    });
  }

  function makeDefStats(teamId) {
    const seed = teamId.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    const r = (off,min,max) => +((((seed*off)%100)/100)*(max-min)+min).toFixed(1);
    return {
      gf:r(3,.5,4.5), ga:r(7,.5,4), cs:(seed+2)%3,
      xgFor:r(11,.5,2.5), xgAg:r(13,.4,2.2),
      keeperSaves:(seed%6)+2, keeperConceded:(seed%5)+3,
      shots:(seed%12)+5, shotsAg:(seed%11)+4,
    };
  }

  function makeConcedeByPos(teamId) {
    const seed = teamId.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    const r = off => +((Math.sin(seed*off)+1)*7+2).toFixed(1);
    return { gol:r(1), lat:r(2), zag:r(3), mei:r(4), ata:r(5) };
  }

  function makeTop5(teamId) {
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

  return {
    get TEAMS()       { return TEAMS; },
    get POSITIONS()   { return POSITIONS; },
    get STATUSES()    { return STATUSES; },
    get PLAYERS()     { return PLAYERS; },
    get MATCHES()     { return MATCHES; },
    get rodadaAtual() { return rodadaAtual; },
    get loaded()      { return loaded; },
    POS_MAP, STATUS_MAP,
    onReady, load,
    teamById:   id => TEAMS.find(t => t.id === String(id)),
    posById:    id => POSITIONS.find(p => p.id === id),
    statusById: id => STATUSES.find(s => s.id === id),
    makeLast3, makeDefStats, makeConcedeByPos, makeTop5,
  };
})();
