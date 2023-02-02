import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import MainPage from './components/organisms/MainPage/MainPage';
import { fetchContext } from './context/fetchContext'

function App() {
  const [refetch, setRefetch] = useState(false);
  return (
    <fetchContext.Provider value={{refetch, setRefetch}}>
      <ChakraProvider>
          <div className="App">
            <MainPage />
          </div>
      </ChakraProvider>
    </fetchContext.Provider>
  );
}

export default App;
