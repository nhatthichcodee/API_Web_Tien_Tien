const md5 = require('md5');

let MD5 = (passWord) => {
    return md5(passWord)
}

let getDate = () =>{
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date
}

let getScoreSearch = (dataPost, keyword) =>{
    var listKeyWord = keyword.split(' ')
    var score = 0;
    for (let i = 0; i < listKeyWord.length; i++) {
        score += (dataPost.split(listKeyWord[i]).length - 1)
    }
    return score
}

let getRandom = (min,max) =>{
    return Math.floor(Math.random() * (max - min)) + min;
}

let getSame = (arr1,arr2) =>{
    var same = 0
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) {
            same++
        }
    }
    return same;
}

module.exports={
    MD5:MD5,
    getDate:getDate,
    getScoreSearch:getScoreSearch,
    getRandom:getRandom,
    getSame:getSame
}