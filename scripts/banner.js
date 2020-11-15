class Banner {
  constructor(title, description){
    this.title = title;
    this.description = description;
    // container for header
    const jumbotron = document.createElement('div');
    jumbotron.setAttribute('class','jumbotron');
 
    const headerContainer = document.createElement('div');
    headerContainer.setAttribute('class','container')
     
    //header 1st row
    const headerRow = document.createElement('div')
    headerRow.setAttribute('class','row text-center')
 
    const headerColumn = document.createElement('div')
    headerColumn.setAttribute('class','col-md-8 mx-auto')
 
    const headerDisplay = document.createElement('h1')
    headerDisplay.setAttribute('class','display-4')
 
    headerDisplay.textContent = this.title;
 
    //header 2nd row
    const headerRow2 = document.createElement('div')
    headerRow2.setAttribute('class','row text-center mt-3')
 
    const headerColumn2 = document.createElement('div')
    headerColumn2.setAttribute('class','col-md-8 mx-auto')
 
    const headerDisplay2 = document.createElement('h1')
    headerDisplay2.setAttribute('class','lead')
 
    headerDisplay2.textContent = this.description;
 
    headerColumn.appendChild(headerDisplay)
    headerRow.appendChild(headerColumn)
    headerContainer.appendChild(headerRow)
 
    headerColumn2.appendChild(headerDisplay2)
    headerRow2.appendChild(headerColumn2)
    headerContainer.appendChild(headerRow2)
 
    jumbotron.appendChild(headerContainer)

    this.jumbotron = jumbotron;
  }
}

export { Banner }