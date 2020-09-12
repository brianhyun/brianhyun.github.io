$(document).ready(() => {
    // Load page with unsorted array of 25 rectangles.  
    drawRectangles(25);

    // Add selected class to generate btn.
    $('.generate-btn').addClass('active-btn');

    // On valid input change, change button style to indicate generation. 
    $('#elements').on('input', function() {
        if($(this).val()) {
            $('.generate-btn').addClass('active-btn');
        } else {
            $('.generate-btn').removeClass('active-btn');
        }
    });

    // Under JavaScript, the letter 'e' and the period (.) symbol are allowed in input elements of type number 
    // because they are mathematically relevant symbols (i.e. 10e2, 1.22); 
    $('#elements').keydown((event) => {
        if (event.key === 'e' || event.key === '.') {
            return false;
        }
    });

    // Generate user-specified number of rectangles on generate click.
    $('.form__elements').submit(() => {
        const numOfElements = $('#elements').val();
        drawRectangles(numOfElements);

        // If 'display values' is checked, then uncheck it. 
        if ($('#display__checkbox')[0].checked) {
            $('#display__checkbox').prop('checked', false);
        }

        // Clear selected sort. 
        $('.algorithm__sorts').removeClass('selected');

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
            alert('Select a Sort!');
        } else {
            const arr = $('#canvas-container').children();
            const swapIndices = [];
        
            if(arr.length === 1) {
                return endAnimation();
            }

            const selectedSort = $('.selected')[0].id;

            switch (selectedSort) {
                case 'bubble':
                    bubbleSort(arr, swapIndices);
                    break;
                case 'selection':
                    selectionSort(arr, swapIndices);
                    break;
                case 'insertion':
                    insertionSort(arr, swapIndices);
                    break;
                case 'quick':
                    quickSort(swapIndices, arr, 0, arr.length - 1);
                    swapAnimation(swapIndices, arr);
                    break;
                case 'merge':
                    const overrideIndexValueArr = [];
                    mergeSort(overrideIndexValueArr, arr, 0, arr.length - 1);
                    mergeSortOverrideAnimation(arr, overrideIndexValueArr);
                    break;
                case 'heap':
                    heapSort(arr, swapIndices);
                    break;
                default: 
            }
        }        
    });
});

function createValueDivs() {
    const arr = $('#canvas-container').children();

    // Go through all the divs, get height value, and create new values-div. 
    for (let i = 0; i < arr.length; i++) {
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

/*
 * Sorting Algorithms
*/

// Bubble Sort
function bubbleSort(arr, swapIndices) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            // Convert String-Type Values to Numbers
                // The height values are stored in the dataset-height attribute of all divs. The dataset-height attribute only accepts string values. 
            const currentValue = parseInt(arr[j].dataset.height, 10);
            const nextValue = parseInt(arr[j + 1].dataset.height, 10);

            // Compare Values and Swap if Current > Next
            if (currentValue > nextValue) {
                // Push pairs of indices to swap into swapIndices array. We do this so that we can gather all pairs of indices to swap and run them all at once. 
                swapIndices.push([j, j+1]);
                // In order to get the correct pairs of indices to swap, you need to continue with the bubbleSort operation. Every swap relies on the previous swap to get the unsorted array closer to being sorted. 
                swapData(j, j + 1, arr); 
            }
        }
    }

    return swapAnimation(swapIndices, arr);
}

// Insertion Sort
function insertionSort(arr, swapIndices) {
    for (let i = 1; i < arr.length; i++) {
        let index = i; 
        
		for (let j = i - 1; j >= 0; j--) {
            const currentValue = parseInt(arr[index].dataset.height, 10);
            const previousValue = parseInt(arr[j].dataset.height, 10);

			if (currentValue < previousValue) {
                swapIndices.push([index, j]);
                swapData(index, j, arr);
            }
            
			index--; 
		}
    }
    
    return swapAnimation(swapIndices, arr);
}

// Selection Sort
function selectionSort(arr, swapIndices) {
    for (let i = 0; i < arr.length; i++) {
        const smallestIndex = indexOfSmallestValue(arr, i);

        swapIndices.push([i, smallestIndex]);
        swapData(i, smallestIndex, arr);
    }

    return swapAnimation(swapIndices, arr);
}

function indexOfSmallestValue(arr, iteration) {
    let index = iteration; 
    let min = parseInt(arr[index].dataset.height, 10);

    for (let i = index + 1; i < arr.length; i++) {
        let nextValue = parseInt(arr[i].dataset.height, 10);

        if (min > nextValue) {
            min = nextValue;
            index = i; 
        }
    }

    return index;
}

// Quick Sort
function quickSort(swapIndices, arr, left, right) {
	if (left < right) {
		const pivotIndex = partition(swapIndices, arr, left, right);
	
		quickSort(swapIndices, arr, left, pivotIndex - 1);
		quickSort(swapIndices, arr, pivotIndex + 1, right);
    }
}

