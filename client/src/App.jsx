import React from 'react';
import AppRouter from './routes/AppRouter';
import CustomCursor from './components/CustomCursor';
import './index.css';

function App() {
  return (
    <div className="App min-h-screen bg-slate-50 text-slate-900">
      <CustomCursor />
      <AppRouter />
    </div>
  );
}

export default App;

