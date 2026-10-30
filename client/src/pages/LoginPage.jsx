import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlinePhotograph, HiOutlineLockClosed, HiOutlineExclamation } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginRole, setLoginRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const signedInUser = isRegistering
        ? await signUp({ name, email, password })
        : await signIn({ email, password, role: loginRole });
      const requestedPath = location.state?.from;
      navigate(signedInUser.role === 'admin' ? (requestedPath || '/admin') : '/', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to connect. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={`page-wrapper ${styles.authPage}`}>
      <section className={styles.authLayout}>
        <div className={styles.intro}>
          <Link to="/" className={styles.brand}><HiOutlinePhotograph /> PixelVault</Link>
          <p className={styles.kicker}>A home for the images you keep</p>
          <h1>{isRegistering ? 'Make room for wonder.' : 'Your collection, waiting.'}</h1>
          <p className={styles.introCopy}>Sign in to keep your favorite photographs close, or make an account to start your own collection.</p>
          <div className={styles.photoStrip} aria-hidden="true">
            <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&h=700&fit=crop" alt="" />
            <img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=700&fit=crop" alt="" />
            <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=500&h=700&fit=crop" alt="" />
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formHeading}>
            <span className={styles.lockIcon}><HiOutlineLockClosed /></span>
            <p className={styles.kicker}>{isRegistering ? 'Create an account' : `${loginRole === 'admin' ? 'Admin' : 'User'} sign in`}</p>
            <h2>{isRegistering ? 'Join PixelVault' : 'Sign in to PixelVault'}</h2>
          </div>

          <div className={styles.modeSwitch} role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={!isRegistering} className={!isRegistering ? styles.selectedMode : ''} onClick={() => { setIsRegistering(false); setError(''); }}>Sign in</button>
            <button type="button" role="tab" aria-selected={isRegistering} className={isRegistering ? styles.selectedMode : ''} onClick={() => { setIsRegistering(true); setLoginRole('user'); setError(''); }}>Create account</button>
          </div>

          {!isRegistering && (
            <div className={styles.accountType} role="group" aria-label="Sign in as">
              <button type="button" aria-pressed={loginRole === 'user'} className={loginRole === 'user' ? styles.selectedAccountType : ''} onClick={() => { setLoginRole('user'); setError(''); }}>User</button>
              <button type="button" aria-pressed={loginRole === 'admin'} className={loginRole === 'admin' ? styles.selectedAccountType : ''} onClick={() => { setLoginRole('admin'); setError(''); }}>Admin</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {isRegistering && (
              <label className={styles.field}>
                <span>Your name</span>
                <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
              </label>
            )}
            <label className={styles.field}>
              <span>Email address</span>
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className={styles.field}>
              <span>Password</span>
              <input type="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isRegistering ? 8 : undefined} />
              {isRegistering && <small>Use at least 8 characters.</small>}
            </label>
            {error && <p className={styles.error} role="alert"><HiOutlineExclamation />{error}</p>}
            <button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}
            </button>
          </form>
          <p className={styles.backLink}><Link to="/">Back to the gallery</Link></p>
        </div>
      </section>
    </main>
  );
}