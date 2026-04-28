// page1-lineup.jsx — Escalar meu time

const { useState: useState1, useEffect: useEffect1, useRef: useRef1, useMemo: useMemo1, useCallback: useCallback1 } = React;

// ── Persistência localStorage ──────────────────────────────────────────────
const LS_FAVS       = 'cartola_favs_v1';
const LS_PLACEMENTS = 'cartola_placements_v1';

function loadFavsFromLS() {
  try { return new Set(JSON.parse(localStorage.getItem(LS_FAVS) || '[]')); }
  catch { return new Set(); }
}
function saveFavsToLS(favs) {
  try { localStorage.setItem(LS_FAVS, JSON.stringify([...favs])); } catch {}
}
function loadPlacementsFromLS() {
  try { return JSON.parse(localStorage.getItem(LS_PLACEMENTS) || '[]'); }
  catch { return []; }
}
function savePlacementsToLS(placements) {
  try { localStorage.setItem(LS_PLACEMENTS, JSON.stringify(placements)); } catch {}
}

// Hook para favoritos com persistência
function useFavs() {
  const [favs, setFavs] = useState1(() => loadFavsFromLS());
  const toggleFav = useCallback1((id) => {
    setFavs(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      saveFavsToLS(n);
      return n;
    });
  }, []);
  return [favs, toggleFav];
}

function FieldMarkings() {
  return (
    <>
      <div className="field-markings"/>
      <div className="fm-mid"/>
      <div className="fm-circle"/>
      <div className="fm-spot"/>
      <div className="fm-box fm-box--top"/>
      <div className="fm-box fm-box--bot"/>
      <div className="fm-box-sm fm-box-sm--top"/>
      <div className="fm-box-sm fm-box-sm--bot"/>
    </>
  );
}

// ── Player card (in rail) ──
function PlayerCard({ player, isFav, isOnField, onToggleFav, onTap }) {
  const D = window.__CARTOLA_DATA;
  const team   = D.teamById(player.team);
  const status = D.statusById(player.status);
  const pos    = D.posById(player.position);
  const lastClass = player.lastPts > 5 ? 'up' : player.lastPts < 0 ? 'down' : '';

  return (
    <div
      className={`pcard ${isOnField ? 'is-on-field' : ''}`}
      onClick={(e) => { if (!e.target.closest('.pcard__star')) onTap?.(player); }}
    >
      <Star on={isFav} onToggle={() => onToggleFav(player.id)} />
      <div className="pcard__top">
        <Crest team={team} size={28}/>
        <div className="pcard__pos">{pos.sigla}</div>
        <div className="spacer" />
        <StatusDot status={player.status} />
      </div>
      <div className="pcard__name">{player.name}</div>
      <div className="pcard__meta">
        <span className="pcard__price tnum">C$ {player.price.toFixed(2)}</span>
        <span className="text-mute">·</span>
        <span className="text-mute" style={{fontSize:9, textTransform:'uppercase', letterSpacing:'.06em'}}>{status.label}</span>
      </div>
      <div className="pcard__stats">
        <div className="pcard__stat">
          <span className="pcard__stat-num tnum">{player.mediaPts.toFixed(1)}</span>
          <span className="pcard__stat-lbl">Média</span>
        </div>
        <div className="pcard__stat">
          <span className={`pcard__stat-num tnum ${lastClass}`}>
            {player.lastPts > 0 ? '+' : ''}{player.lastPts.toFixed(1)}
          </span>
          <span className="pcard__stat-lbl">Última</span>
        </div>
        <div className="pcard__stat">
          <span className={`pcard__stat-num tnum ${player.variacao > 0 ? 'up' : player.variacao < 0 ? 'down' : ''}`}>
            {player.variacao > 0 ? '+' : ''}{player.variacao.toFixed(2)}
          </span>
          <span className="pcard__stat-lbl">Var C$</span>
        </div>
      </div>
    </div>
  );
}

