// page1-lineup.jsx — Escalar meu time

const { useState: useState1, useEffect: useEffect1, useRef: useRef1, useMemo: useMemo1, useCallback: useCallback1 } = React;

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
function PlayerCard({ player, isFav, isOnField, onToggleFav, onDragStart, onDragEnd, onTap }) {
  const D = window.__CARTOLA_DATA;
  const team = D.teamById(player.team);
  const status = D.statusById(player.status);
  const pos = D.posById(player.position);

  const lastClass = player.lastPts > 5 ? 'up' : player.lastPts < 0 ? 'down' : '';
  const cardRef = useRef1(null);

  const onPointerDown = (e) => {
    if (e.target.closest('.pcard__star')) return;
    e.preventDefault();
    cardRef.current.setPointerCapture?.(e.pointerId);
    onDragStart(player, e, cardRef.current);
  };

  return (
    <div
      ref={cardRef}
      className={`pcard ${isOnField ? 'is-on-field' : ''}`}
      onPointerDown={onPointerDown}
      onClick={(e)=>{ if (!e.target.closest('.pcard__star')) onTap?.(player); }}
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
          <span className="pcard__stat-num tnum">{player.minToValue.toFixed(1)}</span>
          <span className="pcard__stat-lbl">Mín. Val.</span>
        </div>
      </div>
    </div>
  );
}

function FieldPlayer({ placement, player, onPointerDown, isFav }) {
  const D = window.__CARTOLA_DATA;
  const team = D.teamById(player.team);
  return (
    <div className="fp" data-id={placement.id}
      style={{
        left: placement.x + '%',
        top:  placement.y + '%',
      }}
      onPointerDown={(e) => onPointerDown(e, placement)}
    >
      <div className="fp__chip" style={{
        background: team.color,
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.7)',
      }}>
        <span style={{textShadow:'0 1px 2px rgba(0,0,0,0.5)'}}>
          {team.sigla}
        </span>
        <StatusDot status={player.status} size={9} />
      </div>
      <div className="fp__name">{player.name.split(' ').slice(-1)[0]}</div>
      {isFav && <span className="fp__star">★</span>}
    </div>
  );
}

