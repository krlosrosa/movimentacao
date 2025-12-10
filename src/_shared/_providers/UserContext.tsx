'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { redirect, usePathname } from 'next/navigation';

// ... (interfaces User e UserContextType permanecem iguais) ...
export interface User {
  id: string;
  name: string;
  roles: string[];
  empresa: 'DPA' | 'ITB' | 'LDB' | null;
  centers: string[];
  centerSelect: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  handleSelectCenter: (center: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  initialUser: User | null;
  children: ReactNode;
}

export function UserProvider({ initialUser, children }: UserProviderProps) {
  const pathName = usePathname();

  // 1. ESTADO INICIAL ÚNICO (Hidratação + Auto-Seleção)
  // Esta função de inicialização roda SÓ UMA VEZ no cliente
  const [user, setUser] = useState<User | null>(() => {
    if (!initialUser) return null; // Usuário deslogado

    let finalCenter: string | null = null; // Começa nulo

    // Lógica 1: Auto-seleciona se só tiver 1 centro
    if (initialUser.centers.length === 1) {
      finalCenter = initialUser.centers[0];
      //salvarCache('centerId', finalCenter);
    }

    // Lógica 2: Tenta hidratar do localStorage se tiver mais de 1 centro
    // O valor do localStorage tem prioridade sobre a auto-seleção.
    if (typeof window !== 'undefined' && initialUser.centers.length > 1) {
      try {
        const storedCenterId = localStorage.getItem('centerId');
        if (storedCenterId && storedCenterId !== 'null') {
          const parsedCenterId = JSON.parse(storedCenterId);

          // Importante: garantir que o centro salvo ainda pertence ao usuário
          if (initialUser.centers.includes(parsedCenterId)) {
            finalCenter = parsedCenterId;
          } else {
            localStorage.removeItem('centerId'); // Limpa centro inválido
          }
        }
      } catch (e) {
        console.error('Falha ao ler centerId do localStorage', e);
        localStorage.removeItem('centerId');
      }
    }

    // Retorna o estado inicial combinado (dados do server + centro hidratado)
    return { ...initialUser, centerSelect: finalCenter };
  });

  // 2. EFEITO DE PERSISTÊNCIA (localStorage e Cache)
  // Roda APENAS quando o 'user' (e seus dados) realmente mudar.
  useEffect(() => {
    if (user) {
      // Persiste o centro selecionado
      if (user.centerSelect) {
        localStorage.setItem('centerId', JSON.stringify(user.centerSelect));
      } else {
        localStorage.removeItem('centerId');
      }
      // Persiste os roles
      localStorage.setItem('roles', JSON.stringify(user.roles));
    } else {
      // Usuário deslogado, limpa tudo
      localStorage.removeItem('centerId');
      localStorage.removeItem('roles');
    }
    // Usar user.centerSelect e user.roles garante que o efeito
    // só rode quando esses valores específicos mudarem.
  }, [user?.centerSelect, user?.roles]);

  // 3. EFEITO DE REDIRECIONAMENTO (NUNCA chama setUser)
  // Roda quando o estado 'user' (já hidratado) ou a rota mudam

  // 4. HANDLER (Simples, só atualiza o estado)
  // O Efeito 2 (Persistência) vai cuidar de salvar e cachear.
  function handleSelectCenter(center: string) {
    if (user) {
      setUser({ ...user, centerSelect: center });
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, handleSelectCenter }}>
      {children}
    </UserContext.Provider>
  );
}

// ... (hook useUser permanece igual) ...
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}
