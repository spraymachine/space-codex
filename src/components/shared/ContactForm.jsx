import { useEffect, useRef, useState } from 'react';

const INITIAL_VALUES = {
  name: '',
  email: '',
  message: '',
};

export default function ContactForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [status, setStatus] = useState('idle');
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('sending');

    timeoutRef.current = window.setTimeout(() => {
      setStatus('sent');
      setFormData(INITIAL_VALUES);
      onSubmitSuccess?.();

      timeoutRef.current = window.setTimeout(() => {
        setStatus('idle');
      }, 2600);
    }, 1100);
  };

  const baseInputStyle = {
    width: '100%',
    padding: '0.9rem 1rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--star-white)',
    outline: 'none',
    resize: 'vertical',
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Contact Mani">
      <div style={{ display: 'grid', gap: '1rem' }}>
        <label>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name
          </span>
          <input
            style={baseInputStyle}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>

        <label>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email
          </span>
          <input
            style={baseInputStyle}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Message
          </span>
          <textarea
            style={{ ...baseInputStyle, minHeight: '8.5rem' }}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Send a signal into deep space..."
            required
          />
        </label>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '1.2rem',
        }}
      >
        <button className="primary-button" type="submit" disabled={status === 'sending'}>
          {status === 'idle' && 'Transmit Message'}
          {status === 'sending' && 'Transmitting...'}
          {status === 'sent' && 'Signal Sent'}
        </button>
        <p
          aria-live="polite"
          style={{
            margin: 0,
            color: status === 'sent' ? 'var(--uranus-teal)' : 'var(--text-dim)',
          }}
        >
          {status === 'sent'
            ? 'Placeholder form complete. Hook this up to your real endpoint later.'
            : 'This is a polished placeholder flow for now.'}
        </p>
      </div>
    </form>
  );
}
