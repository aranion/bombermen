class Game { 
  #allStep = {};
  #itGameOverOrWin = false;
  #idRenderGameZone = {
    idGameZone: '',
    idControlPanel: '',
    idButtonPlay: '',
    idControlLevel
  };
  #valueGameZone = {
    valueInputMaxX: 5,
    valueInputMaxY: 5,
    valueInputMin:  1
  };
  #gameLevel = 1;
  #gameElement = { 
    player:       [ 1, { lifePlayer: 3 } ],
    bomb:         [ 0, { explosionTime: 3000, maxBomb: 2, maxExplosion: 3 } ],
    wall:         [ 3 ],
    box:          [ 4, { destroyedBox: 0 } ],
    monster:      [ 2, { destroyedMonster: 0 } ]
  };
  #boxUpgrade = {
    addExplosion:   [ 2, {} ],
    addBomb:        [ 0, {} ], 
    addLifePlayer:  [ 1, {} ]
  };
  constructor( idGameZone, idControlPanel, idButtonPlay, idControlLevel ) {
    this.#idRenderGameZone.idGameZone = idGameZone;
    this.#idRenderGameZone.idControlPanel = idControlPanel;
    this.#idRenderGameZone.idButtonPlay = idButtonPlay;
    this.#idRenderGameZone.idControlLevel = idControlLevel;
  }
  get allStep() {                                   // получить место расположение элементов на поле
    return this.#allStep;
  }
  get hereStayBomb() {
    return this.#allStep['bomb'][1];
  }
  get hereStayPlayer() {
    return this.#allStep['player'][1];
  }
  get hereStayMonsters() {                          // возвращает массив с тем где стоит какой монстр
    const temp = [];
    for (const key in this.#allStep) {
      if( key.substr(0,7) == "monster" ) {
        temp.push( [  key, this.#allStep[key][0], this.#allStep[key][1] ] );
      }
    }
    return temp;
  }
  get returnLevel() {
    return this.#gameElement;
  }
  get valueInput() {
    return { maxX: this.#valueGameZone.valueInputMaxX, maxY: this.#valueGameZone.valueInputMaxY, min: this.#valueGameZone.valueInputMin };
  }
  set valueInput( newValue ) { 
    if ( newValue === undefined ) {
      throw new Error("Ошибка! 'newValue' = undefined (" + newValue + " );");
    } else {
      this.#valueGameZone.valueInputMaxX = newValue.maxX;
      this.#valueGameZone.valueInputMaxY  = newValue.maxY;
      newValue.min === undefined 
        ? this.#valueGameZone.valueInputMin = 1 
        : this.#valueGameZone.valueInputMin = newValue.min;
    }
  }
  set infoBomb( obj ) {
    const { maxBomb, explosionTime, lengthExplosion } = obj;
    this.#gameElement.bomb[1].maxBomb = maxBomb; 
    this.#gameElement.bomb[1].explosionTime = explosionTime;
    this.#gameElement.bomb[1].lengthExplosion = lengthExplosion;
  }
  get infoBomb() { 
    return { maxBomb:         this.#gameElement.bomb[1].maxBomb, 
             explosionTime:   this.#gameElement.bomb[1].explosionTime, 
             lengthExplosion: this.#gameElement.bomb[1].lengthExplosion };
  }
  set lifePlayer( lifePlayer ) {
    this.#gameElement.player[1].lifePlayer = lifePlayer;
  }
  #rememberStep( newStep, whoStep ) {               // добавить координаты элементов в #allStep 
    if ( this.#allStep[whoStep] === undefined )  {
      this.#allStep[whoStep] = [];
    } 
    if ( this.#allStep[whoStep][0] === undefined
         && 
         this.#allStep[whoStep][1] === undefined ) { // добавить координаты элемента при старте
      this.#allStep[whoStep].push( undefined );
      this.#allStep[whoStep].push( newStep );
    } else if (this.#allStep[whoStep].length >= 1) { // значение на новом месте переносятся на старое и в новое записываются новые данные  
      this.#allStep[whoStep][0] = {...this.#allStep[whoStep][1]};
      this.#allStep[whoStep][1] = newStep;
    } 
    if(whoStep === 'bomb') {
      this.#allStep[whoStep][0] =  this.#allStep[whoStep][1];
      this.#allStep[whoStep][1] = newStep;
    }
  }
  #rememberBoxUpgrade() {
    const obj = this.#boxUpgrade;
    for (const key in  obj ) {
      if ( obj.hasOwnProperty(key) && obj[key][0] !== 0 ) {
        for (let i = 0; i < obj[key][0]; i++) {
          let randomBox = this.#returnRandomBox();
          obj[key][1][randomBox] = this.#allStep[randomBox][1];          
        }
      }
    }
  }
  #returnRandomNewStep() {                          // Вернуть случайные координаты для элементов
    const x = Math.floor(
      Math.random() 
        * ( this.#valueGameZone.valueInputMaxX 
          - this.#valueGameZone.valueInputMin + 1 ) ) 
        + this.#valueGameZone.valueInputMin;
    const y = Math.floor(
      Math.random() 
        * ( this.#valueGameZone.valueInputMaxY 
          - this.#valueGameZone.valueInputMin + 1 ) ) 
        + this.#valueGameZone.valueInputMin;
    if ( this.#itSingleStep( [x,y] ) ) {            // стоит ли кто на этой клетке, false = стоит
        return { x, y };
    } else {
        return this.#returnRandomNewStep();
    }
  }
  #returnRandomBox() {                              // вернуть случайный ящик
    const randomBox = `box${Math.floor( Math.random() * ( this.#gameElement.box[0]) - 1 + 1) + 1}`
    if ( this.#checkUniqueBoxUpgrade( randomBox )[0] ) {
      return this.#returnRandomBox();
    } else {
      return randomBox;
    }
  }
  #resetData() {                                    // сбросс данных
    this.#allStep = {};                             // очистка allStep, в связи с изменением размера игрового поля
    this.#gameElement.bomb[1] = { explosionTime: 3000, maxBomb: 1, maxExplosion: 3 };
    this.#gameElement.player[1] = { lifePlayer: 3 };
    this.#itGameOverOrWin = false;
    this.#gameElement.monster[1].destroyedMonster = 0; // сброс количествоубитых монстров
    this.#gameElement.box[1].destroyedBox = 0;        // сброс количество разрушенных ящиков
    this.#idRenderGameZone.idControlPanel.style.visibility = 'hidden'; 
  }
  #beginStepGameElement( whoStay, maxElement ) {    // расстановка элементов на игровом поле и отрисовка
    for (let i = 1; i <= maxElement; i++) {
      let whoStayTemp = whoStay;                    // для сброса счетчика последовательности 
      whoStayTemp !== 'player' ? whoStayTemp += i : whoStay;
      this.#rememberStep(
        this.#returnRandomNewStep(),                //случайное появление
        whoStayTemp );
      this.#addStyleElement( this.#allStep[whoStayTemp][1], whoStayTemp ); // присвоение класса для отрисовки
    }
  }
  #calcMaxGameElement( maxX, maxY ) {               // расчет максимального количества элементов на игровом поле
    this.#gameElement.wall[0] = Math.floor( ( maxX * maxY ) / 10 );
    this.#gameElement.box[0] = Math.floor( ( maxX * maxY ) / 5 );
    this.#gameElement.monster[0] = Math.floor( ( maxX * maxY ) / 14 );
    this.#boxUpgrade.addExplosion[0] = Math.floor( ( maxX * maxY ) / 60 );
    this.#boxUpgrade.addBomb [0] = Math.floor( ( maxX * maxY ) / 70 );
    this.#boxUpgrade.addLifePlayer[0] = Math.floor( ( maxX * maxY ) / 50 );
  }
  #calcGameLevel() {
    this.#gameLevel = +this.#valueGameZone.valueInputMaxX 
                      + +this.#valueGameZone.valueInputMaxY 
                      - 9;
  }
  #addStyleElement( stepElement, whoStep ) {        //присвоение класса в зависимости от типа элемента
    if ( whoStep == "player" ) {
      this.#toApplyClass( stepElement, "selectDivPlayer" );
    } else if ( whoStep.substr(0,7) == "monster" ) {
      this.#toApplyClass( stepElement, "selectDivMonster" );
    } else if ( whoStep.substr(0,4) == "wall" ) {
      this.#toApplyClass( stepElement, "selectDivWall" );
    } else if ( whoStep.substr(0,3) == "box" ) {
      this.#toApplyClass( stepElement, "selectDivBox" );
    } else if ( whoStep.substr(0,4) == "bomb" ) {
      this.#toApplyClass( stepElement, "selectDivBomb" );
    } else if ( whoStep.substr(0,9) == "explosion" ) {
      this.#toApplyClass( stepElement, "explosionBomb" );
    } else if ( whoStep  == "dead" ) {
      this.#toApplyClass( stepElement, "deadFromBombPlayer" );
    } else if ( whoStep  == "deadMonster" ) {
      this.#toApplyClass( stepElement, "deadFromBombMonster" );
    } else if ( whoStep == "addExplosion" ) {
      this.#toApplyClass( stepElement, "addExplosion" );
    } else if ( whoStep == "addBomb" ) { 
      this.#toApplyClass( stepElement, "selectDivBombX2" );
    } else if ( whoStep == "addLifePlayer" ) {
      this.#toApplyClass( stepElement, "addLifePlayer" );
    } 
  } 
  #deleteStyleElement( stepElement ) {              // удаление стиля у элемента
    if ( stepElement !== undefined ) {
      this.#toApplyClass( stepElement, "" );
    }
  }
  #toApplyClass( stepElement, className ) {         // найти нужный элемент для присвоения класса
    const rowNumber = stepElement.x - 1;            // в массиве отсчет начинается с 0 
    const row = stepElement.y - 1;                  // в массиве отсчет начинается с 0
    this.#idRenderGameZone.idGameZone.children[row].children[rowNumber].className = className;
  }
  #clearExplosion() {                               // удалить все после взрыва
    for (const key in this.#allStep) {
      if( this.#allStep.hasOwnProperty(key)         // если объект существует и равен 'explosion'
          && 
          key.substr(0,9) == "explosion" ) {
        this.#deleteStyleElement(this.#allStep[key][1]); // удалить стиль отрисовки взрыва
        delete this.#allStep[key];                  // удалить взрыв из объекта allStep
      }
    } 
  }
  #controlPanel() {                                 // Отображение данных об игре
    this.#idRenderGameZone.idControlPanel.innerHTML = 
      `<div> Уровень: ${this.#gameLevel}</div>
       <div> Жизней:<b> ${this.#gameElement.player[1].lifePlayer} </b> </div>
       <div> Бомб:<b> ${this.#gameElement.bomb[0] + ' / ' + this.#gameElement.bomb[1].maxBomb} </b></div>
       <div> Таймер взрыва:<b> ${this.#gameElement.bomb[1].explosionTime / 1000 + 'c'} </b></div>
       <div> Монстров:<b> ${this.#gameElement.monster[1].destroyedMonster + ' из ' + this.#gameElement.monster[0]} </b></div>
       <div> Ящиков:<b> ${this.#gameElement.box[1].destroyedBox + ' из ' + this.#gameElement.box[0]} </b></div>
       `; 
    this.#idRenderGameZone.idControlPanel.style.visibility = 'visible';  
  }
  #nextGamePanel( itWinOrOver ) { 
    // this.#idRenderGameZone.idControlLevel.style.display = 'block';
    if ( itWinOrOver ) {
      this.#idRenderGameZone.idControlLevel.innerHTML = 
      `<div><h2>Вы выиграли ${this.#gameLevel} уровень! </h2>
       <input type="button" id="nextLevel" onclick="nextLevel();" value="Следующий уровень ${this.#gameLevel + 1}"> </div>
      `; 
    } else {
      this.#idRenderGameZone.idControlLevel.innerHTML = 
      `<div><h2>Вы проиграли! </h2>`;
      this.#idRenderGameZone.idButtonPlay.style.visibility = 'visible';
    }
  }
  #takeLifePlayer( value ) {                        // жизни игрока +-
    if ( ( value < 0 ) && this.#gameElement.player[1].lifePlayer + value <=0 ) {
      this.#gameElement.player[1].lifePlayer = 0;
    } else {
      this.#gameElement.player[1].lifePlayer = +this.#gameElement.player[1].lifePlayer + value;
    }
    this.#controlPanel();
    this.#checkGameOver();
  }
  #addUpgrade( upgrade ) {
    switch (upgrade) {
      case 'explosion':
        this.#gameElement.bomb[1].lengthExplosion += 1;
        break;
      case 'explosionNegative':
        if ( this.#gameElement.bomb[1].lengthExplosion <= 1 ) {
          this.#gameElement.bomb[1].lengthExplosion = 1;
        } else {
          this.#gameElement.bomb[1].lengthExplosion -= 1;
        }
        break;
      case 'addBomb':
        this.#valueMaxBomb( +1 );
        break;
      case 'addBombNegative':
        this.#valueMaxBomb( -1 );
        break;
      case 'lifePlayer':
        this.#takeLifePlayer( +1 );
        break;
      case 'lifePlayerNegative':
        this.#takeLifePlayer( -1 );
        break;
      default:
        break;
    }    
  } 
  #valueMonster() {                                 // уничтожить одного монстра
    this.#gameElement.monster[1].destroyedMonster = this.#gameElement.monster[1].destroyedMonster + 1;
    this.#controlPanel();
    this.#chekWin();
  }
  #valueBox() {                                     // уничтожить один ящик
    this.#gameElement.box[1].destroyedBox = this.#gameElement.box[1].destroyedBox + 1;
    this.#controlPanel();
  }
  #valueMaxBomb( value ) {
    if ( ( value < 0 ) && ( +this.#gameElement.bomb[1].lengthExplosion - value ) < 1 ) {
      this.#gameElement.bomb[1].maxBomb = 1;
    } else {
      this.#gameElement.bomb[1].maxBomb = +this.#gameElement.bomb[1].maxBomb + value;
    }
    this.#controlPanel();
  }
  #valueBomb( value ) {
    this.#gameElement.bomb[0] = +this.#gameElement.bomb[0] + value;
    this.#controlPanel();
  }
  #ifPlayerOnBombNotRender( whoStep ) {             // проверить и отрисовать, если игрок или монстр стоит на бомбе ничего не отрисовывать
    if( ( whoStep == 'player' || whoStep.substr(0,7) == 'monster' )
        &&
        ( this.#allStep[whoStep][0] === undefined   // если первоночальное значение undefined, то игрок поставил бомбу сразу
          || 
          ( this.#allStep[whoStep][0].x == this.#allStep[whoStep][1].x    // положение бомбы совподает c игроком
            && 
            this.#allStep[whoStep][0].y == this.#allStep[whoStep][1].y ) ) ) {
      return ;
    } else {
      return this.#addStyleElement( this.#allStep[whoStep][1], whoStep ); // отрисовать на новой клетке
    }
  }
  #renderMove( whoStep ) {                          // отрисовать движение элемента и изменить стиль если он проходит сквозь взрыв
    if (this.#allStep.hasOwnProperty( 'bomb') ) {   // если существует элемент 'бомба', если нет, то цикл делать не надо
      for ( const key in this.#allStep ) {
        if ( key.substr(0,9) === "explosion"        // если следующий шаг идет на взрыв
             && this.#allStep[key][1].x ===  this.#allStep[whoStep][1].x
             && this.#allStep[key][1].y ===  this.#allStep[whoStep][1].y  ) {
          delete this.#allStep[key];                // удаляем элемент взрыва 
          if ( whoStep == 'player') {               // отрисовать пепел игрока
            this.#addStyleElement( this.#allStep[whoStep][1], 'dead' );
            break; 
          } else if ( whoStep.substr(0,7) == 'monster' ){              // отрисовать пепел монстра
            this.#addStyleElement( this.#allStep[whoStep][1], 'deadMonster' );
            delete this.#allStep[whoStep];
            break;
          } 
        } else {                                    // иначе просто отрисовать обычный стиль элемента
          this.#addStyleElement( this.#allStep[whoStep][1], whoStep ); // отрисовать на новой клетке
        }
        this.#deleteStyleElement( this.#allStep[whoStep][0] );         // всегда удаляем стиль прошлого шага
      }
    } else {                                        // просто отрисовали элемент и удалили стиль на старом месте если нет элемента "бомба"
      this.#addStyleElement( this.#allStep[whoStep][1], whoStep );     // отрисовать на новой клетке
      this.#deleteStyleElement( this.#allStep[whoStep][0] );           // и удалить на старой клетке
    }
  }
  
  renderGameZone( nextLevel ) {                     // запуск отрисовки игрового поля
    const tempArr = [];
    const min = this.#valueGameZone.valueInputMin;
    const maxX = this.#valueGameZone.valueInputMaxX;
    const maxY = this.#valueGameZone.valueInputMaxY;

    this.#resetData();                              // обнуление данных 
    this.#calcGameLevel();
    this.#calcMaxGameElement( maxX, maxY );         // выполнить подсчет количества элементов на игровом поле
    
    if ( this.#checkMaxMinValue( maxX, maxY ) ) {
      for (let i = min; i <= maxY; i++) {
        tempArr.push(`<div class="playing_field_row">`); // добавление строки
        for (let j = min; j <= maxX; j++) {
          tempArr.push(`<div></div>`);              // добавление элемента строки
        }
        tempArr.push(`</div>`);                     // завершение строки
      }
      return this.#idRenderGameZone.idGameZone.innerHTML = tempArr.join("");
    } else {
      throw new Error("Ошибка! Параметры размера игрового поля не верны!");
    }
  } 
  startRenderGameElement() {                        // запуск первоночальной отрисовки элементов на игровом поле
    for ( const key in this.#allStep ) {            // убрать все классы, для удаления элементов с поля
      if ( this.#allStep[key][1] !== undefined ) {
       this.#deleteStyleElement( {x:this.#allStep[key][1].x,y:this.#allStep[key][1].y} )
      }
    }

    // this.#idRenderGameZone.idButtonPlay.style.visibility = 'hidden';
    // this.#idRenderGameZone.idControlLevel.style.display = 'none';

    this.#allStep = {};                             // перезапуск игры, обнуление шагов

    for (const key in this.#gameElement) {          // заполнить первоночальными элементами игровое поле
      if (this.#gameElement.hasOwnProperty(key)) {
        this.#beginStepGameElement( key, this.#gameElement[key][0] ); 
      }
    }
    // this.#controlPanel();
    this.#rememberBoxUpgrade();                     // выбрать ящики и запомнить их, для upgrade игрока после уничтожения ящика
  } 
  renderMoveGameElement( infoRenderElements ) {     // отрисовать движение элментов по полю
    if ( infoRenderElements !== undefined ) { 
      const [ nextStepElement, hereStayElement, whoStep ] = infoRenderElements;
      
      if ( whoStep !== 'explosion' ) {              // если это не взрыв - отрисовываем элемент
        if ( whoStep !== 'bomb' || ( whoStep == 'bomb' && this.#gameElement.bomb[0] < this.#gameElement.bomb[1].maxBomb ) ) { // если это любой элемент кроме бомбы или бомба, но с доступным количеством бомб
          if ( whoStep == 'bomb' ) {                // если бомба, снижаем количетво доступных бомб
            this.#valueBomb( +1 );
          }

          this.#rememberStep(                       // запомнить новые координаты элемента 
            this.#contorlMoveRender( hereStayElement, nextStepElement, whoStep ), // передаст координаты элемента в 'rememberStep' после проверки 'contorlMoveRender'
            whoStep);

          if ( this.#controlStyle( whoStep ) ){     // одинаковы ли новые и старые координаты
            this.#ifPlayerOnBombNotRender( whoStep ); // если игрок на бомбе, то отрисовка не происходит
          } else {                                  // присвоить класс и удалить на старом месте, так же отрисовать 
            this.#renderMove( whoStep );            // отрисовать элемен в зависимости от того двигается ли он через взрыв
          }
        }
      } else if ( nextStepElement !== undefined ) { // если это взрыв и следующий шаг определен
        for ( let i = 0; i < nextStepElement.length; i++ ) { // перебор элементов взрыва, запоминание, отрисовка
          for ( let j = 0; j < nextStepElement[i].length; j++ ) {
            // let oldStep = ( j == 0 ) ? explosion[i][0] : explosion[i][j - 1];
            let explosionType = `${whoStep + i + j}`; 
            let nextStepExplosion = nextStepElement[i][j];
            
            if( this.#controlDestruction( nextStepExplosion ) ) { // контроль за взаимодействием с объектами
              break;                                // если правда, то пропускаем - объект не разрушим
            } else {                                // иначе запоминаем взрыв и объект уничтожается(смена стиля)
              this.#rememberStep(
                this.#contorlMoveRender( hereStayElement, nextStepExplosion, whoStep ), // передаст координаты взрыва в 'rememberStep' после проверки 'contorlMoveRender'
                explosionType );
              this.#addStyleElement( this.#allStep[explosionType][1], explosionType );
            }
          }
        }
        setTimeout( () => {                         // продолжительность взрыва
          this.#clearExplosion();                   // очистить стили после взрыва
          this.#valueBomb( -1 );                    // бомба взорвалась, можно пополненить счетчика бомб
        }, this.#gameElement.bomb[1].explosionTime / 2 ) // время через которое будет удален взрыв
      } 
      this.#controlPanel();
    }
    // if ( this.#itGameOverOrWin ) { // если игра выйграна или проиграна не запускаем ничего проверкк chekGameOverAndWin
    //    return;
    // }
    // return this.#chekGameOverAndWin();
  }
  nextLevel() { 
    if ( this.#gameLevel < 20 )  {                   // следующий уровень, то изменить игровое поле и сохранить данные об игроке
      this.#valueGameZone.valueInputMaxX =  +this.#valueGameZone.valueInputMaxX + 1;
    } else {
      this.#valueGameZone.valueInputMaxY = +this.#valueGameZone.valueInputMaxY + 1;
      if (this.#gameLevel > 26 ) {
        return alert( 'Это последний уровень! :)');
      }
    }
  }
  
  #checkMaxMinValue( maxX, maxY ) {                 // проверка на максимальные значения игрового поля
    if ( maxX < 5 ) {
      alert( "Ширина игрового поля не может быть меньше 5!");
      return false;
    } else if ( maxX > 24 ) {
      alert( "Ширина игрового поля не может быть больше 24!");
      return false;
    } else if (maxY > 12 ) {
      alert( "Высота игрового поля не может быть больше 12!");
      return false;
    } else if ( maxY < 5 ) {
      alert( "Высота игрового поля не может быть меньше 5!");
      return false;
    }
    return true;
  }
  #itSingleStep( step ) {                           // проверка, стоит ли кто на этом месте step
    let isTrue = false;
    if ( Object.keys(this.#allStep).length === 0 ) { // объект пустой, никого ни где нет
      return true;
    } else if ( step !== undefined ) {
      for ( const key in this.#allStep ) {
        if ( ( this.#allStep[key][1] === undefined ) // если undefined, то key не стоит тут 
             || 
             ( this.#allStep[key][1].x === undefined
               && 
               this.#allStep[key][1].y === undefined ) ) {
          isTrue = true; 
        } else if ( this.#allStep[key][1].x === step[0] // стоит ли кто на этом месте
                    && 
                    this.#allStep[key][1].y === step[1] ) {
          // console.log('на этой точке ' + step[0] + 'x' + step[1] + ' стоит:  - ' + key);
          
          if ( step[2] !== undefined                // если двигающийся элемент - монстр, и он идет на игрока
               && step[2].substr(0,7) == "monster" 
               && key === "player") {
            this.#takeLifePlayer( -1 ); // минус жизнь, убил монстр
            isTrue = true;                          // двигается дальше
            // console.log('на точке ' + step[0] + 'x' + step[1] + ' был ИГРОК... Уничтожен...');
            break;
          }
         
          if ( step[2] == "player"
               &&
               key.substr(0,9) === "explosion" ) {  // на клетке взрыв, идти можно но минус 1 жизнь
            this.#takeLifePlayer( -1 );                 // минус жизнь, убил взрыв
            isTrue = true; 
            // console.log('на точке ' + step[0] + 'x' + step[1] + ' ОГОНЬ!');
            break;
          }

          if ( step[2] !== undefined
               &&
               step[2].substr(0,7) == "monster"
               &&
               key.substr(0,9) === "explosion" ) {  // на клетке взрыв, и туда идет монстр, минус 1 монстр...
            isTrue = true; 
            this.#valueMonster();                   // просто подсчет оставшихся монстров
            // console.log('на точке ' + step[0] + 'x' + step[1] + ' был монст... СГОРЕЛ...');
            break;
          }

          if ( step[2] == "player"                  // если игрок двигается на элемент 'addExplosion'
               && 
               key.substr(0,12)  == "addExplosion") {
            this.#addUpgrade( 'explosion' );                   // длина взрыва увеличится на 1
            // this.#allStep[key] = undefined; 
            delete this.#allStep[key];
            isTrue = true;                          // двигается дальше
            break;
          }

          if ( step[2] !== undefined
               &&
               step[2].substr(0,7) == "monster"     // если монстр двигается на элемент 'addExplosion'
               && 
               key.substr(0,12)  == "addExplosion" ) {
            this.#addUpgrade( 'explosionNegative' ); 
            delete this.#allStep[key];
            isTrue = true;                          // двигается дальше
            break;
          }

          if ( step[2] == "player"                  // если игрок двигается на элемент 'addExplosion'
               && 
               key.substr(0,13)  == "addLifePlayer") {
            this.#addUpgrade( 'lifePlayer' );       // добавить дополнительную жизнь
            // this.#allStep[key] = undefined; 
            delete this.#allStep[key];
            isTrue = true;                          // двигается дальше
            break;
          }

          if (  step[2] !== undefined
                &&
                step[2].substr(0,7) == "monster"     // если монстр двигается на элемент 'addExplosion'
                && 
                key.substr(0,13)  == "addLifePlayer" ) {
            this.#addUpgrade( 'lifePlayerNegative' ); 
            delete this.#allStep[key];
            isTrue = true;                          // двигается дальше
            break;
          }

          if ( step[2] == "player"                  // если игрок двигается на элемент 'addExplosion'
               && 
               key.substr(0,7)  == "addBomb") {
            this.#addUpgrade( 'addBomb' );          // добавить дополнительную жизнь
            delete this.#allStep[key];
            isTrue = true;                          // двигается дальше
            break;
          }

          if (  step[2] !== undefined
                &&
                step[2].substr(0,7) == "monster"     // если монстр двигается на элемент 'addExplosion'
                && 
                key.substr(0,7)  == "addBomb" ) {
            this.#addUpgrade( 'addBombNegative' ); 
            delete this.#allStep[key];
            isTrue = true;                          // двигается дальше
            break;
          }
          

          isTrue = false;                            // клетка занята
          break;
        } else {
          isTrue = true;
        }
      }
      return isTrue;
    } else {
      throw new Error("Опять что-то пошло не так... step == undefined ");
    }
  }
  #contorlMoveRender( stayHere, nextStep, whoStep ) { // проверка ограничения движения игровым полем
    if(  whoStep == 'bomb'                          // если бомба, то возвращаем stayHere без дальнейшей проверки
      || nextStep.x < this.#valueGameZone.valueInputMin // для всех остальных элементов идет стандартная проверка
      || nextStep.y < this.#valueGameZone.valueInputMin 
      || nextStep.x > this.#valueGameZone.valueInputMaxX 
      || nextStep.y > this.#valueGameZone.valueInputMaxY 
      || ( whoStep.substr(0,9) !== "explosion"      // если это не взрыв и...
         && 
         !( this.#itSingleStep([ nextStep.x, nextStep.y, whoStep ]) ) ) ) { //... и стоит ли кто на месте куда двигается элемент
      return stayHere;
    } else {
      return nextStep;
    }
  }
  #controlStyle( whoStep ) {                          // проверка, одинаковые ли координты нового места и старого в allStep
    if( this.#allStep[whoStep] !== undefined 
        &&
        ( this.#allStep[whoStep][0].x == this.#allStep[whoStep][1].x
          && 
          this.#allStep[whoStep][0].y == this.#allStep[whoStep][1].y ) 
        || 
        ( this.#allStep['bomb'] !== undefined
          && 
          this.#allStep['bomb'][1] !== undefined // если бомаба не определена
          &&
          this.#allStep['bomb'][1].x == this.#allStep[whoStep][0].x // положение бомбы совподает с предыдущим шагом игрока
          && 
          this.#allStep['bomb'][1].y == this.#allStep[whoStep][0].y
      ) ) {
      return true;
    } else {
      return false;
    }
  }
  #chekElementsDestruction( explosion, element ) {    // есть на линии взрыва игровые элементы
    if( this.#allStep[element][1] !== undefined
        &&
        this.#allStep[element][1].x ===  explosion.x 
        &&
        this.#allStep[element][1].y ===  explosion.y 
    ) {
      return true;
    } else {
      return false;
    }
  }
  #controlDestruction( explosion ) {                  // взаимодействие взрыва и объектов
    for( const key in this.#allStep ) {               // если это стена
      if ( this.#chekElementsDestruction( explosion, key ) ) { // если на линии взрыва есть игровой элемент
        if( key.substr(0,4) == "wall" ) { // взаимодействие взрыва со стеной
          return true;                                // дальше ни чего не делаем
        } else if ( key.substr(0,3) == "box" ) {      // если это ящик или монстр - уничтожаем его координаты
          let itTrue = false;   
          const [ chek, upgradeBox ] = this.#checkUniqueBoxUpgrade( key );
          if ( chek ) {
            this.#addStyleElement( this.#allStep[key][1], upgradeBox ); // меняем стиль на upgrade
            this.#rememberStep( this.#allStep[key][1], `${upgradeBox + key}` ); // поместить в игровую allStep элементов boxUpgrade и координаты старого ящика
            itTrue = true;
          }
          this.#valueBox();                           // отнять ящик из общего хранилища на поле         
          delete this.#allStep[key];                  // убрать с игрового поля Box
          return itTrue;                              // взрыв продолжается или нет              
        } else if ( key.substr(0,7) == "monster" ) {  // если это монстр - уничтожаем его координаты и меняем стиль на 'dead'
          this.#valueMonster();                       // просто подсчет оставшихся монстров
          this.#addStyleElement( this.#allStep[key][1], 'deadMonster' ); // меняем стиль на 'deadMonster'
          delete this.#allStep[key];
          return true;                                // взрыв продолжается
        } else if ( key == "player" ) {               // если это игрок
                    
          this.#addStyleElement( this.#allStep[key][1], 'dead' ); // меняем стиль на 'dead'
          this.#takeLifePlayer( -1 );                     // отнять одну жизнь, убил взрыв во время детонации
          return true;                                // дальше ни чего не делам      
        } else if ( key.substr(0,3)  == "add" ) {     // если это upgrabeBox
          delete this.#allStep[key];                  // если upgradeBox взрывается, он пропадает...
          return false;                               // взрыв продолжается      
        }  
      }      
    } 
    this.#deleteStyleElement(this.#allStep['bomb'][1]);  // убрать бомбу после взрыва
    this.#allStep['bomb'][1] = undefined;           // убрать бомбу с поля
    return false;
  }
  #checkUniqueBoxUpgrade( box ) {                   // проверка есть ли уже такой ящик в boxUpgrade 
    const obj = this.#boxUpgrade;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) ) {
        for (const key2 in obj[key][1]) {
          if ( obj[key][1].hasOwnProperty(key2) && obj[key][1].length !== 0 && key2 === box ) {
            return [ true, key ];
          }
        }
      }
    }
    return [ false ];    
  }
  #checkGameOver() {
    if( this.#allStep['player'][1] !== undefined    // если пользователь существует и его жизни меньше или равны 0
        &&
        this.#gameElement.player[1].lifePlayer <= 0 ) {
      delete this.#allStep['player'][1];            // удаляем игрока из "БД" игрового поля
      this.#nextGamePanel( false );   
       
    }
  }
  #chekWin() {
    if (  this.#gameElement.monster[1].destroyedMonster >= this.#gameElement.monster[0] ) {
      this.#nextGamePanel( true );      
    }
  }
  // #chekGameOverAndWin() {
  //   if ( this.#controlGameOver() ||  this.#controlWin() ) {
  //     return this.#itGameOverOrWin = true;
  //   } else {}
  //     return this.#itGameOverOrWin = false;     
  // }
  // #controlGameOver() {                              // контроль за жизнями игрока
  //   if( this.#allStep['player'][1] !== undefined    // если пользователь существует и его жизни меньше или равны 0
  //       &&
  //       this.#gameElement.player[1].lifePlayer <= 0 ) {
  //     delete this.#allStep['player'][1];            // удаляем игрока из "БД" игрового поля
  //     this.#nextGamePanel( false );
  //     return false;     
  //   }
  // }
  // #controlWin() {
  //   if (  this.#gameElement.monster[1].destroyedMonster >= this.#gameElement.monster[0] ) {
  //     this.#nextGamePanel( true );
  //     return true;        
  //   } 
  // }
}
class Gamer { 
  #lifePlayer;
  #upRow = 38;
  #downRow = 40;
  #leftColumn = 37;
  #rightColumn = 39;
  #bomb = 32;
  // #speed = 500;
  // #itStep = true;
  constructor( lifePlayer ) {
    this.#lifePlayer = lifePlayer;
  }
  get lifePlayer() {
    return this.#lifePlayer;
  }

