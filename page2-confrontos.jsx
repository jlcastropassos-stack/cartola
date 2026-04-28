// page2-confrontos.jsx — agora com painel de detalhe acima da lista

function PageConfrontos({ goToDrill }) {
  const D = window.__CARTOLA_DATA;
  const [openId, setOpenId] = React.useState(D.MATCHES[0].id);
  const open = D.MATCHES.find(m => m.id === openId);
  const home = D.teamById(open.home);
  const away = D.teamById(open.away);

  return (
    <div className="page">
      <RoundStrip num={12} label="Próxima rodada" sub="Brasileirão · 2026"/>
      <div className="page__head" style={{paddingBottom:0, borderBottom:'none', marginBottom:14}}>
        <div>
          <h1 className="page__title">Os <em>confrontos</em></h1>
          <p className="page__sub">Painel do confronto selecionado em destaque. Toque em qualquer jogo abaixo para trocar.</p>
        </div>
      </div>

      {/* Painel de destaque (em cima) */}
      <div className="drill" style={{marginTop:0, marginBottom:18}}>
        <div className="drill__head">
          <div className="match__side">
            <Crest team={home} size={48}/>
            <div>
              <div className="match__name">{home.name}</div>
              <div className="match__sub">Casa</div>
            </div>
          </div>
          <div className="match__center">
            <span className="vs">×</span>
            <span>{open.date}</span>
            <span style={{fontSize:9, color:'var(--text-mute)', marginTop:4}}>{open.venue}</span>
          </div>
          <div className="match__side match__side--away">
            <Crest team={away} size={48}/>
            <div>
              <div className="match__name">{away.name}</div>
              <div className="match__sub">Fora</div>
            </div>
          </div>
        </div>
        <div style={{padding:'14px 18px', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
          <button className="pill pill--accent is-on" onClick={() => goToDrill(open.id)}>
            Ver estatísticas defensivas →
          </button>
          <span className="text-mute" style={{fontSize:11}}>
            últimos 3 jogos com mando preservado · xG · defesas · gols
          </span>
        </div>
      </div>

      <div className="eyebrow" style={{marginBottom:8}}>Selecione um confronto</div>
      <div className="match-list">
        {D.MATCHES.map(m => (
          <MatchRow key={m.id} match={m}
            isOpen={m.id === openId}
            onClick={() => setOpenId(m.id)}/>
        ))}
      </div>
    </div>
  );
}

window.PageConfrontos = PageConfrontos;
