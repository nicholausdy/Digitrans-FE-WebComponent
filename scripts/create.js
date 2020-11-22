import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

const arrofQuestionIds = [];

class CreatePage extends HTMLElement{
  constructor(){
    super();

    //bootstrap
    // css and jquery

    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');

    this.appendChild(link);

    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Ganti akun'],['index.html','create.html','login.html'], 'Buat');
    this.appendChild(navbar);

    const titleCard = TitleCard.getCard();
    this.appendChild(titleCard);
  }
}

class TitleCard{
  constructor(){
    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class','row mt-5 mx-auto');

    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class','row mt-5 mx-auto');

    cardContainerTop.append(cardContainer);

    //const cardContainerCol= document.createElement('div');
    //cardContainerCol.setAttribute('class','col sm-8');

    // cardContainer.appendChild(cardContainerCol);

    const card = document.createElement('div');
    card.setAttribute('class','card mx-auto bg-dark');
    card.setAttribute('style','width: 50rem;')
    
    cardContainer.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body text-light');
    
    card.appendChild(cardBody);

    // title input
    const titleInputGroup = document.createElement('div');
    titleInputGroup.setAttribute('class','input-group sm-6');
    cardBody.appendChild(titleInputGroup);

    const titleInputPrepend = document.createElement('div');
    titleInputPrepend.setAttribute('class','input-group-prepend');
    titleInputGroup.appendChild(titleInputPrepend);

    const titleInputSpan = document.createElement('span');
    titleInputSpan.setAttribute('class','input-group-text');
    titleInputSpan.setAttribute('id','title-addon');
    titleInputSpan.setAttribute('style','width: 10rem;');
    titleInputSpan.textContent = 'Judul kuesioner';
    titleInputPrepend.appendChild(titleInputSpan);

    const titleInputForm = document.createElement('input');
    titleInputForm.setAttribute('type','text');
    titleInputForm.setAttribute('id','questionnaire_title');
    titleInputForm.setAttribute('class','form-control');
    titleInputForm.setAttribute('placeholder','Masukkan judul');
    titleInputForm.setAttribute('aria-label','questionnaire_title');
    titleInputForm.setAttribute('aria-describedby','title-addon');

    titleInputGroup.appendChild(titleInputForm);

    // description input
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
    descInputSpan.textContent = 'Deskripsi kuesioner';
    descInputPrepend.appendChild(descInputSpan);

    const descInputForm = document.createElement('textarea');
    descInputForm.setAttribute('id','questionnaire_desc');
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('placeholder','Masukkan deskripsi');
    descInputForm.setAttribute('aria-label','questionnaire_desc');
    descInputForm.setAttribute('aria-describedby','description-addon');
    descInputGroup.appendChild(descInputForm);

    // button
    const addButton = document.createElement('button');
    addButton.setAttribute('type','button');
    addButton.setAttribute('class','btn btn-primary mt-3');
    addButton.textContent = 'Tambah pertanyaan';
    addButton.addEventListener('click', async() => {
      const questionCard = await ButtonAction.addQuestion(addButton);
      cardContainerTop.append(questionCard);
      console.log(arrofQuestionIds);
    })
    cardBody.appendChild(addButton);

    this.card = cardContainerTop;
  }

  static getCard(){
    const titleCard = new TitleCard();
    return titleCard.card;
  }
}