  movePlayer(keybord, stayHere) {                     // движение игрока в зависимости от кнопок
    let nextStep = {...stayHere};
    // if ( this.#itStep ) {

    // }
    if( stayHere !== undefined ) {
      switch (keybord) {
        case this.#upRow:
          nextStep.y = stayHere.y - 1;
          return [ nextStep, stayHere, 'player' ];
          break;
        case this.#rightColumn:
          nextStep.x = stayHere.x + 1;
          return [ nextStep, stayHere, 'player' ];
          break;
        case this.#leftColumn:
          nextStep.x = stayHere.x - 1;
          return [ nextStep, stayHere, 'player' ];
          break;
        case this.#downRow:
          nextStep.y = stayHere.y + 1;
          return [ nextStep, stayHere, 'player' ];
          break;
        case this.#bomb:
            return [ , stayHere, 'bomb' ];
          break;
        default:
          break;
      }
    }
  }
}
class Bomb {
  #maxBomb = 1;
  #lengthExplosion;
  #explosionTime;
  constructor( beginLengthExplosion = 3, explosionTime = 3000) {
    this.#lengthExplosion = beginLengthExplosion;
    this.#explosionTime = explosionTime;
  }
  get infoBomb() {
    return { maxBomb:         this.#maxBomb, 
             explosionTime:   this.#explosionTime, 
             lengthExplosion: this.#lengthExplosion };
  }
  set infoBomb( obj ) {
    const { maxBomb, explosionTime, lengthExplosion } = obj;
    this.#maxBomb = maxBomb;
    this.#explosionTime = explosionTime;
    this.#lengthExplosion = lengthExplosion;
  }

  #calcExplosion( hereStayBomb ) {
    let arrTemp = [];
    const arrExplosion = [];
    if( hereStayBomb !== undefined ) {
      for (let i = 1; i <= this.#lengthExplosion; i++) {
        arrTemp.push( {...hereStayBomb, y: hereStayBomb.y + i}); 
      }
      arrExplosion.push(arrTemp);
      arrTemp = [];
      for (let i = 1; i <= this.#lengthExplosion; i++) {
        arrTemp.push( {...hereStayBomb, y: hereStayBomb.y - i});   
      }
      arrExplosion.push(arrTemp);
      arrTemp = [];
      for (let i = 1; i <= this.#lengthExplosion; i++) {
        arrTemp.push( {...hereStayBomb, x: hereStayBomb.x + i}); 
      }
      arrExplosion.push(arrTemp);
      arrTemp = [];
      for (let i = 1; i <= this.#lengthExplosion; i++) {
        arrTemp.push( {...hereStayBomb, x: hereStayBomb.x - i});   
      }
      arrExplosion.push(arrTemp);
      arrTemp = [];
      return arrExplosion;
    }
  }

