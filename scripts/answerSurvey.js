import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

let questionsArr;
let answerRequest
let responseMappingsArr;
let questionNo = 0;
let arrOfSkippedElements = { active: [], inactive: [] };
let arrofArrAllMappings = [];

class Questionnaire{
  static async getQuestionnaire(){
    try {
      const url1 = config.backURL.concat('public/getQuestionnaireById');
      const url2 = config.backURL.concat('private/getQuestions');
      const url3 = config.backURL.concat('public/getOptionsToQuestionsMap');
      const answerObj = JSON.parse(localStorage.getItem('answer_object'));
  
      if (!(answerObj)) {
        throw new Error('Invalid info')
      }
      
      answerRequest = answerObj;
      const data = {questionnaire_id: answerObj.questionnaire_id};

      const opA = FetchAPI.postJSON(url1, data);
      const opB = FetchAPI.postJSON(url2, data);
      const opC = FetchAPI.postJSON(url3, data);
  
      const [responseQuestionnaire, responseQuestions, responseMappings] = await Promise.all([opA, opB, opC]);

      if (responseQuestionnaire.message === null) {
        throw new Error('Kuesioner tidak ditemukan');
      }

      if ((responseQuestionnaire.success) && (responseQuestions.success) && (responseMappings.success)) {
        questionsArr = responseQuestions.message.questions;
        responseMappingsArr = responseMappings.message.mappings;
        return [responseQuestionnaire.message, responseQuestions.message.questions, answerObj];
      } else {
        throw new Error('Failed in fetching data');
      }
  
    } catch (error) {
      console.log(error);
      alert(error.message);
      const destinationURL = await URLParser.redirectURL(window.location.href,'findSurvey.html')
      window.location = destinationURL;
    }
  }
}

class AnswerPage extends HTMLElement{
  constructor(){
    super();

    //bootstrap
    // css
    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');
    this.appendChild(link);

    // IIFE
    (async() => {
      [this.questionnaireInfo, this.questions, this.answerObj] = await Questionnaire.getQuestionnaire();
      // console.log(this.questionnaireInfo);
      // console.log(this.questions);
      // console.log(this.answerObj);
      // console.log(this.mappings);
      const titleCardComp = TitleCard.getCard(this.questionnaireInfo, this.answerObj);
      this.appendChild(titleCardComp);

      // const questionCardComp = QuestionCard.getCard(this.questions, this.mappings);
      // this.appendChild(questionCardComp);

      const questionCardComp = QuestionCard.createQuestionCard(this, this.questions);

      // const submitButtonComp = SubmitButton.getButton();
      // this.appendChild(submitButtonComp);
    })();
  }
}

class TitleCard {
  constructor(questionnaireInfo, answerObj){
    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class','row mt-3 mx-auto');

    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class','row mt-3 mx-auto');

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

    const title = document.createElement('h5');
    title.setAttribute('class','card-title');
    const titleBoldStyle = document.createElement('b');
    title.appendChild(titleBoldStyle);
    titleBoldStyle.textContent =  questionnaireInfo.QuestionnaireTitle;
    cardBody.appendChild(title);

    const description = document.createElement('h6');
    description.setAttribute('class','card-subtitle mb-2 text-muted');
    const descriptionBoldStyle = document.createElement('b');
    description.appendChild(descriptionBoldStyle);
    descriptionBoldStyle.textContent = questionnaireInfo.QuestionnaireDescription;
    cardBody.appendChild(description);

    const name = document.createElement('h5');
    name.setAttribute('class','card-title');
    const nameBoldStyle = document.createElement('b');
    name.appendChild(nameBoldStyle);
    nameBoldStyle.textContent = answerObj.answerer_name;
    cardBody.appendChild(name);

    const email = document.createElement('h6');
    email.setAttribute('class','card-subtitle mb-2 text-muted');
    const emailBoldStyle = document.createElement('b');
    email.appendChild(emailBoldStyle);
    emailBoldStyle.textContent = answerObj.answerer_email;
    cardBody.appendChild(email);

    const company = document.createElement('h6');
    company.setAttribute('class','card-subtitle mb-2 text-muted');
    const companyBoldStyle = document.createElement('b');
    company.appendChild(companyBoldStyle);
    companyBoldStyle.textContent = answerObj.answerer_company;
    cardBody.appendChild(company);

    this.card = cardContainerTop;
  }

  static getCard(questionnaireInfo, answerObj){
    const titleCard = new TitleCard(questionnaireInfo, answerObj);
    return titleCard.card;
  }
}

class QuestionCard{
  static handleArrOfSkippedElements() {
    const activeEl = arrOfSkippedElements.active.pop();
    if (activeEl) {
      arrOfSkippedElements.inactive.push(activeEl);
    }
  }

