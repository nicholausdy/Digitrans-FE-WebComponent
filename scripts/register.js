import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { Banner } from './banner.js'
import { FormValidator } from './util/FormValidator.js';

class RegisterPage extends HTMLElement {
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

    const banner = RegisterHeader.getJumbotron();
    shadow.appendChild(banner);

    const panel = RegisterPanel.getPanel();
    shadow.appendChild(panel);

  }
}

class RegisterHeader extends Banner {
  constructor(){
    super('Selamat datang di Digitrans', 'Mari membuat akun Anda...')
  }

  static getJumbotron(){
    const header = new RegisterHeader();
    return header.jumbotron;
  }
}

class RegisterPanel {
  constructor(){
    const panelContainer = document.createElement('div');
    panelContainer.setAttribute('class','container w-50 d-flex text-left justify-content-center');

    const panel = document.createElement('div');
    panel.setAttribute('class','panel w-100 panel-default');

    const panelBody = document.createElement('div');
    panelBody.setAttribute('class','panel-body');

    //create first row
    const firstRow = document.createElement('div');
    firstRow.setAttribute('class','row');

    const firstRowLabel = document.createElement('div');
    firstRowLabel.setAttribute('class','col-sm-3 mx-auto');
    firstRowLabel.textContent = 'Email';
    firstRow.appendChild(firstRowLabel);

    const firstRowInput = document.createElement('div');
    firstRowInput.setAttribute('class','col-sm-6 mx-auto');
    
    const firstRowInputFormGroup = document.createElement('div');
    firstRowInputFormGroup.setAttribute('class','form-group w-75');

    const firstRowInputArea = document.createElement('input');
    firstRowInputArea.setAttribute('type','email');
    firstRowInputArea.setAttribute('class','form-control');
    firstRowInputArea.setAttribute('id','email')
    firstRowInputArea.setAttribute('required','');
    
    firstRowInputFormGroup.appendChild(firstRowInputArea)
    firstRowInput.appendChild(firstRowInputFormGroup)
    firstRow.appendChild(firstRowInput);
    panelBody.appendChild(firstRow);

    //create second row
    const secondRow = document.createElement('div');
    secondRow.setAttribute('class','row');

    const secondRowLabel = document.createElement('div');
    secondRowLabel.setAttribute('class','col-sm-3 mx-auto');
    secondRowLabel.textContent = 'Buat password';
    secondRow.appendChild(secondRowLabel);

    const secondRowInput = document.createElement('div');
    secondRowInput.setAttribute('class','col-sm-6 mx-auto');
    
    const secondRowInputFormGroup = document.createElement('div');
    secondRowInputFormGroup.setAttribute('class','form-group w-75');

    const secondRowInputArea = document.createElement('input');
    secondRowInputArea.setAttribute('type','password');
    secondRowInputArea.setAttribute('class','form-control');
    secondRowInputArea.setAttribute('id','password');
    secondRowInputArea.setAttribute('required','');
    secondRowInputArea.setAttribute('pattern','(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    secondRowInputArea.setAttribute('title','Harus ada minimal 1 angka, 1 huruf kecil, 1 huruf besar, dan 8 atau lebih karakter');
    
    secondRowInputFormGroup.appendChild(secondRowInputArea)
    secondRowInput.appendChild(secondRowInputFormGroup)
    secondRow.appendChild(secondRowInput);
    panelBody.appendChild(secondRow);

    //create third row
    const thirdRow = document.createElement('div');
    thirdRow.setAttribute('class','row');

    const thirdRowLabel = document.createElement('div');
    thirdRowLabel.setAttribute('class','col-sm-3 mx-auto');
    thirdRowLabel.textContent = 'Konfirmasi password';
    thirdRow.appendChild(thirdRowLabel);

    const thirdRowInput = document.createElement('div');
    thirdRowInput.setAttribute('class','col-sm-6 mx-auto');
    
    const thirdRowInputFormGroup = document.createElement('div');
    thirdRowInputFormGroup.setAttribute('class','form-group w-75');

    const thirdRowInputArea = document.createElement('input');
    thirdRowInputArea.setAttribute('type','password');
    thirdRowInputArea.setAttribute('class','form-control');
    thirdRowInputArea.setAttribute('id','password1');
    thirdRowInputArea.setAttribute('required','');
    
    thirdRowInputFormGroup.appendChild(thirdRowInputArea)
    thirdRowInput.appendChild(thirdRowInputFormGroup)
    thirdRow.appendChild(thirdRowInput);
    panelBody.appendChild(thirdRow);

    //create fourth row
    const fourthRow = document.createElement('div');
    fourthRow.setAttribute('class','row');

    const fourthRowLabel = document.createElement('div');
    fourthRowLabel.setAttribute('class','col-sm-3 mx-auto');
    fourthRowLabel.textContent = 'Nama institusi asal';
    fourthRow.appendChild(fourthRowLabel);

    const fourthRowInput = document.createElement('div');
    fourthRowInput.setAttribute('class','col-sm-6 mx-auto');
    
    const fourthRowInputFormGroup = document.createElement('div');
    fourthRowInputFormGroup.setAttribute('class','form-group w-75');

    const fourthRowInputArea = document.createElement('input');
    fourthRowInputArea.setAttribute('type','text');
    fourthRowInputArea.setAttribute('class','form-control');
    fourthRowInputArea.setAttribute('id','institution');
    fourthRowInputArea.setAttribute('required','');
    
    fourthRowInputFormGroup.appendChild(fourthRowInputArea)
    fourthRowInput.appendChild(fourthRowInputFormGroup)
    fourthRow.appendChild(fourthRowInput);
    panelBody.appendChild(fourthRow);

    //create fifth row
    const fifthRow = document.createElement('div');
    fifthRow.setAttribute('class','row');

    const fifthRowLabel = document.createElement('div');
    fifthRowLabel.setAttribute('class','col-sm-3 mx-auto');
    fifthRowLabel.textContent = 'Nama Anda';
    fifthRow.appendChild(fifthRowLabel);

    const fifthRowInput = document.createElement('div');
    fifthRowInput.setAttribute('class','col-sm-6 mx-auto');
    
    const fifthRowInputFormGroup = document.createElement('div');
    fifthRowInputFormGroup.setAttribute('class','form-group w-75');

    const fifthRowInputArea = document.createElement('input');
    fifthRowInputArea.setAttribute('type','text');
    fifthRowInputArea.setAttribute('class','form-control');
    fifthRowInputArea.setAttribute('id','name');
    fifthRowInputArea.setAttribute('required','');
    
    fifthRowInputFormGroup.appendChild(fifthRowInputArea)
    fifthRowInput.appendChild(fifthRowInputFormGroup)
    fifthRow.appendChild(fifthRowInput);
    panelBody.appendChild(fifthRow);

    //create sixth row
    const sixthRow = document.createElement('div');
    sixthRow.setAttribute('class','row');

    const sixthRowLabel = document.createElement('div');
    sixthRowLabel.setAttribute('class','col-sm-3 mx-auto');
    sixthRowLabel.textContent = 'Nomor telepon';
    sixthRow.appendChild(sixthRowLabel);

    const sixthRowInput = document.createElement('div');
    sixthRowInput.setAttribute('class','col-sm-6 mx-auto');
    
    const sixthRowInputFormGroup = document.createElement('div');
    sixthRowInputFormGroup.setAttribute('class','form-group w-75');

    const sixthRowInputArea = document.createElement('input');
    sixthRowInputArea.setAttribute('type','text');
    sixthRowInputArea.setAttribute('class','form-control');
    sixthRowInputArea.setAttribute('id','phone-number');
    sixthRowInputArea.setAttribute('required','');
    sixthRowInputArea.setAttribute('pattern','^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$');
    sixthRowInputArea.setAttribute('title','Masukkan format nomor telepon');
    
    sixthRowInputFormGroup.appendChild(sixthRowInputArea)
    sixthRowInput.appendChild(sixthRowInputFormGroup)
    sixthRow.appendChild(sixthRowInput);
    panelBody.appendChild(sixthRow);

    //create seventh row
    const seventhRow = document.createElement('div');
    seventhRow.setAttribute('class','row');

    const seventhRowLabel = document.createElement('div');
    seventhRowLabel.setAttribute('class','col-sm-3 mx-auto');
    seventhRowLabel.textContent = 'Pekerjaan Anda';
    seventhRow.appendChild(seventhRowLabel);

    const seventhRowInput = document.createElement('div');
    seventhRowInput.setAttribute('class','col-sm-6 mx-auto');
    
    const seventhRowInputFormGroup = document.createElement('div');
    seventhRowInputFormGroup.setAttribute('class','form-group w-75');

    const seventhRowInputArea = document.createElement('input');
    seventhRowInputArea.setAttribute('type','text');
    seventhRowInputArea.setAttribute('class','form-control');
    seventhRowInputArea.setAttribute('id','job');
    seventhRowInputArea.setAttribute('required','');
    
    seventhRowInputFormGroup.appendChild(seventhRowInputArea)
    seventhRowInput.appendChild(seventhRowInputFormGroup)
    seventhRow.appendChild(seventhRowInput);
    panelBody.appendChild(seventhRow);

    //Submit button
    const submitRow = document.createElement('div');
    submitRow.setAttribute('class','row mt-3');

    const blankColumn = document.createElement('div');
    blankColumn.setAttribute('class','col-sm-3 mx-auto');

    const submitColumn = document.createElement('div');
    submitColumn.setAttribute('class', 'col-sm-6 mx-auto');

    const blankColumn2 = document.createElement('div');
    blankColumn2.setAttribute('class','col-sm-3 mx-auto');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('class','btn btn-success w-100');
    submitButton.setAttribute('type','button');
    submitButton.setAttribute('id','submit');
    submitButton.textContent = 'Daftar';
    submitButton.addEventListener('click', RegisterPanel.submitAction);

    submitColumn.appendChild(submitButton);
    submitRow.appendChild(blankColumn);
    submitRow.appendChild(submitColumn);
    submitRow.appendChild(blankColumn2);
    panelBody.appendChild(submitRow);

    //label login
    const loginRow = document.createElement('div');
    loginRow.setAttribute('class','row');

    const loginBlankColumn = document.createElement('div')
    loginBlankColumn.setAttribute('class', 'col-sm-3 mx-auto');

    const loginColumn = document.createElement('div');
    loginColumn.setAttribute('class', 'col-sm-6 mx-auto text-center');

    const loginBlankColumn2 = document.createElement('div')
    loginBlankColumn2.setAttribute('class', 'col-sm-3 mx-auto');

    const loginText = document.createElement('p');
    loginText.setAttribute('class','gl');
    loginText.textContent = "Jika Anda sudah mendaftar, silahkan ";

    const loginLink = document.createElement('a');
    loginLink.setAttribute('href',config.baseURL.concat('login.html'))
    loginLink.textContent = 'masuk'

    loginText.appendChild(loginLink);
    loginColumn.appendChild(loginText);
    loginRow.appendChild(loginBlankColumn);
    loginRow.appendChild(loginColumn);
    loginRow.appendChild(loginBlankColumn2);
    panelBody.appendChild(loginRow);

    //attach components to panel
    panel.appendChild(panelBody);
    panelContainer.appendChild(panel);

    this.panel = panelContainer;
  }

  static getPanel() {
    const registerPanel = new RegisterPanel();
    return registerPanel.panel;
  }

  static async submitAction() {
    try {
      const shadow = document.getElementById('register-page').shadowRoot;
      const email = shadow.getElementById('email').value;
      const password = shadow.getElementById('password').value;
      const confirmPassword = shadow.getElementById('password1').value;
      const institution = shadow.getElementById('institution').value;
      const name = shadow.getElementById('name').value;
      const telephoneNo = shadow.getElementById('phone-number').value;
      const job = shadow.getElementById('job').value;

      if (!(email) || !(password) || !(confirmPassword) || !(institution)
        || !(name) || !(telephoneNo) || !(job)) {
        throw new Error('Ada isian yang belum diisi');
      }

      const validateEmail = FormValidator.validateEmail(email);
      const validateTelephoneNo = FormValidator.validateTelephoneNo(telephoneNo);
      const validatePassword = FormValidator.validatePassword(password, confirmPassword);
      await Promise.all([validateEmail, validateTelephoneNo, validatePassword]);

      const url = config.backURL.concat('public/user/register');
      const data = {
        email: email,
        password: password,
        password1: confirmPassword,
        institution: institution,
        name: name,
        phone_number: telephoneNo,
        job: job,
      };
      console.log(data)
      const response = await FetchAPI.postJSON(url, data);
      if (response.success) {
        // localStorage.setItem('token', response.message);
        alert("Akun Anda sudah terdaftar. Mohon cek email untuk verifikasi, lalu login kembali")
      } else {
        if (response.message === 'SequelizeUniqueConstraintError'){
          throw new Error('Email sudah pernah terdaftar');
        }
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error)
      alert(error.message);
    }
  }
}



customElements.define('register-page', RegisterPage);