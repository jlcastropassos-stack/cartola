// page5-top5.jsx — Top 5 pontuadores adversários

function Top5Row({ entry, max, isFav, onToggleFav }) {
  const D = window.__CARTOLA_DATA;
  return (
    <div className="top5-row" style={{position:'relative'}}>
      <span className="top5-row__rank">{entry.rank}.</span>
      <div className="top5-row__player">
        <Crest team={D.teamById(entry.team)} size={20}/>
        <div style={{minWidth:0}}>
          <div className="top5-row__name">{entry.name}</div>
          <div className="top5-row__pos">{D.posById(entry.pos).sigla}</div>
        </div>
      </div>
      <div className="top5-row__bar"><i style={{width:(entry.pts/max)*100+'%'}}/></div>
      <span className="top5-row__pts tnum">{entry.pts.toFixed(1)}</span>
      <Star
        on={isFav}
        onToggle={() => onToggleFav(entry.id)}
        size={12}
        className="pcard__star"
      />
    </div>
  );
}

function PageTop5({ favs, toggleFav }) {
  const D = window.__CARTOLA_DATA;

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Top 5 <em>pontuadores</em><br/>adversários</h1>
          <p className="page__sub">Os 5 maiores pontuadores que cada time enfrentará — recorte: últimos 3 jogos com mesmo mando que terão nesta rodada. Toque na estrela para favoritar — vai aparecer no topo da escalação.</p>
        </div>
        <div className="page__kicker">
          <span className="num tnum">5</span>
          <span className="eyebrow">Por defesa</span>
        </div>
      </div>

      <div className="top5-grid">
        {D.MATCHES.map(m => {
          const h = D.teamById(m.home);
          const a = D.teamById(m.away);
          const top5H = D.makeTop5(h.id).map((t,i)=>({...t, rank:i+1}));
          const top5A = D.makeTop5(a.id).map((t,i)=>({...t, rank:i+1}));
          const maxH = Math.max(...top5H.map(x=>x.pts));
          const maxA = Math.max(...top5A.map(x=>x.pts));
          return (
            <div key={m.id} className="top5-block">
              <div className="top5-block__head">
                <div className="match__side">
                  <Crest team={h} size={28}/>
                  <div className="match__name">{h.name}</div>
                </div>
                <span className="match__center" style={{fontSize:10}}>
                  <span className="vs">×</span>
                  <span>{m.date}</span>
                </span>
                <div className="match__side match__side--away">
                  <Crest team={a} size={28}/>
                  <div className="match__name">{a.name}</div>
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
                <div>
                  <div className="eyebrow" style={{marginBottom:6}}>Cederam para…</div>
                  {top5H.map((t) => (
                    <Top5Row key={t.id} entry={t} max={maxH}
                      isFav={favs.has(t.id)} onToggleFav={toggleFav}/>
                  ))}
                </div>
                <div>
                  <div className="eyebrow" style={{marginBottom:6}}>Cederam para…</div>
                  {top5A.map((t) => (
                    <Top5Row key={t.id} entry={t} max={maxA}
                      isFav={favs.has(t.id)} onToggleFav={toggleFav}/>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.PageTop5 = PageTop5;
