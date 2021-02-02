import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'
import { NumberUtil } from './util/numberUtil.js'

import { NavBar } from './components/navbar.js'
import { Questionnaire } from './analytics.js'
import { TitleCard } from './view.js'

class ChiTestPage extends HTMLElement {
  constructor() {
    super();

    //bootstrap
    // css and jquery

    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');

    this.appendChild(link);

    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Langganan','Ganti akun'],['index.html','create.html','subscription.html','login.html'], 'Kuesioner');
    this.appendChild(navbar);

    //IIFE
    (async() => {
      [this.questionnaire_id, this.questionnaireInfo, this.questions] = await Questionnaire.getQuestionnaire();

      const titleCard = TitleCard.getCard(this.questionnaireInfo);
      this.appendChild(titleCard);

      const descriptionCard = DescriptionCard.getCard();
      this.appendChild(descriptionCard);

      const chiCard = ChiTestCard.getCard(this.questions, this);
      this.appendChild(chiCard);
    })();
  }
}

class DescriptionCard {
  constructor() {
    const allCardsContainer = document.createElement('div');

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
    title.innerHTML = '<b> Uji Chi-squared </b>';
    cardBody.appendChild(title);

    const description1 = document.createElement('h6');
    description1.setAttribute('class','card-subtitle mb-2');
    description1.textContent = 'Uji Chi-Squared digunakan untuk mengetahui kemungkinan keterhubungan di antara dua variabel (pertanyaan) survei, yaitu variabel independen dan dependen, berdasarkan survei yang sudah dijawab responden.';
    cardBody.appendChild(description1);

    const description2 = document.createElement('h6');
    description2.setAttribute('class','card-subtitle mb-2');
    description2.textContent = '- Variabel independen adalah variabel yang nilainya tidak dipengaruhi oleh variabel lain dalam survei';
    cardBody.appendChild(description2);

    const description3 = document.createElement('h6');
    description3.setAttribute('class','card-subtitle mb-2');
    description3.textContent = '- Variabel dependen adalah variabel yang nilainya diperkirakan dipengaruhi oleh variabel lain dalam survei';
    cardBody.appendChild(description3);

    const descriptionPad = document.createElement('h6');
    descriptionPad.setAttribute('class','card-subtitle mb-2');
    descriptionPad.innerHTML = '</br>'
    cardBody.appendChild(descriptionPad);

    const description4 = document.createElement('h6');
    description4.setAttribute('class','card-subtitle mb-2');
    description4 .textContent = 'Contoh dari penggunaan uji Chi-squared adalah untuk mengetahui hubungan di antara jenis kelamin dengan preferensi makanan kesukaan.';
    cardBody.appendChild(description4);

    const description5 = document.createElement('h6');
    description5.setAttribute('class','card-subtitle mb-2');
    description5.textContent = '- Variabel independen dalam contoh di atas: jenis kelamin';
    cardBody.appendChild(description5);

    const description6 = document.createElement('h6');
    description6.setAttribute('class','card-subtitle mb-2');
    description6.textContent = '- Variabel dependen dalam contoh di atas: makanan kesukaan';
    cardBody.appendChild(description6);

    const descriptionPad2 = document.createElement('h6');
    descriptionPad2.setAttribute('class','card-subtitle mb-2');
    descriptionPad2.innerHTML = '</br>'
    cardBody.appendChild(descriptionPad2);

    const description7 = document.createElement('h6');
    description7.setAttribute('class','card-subtitle mb-2');
    description7.textContent = 'Syarat penggunaan uji Chi-squared adalah sebagai berikut:';
    cardBody.appendChild(description7);

    const description8 = document.createElement('h6');
    description8.setAttribute('class','card-subtitle mb-2');
    description8.textContent = '- Kedua variabel yang dibandingkan harus bernilai kategorikal (jenis kelamin, makanan kesukaan, dll)';
    cardBody.appendChild(description8);

    const description9 = document.createElement('h6');
    description9.setAttribute('class','card-subtitle mb-2');
    description9.textContent = '- Masing-masing kategori harus eksklusif satu dengan yang lainnya';
    cardBody.appendChild(description9);

    const description10 = document.createElement('h6');
    description10.setAttribute('class','card-subtitle mb-2');
    description10.textContent = '- Frekuensi masing-masing kategori adalah 5 (tiap kategori harus sudah dipilih 5 responden)';
    cardBody.appendChild(description10);

    this.card = allCardsContainer;
  }

