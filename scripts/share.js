import { config } from './util/config.js'
import { NavBar } from './components/navbar.js'
import { FormValidator } from './util/FormValidator.js'
import { FetchAPI } from './util/fetchAPI.js';

class SharePage extends HTMLElement {
  constructor() {
    super();
    
    //bootstrap
    // css and jquery
    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');
    
    this.appendChild(link);
    
    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Kalkulator sampel','Langganan','Ganti akun'],['index.html','create.html','sample.html','subscription.html','login.html'], 'Kuesioner');
    this.appendChild(navbar);

    //description
    const descriptionCard = DescriptionCard.getCard();
    this.appendChild(descriptionCard);

    //sharing text
    const sharingCard = SharingCard.getCard();
    this.appendChild(sharingCard);

    //email input
    const emailCard = EmailCard.getCard();
    this.appendChild(emailCard);
  }
}

class DescriptionCard {
  constructor() {
    const allCardsContainer = document.createElement('div');

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class', 'row mt-5 mx-auto');
    allCardsContainer.appendChild(cardContainerTop);

    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'row mt-5 mx-auto');

    cardContainerTop.append(cardContainer);

    const card = document.createElement('div');
    card.setAttribute('class','card mx-auto bg-dark');
    card.setAttribute('style','width: 50rem;')
    
    cardContainer.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body text-light');
    
    card.appendChild(cardBody);

    const title = document.createElement('h5');
    title.setAttribute('class','card-title');
    title.innerHTML = '<b> Sebar Kuesioner </b>';
    cardBody.appendChild(title);

    const description1 = document.createElement('h6');
    description1.setAttribute('class','card-subtitle mb-2');
    description1.textContent = 'Sunting teks di bawah ini dan masukkan email-email yang hendak Anda kirimkan kuesioner.';
    cardBody.appendChild(description1);

    this.card = allCardsContainer;
  }

  static getCard() {
    const descriptionCard = new DescriptionCard();
    return descriptionCard.card;
  }
}

class SharingCard {
  constructor() {
    const div = document.createElement('div');
    div.setAttribute('class','mx-auto');

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class','row mx-auto');

    div.appendChild(cardContainerTop);

    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class','row mt-5 mx-auto');

    cardContainerTop.append(cardContainer);

    const card = document.createElement('div');
    card.setAttribute('class','card mx-auto bg-dark');
    card.setAttribute('style','width: 50rem;')
    
    cardContainer.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body text-light');
    
    card.appendChild(cardBody);

    // Ukuran populasi 
    const descInputGroup = document.createElement('div');
    descInputGroup.setAttribute('class','input-group sm-6 mt-3');
    cardBody.appendChild(descInputGroup);

    const descInputPrepend = document.createElement('div');
    descInputPrepend.setAttribute('class','input-group-prepend');
    descInputGroup.appendChild(descInputPrepend);

    const descInputSpan = document.createElement('span');
    descInputSpan.setAttribute('class','input-group-text');
    descInputSpan.setAttribute('id','description-addon');
    descInputSpan.setAttribute('style','width: 10rem;')
    descInputSpan.setAttribute('name','label-teks')
    descInputSpan.textContent = 'Informasi sharing';
    descInputPrepend.appendChild(descInputSpan);

    const descInputForm = document.createElement('textarea');
    const idDescription = 'idDescription'
    descInputForm.setAttribute('id', idDescription);
    descInputForm.setAttribute('rows', '7');
    descInputForm.setAttribute('cols', '80');
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('aria-label','description');
    descInputForm.setAttribute('aria-describedby','description-addon');
    const questionnaireId = localStorage.getItem('shareId');
    const questionnaireTitle = localStorage.getItem('shareTitle');
    const link = `${config.baseURL}findSurvey.html`;
    descInputForm.value = `Anda telah diundang untuk mengisi kuesioner berjudul "${questionnaireTitle}" pada link berikut ${link}. Mohon masukkan id berikut pada kolom "ID Kuesioner". ID Kuesioner: ${questionnaireId}`;
    descInputGroup.appendChild(descInputForm);

    this.card = div;
  }

