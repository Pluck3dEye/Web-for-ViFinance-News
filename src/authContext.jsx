import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, name, email, avatar }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.username) {
          setUser({
            username: data.username,
            name: data.name,
            email: data.email,
            avatar: data.avatar,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
  }, []);

  // Accepts a user object with username, name, email, avatar
  const login = (userData) => {
    if (userData && userData.username) {
      setUser({
        username: userData.username,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
      });
    } else {
      setUser(null);
    }
  };

  // Update user info in context (for profile editor)
  const updateUser = (fields) => {
    setUser(prev => prev ? { ...prev, ...fields } : prev);
  };

  const logout = () => {
    fetch('http://localhost:5000/api/logout', {
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
