let touchableBlocks = document.querySelectorAll('.block.touchable');
let question_answer = document.querySelectorAll(".question-answer")
let blockNumData = []
let blocksData = []
let AnswerValue = 0;

function getTrimedNumber(useTag) {
    return useTag.getAttribute('data-c').slice(-1);
}

let keta100, keta10;
function getNumber(index, trimedNumber) {
    let Num;
    switch (index) {
        case 0:
            keta100 = Number(trimedNumber);
            Num = keta100;
            break;
        case 1:
            keta10 = Number(trimedNumber);
            Num = keta100 * 10 + keta10;
            break;
        case 2:
            Num = keta100 * 100 + keta10 * 10 + Number(trimedNumber);
            break;
    }

    return Num;
}


function isFractionQuestion()
{
    let gTags = document.querySelectorAll("g")
    let isFrac = false
    gTags.forEach(g => {
        if(g.getAttribute("data-mml-node") == "mfrac")
        {
            if (g.closest('.block.touchable'))
            {
                isFrac = true
            }
        }
    });

    return isFrac
}

function getFraction(block) {
    let gTags = block.querySelectorAll("g");
    let fractionObject = [];

    let fraction = [];
    let denominator;
    let numerator;

    gTags.forEach(g => {
        if (g.getAttribute("data-mml-node") == "mrow") {
            let mrow = g.querySelectorAll("g");
            mrow.forEach(m => {
                if(m.getAttribute("data-mml-node") == "mstyle") {
                    fractionObject.push(g);
                }
            });
        }
    });

    fractionObject.forEach((f, index) => {
        switch(index) {
            case 0: // 分子
                let useTagsNumerator = f.querySelectorAll("use");
                useTagsNumerator.forEach((useTag, index) => {
                    let trimedNumber = getTrimedNumber(useTag);
                    let Num = getNumber(index, trimedNumber);
                    numerator = Num;
                });
                break;
            case 1: // 分母
                let useTagsDenominator = f.querySelectorAll("use");
                useTagsDenominator.forEach((useTag, index) => {
                    let trimedNumber = getTrimedNumber(useTag);
                    let Num = getNumber(index, trimedNumber);
                    denominator = Num;
                });
                break;
        }
    });


    console.log("Fraction: " + numerator + "/" + denominator);

    fraction.push(numerator, denominator);
    return fraction;
}

function truncateDecimals(array) {
    return array.map(num => {
        if (Number.isInteger(num)) {
            return num;
        } else {
            return Math.floor(num * 100) / 100;
        }
    });
}

function getNumList() {
    blockNumData = [];
    blocksData = [];

    touchableBlocks.forEach(block => {
        let Num;

        if (isFractionQuestion()) {
            let fraction = getFraction(block);
            Num = fraction;
        } else {
            let useTags = block.querySelectorAll('use');


            
            let decimalPart = 0;
            let decimalDigits = [];
            let isDecimal = false;

            useTags.forEach((useTag, index) => {
                let trimedNumber = getTrimedNumber(useTag);
                let dataC = useTag.getAttribute('data-c')

                if (dataC === "2E") {
                    isDecimal = true;
                } else {
                    if (!isDecimal) {
                        Num = getNumber(index, trimedNumber);
                    } else {
                        if (decimalDigits.length < 2) {
                            decimalDigits.push(Number(trimedNumber));
                        }
                    }
                }
            });

            if (isDecimal) {
                decimalPart = decimalDigits.length >= 1 ? decimalDigits[0] / 10 : 0;
                decimalPart += decimalDigits.length >= 2 ? decimalDigits[1] / 100 : 0;
                Num = Num + decimalPart;
            }

            truncateDecimals([Num]);
        }

        blockNumData.push(Num);
        blocksData.push(block);
    });
}


function getQuestionAnswer() {
    question_answer.forEach(element => {
        let useTags = element.querySelectorAll("use");
        let Num;
        let decimalPart = 0;
        let decimalDigits = [];
        let isDecimal = false;
        

        useTags.forEach((useTag, index) => {
            let trimedNumber = getTrimedNumber(useTag);
            let dataC = useTag.getAttribute('data-c')

            if (dataC === "2E") {
                isDecimal = true;
            } else {
                if (!isDecimal) {
                    Num = getNumber(index, trimedNumber);
                } else {
                    if (decimalDigits.length < 2) {

                        decimalDigits.push(Number(trimedNumber));
                    }
                }
            }
        });

        if (isDecimal) {
            decimalPart = decimalDigits.length >= 1 ? decimalDigits[0] / 10 : 0;
            decimalPart += decimalDigits.length >= 2 ? decimalDigits[1] / 100 : 0;
            Num = Num + decimalPart;
        }

        console.log("Answer: " + Num);
        AnswerValue = Num;
    });
}

