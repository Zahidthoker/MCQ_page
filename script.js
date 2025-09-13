const quizData = [
    {
        question: 'Which language runs in a web browser?',
        options:['Java','C','Python','JavaScript'],
        correct: 'JavaScript',
    },
    {
        question: 'What does CSS stand for?',
        options:['Central Style Sheets','Cascading Style Sheets','Cascading Simple Sheets','Cars SUVs Sailboats'],
        correct: 'Cascading Style Sheets',
    },
    {
        question: 'What does HTML stand for?',
        options:['Hypertext Markup Language','Hypertext Markdown Language','Hyperloop Machine Language','Helicopters Terminals Motorboats Lamborginis'],
        correct: 'Hypertext Markup Language',
    },
    {
        question: 'What year was JavaScript launched?',
        options:['1996','1995','1994','none of the above'],
        correct: '1995',
    },
     {
        question: 'Which language runs in a web browser?',
        options:['Java','C','Python','JavaScript'],
        correct: 'JavaScript',
    },
    {
        question: 'What does CSS stand for?',
        options:['Central Style Sheets','Cascading Style Sheets','Cascading Simple Sheets','Cars SUVs Sailboats'],
        correct: 'Cascading Style Sheets',
    },
    {
        question: 'What does HTML stand for?',
        options:['Hypertext Markup Language','Hypertext Markdown Language','Hyperloop Machine Language','Helicopters Terminals Motorboats Lamborginis'],
        correct: 'Hypertext Markup Language',
    },
    {
        question: 'What year was JavaScript launched?',
        options:['1996','1995','1994','none of the above'],
        correct: '1995',
    }
]

const quizContainer = document.getElementById('quiz');
const submitBtn = document.getElementById('submit');
const result = document.getElementById('result');
const timer = document.getElementById('timeLeft'); 
const reset = document.getElementById('reset');
const rank = document.getElementById('rank');
const scoreEl = document.getElementById('score');
let endTime=0;
let timerInterval;
let index=0;
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let answers = Array(quizData.length).fill(null);
const progress = document.getElementById('progress');
let submitted = false;
let checkedQuestions = [];
let completed = [];
const progressValue = document.getElementById('progress-value');
const timeContainer = document.getElementById('timeTaken');

function loadQuiz(){
    reset.style.display = 'none';
    quizContainer.innerHTML = "";
    let question=quizData[index]

    const questionEl = `
    <div style:"padding-left: 20px">
        <p style="font-weight: bold;">${index+1}. ${question.question}</p>
        ${question.options.map(options=>
            `<label " >
                <input  type="radio" name="question${index}" value="${options}">
                ${options}
            </label><br>`
        ).join('')}
    </div><br>`
    
    quizContainer.innerHTML = questionEl

    if(answers[index]){
        const prevSelection = document.querySelector(`input[value="${answers[index]}"]`)
        if(prevSelection){
            prevSelection.checked=true;
        }
    }

    disableOptions();
    

}


function saveAnswers(){
        const selected = document.querySelector(`input[name="question${index}"]:checked`)
        if(selected){
            answers[index]=selected.value;
        }

}

function getScore(){
    saveAnswers();
    let score =0;
    quizData.forEach((question,i)=>{
        if(answers[i]===question.correct){
            score++;     
        }
         else if (answers[i]!=null && answers[i]!==question.correct){
            score-=0.25;
        }
    })
    result.textContent = `Your Score: ${score}/${quizData.length}`
    clearInterval(timerInterval);
    submitted = true;

    if(submitted){
        document.querySelectorAll('input[type=radio]').forEach(radio=>{
        radio.disabled=true;
        if(answers[index]===quizData[index].correct){
            radio.style.color='green';
        }else{
            radio.style.color='red';
        }
        reset.style.display = 'block'
    })
    }
    const timeTaken = (quizData.length*30-endTime);
    
    const yourScore = JSON.parse(localStorage.getItem('scores')) || [];
    yourScore.push([score,timeTaken]);
    localStorage.setItem('scores',JSON.stringify(yourScore));
    saveScore();
   
}

