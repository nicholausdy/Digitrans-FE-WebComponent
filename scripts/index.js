import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

class IndexPage extends HTMLElement {
  constructor(){
    super();

    //Create shadow root
    //let shadow = this.attachShadow({mode: 'open'});
    //bootstrap
    // css and jquery

    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');

    this.appendChild(link);

    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Respon'],['index.html','create.html','response.html'], 'Kuesioner');
    this.appendChild(navbar);
  }
}

customElements.define('index-page', IndexPage);