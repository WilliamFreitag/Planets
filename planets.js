//make text bigger when paused?
//collisions?
//more settings?

var paused = true;
var g = 0.5;
var t = 20;
var planets = [];
var lastPlanetMade = 0;

document.addEventListener('keypress', (e) => {
  if(paused) paused = false;
  else paused = true;
});

var universe = document.getElementById("universe");

universe.addEventListener('mousedown', (e) => {
  lastPlanetMade = planets.length;
  planets[planets.length] = {
    color: getRandomColor(),
    radius: Math.floor(Math.random()*50+1),
    acceleration: [0,0],
    velocity: [0,0],
    position: [e.clientX,e.clientY],
    force: [0,0]
  };
  render();
});

universe.addEventListener('mouseup',(e) => {
  var tip = [e.clientX,e.clientY];
  var v = [(tip[0]-planets[lastPlanetMade].position[0])/100,(tip[1]-planets[lastPlanetMade].position[1])/100];
  planets[lastPlanetMade].velocity = v;
});
setUpExample();
render();
loop();

function clearPlanets(){
  planets = [];
  render();
}

function setUpExample(){
  clearPlanets();
  planets[0] = {
    color: "red",
    radius:150,
    acceleration: [0,0],
    velocity: [0,0],
    position: [750,500],
    force: [0,0]
  };
  planets[1] = {
    color: "#00CCFF",
    radius:2,
    acceleration: [0,0],
    velocity: [0,-8],
    position: [250,500],
    force: [0,0]
  };
  planets[2] = {
    color: "#CC00CC",
    radius:5,
    acceleration: [0,0],
    velocity: [0,6],
    position: [1400,500],
    force: [0,0]
  };
  planets[3] = {
    color: "#FFCC00",
    radius:3,
    acceleration: [0,0],
    velocity: [12,0],
    position: [750,750],
    force: [0,0]
  };
  render();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function loop(){
  var pausedIndicator = document.getElementById("pausedIndicator");
  if(!paused) {
    tick();
    render();
    pausedIndicator.innerHTML = "Press space to pause";
  }
  else pausedIndicator.innerHTML = "Paused. Press space to unpause";
  setTimeout(loop,t);
}

function tick(){
  console.log("tick");
  console.log(planets);
  for(var i = 0; i < planets.length; i++){
    var m1 = 3.1415926535*Math.pow(planets[i].radius,2);
    planets[i].force[0] = 0;
    planets[i].force[1] = 0;
    for(var j = 0; j < planets.length; j++){
      if(planets[i] === planets[j]) continue;
      var r = [planets[j].position[0]-planets[i].position[0],planets[j].position[1]-planets[i].position[1]];
      while(r[0] === 0) r[0] = (Math.random()-0.5)*5; //fake physics to avoid 0 distance when objects are perfectly on top of each other
      while(r[1] === 0) r[1] = (Math.random()-0.5)*5; //fake physics to avoid 0 distance when objects are perfectly on top of each other
      var rMagnitude = Math.pow(Math.pow(r[0],2)+Math.pow(r[1],2),0.5);
      var rUnit = [r[0]/rMagnitude,r[1]/rMagnitude];
      if(rMagnitude < 100)rMagnitude = 100; //fake physics to avoid super wild slingshots when objects phase through each other
      var m2 = 3.14*Math.pow(planets[j].radius,2);
      var forceMagnitude = (g*m1*m2)/Math.pow(rMagnitude,2);
      planets[i].force[0] += rUnit[0]*forceMagnitude;
      planets[i].force[1] += rUnit[1]*forceMagnitude;
    }
    planets[i].acceleration = [planets[i].force[0]/m1,planets[i].force[1]/m1];
    planets[i].velocity[0] += planets[i].acceleration[0];
    planets[i].velocity[1] += planets[i].acceleration[1];
  }
  for(var i = 0; i < planets.length; i++){
    planets[i].position[0] += planets[i].velocity[0];
    planets[i].position[1] += planets[i].velocity[1];
  }
};

function render(){
  console.log("render");
  var universeHeight = getComputedStyle(universe).height.substring(0,getComputedStyle(universe).height.length-2);
  var universeWidth = getComputedStyle(universe).width.substring(0,getComputedStyle(universe).width.length-2);
  universe.innerHTML = "";
  for(var i = 0; i < planets.length; i++){
    var r = planets[i].radius;
    var x = planets[i].position[0];
    var y = planets[i].position[1];
    if(x-r > universeWidth || y-r > universeHeight || x+r*2 < 0 || y+r*2 < 0) continue;
    universe.innerHTML += "<div class = 'planet' style = 'position: absolute; background-color: "+ planets[i].color +";top: calc("+ y +"px - "+ r +"px);left: calc("+ x +"px - "+ r +"px);height:"+ r*2 +"px; width:"+ r*2 +"px;'></div>";
  };
};
