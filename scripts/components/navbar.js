import { config } from '../util/config.js'

class NavBar {
  constructor(brand, arrNames, arrLinks, currentName){
    this.brand = brand;
    this.arrNames = arrNames;
    this.arrLinks = arrLinks;
    this.currentName = currentName;

    const navbarContainer = document.createElement('div');
    navbarContainer.setAttribute('class','row w-100');

    const navbar = document.createElement('nav');
    navbar.setAttribute('class','navbar navbar-expand-lg navbar-dark bg-dark fixed-top');

    const brandComp = document.createElement('a');
    brandComp.setAttribute('class','navbar-brand');
    brandComp.setAttribute('href','#');
    brandComp.textContent = this.brand;
    navbar.appendChild(brandComp);

    const button = document.createElement('button');
    button.setAttribute('class','navbar-toggler collapsed');
    button.setAttribute('type','button');
    button.setAttribute('data-toggle','collapse');
    button.setAttribute('data-target','#navbarNav');
    button.setAttribute('aria-controls','navbarNav');
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','Toggle navigation');

    const buttonSpan = document.createElement('span');
    buttonSpan.setAttribute('class','navbar-toggler-icon');
    button.appendChild(buttonSpan);
    navbar.appendChild(button);

    const navbarComponentsDiv = document.createElement('div');
    navbarComponentsDiv.setAttribute('class','show navbar-collapse')
    navbarComponentsDiv.setAttribute('id','navbarNav');

    const navbarComponentsUl = document.createElement('ul');
    navbarComponentsUl.setAttribute('class','navbar-nav');

    for (let i=0; i < this.arrLinks.length; i++) {
      let navbarComponent;
      let navbarComponentLink;
      if (this.currentName === this.arrNames[i]) {
        navbarComponent = document.createElement('li');
        navbarComponent.setAttribute('class','nav-item active');
        
        navbarComponentLink = document.createElement('a');
        navbarComponentLink.setAttribute('class', 'nav-link');
        navbarComponentLink.setAttribute('href', config.baseURL.concat(this.arrLinks[i]));
        navbarComponentLink.textContent = this.arrNames[i];

        const navbarComponentSpan = document.createElement('span');
        navbarComponentSpan.setAttribute('class','sr-only')
        navbarComponentSpan.textContent= '(current)';
        navbarComponentLink.appendChild(navbarComponentSpan);
      } else {
        navbarComponent = document.createElement('li');
        navbarComponent.setAttribute('class','nav-item');
        
        navbarComponentLink = document.createElement('a');
        navbarComponentLink.setAttribute('class', 'nav-link');
        navbarComponentLink.setAttribute('href', config.baseURL.concat(this.arrLinks[i]));
        navbarComponentLink.textContent = this.arrNames[i];
      }
      navbarComponent.appendChild(navbarComponentLink);
      navbarComponentsUl.appendChild(navbarComponent);
    }
    // dead link to show users email
    const navbarComponentEmail = document.createElement('li');
    navbarComponentEmail.setAttribute('class','nav-item');
    
    const navbarComponentEmailLink = document.createElement('a');
    navbarComponentEmailLink.setAttribute('class', 'nav-link disabled');
    navbarComponentEmailLink.textContent = localStorage.getItem('email');
    
    navbarComponentEmail.appendChild(navbarComponentEmailLink);
    navbarComponentsUl.appendChild(navbarComponentEmail);
    
    navbarComponentsDiv.appendChild(navbarComponentsUl);
    navbar.appendChild(navbarComponentsDiv);
    navbarContainer.appendChild(navbar);

    this.navbar = navbarContainer;
  }

  static getNavBar(brand, arrNames, arrLinks, currentName){
    const nav  = new NavBar(brand, arrNames, arrLinks, currentName);
    return nav.navbar;
  }
}

export { NavBar };