class QuestionCard {
  constructor(){
    this.questionId = arrofQuestionIds[arrofQuestionIds.length - 1];
    const idValue = this.questionId.toString();

    const div = document.createElement('div');
    div.setAttribute('class','mx-auto');
    div.setAttribute('id','questioncard-'.concat(idValue));

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class','row mt-3 mx-auto');

    div.appendChild(cardContainerTop);

    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class','row mt-5 mx-auto');

    cardContainerTop.append(cardContainer);

    //const cardContainerCol= document.createElement('div');
    //cardContainerCol.setAttribute('class','col sm-8');

    // cardContainer.appendChild(cardContainerCol);

    const card = document.createElement('div');
    card.setAttribute('class','card mx-auto bg-dark');
    card.setAttribute('style','width: 50rem;')
    
    cardContainer.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body text-light');
    
    card.appendChild(cardBody);

    // description input
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
    descInputSpan.textContent = 'Pertanyaan';
    descInputPrepend.appendChild(descInputSpan);

    const descInputForm = document.createElement('textarea');
    // const lastIndex = this.questionId.length - 1;
    // const idValue = this.questionId.toString();
    const idDescription = 'question_description-'.concat(idValue);
    descInputForm.setAttribute('id', idDescription);
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('placeholder','Masukkan pertanyaan');
    descInputForm.setAttribute('aria-label','questionnaire_desc');
    descInputForm.setAttribute('aria-describedby','description-addon');
    descInputGroup.appendChild(descInputForm);

    //Required drop down
    const isRequiredDiv = document.createElement('div');
    isRequiredDiv.setAttribute('class','dropdown mt-3');
    cardBody.appendChild(isRequiredDiv);
    
    const isRequiredButton = document.createElement('button');
    isRequiredButton.setAttribute('class','btn btn-success dropdown-toggle');
    const idIsRequired = 'isrequired-'.concat(idValue);
    isRequiredButton.setAttribute('id',idIsRequired);
    isRequiredButton.setAttribute('type','button');
    isRequiredButton.setAttribute('data-toggle','dropdown');
    isRequiredButton.setAttribute('aria-haspopup','true');
    isRequiredButton.setAttribute('aria-expanded','false');
    isRequiredButton.textContent = 'Required?'
    isRequiredDiv.appendChild(isRequiredButton);

    const isRequiredDropList = document.createElement('div');
    isRequiredDropList.setAttribute('class','dropdown-menu');
    isRequiredDropList.setAttribute('aria-labelledby',idIsRequired);
    isRequiredDiv.appendChild(isRequiredDropList);

    const yesDropItem = document.createElement('a');
    yesDropItem.setAttribute('class','dropdown-item');
    yesDropItem.textContent = 'Yes';
    yesDropItem.addEventListener('click', async() => {
      await ButtonAction.dropDownAction(isRequiredButton, yesDropItem, 'Required?');
    })
    isRequiredDropList.appendChild(yesDropItem);

    const noDropItem = document.createElement('a');
    noDropItem.setAttribute('class','dropdown-item');
    noDropItem.textContent = 'No';
    noDropItem.addEventListener('click', async() => {
      await ButtonAction.dropDownAction(isRequiredButton, noDropItem, 'Required?');
    })
    isRequiredDropList.appendChild(noDropItem);

    //Required type
    const typeDiv = document.createElement('div');
    typeDiv.setAttribute('class','dropdown mt-3');
    cardBody.appendChild(typeDiv);
    
    const typeButton = document.createElement('button');
    typeButton.setAttribute('class','btn btn-success dropdown-toggle');
    const idType = 'type-'.concat(idValue);
    typeButton.setAttribute('id',idType);
    typeButton.setAttribute('type','button');
    typeButton.setAttribute('data-toggle','dropdown');
    typeButton.setAttribute('aria-haspopup','true');
    typeButton.setAttribute('aria-expanded','false');
    typeButton.textContent = 'Type?'
    typeDiv.appendChild(typeButton);

    const typeDropList = document.createElement('div');
    typeDropList.setAttribute('class','dropdown-menu');
    typeDropList.setAttribute('aria-labelledby',idType);
    typeDiv.appendChild(typeDropList);

    let optionButton;

    const radioDropItem = document.createElement('a');
    radioDropItem.setAttribute('class','dropdown-item');
    radioDropItem.textContent = 'Radio';
    radioDropItem.addEventListener('click', async() => {
      await ButtonAction.dropDownAction(typeButton, radioDropItem, 'Type?');
      const DOMtodelete = document.getElementById('optiondiv-'.concat(idValue));
      if (DOMtodelete) {
        DOMtodelete.remove();
      }
      optionButton = await OptionButton.create(parseInt(idValue));
      cardBody.appendChild(optionButton);
    })
    typeDropList.appendChild(radioDropItem);

    const checkboxDropItem = document.createElement('a');
    checkboxDropItem.setAttribute('class','dropdown-item');
    checkboxDropItem.textContent = 'Checkbox';
    checkboxDropItem.addEventListener('click', async() => {
      await ButtonAction.dropDownAction(typeButton, checkboxDropItem, 'Type?');
      const DOMtodelete = document.getElementById('optiondiv-'.concat(idValue));
      if (DOMtodelete) {
        DOMtodelete.remove();
      }
      optionButton = await OptionButton.create(parseInt(idValue));
      cardBody.appendChild(optionButton)
    })
    typeDropList.appendChild(checkboxDropItem);

    const textboxDropItem = document.createElement('a');
    textboxDropItem.setAttribute('class','dropdown-item');
    textboxDropItem.textContent = 'Textbox';
    textboxDropItem.addEventListener('click', async() => {
      await ButtonAction.dropDownAction(typeButton, textboxDropItem, 'Type?');
      const DOMtodelete = document.getElementById('optiondiv-'.concat(idValue));
      console.log(DOMtodelete);
      if (DOMtodelete) {
        DOMtodelete.remove();
      }
    })
    typeDropList.appendChild(textboxDropItem);

    // tambah pertanyaan button
    const cardBody2 = document.createElement('div');
    cardBody2.setAttribute('class','card-body text-light');
    card.appendChild(cardBody2);

    const addButton = document.createElement('button');
    addButton.setAttribute('type','button');
    addButton.setAttribute('class','btn btn-primary');
    addButton.textContent = 'Tambah pertanyaan';
    addButton.addEventListener('click', async() => {
      const questionCard = await ButtonAction.addQuestion(addButton);
      cardContainerTop.append(questionCard);
      console.log(arrofQuestionIds);
    })
    cardBody2.appendChild(addButton);

    this.card = div;

  }

