import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

class Answer{
  static async getAnswer(){
    try {
      const url1 = config.backURL.concat('public/getQuestionnaireById');
      const url2 = config.backURL.concat('private/getAnswer');
      const questionnaireId = localStorage.getItem('viewResponseId');
      const token = localStorage.getItem('token');
      const answererEmail = localStorage.getItem('answerer_email');

      if(!(token)) {
        throw new Error('Invalid login');
      }

      const data1 = {questionnaire_id: questionnaireId};
      const data2 = {questionnaire_id: questionnaireId, answerer_email: answererEmail};
      const opA = FetchAPI.postJSON(url1, data1, token);
      const opB = FetchAPI.postJSON(url2, data2, token);

      const [questionnaireInfo, answerInfo] = await Promise.all([opA, opB]);

      if ((questionnaireInfo.success) && (answerInfo.success)) {
        return [questionnaireInfo.message, answerInfo.message];
      } else {
        throw new Error('Failed in fetching data');
      }

    } catch (error) {
      console.log(error);
      alert(error.message);
      const destinationURL = await URLParser.redirectURL(window.location.href, 'response.html');
      window.location = destinationURL;
    }
  }
}

class DetailPage extends HTMLElement {
  constructor(){
    super();

    //bootstrap
    // css and jquery

    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');

    this.appendChild(link);

    //navbar
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Kalkulator sampel','Langganan','Ganti akun'],['index.html','create.html','sample.html','subscription.html','login.html'], 'Kuesioner');
    this.appendChild(navbar);

    (async() => {
      [this.questionnaireInfo, this.answerInfo] = await Answer.getAnswer();
      // console.log(this.questionnaireInfo);
      // console.log(this.answerInfo);
      const titleCard = TitleCard.getCard(this.questionnaireInfo, this.answerInfo);
      this.appendChild(titleCard);

      const answerCard = AnswerCard.getCard(this.answerInfo.answers);
      this.appendChild(answerCard);
    })();
  }
}

class TitleCard{
  constructor(questionnaireInfo, answerInfo) {
    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class', 'row mt-5 mx-auto');

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

    const questionnaireTitle = document.createElement('h5');
    questionnaireTitle.setAttribute('class','card-title');
    questionnaireTitle.innerHTML = ''.concat('<b>', questionnaireInfo.QuestionnaireTitle, '</b>');
    cardBody.appendChild(questionnaireTitle);

    const questionnaireDescription = document.createElement('h6');
    questionnaireDescription.setAttribute('class','card-subtitle mb-2 text-muted');
    questionnaireDescription.innerHTML = ''.concat('<b>',questionnaireInfo.QuestionnaireDescription,'</b>');
    cardBody.appendChild(questionnaireDescription);

    const name = document.createElement('h5');
    name.setAttribute('class','card-title');
    name.innerHTML = ''.concat('<b>', answerInfo.answerer_name, '</b>');
    cardBody.appendChild(name);

    const email = document.createElement('h6');
    email.setAttribute('class','card-subtitle mb-2 text-muted');
    email.innerHTML = ''.concat('<b>',answerInfo.answerer_email,'</b>');
    cardBody.appendChild(email);

    const company = document.createElement('h6');
    company.setAttribute('class','card-subtitle mb-2 text-muted');
    company.innerHTML = ''.concat('<b>',answerInfo.answerer_company,'</b>');
    cardBody.appendChild(company);

    this.card = cardContainerTop;

  }

  static getCard(questionnaireInfo, answerInfo){
    const titleCard = new TitleCard(questionnaireInfo, answerInfo);
    return titleCard.card;
  }
}

class AnswerCard{
  constructor(answers) {
    const div = document.createElement('div');
    for (let i=0; i < answers.length; i++) {

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
      title.innerHTML = ''.concat('<b>',answers[i].question_description,'</b>');
      cardBody.appendChild(title);

      let optionsComponent;

      if (answers[i].type === 'text') {
        const textBox = document.createElement('h6');
        textBox.setAttribute('class','card-subtitle mb-2');
        textBox.innerHTML = ''.concat(answers[i].answer[0]);
        cardBody.appendChild(textBox);
      }

      if((answers[i].type === 'checkbox') || (answers[i].type === 'radio')) {
        if (answers[i].answer.length > 0) {
          optionsComponent = AnswerCard.createOptions(answers[i].answer, answers[i].question_id, answers[i].type);
          cardBody.appendChild(optionsComponent);

          const score = document.createElement('h6');
          score.setAttribute('class','card-subtitle mt-2 mb-2');
          score.innerHTML = ''.concat('<b>','Total score: ',answers[i].score,'</b>');
          cardBody.appendChild(score);
        }
      }

      div.appendChild(cardContainer);
    }

    this.card = div;
  }

  static getCard(questions){
    const answerCard = new AnswerCard(questions);
    return answerCard.card;
  }

  static createOptions(optionsList, questionId, type) {
    const div = document.createElement('div');
    for (let i = 0; i < optionsList.length; i++){
      const option = document.createElement('div');
      option.setAttribute('class','form-check');

      const optionInput = document.createElement('input');
      optionInput.setAttribute('class','form-check-input');
      optionInput.setAttribute('type', type);
      // optionInput.setAttribute('disabled','');
      optionInput.setAttribute('checked','');
      if (type === 'radio') {
        optionInput.setAttribute('name','optionGroup-'.concat(questionId.toString()))
      }
      optionInput.setAttribute('value','');
      // optionInput.setAttribute('disabled','');
      optionInput.setAttribute('id','option-'.concat(questionId.toString(),'-',optionsList[i].option_id.toString()));

      option.appendChild(optionInput);

      const optionLabel = document.createElement('label');
      optionLabel.setAttribute('class','form-check-label');
      optionLabel.setAttribute('for','option-'.concat(optionsList[i].option_id.toString()));
      optionLabel.textContent = optionsList[i].description.concat(',  Score: ',optionsList[i].score.toString());

      option.appendChild(optionLabel);

      div.appendChild(option);
    }
    return div;
  } 
}

customElements.define('detail-page', DetailPage);