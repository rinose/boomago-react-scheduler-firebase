import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
  <MuiThemeProvider>
    <Routes/>
  </MuiThemeProvider>
  </I18nextProvider>,
  document.getElementById('root')
);
registerServiceWorker();
