// class GameTest {
//   public = 'я публичныя переменная, все могут меня "взять"';
//   #inputAxisX;
//   #inputAxisY = "хз2";
//   #privateValue;
//   constructor(inputAxisX, inputAxisY) {
//     this.#inputAxisX = inputAxisX; // если не определены, то нужно создавайть метод для записи данных в переменные, а не объявлять их в создании экземпляра класса
//     this.#inputAxisY = inputAxisY; // если не определены, то нужно создавайть метод для записи данных в переменные, а не объявлять их в создании экземпляра класса
//     this.#privateValue = "пусто";
//   }
//   #getX() {
//     return this.#inputAxisX;
//   }
//   seyX() {
//     return alert(this.#getX());
//   }
//   #getY() {
//     return this.#inputAxisY;
//   }
//   seyY() {
//     return alert(this.#getY());
//   }
//   sumXY() {
//     return alert(this.#getY() + this.#getX());
//   }
//   get privateValue() {
//     return this.#privateValue;
//   }

//   set privateValue(newValue) {
//     if (newValue === "") {
//       throw new Error("Ошибка. Введео пустая строка");
//     }
//     this.#privateValue = newValue;
//   }
// }
// // ->
// let game = new GameTest(23, 25);
// alert(game.public);
// game.public = "ну вот...";
// alert(game.public);
// alert(game.privateValue); //get
// game.privateValue = "не пусто"; //set
// alert(game.privateValue); //get с параметроим из set
// game.seyX(); //показать inputAxisX
// game.seyY(); //показать inputAxisY
// game.sumXY(); //показать сумму inputAxisX и inputAxisY
// alert(game.inputAxisX + " ... " + game.inputAxisY); // потому что inputAxisY-X #-приватные, доступ только через методы getY-X
// test_B.addEventListener("click", game);
// // <-

// class NewGameTest extends GameTest {
//   //новый экземпляр класса с дополнительными переменными и методами
//   #inputAxisZ;
//   constructor(inputAxisX, inputAxisY, inputAxisZ) {
//     // передаем значение из класса родителя и доюавлем новое inputAxisZ
//     // ошибка, this не определён!
//     // обязаны вызвать super() до обращения к this
//     super(inputAxisX, inputAxisY); // из класса родительвзять inputAxisX,inputAxisY
//     // а вот здесь уже можно использовать this
//     this.#inputAxisZ = inputAxisZ; // и добавить в класс родитель inputAxisZ
//   }
//   seyZ() {
//     return alert(this.#getZ()); // выводит значение переменной(приватной)
//   }
//   #getZ() {
//     // приватный метод получет значение переменной(приватной)
//     return this.#inputAxisZ;
//   }
// }
// // ->
// const inputAxisX = 1;
// const inputAxisY = 2;
// const inputAxisZ = 3;
// let newGame = new NewGameTest(inputAxisX, inputAxisY, inputAxisZ);
// newGame.seyX();
// newGame.seyY();
// newGame.seyZ();
// // <-




class Game {
  //#приватные переменные
  #inputAxisX;
  #inputAxisY;
  #playingField;
  constructor(inputAxisX, inputAxisY, playingField) {
    //this.объявление переменных класса =
    this.#inputAxisX = inputAxisX;
    this.#inputAxisY = inputAxisY;
    this.#playingField = playingField;
  }
  #takeInputAxisX() {
    return this.#inputAxisX;
  }
  #takeInputAxisY() {
    return this.#inputAxisY;
  }
  #takePlayingField() {
    return this.#playingField;
  }
  #renderDiv() {
    for (let i = 0; i < this.#takeInputAxisX(); i++) {
      this.#takePlayingField().innerHTML = `<div class="playing_field_row">${i}</div>`;
      for (let j = 0; j < this.#takeInputAxisY(); j++) {}
    }
  }
  #write() {
    //приватный метод класса
  }
  get value() {
    //при обращнии к класс.value возвращает данные this
  }
  set value(newValue) {
    //при обращнии к класс.value записывает данные newValue в this
  }
}

