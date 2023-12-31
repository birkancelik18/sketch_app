// Description: This file is the main file of the project. It contains the main functions of the project.
// This code has includes sample usage of fabric.js library and firebase dataset. 
// This can be used and utilized for any purpose. Please change the firebase configurations to use your own dataset unless those are my data.
// // // // *********************** // // // //
// WARNING: This code is not a production code. It is a sample code for demonstration purposes.
// // // // *********************** // // // //
// WARNING: If some users continue until the last second of the drawing time, the last stroke may not be saved.
// Because mouse or pen should be up from the canvas to save the last stroke.


const objectClasses = [
    "airplane",
    "apple",
    "bicycle",
    "campfire",
    "car",
    "chair",
    "clock",
    "computer",
    "door",
    "grass",
    "helicopter",
    "house",
    "ladder",
    "mountain",
    "sink",
    "smiley face",
    "sun",
    "table",
    "television",
    "tree"
];

const objectNameElement = document.getElementById("objectName");
let currentObjectIndex = 0;
let currentObjectClass = objectClasses[currentObjectIndex];

let name = "";
let tool = "";

objectNameElement.textContent = "Draw: " + currentObjectClass;

// code for some security constrains of chrome 
[{
    "origin": [
        "*"
    ],
    "method": [
        "GET"
    ],
    "maxAgeSeconds": 3600
}]


var canvas = this.__canvas = new fabric.Canvas('canvas', {
    isDrawingMode: true,

});

var ctx = canvas.getContext("2d");
let brush = canvas.freeDrawingBrush;

var shadow = new fabric.Shadow({
    color: "red",
    blur: 8,

});


let canvasDiv = document.getElementById("canvas-wrapper");
canvas.setWidth(canvasDiv.offsetWidth);
canvas.setHeight(canvasDiv.offsetHeight);

//disable user to move strokes on canvas
fabric.Group.prototype.hasControls = false;
fabric.Group.prototype.lockMovementX = true;
fabric.Group.prototype.lockMovementY = true;
fabric.Group.prototype.lockScalingX = true;
fabric.Group.prototype.lockScalingY = true;
fabric.Group.prototype.hasBorders = false;

// add shadow to active strokes

canvas.selectionColor = 'rgba(0,255,0,0.3)';
canvas.selectionBorderColor = 'rgba(230, 126, 34, 1)';
canvas.selectionLineWidth = 1;
canvas.selectionShadow = shadow;

var mouse = false;
let mDown;
let pDown;
ctx.lineJoin = "round";
ctx.lineCap = "round";
var positionX, positionY;

var drawing = [];
var stroke = []; //should contain 3 array in it
var xCords = [];
var yCords = [];
let times = [];

var wordName = "";

var sketches = []; //array of sketch objects
let full_data = []; //array of sketch and classname dictionaries

//Element retrieval
let $ = function (id) { return document.getElementById(id) };
let drawingModeEl = $('modeButton');

//Set initial color conditions
brush.color = 'black';

//Set size conditions
brush.width = 8;

/*
drawingModeEl.onclick = function () {
    //canvas.getActiveObjects()[canvas.getActiveObjects]
    canvas.isDrawingMode = !canvas.isDrawingMode;

    if (canvas.isDrawingMode) {

        drawingModeEl.innerHTML = 'Seçim Yap';
        document.getElementById("drawing-mode").innerHTML = "Çizim Yapıyorsunuz";

    }
    else {
        //Make each object nonresizable on canvas
        canvas.forEachObject(function (o) { // make not selectable all the objects.
            o.hasControls = false;
            o.lockMovementX = true;
            o.lockMovementY = true;
            o.lockScalingX = true;
            o.lockScalingY = true;
            o.lockUniScaling = true;
            //o.hasBorders = false;
            // o.hasBorders = false;

        });

        drawingModeEl.innerHTML = 'Çizim Yap';
        document.getElementById("drawing-mode").innerHTML = "Seçim Yapıyorsunuz";

    }
};
*/
// Mouse move and coordinates when it is down(drawing)
canvas.on('mouse:down', function (options) {
    mDown = true;
    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }
});
canvas.on('mouse:up', function (options) {
    mDown = false;
    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }
});
function getPointerHandler(evt) {
    var point = null;
    if (mDown & canvas.isDrawingMode) {
        point = canvas.getPointer(evt);
        currDate = Date.now();
        elapsedMilliseconds = currDate - startDate;

        xCords.push(point.x);
        yCords.push(point.y);
        times.push(elapsedMilliseconds);

        stroke[0] = xCords;
        stroke[1] = yCords;
        stroke[2] = times;


    }
    if (!mDown & canvas.isDrawingMode & stroke.length != 0) { // if not drawing and in drawing mode (at least this is what I wait :)

        //attach drawing to the stroke object 
        // get stroke stroke object and attach drawing to it
        // This way we can send only part of canvas for prediction
        canvas.getObjects()[canvas.getObjects().length - 1].vectorRepresentation = stroke;

        stroke = [];
        xCords = [];
        yCords = [];
        times = [];
    }

    // point = canvas.getPointer(); works with IE11, Chrome, but not Firefox
};
window.addEventListener("mousemove", getPointerHandler);

