import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASES } from "./config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch auth status and user profile
  useEffect(() => {
    async function fetchUser() {
      try {
        const authRes = await fetch(`${API_BASES.auth}/api/auth-status`, {
          credentials: 'include',
        });
        const authData = await authRes.json();
        if (authData?.loggedIn) {
          // Fetch user profile from UserService
          const profileRes = await fetch(`${API_BASES.user}/api/user/profile`, {
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
  const login = async (userIdOrData) => {
    let userId = userIdOrData;
    if (userIdOrData && typeof userIdOrData === 'object' && userIdOrData.userId) {
      userId = userIdOrData.userId;
    }
    if (userId) {
      try {
        const profileRes = await fetch(`${API_BASES.user}/api/user/profile`, {
          credentials: 'include',
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUser({
            userId,
            userName: profile.userName,
            email: profile.email,
            bio: profile.bio,
            avatarLink: profile.avatarLink,
          });
        } else {
          setUser({ userId });
        }
      } catch {
        setUser({ userId });
      }
    } else {
      setUser(null);
    }
  };

  const updateUser = (fields) => {
    setUser(prev => prev ? { ...prev, ...fields } : prev);
  };

  const logout = () => {
    fetch(`${API_BASES.auth}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(async (res) => {
      // Always set user to null, but check for error message
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
