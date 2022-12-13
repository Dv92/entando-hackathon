import './public-path'

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from '@emotion/react' 
import {
  createTheme,
  ThemeProvider
} from "@mui/material/styles";
import createCache from '@emotion/cache';

 /*
* id you want to enable css injection uncomment this line
* import styles from './index.css';
*/

import App from './App';

class ReactMFE extends HTMLElement {
  #rootID = 'app-element'
  #appInstance = null

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render()
  }

  cleanTree() {
    const currentElement = this.shadowRoot.getElementById(this.#rootID);

    if (currentElement) {
      this.shadowRoot.removeChild(currentElement);
    }

    this.#appInstance?.unmount();
  }

  render() {
    const shadowRootElement = document.createElement('div');
    const emotionStyleRoot = document.createElement('style');

    shadowRootElement.id = this.#rootID;

    this.cleanTree();

    /*
    * id you want to enable css injection uncomment this line
    * styles.use({ target: this.shadowRoot });
    */

    this.shadowRoot.appendChild(emotionStyleRoot);

    const cache = createCache({
      key: 'css',
      prepend: true,
      container: emotionStyleRoot,
    });

    this.#appInstance = ReactDOM.createRoot(shadowRootElement);

    const shadowTheme = createTheme({
      components: {
        MuiPopover: {
          defaultProps: {
            container: shadowRootElement
          }
        },
        MuiPopper: {
          defaultProps: {
            container: shadowRootElement
          }
        },
        MuiModal: {
          defaultProps: {
            container: shadowRootElement
          }
        }
      }
    });


    this.#appInstance.render(
      <React.StrictMode>
        <CacheProvider value={cache}>
          <ThemeProvider theme={shadowTheme}>
            <App />
          </ThemeProvider>
        </CacheProvider>
      </React.StrictMode>
    );

    this.shadowRoot.appendChild(shadowRootElement);
  }
}

customElements.define('react-material-mfe', ReactMFE);