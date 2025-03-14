// MainLayout.jsx
import styles from './MainLayout.module.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = ({ children, role }) => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <Sidebar role={role} />
          <main className={styles.dashboardContent}>
            {children}
          </main>
        </div>
      <Footer />

      </div>
    </div>
  );
};

export default MainLayout;