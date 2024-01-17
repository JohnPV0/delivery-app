import Navigation from './src/Navigation';
import { Provider } from 'react-redux';
import { store } from './src/store';
import React from 'react';


export default function App() {
  
  
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
