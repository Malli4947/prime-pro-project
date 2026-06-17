import { useRef, useEffect, useState } from 'react';
import './LeadershipSection.css';

const PILLARS = [
  { name: 'K Sreekant Reddy',   title: 'Chief Executive Officer',     color: '#C9A84C', photo: '/Srikanth.PNG'        },
  { name: 'Prashanth Reddy',    title: 'Founder & Managing Director', color: '#5B9BD5', photo: '/founder-portrait.png', objectPos: 'center center' },
  { name: 'Arun Kumar Reddy',   title: 'Co-Founder',                  color: '#22c55e', photo: '/Arun.PNG'             },
  { name: 'Gorantla Vaishnavi', title: 'Director',                    color: '#f472b6', photo: null                   },
  { name: 'Sudheer',            title: 'Director',                    color: '#a78bfa', photo: '/Sudheer.jpeg'         },
];

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function PillarCard({ person, index }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = person.photo && !imgFailed;

  return (
    <div className="ls-card" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="ls-card__accent" style={{ background: person.color }} />

      <div className="ls-card__photo-wrap">
        <div className="ls-card__initials" style={{ background: person.color }}>
          {getInitials(person.name)}
        </div>
        {showPhoto && (
          <img
            src={person.photo}
            alt=""
            aria-hidden="true"
            className="ls-card__photo"
            loading="lazy"
            decoding="async"
            style={person.objectPos ? { objectPosition: person.objectPos } : undefined}
            onError={() => setImgFailed(true)}
          />
        )}
        <div className="ls-card__ring" style={{ borderColor: person.color }} />
      </div>

      <div className="ls-card__body">
        <h3 className="ls-card__name">{person.name}</h3>
        <p className="ls-card__role" style={{ color: person.color }}>
          {person.title}
        </p>
        <div className="ls-card__bar" style={{ background: person.color }} />
      </div>
    </div>
  );
}

export default function LeadershipSection({ variant = 'light' }) {
  const [secRef, secVis] = useReveal();

  return (
    <section
      className={`ls-section ls-section--${variant}`}
      ref={secRef}
      aria-labelledby="ls-heading">

      <div className="container">
        <div className={`ls-header${secVis ? ' anim-fade-up' : ''}`}>
          <span className="sec-tag">Our Leadership</span>
          <h2 className="sec-title" id="ls-heading">
            The Minds Behind <span className="hi">PrimePro Projects</span>
          </h2>
          <p className="sec-sub ls-sub">
            Vision, integrity and decades of combined experience — the leadership
            team redefining real estate across Hyderabad.
          </p>
        </div>

        <div className={`ls-grid${secVis ? ' anim-fade-up d-2' : ''}`}>
          {PILLARS.map((person, i) => (
            <PillarCard key={i} person={person} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
