import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

const arrofQuestionIds = [];
const arrofArrOptionIds = [];
let lastId = -1;

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
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Langganan','Ganti akun'],['index.html','create.html','subscription.html','login.html'], 'Buat');
    this.appendChild(navbar);

    const titleCard = TitleCard.getCard();
    this.appendChild(titleCard);

    const submitButton = SubmitButton.getButton();
    this.appendChild(submitButton);
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
    addButton.setAttribute('id','addquestionbutton-init');
    addButton.textContent = 'Tambah pertanyaan';
    addButton.addEventListener('click', async() => {
      const questionCard = await ButtonAction.addQuestion();
      // console.log(lastId);
      // cardContainerTop.append(questionCard);
      cardContainerTop.insertBefore(questionCard, cardContainer.nextSibling);
      // console.log(arrofQuestionIds);
      await QuestionCard.updateQuestionLabel();
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
    this.questionId = lastId;
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
    descInputSpan.setAttribute('name','label-pertanyaan')
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
      // console.log(DOMtodelete);
      if (DOMtodelete) {
        DOMtodelete.remove();
      }
    })
    typeDropList.appendChild(textboxDropItem);

    //button
    const cardBody2 = document.createElement('div');
    cardBody2.setAttribute('class','card-body text-light');
    card.appendChild(cardBody2);

    const buttonRow = document.createElement('row');
    buttonRow.setAttribute('class','row mt-1 text-center');
    cardBody2.appendChild(buttonRow);

    //hapus button
    const deleteButtonDiv = document.createElement('div');
    deleteButtonDiv.setAttribute('class','col-sm-6');
    buttonRow.appendChild(deleteButtonDiv);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('type','button');
    deleteButton.setAttribute('class','btn btn-danger');
    deleteButton.setAttribute('id','removequestionbutton-'.concat(idValue));
    deleteButton.textContent = 'Hapus pertanyaan';
    deleteButtonDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click',async() => {
      await ButtonAction.deleteQuestion(div, this.questionId);
      delete arrofArrOptionIds[this.questionId];
      // console.log(arrofQuestionIds)
      // console.log(arrofArrOptionIds)
      // delete arrofArrOptionIds[this.questionId];
      // const rootCardEl = document.getElementById('questioncard-'.concat(idValue));
      // rootCardEl.remove();
      // if (arrofQuestionIds.length > 1){
        // const poppedIndex = arrofQuestionIds.pop();
        // delete arrofArrOptionIds[poppedIndex];
        // console.log(arrofQuestionIds);
        // console.log(arrofArrOptionIds);
        // const lastIndex = arrofQuestionIds.length - 1;
        // const lastElementAfterPop = arrofQuestionIds[lastIndex];

      //   await QuestionCard.removeGlobalArray()

      //   const prevDeleteButton = document.getElementById('removequestionbutton-'.concat(lastElementAfterPop.toString()));
      //   prevDeleteButton.removeAttribute('disabled');
      //   prevDeleteButton.style.visibility = 'visible';

      //   const prevAddButton = document.getElementById('addquestionbutton-'.concat(lastElementAfterPop.toString()));
      //   prevAddButton.removeAttribute('disabled');
      //   prevAddButton.style.visibility = 'visible';
      // } else {
      //   const poppedIndex = arrofQuestionIds.pop();
      //   delete arrofArrOptionIds[poppedIndex];
      //   console.log(arrofQuestionIds);
      //   console.log(arrofArrOptionIds);

      //   const initAddButton = document.getElementById('addquestionbutton-init');
      //   initAddButton.removeAttribute('disabled');
      //   initAddButton.style.visibility = 'visible';
      await QuestionCard.updateQuestionLabel();
    })

    // tambah pertanyaan button
    
    const addButtonDiv = document.createElement('div');
    addButtonDiv.setAttribute('class','col-sm-6');
    buttonRow.appendChild(addButtonDiv);
    
    const addButton = document.createElement('button');
    addButton.setAttribute('type','button');
    addButton.setAttribute('class','btn btn-primary');
    addButton.setAttribute('id','addquestionbutton-'.concat(idValue));
    addButton.textContent = 'Tambah pertanyaan';
    addButton.addEventListener('click', async() => {
      //deleteButton.setAttribute('disabled','');
      //deleteButton.style.visibility = 'hidden';
      const questionCard = await ButtonAction.addQuestion(this.questionId);
      //console.log(this.questionId)
      // cardContainerTop.append(questionCard);
      // console.log(div.nextSibling)
      div.parentNode.insertBefore(questionCard, div.nextSibling);
      // console.log(arrofQuestionIds)
      // console.log(arrofArrOptionIds)
      // console.log(arrofQuestionIds);
      await QuestionCard.updateQuestionLabel();
    })

    addButtonDiv.appendChild(addButton);

    this.card = div;

  }

  static getCard(){
    const questionCard = new QuestionCard();
    return questionCard.card;
  }

  static addGlobalArray(currHTMLElementIndex=-1){
    lastId++;
    if (arrofQuestionIds.length === 0){
      arrofQuestionIds.push(lastId);
    } else {
      //const lastIndex = arrofQuestionIds.length - 1;
      // arrofQuestionIds.push(arrofQuestionIds[lastIndex] + 1);
      const globalArrayIndex = arrofQuestionIds.indexOf(currHTMLElementIndex);
      arrofQuestionIds.splice(globalArrayIndex + 1, 0, lastId);
    }
  }
  
  static removeGlobalArray(currHTMLElementIndex){
    if (arrofQuestionIds.length !== 0) {
      const globalArrayIndex = arrofQuestionIds.indexOf(currHTMLElementIndex);
      arrofQuestionIds.splice(globalArrayIndex, 1);
    }
  }

  static async updateQuestionLabel(){
    const selector = "label-pertanyaan";
    const listofElementsToBeUpdated = document.querySelectorAll(`span[name=${selector}]`);
    for (let i=0; i < listofElementsToBeUpdated.length; i++) {
      const element = listofElementsToBeUpdated[i];
      const questionNo = i + 1;
      const stringQuestionNo = questionNo.toString(10);
      element.textContent = `Pertanyaan ${stringQuestionNo}`;
    }
  }
}