  static getCard(){
    const questionCard = new QuestionCard();
    return questionCard.card;
  }

  static addGlobalArray(){
    if (arrofQuestionIds.length === 0){
      arrofQuestionIds.push(0);
    } else {
      const lastIndex = arrofQuestionIds.length - 1;
      arrofQuestionIds.push(arrofQuestionIds[lastIndex] + 1);
    }
  }
  
  static removeGlobalArray(){
    if (arrofQuestionIds.length !== 0) {
      arrofQuestionIds.pop();
    }
  }
}

class OptionButton{
  static async create(questionId){
    const div = document.createElement('div');
    div.setAttribute('id','optiondiv-'.concat(questionId.toString()));
    const addOption = document.createElement('button');
    div.appendChild(addOption);
    addOption.setAttribute('id','optionbutton-'.concat(questionId.toString()));
    addOption.setAttribute('class','btn btn-success mt-3');
    addOption.setAttribute('type','button');
    // submitButton.setAttribute('id','submit');
    addOption.textContent = 'Tambah opsi';

    const optionObj = new Option(questionId);
    addOption.addEventListener('click', async() => {
      const optionDiv = optionObj.build();
      div.appendChild(optionDiv);
    });
    return div;
  }
}

class Option{
  constructor(questionId){
    this.questionId = questionId;
    this.arrOpts = [];
  }

  addArray(){
    if (this.arrOpts.length === 0){
      this.arrOpts.push(0);
    } else {
      const lastIndex = this.arrOpts.length - 1;
      this.arrOpts.push(this.arrOpts[lastIndex] + 1);
    }
  }

  removeArray(){
    if (this.arrOpts.length !== 0) {
      this.arrOpts.pop();
    }
  }

  build(){
    // description input
    this.addArray();

    const descInputGroup = document.createElement('div');
    descInputGroup.setAttribute('class','input-group sm-6 mt-3');

    const descInputPrepend = document.createElement('div');
    descInputPrepend.setAttribute('class','input-group-prepend');
    descInputGroup.appendChild(descInputPrepend);

    const descInputSpan = document.createElement('span');
    descInputSpan.setAttribute('class','input-group-text');
    descInputSpan.setAttribute('id','description-addon');
    descInputSpan.setAttribute('style','width: 10rem;')
    descInputSpan.textContent = 'Opsi';
    descInputPrepend.appendChild(descInputSpan);

    const questionId = this.questionId;
    const lastIndex = this.arrOpts.length - 1;
    const optionId = this.arrOpts[lastIndex];
    const idInput = 'option-'.concat(questionId.toString(),'-',optionId.toString());

    const descInputForm = document.createElement('input');
    descInputForm.setAttribute('type','text');
    descInputForm.setAttribute('id',idInput);
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('placeholder','Masukkan opsi');
    descInputForm.setAttribute('aria-label',idInput);
    descInputForm.setAttribute('aria-describedby','description-addon');
    descInputGroup.appendChild(descInputForm);

    return descInputGroup;
  }

}

class ButtonAction{
  static async addQuestion(buttonEl){
    QuestionCard.addGlobalArray();
    buttonEl.setAttribute('disabled','');
    buttonEl.style.visibility = 'hidden';
    return QuestionCard.getCard();
  }

  static async dropDownAction(buttonEl, dropDownEl, baseText) {
    const value = dropDownEl.textContent;
    buttonEl.setAttribute('value',value);
    buttonEl.textContent = baseText.concat('  ',value)
  }
}

customElements.define('create-page',CreatePage);