  static getCard() {
    const descriptionCard = new DescriptionCard();
    return descriptionCard.card;

  }
}

class ChiTestCard {
  constructor(questions, parentDiv) {
    const allCardsContainer = document.createElement('div');

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
    title.innerHTML = '<b> Mulai pengujian </b>';
    cardBody.appendChild(title);

    const indQuestionDiv = DropDownList.getDropDownList('ind', 'Variabel independen yang dipilih:', questions);
    cardBody.appendChild(indQuestionDiv);

    const depQuestionDiv = DropDownList.getDropDownList('dep','Variabel dependen yang dipilih:', questions);
    cardBody.appendChild(depQuestionDiv);

    const confIntervalDiv = DropDownListNonQuestions.getDropDownListNonQuestions('conf', 'Tingkat kepercayaan:');
    cardBody.appendChild(confIntervalDiv);

    const submitButton = SubmitButton.getButton(parentDiv);
    cardBody.appendChild(submitButton);
    
    this.card = allCardsContainer;
  }

  static getCard(questions, parentDiv) {
    const chiCard = new ChiTestCard(questions, parentDiv);
    return chiCard.card;
  }
}

class DropDownList {
  constructor(idEl, buttonText, questions) {
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
      const dropItems = await ButtonAction.createDropDownList(idDropDownItem, questions, dropButton, buttonText);
      for (let i=0 ; i < dropItems.length; i++) {
        dropList.appendChild(dropItems[i]);
      }
    });
    this.dropDown = dropDiv;
  }

  static getDropDownList(idEl, buttonText, questions) {
    const dropDownList = new DropDownList(idEl, buttonText, questions);
    return dropDownList.dropDown;
  }
}

class DropDownListNonQuestions {
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
      const listOfConfidenceInterval = ['80%', '85%', '90%', '95%', '99%'];
      const dropItems = await ButtonAction.createDropDownListNonQuestions(idDropDownItem, listOfConfidenceInterval, dropButton, buttonText);
      for (let i=0 ; i < dropItems.length; i++) {
        dropList.appendChild(dropItems[i]);
      }
    });
    this.dropDown = dropDiv;
  }

  static getDropDownListNonQuestions(idEl, buttonText) {
    const dropDownList = new DropDownListNonQuestions(idEl, buttonText);
    return dropDownList.dropDown;
  }
}

class ResultCard {
  constructor(resultMessage) {
    const { confIntervalNum, responseMessage} = resultMessage;
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
    title.innerHTML = '<b> Hasil pengujian </b>';
    cardBody.appendChild(title);

    const conclusion = document.createElement('h6');
    conclusion.setAttribute('class','card-subtitle mb-2');
    conclusion.innerHTML = `<b> Kesimpulan </b>: ${responseMessage.message}`;
    cardBody.appendChild(conclusion);

    if (responseMessage.success) {
      const p = document.createElement('h6');
      p.setAttribute('class','card-subtitle mb-2');
      const convertedPValue = NumberUtil.roundDecimal(responseMessage.detail.p, 3);
      const pTestValue = NumberUtil.roundDecimal((1-confIntervalNum), 2);
      p.innerHTML = `<b> Nilai p </b> (kedua variabel berhubungan jika p < ${pTestValue}): ${convertedPValue}`;
      cardBody.appendChild(p);

      const validity = document.createElement('h6');
      validity.setAttribute('class','card-subtitle mb-2');
      validity.innerHTML = `<b> Catatan </b>: ${responseMessage.detail.validity}`;
      cardBody.appendChild(validity);

      const chi2 = document.createElement('h6');
      chi2.setAttribute('class','card-subtitle mb-2');
      const convertedChi2Value = NumberUtil.roundDecimal(responseMessage.detail.chi2, 3);
      chi2.innerHTML = `<b> Nilai chi-squared </b>: ${convertedChi2Value}`;
      cardBody.appendChild(chi2);

      const dof = document.createElement('h6');
      dof.setAttribute('class','card-subtitle mb-2');
      dof.innerHTML = `<b> Degree of freedom </b>: ${responseMessage.detail.dof}`;
      cardBody.appendChild(dof);
    }
    
    this.card = allCardsContainer;
  }