let this.#allStep = {
  // player: [{ divX: undefined, divY: undefined }],
  // bomb: [{ divX: undefined, divY: undefined }],
  // wall: [{ divX: undefined, divY: undefined }],
  // box: [{ divX: undefined, divY: undefined }],
  // monster1: [{ divX: undefined, divY: undefined }],
  // monster2: [{ divX: undefined, divY: undefined }],
  // monster3: [{ divX: undefined, divY: undefined }],
};

let store = {
  valueInput: { maxX: 5, maxY: 5 },
  valueMin: 1,
  maxBomb: 1,
  explosionTime: 3000,
  maxWall: 5,
  maxBox:  3,
  maxMonster: 1,
  timeStepMonster: 500,
  life: 3
};

input_axisX.oninput = () => { 
  getInput(); 
  document.getElementById('reset').style.visibility = 'visible';
};
input_axisY.oninput = () => { 
  getInput(); 
  document.getElementById('reset').style.visibility = 'visible';
};
reset.onclick = () => {  
  renderElementGame(); 
  controlPanel();
  document.getElementById('reset').style.visibility = 'hidden';
};
// onpageshow = () => { renderElementGame(); controlPanel();};
onkeydown = () => {
  if(Object.keys(this.#allStep).length !== 0) {
    movePlayer(event.keyCode, this.#allStep.player[1]); 
  }
};

function renderElementGame() {
  // Player
  let stepPlayer = returnRandomSelectDiv();
  controlStyleDiv(rememberStep(stepPlayer));
  // Wall
  for (let i = 1; i <= store.maxWall; i++) {
    let stepWall = returnRandomSelectDiv();
    controlStyleDiv(rememberStep(stepWall,`wall${i}`));
  }
  // Box
  for (let i = 1; i <= store.maxBox; i++) {
    let stepBox = returnRandomSelectDiv();
    controlStyleDiv(rememberStep(stepBox,`box${i}`));
  }
  // Monster
  for (let i = 1; i <= store.maxMonster; i++) {
    let stepMonster1 = returnRandomSelectDiv();
  controlStyleDiv(rememberStep(stepMonster1, `monster${i}`));
  }
}
function rememberStep(newStep, whoStep = 'player' ) {

  if(this.#allStep[whoStep] === undefined) {
    this.#allStep[whoStep] = [];
  }

  let arrStep = this.#allStep[whoStep];

  if ( arrStep.length == 0 ) {
    arrStep.push(undefined);
    arrStep.push(newStep);
  } else if (arrStep.length >= 1) {
    arrStep[0] = arrStep[1];
    arrStep[1] = newStep;
  } else {
    console.log("что-то не так... в получение координат div");
  }

  if(whoStep === 'bomb') {
    arrStep[0] = arrStep[1];
    arrStep[1] = newStep;
  }
  return [arrStep, whoStep];
}
function controlPanel() {
  const controlPanel = document.getElementById("controlGame");
  controlPanel.innerHTML = `<div> Жизней:<b> ${store.life} </b></div>`;
}
function controlStepGame(arrStepNew) {
  let isTrue = false;
  if( Object.keys(this.#allStep).length === 0 ) {
    return true;
  } else if ( arrStepNew !== undefined ) {
    for (const key in this.#allStep) {
      if  ( // проверка на появление игрока и монстров - не в одной клетке
            ( this.#allStep[key][1] === undefined )
          || 
            ( this.#allStep[key][1].divX === undefined
              && 
              this.#allStep[key][1].divY === undefined ) ) {
                //первый на этой точке
            return true;
      } else if(  this.#allStep[key][1].divX === arrStepNew[0]
                  && 
                  this.#allStep[key][1].divY === arrStepNew[1] ) {
            console.log('на этой точке ' + arrStepNew[0] + 'x' + arrStepNew[1] + ' стоит:  - ' + key);
            isTrue = false;
            break;
          } else {
            isTrue = true;
          }
    }
    return isTrue;
  } else {
    console.log('Опять что-то пошло не так... arrStepNew == undefined (нет рандомных чисел)')
  }
}
function controlStyleDiv(arrStep) {
  const whoStep = arrStep[1];
  const stepOld = arrStep[0][0];
  const stepNew = arrStep[0][1];
  let isTrue = false;
 
    if( (this.#allStep[whoStep][0] == undefined) || (this.#allStep[whoStep][0].divX == undefined)) {
      return styleSelectDiv(stepNew, whoStep);
      } else { 
        for (const key in this.#allStep) {
          
          if( (    this.#allStep[key][0] !== undefined 
                && this.#allStep[key][1] !== undefined 
                && this.#allStep[key][0].divX !== undefined 
                && this.#allStep[key][0].divY !== undefined
                && this.#allStep[key][1].divX !== undefined 
                && this.#allStep[key][1].divY !== undefined )
              && 
              ( stepOld.divX === this.#allStep[key][1].divX
                && stepOld.divY === this.#allStep[key][1].divY ) 
            ) {
                isTrue = true;
                break;
          } else {
            isTrue = false;
          }
        }
    if(isTrue) {
      return styleSelectDiv(stepNew, whoStep);
    }
      styleSelectDiv(stepNew, whoStep);
      return deleteStyleSelectDiv(stepOld, whoStep);
    }
}
function getInput() {
  this.#allStep = [];    // очистка stepAll
  const tempArr = [];
  const minSize = store.valueMin;
  const x = store.valueInput.maxX = document.getElementById("input_axisX").value;
  const y = store.valueInput.maxY = document.getElementById("input_axisY").value;
  // расчет максимального заполнения игрового поля
  store.maxWall = Math.floor((store.valueInput.maxX * store.valueInput.maxY)/10);
  store.maxBox = Math.floor((store.valueInput.maxX * store.valueInput.maxY)/5);
  store.maxMonster = Math.floor((store.valueInput.maxX * store.valueInput.maxY)/14);

  if (checkMaxMinValue(x, y)) {
    for (let i = minSize; i <= y; i++) {
      tempArr.push(`<div class="playing_field_row">`);
      for (let j = minSize; j <= x; j++) {
        // tempArr.push(`<div>${i + "-" + j}</div>`);
        tempArr.push(`<div></div>`);
      }
      tempArr.push(`</div>`);
    }
    return (document.getElementById("playing_field").children[0].innerHTML = tempArr.join(""));
  }
  
}
function checkMaxMinValue(x, y) {
  if (x < 5) {
    alert("Ширина игрового поля не может быть меньше 5!");
    return false;
  } else if (x > 24) {
    alert("Ширина игрового поля не может быть больше 24!");
    return false;
  } else if (y > 12) {
    alert("Высота игрового поля не может быть больше 12!");
    return false;
  } else if (y < 5) {
    alert("Высота игрового поля не может быть меньше 5!");
    return false;
  }
  return true;
}
function returnRandomSelectDiv() {
    const maxValueX = store.valueInput.maxX;
    const maxValueY = store.valueInput.maxY;
    const minValue = store.valueMin;
    const divX = Math.floor(Math.random() * (maxValueX - minValue + 1)) + minValue;
    const divY = Math.floor(Math.random() * (maxValueY - minValue + 1)) + minValue;
    
    if(controlStepGame([divX,divY])) {
        return {divX, divY};
    } else {
        return returnRandomSelectDiv();
    }

}
function styleSelectDiv(div, whoStep = 'player') {
  const selectDiv = document.getElementById("playing_field").children[0];
  let rowNumber = div.divX - 1;
  let row = div.divY - 1;
  if (whoStep == "player") {
    selectDiv.children[row].children[rowNumber].className = "selectDivPlayer";
  } else if ( whoStep.substr(0,7) == "monster" ) {
    selectDiv.children[row].children[rowNumber].className = "selectDivMonster";
  } else if ( whoStep.substr(0,4) == "wall" ) {
    selectDiv.children[row].children[rowNumber].className = "selectDivWall";
  } else if ( whoStep.substr(0,3) == "box" ) {
    selectDiv.children[row].children[rowNumber].className = "selectDivBox";
  } else if ( whoStep.substr(0,4) == "bomb" ) {
    selectDiv.children[row].children[rowNumber].className = "selectDivBomb";
  } 
}
function deleteStyleSelectDiv(div) {
  if (div !== undefined) {
    const selectDiv = document.getElementById("playing_field").children[0];
    let rowNumber = div.divX - 1;
    let row = div.divY - 1;
    selectDiv.children[row].children[rowNumber].className = "";
  }
  return;
}
function contorlMove(stayHere,nextStep,who) {
  const maxX = store.valueInput.maxX;
  const maxY = store.valueInput.maxY;
  const minX = store.valueMin;
  const minY = store.valueMin;
  // Ограничение игрового поля
  if(  ( nextStep.divX < minX ) 
    || ( nextStep.divY < minY )
    || ( nextStep.divX > maxX )  
    || ( nextStep.divY > maxY ) 
    ) {
    return stayHere;
  } else {
      if( who !== undefined
          &&
          who.substr(0,7) == "monster" // если это монстр
          &&
          atacaMonster(nextStep) ) {  // и на следующем шаге стоит игрок
            store.life > 0 ? store.life = store.life - 1 : store.life = 0;
            controlPanel();
            // itGameOver(stepAll['player'][1]); 
            return nextStep;
          } 
    // взаимодействие с объектами
    for (const key in this.#allStep) {   // перебор всех элементов на игровом поле
      if (this.#allStep.hasOwnProperty(key)) {  // есть ли key у stepAll
        
        if( 
          (  
            this.#allStep[key][1] !== undefined  // есть ли [1] у key
            && this.#allStep[key][1].divX !== undefined  // есть ли divX у key[1]
            && this.#allStep[key][1].divY !== undefined ) // есть ли divY у key[1]
          &&
          ( nextStep.divX === this.#allStep[key][1].divX  // не стоит ли кто на этой точке, если да, то никуда не двигаемся
            && nextStep.divY === this.#allStep[key][1].divY )
          ) {
            return stayHere;
        }
      }
    }
    return nextStep;
  }
}
function movePlayer(keybord, stayHere) {
  const upRow = 38;
  const downRow = 40;
  const leftColumn = 37;
  const rightColumn = 39;
  const bobm = 32;
  let nextStep = {...stayHere};
  
  if( stayHere !== undefined ) {
    switch (keybord) {
      case upRow:
        nextStep.divY = stayHere.divY - 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep),  ));
        break;
      case rightColumn:
        nextStep.divX = stayHere.divX + 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep)));
        break;
      case leftColumn:
        nextStep.divX = stayHere.divX - 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep)));
        break;
      case downRow:
        nextStep.divY = stayHere.divY + 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep)));
        break;
      case bobm:
        if( store.maxBomb >= 1 ) {
          controlBomb(stayHere);
          controlStyleDiv(rememberStep(stayHere,`bomb`));
        }
        break;
      default:
        break;
    }
  }
}
function controlBomb(hereStayBomb) {
  store.maxBomb -= 1;
  setTimeout(() => {
    renderExplosion(hereStayBomb,'explosion');
    setTimeout(() => {
      store.maxBomb += 1;
      renderExplosion(hereStayBomb,'clearExplosion');
    },store.explosionTime);
  },store.explosionTime);
  
}
function destructionBomb(step) {
  step.divX += 1;
  step.divY += 1;
  for (const key in this.#allStep) {
    // взаимодействие взрыва со стеной
    if(key.substr(0,4) == "wall" ) {
      if( this.#allStep[key][1] !== undefined
          &&
          this.#allStep[key][1].divX === step.divX 
          &&
          this.#allStep[key][1].divY === step.divY 
        ) {
          return false;
      } 
    } else if ( key.substr(0,3) == "box" ) {
        if( this.#allStep[key][1] !== undefined
            &&
            this.#allStep[key][1].divX === step.divX 
            &&
            this.#allStep[key][1].divY === step.divY 
        ) {
          this.#allStep[key][1] = undefined;
          return true;
      } 
    } else if ( key.substr(0,7) == "monster" ) {
      if( this.#allStep[key][1] !== undefined
          &&
          this.#allStep[key][1].divX === step.divX 
          &&
          this.#allStep[key][1].divY === step.divY 
      ) {
        this.#allStep[key][1] = undefined;
        return true;
        } 
    } else if ( key == "player" ) {
      if( this.#allStep[key][1] !== undefined
          &&
          this.#allStep[key][1].divX === step.divX 
          &&
          this.#allStep[key][1].divY === step.divY 
          ||
          ( this.#allStep[key][1].divX === this.#allStep['bomb'][0].divx
            && 
            this.#allStep[key][1].divY === this.#allStep['bomb'][0].divY )
      ) {
        store.life = store.life - 1;
        controlPanel();
        itGameOver(this.#allStep[key][1]);    
        return true;
        } 
    }
  } 
  deleteStyleSelectDiv(this.#allStep['bomb'][1]);  // убрать бомбу после взрыва
  this.#allStep['bomb'][1] = undefined;  // убрать бомбу с поля
  return true;
} 
function checkRenderBomb(nextRenderDiv) {
  const maxX = store.valueInput.maxX - 1 ;
  const maxY = store.valueInput.maxY - 1;
  const minX = store.valueMin;
  const minY = store.valueMin;
  // Ограничение игрового поля
  if(  ( nextRenderDiv.divX < 0) 
    || ( nextRenderDiv.divY < 0 )
    || ( nextRenderDiv.divX > maxX )  
    || ( nextRenderDiv.divY > maxY ) 
    ) {
    return false;
  } 
  else { return destructionBomb(nextRenderDiv);}
}
function renderExplosion(hereStayBomb,typyRender) {
  const selectDiv = document.getElementById("playing_field").children[0];
  const maxLenghtExplosion = 3;
  let rowNumber = hereStayBomb.divX - 1; // selectDiv.children[row].children[nextStep].className row и nextStep в масииве наинаются с 0!!!!
  let row = hereStayBomb.divY - 1;
  typyRender ==  'explosion' 
    ? typyRender =`${typyRender + 'Bomb'}` 
    : typyRender = '';
    for (let i = 1; i <= maxLenghtExplosion; i++) {
      let nextStep = rowNumber + i;
      if( checkRenderBomb({divX:nextStep, divY: row}) ) {
        selectDiv.children[row].children[nextStep].className = `${typyRender}`;  
      } else {break;}  
    }
    for (let i = 1; i <= maxLenghtExplosion; i++) {
      let nextStep = rowNumber - i;
      if( checkRenderBomb({divX:nextStep, divY: row}) ) {
        selectDiv.children[row].children[nextStep].className = `${typyRender}`;  
      } else {break;}   
    }
    for (let i = 1; i <= maxLenghtExplosion; i++) {
      let nextStep = row + i;
      if( checkRenderBomb({divX:rowNumber, divY: nextStep}) ) {
        selectDiv.children[nextStep].children[rowNumber].className = `${typyRender}`;    
      } else {break;} 
    }
    for (let i = 1; i <= maxLenghtExplosion; i++) {
      let nextStep = row - i;
      if( checkRenderBomb({divX:rowNumber, divY: nextStep}) ) {
        selectDiv.children[nextStep].children[rowNumber].className = `${typyRender}`;   
      } else {break;}   
    }
  
}
function itGameOver() {
  if( store.life <= 0 ) {
    this.#allStep['player'][1] = undefined; 
    alert('конец');
    store.life = 3;
    store.maxBomb = 1;
    document.getElementById('reset').style.visibility = 'visible';
  }
}
setInterval(() => {
  moveMonster();
}, store.timeStepMonster);

function moveMonster() {
  for (const key in this.#allStep) {
    if( key.substr(0,7) == "monster" ) {
      controlMoveMonster(this.#allStep[key][1], key);
    }
  }
}
function controlMoveMonster(stayHere, who) {
  const moveDirection = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    let nextStep = {...stayHere};
    if( stayHere !== undefined ) {
    switch (moveDirection) {
      case 1:
        nextStep.divY = stayHere.divY - 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep, who),  who));
        break;
      case 2:
        nextStep.divX = stayHere.divX + 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep, who), who));
        break;
      case 3:
        nextStep.divX = stayHere.divX - 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep, who), who));
        break;
      case 4:
        nextStep.divY = stayHere.divY + 1;
        controlStyleDiv( rememberStep( contorlMove(stayHere,nextStep, who), who));
        break;
      default:
        break;
    }
  }
}
function atacaMonster(step) {
  // step.divX += 1;
  // step.divY += 1;
      if( this.#allStep["player"][1] !== undefined
          &&
          this.#allStep["player"][1].divX === step.divX 
          &&
          this.#allStep["player"][1].divY === step.divY 
       ) {
         return true;
      } else {
        return false;
      }
    }

