let panels = []
let sheets = []
let currentPage = 0

let materialCost = 0
let hardwareCost = 0

let project = {
client:"",
name:"",
cabinets:[]
}


// ================= MAIN =================
function calculateAll(){
generateCutList()
calculateMaterialFullSheet()
calculateHardware()
generateLayout()
}


// ================= PROJECT =================
function createProject(){

project.client = document.getElementById("clientName").value
project.name = document.getElementById("projectName").value
project.cabinets = []

alert("Project Created")
}


// ================= CUT LIST =================
function generateCutList(){

panels = []

let h = +document.getElementById("height").value
let w = +document.getElementById("width").value
let d = +document.getElementById("depth").value
let t = +document.getElementById("thickness").value

let shelves = +document.getElementById("shelves").value || 0
let partitions = +document.getElementById("partitions").value || 0
let qty = +document.getElementById("qty").value || 1

let innerW = w - (t*2)
let innerH = h

let cutMap = {}

function addPanel(name,w,h){

let key = `${name}_${w}_${h}`

if(!cutMap[key]){
cutMap[key] = {name,w,h,count:0}
}

cutMap[key].count++
}


// loop
for(let q=0;q<qty;q++){

addPanel("Side", d, h)
addPanel("Side", d, h)

addPanel("Top", d, innerW)
addPanel("Bottom", d, innerW)

// shelves
for(let i=0;i<shelves;i++){
addPanel("Shelf", d, innerW)
}

// partitions
for(let i=0;i<partitions;i++){
addPanel("Partition", d, innerH)
}

}


// convert for layout
Object.values(cutMap).forEach(p=>{
for(let i=0;i<p.count;i++){
panels.push({name:p.name,w:p.w,h:p.h})
}
})


// display
let output = "----- CUT LIST -----\n\n"

Object.values(cutMap).forEach(p=>{
output += `${p.name} : ${p.h} × ${p.w} mm (${p.count})\n`
})

document.getElementById("cutlist").textContent = output

}



// ================= MATERIAL =================
function calculateMaterialFullSheet(){

let sheetArea = 32

let plyPrice = +document.getElementById("plyPrice").value || 0
let micaPrice = +document.getElementById("micaPrice").value || 0

let totalArea = 0

panels.forEach(p=>{
totalArea += (p.w * p.h)/92900
})

let sheetsRequired = Math.ceil(totalArea / sheetArea)

let plywoodCost = sheetsRequired * plyPrice
let micaCost = sheetsRequired * micaPrice

materialCost = plywoodCost + micaCost

document.getElementById("cost").textContent = `
Area: ${totalArea.toFixed(2)} sq ft
Sheets: ${sheetsRequired}

Plywood: ₹${plywoodCost}
Mica: ₹${micaCost}

Total: ₹${materialCost}
`

}



// ================= HARDWARE =================
function calculateHardware(){

let hingePrice = +document.getElementById("hingePrice").value || 0
let handlePrice = +document.getElementById("handlePrice").value || 0
let channelPrice = +document.getElementById("channelPrice").value || 0

let qty = +document.getElementById("qty").value || 1

let hinges = 2 * qty
let handles = 1 * qty
let channels = 1 * qty

hardwareCost =
(hinges * hingePrice) +
(handles * handlePrice) +
(channels * channelPrice)

document.getElementById("hardware").textContent = `
Hinges: ₹${hinges * hingePrice}
Handles: ₹${handles * handlePrice}
Channels: ₹${channels * channelPrice}

Total: ₹${hardwareCost}
`

}



// ================= LAYOUT =================
function generateLayout(){

let canvas = document.getElementById("sheetCanvas")
let ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

let sheetW = 2440
let sheetH = 1220

sheets = []
let currentSheet = []

let x=0, y=0, rowH=0

panels.sort((a,b)=>(b.w*b.h)-(a.w*a.h))

panels.forEach(panel=>{

let placed = false

let options = [
{w:panel.w, h:panel.h},
{w:panel.h, h:panel.w}
]

for(let opt of options){

let pw = opt.w
let ph = opt.h

if(pw > sheetW || ph > sheetH) continue

let tx = x
let ty = y
let tr = rowH

if(tx + pw > sheetW){
tx = 0
ty += tr
tr = 0
}

if(ty + ph > sheetH) continue

currentSheet.push({x:tx,y:ty,w:pw,h:ph,name:panel.name})

x = tx + pw
y = ty
rowH = Math.max(tr, ph)

placed = true
break
}

if(!placed){

sheets.push(currentSheet)

currentSheet = []
x=0; y=0; rowH=0

currentSheet.push({x:0,y:0,w:panel.w,h:panel.h,name:panel.name})

x = panel.w
rowH = panel.h

}

})

if(currentSheet.length) sheets.push(currentSheet)

drawSheet(0)

}



// ================= DRAW =================
function drawSheet(page){

currentPage = page

let canvas = document.getElementById("sheetCanvas")
let ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

let sheet = sheets[page]

let sheetW = 2440
let sheetH = 1220

let scale = Math.min(canvas.width/sheetW, canvas.height/sheetH)

ctx.strokeRect(0,0,sheetW*scale,sheetH*scale)

sheet.forEach(p=>{
ctx.strokeRect(p.x*scale,p.y*scale,p.w*scale,p.h*scale)
ctx.fillText(p.name,p.x*scale+5,p.y*scale+15)
})

ctx.fillText(`Sheet ${page+1}/${sheets.length}`,10,sheetH*scale-10)

}



// ================= PAGINATION =================
function nextSheet(){
if(currentPage < sheets.length-1){
drawSheet(currentPage+1)
}
}

function prevSheet(){
if(currentPage > 0){
drawSheet(currentPage-1)
}
}



// ================= PROJECT =================
function addCabinet(){

let cabinet = {
width:document.getElementById("width").value,
height:document.getElementById("height").value,
depth:document.getElementById("depth").value,
material:materialCost,
hardware:hardwareCost
}

project.cabinets.push(cabinet)
displayProject()
}


function displayProject(){

let output = ""

project.cabinets.forEach((c,i)=>{
output += `Cabinet ${i+1}
${c.width}×${c.height}×${c.depth}
₹${c.material}\n\n`
})

document.getElementById("projectList").textContent = output
}


function generateProjectQuotation(){

let m=0,h=0

project.cabinets.forEach(c=>{
m+=c.material
h+=c.hardware
})

let labour = m*0.25
let total = m+h+labour+1000

document.getElementById("projectQuotation").textContent = `
Material: ₹${m}
Hardware: ₹${h}
Labour: ₹${labour}

TOTAL: ₹${total}
`
}