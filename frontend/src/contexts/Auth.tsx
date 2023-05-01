import { createContext, ReactNode, useEffect, useState } from "react";

import { useToast } from "@chakra-ui/react";
import api from "../config/api";
import { subscribeNotifications, unsubscribeAllNotifications } from "../utils/notifications";

type LoginParams = {
  email: string;
  password: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  id: string | null;
  login: (data: LoginParams) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

const getIdFromLocalStorage = () => {
  const token = localStorage.getItem("intercam-user-id");

  if (!token) {
    return null;
  }

  return token;
};

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [id, setId] = useState<string | null>(getIdFromLocalStorage());
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();

  const isAuthenticated = !!id;

  useEffect(() => {
    if (isAuthenticated) {
      api.get(`/users/${id}`).then((res) => {
        setUser(res.data.user);
      }).catch((err) => {
        toast({
          title: "Atenção!",
          description: "Entre novamente",
          status: "error",
          duration: 3000,
          isClosable: true
        });

        localStorage.removeItem("intercam-user-id");
        setUser(null);
        setId(null);
      });
    }
  }, [id]);

  const login = async (body: LoginParams) => {
    try {
      const res = await api.post("/users/login", body);
  
      localStorage.setItem("intercam-user-id", res.data.user.id);
  
      setId(res.data.user.id);
      setUser(res.data.user);
      subscribeNotifications(res.data.user.id);
    } catch(err) {
      toast({
        title: "Erro",
        description: "Usuário ou senha incorretos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };
  };

  const logout = () => {
    localStorage.removeItem("intercam-user-id");
    
    setId(null);
    setUser(null);
    unsubscribeAllNotifications();
  };

  return (
    <AuthContext.Provider
      value={{ user, id, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
