import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

class SamplePage extends HTMLElement {
  constructor() {
    super();
  
    //bootstrap
    // css and jquery
  
    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');
  
    this.appendChild(link);
  
    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Kalkulator sampel','Langganan','Ganti akun'],['index.html','create.html','sample.html','subscription.html','login.html'], 'Kalkulator sampel');
    this.appendChild(navbar);

    const descriptionCard = DescriptionCard.getCard();
    this.appendChild(descriptionCard);

    const calculatorCard = CalculatorCard.getCard(this);
    this.appendChild(calculatorCard);
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
    title.innerHTML = '<b> Kalkulator Jumlah Sampel Minimum </b>';
    cardBody.appendChild(title);

    const description1 = document.createElement('h6');
    description1.setAttribute('class','card-subtitle mb-2');
    description1.textContent = 'Kalkulator ini digunakan untuk menghitung jumlah sampel minimum yang diperlukan untuk mendapatkan hasil survei yang valid';
    cardBody.appendChild(description1);

    const description2 = document.createElement('h6');
    description2.setAttribute('class','card-subtitle mb-2');
    description2.textContent = '- Ukuran populasi adalah jumlah orang yang direpresentasikan oleh survei yang Anda adakan';
    cardBody.appendChild(description2);

    const description3 = document.createElement('h6');
    description3.setAttribute('class','card-subtitle mb-2');
    description3.textContent = '- Tingkat kepercayaan adalah probabilitas responden / sampel Anda menggambarkan perilaku dari populasi yang menjadi subjek survei';
    cardBody.appendChild(description3);

    const description4 = document.createElement('h6');
    description4.setAttribute('class','card-subtitle mb-2');
    description4 .textContent = '- Error margin adalah persentase respon dari populasi mungkin berbeda / memiliki deviasi dari respon sampel';
    cardBody.appendChild(description4);

    this.card = allCardsContainer;
  }

  static getCard() {
    const descriptionCard = new DescriptionCard();
    return descriptionCard.card;
  }
}

class CalculatorCard {
  constructor(parentDiv){
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
    descInputSpan.setAttribute('name','label-pertanyaan')
    descInputSpan.textContent = 'Ukuran populasi';
    descInputPrepend.appendChild(descInputSpan);

    const descInputForm = document.createElement('input');
    const idDescription = 'population'
    descInputForm.setAttribute('id', idDescription);
    descInputForm.setAttribute('type', 'number');
    descInputForm.setAttribute('min','1');
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('placeholder','10000');
    descInputForm.setAttribute('aria-label','population');
    descInputForm.setAttribute('aria-describedby','description-addon');
    descInputGroup.appendChild(descInputForm);

    // Tingkat kepercayaan
    const confIntervalDiv = DropDownListConfInterval.getDropDownListConfInterval('conf', 'Tingkat kepercayaan:');
    cardBody.appendChild(confIntervalDiv);

    //Error margin
    const marginInputGroup = document.createElement('div');
    marginInputGroup.setAttribute('class','input-group sm-6 mt-3');
    cardBody.appendChild(marginInputGroup);

    const marginInputPrepend = document.createElement('div');
    marginInputPrepend.setAttribute('class','input-group-prepend');
    marginInputGroup.appendChild(marginInputPrepend);

    const marginInputSpan = document.createElement('span');
    marginInputSpan.setAttribute('class','input-group-text');
    marginInputSpan.setAttribute('id','description-addon');
    marginInputSpan.setAttribute('style','width: 10rem;')
    marginInputSpan.setAttribute('name','label-pertanyaan')
    marginInputSpan.textContent = 'Error margin (%)';
    marginInputPrepend.appendChild(marginInputSpan);

    const marginInputForm = document.createElement('input');
    const idMargin = 'margin'
    marginInputForm.setAttribute('id', idMargin);
    marginInputForm.setAttribute('type', 'number');
    marginInputForm.setAttribute('min','1');
    marginInputForm.setAttribute('max','100');
    marginInputForm.setAttribute('class','form-control');
    marginInputForm.setAttribute('placeholder','5');
    marginInputForm.setAttribute('aria-label','margin');
    marginInputForm.setAttribute('aria-describedby','description-addon');
    marginInputGroup.appendChild(marginInputForm);

    //Submit button
    const submitButton = SubmitButton.getButton(parentDiv);
    cardBody.appendChild(submitButton);

    this.card = div;
  }

  static getCard(parentDiv) {
    const calculatorCard = new CalculatorCard(parentDiv);
    return calculatorCard.card;
  }
}

class DropDownListConfInterval {
  constructor(idEl, buttonText) {
    const dropDiv = document.createElement('div');
    dropDiv.setAttribute('class','dropdown mt-3 mx-auto');
    // cardBody.appendChild(questionDiv);
    
    const dropButton = document.createElement('button');
    dropButton.setAttribute('class','btn btn-success dropdown-toggle');
    const idDropButton = `${idEl}-question-button`;
    dropButton.setAttribute('id',idDropButton);
    dropButton.setAttribute('type','button');
    dropButton.setAttribute('data-toggle','dropdown');
    dropButton.setAttribute('aria-haspopup','true');
    dropButton.setAttribute('aria-expanded','false');
    dropButton.textContent = buttonText;
    dropDiv.appendChild(dropButton);

    const dropList = document.createElement('div');
    dropList.setAttribute('class','dropdown-menu');
    dropList.setAttribute('aria-labelledby',idDropButton);
    dropDiv.appendChild(dropList);

    dropButton.addEventListener('click', async() => {
      const idDropDownItem = `${idEl}-question-items`;
      await ButtonAction.deletePrevDropItems(idDropDownItem);
      const listOfConfidenceInterval = ['80%', '90%', '95%', '98%','99%'];
      const dropItems = await ButtonAction.createDropDownListConfInterval(idDropDownItem, listOfConfidenceInterval, dropButton, buttonText);
      for (let i=0 ; i < dropItems.length; i++) {
        dropList.appendChild(dropItems[i]);
      }
    });
    this.dropDown = dropDiv;
  }

