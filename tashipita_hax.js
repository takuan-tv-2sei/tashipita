let touchableBlocks = document.querySelectorAll('.block.touchable');
let blockNumData = []

touchableBlocks.forEach(block => {
    let useTags = block.querySelectorAll('use');
    let pureNum;

    useTags.forEach((useTag, index) => {
        let dataC = useTag.getAttribute('data-c');
        let trimedNumber = dataC.slice(-1)

        switch(index)
        {
            case 1:
                pureNum += trimedNumber * 10
                break;
            case 2:
                purenum += trimedNumber
                break;
        }
        
    });

    blockNumData.push(pureNum)
});

console.log(blockNumData)