import Game from "./game.js";
import { GameState, GameStateHistory } from "./gameState.js";
var currentState;
const boxes = document.getElementsByClassName("box");
var items; // =
const buttonBox = document.getElementById("buttonBox");
var nextItemId = 0;
var targetValue = 0;
var game;

var draggedItem = null;
var draggedItemParent = null;

var selectedItem = null;
var selectableState = true;

window.onclick = function (event) {
  var modal = null;
  if (event.target.classList.contains("modal")) {
    modal = event.target;
  } else if (event.target.classList.contains("close")) {
    modal = event.target.parentElement.parentElement;
  } else {
  }
  if (modal) {
    closeModal(modal);
  }
};

window.onload = (event) => {
  hide(buttonBox);
  pageLoadAddListenersControls();
  [...boxes].forEach((box, i) => {
    box.appendChild(createItem(i));
  });
  pageLoadAddListenersOperators();
  updateItems();
  handleNewGame();
};

function runOperations(op) {
  let parentBox = buttonBox.parentElement;
  let operands = [...parentBox.getElementsByClassName("item")];
  let total = game.getIdentity(op);
  if (operands.length != 2) {
    alert("big problem with operation");
  } else if (operands.length === 2) {
    operands.forEach((item, i) => {
      let val = parseInt(item.textContent);
      total = game.getOperation(op, total, val);
    });
    clearBox(parentBox);
    parentBox.appendChild(createItem(total));
    updateItems();
    let vals = [...items].map((item) => parseInt(item.textContent));
    game.stateHistory.pushState(currentState);
    currentState = new GameState(vals);
  }
  updateItems();
  // enableInteractionsAllItems();
  selectableState = true;
  if (checkWin()) openModal(document.getElementById("winModal"));
  if (checkLose()) openModal(document.getElementById("loseModal"));
}

function createItem(value) {
  let item = document.createElement("span");
  let cnt = document.createTextNode("" + value);
  item.setAttribute("class", "item");
  item.setAttribute("id", "item" + nextItemId);
  item.setAttribute("draggable", false);
  nextItemId++;
  item.addEventListener("mousedown", (e) => handleMouseDown(e, item));
  // item.addEventListener("touchstart", (e) => handleTouchStart(e, item));
  item.appendChild(cnt);
  return item;
}

function createNewGameButton(value) {
  let btn = document.createElement("span");
  let cnt = document.createTextNode("" + value);
  btn.setAttribute("class", "btnNewGame");
  btn.setAttribute("id", "btnNewGame" + value);
  btn.addEventListener(
    "mousedown",
    (e) => {
      e.preventDefault();
      game = new Game(parseInt(value));
      startNewGame();
    },
    false
  );
  btn.appendChild(cnt);
  return btn;
}

function handleMouseDown(e, item) {
  console.log(e);
  e.preventDefault();

  if (selectableState) {
    // if (selectedItem)
    if (selectedItem == null) {
      // console.log("selected item", selectedItem.getAttribute("id"));
      select(item);
    } else if (selectedItem.getAttribute("id") == item.getAttribute("id")) {
      deselect(item);
    } else {
      merge(selectedItem, item);
    }
  }
}

function deselect(item) {
  // console.log("deselecting ", item);
  let parent = item.parentElement;
  parent.classList.remove("selected");
  selectedItem = null;
}

function select(item) {
  // console.log("selecting ", item);
  let parent = item.parentElement;
  parent.classList.add("selected");
  selectedItem = item;
}

function merge(outItem, inItem) {
  // console.log("merging ", outItem, inItem);
  let outParent = outItem.parentElement;
  let inParent = inItem.parentElement;
  deselect(inItem);
  deselect(outItem);
  selectedItem = null;
  hide(outParent);
  inParent.appendChild(outItem);
  inParent.appendChild(buttonBox);
  show(buttonBox);
  // disableInteractionsAllItems();
  selectableState = false;

  // let operands = [...inParent.getElementsByClassName("item")];
  // if (operands.length > 2) hide(document.getElementById("opMinus"));
  // buttonBox.style.display = "";
}

function handleTouchStart(e, item) {
  handleMouseDown(e, item);
}

function handleTouchEnd(e, item) {
  // console.log(e, item);
}

function handleTouchMove(e, item) {
  // console.log(item);
}

function handleDragStart(e, item) {
  e.dataTransfer.setData("text/plain", item.id);
  setTimeout(() => {
    // item.style.display = "none";
    hide(item);
  }, 0);
}

function handleDragEnd(e, item) {
  show(item);
  // item.style.display = "";
  e.dataTransfer.clearData();
}

function updateItems() {
  items = document.getElementsByClassName("item");
  // [...items].forEach((item, i) => {
  //   item.style.backgroundColor = "white";
  // });
  [...boxes].forEach((box, i) => {
    let item = box.getElementsByClassName("item");
    if (item == null || item.length == 0) hide(box);
  });
}

// document.getElementById("newGame").addEventListener("click", startNewGame());

function clearBox(parentBox) {
  [...parentBox.children].forEach((el, i) => {
    parentBox.removeChild(el);
  });
}

function clearBoxes() {
  [...boxes].forEach((box, i) => {
    clearBox(box);
    // box.classList.remove("selected");
  });
}

function restoreBox(box) {
  clearBox(box);
  show(box);
  box.classList.remove("selected");
  // box.style.display = "";
}

function restoreBoxes() {
  [...boxes].forEach((box, i) => {
    restoreBox(box);
  });
}

