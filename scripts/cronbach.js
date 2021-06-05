import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'
import { Questionnaire } from './analytics.js'
import { TitleCard } from './view.js'

class CronbachPage extends HTMLElement {
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

      const descriptionCard = DescriptionCard.getCard();
      this.appendChild(descriptionCard);

      const cronbachReqCard = CronbachRequestCard.getCard(this.questions, this);
      this.appendChild(cronbachReqCard);

      // const chiCard = ChiTestCard.getCard(this.questions, this);
      // this.appendChild(chiCard);
    })();
  }
}

class DescriptionCard {
  constructor(){
    const allCardsContainer = document.createElement('div');

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class', 'row mx-auto');
    allCardsContainer.appendChild(cardContainerTop);

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

    const title = document.createElement('h5');
    title.setAttribute('class','card-title');
    title.innerHTML = '<b> Uji Cronbach Alpha </b>';
    cardBody.appendChild(title);

    const description1 = document.createElement('h6');
    description1.setAttribute('class','card-subtitle mb-2');
    description1.textContent = 'Uji Cronbach Alpha digunakan untuk menguji kevalidan / kesahihan kuesioner dengan melihat konsistensi internal di antara pertanyaan kuesioner. Adapun, konsistensi internal tersebut diukur berdasarkan variansi dan kovariansi di antara jawaban responden.';
    cardBody.appendChild(description1);

    const descriptionPad = document.createElement('h6');
    descriptionPad.setAttribute('class','card-subtitle mb-2');
    descriptionPad.innerHTML = '</br>'
    cardBody.appendChild(descriptionPad);

    const description2 = document.createElement('h6');
    description2.setAttribute('class','card-subtitle mb-2');
    description2.textContent = 'Uji ini terutama digunakan untuk melihat konsistensi di antara pertanyaan-pertanyaan yang bertujuan mengukur hal yang sama dalam kuesioner. Sebagai contoh, untuk mengukur kebahagiaan pengujung restoran, penyelenggara survei dapat menanyakan "Apakah pelayanan memuaskan?","Apakah makanan enak?", dan "Apakah suasana restoran membuat Anda nyaman?"';
    cardBody.appendChild(description2);

    const descriptionPad2 = document.createElement('h6');
    descriptionPad2.setAttribute('class','card-subtitle mb-2');
    descriptionPad2.innerHTML = '</br>'
    cardBody.appendChild(descriptionPad2);

    const description3 = document.createElement('h6');
    description3.setAttribute('class','card-subtitle mb-2');
    description3.textContent = 'Nilai hasil uji yang tinggi menunjukkan konsistensi yang tinggi di antara pertanyaan sedangkan hasil yang rendah menunjukkan sebaliknya. Adapun, tingkatan konsistensi dari hasil uji Cronbach Alpha adalah sebagai berikut: Sangat Baik (>= 0.9), Baik (>= 0.8), Dapat diterima (>= 0.7), Dipertanyakan (>= 0.6), Buruk (>= 0.5), dan Tidak Bisa Diterima (< 0.5).';
    cardBody.appendChild(description3);

    this.card = allCardsContainer
  }

  static getCard() {
    const descriptionCard = new DescriptionCard();
    return descriptionCard.card;
  }
}

class CronbachRequestCard{
  constructor(questions, parentDiv){
    const allCardsContainer = document.createElement('div');

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class', 'row mx-auto');
    allCardsContainer.appendChild(cardContainerTop);

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

    const title = document.createElement('h5');
    title.setAttribute('class','card-title');
    title.innerHTML = '<b> Mulai Pengujian </b>';
    cardBody.appendChild(title);

    const description = document.createElement('h6');
    description.setAttribute('class','card-subtitle mb-2');
    description.textContent = 'Pertanyaan pada kuesioner ini yang dapat dianalisis adalah sebagai berikut (bertipe radio dan wajib diisi):';
    cardBody.appendChild(description);

    for(let i = 0; i < questions.length; i++) {
      if ((questions[i].type === 'radio') && (questions[i].isrequired)) {
        const descriptionI = document.createElement('h6');
        descriptionI.setAttribute('class','card-subtitle mb-2');
        descriptionI.textContent = `${questions[i].question_id + 1}. ${questions[i].question_description}`;
        cardBody.appendChild(descriptionI);
      }
    }

    const descriptionPad = document.createElement('h6');
    descriptionPad.setAttribute('class','card-subtitle mb-2');
    descriptionPad.innerHTML = '</br>'
    cardBody.appendChild(descriptionPad);

    const descriptionInput = document.createElement('h6');
    descriptionInput.setAttribute('class','card-subtitle mb-2');
    descriptionInput.textContent = 'Masukkan nomor pertanyaan yang akan dianalisis (pisahkan dengan koma dan tanpa spasi)';
    cardBody.appendChild(descriptionInput);

    // Input Form
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
    descInputSpan.setAttribute('name','label-teks')
    descInputSpan.textContent = 'Masukkan nomor';
    descInputPrepend.appendChild(descInputSpan);

    const descInputForm = document.createElement('textarea');
    const idQuestionList = 'questions-list'
    descInputForm.setAttribute('id', idQuestionList);
    descInputForm.setAttribute('rows', '7');
    descInputForm.setAttribute('cols', '80');
    descInputForm.setAttribute('class','form-control');
    descInputForm.setAttribute('aria-label','description');
    descInputForm.setAttribute('aria-describedby','description-addon');
    descInputForm.setAttribute('placeholder','2,3,4,5')
    descInputGroup.appendChild(descInputForm);

    // submit button
    const submitButton = SubmitButton.getButton(parentDiv);
    cardBody.appendChild(submitButton);

    this.card = allCardsContainer;
  }

