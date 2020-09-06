const numOfElements = 25; 

$(document).ready(function() {
    drawRectangles(numOfElements);
});

function processInput(event) {
    numOfElements = $('#elements').val();

    drawRectangles(numOfElements);

    // Prevent Default Form Behavior
    event.preventDefault();
}

function drawRectangles(numOfElements) {
    // Remove All Child Elements
    $('#canvas-container').empty();

    // Calculate Width of Each Rectangle Based on Canvas Width and Number of Elements
    const rectWidth = $('#canvas-container').width() / numOfElements; 

    for (let i = 0; i < numOfElements; i++) {
        // Generate Random Number Between 0 and 100 
        const randomNumber = Math.floor(Math.random() * 100) + 1;  

        // Set Styles
        const height = `height: ${randomNumber}%;`;
        const width = `width: ${rectWidth}px;`;
        const backgroundColor = 'background-color: rgb(26, 115, 232);';
        const border = 'border: 1px solid #ffffff;';
        const data = `data-height="${randomNumber}"`;

        // Create New Div
        const newDiv = `<div style='${height}${width}${backgroundColor}${border}' ${data}></div>`;

        $('#canvas-container').append(newDiv);  
    }
}

function sort() {
    bubbleSort(); 
}

function bubbleSort() {
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    const swapIndices = [];

    for (let i = 0; i < arrLen; i++) {
        for (let j = 0; j < arrLen - i - 1; j++) {
            // Convert String-Type Values to Numbers
            const currentValue = parseInt(arr[j].dataset.height, 10);
            const nextValue = parseInt(arr[j + 1].dataset.height, 10);

            // Compare Values and Swap if Current > Next
            if (currentValue > nextValue) {
                // Having just the swapIndices won't work because every subsequent swap relies on the previous swap to bring the unsorted array closer to being sorted.  
                // [5, 4, 3]
                // [4, 5, 3]
                // [4, 3, 5]

                // [5, 4, 3]
                // I was never updating the array. I was simply storing values. Dummy!
                swapIndices.push([j, j+1]);
                swapData(j, j + 1, arr); 
            }
        }
    }

    swapAnimation(swapIndices, arr);
}

function swapData(a, b, arr) {
    let dataTemp = arr[a].dataset.height;
    arr[a].dataset.height = arr[b].dataset.height;
    arr[b].dataset.height = dataTemp;
}

function swapStyle(a, b, arr) {
    let temp = arr[a].style.height;
    arr[a].style.height = arr[b].style.height;
    arr[b].style.height = temp;
}

async function swapAnimation(swapIndices, arr) {
    await new Promise((resolve, reject) => {
        for (let i = 0; i < swapIndices.length; i++) {
            setTimeout(() => {
                swapStyle(swapIndices[i][0], swapIndices[i][1], arr);

                // After all the swaps have taken place, run the endAnimation() sequence. 
                if (i === swapIndices.length - 1) {
                    resolve(endAnimation());
                }
            }, i * 10);
        }
    }); 
}

function endAnimation() {
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    for (let i = 0; i < arrLen; i++) {
        setTimeout(() => {
            arr[i].style.backgroundColor = "#39D055";
        }, i * 35);
    }
}