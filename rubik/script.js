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
  up: {North: "West", West: "South", South: "East", East: "North"},
  d: {North: "West", West: "South", South: "East", East: "North"},
  dp: {North: "East", East: "South", South: "West", West: "North"},
  r: {Top: "North", North: "Bottom", Bottom: "South", South: "Top"},
  rp: {Top: "South", South: "Bottom", Bottom: "North", North: "Top"},
  l: {Top: "South", South: "Bottom", Bottom: "North", North: "Top"},
  lp: {Top: "North", North: "Bottom", Bottom: "South", South: "Top"},
  n: {Top: "West", West: "Bottom", Bottom: "East", East: "Top"},
  np: {Top: "East", East: "Bottom", Bottom: "West", West: "Top"},
  s: {Top: "East", East: "Bottom", Bottom: "West", West: "Top"},
  sp: {Top: "West", West: "Bottom", Bottom: "East", East: "Top"}
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

// slider.oninput = function() {
//   output.innerHTML = this.value;
//   if (selectFace.value === 'Select a Face') {
//     return;
//   } else {
//     console.log(`${selectFace.value}`);
//     let n = document.querySelectorAll(`.${selectFace.value}`);
//     console.log(n);
//     n.forEach((i)=>{
//       let s = `rotateY(${this.value}deg) ${i.style.transform}`;
//       console.log(i, s);
//       i.style.transform = s;
//       console.log(i);
//     });
//   }
// }

var moveSet = {
  u: {face: "Top", rot:"rotateZ(90deg)"},
  up: {face: "Top", rot:"rotateZ(-90deg)"},
  f: {face: "South", rot:"rotateY(90deg)"},
  fp: {face: "South", rot:"rotateY(-90deg)"},
  r: {face: "East", rot:"rotateX(90deg)"},
  rp: {face: "East", rot:"rotateX(-90deg)"}
};

selectMove.addEventListener('change', () => {
  if (selectMove.value === 'Choose a Move') {
    return;
  } else {
    let op = selectMove.value;
    if (op){
      console.log(op, moveSet[op]);
      // console.log(moveSet)
      let face = moveSet[op]['face'];
      let rot = moveSet[op]['rot'];
      console.log(face, rot);
      let n = document.querySelectorAll(`.${face}`);
      n.forEach((i)=>{
        let s = `${rot} ${i.style.transform}`;
        // console.log(i, s);
        i.style.transform = s;
        i.classList.remove(face);
        console.log(facePermutations);
        console.log(facePermutations[op]);
        // console.log('initially ', i)
        i.classList.forEach(cls => {
          console.log(cls,facePermutations[op]);
          let sideList = [];
          if (cls in facePermutations[op]){
            if (cls in facePermutations[op]){
              console.log(cls, ' to ', facePermutations[op][cls])
              i.classList.remove(cls);
              sideList.push(facePermutations[op][cls]);
            } else  console.log(cls, ' stays.');
            // i.classList.add(facePermutations[op][cls]);
          }
          sideList.forEach(s=>{
            i.classList.add(s);
          });
        });
        // console.log('finally ', i)
        // console.log(op, face, facePermutations[op][face]);
        // i.classList.add(facePermutations[op][face]);
        // console.log(i);
      });
    }
    // cubeSec.style.transform = `rotate3d(1, 1, 1, 30deg) ${selectFace.value}`;
    // setTimeout(() => {
      // example.style.transform = 'rotate3d(1, 1, 1, 30deg) translate3d(200px, 100px, 0px)';
      cubeSec.style.transform = 'rotate3d(1, 1, 1, 45deg)';

    // }, 2000)
  }
});



rotateSide = ((sideArray, face) =>{
  sideArray.forEach((i)=>{
    let s = `${rot} ${i.style.transform}`;
    // console.log(i, s);
    i.style.transform = s;
    // console.log(i);
  });

});

