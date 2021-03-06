//4 parameters-> Correctness, Time of entire test, (Keep answer marked) Time per question, Number of changes of option
var questions=new Array(15); // Array of Random Question numbers
// 50 question db- 35,40,2,1,10...15values 
var answers=new Array(15);  //Array of Whether Answers marked are correct(1) or not(0) Actual answer{a,b,a,...} Marked ans{b,c,a...} {0,0,1...}
var elapsedtime = new Array(15);    //Array to store time taken in each question
var optionchanges=new Array(15);
var visitedarray=new Array(15);
var markedans=new Array(15);
var index=0;
var Default_val=0;
optionchanges.fill(Default_val);
elapsedtime.fill(Default_val);
markedans.fill(Default_val);
var Default=-1;
visitedarray.fill(Default_val);
answers.fill(Default);
var timeTaken=30;
var timerFun;
var row=undefined;
var testId=undefined;
window.onload= function(){
    timer();
    this.renderQuestion(1)
};
var startTime=undefined;
var finishTime=undefined;
var radios=undefined;
var totalTimeTaken=undefined;
var showProfile= undefined;


// Function which ensures correct question is selected
//row refers to the data sent by flask, in our case it is the entire question table
// function initialise(x,x1,x2,x3,x4){
function initialise(x,x1,x2,x3){
    row=x;
    // console.log(x3)
    // console.log(typeof(x3))
    questions=x1;
    testId= x2;
    showProfile=x3;
    console.log("FROM INITIALISE OF CAPTURE_PARAMETER.JS");
    console.log(showProfile);
    shuffle(questions);
    console.log(questions);
    
    // random_questions(row,15);
  
    // alert(elapsedtime);
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

//Display the question the dynamically and get cookie to mark previously marked answer
function getIndex(row,x){
    for(var i=0;i<row.length;i++){
        if(x == row[i][0]){
            return i+1;
        }
        else
            continue;
    }
}

// 1->15 buttons 1 button->questions={22,24,25....}
function renderQuestion(a) {//a=1->15
    for(var i=0;i<15;i++)
    {
        if(visitedarray[i]==1 && answers[i]== -1){
            //this is the case where visited and answer is not  marked, red color
            var buttoncolor = document.getElementById("primaryButton"+ (i+1));
            buttoncolor.style.backgroundColor = "red";

        }
    }
    visitedarray[a-1]=1;
    ques = document.getElementById("question-data");
    var qn=parseInt(questions[a-1]);     //get the ath random question number x=22
    var x= getIndex(row,qn)
    //var row = {{ value }} ;
    // counter=0;
    // this data is sent in flask using render template, data is sent as comma separated all values
    // however, index 0 refers to values of all cols separated by comma, alert(row[x-1]); 
    // So row[x-1][1], refers to the (x-1)th row and 1st indexed column
    ques.innerHTML = "<h5 class='card-title' id='question-num'>Question No. " + a + "</h5>";
    ques.innerHTML += "<p class='card-text' id='question-content'>" + row[x - 1][1] + "</p>";
    ques.innerHTML += "<input id='option1' type='radio' name='option' value='1'>" + row[x - 1][4] + "<br><br>";
    ques.innerHTML += "<input id='option2' type='radio' name='option' value='2'>" + row[x - 1][5] + "<br><br>";
    ques.innerHTML += "<input id='option3' type='radio' name='option' value='3'>" + row[x - 1][6] + "<br><br>";
    ques.innerHTML += "<input id='option4' type='radio' name='option' value='4'>" + row[x - 1][7] + "<br><br>";
    
    var prev_ans=getCookie("Answer"+a);
    // alert("prev ans "+ prev_ans);
    if(prev_ans){
        document.getElementById('option'+prev_ans).checked=true;
    }

    radios= document.getElementsByName("option");
    for(var i=0;i<radios.length;i++){
        radios[i].addEventListener("change", function(){
            // counter++;
            // alert("Counter is "+counter);
            optionchanges[a-1] ++;
            // alert(optionchanges);
        });
    }
    startTime=Date.now()/1000;
    //document.getElementById("question-num").addEventListener("load", qtimer);
}

//Cookie-> Client side machine(unlike sessions), expires(unlike cache)
// {name=value,name=value, expires=minutes, path=/}
// {Answer1=2 Answer2=2 .......Answer15=1 expires=minutes path=/}
function getCookie(name) {      //name="Answer1"
    var nameEQ = name + "=";    //nameEQ= "Answer1="
    var ca = document.cookie.split(' ');    
    //alert("Cookie is "+ca);
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);        //" Answer1"->"Answer1"
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);    
    }
    return null;
}

function setCookie(name, value, minutes) {      //Answer1, 1, 30
    if (minutes) {
        var date = new Date();      
        date.setTime(date.getTime() + (minutes * 60 * 1000));       //minutes-> milliseconds
        var expires = " expires=" + date.toGMTString(); 
    } else var expires = ""; 
    document.cookie = name + "=" + value + expires + " path=/";
}


