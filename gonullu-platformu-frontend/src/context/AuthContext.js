import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import api from "../services/api"; 

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase ve MongoDB arasındaki köprü fonksiyonu
  const syncUserWithDB = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token); 

      // 1. Kullanıcıyı MongoDB'den getir
      const response = await api.get(`/users/by-uid/${firebaseUser.uid}`);
      
      // API'den gelen veriyi güvenli bir şekilde ayıkla
      const mongoUser = response.data?.data || response.data || response;

      // SADECE MongoDB verisini baz al, Firebase'den gelen kısıtlı verinin onu ezmesine izin verme
      setCurrentUser({
        ...mongoUser,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        token: token
      });
      
      return mongoUser;

    } catch (err) {
      // 2. Kullanıcı MongoDB'de yoksa
      if (err.response?.status === 404) {
        console.warn("MongoDB kaydı bulunamadı, oluşturuluyor...");
        try {
          const registerResponse = await api.post('/users/register', {
            name: firebaseUser.displayName || 'Yeni Kullanıcı', 
            email: firebaseUser.email,
            firebaseUid: firebaseUser.uid,
            role: 'volunteer' // Yeni kayıtlar için güvenli varsayılan
          });

          const newMongoUser = registerResponse.data?.data || registerResponse.data || registerResponse;
          
          setCurrentUser({
            ...newMongoUser,
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            token: await firebaseUser.getIdToken()
          });
          return newMongoUser;
        } catch (regErr) {
          console.error("Otomatik kayıt hatası:", regErr);
        }
      }
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        await syncUserWithDB(user); 
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await syncUserWithDB(userCredential.user); 
  };

  const register = async (email, password, userData) => {
    // 1. Firebase Auth Kaydı
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token);

    // 2. Kendi Veritabanımıza Kayıt
    const response = await api.post('/users/register', {
      ...userData,
      email: userCredential.user.email,
      firebaseUid: userCredential.user.uid
    });

    const newMongoUser = response.data?.data || response.data || response;
    
    setCurrentUser({
      ...newMongoUser,
      firebaseUid: userCredential.user.uid,
      email: userCredential.user.email,
      token: token
    });

    return userCredential.user;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setCurrentUser(null);
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  const updateAuthUser = (newUserData) => {
    setCurrentUser(prev => ({ ...prev, ...newUserData }));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    updateAuthUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};