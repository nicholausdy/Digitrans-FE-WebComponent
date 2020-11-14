import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

class LoginPage extends HTMLElement {
  constructor() {
    // instantiate parent object
    super();

    //Create shadow root
    let shadow = this.attachShadow({mode: 'open'});
    //bootstrap
    // css
    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');
    shadow.appendChild(link);
    
    const banner = LoginHeader.getJumbotron();
    shadow.appendChild(banner);

    const panel = LoginPanel.getPanel();
    shadow.appendChild(panel);
  }  
}

class LoginHeader {
  constructor(){
    // container for header
    const jumbotron = document.createElement('div');
    jumbotron.setAttribute('class','jumbotron');
 
    const headerContainer = document.createElement('div');
    headerContainer.setAttribute('class','container')
     
    //header 1st row
    const headerRow = document.createElement('div')
    headerRow.setAttribute('class','row text-center')
 
    const headerColumn = document.createElement('div')
    headerColumn.setAttribute('class','col-md-8 mx-auto')
 
    const headerDisplay = document.createElement('h1')
    headerDisplay.setAttribute('class','display-4')
 
    headerDisplay.textContent = 'Selamat datang di Digitrans'
 
    //header 2nd row
    const headerRow2 = document.createElement('div')
    headerRow2.setAttribute('class','row text-center mt-3')
 
    const headerColumn2 = document.createElement('div')
    headerColumn2.setAttribute('class','col-md-8 mx-auto')
 
    const headerDisplay2 = document.createElement('h1')
    headerDisplay2.setAttribute('class','lead')
 
    headerDisplay2.textContent = "Mari login untuk mulai membuat kuesioner..."
 
    headerColumn.appendChild(headerDisplay)
    headerRow.appendChild(headerColumn)
    headerContainer.appendChild(headerRow)
 
    headerColumn2.appendChild(headerDisplay2)
    headerRow2.appendChild(headerColumn2)
    headerContainer.appendChild(headerRow2)
 
    jumbotron.appendChild(headerContainer)

    this.jumbotron = jumbotron
  }

  static getJumbotron(){
    const loginHeader = new LoginHeader();
    return loginHeader.jumbotron;
  }
}

class LoginPanel {
  constructor(){
    const panelContainer = document.createElement('div');
    panelContainer.setAttribute('class','container w-25 d-flex text-center justify-content-center');

    const panel = document.createElement('div');
    panel.setAttribute('class','panel w-100 panel-default');

    const panelBody = document.createElement('div');
    panelBody.setAttribute('class','panel-body');

    //label username
    const usernameRow = document.createElement('div');
    usernameRow.setAttribute('class','row mt-3');

    const usernameColumn = document.createElement('div');
    usernameColumn.setAttribute('class', 'col w-100 mx-auto');

    usernameColumn.innerHTML = '<b>Email</b>'
    usernameRow.appendChild(usernameColumn);
    panelBody.appendChild(usernameRow)

    //input text username
    const usernameInputRow = document.createElement('div');
    usernameInputRow.setAttribute('class','row mt-3');

    const usernameInputColumn = document.createElement('div');
    usernameInputColumn.setAttribute('class','col w-100 mx-auto');

    const usernameInputFormGroup = document.createElement('div');
    usernameInputFormGroup.setAttribute('class','form-group w-100');

    const usernameInputArea = document.createElement('input');
    usernameInputArea.setAttribute('type','email');
    usernameInputArea.setAttribute('class','form-control');
    usernameInputArea.setAttribute('id','email')

    usernameInputFormGroup.appendChild(usernameInputArea);
    usernameInputColumn.appendChild(usernameInputFormGroup);
    usernameInputRow.appendChild(usernameInputColumn);
    panelBody.appendChild(usernameInputRow);

    //label password
    const passwordRow = document.createElement('div');
    passwordRow.setAttribute('class','row');

    const passwordColumn = document.createElement('div');
    passwordColumn.setAttribute('class', 'col w-100 mx-auto');

    passwordColumn.innerHTML = '<b>Password</b>'
    passwordRow.appendChild(passwordColumn);
    panelBody.appendChild(passwordRow)

    panel.appendChild(panelBody);
    panelContainer.appendChild(panel);

    //input text password
    const passwordInputRow = document.createElement('div');
    passwordInputRow.setAttribute('class','row mt-3');

    const passwordInputColumn = document.createElement('div');
    passwordInputColumn.setAttribute('class','col w-100 mx-auto');

    const passwordInputFormGroup = document.createElement('div');
    passwordInputFormGroup.setAttribute('class','form-group w-100');

    const passwordInputArea = document.createElement('input');
    passwordInputArea.setAttribute('type','password');
    passwordInputArea.setAttribute('class','form-control');
    passwordInputArea.setAttribute('id','password')

    passwordInputFormGroup.appendChild(passwordInputArea);
    passwordInputColumn.appendChild(passwordInputFormGroup);
    passwordInputRow.appendChild(passwordInputColumn);
    panelBody.appendChild(passwordInputRow);

    //Submit button
    const submitRow = document.createElement('div');
    submitRow.setAttribute('class','row mt-3');

    const submitColumn = document.createElement('div');
    submitColumn.setAttribute('class', 'col w-100 mx-auto');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('class','btn btn-success w-100');
    submitButton.setAttribute('type','button');
    submitButton.setAttribute('id','submit');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', LoginPanel.submitAction);

    submitColumn.appendChild(submitButton);
    submitRow.appendChild(submitColumn);
    panelBody.appendChild(submitRow);

    //label register
    const registerRow = document.createElement('div');
    registerRow.setAttribute('class','row');

    const registerColumn = document.createElement('div');
    registerColumn.setAttribute('class', 'col w-100 mx-auto');

    const registerText = document.createElement('p');
    registerText.setAttribute('class','gl');
    registerText.textContent = "Jika akun Anda belum terdaftar, ";

    const registerLink = document.createElement('a');
    registerLink.setAttribute('href',config.baseURL.concat('register.html'))
    registerLink.textContent = 'daftar di sini'

    registerText.appendChild(registerLink);
    registerColumn.appendChild(registerText);
    registerRow.appendChild(registerColumn);
    panelBody.appendChild(registerRow);

    this.panel = panelContainer;
  }

  static getPanel(){
    const loginPanel = new LoginPanel();
    return loginPanel.panel;
  }

  static async submitAction(){
    try {
      const shadow = document.getElementById('login-page').shadowRoot;
      const email = shadow.getElementById('email').value;
      const password = shadow.getElementById('password').value;
      const url = config.backURL.concat('public/user/login');
      const data = {email: email, password: password};
      const response = await FetchAPI.postJSON(url, data);
      if (response.success) {
        localStorage.setItem('token', response.message);
        const destinationURL = await URLParser.redirectURL(window.location.href,'index.html')
        window.location = destinationURL;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  }
}

customElements.define('login-page', LoginPage);