  infoExplosion( hereStayBomb ) {
    return [ this.#calcExplosion( hereStayBomb ), hereStayBomb, 'explosion' ]
  }
}
class Monster {
  #speedMonster;
  // #objInfoStepsMonsters = {};
  // #objOldSteps = {};
  constructor ( speedMonster ) {
    this.#speedMonster = speedMonster;
  }
  get speedMonster() {
    return this.#speedMonster;
  }
  #randomSteps( whichMonster ) { // тут нужно настроить УМ у монстров, для передвижения

    // const hereWasMonster = this.#objInfoStepsMonsters[whichMonster];
    // const nextStep = this.#objInfoStepsMonsters[whichMonster].nextStep;
    // const oldDirection = this.#objInfoStepsMonsters[whichMonster][2].direction;
    const direction =  Math.floor(Math.random() * ( 4 - 1 + 1 ) ) + 1;  
    // let oldDirection = this.#objInfoStepsMonsters[whichMonster][2];
    // this.#objOldSteps[whichMonster] = [ nextStep, 1 ];

    // if (  this.#objInfoStepsMonsters[whichMonster][0] !== undefined 
    //     &&
    //     this.#objOldSteps[whichMonster] !== undefined 
    //     &&
    //     (
    //     this.#objInfoStepsMonsters[whichMonster][0].x !== this.#objOldSteps[whichMonster][0].x
    //       ||
    //     this.#objInfoStepsMonsters[whichMonster][0].y !== this.#objOldSteps[whichMonster][0].y )
    //       &&
    //       this.#objOldSteps[whichMonster][1].direction == direction ) {
    //   return this.#randomSteps( whichMonster );
    // } else {
      switch ( direction ) {
        case 1:
          return 'up';
          break;
        case 2:
          return 'right';
          break;
        case 3:
          return 'left';
          break;
        case 4:
          return 'down';
          break;
        default:
          break;
      }
      // }
  }
 
