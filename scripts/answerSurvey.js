import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

let questionsArr;
let answerRequest;

class Questionnaire{
  static async getQuestionnaire(){
    try {
      const url1 = config.backURL.concat('public/getQuestionnaireById');
      const url2 = config.backURL.concat('private/getQuestions');
      const answerObj = JSON.parse(localStorage.getItem('answer_object'));
  
      if (!(answerObj)) {
        throw new Error('Invalid info')
      }
      
      answerRequest = answerObj;
      const data = {questionnaire_id: answerObj.questionnaire_id};

      const opA = FetchAPI.postJSON(url1, data);
      const opB = FetchAPI.postJSON(url2, data);
  
      const [responseQuestionnaire, responseQuestions] = await Promise.all([opA, opB]);

      if (responseQuestionnaire.message === null) {
        throw new Error('Kuesioner tidak ditemukan');
      }

      if ((responseQuestionnaire.success) && (responseQuestions.success)) {
        questionsArr = responseQuestions.message.questions;
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
      const titleCardComp = TitleCard.getCard(this.questionnaireInfo, this.answerObj);
      this.appendChild(titleCardComp);

      const questionCardComp = QuestionCard.getCard(this.questions);
      this.appendChild(questionCardComp);

      const submitButtonComp = SubmitButton.getButton();
      this.appendChild(submitButtonComp);
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
  constructor(questions) {
    const div = document.createElement('div');
    for (let i=0; i < questions.length; i++) {

      const cardContainer = document.createElement('div');
      cardContainer.setAttribute('class','row mt-5 mx-auto');

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
      titleBoldStyle.textContent = questions[i].question_description;
      cardBody.appendChild(title);

      const required = document.createElement('h6');
      required.setAttribute('class','card-subtitle mb-2 text-muted');
      if (questions[i].isrequired) {
        required.innerHTML = ''.concat('<b>','Required','</b>');
      } else {
        required.innerHTML = ''.concat('<b>','Not Required','</b>');
      }
      cardBody.appendChild(required);

      const idQuestion = questions[i].question_id;

      if (questions[i].type === 'text') {
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

      let optionsComponent;

      if((questions[i].type === 'checkbox') || (questions[i].type === 'radio')) {
        if (questions[i].options.length > 0) {
          optionsComponent = QuestionCard.createOptions(questions[i].options, idQuestion, questions[i].type);
          cardBody.appendChild(optionsComponent);
        }
      }

      div.appendChild(cardContainer);
    }

    this.card = div;
  }

  static getCard(questions){
    const questionCard = new QuestionCard(questions);
    return questionCard.card;
  }
  
  static createOptions(optionsList, questionId, type) {
    //type: radio / checkbox
    const div = document.createElement('div');
    for (let i = 0; i < optionsList.length; i++){
      const option = document.createElement('div');
      option.setAttribute('class','form-check');

      const optionInput = document.createElement('input');
      optionInput.setAttribute('class','form-check-input');
      optionInput.setAttribute('type', type);
      if (type === 'radio') {
        optionInput.setAttribute('name','optionGroup-'.concat(questionId.toString()))
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
    return div;
  }
}

class SubmitButton{
  constructor(){
    //Submit button
    const div = document.createElement('div');
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