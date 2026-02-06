"use client";

import React, { createContext, useContext, useState } from "react";

type UserContextType = {
  uid: string | null;
  email: string | null;
  setUid: (uid: string) => void;
  setEmail: (email: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        uid,
        setUid,
        email,
        setEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const userContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  return context;
};