  static createQuestionCard(parentDiv, questions) {
    console.log(questionNo)
    const maxQuestionNo = questions.length - 1;
    if (questionNo >  maxQuestionNo) { // stop condition 1
      const submitButtonComp = SubmitButton.getButton();
      parentDiv.appendChild(submitButtonComp);
    } else {
      console.log(arrOfSkippedElements);
      console.log(arrofArrAllMappings);
      const found = arrOfSkippedElements.inactive.find(element => element === questionNo);
      if (found) {
        QuestionCard.handleArrOfSkippedElements();     
        questionNo++;
        QuestionCard.createQuestionCard(parentDiv, questions); 
      } else {
        QuestionCard.handleArrOfSkippedElements();
        const div = document.createElement('div');
        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class','row mt-5 mx-auto');
        const questionNoString = questionNo.toString(10);
        cardContainer.setAttribute('id',`element-${questionNoString}`);

        const card = document.createElement('div');
        card.setAttribute('class','card mx-auto bg-dark');
        card.setAttribute('style','width: 50rem;')
    
        cardContainer.appendChild(card);

        const cardBody = document.createElement('div');
        cardBody.setAttribute('class','card-body text-light');
    
        card.appendChild(cardBody);

        const title = document.createElement('h6');
        title.setAttribute('class','card-title');
        const titleBoldStyle = document.createElement('b');
        title.appendChild(titleBoldStyle);
        titleBoldStyle.textContent = questions[questionNo].question_description;
        cardBody.appendChild(title);

        const required = document.createElement('h6');
        required.setAttribute('class','card-subtitle mb-2 text-muted');
        if (questions[questionNo].isrequired) {
          required.innerHTML = ''.concat('<b>','Required','</b>');
        } else {
          required.innerHTML = ''.concat('<b>','Not Required','</b>');
        }
        cardBody.appendChild(required);

        const idQuestion = questions[questionNo].question_id;

        if (questions[questionNo].type === 'text') {
      //input text 
          const textInputRow = document.createElement('div');
          textInputRow.setAttribute('class','row mt-3');

          const textInputColumn = document.createElement('div');
          textInputColumn.setAttribute('class','col w-100 mx-auto');

          const textInputFormGroup = document.createElement('div');
          textInputFormGroup.setAttribute('class','form-group w-100');

          const textInputArea = document.createElement('input');
          textInputArea.setAttribute('type','text');
          textInputArea.setAttribute('class','form-control');
          textInputArea.setAttribute('id','answer-'.concat(idQuestion));
          textInputArea.setAttribute('required','');

          textInputFormGroup.appendChild(textInputArea);
          textInputColumn.appendChild(textInputFormGroup);
          textInputRow.appendChild(textInputColumn);
          cardBody.appendChild(textInputRow);
        }

   
        parentDiv.appendChild(cardContainer);

        if((questions[questionNo].type === 'checkbox') || (questions[questionNo].type === 'radio')) {
          if (questions[questionNo].options.length > 0) { // stop condition 2
            let optionsComponent;
            let isChosenIdMappingExist;
            [ optionsComponent, isChosenIdMappingExist ] = QuestionCard.createOptions(parentDiv, questions, idQuestion);
            console.log(isChosenIdMappingExist);
            cardBody.appendChild(optionsComponent);
            if (!(isChosenIdMappingExist.status)) {
              questionNo++;
              QuestionCard.createQuestionCard(parentDiv, questions);
            }
          }
        } else {
          questionNo++;
          QuestionCard.createQuestionCard(parentDiv, questions); // recursion
        }

    // for (let i=0; i < questions.length; i++) {

    //   const cardContainer = document.createElement('div');
    //   cardContainer.setAttribute('class','row mt-5 mx-auto');

    //   const card = document.createElement('div');
    //   card.setAttribute('class','card mx-auto bg-dark');
    //   card.setAttribute('style','width: 50rem;')
    
    //   cardContainer.appendChild(card);

    //   const cardBody = document.createElement('div');
    //   cardBody.setAttribute('class','card-body text-light');
    
    //   card.appendChild(cardBody);

    //   const title = document.createElement('h6');
    //   title.setAttribute('class','card-title');
    //   const titleBoldStyle = document.createElement('b');
    //   title.appendChild(titleBoldStyle);
    //   titleBoldStyle.textContent = questions[i].question_description;
    //   cardBody.appendChild(title);

    //   const required = document.createElement('h6');
    //   required.setAttribute('class','card-subtitle mb-2 text-muted');
    //   if (questions[i].isrequired) {
    //     required.innerHTML = ''.concat('<b>','Required','</b>');
    //   } else {
    //     required.innerHTML = ''.concat('<b>','Not Required','</b>');
    //   }
    //   cardBody.appendChild(required);

    //   const idQuestion = questions[i].question_id;

    //   if (questions[i].type === 'text') {
    //     //input text 
    //     const textInputRow = document.createElement('div');
    //     textInputRow.setAttribute('class','row mt-3');

    //     const textInputColumn = document.createElement('div');
    //     textInputColumn.setAttribute('class','col w-100 mx-auto');

    //     const textInputFormGroup = document.createElement('div');
    //     textInputFormGroup.setAttribute('class','form-group w-100');

    //     const textInputArea = document.createElement('input');
    //     textInputArea.setAttribute('type','text');
    //     textInputArea.setAttribute('class','form-control');
    //     textInputArea.setAttribute('id','answer-'.concat(idQuestion));
    //     textInputArea.setAttribute('required','');

    //     textInputFormGroup.appendChild(textInputArea);
    //     textInputColumn.appendChild(textInputFormGroup);
    //     textInputRow.appendChild(textInputColumn);
    //     cardBody.appendChild(textInputRow);
    //   }

    //   let optionsComponent;

    //   if((questions[i].type === 'checkbox') || (questions[i].type === 'radio')) {
    //     if (questions[i].options.length > 0) {
    //       optionsComponent = QuestionCard.createOptions(questions[i].options, idQuestion, questions[i].type);
    //       cardBody.appendChild(optionsComponent);
    //     }
    //   }

    //   div.appendChild(cardContainer);
    // }
    }
  }
}

