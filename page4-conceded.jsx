// page4-conceded.jsx — pontuação cedida por posição (últimos 3 jogos por mando)

function ConcedeBucket(v) {
  if (v < 5) return 1;
  if (v < 8) return 2;
  if (v < 11) return 3;
  if (v < 14) return 4;
  return 5;
}

function PageConceded() {
  const D = window.__CARTOLA_DATA;
  const [side, setSide] = React.useState('all'); // all | home | away

  // For each match, two rows: home (com mando=casa) e away (com mando=fora)
  const rows = React.useMemo(() => {
    const arr = [];
    D.MATCHES.forEach(m => {
      const h = D.teamById(m.home);
      const a = D.teamById(m.away);
      arr.push({ team: h, opp: a, side: 'home', match: m });
      arr.push({ team: a, opp: h, side: 'away', match: m });
    });
    return arr.filter(r => side === 'all' || r.side === side);
  }, [side]);

  const positions = D.POSITIONS.filter(p => p.id !== 'tec');

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Pontuação <em>cedida</em><br/>por posição</h1>
          <p className="page__sub">Média de pontos do Cartola que cada time cedeu por posição nos últimos 3 jogos com o mesmo mando que terá nesta rodada.</p>
        </div>
        <div className="page__kicker">
          <span className="num tnum">∅3</span>
          <span className="eyebrow">Jogos / mando</span>
        </div>
      </div>

      <div style={{display:'flex', gap:6, marginBottom:14}}>
        <button className={`pill ${side==='all'?'is-on':''}`} onClick={()=>setSide('all')}>Todos</button>
        <button className={`pill ${side==='home'?'is-on':''}`} onClick={()=>setSide('home')}>Mandantes</button>
        <button className={`pill ${side==='away'?'is-on':''}`} onClick={()=>setSide('away')}>Visitantes</button>
        <div className="spacer"/>
        <span className="eyebrow" style={{alignSelf:'center'}}>frio · morno · quente</span>
        <div style={{display:'flex', alignItems:'center', gap:2}}>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{
              width:12, height:12, borderRadius:2, display:'block',
              background: i===1?'rgba(116,210,122,0.12)' : i===2?'rgba(116,210,122,0.22)'
                       : i===3?'rgba(245,177,74,0.20)' : i===4?'rgba(232,85,62,0.22)' : 'rgba(232,85,62,0.40)'
            }}/>
          ))}
        </div>
      </div>

      <div className="card" style={{padding:0, overflow:'hidden'}}>
        <table className="heatmap">
          <thead>
            <tr>
              <th style={{textAlign:'left', paddingLeft:18}}>Time</th>
              <th>Mando</th>
              <th>vs.</th>
              {positions.map(p => <th key={p.id}>{p.sigla}</th>)}
              <th>Σ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const c = D.makeConcedeByPos(r.team.id);
              const sum = positions.reduce((s, p) => s + c[p.id], 0);
              return (
                <tr key={i}>
                  <td className="team" style={{paddingLeft:18}}>
                    <Crest team={r.team} size={22}/>
                    {r.team.name}
                  </td>
                  <td>
                    <span className="pill" style={{padding:'2px 8px', fontSize:10}}>
                      {r.side === 'home' ? 'CASA' : 'FORA'}
                    </span>
                  </td>
                  <td className="text-mute mono" style={{fontSize:11}}>{r.opp.sigla}</td>
                  {positions.map(p => (
                    <td key={p.id} className="heatmap__cell" data-h={ConcedeBucket(c[p.id])}>
                      {c[p.id].toFixed(1)}
                    </td>
                  ))}
                  <td className="mono" style={{fontWeight:600}}>{sum.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:14, fontSize:11, color:'var(--text-mute)'}}>
        Quanto mais quente a célula, mais pontos esse adversário cedeu para aquela posição. Use isso para escolher onde atacar a defesa do confronto da rodada.
      </div>
    </div>
  );
}

window.PageConceded = PageConceded;
