// data.js — MOCK DATA. Replace `TEAMS`, `PLAYERS`, `MATCHES` with real data when integrating.
// All visual placeholders use a colored circle + 3-letter sigla. Swap `team.crest` to an <img src> when you have real escudos.

window.__CARTOLA_DATA = (() => {
  // ── TEAMS ─────────────────────────────────────────────────────────
  // PLACEHOLDER: substitute `crest` with the URL/path to the real shield image.
  const TEAMS = [
    { id: 'fla', sigla: 'FLA', name: 'Flamengo',     color: '#c8102e', crest: null },
    { id: 'pal', sigla: 'PAL', name: 'Palmeiras',    color: '#0a6e3a', crest: null },
    { id: 'cor', sigla: 'COR', name: 'Corinthians',  color: '#111111', crest: null },
    { id: 'sao', sigla: 'SAO', name: 'São Paulo',    color: '#cf2027', crest: null },
    { id: 'min', sigla: 'CAM', name: 'Atlético-MG',  color: '#1a1a1a', crest: null },
    { id: 'cru', sigla: 'CRU', name: 'Cruzeiro',     color: '#1d4ba8', crest: null },
    { id: 'flu', sigla: 'FLU', name: 'Fluminense',   color: '#7a1f2b', crest: null },
    { id: 'bot', sigla: 'BOT', name: 'Botafogo',     color: '#222222', crest: null },
    { id: 'vas', sigla: 'VAS', name: 'Vasco',        color: '#0a0a0a', crest: null },
    { id: 'gre', sigla: 'GRE', name: 'Grêmio',       color: '#1f6cb8', crest: null },
    { id: 'int', sigla: 'INT', name: 'Internacional',color: '#c8102e', crest: null },
    { id: 'bah', sigla: 'BAH', name: 'Bahia',        color: '#1d4ba8', crest: null },
    { id: 'for', sigla: 'FOR', name: 'Fortaleza',    color: '#1a3b8c', crest: null },
    { id: 'jvn', sigla: 'JUV', name: 'Juventude',    color: '#1f7a3a', crest: null },
    { id: 'cri', sigla: 'CRI', name: 'Criciúma',     color: '#f3c500', crest: null },
    { id: 'ath', sigla: 'CAP', name: 'Athletico-PR', color: '#c8102e', crest: null },
    { id: 'cui', sigla: 'CUI', name: 'Cuiabá',       color: '#0a6e3a', crest: null },
    { id: 'rba', sigla: 'RBB', name: 'Bragantino',   color: '#c8102e', crest: null },
    { id: 'vit', sigla: 'VIT', name: 'Vitória',      color: '#c8102e', crest: null },
    { id: 'atg', sigla: 'ATG', name: 'Atlético-GO',  color: '#c8102e', crest: null },
  ];

  const POSITIONS = [
    { id: 'gol', sigla: 'GOL', name: 'Goleiro' },
    { id: 'lat', sigla: 'LAT', name: 'Lateral' },
    { id: 'zag', sigla: 'ZAG', name: 'Zagueiro' },
    { id: 'mei', sigla: 'MEI', name: 'Meia' },
    { id: 'ata', sigla: 'ATA', name: 'Atacante' },
    { id: 'tec', sigla: 'TEC', name: 'Técnico' },
  ];

  const STATUSES = [
    { id: 'provavel',   label: 'Provável' },
    { id: 'duvida',     label: 'Dúvida' },
    { id: 'nulo',       label: 'Nulo' },
    { id: 'suspenso',   label: 'Suspenso' },
    { id: 'contundido', label: 'Contundido' },
  ];

  // PLACEHOLDER: substitute these names/values with real Cartola data.
  // Field meanings: id, name, position(gol|lat|zag|mei|ata|tec), team(id),
  // price (cartoletas), status, mediaPts, lastPts, minToValue (mínimo p/ valorizar)
  const FIRST = ['Hugo','Rafael','Bruno','André','Lucas','Pedro','Gabriel','Rodrigo','Marcos','Thiago',
                 'Vinícius','Felipe','Eduardo','Carlos','João','Mateus','Paulo','Renato','Léo','Diego',
                 'Igor','Yuri','Wesley','Cauã','Nicolas','Henrique','Alex','Daniel','Ramon','Caio'];
  const LAST  = ['Souza','Silva','Costa','Pereira','Ribeiro','Santos','Almeida','Ferreira','Gomes','Rocha',
                 'Cardoso','Mendes','Barros','Moreira','Teixeira','Andrade','Marques','Pinto','Carvalho','Vieira'];

  let pidCounter = 0;
  function makePlayer(pos, team) {
    const status = ['provavel','provavel','provavel','duvida','duvida','nulo','suspenso','contundido']
                   [Math.floor(Math.random()*8)];
    const price = +(Math.random()*15 + 2).toFixed(2);
    const media = +(Math.random()*10 + 1).toFixed(1);
    const last = +((Math.random()-0.3)*20).toFixed(1);
    const minToVal = +(Math.random()*4 + 0.5).toFixed(1);
    return {
      id: `p${++pidCounter}`,
      name: pos === 'tec'
        ? `${FIRST[Math.floor(Math.random()*FIRST.length)]} ${LAST[Math.floor(Math.random()*LAST.length)]}`
        : `${FIRST[Math.floor(Math.random()*FIRST.length)]} ${LAST[Math.floor(Math.random()*LAST.length)]}`,
      position: pos,
      team: team.id,
      price, status, mediaPts: media, lastPts: last, minToValue: minToVal,
    };
  }

  // 4-6 players per team per position-ish
  const PLAYERS = [];
  TEAMS.forEach(t => {
    // 2 GOL, 4 LAT, 4 ZAG, 5 MEI, 4 ATA, 1 TEC
    [['gol',2],['lat',4],['zag',4],['mei',5],['ata',4],['tec',1]].forEach(([pos,n])=>{
      for (let i=0; i<n; i++) PLAYERS.push(makePlayer(pos, t));
    });
  });

  // ── MATCHES (rodada 12) ────────────────────────────
  const MATCHES = [
    { id: 'm1',  home: 'fla', away: 'pal', date: 'Sáb 20:30',  venue: 'Maracanã' },
    { id: 'm2',  home: 'cor', away: 'sao', date: 'Sáb 18:30',  venue: 'Neo Química' },
    { id: 'm3',  home: 'min', away: 'cru', date: 'Sáb 16:00',  venue: 'Arena MRV' },
    { id: 'm4',  home: 'flu', away: 'bot', date: 'Dom 16:00',  venue: 'Maracanã' },
    { id: 'm5',  home: 'gre', away: 'int', date: 'Dom 18:30',  venue: 'Arena GRE' },
    { id: 'm6',  home: 'vas', away: 'bah', date: 'Dom 20:30',  venue: 'São Januário' },
    { id: 'm7',  home: 'for', away: 'jvn', date: 'Sáb 21:00',  venue: 'Castelão' },
    { id: 'm8',  home: 'rba', away: 'vit', date: 'Dom 11:00',  venue: 'Nabi Abi' },
    { id: 'm9',  home: 'cri', away: 'ath', date: 'Dom 16:00',  venue: 'Heriberto' },
    { id: 'm10', home: 'cui', away: 'atg', date: 'Dom 18:30',  venue: 'Arena Pantanal' },
  ];

  // Per-team last 3 home/away results (mock). Replace with real data.
  function makeLast3(teamId, side /* home|away */) {
    const others = TEAMS.filter(t => t.id !== teamId);
    return [0,1,2].map(i => {
      const opp = others[(teamId.charCodeAt(0) + i*3) % others.length];
      const gf = Math.floor(Math.random()*4);
      const ga = Math.floor(Math.random()*4);
      const res = gf > ga ? 'W' : gf < ga ? 'L' : 'D';
      return { opp: opp.id, oppSigla: opp.sigla, gf, ga, res, side, round: 11 - i };
    });
  }

  // Defensive stats per team (mock — last 3 games at this venue side)
  function makeDefStats(teamId) {
    return {
      gf:    +(Math.random()*4 + 1).toFixed(1),     // gols marcados
      ga:    +(Math.random()*4 + 0.5).toFixed(1),   // gols sofridos
      cs:    Math.floor(Math.random()*3),           // clean sheets / SG
      xgFor: +(Math.random()*2 + 0.5).toFixed(2),
      xgAg:  +(Math.random()*2 + 0.4).toFixed(2),
      keeperSaves:    Math.floor(Math.random()*8 + 2), // defesas conquistadas (do GOL)
      keeperConceded: Math.floor(Math.random()*7 + 3), // defesas cedidas (que adv. fez)
      shots: Math.floor(Math.random()*15 + 5),
      shotsAg: Math.floor(Math.random()*15 + 4),
    };
  }

  // Points conceded by position (last 3 games) per team
  function makeConcedeByPos(teamId) {
    const seed = teamId.charCodeAt(0) + teamId.charCodeAt(1);
    const r = (off) => +((Math.sin(seed + off) + 1) * 8 + 2).toFixed(1);
    return {
      gol: r(1), lat: r(2), zag: r(3), mei: r(4), ata: r(5),
    };
  }

  // Top 5 advs scorers vs this team in their last 3 (home or away)
  // Returns REAL players (from PLAYERS) so favoriting syncs with page 1.
  function makeTop5(teamId) {
    // Pick top scoring players from teams OTHER than `teamId`.
    // Deterministic per teamId using a seeded shuffle.
    const seed = teamId.charCodeAt(0) * 31 + teamId.charCodeAt(1);
    const candidates = PLAYERS
      .filter(p => p.team !== teamId && p.position !== 'tec' && p.position !== 'gol')
      .map((p, i) => ({ p, sortKey: ((seed + i * 17) % 97) / 97 + p.mediaPts * 0.1 }))
      .sort((a, b) => b.sortKey - a.sortKey)
      .slice(0, 5)
      .map(x => x.p);
    return candidates.map((p, i) => ({
      id: p.id,                   // REAL player id — syncs with page 1 favorites
      name: p.name,
      team: p.team,
      teamSigla: TEAMS.find(t => t.id === p.team).sigla,
      pos: p.position,
      pts: +((22 - i*2.5) + ((seed + i*7) % 30)/10).toFixed(1),
    }));
  }

  return {
    TEAMS,
    POSITIONS,
    STATUSES,
    PLAYERS,
    MATCHES,
    teamById: (id) => TEAMS.find(t => t.id === id),
    posById:  (id) => POSITIONS.find(p => p.id === id),
    statusById: (id) => STATUSES.find(s => s.id === id),
    makeLast3,
    makeDefStats,
    makeConcedeByPos,
    makeTop5,
  };
})();
