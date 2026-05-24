import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { randomQuote } from '../lib/quotes'

// Liste de mots-fantôme qui apparaissent en BG du banner
const GHOST_WORDS = ['BRUTAL', 'NO MERCY', 'FIGHT', 'WARRIOR', 'KO', 'CHAMP', 'ICONIC']

export default function QuoteBanner() {
  // mémorise une citation par session (recharge la page = nouvelle)
  const quote = useMemo(() => randomQuote(), [])
  const ghost = useMemo(() => GHOST_WORDS[Math.floor(Math.random() * GHOST_WORDS.length)], [])

  return (
    <Link to="/quotes" className="quote-banner">
      <span className="quote-banner-ghost" aria-hidden>{ghost}</span>
      <div className="quote-banner-content">
        <blockquote className="quote-banner-text">
          « {quote.text} »
        </blockquote>
        <div className="quote-banner-author">— {quote.author}</div>
      </div>
    </Link>
  )
}