function setItemsToValues(vals) {
  [...boxes].forEach((box, i) => {
    clearBox(box);
  });
  vals.forEach((val, i) => {
    let box = boxes[i];
    box.appendChild(createItem(val));
  });
  updateItems();
}

function selectTargetValue() {
  game.iterateNodes();
  game.selectTargetValue();
  targetValue = game.targetValue;
}

function writeTargetValue() {
  let tg = document.getElementById("target");
  tg.textContent = "" + targetValue;
}

function checkWin() {
  let vals = [...items].map((item) => parseInt(item.textContent));
  return vals.includes(targetValue);
}

function checkLose() {
  return !checkWin() && items.length <= 1;
}

function startNewGame() {
  document.getElementById("title").textContent = "Target";
  show(document.getElementById("target"));
  hide(document.getElementById("instructions"));
  show(document.getElementById("mainControlFooter"));
  game.generateValues();
  game.generateNodes();
  restartGame();
  selectTargetValue();
  writeTargetValue();
  updateItems();
}

function createNewGameButtons() {
  closeAllModals();
  restoreBoxes();
  [...boxes].forEach((box, i) => {
    let btn = createNewGameButton(i + 1);
    box.appendChild(btn);
  });
}

function handleNewGame() {
  closeAllModals();
  restoreBoxes();
  document.getElementById("title").textContent = "Instructions";
  show(document.getElementById("instructions"));
  hide(document.getElementById("target"));
  hide(document.getElementById("mainControlFooter"));

  createNewGameButtons();
  // disableItemInteractions();
}

function restartGame() {
  closeAllModals();
  restoreBoxes();
  // enableInteractionsAllItems();
  selectableState = true;
  setItemsToValues(game.initialValues);
  currentState = new GameState(game.initialValues);
  game.stateHistory.clearHistory();
  // game.stateHistory.pushState(currentState);
}

// function doOpUndo() {
//   draggedItemParent.appendChild(draggedItem);
//   draggedItemParent.style.display = "";
// }

function doUndo() {
  let state = game.stateHistory.popState();
  if (state) {
    restoreBoxes();
    let vals = state.getState();
    setItemsToValues(vals);
    currentState = new GameState(vals);
  }
}

function enableInteractionsAllItems() {
  [...items].forEach((item, i) => {
    enableInteractionsItem(item);
  });
}

function disableInteractionsAllItems() {
  [...document.getElementsByClassName("item")].forEach((item, i) => {
    disableInteractionsItem(item);
  });
}

function enableInteractionsItem(item) {
  item.addEventListener("mousedown", (e) => handleMouseDown(e, item));
  item.addEventListener("touchstart", (e) => handleTouchStart(e, item));
}

function disableInteractionsItem(item) {
  item.setAttribute("draggable", false);
  item.removeEventListener("mousedown", (e) => handleMouseDown(e, item));
  item.removeEventListener("touchstart", (e) => handleTouchStart(e, item));
}

function closeAllModals() {
  let modals = document.getElementsByClassName("modal");
  [...modals].forEach((modal, i) => {
    closeModal(modal);
  });
}

function openModal(modal) {
  show(modal, "block");
  hide(document.getElementById("mainControlFooter"));
  let bx = modal.getElementsByClassName("controlBox")[0];
  // console.log(bx);
  let ft = modal.getElementsByClassName("control-footer")[0];
  show(bx);
  show(ft);
}

function closeModal(modal) {
  hide(modal);
  show(document.getElementById("mainControlFooter"));
}

function hide(el) {
  el.style.display = "none";
}

function show(el, type = "") {
  el.style.display = type;
}

function pageLoadAddListenersControls() {
  let btnsNg = document.getElementsByClassName("control.newGame");
  [...btnsNg].forEach((btn, i) => {
    btn.addEventListener("click", () => handleNewGame());
  });

  let btnsRst = document.getElementsByClassName("control.restart");
  [...btnsRst].forEach((btn, i) => {
    btn.addEventListener("click", () => restartGame());
  });

  let btnsUndo = document.getElementsByClassName("control.undo");
  [...btnsUndo].forEach((btn, i) => {
    btn.addEventListener("click", () => doUndo());
  });
}

function pageLoadAddListenersOperators() {
  [...document.getElementsByClassName("operator")].forEach((op, i) => {
    op.addEventListener("click", (e) => {
      runOperations(i);
    });
  });
}

function pageLoadAddListenersBoxes() {
  [...boxes].forEach((box, i) => {
    box.addEventListener("drop", (e) => {
      let draggedItemId = e.dataTransfer.getData("text/plain");
      draggedItem = document.getElementById(draggedItemId);
      draggedItemParent = draggedItem.parentElement;
      box.append(draggedItem);
      box.style.background = "";
      if (draggedItemParent.children.length == 0) {
        hide(draggedItemParent);
      }
      e.dataTransfer.clearData();
      if (box.id != draggedItemParent.id) {
        box.append(buttonBox);
        show(buttonBox);
        blockItemDrag();
      }
    });
    box.addEventListener("dragenter", (e) => {
      e.preventDefault();
      box.style.background = "rgb(0.9, 0.9, 0.9, 0.1)";
    });

    box.addEventListener("dragover", (e) => {
      e.preventDefault();
      box.style.background = "rgb(0.9, 0.9, 0.9, 0.1)";
    });

    box.addEventListener("dragleave", (e) => {
      e.preventDefault();
      box.style.background = "";
    });
  });
}