function hideCanvas() {
    document.getElementsByClassName("column-middle").style.display = "none";
    //document.getElementById("button-container").style.display = "none";

}


function startup() {

    const el = document.getElementById('canvas-wrapper');
    el.addEventListener('touchstart', handleStart);
    el.addEventListener('touchmove', handleMove);
    el.addEventListener('touchend', handleEnd);
    el.addEventListener('touchcancel', handleCancel);
    // console.log('Initialized.');
}
window.addEventListener("DOMContentLoaded", startup);



function handleStart(evt) {
    evt.preventDefault();
    // console.log('touchstart.');
    // console.log("START touch coordinates are ", canvas.getPointer(evt));
    canvas.renderAll();
    pDown = true;

    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;

        });
    }
}
function handleMove(evt) {
    evt.preventDefault();

    pDown = true;

    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }

    let point = null;
    if (pDown & canvas.isDrawingMode) {
        point = canvas.getPointer(evt);
        currDate = Date.now();
        elapsedMilliseconds = currDate - startDate;

        xCords.push(point.x);
        yCords.push(point.y);
        times.push(elapsedMilliseconds);
        //cloneXcords = [...xCords]; // Since we don not get time values properly fullfill the third array with zeros.
        //times = cloneXcords.fill(-1);
        stroke[0] = xCords;
        stroke[1] = yCords;
        stroke[2] = times;
    }
}


function handleEnd(evt) {
    evt.preventDefault();

    // console.log("touchend");
    pDown = false;

    // console.log(canvas.renderAll());

    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }

    if (!pDown && canvas.isDrawingMode && stroke.length != 0) { // if not drawing and in drawing mode (at least this is what I wait :)

        //attach drawing to the stroke object 
        // get stroke stroke object and attach drawing to it
        // This way we can send only part of canvas for prediction
        canvas.renderAll();
        let canvasObjects = canvas.getObjects();

        if (canvas.getObjects().length == 0) {
            temp_stroke_vec = stroke;
        } else {

            canvasObjects[canvas.getObjects().length - 1].vectorRepresentation = temp_stroke_vec;
            temp_stroke_vec = stroke;
        }

        stroke = [];
        xCords = [];
        yCords = [];
        times = [];
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    // console.log('touchcancel.');

}

function clearCanvas(){
    let activeObjects = canvas.getObjects();
    // console.log("ACTIVE OBJECT COUNT IS ", canvas.getActiveObjects().length);
    for (let i = 0; i < activeObjects.length; i++) {
        // console.log("active strtoke is ");
        // console.log(activeObjects[i].vectorRepresentation);
        canvas.remove(activeObjects[i]);

    }
}

// this function is called from HTML file it trigers when the button is clicked. 
function deleteObjects() {
    if (canvas.isDrawingMode) {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        drawingModeEl.innerHTML = 'Çizim Yap';
        document.getElementById("drawing-mode").innerHTML = "Seçim Yapıyorsunuz";

        alert("Lütfen silmek istediğiniz kısımları seçip sil butonuna basınız.");
    } else if (canvas.getActiveObjects().length == 0) {
        alert("Lütfen silmek istediğiniz kısımları seçip daha sonra sil butonuna basınız.");
        drawingModeEl.innerHTML = 'Seçim Yap';
        document.getElementById("drawing-mode").innerHTML = "Çizim Yapıyorsunuz";

    }

    //Make each object nonresizable on canvas
    canvas.forEachObject(function (o) { // make not selectable all the objects other than image we provide.
        o.hasControls = false;
        o.lockMovementX = true;
        o.lockMovementY = true;
        o.lockScalingX = true;
        o.lockScalingY = true;
        o.lockUniScaling = true;
        //o.hasBorders = false;
        // o.hasBorders = false;

    });

    drawingModeEl.innerHTML = 'Çizim Yap';
    document.getElementById("drawing-mode").innerHTML = "Seçim Yapıyorsunuz";

    let activeObjects = canvas.getActiveObjects();
    // console.log("ACTIVE OBJECT COUNT IS ", canvas.getActiveObjects().length);
    for (let i = 0; i < activeObjects.length; i++) {
        // console.log("active strtoke is ");
        // console.log(activeObjects[i].vectorRepresentation);
        canvas.remove(activeObjects[i]);

    }
}

