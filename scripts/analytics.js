import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'
import { TitleCard } from './view.js'

class Questionnaire{
  static async getQuestionnaire(){
    try {
      const url1 = config.backURL.concat('public/getQuestionnaireById');
      const url2 = config.backURL.concat('private/getQuestions');
      const questionnaireId = localStorage.getItem('viewResponseId');
      const token = localStorage.getItem('token');
  
      if (!(token)) {
        throw new Error('Invalid login')
      }
  
      const data = {questionnaire_id: questionnaireId};
      const opA = FetchAPI.postJSON(url1, data, token);
      const opB = FetchAPI.postJSON(url2, data, token);
  
      const [responseQuestionnaire, responseQuestions] = await Promise.all([opA, opB]);
        
      if ((responseQuestionnaire.success) && (responseQuestions.success)) {
        return [questionnaireId, responseQuestionnaire.message, responseQuestions.message.questions];
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

class AnalyticsPage extends HTMLElement {
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

    //IIFE
    (async() => {
      [this.questionnaire_id, this.questionnaireInfo, this.questions] = await Questionnaire.getQuestionnaire();

      const titleCard = TitleCard.getCard(this.questionnaireInfo);
      this.appendChild(titleCard);

      const analyticsCard = AnalyticsCard.getCard(this.questionnaire_id, this.questions);
      this.appendChild(analyticsCard);
    })();
  }
}

class AnalyticsCard{
  constructor(questionnaire_id, questions) {
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
      const boldTitleStyle = document.createElement('b');
      title.appendChild(boldTitleStyle);
      boldTitleStyle.textContent = questions[i].question_description;
      cardBody.appendChild(title);

      const required = document.createElement('h6');
      required.setAttribute('class','card-subtitle mb-2 text-muted');
      const boldRequiredStyle = document.createElement('b');
      required.appendChild(boldRequiredStyle);
      if (questions[i].isrequired) {
        boldRequiredStyle.textContent = 'Required';
      } else {
        boldRequiredStyle.textContent = 'Not Required';
      }
      cardBody.appendChild(required);

      (async() => {
        if ((questions[i].type === 'checkbox') || (questions[i].type === 'radio')){
          const chartComponent = await AnalyticsCard.createChart(questionnaire_id, questions[i].question_id);
          cardBody.appendChild(chartComponent);
        }
      })();
      div.appendChild(cardContainer);
    }

    this.card = div;
  }

  static getCard(questionnaire_id, questions){
    const analyticsCard = new AnalyticsCard(questionnaire_id, questions);
    return analyticsCard.card;
  }

  static async createChart(questionnaire_id, question_id) {
    try {
      const url = config.backURL.concat('private/getChart');
      const data = {questionnaire_id: questionnaire_id, question_id: question_id}; 
      const token = localStorage.getItem('token');


      const blobURL = await FetchAPI.getStream(url, data, token)

      const fig = document.createElement('figure');
      const embed = document.createElement('embed');
      fig.appendChild(embed);
      embed.setAttribute('type','image/svg+xml');
      embed.setAttribute('src', blobURL); 
      embed.addEventListener('load', async() => {
        await FetchAPI.revokeURL(embed.src);
      })
      return fig;

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }
}

customElements.define('analytics-page', AnalyticsPage);


  