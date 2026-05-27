import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { matchIntent, WELCOME, QUICK_SUGGESTIONS } from './chatKnowledge';
import './ChatBot.css';

/* ── Minimal markdown — bold + line breaks only ────────────────── */
function renderMarkdown(text) {
  // **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return <strong key={i}>{p.replace(/\*\*/g, '')}</strong>;
    }
    // line breaks
    return p.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

/* ── Render a single action chip below a bot message ───────────── */
function ChipLink({ link }) {
  if (link.type === 'page') {
    return <Link to={link.href} className="cbot-chip">{link.label}</Link>;
  }
  // tel:, mailto:, https: — handled as plain anchor
  const isExt = link.type === 'ext';
  return (
    <a
      href={link.href}
      className="cbot-chip"
      target={isExt || link.type === 'wa' ? '_blank' : undefined}
      rel={isExt || link.type === 'wa' ? 'noopener noreferrer' : undefined}
    >
      {link.label}
    </a>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(() => [
    { from: 'bot', text: WELCOME.text, suggest: WELCOME.suggest, ts: Date.now() },
  ]);
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  /* Auto-scroll on new message */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  /* Focus the input when window opens */
  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  /* Show a pulse on the FAB after 8 seconds if user hasn't opened it */
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setUnread(true), 8000);
    return () => clearTimeout(t);
  }, [open]);

  /* Send a message — matches intent and replies after a short typing delay */
  const send = useCallback((rawText) => {
    const text = (rawText || '').trim();
    if (!text) return;

    setMessages(prev => [...prev, { from: 'user', text, ts: Date.now() }]);
    setInput('');
    setTyping(true);

    // Simulate thinking — keeps responses feeling natural
    const intent = matchIntent(text);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: intent.reply,
          links: intent.links,
          suggest: intent.suggest,
          ts: Date.now(),
        },
      ]);
    }, 550 + Math.min(text.length * 12, 600));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const toggle = () => setOpen(v => !v);

  return (
    <>
      {/* ── Floating action button ─────────────────────────── */}
      <button
        type="button"
        className={`cbot-fab${open ? ' cbot-fab--open' : ''}${unread && !open ? ' cbot-fab--pulse' : ''}`}
        onClick={toggle}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span className="cbot-fab__label">Chat</span>
            {unread && <span className="cbot-fab__dot" />}
          </>
        )}
      </button>

      {/* ── Chat window ───────────────────────────────────── */}
      <div className={`cbot-window${open ? ' cbot-window--open' : ''}`} role="dialog" aria-label="PrimePro Assistant">

        {/* Header */}
        <div className="cbot-head">
          <div className="cbot-head__av">PP</div>
          <div className="cbot-head__txt">
            <div className="cbot-head__title">PrimePro Assistant</div>
            <div className="cbot-head__sub">
              <span className="cbot-head__dot" />
              Online · Replies instantly
            </div>
          </div>
          <button type="button" className="cbot-head__close" onClick={toggle} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="cbot-body" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={m.ts + i} className={`cbot-row cbot-row--${m.from}`}>
              {m.from === 'bot' && <div className="cbot-av">PP</div>}
              <div className="cbot-msg">
                <div className={`cbot-bubble cbot-bubble--${m.from}`}>
                  {renderMarkdown(m.text)}
                </div>
                {m.links && m.links.length > 0 && (
                  <div className="cbot-chips">
                    {m.links.map((l, j) => <ChipLink key={j} link={l} />)}
                  </div>
                )}
                {m.suggest && m.suggest.length > 0 && (
                  <div className="cbot-suggest">
                    {m.suggest.map(s => (
                      <button
                        key={s}
                        type="button"
                        className="cbot-suggest__btn"
                        onClick={() => send(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="cbot-row cbot-row--bot">
              <div className="cbot-av">PP</div>
              <div className="cbot-bubble cbot-bubble--bot cbot-bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {/* Quick-reply chips above input (only when no suggestions visible) */}
        {messages.length === 1 && (
          <div className="cbot-quickrow">
            {QUICK_SUGGESTIONS.slice(0, 4).map(q => (
              <button
                key={q}
                type="button"
                className="cbot-quickrow__btn"
                onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form className="cbot-input" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about properties, contact, timings…"
            aria-label="Type your question"
            autoComplete="off"
          />
          <button
            type="submit"
            className="cbot-input__send"
            disabled={!input.trim()}
            aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>

        <div className="cbot-foot">
          Powered by PrimePro · Replies under 2 hours from a human
        </div>
      </div>
    </>
  );
}
