let touchableBlocks = document.querySelectorAll('.block.touchable');
let question_answer = document.querySelectorAll(".question-answer")
let blockNumData = []
let blocksData = []
let AnswerValue = 0;

function isFractionQuestion(block)
{
    let gTags = block.querySelectorAll("g")
    let isFrac = false
    gTags.forEach(g => {
        if(g.getAttribute("data-mml-node") == "mfrac")
        {
            isFrac = true
        }
    });

    return isFrac
}

function isFractionQuestion(block) {
    let gTags = block.querySelectorAll("g");
    let isFrac = false;
    gTags.forEach(g => {
        if (g.getAttribute("data-mml-node") == "mfrac") {
            isFrac = true;
        }
    });
    return isFrac;
}

function getFractionParts(block) {
    
}

function getNumList() {
    blockNumData = [];
    blocksData = [];

    touchableBlocks.forEach(block => {
        if (isFractionQuestion(block)) {
            
        } else {
            let useTags = block.querySelectorAll('use');
            let keta100, keta10, Num;
            let decimalPart = 0;
            let decimalDigits = [];
            let isDecimal = false;

            useTags.forEach((useTag, index) => {
                let dataC = useTag.getAttribute('data-c');
                let trimedNumber = dataC.slice(-1);

                if (dataC === "2E") {
                    isDecimal = true;
                } else {
                    if (!isDecimal) {
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

            blocksData.push(block);
            blockNumData.push(Num);
        }
    });
}


function getQuestionAnswer() {
    question_answer.forEach(element => {
        let useTags = element.querySelectorAll("use");
        let keta100, keta10, Num;
        let decimalPart = 0;
        let decimalDigits = [];
        let isDecimal = false;

        useTags.forEach((useTag, index) => {
            let dataC = useTag.getAttribute('data-c');
            let trimedNumber = dataC.slice(-1);

            if (dataC === "2E") {
                isDecimal = true;
            } else {
                if (!isDecimal) {
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

    for (let i = 0; i < arr.length; i++) {
        let currentNum = arr[i];

        for (let j = i + 1; j < arr.length; j++) {
            let complement = arr[j];

            switch (type) {
                case "+":
                    if (currentNum + complement === target) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }
                    break;
                case "-":
                    if (currentNum - complement === target || complement - currentNum === target) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }
                    break;
                case "*":
                    if (currentNum * complement === target) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }
                    break;
                case "/":
                    if ((currentNum / complement === target || complement / currentNum === target) && complement !== 0 && currentNum !== 0) {
                        pairs.push(currentNum, complement); // 順番にpush
                    }
                    break;
                default:
                    pairs.sort((a, b) => b - a);
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
    console.log(pair);
    console.log(blockNumData);
    pair.forEach((element, index) => {
        let pos = blockNumData.indexOf(element);

        setTimeout(() => {
            blocksData[pos].click();
        }, index == 0 ? 0 : index == 1 ? 1000 : 2000);
    });
}

click();
setInterval(() => {
    count++;
    click();
}, 4000);