function findPairs(type, arr, target) {
    let pairs = [];
    let used = new Set(); // 使用済みの数字を追跡するセット

    let numbers = arr;
    let answer = target;

    if (isFractionQuestion()) {
        arr.forEach(element => {
            answer = target * element[1];
        });

        let denominator = arr[0][1];
        numbers = arr.flat().filter(item => item !== denominator);

        blockNumData = numbers;
    }

    for (let i = 0; i < numbers.length; i++) {

        let currentNum = numbers[i];

        for (let j = i + 1; j < numbers.length; j++) {
            let complement = numbers[j];

            switch (type) {
                case "+":
                    if (currentNum + complement === answer) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }

                    break;
                case "-":
                    if (currentNum - complement === answer || complement - currentNum === answer) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }
                    break;
                case "*":
                    if (currentNum * complement === answer) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }
                    break;
                case "/":
                    if ((currentNum / complement === answer || complement / currentNum === answer) && complement !== 0 && currentNum !== 0) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }
                    break;
                default:
                    continue;
            }

            // 使った数字をセットに追加
            used.add(currentNum);
            used.add(complement);
        }
    }

    pairs.sort(function(a,b){
        if( a > b ) return -1;
        if( a < b ) return 1;
        return 0;
    });

    return pairs;
}

function findTriplets(type, arr, target) {
    let triplets = [];

    for (let i = 0; i < arr.length - 2; i++) {
        for (let j = i + 1; j < arr.length - 1; j++) {
            for (let k = j + 1; k < arr.length; k++) {
                let a = arr[i];
                let b = arr[j];
                let c = arr[k];

                switch (type) {
                    case "+":
                        if (a + b + c === target) {
                            triplets.push(a, b, c); // フラットに追加
                        }
                        break;
                    case "-":
                        if (a - b - c === target || b - a - c === target || c - a - b === target) {
                            triplets.push(a, b, c); // フラットに追加
                        }
                        break;
                    case "*":
                        if (a * b * c === target) {
                            triplets.push(a, b, c); // フラットに追加
                        }
                        break;
                    case "/":
                        if (
                            (a / b / c === target && b !== 0 && c !== 0) ||
                            (b / a / c === target && a !== 0 && c !== 0) ||
                            (c / a / b === target && a !== 0 && b !== 0)
                        ) {
                            triplets.push(a, b, c); // フラットに追加
                        }
                        break;
                    default:
                        continue;
                }
            }
        }
    }

    return triplets; // フラットな配列を返す
}


function isCalcType(targetSrc) {
    const div = document.querySelector(".obj.calc-sym");
    const img = div.querySelector("img");

    return img && img.src.endsWith(targetSrc);
}

const plus = "/img/live/tashipita/tashipita_img_formula_plus_01.svg";
const minus = "/img/live/tashipita/tashipita_img_formula_minus_01.svg";
const times = "/img/live/tashipita/tashipita_img_formula_times_01.svg";
const divide = "/img/live/tashipita/tashipita_img_formula_divided_01.svg";

function getCalcType() {
    if (isCalcType(plus)) {
        return "+";
    } else if (isCalcType(minus)) {
        return "-";
    } else if (isCalcType(times)) {
        return "*";
    } else if (isCalcType(divide)) {
        return "/";
    }
}

let count = 0;
function click()
{
    getNumList();
    getQuestionAnswer();

    let pair = count > 7 ? findTriplets(getCalcType(), blockNumData, AnswerValue) : findPairs(getCalcType(), blockNumData, AnswerValue);
    
    console.log("Got Numbers: " + blockNumData);
    console.log("Answer Pairs: " + pair);

    pair.forEach((element, index) => {
        let pos = blockNumData.indexOf(element);

        setTimeout(() => {
            console.log(pos)
            blocksData[pos].click();
        }, index == 0 ? 0 : index == 1 ? 500 : 1000);

    });
}

click();
setInterval(() => {
    count++;
    click();
}, 3000);