  moveMonster( infoAboutMonster ) {
    if ( infoAboutMonster !== undefined ) {
      const [ whichMonster, oldStep, hereStayMonster] = infoAboutMonster;
      const nextStep = { ...hereStayMonster };
      if( hereStayMonster !== undefined ) { 
        switch ( this.#randomSteps( whichMonster ) ) {
          case 'up':
            nextStep.y = hereStayMonster.y - 1;
            // this.#objOldSteps[whichMonster] = [ nextStep, 1 ];
            // console.log(this.#objInfoStepsMonsters[whichMonster]);
            // console.log( whichMonster + ' перемещается - up' + nextStep.x + 'x' + nextStep.y);
            return [ nextStep, hereStayMonster, whichMonster ];
            break;
          case 'right':
            nextStep.x = hereStayMonster.x + 1;
            // this.#objOldSteps[whichMonster] = [ nextStep, 2 ];
            // this.#objInfoStepsMonsters[whichMonster][2] = { nextStep: nextStep, direction: 2 };
            // console.log( whichMonster + ' перемещается - right ' + nextStep.x + 'x' + nextStep.y);
            return [ nextStep, hereStayMonster, whichMonster ];
            break;
          case 'left':
            nextStep.x = hereStayMonster.x - 1;
            // this.#objOldSteps[whichMonster] = [ nextStep, 3 ];
            // this.#objInfoStepsMonsters[whichMonster][2] = { nextStep: nextStep, direction: 3 };
            // console.log( whichMonster + ' перемещается -  left' + nextStep.x + 'x' + nextStep.y);
            return [ nextStep, hereStayMonster, whichMonster ];
            break;
          case 'down':
            nextStep.y = hereStayMonster.y + 1;
            // this.#objOldSteps[whichMonster] = [ nextStep, 4 ];
            // this.#objInfoStepsMonsters[whichMonster][2] = { nextStep: nextStep, direction: 4 };
            // console.log( whichMonster + ' перемещается - down ' + nextStep.x + 'x' + nextStep.y);
            return [ nextStep, hereStayMonster, whichMonster ];
            break;
          default:
            break;
        }
      }   
    }
  }
}

