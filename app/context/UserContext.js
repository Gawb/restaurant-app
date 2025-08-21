// app/context/UserContext.js
import { createContext } from "react";

export const DEFAULT_USER = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  avatarUri: "",
};

export const UserContext = createContext({
  user: DEFAULT_USER,
  // setter “dummy” para tipado/auto-complete; el real lo provee AppEntry
  setUser: (_u) => {},
});