  static getCard(questions, parentDiv) {
    const cronbachReqCard = new CronbachRequestCard(questions, parentDiv);
    return cronbachReqCard.card;
  }
}

class SubmitButton {
  constructor(parentDiv) {
    const buttonContainer = document.createElement('div');
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type','button');
    buttonEl.setAttribute('class','btn btn-success mt-3');
    buttonEl.textContent = 'Submit';
    buttonEl.addEventListener('click', async() => {
      await ButtonAction.deletePrevResultCard();
      const resultMessage = await ButtonAction.submitAction();
      if (resultMessage) {
        console.log(resultMessage)
        const resultCard = ResultCard.getCard(resultMessage);
        parentDiv.appendChild(resultCard);
      }
    });
    buttonContainer.appendChild(buttonEl);
    this.button = buttonContainer;
  }

  static getButton(parentDiv) {
    const submitButton = new SubmitButton(parentDiv);
    return submitButton.button;
  }
}

class ResultCard {
  constructor(responseMessage){
    const allCardsContainer = document.createElement('div');
    allCardsContainer.setAttribute('id', 'result-card')

    const cardContainerTop = document.createElement('div');
    cardContainerTop.setAttribute('class', 'row mx-auto');
    allCardsContainer.appendChild(cardContainerTop);

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

    const title = document.createElement('h5');
    title.setAttribute('class','card-title');
    title.innerHTML = '<b> Hasil pengujian </b>';
    cardBody.appendChild(title);

    if (!(responseMessage.success)) {
      const conclusion = document.createElement('h6');
      conclusion.setAttribute('class','card-subtitle mb-2');
      conclusion.innerHTML = `<b> Hasil </b>: ${responseMessage.message}`;
      cardBody.appendChild(conclusion);
    }
    else {
      const conclusion = document.createElement('h6');
      conclusion.setAttribute('class','card-subtitle mb-2');
      conclusion.innerHTML = `<b> Hasil </b>: ${responseMessage.message.consistency}`;
      cardBody.appendChild(conclusion);

      const conclusionA = document.createElement('h6');
      conclusionA.setAttribute('class','card-subtitle mb-2');
      conclusionA.innerHTML = `<b> Nilai konsistensi (alpha) </b>: ${responseMessage.message.cronbach_alpha}`;
      cardBody.appendChild(conclusionA);
    }

    this.card = allCardsContainer;
  }

  static getCard(responseMessage) {
    const resultCard = new ResultCard(responseMessage);
    return resultCard.card;
  }
}

class ButtonAction {
  static async deletePrevResultCard() {
    const elementToBeDeleted = document.getElementById('result-card');
    if (elementToBeDeleted) {
      elementToBeDeleted.remove();
    }
  }

  static async getQuestionsList(){
    try {
      const questionsListElem = document.getElementById('questions-list');
      const stringValue = questionsListElem.value;
      if (!(stringValue)) {
        throw new Error('Isian kosong')
      }
      const stringArr = stringValue.split(",");
      const questionsIdList = [];
      for (let i = 0 ; i < stringArr.length; i++) {
        const stringElem = stringArr[i];
        const intElem = parseInt(stringElem, 10);
        if (isNaN(intElem)) {
          throw new Error('Isian tidak valid')
        }
        questionsIdList.push(intElem - 1);
      }
      return questionsIdList;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async submitAction(){
    try {
      const questionnaireId = localStorage.getItem('viewResponseId');
      if (!(questionnaireId)) {
        const destinationURL = await URLParser.redirectURL(window.location.href,'index.html')
        window.location = destinationURL;
      }

      const questionsIdList = await ButtonAction.getQuestionsList();

      const url = config.backURL.concat('private/getCronbachAlpha');

      const token = localStorage.getItem('token');
      if (!(token)) {
        const destinationURL = await URLParser.redirectURL(window.location.href,'login.html')
        window.location = destinationURL;
      }

      const data = { questionnaire_id: questionnaireId, questions_list: questionsIdList};
      const responseMessage = await FetchAPI.postJSON(url, data, token);
      return responseMessage;

    } catch (error) {
      alert(error.message);
    }
  }
}

customElements.define('cronbach-page', CronbachPage)