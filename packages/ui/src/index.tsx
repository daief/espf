import * as React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { GlobalCtxWrap } from './GlobalCtx';
import './styles/global.less';

render(
  <GlobalCtxWrap>
    <App />
  </GlobalCtxWrap>,
  document.querySelector('#root'),
);
