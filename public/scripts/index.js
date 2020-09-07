// On page load, have a default number of rectangles on display and ready to be sorted. 
$(document).ready(function() {
    const numOfElements = 25; 
    drawRectangles(numOfElements);

    showValues();
});

function showValues() {
    // Grab all rectangles from canvas container. 
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    // Go through all the divs, get height value, and create value div. 
    for (let i = 0; i < arrLen; i++) {
        // Grab height value.
        const currentRectangleHeight = arr[i].dataset.height;

        // Create a new div with height value as text content. 
        const div = `<div class='values'>${currentRectangleHeight}</div>`;

        // When new div is appended to the rectangle, the div is rendered as text content, not as HTML. 
        const valueDiv = $.parseHTML(div);

        // Append parsed content to rectangle. 
        arr[i].append(valueDiv[0]);
    }
}

// When user submits a specific number of rectangles, call drawRectangle() function. 
function processInput(event) {
    const numOfElements = $('#elements').val();
    drawRectangles(numOfElements);

    // Prevent Default Form Behavior
    event.preventDefault();
}

function drawRectangles(numOfElements) {
    // Remove all other divs that may be in the container from previous sort operations. 
    $('#canvas-container').empty();

    // Calculate the width of each rectangle based on the container width and number of selected elements. 
    const rectWidth = $('#canvas-container').width() / numOfElements; 

    // Create n number of divs and append to canvas container. 
    for (let i = 0; i < numOfElements; i++) {
        // Generate a random number between 0 and 100. 
        const randomNumber = Math.floor(Math.random() * 100) + 1;  

        // Create new div with random height, calculated width, and data attribute equal to random height.
        const height = `height: ${randomNumber}%;`;
        const width = `width: ${rectWidth}px;`;
        const data = `data-height="${randomNumber}"`;
        const newDiv = `<div class="rectangles" style='${height}${width}' ${data}></div>`;

        $('#canvas-container').append(newDiv);  
    }
}

function sort() {
    bubbleSort(); 
}

function bubbleSort() {
    // Grab all rectangles from canvas container. 
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    const swapIndices = [];

    // If array only has one element, there is no need to sort. Call endAnimation(). 
    if(arr.length === 1) {
        return endAnimation();
    }

    for (let i = 0; i < arrLen; i++) {
        for (let j = 0; j < arrLen - i - 1; j++) {
            // Convert String-Type Values to Numbers
                // The height values are stored in the dataset-height attribute of all divs. 
                // The dataset-height attribute only accepts string values. 
            const currentValue = parseInt(arr[j].dataset.height, 10);
            const nextValue = parseInt(arr[j + 1].dataset.height, 10);

            // Compare Values and Swap if Current > Next
            if (currentValue > nextValue) {
                // Push pairs of indices to swap into swapIndices array. 
                    // We do this so that we can gather all pairs of indices to swap and run them all at once. 
                swapIndices.push([j, j+1]);
                // In order to get the correct pairs of indices to swap, you need to continue with the bubbleSort operation. 
                    // Every swap relies on the previous swap to get the unsorted array closer to being sorted. 
                swapData(j, j + 1, arr); 
            }
        }
    }

    return swapAnimation(swapIndices, arr);
}

// Swap Dataset Height
function swapData(a, b, arr) {
    let dataTemp = arr[a].dataset.height;
    arr[a].dataset.height = arr[b].dataset.height;
    arr[b].dataset.height = dataTemp;
}

function swapStyle(a, b, arr) {
    // Swap values for height property. 
    let styleTemp = arr[a].style.height;
    arr[a].style.height = arr[b].style.height;
    arr[b].style.height = styleTemp;

    // Swap innerText for div values. 
    let textTemp = arr[a].firstChild.innerText;
    arr[a].firstChild.innerText = arr[b].firstChild.innerText;
    arr[b].firstChild.innerText = textTemp;
}

async function swapAnimation(swapIndices, arr) {
    // Wrap the swapAnimation process (i.e. the entire for loop) in a promise so that it be completed before running the end-animation sequence. 
        // Once the swap animation is done (i.e. checked via the conditional statement), then run the end-animation sequence. 
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
    // Go through the sorted array and change the background colors. 
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    for (let i = 0; i < arrLen; i++) {
        setTimeout(() => {
            arr[i].style.backgroundColor = "#39D055";
        }, i * 35);
    }
}