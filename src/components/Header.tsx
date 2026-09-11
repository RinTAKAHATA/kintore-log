import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="app-header">
      <span className="app-header__title">筋トレ記録</span>
      <nav className="app-header__nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
          ホーム
        </NavLink>
        <NavLink to="/record" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          記録
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          履歴
        </NavLink>
      </nav>
    </header>
  );
}