  static getDropDownListConfInterval(idEl, buttonText) {
    const dropDownList = new DropDownListConfInterval(idEl, buttonText);
    return dropDownList.dropDown;
  }
}

class SubmitButton {
  constructor(parentDiv) {
    const buttonContainer = document.createElement('div');
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type','button');
    buttonEl.setAttribute('class','btn btn-success mt-3');
    buttonEl.textContent = 'Submit';
    buttonEl.addEventListener('click', async() => {
      await ButtonAction.deletePrevResultCard();
      const resultMessage = await ButtonAction.submitAction();
      if (resultMessage) {
        const resultCard = ResultCard.getCard(resultMessage);
        parentDiv.appendChild(resultCard);
      }
    });
    buttonContainer.appendChild(buttonEl);
    this.button = buttonContainer;
  }

  static getButton(parentDiv) {
    const submitButton = new SubmitButton(parentDiv);
    return submitButton.button;
  }
}

class ResultCard {
  constructor(resultMessage) {
    const responseMessage = resultMessage;
    const allCardsContainer = document.createElement('div');
    allCardsContainer.setAttribute('id', 'result-card')

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class', 'row mx-auto');
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
    title.innerHTML = '<b> Hasil kalkulasi </b>';
    cardBody.appendChild(title);

    if (responseMessage.success) {
      const p = document.createElement('h6');
      p.setAttribute('class','card-subtitle mb-2');
      const result = responseMessage.message;
      p.innerHTML = `Jumlah sampel minimum: <b> ${result} </b>`;
      cardBody.appendChild(p);
    } else {
      const p = document.createElement('h6');
      p.setAttribute('class','card-subtitle mb-2');
      p.innerHTML = `Perhitungan gagal`;
      cardBody.appendChild(p);
    }
    
    this.card = allCardsContainer;
  }

  static getCard(resultMessage) {
    const resultCard = new ResultCard(resultMessage);
    return resultCard.card;
  }
}

class ButtonAction {
  static async createDropDownListConfInterval(idDropDownItem, listOfItems, buttonDiv, buttonText) {
    const listOfDropItems = []
    for (let i = 0; i < listOfItems.length; i++) {
      const dropItem = document.createElement('a');
      dropItem.setAttribute('class','dropdown-item');
      dropItem.setAttribute('name', idDropDownItem)
      dropItem.textContent = listOfItems[i];
      dropItem.addEventListener('click', async() => {
        await ButtonAction.dropDownAction(listOfItems[i], buttonDiv, buttonText, dropItem.textContent)
      });
      listOfDropItems.push(dropItem);
    }
    return listOfDropItems;
  }

  static async deletePrevDropItems(idDropDownItem) {
    const listOfElementToBeDeleted = document.querySelectorAll(`a[name=${idDropDownItem}]`); //returns a static Node List => document update doesn't affect collection elements
    if (typeof listOfElementToBeDeleted[0] !== 'undefined') {
      for (let i=0 ; i<listOfElementToBeDeleted.length; i++) {
        const element = listOfElementToBeDeleted[i];
        element.remove();
      }
    }
  }

  static async dropDownAction(selectedId, buttonEl, baseText, selectedText) {
    const value = selectedId;
    buttonEl.setAttribute('value',value);
    buttonEl.textContent = baseText.concat('  ',selectedText)
  }

  static async confidenceLevelValueMapping(baseValueStr) {
    const mappingDict = {
      '80%': 0.8,
      '90%': 0.9,
      '95%': 0.95,
      '98%': 0.98,
      '99%': 0.99,
    };
    return mappingDict[baseValueStr];
  }

  static async submitAction() {
    try {
      const populationString = document.getElementById('population').value;
      if (!(populationString)) {
        throw new Error('Ada isian yang belum diisi');
      }
      const population = parseInt(populationString, 10);

      const confLevelString = document.getElementById('conf-question-button').value;
      if (!(confLevelString)) {
        throw new Error('Ada isian yang belum diisi');
      }
      const confLevelNum = await ButtonAction.confidenceLevelValueMapping(confLevelString);

      const errorMarginString = document.getElementById('margin').value;
      if (!(errorMarginString)) {
        throw new Error('Ada isian yang belum diisi');
      }
      const errorMargin = parseInt(errorMarginString, 10) / 100;

      const url = config.backURL.concat('private/getMinimumSampleSize');
    
      const token = localStorage.getItem('token');
      if (!(token)) {
        const destinationURL = await URLParser.redirectURL(window.location.href,'login.html')
        window.location = destinationURL;
      }

      const data = {
        population, 
        confidence_level: confLevelNum,
        error_margin: errorMargin,
      };

      const responseMessage = await FetchAPI.postJSON(url, data, token);
      return responseMessage;

    } catch (error) {
      alert(error.message);
    }
  }

  static async deletePrevResultCard() {
    const elementToBeDeleted = document.getElementById('result-card');
    if (elementToBeDeleted) {
      elementToBeDeleted.remove();
    }
  }
}

customElements.define('sample-page', SamplePage)