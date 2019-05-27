import * as React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { App } from './App';
import { GlobalCtxWrap } from './GlobalCtx';
import './styles/global.less';

const Root: React.SFC = hot(() => (
  <GlobalCtxWrap>
    <App />
  </GlobalCtxWrap>
));

render(<Root />, document.querySelector('#root'));
