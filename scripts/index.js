import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

class Questionnaires {
  static async getQuestionnaires(){
    try {
      const url = config.backURL.concat('private/getQuestionnaires');
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');
      
      if (!(email) || !(token)){
        throw new Error('Invalid login')
      }
  
      const data = {email: email}
      const response = await FetchAPI.postJSON(url, data, token);
  
      if (response.success) {
        return response.message
      } else {
        throw new Error(error.message);
      }
  
    } catch (error) {
      alert(error.message);
      const destinationURL = await URLParser.redirectURL(window.location.href,'login.html')
      window.location = destinationURL;
    }
  }
}


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

    (async() => {
      this.responseMessage = await Questionnaires.getQuestionnaires();
      // console.log(this.responseMessage);
      const carousel = Carousel.getCarousel(this.responseMessage);
      this.appendChild(carousel);
    })();
  }
}

class Carousel{
  constructor(responseMessage){
    if (responseMessage.length < 6) {
      this.highlightedMessage = responseMessage;
    } else {
      this.highlightedMessage = responseMessage.slice(responseMessage.length - 5);
    }
    const carouselContainer = document.createElement('div');
    carouselContainer.setAttribute('class','container mt-5 text-center text-light');

    const carousel = document.createElement('div');
    carousel.setAttribute('id','carouselInterval');
    carousel.setAttribute('class','carousel slide');
    carousel.setAttribute('data-ride','carousel');

    const carouselInner = document.createElement('div');

    if (this.highlightedMessage.length === 0) {
      const carouselItem = document.createElement('div');
      carouselItem.setAttribute('class','carousel-item active');

      const block = document.createElement('span');
      block.setAttribute('class','d-block w-100 mh-100 bg-dark');

      const top = document.createElement('h6');
      top.innerHTML = '<br>'
      block.appendChild(top);

      const title = document.createElement('h4');
      title.setAttribute('class','mb-2');
      title.innerHTML = '<b>Belum ada kuesioner</b>';
      block.appendChild(title);

      const bottom = document.createElement('h6');
      bottom.innerHTML = '<br>'
      block.appendChild(bottom);

      carouselItem.appendChild(block);

      carouselInner.appendChild(carouselItem);
    }

    for (let i = 0; i < this.highlightedMessage.length; i++) {
      let carouselItem;
      let block;
      let title;
      let description;
      let id;
      let bottom;
      let top;

      carouselItem = document.createElement('div');
      if ( i === 0 ){
        carouselItem.setAttribute('class','carousel-item active');
        carouselItem.setAttribute('data-interval','5000');
      } else {
        carouselItem.setAttribute('class','carousel-item');
        carouselItem.setAttribute('data-interval','2000');
      }

      block = document.createElement('span');
      block.setAttribute('class','d-block w-100 mh-100 bg-dark');

      top = document.createElement('h6');
      top.innerHTML = '<br>'
      block.appendChild(top);

      title = document.createElement('h4');
      title.setAttribute('class','mb-2');
      title.innerHTML = 'Judul: '.concat('<b>',this.highlightedMessage[i].QuestionnaireTitle,'</b>');
      block.appendChild(title);

      description = document.createElement('h5');
      description.setAttribute('class','mb-2');
      description.innerHTML = 'Deskripsi: '.concat('<b>',this.highlightedMessage[i].QuestionnaireDescription,'</b>');
      block.appendChild(description);

      id = document.createElement('h6');
      id.setAttribute('class','mb-2');
      id.innerHTML = 'Id yang dapat dibagi: '.concat('<b>',this.highlightedMessage[i].QuestionnaireId,'</b>');
      block.appendChild(id);

      bottom = document.createElement('h6');
      bottom.innerHTML = '<br>'
      block.appendChild(bottom);

      carouselItem.appendChild(block);

      carouselInner.appendChild(carouselItem);
    }

    carousel.appendChild(carouselInner);

    const prevControl = document.createElement('a');
    prevControl.setAttribute('class','carousel-control-prev');
    prevControl.setAttribute('href','#carouselInterval');
    prevControl.setAttribute('role','button');
    prevControl.setAttribute('data-slide','prev');

    const prevControlSpan1 = document.createElement('span');
    prevControlSpan1.setAttribute('class','carousel-control-prev-icon mt-5');
    prevControlSpan1.setAttribute('aria-hidden','true');
    prevControl.appendChild(prevControlSpan1);

    const prevControlSpan2 = document.createElement('span');
    prevControlSpan2.setAttribute('class','sr-only');
    prevControlSpan2.textContent = 'Previous';
    prevControl.appendChild(prevControlSpan2);

    carousel.appendChild(prevControl);

    const nextControl = document.createElement('a');
    nextControl.setAttribute('class','carousel-control-next');
    nextControl.setAttribute('href','#carouselInterval');
    nextControl.setAttribute('role','button');
    nextControl.setAttribute('data-slide','next');

    const nextControlSpan1 = document.createElement('span');
    nextControlSpan1.setAttribute('class','carousel-control-next-icon mt-5');
    nextControl.setAttribute('aria-hidden','true');
    nextControl.appendChild(nextControlSpan1);

    const nextControlSpan2 = document.createElement('span');
    nextControlSpan2.setAttribute('class','sr-only');
    nextControlSpan2.textContent = 'Next';
    nextControl.appendChild(nextControlSpan2);

    carousel.appendChild(nextControl);

    carouselContainer.appendChild(carousel);

    this.carousel = carouselContainer;
  }

  static getCarousel(responseMessage) {
    const carouselComp = new Carousel(responseMessage);
    return carouselComp.carousel;
  }
}

customElements.define('index-page', IndexPage);