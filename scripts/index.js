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
        throw new Error(response.message);
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
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Ganti akun'],['index.html','create.html','login.html'], 'Kuesioner');
    this.appendChild(navbar);

    (async() => {
      this.responseMessage = await Questionnaires.getQuestionnaires();
      // console.log(this.responseMessage);
      const carousel = Carousel.getCarousel(this.responseMessage);
      this.appendChild(carousel);

      if (this.responseMessage.length > 0) {
        const table = TableofQuestionnaires.getTable(this.responseMessage);
        this.appendChild(table); 
      }
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
    carouselContainer.setAttribute('class','row mt-5 text-center text-light');

    const carouselContainerCol = document.createElement('div');
    carouselContainerCol.setAttribute('class','col-sm-10 mt-5 mx-auto')

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
      let button;
      let buttonCol;
      let viewButton;
      let responseButton;
      // let viewButtonCol;

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

      buttonCol = document.createElement('div');
      buttonCol.setAttribute('class','col sm-6');
      button = document.createElement('button');
      // button.setAttribute('id',this.highlightedMessage[i].QuestionnaireId);
      button.setAttribute('type','button');
      button.setAttribute('class','btn btn-danger');
      button.textContent = 'Hapus';
      button.addEventListener("click", async() => {
        await ButtonAction.deleteQuestionnaire(this.highlightedMessage[i].QuestionnaireId, this.highlightedMessage[i].QuestionnaireTitle);
      })
      buttonCol.appendChild(button);
      // block.appendChild(buttonCol);

      //viewButtonCol = document.createElement('div');
      //viewButtonCol.setAttribute('class','col');
      viewButton = document.createElement('button');
      viewButton.setAttribute('type','button');
      viewButton.setAttribute('class','btn btn-success ml-3');
      viewButton.textContent = 'Lihat';
      viewButton.addEventListener('click', async() => {
        await ButtonAction.viewQuestionnaire(this.highlightedMessage[i].QuestionnaireId);
      })
      buttonCol.appendChild(viewButton);

      responseButton = document.createElement('button');
      responseButton.setAttribute('type',' button');
      responseButton.setAttribute('class',' btn btn-success ml-3');
      responseButton.textContent = 'Respon';
      responseButton.addEventListener('click', async() => {
        await ButtonAction.viewResponse(this.highlightedMessage[i].QuestionnaireId);
      })
      buttonCol.appendChild(responseButton);

      block.appendChild(buttonCol);

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

    carouselContainerCol.appendChild(carousel);

    carouselContainer.appendChild(carouselContainerCol);

    this.carousel = carouselContainer;
  }

  static getCarousel(responseMessage) {
    const carouselComp = new Carousel(responseMessage);
    return carouselComp.carousel;
  }
}

