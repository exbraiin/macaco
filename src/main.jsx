import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { chooseRole, roles, weightsFor, sectorsFor } from './roulette';
import './style.css';

import adcIcon from '../icons/120px-Bottom_icon.webp';
import jungleIcon from '../icons/120px-Jungle_icon.webp';
import midIcon from '../icons/120px-Middle_icon.webp';
import specialistIcon from '../icons/120px-Specialist_icon.webp';
import topIcon from '../icons/120px-Top_icon.webp';

const icons = [adcIcon, midIcon, jungleIcon, topIcon];
function RoleIcon({role, index}) {
  return <img className="role-image" src={icons[index ?? roles.indexOf(role)]} alt="" aria-hidden="true"/>;
}
function SpecialistIcon() {
  return <img className="specialist-icon" src={specialistIcon} alt="" aria-hidden="true"/>;
}
const historyKey = 'role-roulette.history';
function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(historyKey) || '[]');
    return Array.isArray(saved) ? saved.filter(role => roles.includes(role)) : [];
  } catch {
    return [];
  }
}
function App() {
  const [history, setHistory] = useState(loadHistory);
  const last = history[0] ?? null;
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(() => last ? sectorsFor(last).find(sector => sector.role === last).center : 0);
  useEffect(() => {
    try {
      if (history.length) localStorage.setItem(historyKey, JSON.stringify(history));
      else localStorage.removeItem(historyKey);
    } catch {
      // Keep the roulette usable if browser storage is unavailable.
    }
  }, [history]);
  const timer = useRef(null);
  const busy = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  const weights = weightsFor(last);
  const sectors = sectorsFor(last);
  const colors = ['#303d25', '#1e2c23', '#293521', '#20281b'];
  const wheelBackground = `conic-gradient(${sectors.map((sector, i) => `${colors[i]} ${sector.start}deg ${sector.end}deg`).join(', ')})`;
  function spin() {
    if (busy.current) return;
    busy.current = true;
    setSpinning(true);
    const role = chooseRole(last);
    const sector = sectors[roles.indexOf(role)];
    const target = sector.center + (Math.random() - .5) * (sector.end - sector.start) * .6;
    setRotation(previous => previous + 360 + ((target - previous % 360 + 360) % 360));
    const duration = 2000;
    timer.current = setTimeout(() => {
      const nextCenter = sectorsFor(role).find(sector => sector.role === role).center;
      setRotation(previous => Math.floor(previous / 360) * 360 + nextCenter);
      setHistory(h => [role, ...h]);
      setSpinning(false);
      busy.current = false;
    }, duration);
  }
  function reset() { if (busy.current) return; setHistory([]); setRotation(0); }
  return <div className="app">
    <main>
      <div className="intro"><h1>Roleta do Macaco</h1></div>
      <div className="game-layout">
        <section className="wheel-section" aria-label="Role roulette">
          <div className="wheel-surround"><span className="north">N</span><span className="east">E</span><span className="south">S</span><span className="west">W</span>
            <button className={'wheel ' + (spinning ? 'is-spinning' : '')} onClick={spin} disabled={spinning} aria-label={spinning ? 'Choosing your role' : 'Spin the role roulette'}>
              <div className="wheel-face" style={{background: wheelBackground}}/>
              {sectors.map(sector => <div key={sector.role} className="wheel-divider" style={{transform: `rotate(${sector.start}deg)`}}/>)}
              {roles.map((role, i) => <div key={role} className="wheel-label" style={{left: `${50 + 33 * Math.sin(sectors[i].center * Math.PI / 180)}%`, top: `${50 - 33 * Math.cos(sectors[i].center * Math.PI / 180)}%`}}><span><RoleIcon index={i}/></span><strong>{role === 'JUNGLE' ? 'JGL' : role}</strong></div>)}
              <div className="needle" style={{transform:`rotate(${rotation}deg)`}}><div className="needle-shaft"/></div>
              <div className="hub"><span>{spinning ? '•••' : <SpecialistIcon/>}</span></div>
            </button>
          </div>
        </section>
        <aside>
          <section className="result" aria-live="polite"><div className="result-value">{spinning ? 'Rolling…' : last || 'Unassigned'}<span>{spinning ? '◌' : last ? <RoleIcon role={last}/> : <SpecialistIcon/>}</span></div></section>
          <section className="odds"><div className="section-heading"><h2>Next spin odds</h2><span>LIVE</span></div>{roles.map((role,i) => <div className={'odds-row '+(role===last?'reduced':'')} key={role}><span className="role-icon"><RoleIcon index={i}/></span><strong>{role}</strong>{role===last && <small>LAST PICK</small>}<b>{weights[i]}<span>%</span></b><div className="bar"><div style={{width:weights[i]+'%'}}/></div></div>)}</section>
        </aside>
      </div>
      <section className="history"><div className="section-heading"><h2>Recent rolls <span className="history-count">{history.length.toString().padStart(2,'0')}</span></h2><button onClick={reset} disabled={spinning || !history.length}>Reset session ↺</button></div>{history.length ? <div className="history-items">{history.map((role,i)=><span className="history-pill" key={i}><span><RoleIcon role={role}/></span>{role}{i===0&&<small>LATEST</small>}</span>)}</div> : <p className="empty">A clean slate. Give the wheel its first spin.</p>}</section>
    </main>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
