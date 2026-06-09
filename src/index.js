import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// O React procura a div com id="root" no public/index.html.
// Tudo que esta dentro do componente App aparece dentro dessa div.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Por enquanto nao estamos medindo performance.
// Mais tarde, voce pode passar console.log aqui para ver metricas no navegador.
reportWebVitals();
