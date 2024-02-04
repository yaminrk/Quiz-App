// An array of question objects. Each object represents a question, its options, the correct answer, and an explanation.

let questions = [
  {
    type: "multipleChoice",
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
    explanation: "Paris is the capital city of France."
  },
  {
    type: "trueOrFalse",
    question: "The earth is flat.",
    answer: "false",
    explanation: "The Earth is not flat. It is an oblate spheroid, meaning it is mostly spherical but slightly flattened at the poles and slightly wider at the equator."
  },
  {
    type: "matching",
    question: "Match the country with its capital.",
    options: ["France", "Germany", "Spain"],
    matches: ["Paris", "Berlin", "Madrid"],
    answer: ["Paris", "Berlin", "Madrid"],
    explanation: "The capital of France is Paris, the capital of Germany is Berlin, and the capital of Spain is Madrid."
  },
  {
    type: "textInput",
    question: "What is the chemical symbol for water?",
    answer: "H2O",
    explanation: "The chemical symbol for water is H2O, which means it is composed of two hydrogen atoms and one oxygen atom."
  }
];

// Variables to keep track of the current question, the user's answers, and the start and end times of the quiz.
  
  let currentQuestionIndex = 0;
  let answers = [];
  let startTime, endTime;
  let timerInterval;
  
  // A reference to the HTML element that will contain the quiz content.
  let contentContainer = document.getElementById("content-container");

  // This function displays the start screen of the quiz.
function displayStartScreen() {
    contentContainer.innerHTML = ""; 

    let title = document.createElement("h1");
    title.textContent = "Welcome to the Quiz!";
    contentContainer.appendChild(title);


  // Button for starting the Quiz
    let startButton = document.createElement("button");
    startButton.textContent = "Start Quiz";
    startButton.onclick = startQuiz;
    contentContainer.appendChild(startButton);

    // Hide the timer container
    let timerContainer = document.getElementById("timer-container");
    timerContainer.style.display = "none";
}

