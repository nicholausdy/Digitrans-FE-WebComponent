import { URLParser } from './util/URLParser.js'
import { FormValidator } from './util/FormValidator.js'

import { Banner } from './components/banner.js'

class SurveyPage extends HTMLElement {
  constructor(){
    super();

    //bootstrap
    // css
    const link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href','./bootstrap/css/bootstrap.min.css');
    this.appendChild(link);

    const banner = SurveyHeader.getJumbotron();
    this.appendChild(banner);

    const panel = SurveyPanel.getPanel();
    this.appendChild(panel);
  }
}

class SurveyHeader extends Banner {
  constructor(){
    super('Selamat datang di Digitrans','Mari cari survei yang dapat Anda jawab...');
  }

  static getJumbotron() {
    const header = new SurveyHeader();
    return header.jumbotron;
  }
}

class SurveyPanel {
  constructor(){
    const panelContainer = document.createElement('div');
    panelContainer.setAttribute('class','container w-25 d-flex text-center justify-content-center');

    const panel = document.createElement('div');
    panel.setAttribute('class','panel w-100 panel-default');

    const panelBody = document.createElement('div');
    panelBody.setAttribute('class','panel-body');

    //label questionnaireId
    const idRow = document.createElement('div');
    idRow.setAttribute('class','row mt-3');

    const idColumn = document.createElement('div');
    idColumn.setAttribute('class', 'col w-100 mx-auto text-left');

    idColumn.innerHTML = '<b>ID Kuesioner</b>'
    idRow.appendChild(idColumn);
    panelBody.appendChild(idRow)

    //input text questionnaireId
    const idInputRow = document.createElement('div');
    idInputRow.setAttribute('class','row mt-3');

    const idInputColumn = document.createElement('div');
    idInputColumn.setAttribute('class','col w-100 mx-auto');

    const idInputFormGroup = document.createElement('div');
    idInputFormGroup.setAttribute('class','form-group w-100');

    const idInputArea = document.createElement('input');
    idInputArea.setAttribute('type','text');
    idInputArea.setAttribute('class','form-control');
    idInputArea.setAttribute('id','questionnaire_id')
    idInputArea.setAttribute('required','');

    idInputFormGroup.appendChild(idInputArea);
    idInputColumn.appendChild(idInputFormGroup);
    idInputRow.appendChild(idInputColumn);
    panelBody.appendChild(idInputRow);

    //label email
    const emailRow = document.createElement('div');
    emailRow.setAttribute('class','row mt-3');

    const emailColumn = document.createElement('div');
    emailColumn.setAttribute('class', 'col w-100 mx-auto text-left');

    emailColumn.innerHTML = '<b>Email Anda</b>'
    emailRow.appendChild(emailColumn);
    panelBody.appendChild(emailRow);

    //input text email
    const emailInputRow = document.createElement('div');
    emailInputRow.setAttribute('class','row mt-3');

    const emailInputColumn = document.createElement('div');
    emailInputColumn.setAttribute('class','col w-100 mx-auto');

    const emailInputFormGroup = document.createElement('div');
    emailInputFormGroup.setAttribute('class','form-group w-100');

    const emailInputArea = document.createElement('input');
    emailInputArea.setAttribute('type','email');
    emailInputArea.setAttribute('class','form-control');
    emailInputArea.setAttribute('id','answerer_email');
    emailInputArea.setAttribute('required','');

    emailInputFormGroup.appendChild(emailInputArea);
    emailInputColumn.appendChild(emailInputFormGroup);
    emailInputRow.appendChild(emailInputColumn);
    panelBody.appendChild(emailInputRow);

    //label nama
    const nameRow = document.createElement('div');
    nameRow.setAttribute('class','row mt-3');

    const nameColumn = document.createElement('div');
    nameColumn.setAttribute('class', 'col w-100 mx-auto text-left');

    nameColumn.innerHTML = '<b>Nama Anda</b>'
    nameRow.appendChild(nameColumn);
    panelBody.appendChild(nameRow);

    //input text nama
    const nameInputRow = document.createElement('div');
    nameInputRow.setAttribute('class','row mt-3');

    const nameInputColumn = document.createElement('div');
    nameInputColumn.setAttribute('class','col w-100 mx-auto');

    const nameInputFormGroup = document.createElement('div');
    nameInputFormGroup.setAttribute('class','form-group w-100');

    const nameInputArea = document.createElement('input');
    nameInputArea.setAttribute('type','text');
    nameInputArea.setAttribute('class','form-control');
    nameInputArea.setAttribute('id','answerer_name');
    nameInputArea.setAttribute('required','');

    nameInputFormGroup.appendChild(nameInputArea);
    nameInputColumn.appendChild(nameInputFormGroup);
    nameInputRow.appendChild(nameInputColumn);
    panelBody.appendChild(nameInputRow);

    //label organisasi
    const orgRow = document.createElement('div');
    orgRow.setAttribute('class','row mt-3');

    const orgColumn = document.createElement('div');
    orgColumn.setAttribute('class', 'col w-100 mx-auto text-left');

    orgColumn.innerHTML = '<b>Asal Organisasi Anda</b>'
    orgRow.appendChild(orgColumn);
    panelBody.appendChild(orgRow);

    //input text organisasi
    const orgInputRow = document.createElement('div');
    orgInputRow.setAttribute('class','row mt-3');

    const orgInputColumn = document.createElement('div');
    orgInputColumn.setAttribute('class','col w-100 mx-auto');

    const orgInputFormGroup = document.createElement('div');
    orgInputFormGroup.setAttribute('class','form-group w-100');

    const orgInputArea = document.createElement('input');
    orgInputArea.setAttribute('type','text');
    orgInputArea.setAttribute('class','form-control');
    orgInputArea.setAttribute('id','answerer_company');
    orgInputArea.setAttribute('required','');

    orgInputFormGroup.appendChild(orgInputArea);
    orgInputColumn.appendChild(orgInputFormGroup);
    orgInputRow.appendChild(orgInputColumn);
    panelBody.appendChild(orgInputRow);

    //Submit button
    const submitRow = document.createElement('div');
    submitRow.setAttribute('class','row mt-3');

    const submitColumn = document.createElement('div');
    submitColumn.setAttribute('class', 'col w-100 mx-auto');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('class','btn btn-success w-100');
    submitButton.setAttribute('type','button');
    submitButton.setAttribute('id','submit');
    submitButton.textContent = 'Cari kuesioner';
    submitButton.addEventListener('click', async() => {
      await SurveyPanel.submitAction();
    });

    submitColumn.appendChild(submitButton);
    submitRow.appendChild(submitColumn);
    panelBody.appendChild(submitRow);

    panel.appendChild(panelBody);
    panelContainer.appendChild(panel);

    this.panel = panelContainer;

  }

  static getPanel(){
    const surveyPanelComp = new SurveyPanel();
    return surveyPanelComp.panel;
  }

  static async submitAction(){
    try {
      const questionnaire_id = document.getElementById('questionnaire_id').value;
      const answerer_email = document.getElementById('answerer_email').value;
      const answerer_name = document.getElementById('answerer_name').value;
      const answerer_company = document.getElementById('answerer_company').value;

      if (!(questionnaire_id) || !(answerer_email) || !(answerer_name) || !(answerer_company)) {
        throw new Error('Ada isian yang belum diisi');
      }

      await FormValidator.validateEmail(answerer_email);

      const answerObj = {
        questionnaire_id: questionnaire_id, 
        answerer_email: answerer_email, 
        answerer_name: answerer_name, 
        answerer_company: answerer_company
      };

      localStorage.setItem('answer_object', JSON.stringify(answerObj));

      const destinationURL = await URLParser.redirectURL(window.location.href,'answerSurvey.html')
      window.location = destinationURL;

    } catch (error) {
      console.log(error)
      alert(error.message);
    }

  }
}

customElements.define('survey-page',SurveyPage);