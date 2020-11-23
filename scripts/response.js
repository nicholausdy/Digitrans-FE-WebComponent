import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

class Responses{
  static async getResponses(){
    try {
      const url = config.backURL.concat('private/getScores');
      const token = localStorage.getItem('token');
      const questionnaire_id = localStorage.getItem('viewResponseId');
      
      if (!(token)){
        throw new Error('Invalid login')
      }
  
      const data = {questionnaire_id: questionnaire_id};
      const response = await FetchAPI.postJSON(url, data, token);
  
      if (response.success) {
        return response.message;
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

class ResponsePage extends HTMLElement {
  constructor(){
    super();

    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');

    this.appendChild(link);

    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Ganti akun'],['index.html','create.html','login.html'], 'Kuesioner');
    this.appendChild(navbar);

    (async() => {
      this.responseMessage = await Responses.getResponses();
      // console.log(this.responseMessage);
      if (typeof this.responseMessage.scores === 'undefined') {
        alert('Belum ada respon');
      }
      
      if (this.responseMessage.scores.length > 0) {
        const table = TableofResponses.getTable(this.responseMessage);
        this.appendChild(table); 
      }
    })();
  }
}

class TableofResponses{
  constructor(responseMessage){
    this.responseMessage = responseMessage;

    const div = document.createElement('div');

    const tableContainerPad = document.createElement('div');
    tableContainerPad.setAttribute('class','row mt-5');
    div.appendChild(tableContainerPad);

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
    headerCol1.textContent = 'Email penjawab';
    headerRow.appendChild(headerCol1);

    const headerCol2 = document.createElement('th');
    headerCol2.setAttribute('scope','col');
    headerCol2.textContent = 'Skor total';
    headerRow.appendChild(headerCol2);

    const headerCol3 = document.createElement('th');
    headerCol3.setAttribute('scope','col');
    headerRow.appendChild(headerCol3);

    tableHead.appendChild(headerRow);

    table.appendChild(tableHead);

    const tableBody = document.createElement('tbody');

    for (let i=0; i < this.responseMessage.scores.length; i++) {
      let bodyRow;
      let emailCol;
      let scoreCol;
      let buttonCol;
      let detailButton;

      bodyRow = document.createElement('tr');

      emailCol = document.createElement('td');
      emailCol.textContent = this.responseMessage.scores[i].answerer_email;
      bodyRow.appendChild(emailCol);

      scoreCol = document.createElement('td');
      scoreCol.textContent = this.responseMessage.scores[i].total_score;
      bodyRow.appendChild(scoreCol);

      buttonCol = document.createElement('td');
      detailButton = document.createElement('button');
      detailButton.setAttribute('type','button');
      detailButton.setAttribute('class','btn btn-success');
      detailButton.textContent = 'Detail';
      detailButton.addEventListener('click', async() => {
        await ButtonAction.viewDetail(this.responseMessage.scores[i].answerer_email);
      })
      buttonCol.appendChild(detailButton);
      bodyRow.appendChild(buttonCol);

      tableBody.appendChild(bodyRow);
    }

    table.appendChild(tableBody);

    tableContainerCol.appendChild(table);

    tableContainer.appendChild(tableContainerCol);

    div.appendChild(tableContainer);

    this.table = div;
  }

  static getTable(responseMessage){
    const tableComp = new TableofResponses(responseMessage);
    return tableComp.table;
  }
}

class ButtonAction{
  static async viewDetail(answererEmail) {
    try {
      localStorage.setItem('answerer_email',answererEmail);
      const destinationURL = await URLParser.redirectURL(window.location.href, 'detail.html');
      window.location = destinationURL;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }
}

customElements.define('response-page',ResponsePage);