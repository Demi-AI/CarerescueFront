import { NavLink, Outlet } from 'react-router';
import { navigation } from '../config/navigation';
import { useApp } from '../context/AppContext';
import styles from './AppLayout.module.css';
export default function AppLayout() {
  const { storageError } = useApp();
  return (
    <div className={styles.layout}>
      <a className={styles.skip} href="#main">
        跳到主要內容
      </a>
      <aside className={styles.sidebar}>
        <h1>♡ CareRescue</h1>
        <p>居服異動與量能救援台</p>
        <nav aria-label="主要選單">
          <ul>
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? styles.active : '')}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main id="main" className={styles.main}>
        {storageError && <p role="alert">{storageError}</p>}
        <Outlet />
      </main>
    </div>
  );
}
