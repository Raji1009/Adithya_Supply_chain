import { Link, NavLink } from 'react-router-dom';

const menu = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/contact', 'Contact'],
  ['/producer-request', 'Producer Request'],
  ['/manufacturer-request', 'Manufacturer Request'],
  ['/admin/login', 'Admin']
];

export default function MainLayout({ children }) {
  return (
    <div>
      <header className="topbar">
        <Link className="brand" to="/">Adithya Supply Chain</Link>
        <nav>
          {menu.map(([to, label]) => (
            <NavLink key={to} to={to} className="nav-link">{label}</NavLink>
          ))}
        </nav>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