// inputAxisX.onclick = () => (inputAxisX.value = 100000);

// inputAxisX.addEventListener("click", test);

// inputAxisY.onkeydown = () => test();
// function test() {
//   let x = event.key;
//   let y = event.keyCode;
//   alert(x + " " + y);
// }

// testB.addEventListener('click', {
//     handleEvent(event) {
//         playingField.innerHTML = ` ${event.type} на  ${event.currentTarget})`;
//     }
//   });

// input_AxisX.onclick = function (event) {
//   // вывести тип события, элемент и координаты клика
//   alert(event.type + " на " + event.currentTarget);
//   alert("Координаты: " + event.clientX + ":" + event.clientY);
// };
//   event.type
//   Тип события, в данном случае "click".
//   event.currentTarget
//   Элемент, на котором сработал обработчик. Значение – обычно такое же, как и у this, но если обработчик является функцией-стрелкой или при помощи bind привязан другой объект в качестве this, то мы можем получить элемент из event.currentTarget.
//   event.clientX / event.clientY
//   Координаты курсора в момент клика относительно окна, для событий мыши.
//   Есть также и ряд других свойств, в зависимости от типа событий, которые мы разберём в дальнейших главах.

//   class Menu {
//     handleEvent(event) {
//       switch(event.type) {
//         case 'mousedown':
//             playingField.innerHTML = "Нажата кнопка мыши";
//           break;
//         case 'mouseup':
//             playingField.innerHTML += "...и отжата.";
//           break;
//       }
//     }
//   }

//   let menu = new Menu();
//   inputAxisY.addEventListener('mousedown', menu);
//   inputAxisY.addEventListener('mouseup', menu);

//   class Menu {
//     handleEvent(event) {
//       // mousedown -> onMousedown
//       let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
//       this[method](event);
//     }

//     onMousedown() {
//       elem.innerHTML = "Кнопка мыши нажата";
//     }

//     onMouseup() {
//       elem.innerHTML += "...и отжата.";
//     }
//   }

//   let menu = new Menu();
//   elem.addEventListener('mousedown', menu);
//   elem.addEventListener('mouseup', menu);
