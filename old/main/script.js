const burgerIcon = document.querySelector('.burger_nav');
const burgerContent = document.querySelector('.burger_menu');
const navLinkMenu = document.querySelectorAll('.navigation__link_menu');
const menuOverlay = document.querySelector('.menu_overlay');

const body = document.querySelector('body');
const friendsContent = document.querySelector('.friends_content');
const arrowRight = document.querySelector('.friend_arrow_rg');
const arrowLeft = document.querySelector('.friend_arrow_lf');

const petsContent = document.querySelector('.pets_content');
const popup = document.querySelector('.popup');
const popupCard = document.querySelector('.popup_card');
const popupCont = document.querySelector('.popup_content');
let popupClose = document.querySelector('.popup_close');

let currentNumSliderCards = 0;
//Массив с активными карточками и с прошлым набором, в балансе находятся карточки, которые остались
let currentCardsAtSlider = [];
let prevCardsAtSlider = [];
let balanceCardsAtSlider = [];

let currCards = [];
let prevArrow = '';
let currentArrow = '';
let onBurgerMenu = false;
let dataObj;

function useBurgerMenu() {
  onBurgerMenu = !onBurgerMenu;
  if (onBurgerMenu) {
    burgerIcon.classList.add('burger_nav_active');
    burgerContent.classList.add('burger_menu_animation');
    menuOverlay.classList.add('menu_overlay_animation');
    body.classList.add('stop_scroll');
  } else {
    burgerIcon.classList.remove('burger_nav_active');
    burgerContent.classList.remove('burger_menu_animation');
    menuOverlay.classList.remove('menu_overlay_animation');
    body.classList.remove('stop_scroll');
  }
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function sliderData() {
  const pets = '../../assets/pets.json';
  const res = await fetch(pets);
  const data = await res.json();
  dataObj = data;
  let petsNameArr = takeArrayFromObj();
  if (prevArrow == '' || prevArrow == currentArrow) {
    prevArrow = currentArrow;
    if (balanceCardsAtSlider.length == 0) {
      getCardsForSlides(petsNameArr);
    } else {
      getCardsForSlides(balanceCardsAtSlider);
    }
  } else if (prevArrow != currentArrow) {
    currentCardsAtSlider = currCards;
    prevArrow = currentArrow;
  }
  // if (currentNumSliderCards == 3 && currentCardsAtSlider.includes(undefined)) {
  //   currentCardsAtSlider.forEach((el) => {
  //     if (el == undefined) {
  //       currentCardsAtSlider = currentCardsAtSlider.slice(1);
  //       getNewElementForSlider(petsNameArr);
  //     }
  //   });
  // }
  takeCardInfo(data);
}

function getNewElementForSlider(arr) {
  let newArr = [...prevCardsAtSlider, ...currentCardsAtSlider];
  for (let i = 0; currentNumSliderCards > currentCardsAtSlider.length; i++) {
    if (newArr.includes(arr[i]) == false) {
      currentCardsAtSlider.unshift(arr[i]);
    }
  }
}

function takeSliderCard() {
  if (window.innerWidth >= 1280) {
    currentNumSliderCards = 3;
  } else if (window.innerWidth >= 768) {
    currentNumSliderCards = 2;
  } else {
    currentNumSliderCards = 1;
  }
  return currentNumSliderCards;
}

function takeArrayFromObj() {
  let keysArr = new Set();
  while (keysArr.size != 8) {
    let currNum = getRandomNum(0, 8);
    keysArr.add(currNum);
  }
  keysArr = [...keysArr];
  return keysArr;
}

function getCardsForSlides(petsArr) {
  for (let i = 0; i < currentNumSliderCards; i++) {
    currentCardsAtSlider.unshift(petsArr.pop());
  }
  balanceCardsAtSlider = petsArr;
}

function takeOldCards() {
  const removeCards = [...document.querySelectorAll('.friend_card')];
  removeCards.forEach((el) => {
    el.remove();
  });
}

function takeCardInfo(data) {
  checkCurrentArr();
  for (let i = 0; i < currentNumSliderCards; i++) {
    friendsContent.insertAdjacentHTML(
      'afterbegin',
      `<div class="friend_card">
  <img src="${
    data[currentCardsAtSlider[i]].img
  }" alt="pet image" /><span class="friend_name">${
        data[currentCardsAtSlider[i]].name
      }</span
  ><button class="button button_friends">
    <span>Learn more</span>
  </button>
</div>`
    );
  }
}

function checkCurrentArr() {
  if (currentCardsAtSlider.includes(undefined)) {
    currentCardsAtSlider = currentCardsAtSlider.slice(1);
    getNewElementForSlider(takeArrayFromObj());
  } else if (currentNumSliderCards > currentCardsAtSlider.length) {
    getNewElementForSlider(takeArrayFromObj());
  }
}

function resizeSlider() {
  let resizeNumSliders = 0;

  if (window.innerWidth >= 1280) {
    resizeNumSliders = 3;
    if (resizeNumSliders != currentNumSliderCards) {
      takeOldCards();
      currentNumSliderCards = 3;
      getNewElementForSlider(balanceCardsAtSlider);
      takeCardInfo(dataObj);
    }
  } else if (window.innerWidth >= 768) {
    currentNumSliderCards = 2;
    resizeNumSliders = 2;
    if (resizeNumSliders < currentCardsAtSlider.length) {
      const removeCards = [...document.querySelectorAll('.friend_card')];
      removeCards[resizeNumSliders].remove();
      currentCardsAtSlider.pop();
    } else if (resizeNumSliders > currentCardsAtSlider.length) {
      takeOldCards();
      currentNumSliderCards = 2;
      getNewElementForSlider(balanceCardsAtSlider);
      takeCardInfo(dataObj);
    }
  } else {
    currentNumSliderCards = 1;
    resizeNumSliders = 1;
    if (resizeNumSliders < currentCardsAtSlider.length) {
      const removeCards = [...document.querySelectorAll('.friend_card')];
      removeCards[resizeNumSliders].remove();
      currentCardsAtSlider.pop();
    } else if (resizeNumSliders > currentCardsAtSlider.length) {
      takeOldCards();
      getNewElementForSlider(balanceCardsAtSlider);
      takeCardInfo(dataObj);
    }
  }
}

function makePopupCard(elem) {
  // console.log(popupCard, elem);
  popupCont.insertAdjacentHTML(
    'beforeend',
    `
    <div class='popup_card'>
<img
src="${elem.img}"
alt="pet image"
/>
<div class='card_txt'><h4 class='popup_h4'>${elem.name}</h4>
<h6 class='popup_h6'>${elem.type} - ${elem.breed}</h6>
<p class='popup_p'>${elem.description}</p>
<ul class='popup_ul'><li class='popup_li'><h6 class='li_name'>Age:</h6><span class='popup_span'>${elem.age}</span></li><li class='popup_li'><h6 class='li_name'>Inoculations:</h6><span class='popup_span'>${elem.inoculations}</span></li><li class='popup_li'><h6 class='li_name'>Diseases:</h6><span class='popup_span'>${elem.diseases}</span></li><li class='popup_li'><h6 class='li_name'>Parasites:</h6><span class='popup_span'>${elem.parasites}</span></li></ul></div>
`
  );
}

burgerIcon.addEventListener('click', () => {
  useBurgerMenu();
});
navLinkMenu.forEach((el) => {
  el.addEventListener('click', () => {
    useBurgerMenu();
  });
});
menuOverlay.addEventListener('click', () => {
  useBurgerMenu();
});
arrowRight.addEventListener('click', () => {
  takeOldCards();

  currCards = prevCardsAtSlider;
  prevCardsAtSlider = currentCardsAtSlider;
  currentCardsAtSlider = [];
  sliderData();
  currentArrow = 'right';
});
arrowLeft.addEventListener('click', () => {
  takeOldCards();

  currCards = prevCardsAtSlider;
  prevCardsAtSlider = currentCardsAtSlider;
  currentCardsAtSlider = [];
  sliderData();
  currentArrow = 'left';
});

window.addEventListener('resize', () => {
  resizeSlider();
});

window.addEventListener('load', () => {
  const friendCards = document.querySelectorAll('.friend_card');
  // console.log(friendCards);
  friendCards.forEach((el, idx) => {
    el.addEventListener('click', () => {
      popup.style.display = 'flex';
      body.classList.add('stop_scroll');
      let cardName = document.querySelector('.friend_name');
      dataObj.forEach((elem) => {
        if (elem.name == cardName.textContent) {
          makePopupCard(elem);
        }
      });
    });
  });

  popupClose = document.querySelector('.popup_close');
  popupClose.addEventListener('click', () => {
    //popupCard.remove();
    popup.style.display = 'none';

    console.log(body);
    body.classList.remove('stop_scroll');
  });
});

sliderData();
takeSliderCard();

//Проверить чтобы кажый раз был новый набор карточек
