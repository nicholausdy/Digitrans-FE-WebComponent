import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'
// import { TitleCard } from './view.js'

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
    const navbar = NavBar.getNavBar('Digitrans',['Kuesioner','Buat','Kalkulator sampel','Langganan','Ganti akun'],['index.html','create.html','sample.html','subscription.html','login.html'], 'Kuesioner');
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

    // submit button
    const submitButton = SubmitButton.getButton();
    cardBody.appendChild(submitButton);

    this.card = cardContainerTop;
  }

  static getCard(questionnaireInfo){
    const titleCard = new TitleCard(questionnaireInfo);
    return titleCard.card;
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
          const listOfChartTypes = ['Pie', 'Vertical bar', 'Horizontal bar'];
          const questionId = questions[i].question_id;
          const questionIdString = questionId.toString(10);
          const chartReqObj = { questionnaire_id, question_id: questionId }
          const dropDownList = DropDownList.getDropDownList(cardBody, chartReqObj ,questionIdString, 'Jenis grafik? Pie', listOfChartTypes);
          cardBody.appendChild(dropDownList);

          const chartComponent = await AnalyticsCard.createChart(questionnaire_id, questions[i].question_id, 'pie');
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

  static async createChart(questionnaire_id, question_id, chart_type) {
    try {
      const url = config.backURL.concat('private/getChart');
      const data = {questionnaire_id, question_id, chart_type}; 
      const token = localStorage.getItem('token');

      const headerInit = { headers: {"Content-Type": "image/svg+xml"}};
      const blobURL = await FetchAPI.getStream(url, data, headerInit, token);

      const fig = document.createElement('figure');
      const questionIdString = question_id.toString(10);
      const figureId = `chart-result-${questionIdString}`;
      fig.setAttribute('id', figureId);

      const embed = document.createElement('embed');
      fig.appendChild(embed);
      embed.setAttribute('type','image/svg+xml');
      embed.setAttribute('src', blobURL); 
      embed.addEventListener('load', async() => {
        await FetchAPI.revokeURL(embed.src);
      })
      // return fig;
      return fig;

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }
}

class DropDownList {
  constructor(parentEl, chartReqObj, idEl, buttonText, listOfChartTypes) {
    const dropDiv = document.createElement('div');
    dropDiv.setAttribute('class','dropdown mt-3 mx-auto');
    // cardBody.appendChild(questionDiv);
    
    const dropButton = document.createElement('button');
    dropButton.setAttribute('class','btn btn-success dropdown-toggle');
    const idDropButton = `question-chart-${idEl}`;
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
      const idDropDownItem = `chart-items-${idEl}`;
      await ButtonAction.deletePrevDropItems(idDropDownItem);
      const dropItems = await ButtonAction.createDropDownList(parentEl, chartReqObj, idDropDownItem, listOfChartTypes, dropButton);
      for (let i=0 ; i < dropItems.length; i++) {
        dropList.appendChild(dropItems[i]);
      }
    });
    this.dropDown = dropDiv;
  }

  static getDropDownList(parentEl, chartReqObj, idEl, buttonText, listOfChartTypes) {
    const dropDownList = new DropDownList(parentEl, chartReqObj, idEl, buttonText, listOfChartTypes);
    return dropDownList.dropDown;
  }
}

class ButtonAction {
  static async createDropDownList(parentEl, chartReqObj, idDropDownItem, listOfChartTypes, buttonDiv) {
    const listOfDropItems = []
    for (let i = 0; i < listOfChartTypes.length; i++) {
      const dropItem = document.createElement('a');
      dropItem.setAttribute('class','dropdown-item');
      dropItem.setAttribute('name', idDropDownItem)
      dropItem.textContent = listOfChartTypes[i];
      dropItem.addEventListener('click', async() => {
        await ButtonAction.dropDownAction(parentEl, chartReqObj, buttonDiv, 'Jenis grafik?', dropItem.textContent)
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

  static async dropDownAction(parentEl, chartReqObj, buttonEl, baseText, selectedText) {
    const value = selectedText;
    const { questionnaire_id, question_id } = chartReqObj;

    buttonEl.setAttribute('value',value);
    buttonEl.textContent = baseText.concat('  ',selectedText);
    const idChart = `chart-result-${question_id}`;

    const chartComponentToBeDeleted = document.getElementById(idChart);
    if (chartComponentToBeDeleted) {
      chartComponentToBeDeleted.remove()
    }

    const chartType = await ButtonAction.chartTypeMapper(value);
    const chartComponent = await AnalyticsCard.createChart(questionnaire_id, question_id, chartType)
    parentEl.appendChild(chartComponent);
  }

  static async chartTypeMapper(oldString) {
    const selectorDict = {
      'Pie': 'pie',
      'Vertical bar': 'bar',
      'Horizontal bar': 'h_bar'
    }
    return selectorDict[oldString];
  }
}

class SubmitButton {
  constructor() {
    const buttonContainer = document.createElement('div');
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type','button');
    buttonEl.setAttribute('class','btn btn-success mt-3');
    buttonEl.textContent = 'Generate PDF';
    buttonEl.addEventListener('click', async() => {
      window.print();
    });
    buttonContainer.appendChild(buttonEl);
    this.button = buttonContainer;
  }

  static getButton() {
    const submitButton = new SubmitButton();
    return submitButton.button;
  }
}

export { Questionnaire }

customElements.define('analytics-page', AnalyticsPage);


  