  static getCard(resultMessage) {
    const resultCard = new ResultCard(resultMessage);
    return resultCard.card;
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

class ButtonAction {
  static async createDropDownList(idDropDownItem, questions, buttonDiv, buttonText) {
    const listOfDropItems = []
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].type === 'radio') {
        const dropItem = document.createElement('a');
        dropItem.setAttribute('class','dropdown-item');
        dropItem.setAttribute('name', idDropDownItem)
        dropItem.textContent = questions[i].question_description;
        dropItem.addEventListener('click', async() => {
          await ButtonAction.dropDownAction(questions[i].question_id, buttonDiv, buttonText, dropItem.textContent)
        });
        listOfDropItems.push(dropItem);
      }
    }
    return listOfDropItems;
  }

  static async createDropDownListNonQuestions(idDropDownItem, listOfItems, buttonDiv, buttonText) {
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

  static async confidenceIntervalValueMapping(baseValueStr) {
    const mappingDict = {
      '80%': 0.8,
      '85%': 0.85,
      '90%': 0.9,
      '95%': 0.95,
      '99%': 0.99,
    };
    return mappingDict[baseValueStr];
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

  static async deletePrevResultCard() {
    const elementToBeDeleted = document.getElementById('result-card');
    if (elementToBeDeleted) {
      elementToBeDeleted.remove();
    }
  }

  static async submitAction() {
    try {
      const questionnaireId = localStorage.getItem('viewResponseId');
      if (!(questionnaireId)) {
        const destinationURL = await URLParser.redirectURL(window.location.href,'index.html')
        window.location = destinationURL;
      }

      const indQuestionIdString = document.getElementById('ind-question-button').value;
      if (!(indQuestionIdString)) {
        throw new Error('Ada isian yang belum diisi');
      }
      const indQuestionId = parseInt(indQuestionIdString, 10);


      const depQuestionIdString = document.getElementById('dep-question-button').value;
      if (!(depQuestionIdString)) {
        throw new Error('Ada isian yang belum diisi');
      }
      const depQuestionId = parseInt(depQuestionIdString, 10);

      const confIntervalString = document.getElementById('conf-question-button').value;
      if (!(confIntervalString)) {
        throw new Error('Ada isian yang belum diisi');
      }
      const confIntervalNum = await ButtonAction.confidenceIntervalValueMapping(confIntervalString);

      const url = config.backURL.concat('private/getStatistic');
    
      const token = localStorage.getItem('token');
      if (!(token)) {
        const destinationURL = await URLParser.redirectURL(window.location.href,'login.html')
        window.location = destinationURL;
      }

      const data = {
        questionnaire_id: questionnaireId, 
        ind_question_id: indQuestionId,
        dep_question_id: depQuestionId,
        confidence_interval: confIntervalNum,
      };

      const responseMessage = await FetchAPI.postJSON(url, data, token);
      return { confIntervalNum, responseMessage };

    } catch (error) {
      alert(error.message);
    }
  }
}

customElements.define('chitest-page', ChiTestPage)