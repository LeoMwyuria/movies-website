import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import App from './App';
import Movies from './components/Movies';
import Tvseries from './components/Tvseries';
import Bookmarks from './components/Bookmarks';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components/firebase';
import ProtectedRoute from './components/protectedRoute';

function Main() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/Home"
        element={
          <ProtectedRoute user={user}>
            <App user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Movies"
        element={
          <ProtectedRoute user={user}>
            <Movies user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/TvSeries"
        element={
          <ProtectedRoute user={user}>
            <Tvseries user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Bookmarks"
        element={
          <ProtectedRoute user={user}>
            <Bookmarks user={user} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);
