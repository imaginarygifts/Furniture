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


// MAIN
function calculateAll(){
generateCutList()
calculateMaterialFullSheet()
calculateHardware()
generateLayout()
}


// PROJECT
function createProject(){
project.client = clientName.value
project.name = projectName.value
project.cabinets = []
alert("Project Created")
}


// CUT LIST WITH PARTITIONS
function generateCutList(){

panels = []

let h = +height.value
let w = +width.value
let d = +depth.value
let t = +thickness.value

let shelves = +shelvesInput.value || 0
let partitions = +partitionsInput.value || 0
let qty = +qtyInput.value || 1

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

// loop qty
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

cutlist.textContent = output

}



// MATERIAL FULL SHEET
function calculateMaterialFullSheet(){

let sheetArea = 32

let plyPrice = +plyPriceInput.value || 0
let micaPrice = +micaPriceInput.value || 0

let totalArea = 0

panels.forEach(p=>{
totalArea += (p.w * p.h)/92900
})

let sheetsRequired = Math.ceil(totalArea / sheetArea)

let plywoodCost = sheetsRequired * plyPrice
let micaCost = sheetsRequired * micaPrice

materialCost = plywoodCost + micaCost

cost.textContent = `
Area: ${totalArea.toFixed(2)} sq ft
Sheets: ${sheetsRequired}

Plywood: ₹${plywoodCost}
Mica: ₹${micaCost}

Total: ₹${materialCost}
`

}


// HARDWARE
function calculateHardware(){

let hingePrice = +hingePriceInput.value || 0
let handlePrice = +handlePriceInput.value || 0
let channelPrice = +channelPriceInput.value || 0

let qty = +qtyInput.value || 1

let hinges = 2 * qty
let handles = 1 * qty
let channels = 1 * qty

hardwareCost =
(hinges * hingePrice) +
(handles * handlePrice) +
(channels * channelPrice)

hardware.textContent = `
Hinges: ₹${hinges * hingePrice}
Handles: ₹${handles * handlePrice}
Channels: ₹${channels * channelPrice}

Total: ₹${hardwareCost}
`

}


// AUTO OPTIMIZED LAYOUT
function generateLayout(){

let canvas = sheetCanvas
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


// DRAW
function drawSheet(page){

currentPage = page

let canvas = sheetCanvas
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


// PAGINATION
function nextSheet(){
if(currentPage < sheets.length-1) drawSheet(currentPage+1)
}

function prevSheet(){
if(currentPage > 0) drawSheet(currentPage-1)
}


// PROJECT
function addCabinet(){

let cabinet = {
width:width.value,
height:height.value,
depth:depth.value,
material:materialCost,
hardware:hardwareCost
}

project.cabinets.push(cabinet)
displayProject()
}

function displayProject(){

let output = ""

project.cabinets.forEach((c,i)=>{
output += `Cabinet ${i+1}\n${c.width}×${c.height}×${c.depth}\n₹${c.material}\n\n`
})

projectList.textContent = output
}

function generateProjectQuotation(){

let m=0,h=0

project.cabinets.forEach(c=>{
m+=c.material
h+=c.hardware
})

let labour = m*0.25
let total = m+h+labour+1000

projectQuotation.textContent = `
Material: ₹${m}
Hardware: ₹${h}
Labour: ₹${labour}

TOTAL: ₹${total}
`
}