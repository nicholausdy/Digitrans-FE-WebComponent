import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

const arrofQuestionIds = [];
const arrofArrOptionIds = [];
let lastId = -1;

class QuestionnaireDetail {
  static async getQuestionnaire() {
    try {
      const url1 = config.backURL.concat('public/getQuestionnaireById');
      const url2 = config.backURL.concat('private/getQuestions');
      const url3 = config.backURL.concat('public/getOptionsToQuestionsMap');
      const questionnaireId = localStorage.getItem('updateId');
      const token = localStorage.getItem('token');

      if (!(token)) {
        throw new Error('Invalid login')
      }

      const data = {questionnaire_id: questionnaireId};
      const opA = FetchAPI.postJSON(url1, data);
      const opB = FetchAPI.postJSON(url2, data);
      const opC = FetchAPI.postJSON(url3, data);

      const [responseQuestionnaire, responseQuestions, responseMappings] = await Promise.all([opA, opB, opC]);
      
      if ((responseQuestionnaire.success) && (responseQuestions.success) && (responseMappings.success)) {
        return [responseQuestionnaire.message, responseQuestions.message.questions, responseMappings.message.mappings];
      } else {
        throw new Error('Failed in fetching data');
      }

    } catch (error) {
      console.log(error);
      alert(error.message);
      const destinationURL = await URLParser.redirectURL(window.location.href,'login.html')
      window.location = destinationURL;
    }
  }
}

class UpdatePage extends HTMLElement {
  constructor(){
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

    (async() => {
      [this.questionnaireInfo, this.questions, this.mappings] = await QuestionnaireDetail.getQuestionnaire();
      
      const titleCard = TitleCard.getCard(this.questionnaireInfo);
      this.appendChild(titleCard);

      if (typeof this.questions !== 'undefined') {
        await Init.initGlobals(this.questions);
        await Init.initQuestionCards(this, this.questions, this.mappings);
      }

      const submitButton = SubmitButton.getButton();
      this.appendChild(submitButton);
    })();
  }
}

class Init {
  static async changeLastId(questionsList){
    lastId = questionsList.length - 1;
  }

  static async initArrOfQuestionIds(questionsList){
    for (let i=0; i < questionsList.length; i++) {
      arrofQuestionIds.push(questionsList[i].question_id);
    }
  }

  static async initArrofArrOptionIds(questionsList) {
    for (let i=0; i < questionsList.length; i++) {
      if ((questionsList[i].type === 'radio') || (questionsList[i].type === 'checkbox')) {
        const questionId = questionsList[i].question_id;
        const optionList = questionsList[i].options;
        const listofListEl = [];
        for (let j=0; j < optionList.length; j++) {
          listofListEl.push(optionList[j].option_id);
        }
        arrofArrOptionIds[questionId] = listofListEl;
      }
    }
  }

  static async initGlobals(questionsList) {
    await Promise.all([Init.changeLastId(questionsList), 
      Init.initArrOfQuestionIds(questionsList), 
      Init.initArrofArrOptionIds(questionsList)]);
  }

  static async initQuestionCards(parentDiv, questionsList, mappings){
    for (let i=0; i<questionsList.length; i++) {
      const questionCard = QuestionCard.getCard(questionsList[i], mappings);
      parentDiv.appendChild(questionCard);
    }
  }
}

class TitleCard{
  constructor(questionnaireInfo){
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
    titleInputForm.value = questionnaireInfo.QuestionnaireTitle;

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
    descInputForm.value = questionnaireInfo.QuestionnaireDescription;
    descInputGroup.appendChild(descInputForm);

    // button
    const addButton = document.createElement('button');
    addButton.setAttribute('type','button');
    addButton.setAttribute('class','btn btn-primary mt-3');
    addButton.setAttribute('id','addquestionbutton-init');
    addButton.textContent = 'Tambah pertanyaan';
    addButton.addEventListener('click', async() => {
      const questionCard = await ButtonAction.addQuestion();
      console.log(lastId);
      // cardContainerTop.append(questionCard);
      cardContainerTop.insertBefore(questionCard, cardContainer.nextSibling);
      console.log(arrofQuestionIds);
      await QuestionCard.updateQuestionLabel();
    })
    cardBody.appendChild(addButton);

    this.card = cardContainerTop;
  }

