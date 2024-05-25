let goals = [...document.querySelectorAll(".goal-container")];
let inputFields = [...document.querySelectorAll("input")];
const error = document.querySelector(".error");
const progress = document.querySelector(".progress");
const info = document.querySelector(".progress p");
const quote = document.querySelector(".quote");
const quoteText = quote.innerText;
const message = document.querySelector(".message");
const messages = [
  "Raise the bar by completing your goals!",
  "Well begun is half done!",
  "Keep going, you're doing well!",
  "Just a step away, keep going!",
  "Whoa! You just completed all the goals, time for chill 😃",
];
const addButton = document.querySelector(".addgoal");

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
let refNode = goals[goals.length - 1];

let allGoals = JSON.parse(localStorage.getItem("allGoals")) || {};

for (let [key, value] of Object.entries(allGoals)) {
  const num = parseInt(key.split("-")[1]);

  if (num > 3) {
    const newNode = refNode.cloneNode(refNode);
    newNode.id = "goal-" + num;

    refNode.after(newNode);
    goals.push(newNode);

    const input = newNode.querySelector("input");
    input.id = "input-" + num;
    input.value = allGoals[input.id].InputValue;

    inputFields.push(input);

    newNode.querySelector(".addgoal").classList.add(`showbutton`);
    newNode.querySelector(".addgoal").firstElementChild.src = "./svgs/dash.svg";
    newNode.querySelector(".addgoal").classList.add(`transform`);
    newNode.querySelector(".addgoal").title = "Delete goal-card";

    refNode = newNode;
  }
}

let completedCount = Object.values(allGoals).filter(
  (goal) => goal.isCompleted
).length;

showProgress(completedCount, inputFields.length);

let clicked = inputFields.length;

if (
  Object.values(allGoals).filter((goal) => goal.inputValue).length ===
    inputFields.length &&
  clicked < 5
)
  addButton.classList.add("showbutton");

inputFields.forEach((input) => {
  if (allGoals[input.id]) {
    input.value = allGoals[input.id].inputValue;

    if (allGoals[input.id].isCompleted) {
      input.parentElement.classList.add("goal-completed");
    }
  }
});

document.body.addEventListener("click", (e) => {
  e.preventDefault();

  const target = e.target;

  const goal = goals.filter((goal) => {
    if (
      target === goal.firstElementChild ||
      target === goal.firstElementChild.firstElementChild
    ) {
      return goal;
    }
  });

  const newGoal = goals.filter((goal) => {
    const id = parseInt(goal.id.split("-")[1]);

    if (
      id >= 4 &&
      (target === goal.lastElementChild ||
        target === goal.lastElementChild.firstElementChild)
    ) {
      console.log(id);
      return goal;
    }
  });

  const input = inputFields.filter((input) => {
    if (target === input) {
      return input;
    }
  });

  if (
    goal.length > 0 &&
    (target === goal[0].firstElementChild ||
      target === goal[0].firstElementChild.firstElementChild)
  )
    checkboxEventOnClick(goal[0]);

  if (input.length > 0 && target === input[0]) {
    inputEventOnFocus(input[0]);
    inputEventOnInput(input[0], clicked);
  }

  //remove container on click

  if (newGoal.length > 0) {
    const id = parseInt(newGoal[0].id.split("-")[1]);

    if (
      id >= 4 &&
      (target === newGoal[0].lastElementChild ||
        target === newGoal[0].lastElementChild.firstElementChild)
    ) {
      const element = newGoal[0];
      const elementInput = element.querySelector("input");

      for (let goal of goals) {
        if (goal.id === "goal-" + id) {
          let index = goals.indexOf(goal);
          goals.splice(index, 1);
          break; // Stop after removing the first matched element
        }
      }

      for (let input of inputFields) {
        if (input.id === "input-" + id) {
          let index = inputFields.indexOf(input);
          inputFields.splice(index, 1);
          break; // Stop after removing the first matched element
        }
      }

      showProgress(
        Object.values(allGoals).filter((goal) => goal.isCompleted).length,
        inputFields.length
      );

      refNode = goals[goals.length - 1];

      // Check if allGoals exists
      if (allGoals) {
        
        const newGoals = {};
        const keys = Object.keys(allGoals);
        const lastKey = keys[keys.length - 1];
        // const startIndex = parseInt(elementInput.id.split("-")[1]);
        let startIndex = id;

        for (let i = startIndex; i < keys.length; i++) {
          newGoals["input-" + i] = allGoals[keys[i]];
        }

        startIndex = id;
        for (let goal of goals) {
          if (goal.id === "goal-" + (startIndex + 1)) {
            goal.id = "goal-" + startIndex;
            startIndex++;
          }
        }

        startIndex = id;
        for (let input of inputFields) {
          if (input.id === "input-" + (startIndex + 1)) {
            input.id = "input-" + startIndex;
            startIndex++;
          }
        }

        // console.log(inputFields);
        // console.log(goals);
        clicked = inputFields.length;

        // Delete keys and values from input-n onwards from the original object
        for (let key in newGoals) {
          delete allGoals[key];
        }

        delete allGoals[lastKey];

        const combined = { ...allGoals, ...newGoals };

        // Store to localStorage
        localStorage.setItem("allGoals", JSON.stringify(combined));

        allGoals = JSON.parse(localStorage.getItem("allGoals"));

        completedCount = Object.values(combined).filter(
          (goal) => goal.isCompleted
        ).length;
        showProgress(completedCount, inputFields.length);

        if ((Object.values(allGoals)).every(goal => goal.inputValue))
          addButton.classList.add("showbutton");
      }

      element.remove();
    }
  }

  //creating new container target is add-button

  clicked = inputFields.length;
  if (
    (target === addButton || target === addButton.firstElementChild) &&
    clicked <= 5
  ) {
    const newNode = refNode.cloneNode(refNode);
    newNode.id = "goal-" + (clicked + 1);
    newNode.classList.remove("goal-completed");

    const newNodeinput = newNode.querySelector("input");
    newNodeinput.id = "input-" + (clicked + 1);
    newNodeinput.value = "";

    const deletegoal = newNode.querySelector(".addgoal");
    deletegoal.classList.add("transform");
    deletegoal.title = "Delete goal-card";
    deletegoal.firstElementChild.src = "./svgs/dash.svg";

    refNode.after(newNode);

    goals = [...document.querySelectorAll(".goal-container")];
    inputFields = [...document.querySelectorAll("input")];

    allGoals[newNodeinput.id] = {
      inputValue: newNodeinput.value,
      isCompleted: false,
    };

    localStorage.setItem("allGoals", JSON.stringify(allGoals));

    refNode = newNode;

    clicked = inputFields.length;

    //removing plus icon
    addButton.classList.remove("showbutton");
    completedCount = Object.values(allGoals).filter(
      (goal) => goal.isCompleted
    ).length;
    showProgress(completedCount, inputFields.length);
  }
});