class OptionButton{
  static async updateOptionLabel(questionId) {
    const questionIdString = questionId.toString(10);
    const selector = `label-opsi-${questionIdString}`;
    const listofElementsToBeUpdated = document.querySelectorAll(`span[name=${selector}]`);
    for (let i=0; i < listofElementsToBeUpdated.length; i++) {
      const element = listofElementsToBeUpdated[i];
      const optionNo = i + 1;
      const stringOptionNo = optionNo.toString(10);
      element.textContent = `Opsi ${stringOptionNo}`;
    }
  }

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
      await OptionButton.updateOptionLabel(questionId);
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

  static async createDynamicFlowDropDownList(idDropDownItem, questionId, buttonDiv, arrofQuestionIds){
    const listOfItems = [];
    const indexOfCurrentQuestionId = arrofQuestionIds.indexOf(questionId);
    for (let i=indexOfCurrentQuestionId + 1; i<arrofQuestionIds.length; i++) {
      const questionNo = i + 1;
      const dropItem = document.createElement('a');
      dropItem.setAttribute('name', idDropDownItem);
      dropItem.setAttribute('class','dropdown-item');
      dropItem.textContent = questionNo.toString(10);
      dropItem.addEventListener('click', async() => {
        await ButtonAction.dropDownAction(buttonDiv, dropItem, 'Jika dipilih opsi ini, pergi ke pertanyaan nomor?');
      })
      listOfItems.push(dropItem);
    }
    return listOfItems;
  }

