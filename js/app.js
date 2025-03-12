
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
  const skipBtn = document.getElementById('skip-btn'); // Bouton SKIP ajouté
  
  

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

  // Sons
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
  
 skipBtn.style.display = 'none';
  	  let skipClicked = false;
	  let pausedBeforeEnd = false;
  
skipBtn.addEventListener('click', function() {
  skipClicked = true;
  skipBtn.style.display = 'none';

  introVideo.pause();
  introVideo.style.display = 'none';

  const lastFrameImg = document.getElementById('intro-final-frame'); // 👈 ID corrigé ici
  lastFrameImg.style.display = 'block';

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

  // Couche de blocage UNIQUEMENT sur le bouton START
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
    blocker.remove();  // Supprime le blocker après utilisation
  }, 1800);

  let pausedBeforeEnd = false;
  const triggerBeforeEnd = 6;

  // Afficher le bouton skip après 2 secondes
introVideo.addEventListener('timeupdate', function() {
  if (!skipClicked && introVideo.currentTime >= 1 && skipBtn.style.display === 'none') {
    skipBtn.style.display = 'block'; // 🔥 Affiche le bouton seulement après 6s
    setTimeout(() => {
      skipBtn.classList.add('fade-in'); // 🔥 Ajoute une animation fluide
    }, 10);
  }
});

    // Mettre la vidéo en pause 0.1 seconde avant la fin pour afficher le bouton "COMMENCER"
    if (!pausedBeforeEnd && introVideo.duration && introVideo.currentTime >= introVideo.duration - 0.1) {
      pausedBeforeEnd = true;
	  skipBtn.classList.remove('fade-in');
skipBtn.classList.add('fadeOut');
  skipBtn.addEventListener('animationend', function() {
    skipBtn.style.display = 'none';
  }, { once: true });
    skipClicked = true;              // Empêcher toute réapparition
    introVideo.pause();
      // Afficher le bouton "COMMENCER" par-dessus la vidéo
      commencerBtn.style.display = 'block';
      commencerBtn.classList.add('fade-in2', 'blink');
 // Afficher la nouvelle image en haut avec un fade in
const titre = document.getElementById('titre');
  if (titre) {
  titre.style.display = 'block';
  titre.classList.add('fade-in2');
  }
const newSound = new Audio('assets/alpha.mp3'); // Remplacez le chemin par le fichier de son désiré
  newSound.play();
}
  });

  // En cas d'ended (au cas où le timeupdate ne se déclenche pas exactement comme souhaité)
  introVideo.addEventListener('ended', function() {
    introVideo.pause();
    commencerBtn.style.display = 'block';
    commencerBtn.classList.add('fade-in2', 'blink');
  });
});

commencerBtn.addEventListener('click', function() {
  commencerSound.play();
  commencerBtn.classList.add('slow-blink');

  const homeWrapper = document.getElementById('home-wrapper');

  // 🔥 Cache le quiz complètement avant la transition
  quizPage.style.display = 'none';
  quizPage.classList.remove('zoom-fade'); // Supprime toute animation précédente

  // Forcer un reflow pour s'assurer que la transition est prise en compte
  void homeWrapper.offsetWidth;

  homeWrapper.classList.add('fade-out');

  let transitionFired = false;

  function handleTransition() {
    if (transitionFired) return;
    transitionFired = true;
    console.log('Transition ended');

    // 🔥 Masquer complètement la page d'accueil avant d'afficher le quiz
    homePage.style.display = 'none';

    setTimeout(() => {
      quizPage.style.display = 'block'; // 🔥 S'assurer que le quiz est affiché
      quizPage.style.visibility = 'visible'; // 🔥 Rendre visible après affichage
      quizPage.style.opacity = '1'; // 🔥 Appliquer la transition d'opacité
      quizPage.classList.add('zoom-fade'); // Ajoute l’animation
    }, 50); // 🔥 Léger délai pour éviter l'effet "flash"

    loadQuestion(); // Charger la première question

    // Réinitialiser le wrapper
    homeWrapper.classList.remove('fade-out');
    homeWrapper.removeEventListener('transitionend', handleTransition);
  }

  homeWrapper.addEventListener('transitionend', handleTransition);

  // Fallback en cas de non-déclenchement de l'événement après 600ms
  setTimeout(handleTransition, 1200);
});

  // Chargement d'une question
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

  // Sélection d'une réponse
  optionsEls.forEach(btn => {
    btn.addEventListener('click', function() {
      optionsEls.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAnswer = btn.dataset.answer;
    });
  });

  // Bouton "JOUER" pour jouer le son
  jouerBtn.addEventListener('click', function() {
    jouerSound.currentTime = 0;
    jouerSound.play();
  });

  // Validation de la réponse
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
  document.getElementById('commencer-btn').addEventListener('click', () => {
  
  // déclenche l'animation sur le bouton lui-même (facultatif, retire cette ligne si déjà animée)
  document.getElementById('commencer-btn').classList.add('spin-fade');

  // attend 1200ms avant de passer à la page suivante pour voir l'animation du bouton
  setTimeout(() => {
    document.getElementById('home').style.display = 'none';

    const quizPage = document.getElementById('quiz');
    quizPage.style.display = 'block';
    quizPage.classList.add('zoom-fade');
  }, 1200); // ajuste la durée (1200ms) selon ton animation actuelle
});
recommencerBtn.addEventListener('click', function() {
  recommencerSound.play();
  recommencerBtn.classList.add('blink');
  setTimeout(function() {
    window.location.reload();
  }, 1000);
});
});
