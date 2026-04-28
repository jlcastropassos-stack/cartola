// page3-defensive.jsx — drill-down defensivo por confronto

function Last3Strip({ team, side }) {
  const D = window.__CARTOLA_DATA;
  const games = D.makeLast3(team.id, side);
  return (
    <div className="last3">
      {games.map((g, i) => (
        <div key={i} className="last3__game">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span className="last3__opp">vs {g.oppSigla}</span>
            <span className={`last3__res last3__res--${g.res}`}>{g.res}</span>
          </div>
          <div className="last3__score serif">
            <span className="tnum">{g.gf}</span><span className="sep">–</span><span className="tnum">{g.ga}</span>
          </div>
          <div style={{fontSize:8, color:'var(--text-mute)', fontFamily:'var(--mono)', letterSpacing:'.05em'}}>
            R{g.round} · {side === 'home' ? 'CASA' : 'FORA'}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatGrid({ stats }) {
  const cells = [
    { lbl: 'Gols marcados',    val: stats.gf,  sub: 'média',  barFor: stats.gf,  barMax: 5 },
    { lbl: 'Gols sofridos',    val: stats.ga,  sub: 'média',  barFor: stats.ga,  barMax: 5, neg: true },
    { lbl: 'Saídas zero (SG)', val: stats.cs,  sub: '/ 3',    barFor: stats.cs,  barMax: 3 },
    { lbl: 'Finalizações',     val: stats.shots, sub: 'a favor', barFor: stats.shots, barMax: 25 },
  ];
  return (
    <div className="stat-grid">
      {cells.map((c, i) => (
        <div key={i} className="stat-cell">
          <div className="stat-cell__lbl">{c.lbl}</div>
          <div className="stat-cell__val">
            <span>{c.val}</span>
            <span className="stat-cell__sub">{c.sub}</span>
          </div>
          <div className="stat-cell__bar">
            <i style={{
              width: Math.min(100, (c.barFor / c.barMax) * 100) + '%',
              background: c.neg ? 'var(--bad)' : 'var(--accent)',
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function DrillCol({ team, side }) {
  const D = window.__CARTOLA_DATA;
  // Passa o side para makeDefStats — mesmos 3 jogos com mando preservado
  const stats = D.makeDefStats(team.id, side);
  const xgVals = [stats.xgFor*0.8, stats.xgFor*1.1, stats.xgFor*0.9, stats.xgFor*1.2, stats.xgFor];
  return (
    <div className="drill__col">
      <div className="drill__col-head">
        <Crest team={team} size={32}/>
        <div>
          <h3>{team.name}</h3>
          <div className="eyebrow" style={{fontSize:9, marginTop:2}}>
            últimos 3 · {side === 'home' ? 'em casa' : 'fora'}
          </div>
        </div>
        <span className="pill" style={{marginLeft:'auto'}}>{side === 'home' ? 'MANDANTE' : 'VISITANTE'}</span>
      </div>

      <Last3Strip team={team} side={side}/>

      <div className="eyebrow" style={{marginBottom:8, marginTop:8}}>Sumário defensivo</div>
      <StatGrid stats={stats}/>

      <div style={{marginTop:14}}>
        <div className="eyebrow" style={{marginBottom:6}}>xG · tendência</div>
        <div className="xg-row">
          <div className="xg-row__lbl">
            <span>xG conquistado <b>{stats.xgFor}</b></span>
            <span><b>{stats.xgAg}</b> xG cedido</span>
          </div>
          <div className="xg-row__bars">
            <div className="xg-row__bar xg-row__bar--left">
              <i style={{width: Math.min(100, stats.xgFor / 3 * 100) + '%'}}/>
            </div>
            <div className="xg-row__bar xg-row__bar--right">
              <i style={{width: Math.min(100, stats.xgAg / 3 * 100) + '%'}}/>
            </div>
          </div>
        </div>
        <Sparkline values={xgVals} height={32}/>
      </div>

      <div style={{marginTop:14}}>
        <div className="eyebrow" style={{marginBottom:6}}>Defesas do goleiro</div>
        <div className="stat-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div className="stat-cell">
            <div className="stat-cell__lbl">Conquistadas</div>
            <div className="stat-cell__val">
              <span>{stats.keeperSaves}</span>
              <span className="stat-cell__sub">total</span>
            </div>
            <div className="stat-cell__bar">
              <i style={{width: Math.min(100, stats.keeperSaves * 8) + '%'}}/>
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-cell__lbl">Cedidas</div>
            <div className="stat-cell__val">
              <span>{stats.keeperConceded}</span>
              <span className="stat-cell__sub">adv.</span>
            </div>
            <div className="stat-cell__bar">
              <i style={{
                width: Math.min(100, stats.keeperConceded * 8) + '%',
                background: 'var(--warn)'
              }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageDefensive({ initialMatchId }) {
  const D = window.__CARTOLA_DATA;
  const [openId, setOpenId] = React.useState(initialMatchId || D.MATCHES[0].id);
  const open = D.MATCHES.find(m => m.id === openId);
  const home = D.teamById(open.home);
  const away = D.teamById(open.away);

  React.useEffect(() => {
    if (initialMatchId) setOpenId(initialMatchId);
  }, [initialMatchId]);

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Estatísticas <em>defensivas</em></h1>
          <p className="page__sub">Últimos 3 jogos com mando preservado. Selecione um confronto abaixo para trocar.</p>
        </div>
        <div className="page__kicker">
          <span className="num tnum">3</span>
          <span className="eyebrow">Jogos / lado</span>
        </div>
      </div>

      <div className="drill" style={{marginTop:0, marginBottom:18}}>
        <div className="drill__head">
          <div className="match__side">
            <Crest team={home} size={44}/>
            <div>
              <div className="match__name">{home.name}</div>
              <div className="match__sub">Casa · últimos 3 em casa</div>
            </div>
          </div>
          <div className="match__center">
            <span className="vs">×</span>
            <span>{open.date}</span>
          </div>
          <div className="match__side match__side--away">
            <Crest team={away} size={44}/>
            <div>
              <div className="match__name">{away.name}</div>
              <div className="match__sub">Fora · últimos 3 fora</div>
            </div>
          </div>
        </div>
        <div className="drill__body">
          <DrillCol team={home} side="home"/>
          <DrillCol team={away} side="away"/>
        </div>
      </div>

      <div className="eyebrow" style={{marginBottom:8}}>Confrontos da rodada</div>
      <div className="match-list">
        {D.MATCHES.map(m => (
          <MatchRow key={m.id} match={m}
            isOpen={m.id === openId}
            onClick={() => setOpenId(m.id)} />
        ))}
      </div>
    </div>
  );
}

window.PageDefensive = PageDefensive;
