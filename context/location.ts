import React, { createContext, useState, useContext } from 'react';

// interface IContextProps {
//     state: IState;
//     dispatch: ({type}:{type:string}) => void;
//   }

//  const CountContext = React.createContext({} as IContextProps);

// export default function CountProvider({ children }) {
//   const [count, setCount] = useState(0);

//   return (
//     <CountContext.Provider
//       value={{
//         count,
//         setCount
//       }}
//     >
//       {children}
//     </CountContext.Provider>
//   );
// }

// export function useCount() {
//   const context = useContext(CountContext);
//   if (!context) throw new Error("useCount must be used within a CountProvider");
//   const { count, setCount } = context;
//   return { count, setCount };
// }
