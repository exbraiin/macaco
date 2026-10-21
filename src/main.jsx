import React, {useState, useRef, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {roles, weightsFor, chooseRole} from './roulette';
import './style.css';

const icons = ['⌁', '◇', '♧', '♜'];
function App() {
  const [last, setLast] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState([]);
  const timer = useRef(null);
  const busy = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  const weights = weightsFor(last);
  function spin() {
    if (busy.current) return;
    busy.current = true;
    setSpinning(true);
    const role = chooseRole(last);
    const target = roles.indexOf(role) * 90 + 45 + (Math.random() - .5) * 54;
    setRotation(previous => previous + 1800 + ((target - previous % 360 + 360) % 360));
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 4200;
    timer.current = setTimeout(() => {
      setLast(role);
      setHistory(h => [role, ...h].slice(0, 8));
      setSpinning(false);
      busy.current = false;
    }, duration);
  }
  function reset() { if (busy.current) return; setLast(null); setHistory([]); }
  return <div className="app">
    <header><a className="brand" href="./"><span className="brandmark">↗</span> ROLE ROULETTE</a><span className="header-note"><i/> THE RIFT AWAITS</span></header>
    <main>
      <div className="intro"><span className="eyebrow">LESS DEBATING. MORE PLAYING.</span><h1>Leave your lane<br/>to <em>chance.</em></h1><p>Four roles. One spin. Let the wheel decide where you play next.</p></div>
      <div className="game-layout">
        <section className="wheel-section" aria-label="Role roulette">
          <div className="wheel-surround"><span className="north">N</span><span className="east">E</span><span className="south">S</span><span className="west">W</span>
            <button className={'wheel ' + (spinning ? 'is-spinning' : '')} onClick={spin} disabled={spinning} aria-label={spinning ? 'Choosing your role' : 'Spin the role roulette'}>
              <div className="wheel-face"/>
              {roles.map((role, i) => <div key={role} className={'wheel-label label-' + i}><span>{icons[i]}</span><strong>{role}</strong></div>)}
              <div className="needle" style={{transform:`rotate(${rotation}deg)`}}><div className="needle-shaft"/></div>
              <div className="hub"><span>{spinning ? '•••' : '↗'}</span></div>
            </button>
          </div>
          <button className="spin-button" onClick={spin} disabled={spinning}><span>{spinning ? 'FINDING YOUR LANE…' : 'SPIN THE WHEEL'}</span><span>{spinning ? '◌' : '↗'}</span></button>
          <p className="wheel-hint">Click the wheel or the button to roll</p>
        </section>
        <aside>
          <section className="result" aria-live="polite"><span className="eyebrow">{spinning ? 'LET FATE COOK' : last ? 'YOUR NEXT ROLE' : 'YOUR NEXT ROLE'}</span><div className="result-value">{spinning ? 'Rolling…' : last || 'Unassigned'}<span>{spinning ? '◌' : last ? icons[roles.indexOf(last)] : '↗'}</span></div><p>{spinning ? 'A little suspense before the next queue.' : last ? 'Lock it in. Your lane is calling.' : 'Your next game starts with a spin.'}</p></section>
          <section className="odds"><div className="section-heading"><h2>Next spin odds</h2><span>LIVE</span></div>{roles.map((role,i) => <div className={'odds-row '+(role===last?'reduced':'')} key={role}><span className="role-icon">{icons[i]}</span><strong>{role}</strong>{role===last && <small>LAST PICK</small>}<b>{weights[i]}<span>%</span></b><div className="bar"><div style={{width:weights[i]+'%'}}/></div></div>)}<div className="fairness"><span>↻</span><p>A little variety, built in.<br/><span>The last pick gets 10%. The other roles get 30% each.</span></p></div></section>
        </aside>
      </div>
      <section className="history"><div className="section-heading"><h2>Recent rolls <span className="history-count">{history.length.toString().padStart(2,'0')}</span></h2><button onClick={reset} disabled={spinning || !history.length}>Reset session ↺</button></div>{history.length ? <div className="history-items">{history.map((role,i)=><span className="history-pill" key={i}><span>{icons[roles.indexOf(role)]}</span>{role}{i===0&&<small>LATEST</small>}</span>)}</div> : <p className="empty">A clean slate. Give the wheel its first spin.</p>}</section>
    </main><footer><span>GOOD LUCK. HAVE FUN.</span><span>Made for the next queue <span className="footer-star">✳</span></span></footer>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
