import { createContext, useContext } from "react";

export const DirectoryContext = createContext(null);

// console.log(DirectoryContext);

export function useDirectoryContext() {
  return useContext(DirectoryContext);
}