  static getCard() {
    const descriptionCard = new SharingCard();
    return descriptionCard.card;
  }
}

class EmailCard {
  constructor() {
    const div = document.createElement('div');
    div.setAttribute('class','mx-auto');

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class','row mx-auto');

    div.appendChild(cardContainerTop);

    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class','row mt-5 mx-auto');

    cardContainerTop.append(cardContainer);

    const card = document.createElement('div');
    card.setAttribute('class','card mx-auto bg-dark');
    card.setAttribute('style','width: 50rem;')
    
    cardContainer.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body text-light');
    
    card.appendChild(cardBody);

    const emailInputGroup = document.createElement('div');
    emailInputGroup.setAttribute('class','input-group sm-6 mt-3');
    cardBody.appendChild(emailInputGroup);

    const emailInputPrepend = document.createElement('div');
    emailInputPrepend.setAttribute('class','input-group-prepend');
    emailInputGroup.appendChild(emailInputPrepend);

    const emailInputSpan = document.createElement('span');
    emailInputSpan.setAttribute('class','input-group-text');
    emailInputSpan.setAttribute('id','description-addon');
    emailInputSpan.setAttribute('style','width: 10rem;')
    emailInputSpan.setAttribute('name','label-teks')
    emailInputSpan.textContent = 'Masukkan email';
    emailInputPrepend.appendChild(emailInputSpan);

    const emailInputForm = document.createElement('textarea');
    const idEmails = 'idEmails';
    emailInputForm.setAttribute('id', idEmails);
    emailInputForm.setAttribute('rows', '7');
    emailInputForm.setAttribute('cols', '80');
    emailInputForm.setAttribute('class','form-control');
    emailInputForm.setAttribute('aria-label','description');
    emailInputForm.setAttribute('aria-describedby','description-addon');
    emailInputForm.setAttribute('placeholder','james@gmail.com, william@yahoo.com, denny@gmail.com');
    emailInputGroup.appendChild(emailInputForm);

    // submit button
    const submitButton = SubmitButton.getButton();
    cardBody.appendChild(submitButton);

    this.card = div;
  }

  static getCard() {
    const emailCard = new EmailCard();
    return emailCard.card;
  }
}

class SubmitButton {
  constructor() {
    const buttonContainer = document.createElement('div');
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type','button');
    buttonEl.setAttribute('class','btn btn-success mt-3');
    buttonEl.textContent = 'Submit';
    buttonEl.addEventListener('click', async() => {
      await ButtonAction.submitAction();
    });
    buttonContainer.appendChild(buttonEl);
    this.button = buttonContainer;
  }

  static getButton() {
    const submitButton = new SubmitButton();
    return submitButton.button;
  }
}

class ButtonAction {
  static async getSharingText(){
    try {
      const textElem = document.getElementById('idDescription');
      const text = textElem.value;
      if (!text) {
        throw new Error('Isian text kosong');
      }
      return text;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getEmails(){
    try {
      const emailsElem = document.getElementById('idEmails');
      const emailStr = emailsElem.value;
      if (!emailStr) {
        throw new Error('Isian email kosong');
      }

      const emailStrList = emailStr.split(",");
      for (let i = 0; i < emailStrList.length; i++) {
        emailStrList[i] = emailStrList[i].replace(/\s/g, ''); //clean spaces
        await FormValidator.validateEmail(emailStrList[i]);
      }
      return emailStrList;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async submitAction(){
    try {
      const text = await ButtonAction.getSharingText();
      const emails = await ButtonAction.getEmails();

      const url = config.backURL.concat('private/shareQuestionnaire');

      const token = localStorage.getItem('token');
      if (!(token)) {
        const destinationURL = await URLParser.redirectURL(window.location.href,'login.html')
        window.location = destinationURL;
      }

      const data = { text, emails };
      const responseMessage = await FetchAPI.postJSON(url, data, token);
      alert(responseMessage.message);
    } catch (error) {
      alert(error.message);
    }
  }
}
customElements.define('share-page', SharePage);
  