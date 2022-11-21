// Reference 1 https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#matrix3d()
const selectFace = document.querySelector('#facechoice');
const selectMove = document.querySelector('#movechoice');
// const selectOpElem = document.querySelector('selectOp');

console.log(selectMove);

const cubeSec= document.querySelector('#cube');
const colorArray = ["white", "green", "red", "blue", "orange", "yellow", "pink", "black", "magenta" ]

const ssArray = ['', 'rotateX(90deg)', 'rotateX(-90deg)', 'rotateY(90deg)', 'rotateY(-90deg)', 'rotateY(180deg)']
const faceArray = ['Top', 'West', 'South', 'East', 'North', 'Bottom']
const faceOpposites = {Top: 'Bottom', Bottom: 'Top', West: 'East', East: 'Westt', South: 'North', North: 'South'};

const sides = ["Top", "Bottom", "South", "North", "East", "West"];
const colors = ["white", "yellow", "blue", "green", "red", "orange"];
// let rot = ["", "rotateY(180deg)", "rotateX(90deg) rotateY(90deg)", 
//            "rotateX(90deg) rotateY(-90deg)", "rotateX(90deg) rotateY(180deg)", "rotateX(90deg) rotateZ(270deg)"];
// const rot = ["", "rotate3d(0,1,0,180deg) translateZ(52px)", "rotateX(90deg) translate3d(0px, -27px, 27px)", 
//            "rotateX(90deg) rotateY(180deg) translate3d(0px, -27px, 27px)", "rotateX(90deg) rotateY(90deg) translate3d(0px, -27px, 27px)", "rotateX(90deg) rotateY(-90deg) translate3d(0px, -27px, 27px)"];

const rot = ["translateZ(26px)", "rotate3d(0,1,0,180deg) translateZ(26px)", "rotateX(90deg) translate3d(0px, 0px, 27px)", 
           "rotateX(90deg) rotateY(180deg) translate3d(0px, 0px, 27px)", "rotateX(90deg) rotateY(90deg) translate3d(0px, 0px, 27px)", "rotateX(90deg) rotateY(-90deg) translate3d(0px, 0px, 27px)"];



const facePermutations = {
  u: {North: "East", East: "South", South: "West", West: "North"},
  up: {North: "West", West: "South", South: "East", East: "North", Top:"Top"},
  d: {North: "West", West: "South", South: "East", East: "North", Bottom:"Bottom"},
  dp: {North: "East", East: "South", South: "West", West: "North", Bottom:"Bottom"},
  r: {Top: "North", North: "Bottom", Bottom: "South", South: "Top", East:"East"},
  rp: {Top: "South", South: "Bottom", Bottom: "North", North: "Top", East:"East"},
  l: {Top: "South", South: "Bottom", Bottom: "North", North: "Top", West:"West"},
  lp: {Top: "North", North: "Bottom", Bottom: "South", South: "Top", West:"West"},
  b: {Top: "West", West: "Bottom", Bottom: "East", East: "Top", North:"North"},
  bp: {Top: "East", East: "Bottom", Bottom: "West", West: "Top", North:"North"},
  f: {Top: "East", East: "Bottom", Bottom: "West", West: "Top", South:"South"},
  fp: {Top: "West", West: "Bottom", Bottom: "East", East: "Top", South:"South"}
};
           

let sideProps = Object.assign({}, ...sides.map((x, i)=>(
{[x]:{'Name': x, 'Color':colors[i], 'rotation':rot[i]}}
)));

const transOrgCubie = '27px 27px 0px';
const transOrgFace = '0px 0px -13px'

buildFace = (side) => {
  let face = document.createElement('span');
  face.classList.add('face');
  // face.style.transformOrigin = transOrgFace;
  face.style.background = sideProps[side]['Color'];
  face.style.transform = sideProps[side]['rotation'];
  return face;
};

buildCubie = ()=>{
  let cub = document.createElement('div');
  cub.classList.add('cubie');
  sides.forEach((side)=>{
    cub.appendChild(buildFace(side));
  });
  cub.style.transformOrigin = '27px 27px 0px';
  return cub;
};


rotateSide = (op)=>{
 if (op){
  console.log(op, moveSet[op]);
  // console.log(moveSet)
  let face = moveSet[op]['face'];
  let rot = moveSet[op]['rot'];
  console.log(face, rot);
  let n = document.querySelectorAll(`.${face}`);
  // console.log('cubies selected = ', n);
  n.forEach((i)=>{
    let s = `${rot} ${i.style.transform}`;
    // console.log(i, s);
    i.style.transform = s;
    // i.classList.remove(face);
    let sideList = [];
    // console.log(i, i.classList);
    [...i.classList].forEach(cls => {
      // console.log (i, cls)
      if (cls in facePermutations[op]){
        // console.log(cls, ' to ', facePermutations[op][cls])
        i.classList.remove(cls);
        sideList.push(facePermutations[op][cls]);
      } 
    });
    sideList.forEach(s=>{
      i.classList.add(s);
    }); 
    
  });

}
}

["Bottom", "", "Top"].forEach((vert, k)=>{
  ["North", "", "South"].forEach((lat, j)=>{
    ["West", "", "East"].forEach((lon, i)=>{
      let cub = buildCubie();
      cub.style.transformOrigin = transOrgCubie;
      // cub.style.transformOrigin = '0px 0px 0px';
      cub.style.transform = `translate3d(${(i-1)*50}px, ${(j-1)*50}px, ${(k-1)*50}px )`;
      if (vert) cub.classList.add(vert);
      if (lat) cub.classList.add(lat);
      if (lon) cub.classList.add(lon);
      cubeSec.appendChild(cub);
  });
  });
});


var moveSet = {
  u: {face: "Top", rot:"rotateZ(90deg)"},
  up: {face: "Top", rot:"rotateZ(-90deg)"},
  f: {face: "South", rot:"rotateY(90deg)"},
  fp: {face: "South", rot:"rotateY(-90deg)"},
  r: {face: "East", rot:"rotateX(90deg)"},
  rp: {face: "East", rot:"rotateX(-90deg)"},
  l: {face: "West", rot:"rotateX(-90deg)"},
  lp: {face: "West", rot:"rotateX(90deg)"},
  d: {face:"Bottom", rot:"rotateZ(-90deg)"},
  dp: {face:"Bottom", rot:"rotateZ(90deg)"},
  b: {face:"North", rot:"rotateY(-90deg)"},
  bp: {face:"North", rot:"rotateY(90deg)"}
};



document.addEventListener("keydown", function(event){
  // console.log(event);
  if (event.key==='w')
    rotateSide('u');
  if (event.key==='W')
    rotateSide('up');
  if (event.key==='s')
    rotateSide('f');
  if (event.key==='S')
    rotateSide('fp');
  if (event.key==='a')
    rotateSide('l');
  if (event.key==='A')
    rotateSide('lp');
  if (event.key==='d')
    rotateSide('r');
  if (event.key==='D')
    rotateSide('rp');
  if (event.key==='x')
    rotateSide('d');
  if (event.key==='X')
    rotateSide('dp');
  if (event.key==='e')
    rotateSide('b');
  if (event.key==='E')
    rotateSide('bp');
});