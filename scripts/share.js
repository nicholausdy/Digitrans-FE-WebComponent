import { config } from './util/config.js'
import { NavBar } from './components/navbar.js'

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
    description1.textContent = 'Sunting dan copy teks di bawah ini kemudian paste pada email, sosial media, atau aplikasi instant messaging untuk menyebarkan kuesioner';
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
    const idDescription = 'description'
    descInputForm.setAttribute('id', idDescription);
    descInputForm.setAttribute('rows', '7');
    descInputForm.setAttribute('cols', '80');
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('aria-label','description');
    descInputForm.setAttribute('aria-describedby','description-addon');
    const questionnaireId = localStorage.getItem('shareId');
    const questionnaireTitle = localStorage.getItem('shareTitle');
    const link = `${config.baseURL}findSurvey.html`;
    descInputForm.value = `Anda telah diundang untuk mengisi kuesioner berjudul "${questionnaireTitle}" pada link berikut ${link}
    \nMohon masukkan id berikut pada kolom "ID Kuesioner"
    \nID Kuesioner: ${questionnaireId}`;
    descInputGroup.appendChild(descInputForm);

    this.card = div;
  }

  static getCard() {
    const descriptionCard = new SharingCard();
    return descriptionCard.card;
  }
}

customElements.define('share-page', SharePage);
  