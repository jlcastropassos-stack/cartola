// shared.jsx — common UI primitives used across pages

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── Crest (placeholder when team.crest is null) ─────────
function Crest({ team, size = 32, ring = false }) {
  if (!team) return null;
  const style = {
    width: size, height: size,
    background: team.crest ? '#fff' : team.color,
    color: '#fff',
    fontSize: Math.max(9, size * 0.32),
  };
  return (
    <span className="pcard__crest" style={style} title={team.name}>
      {team.crest
        ? <img src={team.crest} alt={team.sigla} style={{width:'80%', height:'80%', objectFit:'contain'}} />
        : <span style={{textShadow:'0 1px 2px rgba(0,0,0,0.4)'}}>{team.sigla}</span>
      }
      {ring && <span style={{
        position:'absolute', inset:-2, borderRadius:'50%',
        border:'1.5px solid var(--accent)', pointerEvents:'none'
      }} />}
    </span>
  );
}

// ── Star (favorito) ─────────────────────────────────────
function Star({ on, onToggle, size = 14, className = 'pcard__star' }) {
  return (
    <button
      className={className}
      data-on={on ? 'true' : 'false'}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={on ? 'Remover dos favoritos' : 'Favoritar'}
      style={{ width: size + 8, height: size + 8 }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill={on ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 2.5l2.95 6.18 6.8.83-5.05 4.62 1.38 6.7L12 17.7l-6.08 3.13 1.38-6.7L2.25 9.51l6.8-.83z"/>
      </svg>
    </button>
  );
}

// ── StatusDot ───────────────────────────────────────────
function StatusDot({ status, size = 8 }) {
  return <span className={`sdot sdot--${status}`} style={{width:size, height:size}} />;
}

// ── Sparkline ───────────────────────────────────────────
function Sparkline({ values, width = 120, height = 32, accent = 'var(--accent)' }) {
  if (!values || !values.length) return null;
  const max = Math.max(...values, 0.001);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = width / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const path = points.map(([x,y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
  const area = path + ` L${width},${height} L0,${height} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={area} fill={accent} fillOpacity="0.10" />
      <path d={path} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 2.4 : 1.4}
          fill={i === points.length - 1 ? accent : 'var(--text-mute)'} />
      ))}
    </svg>
  );
}

// ── Round strip ─────────────────────────────────────────
function RoundStrip({ num = 12, label = 'Próxima rodada', sub = 'Brasileirão · 2026' }) {
  return (
    <div className="round-strip">
      <div className="round-strip__left">
        <div className="round-strip__num serif tnum">{String(num).padStart(2,'0')}</div>
        <div className="round-strip__lbl">{label}</div>
      </div>
      <div className="round-strip__right">
        {sub}<br/>
        <span style={{color:'var(--text-dim)'}}>10 jogos · Sáb–Dom</span>
      </div>
    </div>
  );
}

// ── Match card (page 2) ─────────────────────────────────
function MatchRow({ match, onClick, isOpen, dim = false }) {
  const D = window.__CARTOLA_DATA;
  const home = D.teamById(match.home);
  const away = D.teamById(match.away);
  return (
    <div className={`match ${isOpen ? 'is-open' : ''}`} onClick={onClick}
      role="button" tabIndex={0} aria-expanded={isOpen}>
      <div className="match__side">
        <Crest team={home} size={36}/>
        <div>
          <div className="match__name">{home.name}</div>
          <div className="match__sub">Casa</div>
        </div>
      </div>
      <div className="match__center">
        <span className="vs">×</span>
        <span>{match.date}</span>
      </div>
      <div className="match__side match__side--away">
        <Crest team={away} size={36}/>
        <div>
          <div className="match__name">{away.name}</div>
          <div className="match__sub">Fora</div>
        </div>
      </div>
      {onClick && <span className="match__caret">{isOpen ? '— fechar' : 'abrir →'}</span>}
    </div>
  );
}

// Export to global scope
Object.assign(window, { Crest, Star, StatusDot, Sparkline, RoundStrip, MatchRow });
