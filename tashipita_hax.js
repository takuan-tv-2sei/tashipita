let touchableBlocks = document.querySelectorAll('.block.touchable');
let question_answer = document.querySelectorAll(".question-answer")
let blockNumData = []
let blocksData = []
let AnswerValue = 0;

function getNumList()
{
    blockNumData = []
    blocksData = []

    touchableBlocks.forEach(block => {
        let useTags = block.querySelectorAll('use');
        let keta100, keta10, Num;
    
        useTags.forEach((useTag, index) => {
            let dataC = useTag.getAttribute('data-c');
            let trimedNumber = dataC.slice(-1);
    
            switch(index) {
                case 0:
                    // 100の位
                    keta100 = Number(trimedNumber);
                    Num = keta100;
                    break;
                case 1:
                    // 10の位
                    keta10 = Number(trimedNumber);
                    Num = keta100 * 10 + keta10;
                    break;
                case 2:
                    // 1の位
                    Num = keta100 * 100 + keta10 * 10 + Number(trimedNumber);
                    break;
            }
        });
    
        blocksData.push(block);
        blockNumData.push(Num);
    });
}

function getQuestionAnswer()
{
    question_answer.forEach(element => {
        let useTags = element.querySelectorAll("use");
        let keta100, keta10, Num;
    
        useTags.forEach((useTag, index) => {
            let dataC = useTag.getAttribute('data-c');
            let trimedNumber = dataC.slice(-1);
    
            switch(index) {
                case 0:
                    // 100の位
                    keta100 = Number(trimedNumber);
                    Num = keta100;
                    break;
                case 1:
                    // 10の位
                    keta10 = Number(trimedNumber);
                    Num = keta100 * 10 + keta10;
                    break;
                case 2:
                    // 1の位
                    Num = keta100 * 100 + keta10 * 10 + Number(trimedNumber);
                    break;
            }
        });
    
        console.log("Answer: " + Num);
        AnswerValue = Num;
    });
}


function findPairs(type, arr, target) {
    let pairs = [];
    let seen = new Map(); // 数字を記録するマップ
    let used = new Set(); // 使用済みの数字を記録するセット

    for (let i = 0; i < arr.length; i++) {
        let currentNum = arr[i];
        let complement;

        switch (type) {
            case "+":
                complement = target - currentNum;
                break;
            case "-":
                complement = currentNum - target;
                break;
            case "*":
                if (currentNum === 0) continue;
                complement = target / currentNum;
                break;
            case "/":
                if (target === 0 || currentNum === 0) continue;
                complement = target * currentNum;
                break;
            default:
                continue;
        }

        // 現在の数字がすでに使用されているかをチェック
        if (used.has(currentNum)) continue;

        // complementが存在し、かつ同じ数ではないかチェック
        if (seen.has(complement) && seen.get(complement) > 0) {
            // ペアとして格納
            pairs.push(currentNum, complement);
            // 使用済みの数字として追加
            used.add(currentNum);
            used.add(complement);
            // 使った数字をデクリメント
            seen.set(complement, seen.get(complement) - 1);
        } else {
            // 現在の数字をマップに追加
            seen.set(currentNum, (seen.get(currentNum) || 0) + 1);
        }
    }

    return pairs;
}



function isCalcType(targetSrc)
{
    const div = document.querySelector(".obj.calc-sym");
    const img = div.querySelector("img");

    return img && img.src.endsWith(targetSrc);
}

console.log(blockNumData)



const plus = "/img/live/tashipita/tashipita_img_formula_plus_01.svg";
const minus = "/img/live/tashipita/tashipita_img_formula_minus_01.svg";
const times = "/img/live/tashipita/tashipita_img_formula_times_01.svg"
const divide = "/img/live/tashipita/tashipita_img_formula_divided_01.svg"

function getCalcType()
{
    if (isCalcType(plus))
    {
        return "+";
    } else if (isCalcType(minus))
    {
        return "-";
    } else if (isCalcType(times))
    {
        return "*";
    } else if (isCalcType(divide))
    {
        return "/"
    }
}

console.log(getCalcType())



setInterval(() => {
    getNumList();
    getQuestionAnswer();

    let pair = findPairs(getCalcType(), blockNumData, AnswerValue);
    console.log(pair)
    pair.forEach((element, index) => {
        let pos = blockNumData.indexOf(element)
        
        setTimeout(() => {
            blocksData[pos].click()
        }, index == 0 ? 1000 : 2000);
    });
}, 5000);