function partition(swapIndices, arr, left, right) {
    const pivot = parseInt(arr[right].dataset.height, 10);
	let i = left - 1;

	for (let j = left; j <= right - 1; j++) {
        const currentElement = parseInt(arr[j].dataset.height, 10);
		if (currentElement < pivot) {
            i++; 
            swapIndices.push([i, j]);
			swapData(i, j, arr); 
		}
    }

    swapIndices.push([i+1, right]);
	swapData(i+1, right, arr);
	return i+1; 
}

// Heap Sort
function maxHeap(swapIndices, arr, arrLen, parentIndex) {
    let maxIndex = parentIndex;
    const leftChildIndex = (parentIndex * 2) + 1; 
    const rightChildIndex = (parentIndex * 2) + 2; 

	if ((leftChildIndex < arrLen) && (parseInt(arr[leftChildIndex].dataset.height, 10) > parseInt(arr[maxIndex].dataset.height, 10))) {
        maxIndex = leftChildIndex;
    }
    
	if ((rightChildIndex < arrLen) && (parseInt(arr[rightChildIndex].dataset.height, 10) > parseInt(arr[maxIndex].dataset.height, 10))) {
		maxIndex = rightChildIndex;
	}

	if (maxIndex !== parentIndex) {
        swapIndices.push([parentIndex, maxIndex]);
		swapData(parentIndex, maxIndex, arr); 
		maxHeap(swapIndices, arr, arrLen, maxIndex);
	}
}

function heapSort(arr, swapIndices) {
    const arrLen = arr.length; 

	for (let i = Math.floor((arrLen / 2) - 1); i >= 0; i--) {
		maxHeap(swapIndices, arr, arrLen, i);
	}

	for (let i = arrLen - 1; i > 0; i--) {
        swapIndices.push([0, i]);
		swapData(0, i, arr);
		maxHeap(swapIndices, arr, i, 0);
	}

    return swapAnimation(swapIndices, arr);
}

// Merge Sort 
function mergeSort(overrideIndexValueArr, arr, left, right) {
	if (left < right) {
		const middle = Math.floor((right - left) / 2) + left;

		mergeSort(overrideIndexValueArr, arr, left, middle);
		mergeSort(overrideIndexValueArr, arr, middle + 1, right);
	
		merge(overrideIndexValueArr, arr, left, middle, right); 
	}
}

function merge(overrideIndexValueArr, arr, left, middle, right) {
	const leftSize = middle - left + 1; 
    const rightSize = right - middle; 
  
	// Create temporary arrays.
    const tempLeft = [], tempRight = []; 
  
    // Copy data to temp arrays.
    for (let i = 0; i < leftSize; i++) {
        tempLeft.push(arr[left + i].dataset.height); 
	}

    for (let i = 0; i < rightSize; i++) {
        tempRight.push(arr[middle + 1 + i].dataset.height); 
	}
  
    // Compare values in left half and right half and store lesser values in original array. 
    let i = 0, j = 0, k = left;

    while (i < leftSize && j < rightSize) { 
        const leftChildElement = parseInt(tempLeft[i], 10), rightChildElement = parseInt(tempRight[j], 10);    

        if (leftChildElement <= rightChildElement) { 
            overrideIndexValueArr.push([k, tempLeft[i]]);
            arr[k].dataset.height = tempLeft[i]; 
            i++; 
        } else {    
            overrideIndexValueArr.push([k, tempRight[j]]);
            arr[k].dataset.height = tempRight[j]; 
            j++; 
        } 
        k++; 
    } 
  
    // Copy remaining elements of left half.
    while (i < leftSize) { 
        overrideIndexValueArr.push([k, tempLeft[i]]);
        arr[k].dataset.height = tempLeft[i]; 
        i++; 
        k++; 
    } 
  
    // Copy remaining elements of right half. 
    while (j < rightSize) {
        overrideIndexValueArr.push([k, tempRight[j]]);
        arr[k].dataset.height = tempRight[j]; 
        j++; 
        k++; 
    } 
}

function mergeSortOverrideValue(arr, overrideIndexValueArr) {
    const k = overrideIndexValueArr[0], dataHeight = overrideIndexValueArr[1];

    arr[k].dataset.height = dataHeight; 
    arr[k].style.height = dataHeight + '%'; 
    arr[k].firstChild.innerText = dataHeight;
}

// For merge sort only. Override values in original array and when finished, run end animation sequence. 
async function mergeSortOverrideAnimation(arr, overrideIndexValueArr) {
    await new Promise((resolve, reject) => {
        for (let i = 0; i < overrideIndexValueArr.length; i++) {
            setTimeout(() => {
                mergeSortOverrideValue(arr, overrideIndexValueArr[i]); 

                if (i === overrideIndexValueArr.length - 1) {
                    resolve(endAnimation());
                }
            }, i * 10);
        }
    });
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

    for (let i = 0; i < arr.length; i++) {
        setTimeout(() => {
            arr[i].style.backgroundColor = '#39D055';
        }, i * 35);
    }
}