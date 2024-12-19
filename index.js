// constant attribut
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length-Num]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBin = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebin = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox");
const symbols = '~`!@#$%^&*()_+=-][{}":;,./?><';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// ste strength circle color
setIndicator("#ccc");

// set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRndNum(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generatesymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");  
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

//connect with me
// https://github.com/krisprajapati03

function shufflePassword(array){
    //Fisher Yates Algo
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>(str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBin.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
});

generatebin.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the jouney to find password

    //remove old password
    password="";

    //let's put the stuff mentioned by chacked

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRndNum();
    // }
    // if(symbolsCheck.checked){
    //     password += generatesymbol() ;
    // }


    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);
    
    if(symbolsCheck.checked)
        funArr.push(generatesymbol);
    
    if(numbersCheck.checked)
        funArr.push(generateRndNum);

    //compulsory addition
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }

    console.log(password);

    //remaining addition
    for(let i=0;i<passwordLength-funArr.length; i++){
        let randIndex = getRndInteger(0,funArr.length);
        password += funArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();

} )