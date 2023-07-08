const burgerIcon = document.querySelector('.burger_nav');
const burgerContent = document.querySelector('.burger_menu');
const navLinkMenu = document.querySelectorAll('.navigation__link_menu');
const menuOverlay = document.querySelector('.menu_overlay');

const sliderNum = document.querySelector('.slider_num');
const doublePrev = document.querySelector('#double_arrow_prev');
const oncePrev = document.querySelector('#once_prev');
const onceNext = document.querySelector('#once_next');
const doubleNext = document.querySelector('#double_arrow_next');

const petsContent = document.querySelector('.pets_content');
const popup = document.querySelector('.popup');
const popupCard = document.querySelector('.popup_card');
const popupCont = document.querySelector('.popup_content');
let popupClose = document.querySelector('.popup_close');
const body = document.querySelector('body');

let petsCards;

const contentArray = [];
let array = [];
let activePetsArray = [];
let sliderNumber = 1;
let dataObj;
let currentNumSliders = 0;
let maxRange;
let cardsArr = [];

async function sliderData() {
  const pets = '../../assets/pets.json';
  const res = await fetch(pets);
  dataObj = await res.json();

  getArrSlice();
}

function countSlider() {
  if (sliderNumber > maxRange) {
    sliderNumber = maxRange;
  }
  if (sliderNumber == 1) {
    doublePrev.classList.add('slider_block');
    oncePrev.classList.add('slider_block');
  } else if (sliderNumber > 1) {
    doublePrev.classList.remove('slider_block');
    oncePrev.classList.remove('slider_block');
  }
  if (sliderNumber == maxRange) {
    doubleNext.classList.add('slider_block');
    onceNext.classList.add('slider_block');
  } else if (sliderNumber < maxRange) {
    doubleNext.classList.remove('slider_block');
    onceNext.classList.remove('slider_block');
  }
  sliderNum.textContent = sliderNumber;
}

function createSlidersContent() {
  for (; contentArray.length < 6; ) {
    let isGoodArr = true;
    let arr = takeArrayFromObj();
    if (contentArray.length == 0) {
    } else if (contentArray.length == 1) {
      let sliceArr = contentArray[0].slice(5);
      let secSliceArr = arr.slice(0, 3);
      secSliceArr.forEach((el) => {
        if (sliceArr.includes(el)) {
          isGoodArr = false;
        }
      });
    } else if (contentArray.length > 1) {
      let sliceArr = contentArray[contentArray.length - 1].slice(6);
      let secSliceArr = arr.slice(0, 2);
      secSliceArr.forEach((el) => {
        if (sliceArr.includes(el)) {
          isGoodArr = false;
        }
      });
    }
    if (isGoodArr) {
      contentArray.push(arr);
    }
  }

  contentArray.forEach((el, idx) => {
    if (idx != 0) {
      array += ',';
    }
    array += [...el];
  });
  array = array.split(',');
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
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
function checkWidth() {
  let windWidth = window.innerWidth;
  if (windWidth >= 1280) {
    currentNumSliders = 8;
  } else if (windWidth >= 768) {
    currentNumSliders = 6;
  } else {
    currentNumSliders = 3;
  }
  maxRange = 48 / currentNumSliders;
}

function getArrSlice() {
  let cardSliceStart = currentNumSliders * (sliderNumber - 1);
  let cardSliceEnd = currentNumSliders * sliderNumber;
  activePetsArray = [];
  activePetsArray = array.slice(cardSliceStart, cardSliceEnd);
}

function takeCardInfo(data) {
  for (let i = 0; i < currentNumSliders; i++) {
    petsContent.insertAdjacentHTML(
      'afterbegin',
      `<div class="pets_card">
<img
  src="${data[activePetsArray[i]].img}"
  alt="pet image"
/>
<h4 class='card_h4'>${data[activePetsArray[i]].name}</h4>
<a class="button">
  <span>Learn more</span>
</a>
</div>`
    );
  }
  petsCards = document.querySelectorAll('.pets_card');
  // cardsArr = petsCards;
}

function takeOldCards() {
  const removeCards = [...document.querySelectorAll('.pets_card')];
  removeCards.forEach((el) => {
    el.remove();
  });
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

onceNext.addEventListener('click', () => {
  if (sliderNumber < maxRange) {
    sliderNumber++;
    takeOldCards();
    getArrSlice();
    countSlider();
    takeCardInfo(dataObj);
  }
});
oncePrev.addEventListener('click', () => {
  if (sliderNumber > 1) {
    sliderNumber--;
    takeOldCards();
    getArrSlice();
    countSlider();
    takeCardInfo(dataObj);
  }
});
doubleNext.addEventListener('click', () => {
  if (sliderNumber < maxRange) {
    sliderNumber = maxRange;
    takeOldCards();
    getArrSlice();
    countSlider();
    takeCardInfo(dataObj);
  }
});
doublePrev.addEventListener('click', () => {
  if (sliderNumber > 1) {
    sliderNumber = 1;
    takeOldCards();
    getArrSlice();
    countSlider();
    takeCardInfo(dataObj);
  }
});

window.addEventListener('load', () => {
  checkWidth();
  getArrSlice();
  takeCardInfo(dataObj);
  petsCards.forEach((el, idx) => {
    el.addEventListener('click', () => {
      popup.style.display = 'flex';
      body.classList.add('stop_scroll');
      let cardName = document.querySelector('.card_h4');
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

window.addEventListener('resize', () => {
  checkWidth();
  if (maxRange != currentNumSliders) {
    takeOldCards();
    countSlider();
    getArrSlice();
    takeCardInfo(dataObj);
  }
});
//popupClose.addEventListener('click', console.log('cl'));

countSlider();
sliderData();
createSlidersContent();
//console.log(petsCards);
