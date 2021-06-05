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
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Kalkulator sampel','Langganan','Ganti akun'],['index.html','create.html','sample.html','subscription.html','login.html'], 'Kuesioner');
    this.appendChild(navbar);

    (async() => {
      this.responseMessage = await Responses.getResponses();
      // console.log(this.responseMessage);
      if (typeof this.responseMessage.scores === 'undefined') {
        alert('Belum ada respon');
      }
      
      if (this.responseMessage.scores.length > 0) {
        const analyticsButton = AnalyticsButton.getButton();
        this.appendChild(analyticsButton);

        const table = TableofResponses.getTable(this.responseMessage);
        this.appendChild(table); 
      }
    })();
  }
}

class AnalyticsButton{
  constructor(){
    const div = document.createElement('div');

    const paddingTop = document.createElement('div');
    paddingTop.setAttribute('class', 'row mt-5');
    div.appendChild(paddingTop);

    const paddingTop2 = document.createElement('div');
    paddingTop2.setAttribute('class', 'row mt-5');
    div.appendChild(paddingTop2);

    const buttonRow = document.createElement('div');
    buttonRow.setAttribute('class','row mt-3 w-52 ml-5');
    div.appendChild(buttonRow);

    const paddingLeft = document.createElement('div');
    paddingLeft.setAttribute('class', 'col-sm-1');
    buttonRow.appendChild(paddingLeft)

    // Lihat Grafik button
    const buttonColumn = document.createElement('div');
    buttonColumn.setAttribute('class', 'col-sm-2');

    const button = document.createElement('button');
    button.setAttribute('class','btn btn-success w-100');
    button.setAttribute('type','button');
    button.setAttribute('id','submit');
    button.textContent = 'Lihat Grafik';
    button.addEventListener('click', async() => {
      await ButtonAction.viewPage('analytics.html');
    });

    buttonColumn.appendChild(button);
    buttonRow.appendChild(buttonColumn);

    // Uji Chi Squared button
    const buttonColumnChi = document.createElement('div');
    buttonColumnChi.setAttribute('class', 'col-sm-2');

    const buttonChi = document.createElement('button');
    buttonChi.setAttribute('class', 'btn btn-success w-100');
    buttonChi.setAttribute('type','button');
    buttonChi.setAttribute('id', 'submit-chi');
    buttonChi.textContent = 'Uji Chi-squared';
    buttonChi.addEventListener('click', async() => {
      await ButtonAction.viewPage('chitest.html');
    })

    buttonColumnChi.appendChild(buttonChi);
    buttonRow.appendChild(buttonColumnChi);

    //Uji Cronbach Alpha button
    const buttonColumnCronbach = document.createElement('div');
    buttonColumnCronbach.setAttribute('class', 'col-sm-2');

    const buttonCronbach = document.createElement('button');
    buttonCronbach.setAttribute('class', 'btn btn-success w-100');
    buttonCronbach.setAttribute('type','button');
    buttonCronbach.setAttribute('id', 'submit-cronbach');
    buttonCronbach.textContent = 'Uji Cronbach Alpha';
    buttonCronbach.addEventListener('click', async() => {
      await ButtonAction.viewPage('cronbach.html');
    })

    buttonColumnCronbach.appendChild(buttonCronbach);
    buttonRow.appendChild(buttonColumnCronbach);

    // Download spreadsheet dropdown
    const downloadColumn = document.createElement('div');
    downloadColumn.setAttribute('class', 'col-sm-2')

    const downloadEl = document.createElement('div');
    downloadEl.setAttribute('class','dropdown');
    
    const downloadButton = document.createElement('button');
    downloadButton.setAttribute('class','btn btn-success dropdown-toggle');
    downloadButton.setAttribute('type','button');
    const idDownload = 'download';
    downloadButton.setAttribute('id',idDownload);
    downloadButton.setAttribute('data-toggle','dropdown');
    downloadButton.setAttribute('aria-haspopup','true');
    downloadButton.setAttribute('aria-expanded','false');
    downloadButton.textContent = 'Unduh sebagai spreadsheet'
    downloadEl.appendChild(downloadButton);

    const downloadDropList = document.createElement('div');
    downloadDropList.setAttribute('class','dropdown-menu');
    downloadDropList.setAttribute('aria-labelledby',idDownload);
    downloadEl.appendChild(downloadDropList);

    const csvDropItem = document.createElement('a');
    csvDropItem.setAttribute('class','dropdown-item');
    csvDropItem.textContent = 'CSV';
    csvDropItem.addEventListener('click', async() => {
      await ButtonAction.downloadSpreadsheet('csv');
    })
    downloadDropList.appendChild(csvDropItem);

    const excelDropItem = document.createElement('a');
    excelDropItem.setAttribute('class','dropdown-item');
    excelDropItem.textContent = 'Excel';
    excelDropItem.addEventListener('click', async() => {
      await ButtonAction.downloadSpreadsheet('xlsx');
    })
    downloadDropList.appendChild(excelDropItem);
    
    downloadColumn.appendChild(downloadEl);
    buttonRow.appendChild(downloadColumn);

    this.button = div;
  }

  static getButton(){
    const analyticsButton = new AnalyticsButton();
    return analyticsButton.button; 
  }
}

class TableofResponses{
  constructor(responseMessage){
    this.responseMessage = responseMessage;

    const div = document.createElement('div');

    const tableContainer = document.createElement('div');
    tableContainer.setAttribute('class','row mt-3');

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
      // const destinationURL = await URLParser.redirectURL(window.location.href, 'detail.html');
      // window.location = destinationURL;
      await ButtonAction.viewPage('detail.html');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  static async viewPage(pageName){
    try {
      const destinationURL = await URLParser.redirectURL(window.location.href, pageName);
      window.location = destinationURL;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  static async downloadSpreadsheet(format){
    try {
      const url = config.backURL.concat('private/getSpreadsheet');
      const token = localStorage.getItem('token');
      const questionnaire_id = localStorage.getItem('viewResponseId');
      const data = {questionnaire_id, format};

      const filename = `response-spreadsheet.${format}`
      const mimeType = {
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        csv: 'text/csv',
      }
      await FetchAPI.postAndDownload(url, data, token, filename, mimeType[format]);
      
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }
}

customElements.define('response-page',ResponsePage);