function checkboxEventOnClick(goal) {
  const checkbox = goal.querySelector(".checkbox");

  const allinputsCheck = [...inputFields].every((inputField) => {
    return inputField.value;
  });

  const input = checkbox.nextElementSibling;

  if (allinputsCheck && allGoals[input.id]) {
    goal.classList.toggle("goal-completed");
    allGoals[input.id].isCompleted = !allGoals[input.id].isCompleted;
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  } else error.classList.add("show-error");

  completedCount = Object.values(allGoals).filter(
    (goal) => goal.isCompleted
  ).length;

  showProgress(completedCount, inputFields.length);
}

function inputEventOnFocus(input) {
  error.classList.remove("show-error");
}

function inputEventOnInput(input, clicked) {
  input.addEventListener("input", (e) => {
    if (allGoals[input.id]) {
      if (allGoals[input.id].isCompleted) {
        input.value = allGoals[input.id].inputValue;
        return;
      }

      allGoals[input.id].inputValue = input.value;
    } else {
      allGoals[input.id] = {
        inputValue: input.value,
        isCompleted: false,
      };
    }
    localStorage.setItem("allGoals", JSON.stringify(allGoals));

    if (
      Object.values(allGoals).filter((goal) => goal.inputValue).length ===
        inputFields.length &&
      clicked < 5
    )
      addButton.classList.add("showbutton");
    else addButton.classList.remove("showbutton");
  });
}

function showProgress(completedCount, inputCount) {
  if (completedCount <= 2) message.innerText = messages[completedCount];
  else if (inputCount - 1 === completedCount)
    message.innerText = messages[messages.length - 2];
  else if (inputCount === completedCount)
    message.innerText = messages[messages.length - 1];
  else message.innerText = messages[2];

  progress.style.width = `${(completedCount / inputCount) * 100}%`;

  if (completedCount > 0) {
    info.innerText = `${completedCount}/${inputCount} completed`;
    if (completedCount > 1)
      quote.innerText = `"Keep Going, You're making great progress!"`;
    if (completedCount > 2)
      quote.innerText = `"Well done! stay focused, stay consistent"`;
  } else {
    quote.innerText = quoteText;
    info.innerText = "";
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