function timeLeft(){
    let timeLeft =  quizData.length*30;
    let timeContainer = document.getElementById('timeLeft');
    
  timerInterval = setInterval(()=>{
        let minutes = Math.floor(timeLeft/60);
        let seconds = timeLeft%60;
        timeContainer.textContent = `${minutes<10?'0':''}${minutes}:${seconds<10?'0':''}${seconds}`;
        timeLeft--;
        endTime = timeLeft;
    if(timeLeft<0){
        clearInterval(timerInterval);
        endTime = timeLeft;
        getScore();
    }

    if(timeLeft<30){
        timeContainer.style.color = 'red';
    }

    },1000)
    


}

loadQuiz();
saveScore();
questionNumbers();
let startTimer=false;
document.querySelectorAll('input[type=radio]').forEach(radio=>{
    radio.addEventListener('click',()=>{
        if(!startTimer){
            startTimer=true;
            timeLeft();
        }
    })
})


//save score to local storage
function saveScore(score){
    rank.innerHTML  = '';
    scoreEl.innerHTML = '';
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    if(score !== undefined){
        scores.push(score);
        localStorage.setItem('scores',JSON.stringify(scores));
    }
    scores.sort((a,b)=>{
        if(b[0]===a[0]){
            return a[1]-b[1];
        }
        return b[0]-a[0];
    });
    scores.forEach((sc,index)=>{if(index<10){
        const minutes = Math.floor(sc[1]/60);
        const seconds = sc[1]%60;
        
        const rankEl = `<div style="margin-top: 10px;">${index+1}</div> `
        const ScoreEl = `<div style="margin-top: 10px;">${sc[0]}</div>`
        const timeEl = `<div style="margin-top: 10px;">${minutes}:${seconds<10?'0':''}${seconds}</div>`
        rank.innerHTML += rankEl;
        scoreEl.innerHTML += ScoreEl;
        timeContainer.innerHTML += timeEl;
       }
   })
}

//submit button
submitBtn.addEventListener('click', getScore)

//reset button
reset.addEventListener('click',()=>{
    location.reload();
})

//previous button
prev.addEventListener('click',()=>{
    saveAnswers();
    if(index>0){
        index--;
        loadQuiz();
    }
    disableOptions();
})


//next button
next.addEventListener('click',()=>{
    saveAnswers();
    if(index<quizData.length-1){
        index++;
        loadQuiz();
    }
    disableOptions();

})



//Change progress bar when question is attempted
document.addEventListener('change',(e)=>{
    if(e.target.matches('input[type=radio]')){
        const currentQ=`num${index+1}`
        if(!completed.includes(currentQ)){
            completed.push(`num${index+1}`)
            progress.style.width = (completed.length)*100/quizData.length+'%';
            progressValue.textContent = `${(completed.length)*100/quizData.length}%`;
        }
        
    }
})

// question number indexs
function questionNumbers() {
    const numberOfQuestions = quizData.length;
    const questionNumberEl = document.getElementById('question-number');
        for(let i =0;i<numberOfQuestions;i++){
            const button = document.createElement('button');
            button.className='question-number';
            button.id = `num${i+1}`;
            button.innerText=i+1;
            button.style.backgroundColor='#B0B0B0';
            button.style.color='#000000'

            button.addEventListener('click',()=>{
            saveAnswers();
            index=i;
            loadQuiz();
        })
            questionNumberEl.appendChild(button)
        }
        

    }


//change color of question number when attempted
document.addEventListener('change',(e)=>{
    if(e.target.matches('input[type=radio]')){
        const currentQ = document.getElementById(`num${index+1}`);
        currentQ.style.backgroundColor='#28A745';
        currentQ.style.color='#ffffff';
    }
})

const review = document.querySelector('.review');
review.addEventListener('click',()=>{
        const button = document.getElementById(`num${index+1}`);
        const checked = document.querySelectorAll('input[type=radio]:checked');
        if(checked.length>0){
            button.style.backgroundColor =' #6F42C1';
            button.style.color = 'white';
        }else{
            button.style.backgroundColor = '#FFC107';
            button.style.color = 'black';
        }
        
});


//disable options after submit
function disableOptions(){
        if(submitted){
        document.querySelectorAll('input[type=radio]').forEach(radio=>{
        radio.disabled=true;
        reset.style.display = 'block';
    })
    }
}