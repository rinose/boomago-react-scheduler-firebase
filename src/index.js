import React from 'react';
import ReactDOM from 'react-dom';

import MyRoutes  from './routes';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const theme = createTheme({
  // Your theme configuration here
});

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
  <ThemeProvider theme={theme}>
      <MyRoutes/>
  </ThemeProvider>
  </I18nextProvider>,
  document.getElementById('root')
);
registerServiceWorker();