function getSelectedStrokes() {
    let activeObjects = canvas.getActiveObjects();
    let active_strokes = [];

    if (activeObjects.length > 0) {
        for (let i = 0; i < activeObjects.length; i++) {
            //// console.log("stroke uzunluğu",activeObjects[i].vectorRepresentation[0].length);
            active_strokes.push(activeObjects[i].vectorRepresentation)

        }

    }

    if (active_strokes.length > 0) {
        return active_strokes;
    } else {
        window.alert("Lütfen daha uzun kalem darbeleri kullanarak çizim yapınız.");
        return "small_strokes";
    }
}


function getDrawing() {
    let activeObjects = canvas.getObjects();
    let active_strokes = [];

    if (activeObjects.length > 0) {
        for (let i = 0; i < activeObjects.length; i++) {
            active_strokes.push(activeObjects[i].vectorRepresentation)

        }

    }

    if (active_strokes.length > 0) {
        return active_strokes;
    } else {
        window.alert("Lütfen daha uzun kalem darbeleri kullanarak çizim yapınız.");
        return "small_strokes";
    }
}



/*
    This function is called when user clicks on "Next" button
*/
function nextSketch() {
    //make yardım sendDrawingToServeral button unclickable until model returns a prediction

    // get selected strokes
 

    let drawing = getDrawing();

    if (drawing != "small_strokes") {

        // Record the current drawing and its category
        const temp_data = {
            "class": currentObjectClass,
            "drawing": drawing
        };
        full_data.push(temp_data);

        // Clear the canvas and the drawing variables for the next sketch
        drawing = [];
        stroke = []; //should contain 2 array in it
        xCords = [];
        yCords = [];
        times = [];
        clearCanvas();

        // Show the next object to draw
        currentObjectIndex++;
        if (currentObjectIndex >= objectClasses.length) {
            localStorage.setItem("full_data", JSON.stringify(full_data));
            window.location.href = "./auth.html";

        } else {
            // Show the next object to draw
            currentObjectClass = objectClasses[currentObjectIndex];
            console.log(currentObjectClass);
            objectNameElement.textContent =  "Draw: " + currentObjectClass;
            timeLeft = TIME_LIMIT_PER_WORD;
            startDate = Date.now();
        }
    }


}

function clearCanvas() {
    let activeObjects = canvas.getObjects();
    // console.log("ACTIVE OBJECT COUNT IS ", canvas.getActiveObjects().length);
    for (let i = 0; i < activeObjects.length; i++) {
        // console.log("active strtoke is ");
        // console.log(activeObjects[i].vectorRepresentation);
        canvas.remove(activeObjects[i]);


    }
}





// A func that is needed for sketchformer strokes
// Some strokes are upsamples in case they have length of less than 20
function upSampleStrokeVector(vectorRepresentation) {
    let upsampledVector = [[], []];
    // console.log(vectorRepresentation);
    let x_vector = vectorRepresentation[0];
    let y_vector = vectorRepresentation[1];
    for (let i = 0; i < (x_vector.length) - 1; i++) {
        let newPointX1 = x_vector[i] + ((x_vector[i + 1] - x_vector[i]) / 3);
        let newPointY1 = y_vector[i] + ((y_vector[i + 1] - y_vector[i]) / 3);

        let newPointX2 = x_vector[i] + (2 * ((x_vector[i + 1] - x_vector[i]) / 3));
        let newPointY2 = y_vector[i] + (2 * ((y_vector[i + 1] - y_vector[i]) / 3));


        upsampledVector[0].push(x_vector[i]);
        upsampledVector[1].push(y_vector[i]);

        upsampledVector[0].push(newPointX1);
        upsampledVector[1].push(newPointY1);

        upsampledVector[0].push(newPointX2);
        upsampledVector[1].push(newPointY2);
    }
    upsampledVector[0].push(x_vector[(x_vector.length) - 1]);
    upsampledVector[1].push(y_vector[(y_vector.length) - 1]);

    return upsampledVector;
}

const TIME_LIMIT_PER_WORD = 20; // in seconds
const TOTAL_GAME_TIME = TIME_LIMIT_PER_WORD * objectClasses.length;
let timeLeft = TIME_LIMIT_PER_WORD // in seconds
let startDate, currDate, endDate;
let timerID;

let elapsedMilliseconds=0;
startDate = Date.now();

function timer() {

    timerID = setInterval(function () {

        timeLeft--;
        if (timeLeft === 0) {
            document.getElementById("seconds").innerHTML = "00:" + timeLeft + "0";
        } else if (timeLeft < 10) {
            document.getElementById("seconds").innerHTML = "00:0" + timeLeft;
        } else {
            document.getElementById("seconds").innerHTML = "00:" + timeLeft;
        }

        if (timeLeft == 0) {
            
            nextSketch();
            timeLeft = TIME_LIMIT_PER_WORD;
        }

        console.log("time passed " + timeLeft);


        
   
    }, 1000);
}

timer();