  static async deletePrevDropItems(name) {
    const listOfElementToBeDeleted = document.querySelectorAll(`a[name=${name}`); //returns a static Node List => document update doesn't affect collection elements
    if (typeof listOfElementToBeDeleted[0] !== 'undefined') {
      for (let i=0 ; i<listOfElementToBeDeleted.length; i++) {
        const element = listOfElementToBeDeleted[i];
        element.remove();
      }
    }
  }

  build(){
    // description input
    this.addArray();

    const divGroup = document.createElement('div');

    const descInputGroup = document.createElement('div');
    descInputGroup.setAttribute('class','input-group sm-6 mt-3');
    divGroup.appendChild(descInputGroup);

    const descInputPrepend = document.createElement('div');
    descInputPrepend.setAttribute('class','input-group-prepend');
    descInputGroup.appendChild(descInputPrepend);

    const descInputSpan = document.createElement('span');
    descInputSpan.setAttribute('class','input-group-text');
    descInputSpan.setAttribute('id','description-addon');
    descInputSpan.setAttribute('style','width: 10rem;');
    const questionIdString = this.questionId.toString(10);
    descInputSpan.setAttribute('name',`label-opsi-${questionIdString}`);
    descInputSpan.textContent = 'Opsi';
    descInputPrepend.appendChild(descInputSpan);

    const questionId = this.questionId;
    const lastIndex = this.arrOpts.length - 1;
    const optionId = this.arrOpts[lastIndex];
    arrofArrOptionIds[questionId] = this.arrOpts;
    // console.log(arrofArrOptionIds);
    const idInput = 'option-'.concat(questionId.toString(),'-',optionId.toString());

    const descInputForm = document.createElement('input');
    descInputForm.setAttribute('type','text');
    descInputForm.setAttribute('id',idInput);
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('placeholder','Masukkan opsi');
    descInputForm.setAttribute('aria-label',idInput);
    descInputForm.setAttribute('aria-describedby','description-addon');
    descInputGroup.appendChild(descInputForm);

    // Flow logic definition by user using dynamic drop down list
    const flowDiv = document.createElement('div');
    flowDiv.setAttribute('class','dropdown mt-3 mx-auto');
    divGroup.appendChild(flowDiv);
    
    const flowButton = document.createElement('button');
    flowButton.setAttribute('class','btn btn-success dropdown-toggle');
    const idFlow = 'mapping-'.concat(questionId.toString(),'-',optionId.toString());
    flowButton.setAttribute('id',idFlow);
    flowButton.setAttribute('type','button');
    const defaultValue = 0;
    flowButton.setAttribute('value',defaultValue.toString(10));
    flowButton.setAttribute('data-toggle','dropdown');
    flowButton.setAttribute('aria-haspopup','true');
    flowButton.setAttribute('aria-expanded','false');
    flowButton.textContent = 'Jika opsi ini dipilih, pergi ke pertanyaan nomor?'
    flowDiv.appendChild(flowButton);

    const flowDropList = document.createElement('div');
    flowDropList.setAttribute('class','dropdown-menu');
    flowDropList.setAttribute('aria-labelledby',idFlow);
    flowDiv.appendChild(flowDropList);

    flowButton.addEventListener('click', async () =>{
      const idDropDownItem = 'mappingitem-'.concat(questionId.toString(),'-',optionId.toString());
      await Option.deletePrevDropItems(idDropDownItem);
      const flowDropItems = await Option.createDynamicFlowDropDownList(idDropDownItem, questionId, flowButton, arrofQuestionIds);
      for (let i=0; i<flowDropItems.length; i++) {
        flowDropList.appendChild(flowDropItems[i]);
      }
    });

    // score p
    const scoreLabel = document.createElement('p');
    scoreLabel.setAttribute('class','text-left');
    scoreLabel.textContent = 'Masukkan score untuk opsi';
    divGroup.appendChild(scoreLabel);

    //score slider
    const scoreDivContainer = document.createElement('div');
    scoreDivContainer.setAttribute('class','d-flex justify-content-center my-4');
    divGroup.appendChild(scoreDivContainer);

    const scoreSliderDiv = document.createElement('div');
    scoreSliderDiv.setAttribute('class','w-75');
    scoreDivContainer.appendChild(scoreSliderDiv);

    const scoreId = 'score-'.concat(questionId.toString(),'-',optionId.toString());
    const scoreLabelId = 'scorelabel-'.concat(questionId.toString(),'-',optionId.toString());
    const scoreInputSlider = document.createElement('input');
    scoreInputSlider.setAttribute('type','range');
    scoreInputSlider.setAttribute('class','custom-range');
    scoreInputSlider.setAttribute('min','-100');
    scoreInputSlider.setAttribute('max','100');
    scoreInputSlider.setAttribute('id',scoreId);
    scoreInputSlider.oninput = async() => {
      const sliderLabel = document.getElementById(scoreLabelId);
      sliderLabel.textContent = 'Score: '.concat(scoreInputSlider.value);
    }
    scoreSliderDiv.appendChild(scoreInputSlider);

    const scoreSliderSpan = document.createElement('span');
    scoreSliderSpan.setAttribute('class','w-100 text-center font-weight-bold text-light ml-2 valueSpan2');
    scoreSliderSpan.setAttribute('id',scoreLabelId);
    divGroup.appendChild(scoreSliderSpan);

    return divGroup;
  }

}

