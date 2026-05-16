import { Link } from 'react-router-dom'

interface Props {
  rightLabel?: string
  rightHref?: string
}

export default function Nav({ rightLabel, rightHref }: Props) {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">Cradle Portal</Link>
      {rightLabel && rightHref && (
        <Link to={rightHref} className="nav-link">{rightLabel}</Link>
      )}
    </nav>
  )
}