  static getCard(questionnaireInfo){
    const titleCard = new TitleCard(questionnaireInfo);
    return titleCard.card;
  }
}

class QuestionCard {
  constructor(questionInfo={}, mappings =[]){
    this.questionId = lastId;
    if (typeof questionInfo.question_id !== 'undefined') {
      this.questionId = questionInfo.question_id;
    }
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
    const idLabel = this.questionId + 1;
    const idLabelString = idLabel.toString(10);
    descInputSpan.textContent = 'Pertanyaan'.concat(' ', idLabelString);
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
    if (typeof questionInfo.question_description !== 'undefined') {
      descInputForm.value = questionInfo.question_description;
    }
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
    if (typeof questionInfo.isrequired !== 'undefined') {
      const isRequiredString = QuestionCard.isRequiredBooleanMapper(questionInfo.isrequired);
      isRequiredButton.value = isRequiredString;
      isRequiredButton.textContent = 'Required?'.concat(' ',isRequiredString);
    }
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
    if (typeof questionInfo.type !== 'undefined') {
      const typeString = QuestionCard.typeStringMapper(questionInfo.type);
      typeButton.value = typeString;
      typeButton.textContent = 'Type?'.concat(' ', typeString);
    }
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
      optionButton = await OptionButton.create(parseInt(idValue), 'radio');
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
      optionButton = await OptionButton.create(parseInt(idValue), 'checkbox');
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

    (async() => {
      if (typeof questionInfo.type !== 'undefined') {
        if ((questionInfo.type === 'radio') || (questionInfo.type === 'checkbox')) {
          optionButton = await OptionButton.create(parseInt(idValue), questionInfo.type, questionInfo.options, mappings);
          cardBody.appendChild(optionButton);
        }
      }
    })();
    
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
      console.log(arrofQuestionIds)
      console.log(arrofArrOptionIds)
      console.log(lastId);
      await QuestionCard.updateQuestionLabel();
    })

    addButtonDiv.appendChild(addButton);

    this.card = div;

  }

  static getCard(questionInfo={}, mappings=[]){
    const questionCard = new QuestionCard(questionInfo, mappings);
    return questionCard.card;
  }

  static isRequiredBooleanMapper(isRequiredBoolean) {
    if (isRequiredBoolean) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

  static typeStringMapper(typeStringResp) {
    const mapping = {
      'radio' : 'Radio',
      'checkbox': 'Checkbox',
      'text': 'Textbox',
    }
    return mapping[typeStringResp];
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

  static async create(questionId, type, optionsList=[], mappings=[]){
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
    if (typeof optionsList[0] !== 'undefined') {
      for (let i=0; i< optionsList.length; i++) {
        const optionDiv = optionObj.build(type, optionsList[i], mappings);
        div.appendChild(optionDiv);
      }
    }

    addOption.addEventListener('click', async() => {
      const optionDiv = optionObj.build(type);
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
        await ButtonAction.dropDownAction(buttonDiv, dropItem, 'Jika opsi ini dipilih, pergi ke pertanyaan nomor?');
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

  build(type, optionInfo = {}, mappings = []){
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
    if (typeof optionInfo.option_id !== 'undefined') {
      const idLabel = optionInfo.option_id + 1;
      const idLabelString = idLabel.toString(10);
      descInputSpan.textContent = 'Opsi'.concat(' ',idLabelString);
    }
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
    if (typeof optionInfo.description !== 'undefined') {
      descInputForm.value = optionInfo.description;
    }

    if (type === 'radio') {
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
      if (typeof mappings[0] !== 'undefined') {
        const mappingEl = mappings.find(element => (element.question_id === questionId) && (element.option_id === optionId))
        if (mappingEl) {
          const questionIdLabelDest = mappingEl.question_id_dest + 1;
          const questionIdLabelDestString = questionIdLabelDest.toString(10);
          flowButton.value = questionIdLabelDestString;
          flowButton.textContent = 'Jika opsi ini dipilih, pergi ke pertanyaan nomor?'.concat(' ', questionIdLabelDestString);
        }
      }
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
    }

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

    if (typeof optionInfo.score !== 'undefined') {
      scoreInputSlider.value = optionInfo.score;
      scoreSliderSpan.textContent = 'Score: '.concat(optionInfo.score);
    }

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

  static async deleteQuestionnaire(questionnaireId) {
    const url = config.backURL.concat('private/deleteQuestionnaireById');
    const data = {questionnaire_id: questionnaireId};
    const token = localStorage.getItem('token');
    const response = await FetchAPI.deleteJSON(url, data, token);
    if (!(response.success)){
      throw new Error(response.message);
    }
    return response;
  }

  static async isAnswerExist(questionnaireId) {
    try {
      const url = config.backURL.concat('private/getScores');
      const data = {questionnaire_id: questionnaireId};
      const token = localStorage.getItem('token');
      const response = await FetchAPI.postJSON(url, data, token);
      console.log(response);
      if (typeof response.message.scores === 'undefined') {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteMappings(questionnaireId) {
    const url = config.backURL.concat('private/deleteOptionsToQuestionsMap');
    const data = {questionnaire_id: questionnaireId};
    const token = localStorage.getItem('token');
    const response = await FetchAPI.deleteJSON(url, data, token);
    if (!(response.success)){
      throw new Error(response.message);
    }
  }

  static async createQuestionnaireAndQuestions(questions){
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
      questionnaire_desc: questionnaire_desc,
    };

    const questionnaireResponse = await FetchAPI.postJSON(url, data, token);

    if (!(questionnaireResponse.success)){
      throw new Error(questionnaireResponse.message);
    }

    const questionnaireObjNew = {};
    const questionnaire_id = questionnaireResponse.message;
    questionnaireObjNew.questionnaire_id = questionnaire_id;
    questionnaireObjNew.questions = questions;

    url = config.backURL.concat('private/questions');
    const questionResponse = await FetchAPI.postJSON(url, questionnaireObjNew, token);
    if (!(questionResponse.success)) {
      throw new Error(questionResponse.message)
    }
    return questionnaire_id;
  }

  static async submitAction() {
    try {
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

      console.log(questions);

      const initQuestionnaireId = localStorage.getItem('updateId');
      const isAnswerExist = await ButtonAction.isAnswerExist(initQuestionnaireId);
      console.log(isAnswerExist);
      if (isAnswerExist){
        const createResult = await ButtonAction.createQuestionnaireAndQuestions(questions);
        await ButtonAction.sendMappings(createResult);
        alert('Terdeteksi sudah ada jawaban kuesioner. Hasil update telah disimpan sebagai file kuesioner baru');
      } else {
        const [deleteResult, createResult] = await Promise.all([ButtonAction.deleteQuestionnaire(initQuestionnaireId), 
          ButtonAction.createQuestionnaireAndQuestions(questions)]);
        await Promise.all([ButtonAction.deleteMappings(initQuestionnaireId),
          ButtonAction.sendMappings(createResult)]);
        alert('Belum ada jawaban kuesioner. Hasil update disimpan sebagai file kuesioner dengan nomor id baru');
      }

      // url = config.backURL.concat('private/questions');
      // const questionResponse = await FetchAPI.postJSON(url, questionnaireObj, token);

      // if (!(questionResponse.success)) {
      //   await ButtonAction.deleteQuestionnaire(questionnaire_id);
      //   throw new Error(questionResponse.message);
      // }

      // url = config.backURL.concat('private/optionstoquestionsmap');
      // const mappings = await ButtonAction.createMapping();
      // const mappingRequestObj = { questionnaire_id, mappings };
      // const mappingResponse = await FetchAPI.postJSON(url, mappingRequestObj, token);

      // if (!(mappingResponse.success)) {
      //   await ButtonAction.deleteQuestionnaire(questionnaire_id);
      //   throw new Error(mappingResponse.message);
      // }

      // alert(questionResponse.message);
      
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

        if (type === 'radio') {
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

  static async sendMappings(questionnaire_id) {
    const url = config.backURL.concat('private/optionstoquestionsmap');
    const token = localStorage.getItem('token');
    const mappings = await ButtonAction.createMapping();
    const mappingRequestObj = { questionnaire_id, mappings };
    const mappingResponse = await FetchAPI.postJSON(url, mappingRequestObj, token);

    if (!(mappingResponse.success)) {
      throw new Error(mappingResponse.message);
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


customElements.define('update-page', UpdatePage);