// This function starts the quiz. It records the start time and sets up a timer to update every second.
function startQuiz() {
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000); 

  // Delay the display of the question by 1 second
  setTimeout(function() {
      displayQuestion(questions[currentQuestionIndex]);

      let timerContainer = document.getElementById("timer-container");
  timerContainer.style.display = "block";
  }, 1000);


}


  // This function updates the timer by calculating the difference between the current time and the start time.
  function updateTimer() {
    let currentTime = new Date();
    let timeDiff = currentTime - startTime; 
    timeDiff /= 1000;
  
    let minutes = Math.floor(timeDiff / 60);
    let seconds = Math.floor(timeDiff % 60);
  
    displayTimer(minutes, seconds);
  }
  
  // This function displays the elapsed time in the format "Time elapsed: Xm Ys".
  function displayTimer(minutes, seconds) {
    let timerDiv = document.getElementById("timer-container");
    timerDiv.textContent = "Time elapsed: " + minutes + "m " + seconds + "s";
  }
  
  // This function displays the current question.
  function displayQuestion(question) {
     // Get the content container and clear its current content
    let contentContainer = document.getElementById("content-container");
    contentContainer.innerHTML = ""; 

      // Create a paragraph element for the question text and add it to the container
    let questionText = document.createElement("p");
    questionText.textContent = question.question;
    contentContainer.appendChild(questionText);
  
    // If the question type is multiple choice, create radio buttons for each option
    if (question.type === "multipleChoice") {
      for (let i = 0; i < question.options.length; i++) {
        // Get the current option and its number
          let option = question.options[i];
          let optionNumber = i + 1;
  
          // Create a radio button for this option
          let radioBtn = document.createElement("input");
          radioBtn.type = "radio";
          radioBtn.name = "answer";
          radioBtn.value = option;

          radioBtn.onchange = () => {
              let labels = document.querySelectorAll('label');
              labels.forEach((label) => {
                  label.classList.remove('selected');
              });
  
              label.classList.add('selected');
  
              saveAnswer(option);
          };
  
          // Create a label for this radio button and add the radio button to it
          let label = document.createElement("label");
          label.textContent = optionNumber + ". " + option;
  
          // Append the radio button to the label
          label.appendChild(radioBtn);
  
          // If this option was previously selected, check this radio button and highlight it
          if (answers[currentQuestionIndex] === option) {
              radioBtn.checked = true;
              label.classList.add('selected');
          }
  
          // Append the label (which now contains the radio button) to the container
          contentContainer.appendChild(label);
          contentContainer.appendChild(document.createElement("br")); 
      }
  }
  
  // If the question type is true or false, create two buttons for True and False
   else if (question.type === "trueOrFalse") {
     // Create a button for True and set its click event
        let trueBtn = document.createElement("button");
        trueBtn.textContent = "True";

         // When clicked, change the background color of this button, reset the other button's color, and save the answer
        trueBtn.onclick = function() {
            this.style.backgroundColor = "#2b2b2b";
            falseBtn.style.backgroundColor = "#555";
            saveAnswer("true");
        };
    
         // Create a button for False and set its click event
        let falseBtn = document.createElement("button");
        falseBtn.style.display = "block";
        falseBtn.textContent = "False";
        falseBtn.onclick = function() {
          // When clicked, change the background color of this button, reset the other button's color, and save the answer
            this.style.backgroundColor = "#2b2b2b";
            trueBtn.style.backgroundColor = "#555";
            saveAnswer("false");
        };

        // If True was previously selected, set the background color of the True button
    // If False was previously selected, set the background color of the False button
        if (answers[currentQuestionIndex] === "true") {
          trueBtn.style.backgroundColor = "#2b2b2b";
      } else if (answers[currentQuestionIndex] === "false") {
          falseBtn.style.backgroundColor = "#2b2b2b";
      }

       // Add the True and False buttons to the content container
      contentContainer.appendChild(trueBtn);
      contentContainer.appendChild(document.createElement("br")); 
      contentContainer.appendChild(falseBtn);
    }

    // If the question type is matching, create a list for options and matches
     else if (question.type === "matching") {

      // Create an unordered list for options
      let optionsList = document.createElement("ul");
      optionsList.id = "options";
  
       // For each option, create a list item, make it draggable, and add it to the options list
      for (let option of question.options) {
          let listItem = document.createElement("li");
          listItem.textContent = option;
          listItem.draggable = true;
          listItem.ondragstart = function(event) {
              event.dataTransfer.setData("text", event.target.textContent);
          };
          optionsList.appendChild(listItem);
      }

       // These functions handle the drag and drop events
      function dragStart(event) {
        event.dataTransfer.setData("text", event.target.textContent);
      }
      
      function dragOver(event) {
        event.preventDefault();
      }

      function drop(event) {
        event.preventDefault();
        let data = event.dataTransfer.getData("text");
        event.target.textContent = data;
      }
  
      // Create an unordered list for matches
      let matchesList = document.createElement("ul");
      matchesList.id = "matches";

      // For each match, create a list item, make it accept drops, and add it to the matches list
      for (let match of question.matches) {
          let listItem = document.createElement("li");
          listItem.textContent = match;
          listItem.ondragover = function(event) {
              event.preventDefault();
          };
          listItem.ondrop = function(event) {
              event.preventDefault();
              let data = event.dataTransfer.getData("text");
              event.target.textContent = data;
  
              let userAnswer = Array.from(matchesList.children).map(child => child.textContent);
              saveAnswer(userAnswer);
          };
          matchesList.appendChild(listItem);
      }
  
        // If there is a saved answer for this question, display it
      if (answers[currentQuestionIndex]) {
          let userAnswer = answers[currentQuestionIndex];
          for (let i = 0; i < userAnswer.length; i++) {
              matchesList.children[i].textContent = userAnswer[i];
          }
      }
  
       // Add the options list and matches list to the content container
      contentContainer.appendChild(optionsList);
      contentContainer.appendChild(matchesList);
    }

    // If the question type is text input, create a text input field
  else if (question.type === "textInput") {
        let input = document.createElement("input");
        input.style.display = "block";
        input.type = "text";
        input.id = "text-answer";
        input.onchange = () => saveAnswer(input.value);

        if (answers[currentQuestionIndex]) {
          input.value = answers[currentQuestionIndex];
      }
    
      contentContainer.appendChild(input);
      }
    
  
      // Create a Next button and add it to the content container
      let nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.style.backgroundColor = " #555"; 
      nextButton.style.marginRight = "10px"; 
      nextButton.onclick = nextQuestion;
      contentContainer.appendChild(nextButton);
      
      // If this is not the first question, create a Previous button and add it to the content container 
      if (currentQuestionIndex > 0) {
          let prevButton = document.createElement("button");
          prevButton.textContent = "Previous";
          prevButton.style.backgroundColor = "#555"; 
          prevButton.onclick = prevQuestion;
          contentContainer.appendChild(prevButton);
      }
      
  }
  
  // This function saves the user's answer for the current question.
  function saveAnswer(answer) {
    let question = questions[currentQuestionIndex];
    if (question.type === "multipleChoice") {
      let selectedOption = document.querySelector('input[name="answer"]:checked');
      answer = selectedOption ? selectedOption.value : "";
    } else if (question.type === "textInput") {
      answer = document.getElementById("text-answer").value;
    }
  
    answers[currentQuestionIndex] = answer;
  }
  
  // This function displays the next question or the results if there are no more questions.
  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion(questions[currentQuestionIndex]);
    } else {
      displayResults();
    }
  }
  
  // This function displays the previous question.
  function prevQuestion() {
    currentQuestionIndex--;
    displayQuestion(questions[currentQuestionIndex]);
  }
  
  // This function displays the results of the quiz.
  function displayResults() {
    // Stop the timer
    clearInterval(timerInterval); 
  
     // Calculate the time difference
    endTime = new Date();
    let timeDiff = endTime - startTime; 
    timeDiff /= 1000; 

    let timerContainer = document.getElementById("timer-container");
    timerContainer.style.display = "none";
  
    let contentContainer = document.getElementById("content-container");
    contentContainer.innerHTML = "";
  
    let title = document.createElement("h1");
    title.textContent = "Quiz Results";
    contentContainer.appendChild(title);
  
    // Calculate the score and display the results for each question
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let answer = answers[i];
  
      let questionDiv = document.createElement("div");
      questionDiv.id = "result-" + i;
  
      let questionText = document.createElement("p");
      questionText.textContent = question.question;
      questionDiv.appendChild(questionText);
  
      let userAnswerText = document.createElement("p");
      userAnswerText.textContent = "Your answer: " + (answer || "No answer");
      questionDiv.appendChild(userAnswerText);
  
      let correctAnswerText = document.createElement("p");
      correctAnswerText.textContent = "Correct answer: " + question.answer;
      questionDiv.appendChild(correctAnswerText);
  
      let explanationText = document.createElement("p");
      explanationText.textContent = "Explanation: " + question.explanation;
      questionDiv.appendChild(explanationText);
  
      if (answer) {
        if (question.type === "matching") {
          if (JSON.stringify(answer) === JSON.stringify(question.answer)) {
            score++;
            questionDiv.style.color = "green";
          } else {
            questionDiv.style.color = "red";
          }
        } else {
          if (answer.toLowerCase() === question.answer.toLowerCase()) {
            score++;
            questionDiv.style.color = "green";
          } else {
            questionDiv.style.color = "red";
          }
        }
      } else {
        questionDiv.style.color = "red";
      }
  
      contentContainer.appendChild(questionDiv);
    }

    // Display the score
    //...
    let scoreText = document.createElement("p");
    scoreText.textContent = "You got " + score + " out of " + questions.length + " questions correct.";
    contentContainer.appendChild(scoreText);
  }
  
  // Display the start screen
  displayStartScreen();
