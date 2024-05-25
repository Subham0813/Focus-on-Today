const goals = document.querySelectorAll('.goal-container');
const inputFields = document.querySelectorAll('input');
const error = document.querySelector('.error')
const progress = document.querySelector('.progress');
const info = document.querySelector('.progress p');
const quote = document.querySelector('.quote');
const quoteText = quote.innerText;
const message = document.querySelector('.message')
const messages = [
  'Raise the bar by completing your goals!',
  'Well begun is half done!',
  "Keep going, you're doing well!",
  'Just a step away, keep going!',
  'Whoa! You just completed all the goals, time for chill 😃'
]


// const allGoals = JSON.parse(localStorage.getItem('allGoals')) || {
//   first : {
//     inputValue : '',
//     isCompleted : false
//   },
//   second : {
//     inputValue : '',
//     isCompleted : false
//   },
//   third : {
//     inputValue : '',
//     isCompleted : false
//   }
// };

const allGoals = JSON.parse(localStorage.getItem('allGoals')) || {};

let completedCount = Object.values(allGoals).filter((goal) => goal.isCompleted).length
showProgress(completedCount, inputFields.length);


goals.forEach((goal) => {
  const checkbox = goal.querySelector('.checkbox');



  checkbox.addEventListener('click', (e) => {
    e.preventDefault();
    
    const allinputsCheck = [...inputFields].every((inputField) => {
      return inputField.value;
    })

    const input = checkbox.nextElementSibling;

    if(allinputsCheck && allGoals[input.id]) {
      goal.classList.toggle('goal-completed');
      allGoals[input.id].isCompleted = !allGoals[input.id].isCompleted;
      localStorage.setItem('allGoals', JSON.stringify(allGoals));
    } 
    else error.classList.add('show-error');
    
    completedCount = Object.values(allGoals).filter((goal) => goal.isCompleted).length
    showProgress(completedCount, inputFields.length);

  })
  
});

inputFields.forEach((input) => {

  if(allGoals[input.id]) {
    input.value = allGoals[input.id].inputValue;

    if(allGoals[input.id].isCompleted){
      input.parentElement.classList.add('goal-completed');
    }
  }

  input.addEventListener('focus' , (e) =>{
    error.classList.remove('show-error');
  });

  input.addEventListener('input', (e) => {
    if(allGoals[input.id]) {
      if(allGoals[input.id].isCompleted) {
        input.value = allGoals[input.id].inputValue
        return;
      }
      console.log(allGoals[input.id].inputValue)
      allGoals[input.id].inputValue = input.value;
    }else{
      allGoals[input.id] = {
        inputValue : input.value,
        isCompleted : false
      }
    }
    localStorage.setItem('allGoals', JSON.stringify(allGoals))
  });

})



function showProgress (completedCount, inputCount) {
  
  if(completedCount<=2)
  message.innerText = messages[completedCount];
  else if(inputCount-1 === completedCount) message.innerText = messages[messages.length-2]
  else if(inputCount === completedCount) message.innerText = messages[messages.length-1]
  else message.innerText = messages[2];

  progress.style.width = `${(completedCount / inputCount) * 100}%`;
  
  if(completedCount>0) {
    info.innerText = `${completedCount} / ${inputCount} completed`;
    if(completedCount>1) quote.innerText = `"Keep Going, You're making great progress!"`;
    if(completedCount>2) quote.innerText = `"Well done! stay focused, stay consistent"`;
  }
  else {
    quote.innerText = quoteText;
    info.innerText = '';
  }
  
}


// function checkEachInput(goals){
//   let check = true;
//   goals.forEach((goal) => {
//     if(goal.querySelector('input').value == '') {
//       check = false;
//     }
//   });
  // return check;   
// }; //replaced by arrays.every( cllbk fn);