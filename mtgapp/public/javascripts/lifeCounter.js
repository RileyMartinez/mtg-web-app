var YourCounter = 20;
var EnemyCounter = 20;
var Mode = "0"; //0 = 1v1, 1 = Commander

function YourIncrease() {
  YourCounter++;
  document.getElementById('YourCount').innerHTML = YourCounter;
  saveLife(); 
}

function YourDecrease() {
  YourCounter--;
  document.getElementById('YourCount').innerHTML = YourCounter;
  saveLife();
}

function EnemyIncrease() {
  EnemyCounter++;
  document.getElementById('EnemyCount').innerHTML = EnemyCounter;
  saveLife();
}

function EnemyDecrease() {
  EnemyCounter--;
  document.getElementById('EnemyCount').innerHTML = EnemyCounter;
  saveLife();
}  

function Reset() {
  if (true) { //confirm("Reset life totals to 20?")) {
    YourCounter = 20;
    EnemyCounter = 20;
    document.getElementById('YourCount').innerHTML = YourCounter;
    document.getElementById('EnemyCount').innerHTML = EnemyCounter;
  }
}

function prepareOnClicks() {
    document.getElementById('YourUp').onclick = function() { YourIncrease(); };
    document.getElementById('YourDown').onclick = function() { YourDecrease(); };
    document.getElementById('EnemyUp').onclick = function() { EnemyIncrease(); };
    document.getElementById('EnemyDown').onclick = function() { EnemyDecrease(); };
    document.getElementById('reset').onclick = function() { Reset(); };
    document.getElementById('commander').onclick = function() { SubmitResult(); };
}

window.onload = function() {
  prepareOnClicks();
  var elem = document.querySelector('#YourDown');
  var draggie = new Draggabilly( elem, {
    axis: 'y'
  });
  document.getElementById('YourCount').innerHTML = YourCounter;
  document.getElementById('EnemyCount').innerHTML = EnemyCounter;
};