document.addEventListener('DOMContentLoaded', () => {
    const startButtons = document.querySelectorAll('.startQuiz');
    const quizDiv = document.getElementById('quiz');
    const quizTitle = document.getElementById('quizTitle');
    const wordDisplay = document.getElementById('wordDisplay');
    const userGuessInput = document.getElementById('userGuess');
    const submitGuessButton = document.getElementById('submitGuess');
    const nextWordButton = document.getElementById('nextWord');
    const startOverButton = document.getElementById('startOver');

    let wordList = [];
    let currentWord = {};
    let guessedWords = [];

    startButtons.forEach(button => {
        button.addEventListener('click', () => {
            const wordlistFile = button.getAttribute('data-wordlist');
            loadWordList(wordlistFile);
        });
    });

    function loadWordList(file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                wordList = data.trim().split('\n').map(line => {
                    const [fourLetterWord, fiveLetterWords] = line.split(';');
                    return {
                        fourLetterWord,
                        fiveLetterWords: fiveLetterWords.trim().split(',').map(word => word.trim())
                    };
                });
                document.getElementById('startButtons').style.display = 'none';
                document.getElementById('gameInfo').style.display = 'none';
                quizDiv.style.display = 'block';
                startOverButton.style.display = 'block';
                loadNextWord();
            })
            .catch(error => {
                console.error('Error loading word list:', error);
                alert('Failed to load the word list. Please try again.');
            });
    }

    startOverButton.addEventListener('click', () => {
        quizDiv.style.display = 'none';
        document.getElementById('startButtons').style.display = 'block';
        document.getElementById('gameInfo').style.display = 'block';
        quizTitle.textContent = 'Choose a word length';
        wordDisplay.innerHTML = '';
        guessedWords = [];
        startOverButton.style.display = 'none';
    });

    submitGuessButton.addEventListener('click', () => {
        const guess = userGuessInput.value.trim().toLowerCase();
        if (currentWord.fiveLetterWords.includes(guess)) {
            if (!guessedWords.includes(guess)) {
                guessedWords.push(guess);
                updateGuessedWordsDisplay();
            }
        }
        userGuessInput.value = '';
    });

    nextWordButton.addEventListener('click', loadNextWord);

    function loadNextWord() {
        if (wordList.length === 0) {
            return;
        }
        shuffleArray(wordList);
        const randomIndex = Math.floor(Math.random() * wordList.length);
        currentWord = wordList[randomIndex];
        currentWord.fiveLetterWords = currentWord.fiveLetterWords.sort(() => Math.random() - 0.5); // shuffle
        console.log(currentWord.fiveLetterWords);
        quizTitle.textContent = currentWord.fourLetterWord.toUpperCase(); // Update title with the current word
        guessedWords = [];
        displayGuessedWords();

        // Show input and submit button for new word
        userGuessInput.style.visibility = 'visible';
        submitGuessButton.style.visibility = 'visible';
    }

    function displayGuessedWords() {
        wordDisplay.innerHTML = ''; // Clear previous boxes
        const placeholder = '_'.repeat(currentWord.fiveLetterWords[0].length); // Create placeholder based on word length
        currentWord.fiveLetterWords.forEach(() => {
            const box = document.createElement('div');
            box.className = 'word-box';
            box.textContent = placeholder; // Use dynamic placeholder
            wordDisplay.appendChild(box);
        });
    }

    function updateGuessedWordsDisplay() {
        const boxes = wordDisplay.getElementsByClassName('word-box');
        currentWord.fiveLetterWords.forEach((word, index) => {
            if (guessedWords.includes(word)) {
                boxes[index].textContent = word.toUpperCase(); // Display guessed word
                boxes[index].classList.add('guessed'); // Add class to change style
            }
        });

        // Check if all words have been guessed
        if (guessedWords.length === currentWord.fiveLetterWords.length) {
            userGuessInput.style.visibility = 'hidden'; // Hide input but keep space
            submitGuessButton.style.visibility = 'hidden'; // Hide submit button but keep space
        }
    }

    userGuessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            submitGuessButton.click();
        }
    });

    // Fisher-Yates shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});