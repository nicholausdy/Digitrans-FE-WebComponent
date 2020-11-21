// const fetch = require('node-fetch');

class FetchAPI {
  static async postJSON (url, data, token = "") {
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type':'application/json',
          'Authorization':'Bearer '.concat(token)
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  } 

  static async deleteJSON (url, data, token = "") {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type':'application/json',
          'Authorization':'Bearer '.concat(token)
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  } 

  static async getJSON (url, token = "") {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type':'application/json',
          'Authorization':'Bearer '.concat(token)
        },
      });
      return response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export { FetchAPI }

//(async()  => {
//  let url = "http://206.189.153.47/public/user/login"
//  let data = {email: 'nicdanyos@gmail.com', password:'JackDullBoy1999'}
//  const res1 = await FetchAPI.postJSON(url, data)
//  url = "http://206.189.153.47/private/getQuestionnaires"
//  data = {email: 'nicdanyos@gmail.com'}
//  const res2 = await FetchAPI.postJSON(url, data, res1.message)
//  url = "http://206.189.153.47:2020/private/user/verification/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2ZW50QGJpc3RsZWFndWUuY29tIiwiaWF0IjoxNjA0MzAwNTE0LCJleHAiOjE2MDQzMDQxMTR9.Fe9zUHiD91FUjxldBN7PvZVsxWlEl19rNvL1eVHAfjY"
//  const res3 = await FetchAPI.getJSON(url)
//  console.log(res1)
//  console.log(res2)
//  console.log(res3)
//})();