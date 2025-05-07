import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch auth status and user profile
  useEffect(() => {
    async function fetchUser() {
      try {
        const authRes = await fetch('http://localhost:6999/api/auth-status', {
          credentials: 'include',
        });
        const authData = await authRes.json();
        if (authData?.loggedIn) {
          // Fetch user profile from UserService
          const profileRes = await fetch('http://localhost:6998/api/user/profile', {
            credentials: 'include',
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setUser({
              userId: authData.userId,
              userName: profile.userName,
              email: profile.email,
              bio: profile.bio,
              avatarLink: profile.avatarLink,
            });
          } else {
            setUser({ userId: authData.userId });
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Accepts a user object with userId, then fetches profile
  const login = async (userData) => {
    if (userData && userData.userId) {
      try {
        const profileRes = await fetch('http://localhost:6998/api/user/profile', {
          credentials: 'include',
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUser({
            userId: userData.userId,
            userName: profile.userName,
            email: profile.email,
            bio: profile.bio,
            avatarLink: profile.avatarLink,
          });
        } else {
          setUser({ userId: userData.userId });
        }
      } catch {
        setUser({ userId: userData.userId });
      }
    } else {
      setUser(null);
    }
  };

  const updateUser = (fields) => {
    setUser(prev => prev ? { ...prev, ...fields } : prev);
  };

  const logout = () => {
    fetch('http://localhost:6999/api/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