  // static getCard(questions){
  //   const questionCard = new QuestionCard(questions);
  //   return questionCard.card;
  // }
  static async deleteAllNextQuestions(currentQuestionId) {
    for (let i = currentQuestionId + 1; i < questionsArr.length; i++) {
      const elementIndexString = i.toString(10);
      const selector = `element-${elementIndexString}`;
      const elementToBeDeleted = document.getElementById(selector);
      if (elementToBeDeleted) {
        elementToBeDeleted.remove();
      }
    }
    const submitButton = document.getElementById('element-submit');
    if (submitButton) {
      submitButton.remove();
    }
  }

  static async deleteAllNextMappings(currentQuestionId) {
    for (let i = currentQuestionId + 1 ; i < arrofArrAllMappings.length; i++) {
      if (typeof arrofArrAllMappings[i] !== 'undefined') {
        for (let j = 0 ; j < arrofArrAllMappings[i].length; j++) {
          for (let k = 0; k< arrOfSkippedElements.inactive.length; k++ ) {
            if (arrOfSkippedElements.inactive[k] === arrofArrAllMappings[i][j]) {
              console.log(`Elemen berikut di-delete ${k}`);
              arrOfSkippedElements.inactive.splice(k, 1);
            }
          }
        }
      }
    }
  }

  static findQuestionIdMapping(questionId, optionId) {
    const mappingObject = responseMappingsArr.find(element => 
      (element.question_id === questionId) && (element.option_id === optionId));
    if (mappingObject) {
      return mappingObject.question_id_dest;
    }
    return mappingObject
  }

  static async handleNextElementMappingElement(parentDiv, questions, questionId, idMapping, isConditional) {
      await QuestionCard.deleteAllNextQuestions(questionId)
      console.log(questionNo)
      questionNo = idMapping;
      if (isConditional) {
        QuestionCard.deleteAllNextMappings(questionId);
        let indexAtSkippedAr = arrOfSkippedElements.inactive.indexOf(idMapping);
        arrOfSkippedElements.active.push(idMapping);
        while (indexAtSkippedAr !== -1) {
          arrOfSkippedElements.inactive.splice(indexAtSkippedAr, 1); 
          indexAtSkippedAr = arrOfSkippedElements.inactive.indexOf(idMapping);
        }
      }
      QuestionCard.createQuestionCard(parentDiv, questions);
    // } else {
    //   const maxQuestionNo = questions.length - 1;
    //   if (questionNo === maxQuestionNo) {
    //     const submitButtonComp = SubmitButton.getButton();
    //     parentDiv.appendChild(submitButtonComp);
    //   } else {
    //     questionNo++;
    //     QuestionCard.createQuestionCard(parentDiv, questions);
    //   }
    // }
  }