class SubmitButton{
  constructor(){
    const div = document.createElement('div');
    div.setAttribute('class','row w-100');
    
    const divCol = document.createElement('col');
    divCol.setAttribute('class','col sm-6 mx-auto text-center');
    div.appendChild(divCol);

    const button = document.createElement('button');
    divCol.appendChild(button);
    button.setAttribute('class','btn btn-success mt-3');
    button.setAttribute('type','button');
    // submitButton.setAttribute('id','submit');
    button.textContent = 'Submit';
    button.addEventListener('click', async() => {
      await ButtonAction.submitAction();
    })

    this.button = div;
  }
  static getButton(){
    const buttonComp = new SubmitButton();
    return buttonComp.button;
  }
}

class ButtonAction{
  static async addQuestion(currHTMLElementIndex=-1){
    QuestionCard.addGlobalArray(currHTMLElementIndex);
    //buttonEl.setAttribute('disabled','');
    //buttonEl.style.visibility = 'hidden';
    return QuestionCard.getCard();
  }

  static async deleteQuestion(rootDiv, currHTMLElementIndex){
    rootDiv.remove();
    QuestionCard.removeGlobalArray(currHTMLElementIndex);
  }

  static async dropDownAction(buttonEl, dropDownEl, baseText) {
    const value = dropDownEl.textContent;
    buttonEl.setAttribute('value',value);
    buttonEl.textContent = baseText.concat('  ',value)
  }

