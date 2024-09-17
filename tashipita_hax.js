let touchableBlocks = document.querySelectorAll('.block.touchable');
let question_answer = document.querySelectorAll(".question-answer")
let blockNumData = []
let AnswerValue = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

touchableBlocks.forEach(block => {
    let useTags = block.querySelectorAll('use');
    let keta10;
    let Num;

    useTags.forEach((useTag, index) => {
        let dataC = useTag.getAttribute('data-c');
        let trimedNumber = dataC.slice(-1)

        switch(index)
        {
            case 0:
                keta10 = Number(trimedNumber)
		        Num = keta10
                break;
            case 1:
	   	        Num = keta10 * 10 + Number(trimedNumber)
                break;
        }
    });

    blockNumData.push(Num)
});

question_answer.forEach(element => {
    let useTags = element.querySelectorAll("use");
    let keta10;
    let Num;

    useTags.forEach((useTag, index) => {
        let dataC = useTag.getAttribute('data-c');
        let trimedNumber = dataC.slice(-1)

        switch(index)
        {
            case 0:
                keta10 = Number(trimedNumber)
		        Num = keta10
                break;
            case 1:
	   	        Num = keta10 * 10 + Number(trimedNumber)
                break;
        }
    });

    console.log("Answer: " + Num)
    AnswerValue = Num
});

function findPairs(arr, target) {
    let pairs = [];
    let seen = new Map(); // 数字を記録するマップ

    for (let i = 0; i < arr.length; i++) {
        let currentNum = arr[i];
        let complement = target - currentNum;

        // complementが存在し、かつ同じ数ではないかチェック
        if (seen.has(complement) && seen.get(complement) > 0) {
        pairs.push(currentNum, complement); // 1次元配列にペアとして格納
        // 使った数字をデクリメント
        seen.set(complement, seen.get(complement) - 1);
        } else {
        // 現在の数字をマップに追加
        seen.set(currentNum, (seen.get(currentNum) || 0) + 1);
        }
    }

    return pairs;
}

console.log(blockNumData)

let pair = findPairs(blockNumData, AnswerValue);
console.log(pair)
touchableBlocks.forEach(block => {
    let useTags = block.querySelectorAll('use');
    let keta10;
    let Num;

    useTags.forEach((useTag, index) => {
        let dataC = useTag.getAttribute('data-c');
        let trimedNumber = dataC.slice(-1)

        switch(index)
        {
            case 0:
                keta10 = Number(trimedNumber)
		        Num = keta10
                break;
            case 1:
	   	        Num = keta10 * 10 + Number(trimedNumber)
                break;
        }

        pair.forEach(element => {
            if (Num == element)
            {
                setTimeout(() => {
                    block.click()
                }, 1000); // 1000ミリ秒 (1秒) 待つ
            }
        });
    });
});
