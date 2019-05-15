import * as React from 'react';
import { render } from 'react-dom';
// import fs from 'fs';
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = require('electron');

console.log(ipcRenderer);

const App: React.SFC = () => <div>xxx</div>;

render(<App />, document.querySelector('#root'));
