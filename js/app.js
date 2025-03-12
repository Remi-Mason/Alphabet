document.addEventListener('DOMContentLoaded', function() {
  // Récupération des éléments des pages
  const homePage = document.getElementById('home');
  const quizPage = document.getElementById('quiz');
  const resultPage = document.getElementById('result');

  // Éléments de la page d'accueil
  const startBtn = document.getElementById('start-btn');
  const startSound = new Audio('assets/sound_start.mp3'); 
  const commencerBtn = document.getElementById('commencer-btn');
  const commencerSound = new Audio('assets/commencer.mp3'); 
  const homeBg = document.getElementById('home-bg');
  const introVideo = document.getElementById('intro-video');
  const skipBtn = document.getElementById('skip-btn'); // Bouton SKIP
  
  // Éléments de la page du quiz
  const questionCounterEl = document.getElementById('question-counter');
  const validerBtn = document.getElementById('valider-btn');
  const jouerBtn = document.getElementById('jouer-btn');
  const feedbackImg = document.getElementById('feedback-img');
  const suivantBtn = document.getElementById('suivant-btn');
  const optionsEls = document.querySelectorAll('.option');

  // Éléments de la page de résultat
  const scoreEl = document.getElementById('score');
  const recommencerBtn = document.getElementById('recommencer-btn');

  // Sons divers
  const buttonSound = new Audio('assets/sound_button.mp3');
  const jouerSound = new Audio('assets/sound_jouer.mp3');
  const correctSound = new Audio('assets/sound_correct.mp3');
  const wrongSound = new Audio('assets/sound_wrong.mp3');
  const recommencerSound = new Audio('assets/sound_recommencer.mp3');

  // Précharger l'image de fond du quiz (frame1.png)
  const quizBgImg = new Image();
  quizBgImg.src = 'assets/frame1.png';
  quizBgImg.onload = function() {
    console.log("L'image frame1 est préchargée");
  };

  // Données du quiz (exemple avec 2 questions)
  const quizData = [
    {
      letter: 'assets/letterA.png',
      text: 'Comme dans...',
      options: ['Avion', 'Alpaga', 'Abeille'],
      correct: 'abeille'
    },
    {
      letter: 'assets/letterB.png',
      text: 'Comme dans...',
      options: ['Bateau', 'Baleine', 'Bison'],
      correct: 'bateau'
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let selectedAnswer = null;
  
  // Initialisation du bouton Skip
  skipBtn.style.display = 'none';
  let skipClicked = false;
  let pausedBeforeEnd = false;
  let skipBtnShown = false; // Pour s'assurer que le bouton Skip s'affiche qu'une fois

  skipBtn.addEventListener('click', function() {
    skipClicked = true;
    skipBtn.style.display = 'none';

    introVideo.pause();
    introVideo.style.display = 'none';

    const lastFrameImg = document.getElementById('intro-final-frame'); // ID corrigé
    lastFrameImg.style.display = 'block';

    // Affiche le bouton "COMMENCER" et le titre
    commencerBtn.style.display = 'block';
    commencerBtn.classList.add('fade-in2', 'blink');

    const titre = document.getElementById('titre');
    if (titre) {
      titre.style.display = 'block';
      titre.classList.add('fade-in2');
    }

    const newSound = new Audio('assets/alpha.mp3');
    newSound.play();
  });

  // Logique de la page d'accueil
  startBtn.addEventListener('click', function() {
    startSound.play();
    startBtn.classList.remove('breathe');
    startBtn.classList.add('spin-fade');

    // Création d'un blocker temporaire sur le bouton Start
    const blocker = document.createElement('div');
    const btnRect = startBtn.getBoundingClientRect();
    blocker.style.position = 'absolute';
    blocker.style.top = btnRect.top + 'px';
    blocker.style.left = btnRect.left + 'px';
    blocker.style.width = btnRect.width + 'px';
    blocker.style.height = btnRect.height + 'px';
    blocker.style.zIndex = '9999';
    document.body.appendChild(blocker);

    setTimeout(() => {
      homeBg.style.display = 'none';
      introVideo.style.display = 'block';
      introVideo.play();
      startBtn.style.display = 'none';
      blocker.remove();
    }, 1800);

    let pausedBeforeEnd = false;
    const triggerBeforeEnd = 6;

    introVideo.addEventListener('timeupdate', function() {
      // Affiche le bouton Skip après 0.5 seconde, uniquement s'il n'a pas déjà été affiché
      if (!skipClicked && introVideo.currentTime >= 0.5 && !skipBtnShown) {
        skipBtn.style.display = 'block';
        setTimeout(() => {
          skipBtn.style.opacity = '0.5';
          skipBtn.style.pointerEvents = 'auto';
        }, 100);
        skipBtnShown = true;
      }

      // Lorsqu'on approche de la fin de la vidéo, on arrête et on affiche "COMMENCER"
      if (!pausedBeforeEnd && introVideo.duration && introVideo.currentTime >= introVideo.duration - 0.1) {
        pausedBeforeEnd = true;
        skipBtn.classList.remove('fade-in');
        skipBtn.classList.add('fadeOut');
        skipBtn.addEventListener('animationend', function() {
          skipBtn.style.display = 'none';
        }, { once: true });
        skipClicked = true;
        introVideo.pause();
        commencerBtn.style.display = 'block';
        commencerBtn.classList.add('fade-in2', 'blink');
        const titre = document.getElementById('titre');
        if (titre) {
          titre.style.display = 'block';
          titre.classList.add('fade-in2');
        }
        const newSound = new Audio('assets/alpha.mp3');
        newSound.play();
      }
    });

    introVideo.addEventListener('ended', function() {
      introVideo.pause();
      commencerBtn.style.display = 'block';
      commencerBtn.classList.add('fade-in2', 'blink');
    });
  });

  // Gestion de la transition vers le quiz
  commencerBtn.addEventListener('click', function() {
    commencerSound.play();
    commencerBtn.classList.add('slow-blink', 'spin-fade');

    const homeWrapper = document.getElementById('home-wrapper');

    // Cache le quiz et réinitialise ses propriétés
    quizPage.style.display = 'none';
    quizPage.style.visibility = 'hidden';
    quizPage.style.opacity = '0';
    quizPage.classList.remove('zoom-fade');

    void homeWrapper.offsetWidth;

    homeWrapper.classList.add('fade-out');

    let transitionFired = false;
    function handleTransition() {
      if (transitionFired) return;
      transitionFired = true;
      console.log('Transition ended');

      homePage.style.display = 'none';

      setTimeout(() => {
        quizPage.style.display = 'block';
        quizPage.style.visibility = 'visible';
        quizPage.style.opacity = '1';
        quizPage.classList.add('zoom-fade');
      }, 50);

      loadQuestion();

      homeWrapper.classList.remove('fade-out');
      homeWrapper.removeEventListener('transitionend', handleTransition);
    }

    homeWrapper.addEventListener('transitionend', handleTransition);
    setTimeout(handleTransition, 1200);
  });

  function loadQuestion() {
    const questionData = quizData[currentQuestion];
    questionCounterEl.textContent = (currentQuestion + 1) + ' / ' + quizData.length;
    document.getElementById('letter-img').src = questionData.letter;
    document.getElementById('question-text').innerHTML = '<strong>' + questionData.text + '</strong>';
    const optionButtons = document.querySelectorAll('.option');
    optionButtons.forEach((btn, index) => {
      btn.textContent = questionData.options[index];
      btn.dataset.answer = questionData.options[index].toLowerCase();
      btn.classList.remove('selected', 'correct', 'incorrect');
    });
    feedbackImg.style.display = 'none';
    validerBtn.style.display = 'block';
    suivantBtn.style.display = 'none';
    selectedAnswer = null;
  }

  optionsEls.forEach(btn => {
    btn.addEventListener('click', function() {
      optionsEls.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAnswer = btn.dataset.answer;
    });
  });

  jouerBtn.addEventListener('click', function() {
    jouerSound.currentTime = 0;
    jouerSound.play();
  });

  validerBtn.addEventListener('click', function() {
    if (!selectedAnswer) return;
    validerBtn.style.display = 'none';
    const correctAnswer = quizData[currentQuestion].correct;
    if (selectedAnswer === correctAnswer) {
      feedbackImg.src = 'assets/correct.png';
      feedbackImg.style.display = 'block';
      feedbackImg.classList.add('elastic');
      correctSound.play();
      score++;
      setTimeout(() => {
        nextQuestion();
      }, 600);
    } else {
      feedbackImg.src = 'assets/wrong.png';
      feedbackImg.style.display = 'block';
      feedbackImg.classList.add('shake');
      wrongSound.play();
      optionsEls.forEach(btn => {
        if (btn.dataset.answer === correctAnswer) {
          btn.classList.add('correct');
        }
      });
      setTimeout(() => {
        suivantBtn.style.display = 'block';
      }, 600);
    }
  });

  suivantBtn.addEventListener('click', function() {
    nextQuestion();
  });

  function nextQuestion() {
    feedbackImg.classList.remove('elastic', 'shake');
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    quizPage.classList.remove('active');
    resultPage.classList.add('active');
    scoreEl.textContent = "Vous avez obtenu " + score + " sur " + quizData.length;
  }

  recommencerBtn.addEventListener('click', function() {
    recommencerSound.play();
    recommencerBtn.classList.add('blink');
    setTimeout(function() {
      window.location.reload();
    }, 1000);
  });
});