const idGameZone = document.getElementById( "playing_field" ).children[0];
const idControlPanel = document.getElementById( "control_game" );
const idMaxX = document.getElementById("input_axisX");
const idMaxY = document.getElementById("input_axisY");
const idButtonPlay = document.getElementById('play');
const idControlLevel = document.getElementById('control_level');
// const idButtonReset = document.getElementById('reset'); 

const newGame = new Game( idGameZone, idControlPanel, idButtonPlay, idControlLevel );
const newPlayer = new Gamer( 5 );
const newBomb = new Bomb( 3, 3000 );
const newMonster = new Monster( 500 );

function beginGame() {                                // группа однотипных действий для отрисовки игрового поля
  newGame.valueInput =  { maxX: idMaxX.value, maxY: idMaxY.value };
  newGame.renderGameZone();
  idButtonPlay.style.visibility = 'visible';
}
function addMonster() {
  for (let i = 0; i < newGame.hereStayMonsters.length; i++) { // перебор элементов (монстров)
    const idSetInterval = setInterval(() => { 
      if ( newGame.hereStayMonsters.length !== 0 ) {  // при изменени размера поля, прекращается интервал
        newGame.renderMoveGameElement( 
          newMonster.moveMonster( newGame.hereStayMonsters[i] ) );    
      } else {
        clearInterval( idSetInterval );
      }
    }, newMonster.speedMonster);                      // скорость передвижения монстров
  }
}
function nextLevel() {
  newGame.nextLevel();
  newGame.renderGameZone( true );
  newGame.startRenderGameElement(); 
  addMonster();
}
// код отвечающий за взаимодействие на странице с пользователем
input_axisX.oninput = () => beginGame(); 
input_axisY.oninput = () => beginGame();
play.onclick = () =>  {
  newGame.lifePlayer = newPlayer.lifePlayer;          // передача информации о максимальных жизнях игрока
  newGame.infoBomb = newBomb.infoBomb;                // передача информации о количестве,времени и длине бомбы
  newGame.startRenderGameElement(); 
  addMonster();
  idButtonPlay.style.visibility = 'hidden';
};

onkeydown = () => {
  let code = event.keyCode;
    if( newGame.allStep['player'] !== undefined 
        && 
        ( code == 37 || code == 38 || code == 39 || code == 40 || code == 32 ) ) { // принимать № клавиши только при наличии игрока на игровом поле
      newGame.renderMoveGameElement( 
        newPlayer.movePlayer( code, newGame.hereStayPlayer ) ); 
    if( code == 32 ) {                                // при нажатии на пробел запускает отсчет до взрыва
      newBomb.infoBomb = newGame.infoBomb;            // передать актуальную информацию для расчета взрыва
      setTimeout( () => {
        newGame.renderMoveGameElement( 
          newBomb.infoExplosion( newGame.hereStayBomb )  // передает в класс Bomb данные о расположении бомбы и возвращает информацию о взрыве
        );                                            // отрисовывает взрыв
      }, newGame.infoBomb.explosionTime);             // время взрыва
    }
  }
};