// ── Jogador no campo ──
function FieldPlayer({ placement, player, onPointerDown, isFav }) {
  const D = window.__CARTOLA_DATA;
  const team = D.teamById(player.team);
  return (
    <div className="fp" data-id={placement.id}
      style={{ left: placement.x + '%', top: placement.y + '%' }}
      onPointerDown={(e) => onPointerDown(e, placement)}
    >
      <div className="fp__chip" style={{
        background: team.color,
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.7)',
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Escudo do time */}
        {team.crest
          ? <img src={team.crest} alt={team.sigla} style={{
              width: '70%', height: '70%', objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
            }}/>
          : <span style={{textShadow:'0 1px 2px rgba(0,0,0,0.5)'}}>{team.sigla}</span>
        }
        <StatusDot status={player.status} size={9} />
      </div>
      <div className="fp__name">{player.name.split(' ').slice(-1)[0]}</div>
      {isFav && <span className="fp__star">★</span>}
    </div>
  );
}

function PageLineup({ favs: favsExternal, toggleFav: toggleFavExternal }) {
  const D = window.__CARTOLA_DATA;

  // Usa favs persistidos se não receber de fora
  const [favsInternal, toggleFavInternal] = useFavs();
  const favs      = favsExternal      || favsInternal;
  const toggleFav = toggleFavExternal || toggleFavInternal;

  const [posFilter,    setPosFilter]    = useState1('ata');
  const [statusFilter, setStatusFilter] = useState1(new Set(['provavel','duvida']));
  const [teamFilter,   setTeamFilter]   = useState1('');

  // Placements com persistência
  const [placements, setPlacements] = useState1(() => loadPlacementsFromLS());

  // Salva placements sempre que mudar
  useEffect1(() => { savePlacementsToLS(placements); }, [placements]);

  const fieldRef = useRef1(null);
  const [drag, setDrag]           = useState1(null);
  const [hoverZone, setHoverZone] = useState1(null);

  // Hold-to-remove: segurar 2s para remover do campo
  const holdTimer = useRef1(null);
  const holdTarget = useRef1(null);

  const filtered = useMemo1(() => {
    return D.PLAYERS
      .filter(p => p.position === posFilter)
      .filter(p => posFilter === 'tec' ? true : statusFilter.size === 0 || statusFilter.has(p.status))
      .filter(p => teamFilter === '' || p.team === teamFilter)
      .sort((a, b) => {
        const af = favs.has(a.id) ? 1 : 0;
        const bf = favs.has(b.id) ? 1 : 0;
        if (af !== bf) return bf - af;
        return b.mediaPts - a.mediaPts;
      });
  }, [posFilter, statusFilter, teamFilter, favs]);

  // Times disponíveis para o filtro (só os que têm jogadores na posição selecionada)
  const teamsInPosition = useMemo1(() => {
    const ids = new Set(
      D.PLAYERS.filter(p => p.position === posFilter).map(p => p.team)
    );
    return D.TEAMS.filter(t => ids.has(t.id)).sort((a,b) => a.name.localeCompare(b.name));
  }, [posFilter]);

  const placedIds  = new Set(placements.map(pl => pl.playerId));
  const coachCount = placements.filter(pl => {
    const p = D.PLAYERS.find(pp => pp.id === pl.playerId);
    return p && p.position === 'tec';
  }).length;

  // Drag de campo (reposicionar)
  const startDragFromField = (e, placement) => {
    e.stopPropagation(); e.preventDefault();
    // Cancela hold timer se estava segurando
    clearTimeout(holdTimer.current);
    holdTarget.current = null;
    const player = D.PLAYERS.find(p => p.id === placement.playerId);
    if (!player) return;
    setDrag({ player, x: e.clientX, y: e.clientY, source: 'field', placementId: placement.id });
  };

  // Hold-to-remove no campo
  const onFieldPlayerPointerDown = (e, placement) => {
    e.stopPropagation(); e.preventDefault();
    holdTarget.current = placement.id;
    holdTimer.current = setTimeout(() => {
      // Remove se ainda estiver segurando no mesmo player
      if (holdTarget.current === placement.id) {
        setPlacements(ps => ps.filter(p => p.id !== placement.id));
        holdTarget.current = null;
      }
    }, 2000);
    // Inicia drag normalmente
    startDragFromField(e, placement);
  };

  const zoneOfY = (yPct) => {
    if (yPct < 28.17) return 'ata';
    if (yPct < 56.34) return 'mei';
    if (yPct < 84.51) return 'def';
    return 'tec';
  };

  useEffect1(() => {
    if (!drag) return;
    const onMove = (e) => {
      setDrag(d => d && ({...d, x: e.clientX, y: e.clientY}));
      // Cancela hold se mover
      if (holdTarget.current) {
        clearTimeout(holdTimer.current);
        holdTarget.current = null;
      }
      if (fieldRef.current) {
        const fr = fieldRef.current.getBoundingClientRect();
        if (e.clientX >= fr.left && e.clientX <= fr.right && e.clientY >= fr.top && e.clientY <= fr.bottom) {
          const yPct = ((e.clientY - fr.top) / fr.height) * 100;
          setHoverZone(drag.player.position === 'tec' ? 'tec' : zoneOfY(yPct));
        } else {
          setHoverZone(null);
        }
      }
    };

    const onUp = (e) => {
      clearTimeout(holdTimer.current);
      holdTarget.current = null;

      if (drag.source === 'field' && fieldRef.current) {
        const fr = fieldRef.current.getBoundingClientRect();
        const inField = e.clientX >= fr.left && e.clientX <= fr.right &&
                        e.clientY >= fr.top  && e.clientY <= fr.bottom;
        if (inField) {
          const xPct = Math.max(8, Math.min(92, ((e.clientX - fr.left) / fr.width) * 100));
          let   yPct = Math.max(6, Math.min(94, ((e.clientY - fr.top)  / fr.height) * 100));
          if (drag.player.position === 'tec') {
            yPct = Math.max(86, Math.min(96, yPct < 84.51 ? 91 : yPct));
          }
          setPlacements(ps => ps.map(p =>
            p.id === drag.placementId ? {...p, x: xPct, y: yPct} : p
          ));
        }
      }
      setDrag(null);
      setHoverZone(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, coachCount]);

  // Clique = escalar direto
  const onPlayerTap = (player) => {
    if (placedIds.has(player.id) || drag) return;
    if (player.position === 'tec') {
      if (coachCount >= 3) return;
      const xPct = 25 + (coachCount * 25);
      setPlacements(ps => [...ps, {
        id: `pl_${Date.now()}`,
        playerId: player.id,
        x: xPct, y: 91,
      }]);
    } else {
      const yByPos = { gol: 78, lat: 70, zag: 70, mei: 42, ata: 14 };
      const sameCount = placements.filter(p => {
        const pl = D.PLAYERS.find(pp => pp.id === p.playerId);
        return pl && pl.position === player.position;
      }).length;
      const xPct = 18 + (sameCount * 14) % 64;
      setPlacements(ps => [...ps, {
        id: `pl_${Date.now()}`,
        playerId: player.id,
        x: xPct,
        y: yByPos[player.position] || 50,
      }]);
    }
  };

  const toggleStatus = (id) => {
    setStatusFilter(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const total = placements.reduce((s, pl) => {
    const p = D.PLAYERS.find(pp => pp.id === pl.playerId);
    return s + (p ? p.price : 0);
  }, 0);

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Escalar <em>meu time</em></h1>
          <p className="page__sub">Toque para escalar. Arraste para reposicionar no campo. Segure 2s para remover.</p>
        </div>
        <div className="page__kicker">
          <span className="num tnum">{String(placements.length).padStart(2,'0')}</span>
          <span className="eyebrow">Posições</span>
          <div style={{marginTop:8, fontFamily:'var(--mono)', fontSize:11, color:'var(--text-dim)'}}>
            C$ {total.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="lineup">
        <div className="field-wrap" ref={fieldRef}>
          <div className="field">
            <div className="field__zone" data-active={hoverZone==='ata'}>
              <span className="field__zone-label">Ataque</span>
              <span className="field__zone-num">01 ⁄ 04</span>
            </div>
            <div className="field__zone" data-active={hoverZone==='mei'}>
              <span className="field__zone-label">Meio</span>
              <span className="field__zone-num">02 ⁄ 04</span>
            </div>
            <div className="field__zone" data-active={hoverZone==='def'}>
              <span className="field__zone-label">Defesa</span>
              <span className="field__zone-num">03 ⁄ 04</span>
            </div>
            <div className="field__zone field__zone--tec" data-active={hoverZone==='tec'}>
              <span className="field__zone-label">Técnico</span>
              <span className="coach-zone-info">{coachCount} ⁄ 3</span>
            </div>
          </div>
          <FieldMarkings />

          {placements.map(pl => {
            const p = D.PLAYERS.find(pp => pp.id === pl.playerId);
            if (!p) return null;
            return (
              <FieldPlayer key={pl.id} placement={pl} player={p}
                onPointerDown={onFieldPlayerPointerDown}
                isFav={favs.has(p.id)}
              />
            );
          })}

          {/* Ghost drag */}
          {drag && drag.source === 'field' && (
            <div style={{
              position: 'fixed',
              left: drag.x, top: drag.y,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 9999,
              opacity: 0.85,
            }}>
              <div className="fp__chip" style={{
                background: D.teamById(drag.player.team).color,
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.8)',
                width: 42, height: 42,
                boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
              }}>
                {D.teamById(drag.player.team).crest
                  ? <img src={D.teamById(drag.player.team).crest} alt=""
                      style={{width:'70%',height:'70%',objectFit:'contain',filter:'brightness(0) invert(1)'}}/>
                  : <span style={{fontSize:12}}>{D.teamById(drag.player.team).sigla}</span>
                }
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="filters">
            {/* Filtro posição */}
            <div className="filter-row">
              <div className="filter-row__label">
                <span>Posição</span>
              </div>
              <div className="chip-row">
                {D.POSITIONS.map(p => (
                  <button key={p.id}
                    className={`pill pill--accent ${posFilter===p.id?'is-on':''}`}
                    onClick={() => { setPosFilter(p.id); setTeamFilter(''); }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro status */}
            {posFilter !== 'tec' && (
              <div className="filter-row">
                <div className="filter-row__label">
                  <span>Status</span>
                  <button className="clear" onClick={() => setStatusFilter(new Set())}>limpar</button>
                </div>
                <div className="chip-row">
                  {D.STATUSES.map(s => (
                    <button key={s.id}
                      className={`pill ${statusFilter.has(s.id)?'is-on':''}`}
                      onClick={() => toggleStatus(s.id)}
                    >
                      <StatusDot status={s.id}/>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtro time */}
            <div className="filter-row">
              <div className="filter-row__label">
                <span>Time</span>
                {teamFilter && (
                  <button className="clear" onClick={() => setTeamFilter('')}>limpar</button>
                )}
              </div>
              <div className="chip-row">
                {teamsInPosition.map(t => (
                  <button key={t.id}
                    className={`pill ${teamFilter===t.id?'is-on':''}`}
                    onClick={() => setTeamFilter(t.id === teamFilter ? '' : t.id)}
                  >
                    <Crest team={t} size={14}/>
                    <span style={{marginLeft:4}}>{t.sigla}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rail-wrap">
            <div className="rail-meta">
              <span className="eyebrow">{filtered.length} jogadores · ordenado por média</span>
              <span className="text-mute" style={{fontSize:10}}>↑ favoritos primeiro</span>
            </div>
            <div className="rail">
              {filtered.map(p => (
                <PlayerCard key={p.id}
                  player={p}
                  isFav={favs.has(p.id)}
                  isOnField={placedIds.has(p.id)}
                  onToggleFav={toggleFav}
                  onTap={onPlayerTap}
                />
              ))}
              {filtered.length === 0 && (
                <div style={{padding:'20px', color:'var(--text-mute)', fontSize:12}}>
                  Nenhum jogador com esses filtros.
                </div>
              )}
            </div>
          </div>

          <div className="hr"/>

          <div style={{display:'flex', gap:14, fontSize:11, color:'var(--text-mute)', flexWrap:'wrap'}}>
            <span>↳ <b className="text-dim">Toque</b> para escalar</span>
            <span>↳ <b className="text-dim">Arraste</b> para reposicionar no campo</span>
            <span>↳ <b className="text-dim">Segure 2s</b> para remover do campo</span>
            <span>↳ <b className="text-dim">Estrela</b> favorita o jogador</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PageLineup = PageLineup;