class TableofQuestionnaires{
  constructor(responseMessage){
    this.responseMessage = responseMessage;

    const tableContainer = document.createElement('div');
    tableContainer.setAttribute('class','row mt-5');  
    
    const tableContainerCol = document.createElement('div');
    tableContainerCol.setAttribute('class','col-sm-10 mx-auto');

    const table = document.createElement('table');
    table.setAttribute('class','table');

    const tableHead = document.createElement('thead');

    const headerRow = document.createElement('tr');

    const headerCol1 = document.createElement('th');
    headerCol1.setAttribute('scope','col');
    headerCol1.textContent = 'Judul';
    headerRow.appendChild(headerCol1);

    const headerCol2 = document.createElement('th');
    headerCol2.setAttribute('scope','col');
    headerCol2.textContent = 'Deskripsi';
    headerRow.appendChild(headerCol2);

    const headerCol3 = document.createElement('th');
    headerCol3.setAttribute('scope','col');
    headerCol3.textContent = 'Id yang dapat dibagi';
    headerRow.appendChild(headerCol3);

    const headerCol4 = document.createElement('th');
    headerCol4.setAttribute('scope','col');
    headerRow.appendChild(headerCol4);

    const headerCol5 = document.createElement('th');
    headerCol5.setAttribute('scope','col');
    headerRow.appendChild(headerCol5);

    const headerCol6 = document.createElement('th');
    headerCol6.setAttribute('scope','col');
    headerRow.appendChild(headerCol6);

    tableHead.appendChild(headerRow);

    table.appendChild(tableHead);

    const tableBody = document.createElement('tbody');

    for (let i=0; i < this.responseMessage.length; i++) {
      let bodyRow;
      let titleCol;
      let descriptionCol;
      let idCol;
      let buttonCol;
      let deleteButton;
      let viewButtonCol;
      let viewButton;
      let responseButtonCol;
      let responseButton;

      bodyRow = document.createElement('tr');

      titleCol = document.createElement('td');
      titleCol.textContent = this.responseMessage[i].QuestionnaireTitle;
      bodyRow.appendChild(titleCol);

      descriptionCol = document.createElement('td');
      descriptionCol.textContent = this.responseMessage[i].QuestionnaireDescription;
      bodyRow.appendChild(descriptionCol);

      idCol = document.createElement('td');
      idCol.textContent = this.responseMessage[i].QuestionnaireId;
      bodyRow.appendChild(idCol);

      buttonCol = document.createElement('td');
      deleteButton = document.createElement('button');
      // deleteButton.setAttribute('id',this.responseMessage[i].QuestionnaireId);
      deleteButton.setAttribute('type','button');
      deleteButton.setAttribute('class','btn btn-danger');
      deleteButton.textContent = 'Hapus';
      deleteButton.addEventListener("click", async() => {
        await ButtonAction.deleteQuestionnaire(this.responseMessage[i].QuestionnaireId, this.responseMessage[i].QuestionnaireTitle);
      })
      buttonCol.appendChild(deleteButton);
      bodyRow.appendChild(buttonCol);

      viewButtonCol = document.createElement('td');
      viewButton = document.createElement('button');
      viewButton.setAttribute('type','button');
      viewButton.setAttribute('class','btn btn-success');
      viewButton.textContent = 'Lihat';
      viewButton.addEventListener('click', async() => {
        await ButtonAction.viewQuestionnaire(this.responseMessage[i].QuestionnaireId);
      })
      viewButtonCol.appendChild(viewButton);
      bodyRow.appendChild(viewButtonCol);

      responseButtonCol = document.createElement('td');
      responseButton = document.createElement('button');
      responseButton.setAttribute('type','button');
      responseButton.setAttribute('class','btn btn-success');
      responseButton.textContent = 'Respon';
      responseButton.addEventListener('click', async() => {
        await ButtonAction.viewResponse(this.responseMessage[i].QuestionnaireId);
      })
      responseButtonCol.appendChild(responseButton);
      bodyRow.appendChild(responseButtonCol);

      tableBody.appendChild(bodyRow);
    }

    table.appendChild(tableBody);

    tableContainerCol.appendChild(table);

    tableContainer.appendChild(tableContainerCol);

    this.table = tableContainer;
  }

  static getTable(responseMessage) {
    const tableComp = new TableofQuestionnaires(responseMessage);
    return tableComp.table; 
  }
}

class ButtonAction{
  static async deleteQuestionnaire(questionnaireId, questionnaireTitle){
    try {
      const url = config.backURL.concat('private/deleteQuestionnaireById');
      const data = {questionnaire_id: questionnaireId};
      const token = localStorage.getItem('token');
    
      const confirmed = confirm('Apakah Anda yakin ingin menghapus kuesioner dengan judul: '.concat(questionnaireTitle,'?'));
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
      console.log(error)
      alert(error.message);
    } 
  }

  static async viewQuestionnaire(questionnaireId) {
    try {
      localStorage.setItem('viewId',questionnaireId);
      const destinationURL = await URLParser.redirectURL(window.location.href, 'view.html');
      window.location = destinationURL;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  static async viewResponse(questionnaireId) {
    try {
      localStorage.setItem('viewResponseId', questionnaireId);
      const destinationURL = await URLParser.redirectURL(window.location.href, 'response.html');
      window.location = destinationURL;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }
}

customElements.define('index-page', IndexPage);