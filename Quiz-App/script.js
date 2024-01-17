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
    question: "The earth is flat",
    answer: "false",
    explanation: "The Earth is not flat. It is an oblate spheroid, meaning it is mostly spherical but slightly flattened at the poles and slightly wider at the equator."
  },
  {
    type: "matching",
    question: "Match the country with its capital",
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


  
  let currentQuestionIndex = 0;
  let answers = [];
  let startTime, endTime;
  let timerInterval;
  
  function displayStartScreen() {
    let quizContainer = document.getElementById("question-container");
    quizContainer.innerHTML = ""; 
  
    let title = document.createElement("h1");
    title.textContent = "Welcome to the Quiz!";
    quizContainer.appendChild(title);
  
    let startButton = document.createElement("button");
    startButton.textContent = "Start Quiz";
    startButton.onclick = startQuiz;
    quizContainer.appendChild(startButton);
  }
  
  function startQuiz() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000); 
    displayQuestion(questions[currentQuestionIndex]);
  }
  
  function updateTimer() {
    let currentTime = new Date();
    let timeDiff = currentTime - startTime; 
    timeDiff /= 1000;
  
    let minutes = Math.floor(timeDiff / 60);
    let seconds = Math.floor(timeDiff % 60);
  
    displayTimer(minutes, seconds);
  }
  
  function displayTimer(minutes, seconds) {
    let timerDiv = document.getElementById("timer-container");
    timerDiv.textContent = "Time elapsed: " + minutes + "m " + seconds + "s";
  }
  
  function displayQuestion(question) {
    let quizContainer = document.getElementById("question-container");
    quizContainer.innerHTML = ""; 

    let questionText = document.createElement("p");
    questionText.textContent = question.question;
    quizContainer.appendChild(questionText);
  
    if (question.type === "multipleChoice") {
      for (let option of question.options) {
          let radioBtn = document.createElement("input");
          radioBtn.type = "radio";
          radioBtn.name = "answer";
          radioBtn.value = option;
          radioBtn.onchange = () => saveAnswer(option); 
  
          let label = document.createElement("label");
          label.textContent = option;
  
          if (answers[currentQuestionIndex] === option) {
              radioBtn.checked = true;
          }
  
          quizContainer.appendChild(radioBtn);
          quizContainer.appendChild(label);
          quizContainer.appendChild(document.createElement("br")); 
      }
  }
   else if (question.type === "trueOrFalse") {
        let trueBtn = document.createElement("button");
        trueBtn.textContent = "True";
        trueBtn.onclick = function() {
            this.style.backgroundColor = "#003d7a";
            falseBtn.style.backgroundColor = "#007BFF";
            saveAnswer("true");
        };
    
        let falseBtn = document.createElement("button");
        falseBtn.style.display = "block";
        falseBtn.textContent = "False";
        falseBtn.onclick = function() {
            this.style.backgroundColor = "#003d7a";
            trueBtn.style.backgroundColor = "#007BFF";
            saveAnswer("false");
        };

        if (answers[currentQuestionIndex] === "true") {
          trueBtn.style.backgroundColor = "#003d7a";
      } else if (answers[currentQuestionIndex] === "false") {
          falseBtn.style.backgroundColor = "#003d7a";
      }
    
        quizContainer.appendChild(trueBtn);
        quizContainer.appendChild(document.createElement("br")); 
        quizContainer.appendChild(falseBtn);
    } else if (question.type === "matching") {
      let optionsList = document.createElement("ul");
      optionsList.id = "options";
  
      for (let option of question.options) {
          let listItem = document.createElement("li");
          listItem.textContent = option;
          listItem.draggable = true;
          listItem.ondragstart = function(event) {
              event.dataTransfer.setData("text", event.target.textContent);
          };
          optionsList.appendChild(listItem);
      }

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
  
      let matchesList = document.createElement("ul");
      matchesList.id = "matches";
  
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
  
      if (answers[currentQuestionIndex]) {
          let userAnswer = answers[currentQuestionIndex];
          for (let i = 0; i < userAnswer.length; i++) {
              matchesList.children[i].textContent = userAnswer[i];
          }
      }
  
      quizContainer.appendChild(optionsList);
      quizContainer.appendChild(matchesList);
  }else if (question.type === "textInput") {
        let input = document.createElement("input");
        input.style.display = "block";
        input.type = "text";
        input.id = "text-answer";
        input.onchange = () => saveAnswer(input.value);

        if (answers[currentQuestionIndex]) {
          input.value = answers[currentQuestionIndex];
      }
    
        quizContainer.appendChild(input);
      }
    
  
      let nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.style.backgroundColor = "#28a745"; 
      nextButton.style.marginRight = "10px"; 
      nextButton.onclick = nextQuestion;
      quizContainer.appendChild(nextButton);
      
      if (currentQuestionIndex > 0) {
          let prevButton = document.createElement("button");
          prevButton.textContent = "Previous";
          prevButton.style.backgroundColor = "#ffc107"; 
          prevButton.onclick = prevQuestion;
          quizContainer.appendChild(prevButton);
      }
      
  }
  
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
  
  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion(questions[currentQuestionIndex]);
    } else {
      displayResults();
    }
  }
  
  function prevQuestion() {
    currentQuestionIndex--;
    displayQuestion(questions[currentQuestionIndex]);
  }
  
  function displayResults() {
    clearInterval(timerInterval); 
  
    endTime = new Date();
    let timeDiff = endTime - startTime; 
    timeDiff /= 1000; 
  
    let quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";
  
    let title = document.createElement("h1");
    title.textContent = "Quiz Results";
    quizContainer.appendChild(title);
  
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
  
      quizContainer.appendChild(questionDiv);
    }
  
    let scoreText = document.createElement("p");
    scoreText.textContent = "You got " + score + " out of " + questions.length + " questions correct.";
    quizContainer.appendChild(scoreText);
  }
  
  displayStartScreen();
