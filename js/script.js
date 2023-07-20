/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

// Constants for API endpoint and number of quiz questions
const API_ENDPOINT = 'https://opentdb.com/api.php';
const NUM_QUESTIONS = 5;

const apiEndpoint = `${API_ENDPOINT}?amount=${NUM_QUESTIONS}`;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('nextBtn');

let quizData = [];
let currentQuestion = 0;
let score = 0;

// Call the main entry point to start the quiz
startQuiz();

// The async keyword declares that the function returns a promise.
// An async function enables the use of the await keyword inside it,
// allowing you to write asynchronous code in a more synchronous-looking way.
async function fetchQuizQuestions() {
  try {
    // The fetch() function is a built-in browser function used to make HTTP requests
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz questions. Please try again later.');
    }
    // The response from the API is received in a format known as a Response object.
    // To extract the JSON data from the response, we use the json() method, which also returns a promise.
    // The await keyword makes sure that the function waits for this promise to resolve and returns the JSON data.
    return await response.json();
  } catch (error) {
    handleAPIError(error);
    return null;
  }
}

function handleAPIError(error) {
  console.error('Error fetching quiz questions:', error);
}

function checkAnswer(event) {
  const selectedOption = event.target.textContent;
  const currentQuizData = quizData.results[currentQuestion];

  if (selectedOption === currentQuizData.correct_answer) {
    score++;
  }

  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.results.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  questionElement.textContent = `You have completed the quiz! Your score is: ${score} out of ${quizData.results.length}.`;
  optionsElement.innerHTML = '';
  nextButton.style.display = 'none';
}

function decodeHTMLEntities(text) {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent;
}

function loadQuestion() {
  const currentQuizData = quizData.results[currentQuestion];
  const decodedQuestion = decodeHTMLEntities(currentQuizData.question);

  questionElement.textContent = decodedQuestion;
  optionsElement.innerHTML = '';

  currentQuizData.incorrect_answers.push(currentQuizData.correct_answer);
  currentQuizData.incorrect_answers.sort();

  console.log(currentQuizData.correct_answer);
  currentQuizData.incorrect_answers.forEach((option) => {
    const optionElement = document.createElement('button');
    optionElement.textContent = decodeHTMLEntities(option);
    optionElement.addEventListener('click', checkAnswer);
    optionsElement.appendChild(optionElement);
  });
}

function attachEventListeners() {
  const nextButton = document.getElementById('nextBtn');
  nextButton.addEventListener('click', () => {
    // Call the nextQuestion function when the Next Question button is clicked
    nextQuestion();
  });

  // Add other event listeners here as needed..
}

// Main entry point to initiate the quiz
async function startQuiz() {
  // Call this function to initiate fetching quiz questions from the API
  quizData = await fetchQuizQuestions();
  if (!quizData) {
    // Handle error here (e.g., show an error message to the user)
    return;
  }

  // Attach event listeners after loading quiz data
  attachEventListeners();

  // Load the very first quiz question
  loadQuestion();
}
