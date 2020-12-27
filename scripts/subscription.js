import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

class Subscription {
  static async getSubscription() {
    try {
      const url = config.backURL.concat('private/user/getSubscription');
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      if(!(token)) {
        throw new Error('Invalid login');
      }

      const data = { email };
      const response = await FetchAPI.postJSON(url, data, token);

      if (response.success) {
        return response.message;
      } else {
        throw new Error(response.message);
      } 

    } catch (error) {
      alert(error.message);
      const destinationURL = await URLParser.redirectURL(window.location.href,'index.html')
      window.location = destinationURL;
    } 
  }
}

class SubscriptionPage extends HTMLElement {
  constructor(){
    super();

    //bootstrap
    // css and jquery

    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');

    this.appendChild(link);

    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Langganan','Ganti akun'],['index.html','create.html','subscription.html','login.html'], 'Langganan');
    this.appendChild(navbar);

    (async() => {
      this.subscriptionDetail = await Subscription.getSubscription();
      // console.log(this.subscriptionDetail);
      const titleCard = TitleCard.getCard(this.subscriptionDetail);
      this.appendChild(titleCard);
    })();
  }
}

class TitleCard {
  constructor(subscriptionDetail) {
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

    const subscriptionTitle = document.createElement('h5');
    subscriptionTitle.setAttribute('class','card-title');
    subscriptionTitle.innerHTML = '<b> Langganan </b>';
    cardBody.appendChild(subscriptionTitle);

    const subscriptionDescription1 = document.createElement('h6');
    subscriptionDescription1.setAttribute('class','card-subtitle mb-2');
    subscriptionDescription1.textContent = 'Dengan berlangganan, Anda akan mendapatkan fitur berikut:';
    cardBody.appendChild(subscriptionDescription1);

    const subscriptionDescription2 = document.createElement('h6');
    subscriptionDescription2.setAttribute('class','card-subtitle mb-2');
    subscriptionDescription2.textContent = '- Penyimpanan kuesioner dengan jangka waktu tak terbatas';
    cardBody.appendChild(subscriptionDescription2);

    const subscriptionDescription3 = document.createElement('h6');
    subscriptionDescription3.setAttribute('class','card-subtitle mb-2');
    subscriptionDescription3.textContent = '- Catatan: batas waktu penyimpanan tanpa langganan adalah 1 minggu. Setelah 1 minggu, kuesioner akan dihapus';
    cardBody.appendChild(subscriptionDescription3);

    if (subscriptionDetail === null) {
      const button = SubscribeButton.getButton();
      cardBody.appendChild(button);
    } else {
      const button = UnsubscribeButton.getButton();
      cardBody.appendChild(button);

      const detailCard = SubscriptionDetailCard.getCard(subscriptionDetail);
      allCardsContainer.appendChild(detailCard);
    }

    this.card = allCardsContainer;
  }

  static getCard(subscriptionDetail) {
    const titleCard = new TitleCard(subscriptionDetail);
    return titleCard.card;
  }
}

class SubscribeButton {
  constructor() {
    const buttonContainer = document.createElement('div');
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type','button');
    buttonEl.setAttribute('class','btn btn-success mt-3');
    buttonEl.textContent = 'Mulai berlangganan';
    buttonEl.addEventListener('click', async() => {
      await SubscribeButton.startSubscription();
    })
    buttonContainer.appendChild(buttonEl);
    this.button = buttonContainer;
  }

  static async startSubscription() {
    try {
      const url = config.backURL.concat('private/user/subscription');
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      const data = { email };
      const confirmed = confirm('Apakah Anda yakin ingin mulai berlangganan?');

      if (confirmed){
        const response = await FetchAPI.postJSON(url, data, token);

        if (response.success) {
          alert('Subscribed');
          window.location = window.location.href;
        } else {
          throw new Error(response.message);
        }
      }

    } catch (error) {
      alert(error.message);
    }
  }

  static getButton() {
    const subButton = new SubscribeButton();
    return subButton.button;
  }
}

class UnsubscribeButton {
  constructor() {
    const buttonContainer = document.createElement('div');
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type','button');
    buttonEl.setAttribute('class','btn btn-danger mt-3');
    buttonEl.textContent = 'Berhenti berlangganan';
    buttonEl.addEventListener('click', async() => {
      await UnsubscribeButton.stopSubscription();
    })
    buttonContainer.appendChild(buttonEl);
    this.button = buttonContainer;
  }

  static async stopSubscription() {
    try {
      const url = config.backURL.concat('private/user/subscription');
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      const data = { email };
      const confirmed = confirm('Apakah Anda yakin ingin berhenti berlangganan?');

      if (confirmed){
        const response = await FetchAPI.deleteJSON(url, data, token);

        if (response.success) {
          alert(response.message);
          window.location = window.location.href;
        } else {
          throw new Error(response.message);
        }
      }

    } catch (error) {
      alert(error.message);
    }
  }

  static getButton() {
    const subButton = new UnsubscribeButton();
    return subButton.button;
  }
}

class SubscriptionDetailCard {
  constructor(subscriptionDetail) {
    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class', 'row mt-3 mx-auto');

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

    const subscriptionTitle = document.createElement('h5');
    subscriptionTitle.setAttribute('class','card-title');
    subscriptionTitle.innerHTML = '<b> Informasi Langganan </b>';
    cardBody.appendChild(subscriptionTitle);

    const subscriptionDescription1 = document.createElement('h6');
    subscriptionDescription1.setAttribute('class','card-subtitle mb-2');
    const amountsPaid = subscriptionDetail.amounts_paid.toString();
    subscriptionDescription1.textContent = ''.concat('Uang yang dibayarkan: Rp ', amountsPaid,',-');
    cardBody.appendChild(subscriptionDescription1);

    const subscriptionDescription2 = document.createElement('h6');
    subscriptionDescription2.setAttribute('class','card-subtitle mb-2');
    subscriptionDescription2.textContent = ''.concat('Tanggal mulai langganan: ', subscriptionDetail.start_date);
    cardBody.appendChild(subscriptionDescription2);

    this.card = cardContainerTop;
  }

  static getCard(subscriptionDetail) {
    const detailCard = new SubscriptionDetailCard(subscriptionDetail);
    return detailCard.card;
  }
}

customElements.define('subscription-page', SubscriptionPage);