  static createOptions(parentDiv, questions, questionId) {
    //type: radio / checkbox
    const optionsList = questions[questionNo].options;
    const type = questions[questionNo].type
    const div = document.createElement('div');
    let isChosenIdMappingExist = {status: false};
    const singleQuestionMapping = [];
    for (let i = 0; i < optionsList.length; i++){
      const option = document.createElement('div');
      option.setAttribute('class','form-check');
      const optionInput = document.createElement('input');
      optionInput.setAttribute('class','form-check-input');
      optionInput.setAttribute('type', type);
      if (type === 'radio') {
        optionInput.setAttribute('name','optionGroup-'.concat(questionId.toString()))
        const idMapping = QuestionCard.findQuestionIdMapping(questionId, optionsList[i].option_id);
        if (idMapping) {
          isChosenIdMappingExist.status = true;
          arrOfSkippedElements.inactive.push(idMapping);
          singleQuestionMapping.push(idMapping);
          console.log(arrofArrAllMappings);
          optionInput.addEventListener('click', async() => {
            await QuestionCard.handleNextElementMappingElement(parentDiv, questions, questionId, idMapping, true);
          })
        } else {
          optionInput.addEventListener('click', async() => {
            isChosenIdMappingExist.status = false;
            const nextId = questionId + 1
            await QuestionCard.handleNextElementMappingElement(parentDiv, questions, questionId, nextId, false);
          })
        }
      } 
      optionInput.setAttribute('value','');
      // optionInput.setAttribute('disabled','');
      optionInput.setAttribute('id','option-'.concat(questionId.toString(),'-',optionsList[i].option_id.toString()));

      option.appendChild(optionInput);

      const optionLabel = document.createElement('label');
      optionLabel.setAttribute('class','form-check-label');
      optionLabel.setAttribute('for','option-'.concat(questionId.toString(),'-',optionsList[i].option_id.toString()));
      optionLabel.textContent = optionsList[i].description;

      option.appendChild(optionLabel);

      div.appendChild(option);
    }
    arrofArrAllMappings[questionId] = singleQuestionMapping;
    return [div, isChosenIdMappingExist];
  }
}

class SubmitButton{
  constructor(){
    //Submit button
    const div = document.createElement('div');
    div.setAttribute('id','element-submit');
    const submitRow = document.createElement('div');
    submitRow.setAttribute('class','row mt-3');

    const submitColumn = document.createElement('div');
    submitColumn.setAttribute('class', 'col w-100 mx-auto text-center');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('class','btn btn-success w-50 mx-auto');
    submitButton.setAttribute('type','button');
    submitButton.setAttribute('id','submit');
    submitButton.textContent = 'Kirim';
    submitButton.addEventListener('click', async() => {
      await SubmitButton.submitAnswer();
    });

    submitColumn.appendChild(submitButton);
    submitRow.appendChild(submitColumn);
    div.appendChild(submitRow);

    this.button = div;
  }

  static getButton(){
    const submitButtonComp = new SubmitButton();
    return submitButtonComp.button;
  }

  static async submitAnswer(){
    try {
      const answers = [];
      for (let i=0 ; i < questionsArr.length; i++) {
        const idQuestion = questionsArr[i].question_id;
        const answerObj = { question_id: idQuestion, answer: []};
        const idQuestionString= idQuestion.toString(10);
        const idElParent = `element-${idQuestionString}`;
        const isNodeExist = document.getElementById(idElParent);
        if (isNodeExist) {
          if (questionsArr[i].type === 'text') {
            const idEl = 'answer-'.concat(idQuestion.toString());
            const answerValue = document.getElementById(idEl).value;
          
            if ((questionsArr[i].isrequired) && !(answerValue)){
              throw new Error('Ada isian yang belum diisi');
            } 

            answerObj.answer.push(answerValue);
          } else if ((questionsArr[i].type === 'checkbox') || (questionsArr[i].type === 'radio')) {
            for (let j=0; j < questionsArr[i].options.length; j++) {
              const idOption = questionsArr[i].options[j].option_id;
              const idEl = 'option-'.concat(idQuestion.toString(),'-',idOption.toString());
              const isChecked = document.getElementById(idEl).checked;

              if (isChecked) {
                answerObj.answer.push(idOption);
              }
            }

            if ((questionsArr[i].isrequired) && (typeof answerObj.answer[0] === 'undefined')) {
              throw new Error('Ada isian yang belum diisi');
            }
          }

          answers.push(answerObj);
        }
      }
      answerRequest.answers = answers;
      

      const url = config.backURL.concat('public/answer');
      const answerResponse = await FetchAPI.postJSON(url, answerRequest);

      if (!(answerResponse.success)) {
        throw new Error(answerResponse.message);
      }

      alert(answerResponse.message);

    } catch (error) {
      console.log(error);
      if (error.message === 'SequelizeUniqueConstraintError') {
        alert('Anda hanya bisa mengirimkan jawaban satu kali dengan satu email');
      } else {
        alert(error.message);
      }
    }
  }
}

customElements.define('answer-page',AnswerPage);