function PageLineup({ favs, toggleFav }) {
  const D = window.__CARTOLA_DATA;
  const [posFilter, setPosFilter] = useState1('ata');
  const [statusFilter, setStatusFilter] = useState1(new Set(['provavel','duvida']));
  // placements: includes coaches (player.position === 'tec'). They go in coach zone.
  const [placements, setPlacements] = useState1([]);

  const fieldRef = useRef1(null);
  const trashRef = useRef1(null);
  const [drag, setDrag] = useState1(null);
  const [trashArmed, setTrashArmed] = useState1(false);
  const [hoverZone, setHoverZone] = useState1(null);

  const filtered = useMemo1(() => {
    return D.PLAYERS
      .filter(p => p.position === posFilter)
      .filter(p => posFilter === 'tec' ? true : statusFilter.size === 0 || statusFilter.has(p.status))
      .sort((a, b) => {
        const af = favs.has(a.id) ? 1 : 0;
        const bf = favs.has(b.id) ? 1 : 0;
        if (af !== bf) return bf - af;
        return b.price - a.price;
      });
  }, [posFilter, statusFilter, favs]);

  const placedIds = new Set(placements.map(pl => pl.playerId));
  const coachCount = placements.filter(pl => {
    const p = D.PLAYERS.find(pp => pp.id === pl.playerId);
    return p && p.position === 'tec';
  }).length;

  const startDragFromRail = (player, e, el) => {
    if (placedIds.has(player.id)) return;
    if (player.position === 'tec' && coachCount >= 3) return;
    setDrag({ player, x: e.clientX, y: e.clientY, source: 'rail' });
  };
  const startDragFromField = (e, placement) => {
    e.stopPropagation(); e.preventDefault();
    const player = D.PLAYERS.find(p => p.id === placement.playerId);
    setDrag({ player, x: e.clientX, y: e.clientY, source: 'field', placementId: placement.id });
  };

  // 4 zones: top→bottom = ATAQUE (1/3.55), MEIO (1/3.55), DEFESA (1/3.55), TÉCNICO (0.55/3.55)
  // y bands: 0 → 28.17, 28.17 → 56.34, 56.34 → 84.51, 84.51 → 100
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
      if (trashRef.current) {
        const r = trashRef.current.getBoundingClientRect();
        const armed = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        setTrashArmed(armed);
      }
      if (fieldRef.current) {
        const fr = fieldRef.current.getBoundingClientRect();
        if (e.clientX >= fr.left && e.clientX <= fr.right && e.clientY >= fr.top && e.clientY <= fr.bottom) {
          const yPct = ((e.clientY - fr.top) / fr.height) * 100;
          let z = zoneOfY(yPct);
          if (drag.player.position === 'tec') z = 'tec';
          setHoverZone(z);
        } else {
          setHoverZone(null);
        }
      }
    };
    const onUp = (e) => {
      const fr = fieldRef.current.getBoundingClientRect();
      const tr = trashRef.current?.getBoundingClientRect();
      const inField = e.clientX >= fr.left && e.clientX <= fr.right && e.clientY >= fr.top && e.clientY <= fr.bottom;
      const inTrash = tr && e.clientX >= tr.left && e.clientX <= tr.right && e.clientY >= tr.top && e.clientY <= tr.bottom;

      if (inTrash) {
        if (drag.source === 'field') {
          setPlacements(ps => ps.filter(p => p.id !== drag.placementId));
        }
      } else if (inField) {
        const xPct = ((e.clientX - fr.left) / fr.width) * 100;
        const yPct = ((e.clientY - fr.top) / fr.height) * 100;
        const cx = Math.max(8, Math.min(92, xPct));
        let cy = Math.max(6, Math.min(94, yPct));
        // For coach: snap into coach zone (84.51 → 100)
        if (drag.player.position === 'tec') {
          cy = Math.max(86, Math.min(96, cy < 84.51 ? 91 : cy));
          if (drag.source === 'rail' && coachCount >= 3) { setDrag(null); setTrashArmed(false); setHoverZone(null); return; }
        }
        if (drag.source === 'rail') {
          setPlacements(ps => [...ps, {
            id: `pl_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
            playerId: drag.player.id,
            x: cx, y: cy,
          }]);
        } else {
          setPlacements(ps => ps.map(p => p.id === drag.placementId ? {...p, x: cx, y: cy} : p));
        }
      }
      setDrag(null);
      setTrashArmed(false);
      setHoverZone(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, coachCount]);

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
      // ataque top, meio middle, defesa bottom (above coach)
      const yByPos = { gol: 78, lat: 70, zag: 70, mei: 42, ata: 14 };
      const sameZoneCount = placements.filter(p => {
        const pl = D.PLAYERS.find(pp => pp.id === p.playerId);
        return pl && pl.position === player.position;
      }).length;
      const xPct = 18 + (sameZoneCount * 14) % 64;
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
          <p className="page__sub">Arraste cartas para o gramado. Toque para escalar direto. Sem formação fixa — mexa os jogadores como quiser.</p>
        </div>
        <div className="page__kicker">
          <span className="num tnum">{(placements.length).toString().padStart(2,'0')}</span>
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
            return <FieldPlayer key={pl.id} placement={pl} player={p}
              onPointerDown={startDragFromField}
              isFav={favs.has(p.id)}
            />;
          })}

          <div className="trash" ref={trashRef} data-armed={trashArmed}
            title="Solte aqui para remover" aria-label="Lixeira">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
            </svg>
          </div>

          {drag && (
            <div style={{
              position: 'fixed',
              left: drag.x, top: drag.y,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 9999,
              opacity: 0.92,
            }}>
              <div className="fp__chip" style={{
                background: D.teamById(drag.player.team).color,
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.8)',
                width: 42, height: 42,
                boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
              }}>
                <span style={{textShadow:'0 1px 2px rgba(0,0,0,0.5)', fontSize:12}}>
                  {D.teamById(drag.player.team).sigla}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="filters">
            <div className="filter-row">
              <div className="filter-row__label">
                <span>Posição</span>
                <span className="text-mute" style={{fontSize:10}}>uma por vez</span>
              </div>
              <div className="chip-row">
                {D.POSITIONS.map(p => (
                  <button key={p.id}
                    className={`pill pill--accent ${posFilter===p.id?'is-on':''}`}
                    onClick={() => setPosFilter(p.id)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {posFilter !== 'tec' && (
              <div className="filter-row">
                <div className="filter-row__label">
                  <span>Status</span>
                  <button className="clear" onClick={()=>setStatusFilter(new Set())}>limpar</button>
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
          </div>

          <div className="rail-wrap">
            <div className="rail-meta">
              <span className="eyebrow">{filtered.length} jogadores · ordenado por preço</span>
              <span className="text-mute" style={{fontSize:10}}>↑ favoritos primeiro</span>
            </div>
            <div className="rail">
              {filtered.map(p => (
                <PlayerCard key={p.id}
                  player={p}
                  isFav={favs.has(p.id)}
                  isOnField={placedIds.has(p.id)}
                  onToggleFav={toggleFav}
                  onDragStart={startDragFromRail}
                  onDragEnd={()=>{}}
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
            <span>↳ <b className="text-dim">Arraste</b> a carta para o gramado</span>
            <span>↳ <b className="text-dim">Toque</b> para escalar direto</span>
            <span>↳ <b className="text-dim">Estrela</b> favorita o jogador</span>
            <span>↳ <b className="text-dim">Lixeira</b> remove do campo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PageLineup = PageLineup;