//Function which stores answer for each question every time the answer is saved and sets the cookie
function storeAnswer(){
    //var row = {{ value }};
    var qno=document.getElementById('question-num');   
        
    //Question No. 12
    var qnum_cur=parseInt(qno.innerText.substring(13));     //1->15
    var qnum = parseInt(questions[qnum_cur-1]); //Substring "12" converted to 12;     22
    //substring(13) as from 'Question No. 3' we want from 13th char onwards
    //then find the corresponding random question number as, questions[...the whole code to find the corresponding question...]
    //alert("Question No. rn is "+qnum_cur);
    var buttoncolor = document.getElementById("primaryButton"+ qnum_cur);
    buttoncolor.style.backgroundColor = "green";
    //alert(row);
    var ind= getIndex(row,qnum)
    var ans= row[ind-1][8].charCodeAt()-96; //a=1,b=2,c=3,d=4 
    // alert("Answer is "+ans);
    var ele = document.getElementsByName('option');
    var ansValue; 
    for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked){
            ansValue = ele[i].value;
            markedans[qnum_cur-1] =parseInt(ansValue);         
            if(ele[i].value == ans){
            //alert("Correct Answer");
            answers[qnum_cur-1]=1;
            }
            else{
            //alert("Wrong Answer");
            answers[qnum_cur-1]=0;
            }
        }
    }

    finishTime=Date.now()/1000; 
    elapsedtime[qnum_cur-1] += Math.floor(finishTime-startTime); 
    startTime=finishTime;   
    // alert(answers);
    // alert(markedans);
    setCookie("Answer"+qnum_cur,ansValue,30);
var j=qnum_cur+1;
// while(j<16){
//     alert(j);
    document.getElementById('primaryButton'+ j).click();
    // j+=1;
//   }
}


function clearAnswer(){
    var qno=document.getElementById('question-num');        
    var qnum_cur=parseInt(qno.innerText.substring(13));     //1->15
    var ele=document.getElementsByName("option");
    for(var i=0;i<ele.length;i++)
    ele[i].checked = false;
    answers[qnum_cur-1]=-1;
    deleteCookie("Answer"+qnum_cur);
}

function deleteAllCookies(){
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
      deleteCookie(cookies[i].split("=")[0]);
}

function deleteCookie(name){
    setCookie(name,"",-1);
}

function confirmtest(){
    if (confirm("Do you want to finish you test?")== false){
        return false;
    }
    else 
    {   
        alert("Hope you had a great test! Please don't refresh and wait for confirmation");
        return checkAnswers();
    }
}

//Function which checks the total number of correct answers at the end of the test
function checkAnswers(){ 
   
    var count=0;
    var total=0;
    // alert("ans array is "+ answers);
    for(var i=0;i<answers.length;i++){
        if(answers[i] == 1){
            count++;
            total++;
        }
        else if(answers[i] == 0){
            total++;
        }  
    }
    // alert("Congratulations, Test Complete!\nNumber of correct answers are "+count+"\nTotal number of questions "+total);
    clearInterval(timerFun);
    var tim=document.getElementById('test-timer');  //29:21
    var a= (tim.innerText).split(':'); 
    //alert("a is "+ a);
    var seconds=(+a[0])*60*60 + (+a[1])*60 + (+a[2]);
    var diff=(30*60)-seconds;       //30:00 - 29:21 
    var incorrect=total-count;
    // alert(typeof(incorrect))
    var testscore=(3*(count)-(incorrect));
    // alert("testscore is" +testscore);
    totalTimeTaken=toTimeString(diff);
    // alert("Time Taken by you is "+ toTimeString(diff));
    // alert(elapsedtime);
    // alert("Final counter is "+optionchanges);
    deleteAllCookies();
    $.post( '/sendparameters', {
        questions: JSON.stringify(questions), 
        answers: JSON.stringify(answers),
        optionchanges: JSON.stringify(optionchanges),
        elapsedtime: JSON.stringify(elapsedtime),
        totalTimeTaken: totalTimeTaken,
        totalcorrect: count,
        totalincorrect: incorrect,
        testscore: testscore,
        testId: testId,
        markedans:JSON.stringify(markedans)
    },function(res){
        console.log(res)
        // alert("\nStatus: " + res.status);
        
        alert("Test succesfully submitted!");
        location.href= '/tp/'+testId+'?showProfile='+showProfile;
        // location.href= '/tp/'+testId+'?showProfile=False';
        // location.href = '/dashboard/'+testId;
    });
}

function toTimeString(seconds){     //39s-> 00:00:39
    //alert("seconds is "+seconds);
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

function timer(){
    var tim=document.getElementById('test-timer');  //header-> 00:30:00 
    //alert("tim is "+ tim);
    var a= (tim.innerText).split(':');
    //alert("a is "+ a);
    var seconds=(+a[0])*60*60 + (+a[1])*60 + (+a[2]);

    timerFun= setInterval(function(){
    seconds--;
    if(seconds>=0){
        tim.innerHTML=toTimeString(seconds);
    }
    
    if (seconds === 0) {
        alert('Time Over! Test Complete');
        clearInterval(timerFun);
        timeTaken=30;
    }
    },1000);
} 
