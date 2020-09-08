$(document).ready(() => {
    // Load page with unsorted array of 25 rectangles.  
    drawRectangles(25);

    // Generate user-specified number of rectangles on generate click.
    $('.generate-btn').click(() => {
        const numOfElements = $('#elements').val();
        drawRectangles(numOfElements);

        // If 'display values' is checked, then uncheck it. 
        if ($('#display__checkbox')[0].checked) {
            $('#display__checkbox').prop('checked', false);
        }

        // Prevent Default Form Behavior
        event.preventDefault();
    });

    // Show/hide value divs on checkbox click. 
    $('#display__checkbox').click(() => {
        $('.values').toggle();
    });

    // Only add 'selected' class to selected sort. 
    $('.algorithm__sorts').click(function() {
        $('.algorithm__sorts').removeClass('selected');
        $(this).addClass('selected');
    });

    // Run specified sort on sort click. 
    $('.sort-btn').click(() => {
        const sorts = $('.algorithm__sorts');

        if (!sorts.hasClass('selected')) {
            alert('No sorts selected!');
        } else {
            const selectedSort = $('.selected')[0].id;

            switch (selectedSort) {
                case 'bubble':
                    bubbleSort();
                    break;
                case 'selection':
                    selectionSort();
                    break;
                case 'insertion':
                    insertionSort();
                    break;
                case 'quick':
                    quickSort();
                    break;
                case 'merge':
                    mergeSort();
                    break;
                case 'heap':
                    heapSort();
                    break;
                default: 
                    alert('No sort selected!');
            }
        }        
    });
});

function createValueDivs() {
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    // Go through all the divs, get height value, and create new values-div. 
    for (let i = 0; i < arrLen; i++) {
        const currentRectangleHeight = arr[i].dataset.height;

        const div = `<div class='values'>${currentRectangleHeight}</div>`;

        // When new div is appended to the rectangle, the div is rendered as text content, not as HTML. 
        const valueDiv = $.parseHTML(div);

        // Append parsed content to rectangle. 
        arr[i].append(valueDiv[0]);
    }

    $('.values').hide();
}

function drawRectangles(numOfElements) {
    // Remove all rectangle-divs (and their child value-divs) from previous sort operations. 
    $('#canvas-container').empty();

    // Calculate the width of each rectangle based on the container width and number of selected elements. 
    const rectWidth = $('#canvas-container').width() / numOfElements; 

    // Create n number of divs and append to canvas container. 
    for (let i = 0; i < numOfElements; i++) {
        // Generate a random number between 0 and 100. 
        const randomNumber = Math.floor(Math.random() * 100) + 1;  

        // Create new div with random height, calculated width, and data attribute equal to random height.
        const height = `height: ${randomNumber}%;`;
        const width = `width: ${rectWidth}%;`;
        const data = `data-height="${randomNumber}"`;
        const newDiv = `<div class="rectangles" style='${height}${width}' ${data}></div>`;

        $('#canvas-container').append(newDiv);  
    }

    createValueDivs();
}

function bubbleSort() {
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    const swapIndices = [];

    // Array of one element is already sorted. Call end animation sequence. 
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

// Swap height values for rectangles-divs and innerText values for values-divs.  
function swapStyle(a, b, arr) {

    let styleTemp = arr[a].style.height;
    arr[a].style.height = arr[b].style.height;
    arr[b].style.height = styleTemp;

    // Swap innerText for div values. 
    let textTemp = arr[a].firstChild.innerText;
    arr[a].firstChild.innerText = arr[b].firstChild.innerText;
    arr[b].firstChild.innerText = textTemp;
}

// Run swaps on the rectangles-divs, and, once completed, run the end animation sequence. 
async function swapAnimation(swapIndices, arr) {
    await new Promise((resolve, reject) => {
        for (let i = 0; i < swapIndices.length; i++) {
            setTimeout(() => {
                swapStyle(swapIndices[i][0], swapIndices[i][1], arr);
 
                if (i === swapIndices.length - 1) {
                    resolve(endAnimation());
                }
            }, i * 10);
        }
    }); 
}

// Go through the sorted array and change the background colors for rectangles-divs. 
function endAnimation() {
    const arr = $('#canvas-container').children();
    const arrLen = $('#canvas-container').children().length;

    for (let i = 0; i < arrLen; i++) {
        setTimeout(() => {
            arr[i].style.backgroundColor = '#39D055';
        }, i * 35);
    }
}