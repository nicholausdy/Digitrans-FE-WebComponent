import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'

class Questionnaire{
  static async getQuestionnaire(){
    try {
      const url1 = config.backURL.concat('public/getQuestionnaireById');
      const url2 = config.backURL.concat('private/getQuestions');
      const url3 = config.backURL.concat('public/getOptionsToQuestionsMap');
      const questionnaireId = localStorage.getItem('viewId');
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

class ViewPage extends HTMLElement{
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
      [this.questionnaireInfo, this.questions, this.mappings] = await Questionnaire.getQuestionnaire();
      //console.log(this.questionnaireInfo);
      //console.log(this.questions);
      const titleCard = TitleCard.getCard(this.questionnaireInfo);
      this.appendChild(titleCard);
      if (this.questions.length > 0) {
        const questionCard = QuestionsCard.getCard(this.questions);
        this.appendChild(questionCard);
      }
      if (this.mappings.length > 0) {
        await QuestionsCard.showMapping(this.mappings);
      }
    })();
  }
}

class TitleCard {
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

    this.card = cardContainerTop;
  }

  static getCard(questionnaireInfo){
    const titleCard = new TitleCard(questionnaireInfo);
    return titleCard.card;
  }
}

class QuestionsCard{
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
      cardBody.appendChild(title);
      const boldElement = document.createElement('b');
      title.appendChild(boldElement);
      const questionNo = questions[i].question_id + 1;
      const questionNoString = questionNo.toString(10);
      const questionDesc = questions[i].question_description;
      const textDesc = `${questionNoString}. ${questionDesc}`;
      boldElement.textContent = textDesc;
      // title.innerHTML = ''.concat('<b>',questions[i].question_description,'</b>');
      
      const required = document.createElement('h6');
      required.setAttribute('class','card-subtitle mb-2 text-muted');
      if (questions[i].isrequired) {
        required.innerHTML = ''.concat('<b>','Required','</b>');
      } else {
        required.innerHTML = ''.concat('<b>','Not Required','</b>');
      }
      cardBody.appendChild(required);

      let optionsComponent;
      if ((questions[i].type === 'checkbox') || (questions[i].type === 'radio')) {
        if (questions[i].options.length > 0) {
          optionsComponent = QuestionsCard.createOptions(questions[i].options, questions[i].question_id, questions[i].type);
          cardBody.appendChild(optionsComponent);
        }
      }
      div.appendChild(cardContainer);
    }

    this.card = div;
  }

  static getCard(questions){
    const questionCard = new QuestionsCard(questions);
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
      optionLabel.setAttribute('id','optiondesc-'.concat(questionId.toString(),'-',optionsList[i].option_id.toString()));
      optionLabel.textContent = optionsList[i].description.concat(';  Score: ',optionsList[i].score.toString());

      option.appendChild(optionLabel);

      div.appendChild(option);
    }
    return div;
  }

  static async showMapping(mappingsList) {
    for (let i=0 ; i < mappingsList.length; i++) {
      const questionId = mappingsList[i].question_id;
      const questionIdString = questionId.toString(10);
      const optionId = mappingsList[i].option_id;
      const optionIdString = optionId.toString(10);
      const questionIdDest = mappingsList[i].question_id_dest + 1;
      const questionIdDestString = questionIdDest.toString(10);

      const idElem = `optiondesc-${questionIdString}-${optionIdString}`;
      const optionLabelElement = document.getElementById(idElem);
      const mappingDesc = `; Jika dipilih, pergi ke pertanyaan nomor ${questionIdDestString}`;
      optionLabelElement.textContent = optionLabelElement.textContent.concat(mappingDesc);
    }
  }
}

export {TitleCard};

customElements.define('view-page',ViewPage);