  static async submitAction() {
    try {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      let url = config.backURL.concat('private/questionnaire');
      const questionnaire_title = document.getElementById('questionnaire_title').value;
      const questionnaire_desc = document.getElementById('questionnaire_desc').value;

      if(!(questionnaire_title) || !(questionnaire_desc)) {
        throw new Error('Ada isian yang belum diisi');
      }

      const data = {
        email: email, 
        questionnaire_title: questionnaire_title, 
        questionnaire_desc: questionnaire_desc
      };

      const questionnaireResponse = await FetchAPI.postJSON(url, data, token);

      if (!(questionnaireResponse.success)){
        throw new Error(questionnaireResponse.message);
      }

      const questionnaireObj = {};
      const questionnaire_id = questionnaireResponse.message;
      questionnaireObj.questionnaire_id = questionnaire_id;

      const questions = [];

      for (let i=0; i<arrofQuestionIds.length; i++) {
        const questionObj = {};
        const questionId = arrofQuestionIds[i];
        const questionIdStr = questionId.toString();
        const question_description = document.getElementById('question_description-'.concat(questionIdStr)).value;
        let typeString = document.getElementById('type-'.concat(questionIdStr)).value;
        let isRequiredString = document.getElementById('isrequired-'.concat(questionIdStr)).value;

        if (!(question_description) || !(isRequiredString) || !(typeString)) {
          throw new Error('Ada isian yang belum diisi');
        }

        const opA = ButtonAction.typeStringMapper(typeString);
        const opB = ButtonAction.isRequiredStringMapper(isRequiredString);

        const [type, isrequired] = await Promise.all([opA, opB]);

        questionObj.question_description = question_description;
        questionObj.type = type;
        questionObj.isrequired = isrequired;

        let options;
        // console.log(arrofQuestionIds);
        // console.log(arrofArrOptionIds);
        if ((type === 'checkbox') || (type === 'radio')) {
          const optionList = arrofArrOptionIds[questionId];
          options = [];

          for (let j=0; j<optionList.length; j++) {
            const optionObj = {};
            const optionId = j;
            const optionIdStr = optionId.toString();
            const description = document.getElementById('option-'.concat(questionIdStr,'-',optionIdStr)).value;
            const score = document.getElementById('score-'.concat(questionIdStr,'-',optionIdStr)).value;
            if (!(score) || !(description)) {
              throw new Error('Ada isian yang belum diisi');
            }
            optionObj.description = description;
            optionObj.score = parseInt(score);
            options.push(optionObj);
          }
          questionObj.options = options;
        }
        questions.push(questionObj);
      }

      questionnaireObj.questions = questions;

      // console.log(questionnaireObj);

      url = config.backURL.concat('private/questions');
      const questionResponse = await FetchAPI.postJSON(url, questionnaireObj, token);

      if (!(questionResponse.success)) {
        throw new Error(questionResponse.message);
      }

      url = config.backURL.concat('private/optionstoquestionsmap');
      const mappings = await ButtonAction.createMapping();
      const mappingRequestObj = { questionnaire_id, mappings };
      const mappingResponse = await FetchAPI.postJSON(url, mappingRequestObj, token);

      if (!(mappingResponse.success)) {
        throw new Error(mappingResponse.message);
      }

      alert(questionResponse.message);
      
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  static async createMapping() {
    try {
      const mappings = [];

      for (let i=0; i<arrofQuestionIds.length; i++) {
        const questionId = i;
        const questionIndex = arrofQuestionIds[i];
        const questionIndexStr = questionIndex.toString(10);
        let typeString = document.getElementById('type-'.concat(questionIndexStr)).value;
        const type = await ButtonAction.typeStringMapper(typeString);

        if ((type === 'checkbox') || (type === 'radio')) {
          const optionList = arrofArrOptionIds[questionIndex];

          for (let j=0; j<optionList.length; j++){
            const optionId = j;
            const optionIdStr = optionId.toString(10);
            const mappingId = `mapping-${questionIndexStr}-${optionIdStr}`;
            const dropFlowValue = document.getElementById(mappingId).value;
            const dropFlowValueInt = parseInt(dropFlowValue, 10);
            if (dropFlowValueInt !== 0) {
              const mappingObj = {};
              const questionIdDest = dropFlowValueInt - 1;
              mappingObj.question_id = questionId;
              mappingObj.option_id = optionId;
              mappingObj.question_id_dest = questionIdDest;
              mappings.push(mappingObj);
            }
          }   
        }        
      }
      return mappings;

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  static async typeStringMapper(typeString){
    if (typeString === 'Radio') {
      return 'radio';
    } else if (typeString === 'Checkbox') {
      return 'checkbox';
    } else if (typeString === 'Textbox') {
      return 'text';
    }
  }

  static async isRequiredStringMapper(isRequiredString){
    if (isRequiredString === 'Yes') {
      return true;
    } else if (isRequiredString === 'No') {
      return false;
    }
  }
}

customElements.define('create-page',CreatePage);