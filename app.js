/**
 * ============================================================================
 * PARTES DE LA INTERFAZ DE MICROSOFT WORD
 * Motor de Interacción, Desafío por Conceptos, Contrarreloj, Niveles y Vidas
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // CONFIGURACIÓN DE NIVELES DE DIFICULTAD
  const DIFFICULTY_CONFIG = {
    facil: {
      name: 'Fácil',
      maxLives: 3,
      desafioSeconds: 300, // 5 minutos
      desafioText: '5 min',
      timerSeconds: 90,    // 90 segundos
      timerText: '90s',
      color: '#16a34a',
      hearts: '❤️❤️❤️'
    },
    normal: {
      name: 'Normal',
      maxLives: 2,
      desafioSeconds: 180, // 3 minutos
      desafioText: '3 min',
      timerSeconds: 60,    // 60 segundos
      timerText: '60s',
      color: '#d97706',
      hearts: '❤️❤️'
    },
    dificil: {
      name: 'Difícil',
      maxLives: 1,
      desafioSeconds: 120, // 2 minutos
      desafioText: '2 min',
      timerSeconds: 30,    // 30 segundos
      timerText: '30s',
      color: '#dc2626',
      hearts: '❤️'
    }
  };

  // FORMATEADOR DE TIEMPO PARA CRONÓMETRO (MM:SS o SSs)
  function formatDisplayTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  }

  // ESTADO GLOBAL DE LA APLICACIÓN
  const state = {
    mode: 'drag', // 'drag' (Desafío por Conceptos), 'study' (Estudio), 'timer' (Contrarreloj Arrastrar)
    difficulty: 'normal', // 'facil', 'normal', 'dificil'
    lives: 2,
    maxLives: 2,
    activeParts: [],
    matchedParts: new Set(),
    selectedTagId: null,
    score: 0,
    streak: 0,
    attempts: 0,
    correctCount: 0,
    startTime: Date.now(),
    timerSeconds: 60,
    timerInterval: null,
    soundEnabled: true,
    zoomScale: 1,
    studentName: 'Estudiante',
    isGameOver: false,
    
    // Conceptos para el Modo Desafío
    conceptQuestions: [],
    currentConceptIndex: 0
  };

  // GENERADOR DE EFECTOS DE SONIDO (100% OFFLINE CON WEB AUDIO API)
  const soundManager = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
    },
    playTone(freq, type = 'sine', duration = 0.15, delay = 0) {
      if (!state.soundEnabled) return;
      this.init();
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
          // Fallback silencioso
        }
      }, delay);
    },
    success() {
      this.playTone(523.25, 'sine', 0.12, 0);   // Do5
      this.playTone(659.25, 'sine', 0.12, 60);  // Mi5
      this.playTone(783.99, 'sine', 0.22, 120); // Sol5
      this.playTone(1046.50, 'sine', 0.35, 180);// Do6
    },
    error() {
      this.playTone(220, 'sawtooth', 0.18, 0);
      this.playTone(180, 'sawtooth', 0.25, 100);
    },
    hint() {
      this.playTone(440, 'triangle', 0.15, 0);
      this.playTone(880, 'sine', 0.2, 80);
    },
    fanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
      const delays = [0, 100, 200, 300, 450, 600];
      notes.forEach((freq, idx) => {
        this.playTone(freq, 'triangle', 0.25, delays[idx]);
      });
    }
  };

  // ELEMENTOS DEL DOM
  const dom = {
    // Registro de estudiante y selector de dificultad
    studentEntryModal: document.getElementById('student-entry-modal'),
    initialStudentName: document.getElementById('initial-student-name'),
    btnStartApp: document.getElementById('btn-start-app'),
    studentNameForm: document.getElementById('student-name-form'),
    studentDisplayBadge: document.getElementById('student-display-badge'),
    statStudentName: document.getElementById('stat-student-name'),
    statLevelBadge: document.getElementById('stat-level-badge'),
    statLevelText: document.getElementById('stat-level-text'),
    statLivesBox: document.getElementById('stat-lives-box'),
    statLivesDisplay: document.getElementById('stat-lives-display'),
    diffCards: document.querySelectorAll('.difficulty-card'),

    // Paneles laterales
    conceptChallengePanel: document.getElementById('concept-challenge-panel'),
    conceptQuestionCounter: document.getElementById('concept-question-counter'),
    conceptQuoteText: document.getElementById('concept-quote-text'),
    conceptFunctionText: document.getElementById('concept-function-text'),
    tagsContainerPanel: document.getElementById('tags-container-panel'),
    infoCardPanel: document.getElementById('info-card-panel'),
    tagsPool: document.getElementById('tags-pool'),
    dropOverlay: document.getElementById('drop-overlay'),
    pedagogicalInfo: document.getElementById('pedagogical-info'),
    remainingCount: document.getElementById('remaining-count'),

    // Métricas
    statProgress: document.getElementById('stat-progress'),
    statScore: document.getElementById('stat-score'),
    statStreak: document.getElementById('stat-streak'),
    statTimer: document.getElementById('stat-timer'),
    timerBox: document.getElementById('timer-box'),
    btnSound: document.getElementById('btn-sound'),
    soundIcon: document.getElementById('sound-icon'),
    btnReset: document.getElementById('btn-reset'),
    btnViewSheet: document.getElementById('btn-view-sheet'),
    
    // Modal Ficha Original
    sheetModal: document.getElementById('sheet-modal'),
    closeSheetModal: document.getElementById('close-sheet-modal'),
    btnSheetOk: document.getElementById('btn-sheet-ok'),
    
    // Modal Certificado Oficial (Desafío y Contrarreloj)
    certificateModal: document.getElementById('certificate-modal'),
    closeCertModal: document.getElementById('close-cert-modal'),
    btnPlayAgain: document.getElementById('btn-play-again'),
    certModalTitle: document.getElementById('cert-modal-title'),
    certDiplomaTitle: document.getElementById('cert-diploma-title'),
    certDescriptionText: document.getElementById('cert-description-text'),
    certStudentNameText: document.getElementById('cert-student-name-text'),
    certScore: document.getElementById('cert-score'),
    certAccuracy: document.getElementById('cert-accuracy'),
    certTime: document.getElementById('cert-time'),
    certLevel: document.getElementById('cert-level'),
    certDate: document.getElementById('cert-date'),

    // Modal Game Over (Has Perdido)
    gameOverModal: document.getElementById('game-over-modal'),
    gameOverReason: document.getElementById('game-over-reason'),
    gameoverProgress: document.getElementById('gameover-progress'),
    gameoverScore: document.getElementById('gameover-score'),
    gameoverLevel: document.getElementById('gameover-level'),
    btnChangeDifficulty: document.getElementById('btn-change-difficulty'),
    btnRetryGame: document.getElementById('btn-retry-game'),

    // Zoom e Instrucciones
    wordStage: document.getElementById('word-stage'),
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    zoomReset: document.getElementById('zoom-reset'),
    instructionText: document.getElementById('interaction-instructions'),
    modeBtns: document.querySelectorAll('.mode-btn[data-mode]')
  };

  // INICIALIZACIÓN
  function init() {
    setupEventListeners();
    dom.initialStudentName.focus();
    resetGame();
  }

  // CONFIGURAR EVENTOS GENERALES
  function setupEventListeners() {
    // Tarjetas de Selección de Dificultad
    dom.diffCards.forEach(card => {
      card.addEventListener('click', () => {
        dom.diffCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          state.difficulty = radio.value;
        }
      });
    });

    // Formulario de Registro Inicial y Nivel
    dom.studentNameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredName = dom.initialStudentName.value.trim();
      if (enteredName.length < 2) {
        alert("Por favor, escribe tus nombres y apellidos antes de iniciar.");
        dom.initialStudentName.focus();
        return;
      }
      state.studentName = enteredName;
      dom.statStudentName.textContent = state.studentName;

      const selectedRadio = document.querySelector('input[name="difficulty"]:checked');
      if (selectedRadio) {
        state.difficulty = selectedRadio.value;
      }

      dom.studentEntryModal.classList.remove('show');
      resetGame();
    });

    // Clic en la insignia del nombre o nivel para abrir el modal de ajuste
    [dom.studentDisplayBadge, dom.statLevelBadge].forEach(badge => {
      if (badge) {
        badge.addEventListener('click', () => {
          dom.initialStudentName.value = state.studentName;
          
          dom.diffCards.forEach(c => {
            const radio = c.querySelector('input[type="radio"]');
            if (radio && radio.value === state.difficulty) {
              radio.checked = true;
              c.classList.add('selected');
            } else {
              c.classList.remove('selected');
            }
          });

          dom.studentEntryModal.classList.add('show');
          dom.initialStudentName.focus();
        });
      }
    });

    // Sonido
    dom.btnSound.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      dom.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
      dom.btnSound.style.opacity = state.soundEnabled ? '1' : '0.6';
    });

    // Reiniciar y Barajar Aleatoriamente
    dom.btnReset.addEventListener('click', () => {
      resetGame();
    });

    // Modal Visor de Ficha Original (Disponible exclusivamente en Modo Estudio)
    dom.btnViewSheet.addEventListener('click', () => {
      if (state.mode === 'study') {
        dom.sheetModal.classList.add('show');
      }
    });
    dom.closeSheetModal.addEventListener('click', () => dom.sheetModal.classList.remove('show'));
    dom.btnSheetOk.addEventListener('click', () => dom.sheetModal.classList.remove('show'));

    // Modal Certificado Oficial (Desafío y Contrarreloj)
    dom.closeCertModal.addEventListener('click', () => dom.certificateModal.classList.remove('show'));
    dom.btnPlayAgain.addEventListener('click', () => {
      dom.certificateModal.classList.remove('show');
      resetGame();
    });

    // Modal Game Over (Has Perdido)
    dom.btnRetryGame.addEventListener('click', () => {
      dom.gameOverModal.classList.remove('show');
      resetGame();
    });
    dom.btnChangeDifficulty.addEventListener('click', () => {
      dom.gameOverModal.classList.remove('show');
      dom.studentEntryModal.classList.add('show');
    });

    // Cambio de Modo
    dom.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchMode(btn.dataset.mode);
      });
    });

    // Controles de Zoom
    dom.zoomIn.addEventListener('click', () => setZoom(state.zoomScale + 0.1));
    dom.zoomOut.addEventListener('click', () => setZoom(state.zoomScale - 0.1));
    dom.zoomReset.addEventListener('click', () => setZoom(1));
  }

  function switchMode(newMode) {
    dom.modeBtns.forEach(b => b.classList.remove('active'));
    const targetBtn = document.querySelector(`.mode-btn[data-mode="${newMode}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    state.mode = newMode;
    handleModeChange();
  }

  function setZoom(scale) {
    state.zoomScale = Math.max(0.6, Math.min(1.5, scale));
    dom.wordStage.style.transform = `scale(${state.zoomScale})`;
    dom.zoomReset.textContent = `${Math.round(state.zoomScale * 100)}%`;
  }

  // REINICIAR Y RECONFIGURAR JUEGO CON ORDEN ALEATORIO
  function resetGame() {
    state.isGameOver = false;
    state.activeParts = shuffleArray([...WORD_PARTS_DATA]);
    state.conceptQuestions = shuffleArray([...WORD_PARTS_DATA]);
    state.currentConceptIndex = 0;
    state.matchedParts.clear();
    state.selectedTagId = null;
    state.score = 0;
    state.streak = 0;
    state.attempts = 0;
    state.correctCount = 0;
    state.startTime = Date.now();

    const diff = DIFFICULTY_CONFIG[state.difficulty] || DIFFICULTY_CONFIG.normal;
    state.maxLives = diff.maxLives;
    state.lives = state.maxLives;
    state.timerSeconds = state.mode === 'drag' ? diff.desafioSeconds : diff.timerSeconds;

    clearInterval(state.timerInterval);

    // Ajustar cronómetro, paneles y ficha de referencia según el modo
    if (state.mode === 'drag') {
      // MODO DESAFÍO: Activar cronómetro y panel de conceptos, ocultar ficha de referencia
      dom.conceptChallengePanel.style.display = 'block';
      dom.tagsContainerPanel.style.display = 'none';
      dom.infoCardPanel.style.display = 'none';
      dom.btnViewSheet.style.display = 'none';
      dom.sheetModal.classList.remove('show');
      dom.instructionText.textContent = `Modo Desafío (${diff.name} - ${diff.desafioText}): Lee cada concepto y haz clic en el número correspondiente de la interfaz.`;
      startTimer();
      loadCurrentConcept();
    } else if (state.mode === 'timer') {
      // MODO CONTRARRELOJ: Activar cronómetro y panel de fichas, ocultar ficha de referencia
      dom.conceptChallengePanel.style.display = 'none';
      dom.tagsContainerPanel.style.display = 'block';
      dom.infoCardPanel.style.display = 'none';
      dom.btnViewSheet.style.display = 'none';
      dom.sheetModal.classList.remove('show');
      dom.instructionText.textContent = `Modo Contrarreloj (${diff.name} - ${diff.timerText}): ¡Arrastra y ubica las ${WORD_PARTS_DATA.length} partes antes de que termine el tiempo con ${diff.maxLives} vida(s)!`;
      startTimer();
      renderDraggableTags();
    } else {
      // MODO ESTUDIO: Sin cronómetro, mostrar ficha de referencia y panel pedagógico
      dom.conceptChallengePanel.style.display = 'none';
      dom.tagsContainerPanel.style.display = 'none';
      dom.infoCardPanel.style.display = 'block';
      dom.timerBox.style.display = 'none';
      dom.btnViewSheet.style.display = 'inline-flex';
      dom.instructionText.textContent = "Modo Estudio: Toca o haz clic en cualquier círculo numerado para conocer la función de cada parte.";
      dom.pedagogicalInfo.innerHTML = `
        <strong>📌 Datos Generales:</strong><br>
        • <strong>Programa:</strong> ${GENERAL_DATA.programa}<br>
        • <strong>Categoría:</strong> ${GENERAL_DATA.categoria}<br>
        • <strong>Propósito:</strong> ${GENERAL_DATA.proposito}<br><br>
        <em>Toca una de las ${WORD_PARTS_DATA.length} partes en la maqueta para ver su función pedagógica y descripción oficial.</em>
      `;
      dom.pedagogicalInfo.classList.remove('highlight');
    }

    renderDropZones();
    updateStatsUI();
  }

  function handleModeChange() {
    resetGame();
  }

  // CARGAR CONCEPTO ACTUAL EN MODO DESAFÍO
  function loadCurrentConcept() {
    if (state.currentConceptIndex >= state.conceptQuestions.length) return;
    const currentPart = state.conceptQuestions[state.currentConceptIndex];

    dom.conceptQuestionCounter.textContent = `Pregunta ${state.currentConceptIndex + 1} de ${state.conceptQuestions.length}`;
    dom.conceptQuoteText.textContent = `"${currentPart.descripcion}"`;
    dom.conceptFunctionText.innerHTML = `<strong>Función Principal:</strong> ${currentPart.funcion}`;
  }

  function startTimer() {
    const diff = DIFFICULTY_CONFIG[state.difficulty] || DIFFICULTY_CONFIG.normal;
    const initialSeconds = state.mode === 'drag' ? diff.desafioSeconds : diff.timerSeconds;
    const initialText = state.mode === 'drag' ? diff.desafioText : diff.timerText;

    state.timerSeconds = initialSeconds;
    state.startTime = Date.now();
    dom.timerBox.style.display = 'flex';
    dom.statTimer.textContent = formatDisplayTime(state.timerSeconds);

    state.timerInterval = setInterval(() => {
      if (state.isGameOver) {
        clearInterval(state.timerInterval);
        return;
      }
      state.timerSeconds--;
      dom.statTimer.textContent = formatDisplayTime(state.timerSeconds);

      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        handleGameOver(`¡Se ha agotado el tiempo límite de ${initialText}!`);
      }
    }, 1000);
  }

  // RENDERIZAR ZONAS OBJETIVO Y MARCADORES CIRCULARES (1 AL 13)
  function renderDropZones() {
    dom.dropOverlay.innerHTML = '';

    const sortedParts = [...WORD_PARTS_DATA].sort((a, b) => a.num - b.num);

    sortedParts.forEach(part => {
      const isMatched = state.matchedParts.has(part.id);

      // Zona delimitada
      const zoneEl = document.createElement('div');
      zoneEl.className = `target-zone ${isMatched ? 'matched-zone' : ''}`;
      zoneEl.dataset.partId = part.id;
      zoneEl.style.top = part.areaPos.top;
      zoneEl.style.left = part.areaPos.left;
      zoneEl.style.width = part.areaPos.width;
      zoneEl.style.height = part.areaPos.height;

      // Pin Circular Numerado
      const pinEl = document.createElement('div');
      pinEl.className = `target-pin ${isMatched ? 'matched' : ''}`;
      pinEl.dataset.partId = part.id;
      pinEl.style.top = part.badgePos.top;
      pinEl.style.left = part.badgePos.left;
      pinEl.style.backgroundColor = part.color;

      const leftNum = parseFloat(part.badgePos.left);
      const topNum = parseFloat(part.badgePos.top);

      let transX = '-50%';
      let transY = '-50%';

      if (leftNum <= 15) transX = '0%';
      else if (leftNum >= 82) transX = '-100%';

      if (topNum <= 6) transY = '0%';
      else if (topNum >= 92) transY = '-100%';

      pinEl.style.transform = `translate(${transX}, ${transY})`;

      if (isMatched) {
        pinEl.innerHTML = `<span><strong>${part.num}</strong>. ${part.nombre}</span>`;
        pinEl.classList.add('matched');
      } else {
        pinEl.textContent = `${part.num}`;
        pinEl.classList.remove('matched');
      }

      // Eventos Drag and Drop y Clic
      [zoneEl, pinEl].forEach(el => {
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('dragleave', handleDragLeave);
        el.addEventListener('drop', handleDrop);
        el.addEventListener('click', () => handleZoneClick(part.id));
      });

      dom.dropOverlay.appendChild(zoneEl);
      dom.dropOverlay.appendChild(pinEl);
    });
  }

  // RENDERIZAR BANCO DE ETIQUETAS ARRASTRABLES (CONTRARRELOJ)
  function renderDraggableTags() {
    dom.tagsPool.innerHTML = '';

    const remainingParts = state.activeParts.filter(p => !state.matchedParts.has(p.id));

    remainingParts.forEach(part => {
      const tagEl = document.createElement('div');
      tagEl.className = `draggable-tag ${state.selectedTagId === part.id ? 'selected-click' : ''}`;
      tagEl.draggable = true;
      tagEl.dataset.partId = part.id;

      tagEl.innerHTML = `
        <span class="tag-name">${part.nombre}</span>
        <span class="tag-drag-handle">⠿</span>
      `;

      tagEl.addEventListener('dragstart', handleDragStart);
      tagEl.addEventListener('dragend', handleDragEnd);
      tagEl.addEventListener('click', () => handleTagSelect(part.id));
      setupTouchDrag(tagEl, part.id);

      dom.tagsPool.appendChild(tagEl);
    });

    dom.remainingCount.textContent = `${remainingParts.length} pendientes`;
  }

  // SELECCIÓN POR CLIC (CONTRARRELOJ)
  function handleTagSelect(partId) {
    if (state.isGameOver) return;
    if (state.selectedTagId === partId) {
      state.selectedTagId = null;
    } else {
      state.selectedTagId = partId;
      if (state.mode === 'study') {
        displayPartInfo(partId);
        highlightZoneBriefly(partId);
      }
    }
    renderDraggableTags();
  }

  // CLIC EN UNA ZONA / NÚMERO DE LA INTERFAZ
  function handleZoneClick(targetPartId) {
    if (state.isGameOver) return;

    if (state.mode === 'study') {
      displayPartInfo(targetPartId);
      soundManager.hint();
      highlightZoneBriefly(targetPartId);
      return;
    }

    if (state.mode === 'drag') {
      // MODO DESAFÍO (EVALUACIÓN POR CONCEPTO)
      validateConceptAnswer(targetPartId);
    } else if (state.mode === 'timer') {
      // MODO CONTRARRELOJ (POR SELECCIÓN O DRAG)
      if (state.selectedTagId) {
        validatePlacement(state.selectedTagId, targetPartId);
        state.selectedTagId = null;
        renderDraggableTags();
      }
    }
  }

  // VALIDAR RESPUESTA EN MODO DESAFÍO (POR CONCEPTO)
  function validateConceptAnswer(targetPartId) {
    if (state.currentConceptIndex >= state.conceptQuestions.length) return;
    const currentPart = state.conceptQuestions[state.currentConceptIndex];
    state.attempts++;

    if (targetPartId === currentPart.id) {
      // ACIERTO
      soundManager.success();
      state.correctCount++;
      state.streak++;
      state.score += Math.max(10, 100 + (state.streak * 20));
      state.matchedParts.add(currentPart.id);
      state.timerSeconds += 3; // Bonificación de tiempo

      renderDropZones();
      updateStatsUI();

      state.currentConceptIndex++;

      if (state.currentConceptIndex >= state.conceptQuestions.length) {
        handleVictory();
      } else {
        loadCurrentConcept();
      }

    } else {
      // ERROR
      soundManager.error();
      state.streak = 0;
      state.score = Math.max(0, state.score - 20);
      state.lives--;

      const targetEl = document.querySelector(`.target-zone[data-part-id="${targetPartId}"]`) || document.querySelector(`.target-pin[data-part-id="${targetPartId}"]`);
      if (targetEl) {
        targetEl.classList.add('shake-error');
        setTimeout(() => targetEl.classList.remove('shake-error'), 500);
      }

      updateStatsUI();

      if (state.lives <= 0) {
        handleGameOver('¡Te has quedado sin vidas!');
      }
    }
  }

  function displayPartInfo(partId) {
    const part = WORD_PARTS_DATA.find(p => p.id === partId);
    if (!part) return;

    // Limpiar selección previa en todos los pines
    document.querySelectorAll('.target-pin').forEach(p => {
      p.classList.remove('selected-study-active');
      const pPart = WORD_PARTS_DATA.find(item => item.id === p.dataset.partId);
      if (pPart && !state.matchedParts.has(pPart.id)) {
        p.textContent = `${pPart.num}`;
        p.classList.remove('matched');
      }
    });

    // Expandir y resaltar exclusivamente el pin tocado
    const selectedPin = document.querySelector(`.target-pin[data-part-id="${partId}"]`);
    if (selectedPin) {
      selectedPin.classList.add('selected-study-active', 'matched');
      selectedPin.innerHTML = `<span><strong>${part.num}</strong>. ${part.nombre}</span>`;
    }

    const hintHtml = state.mode === 'study' ? `<div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">💡 <em>Pista: ${part.pista}</em></div>` : '';

    dom.pedagogicalInfo.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
        <span style="background: ${part.color}; color: white; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">${part.num}</span>
        <strong style="color: ${part.color}; font-size: 1rem;">${part.nombre}</strong>
      </div>
      <p style="margin-bottom: 6px; font-size: 0.9rem; line-height: 1.4;">${part.descripcion}</p>
      <div style="background: #f1f5f9; border-left: 3.5px solid ${part.color}; padding: 6px 10px; border-radius: 4px; margin-top: 4px; font-size: 0.84rem; color: #1e293b;">
        <strong>🎯 Función Principal:</strong> ${part.funcion}
      </div>
      ${hintHtml}
    `;
    dom.pedagogicalInfo.classList.add('highlight');
  }

  // DRAG AND DROP (CONTRARRELOJ)
  let draggedPartId = null;

  function handleDragStart(e) {
    if (state.isGameOver) return;
    draggedPartId = e.currentTarget.dataset.partId;
    e.dataTransfer.setData('text/plain', draggedPartId);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  }

  function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.target-zone').forEach(z => z.classList.remove('drag-over'));
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const zone = e.currentTarget.closest('.target-zone') || document.querySelector(`.target-zone[data-part-id="${e.currentTarget.dataset.partId}"]`);
    if (zone) zone.classList.add('drag-over');
  }

  function handleDragLeave(e) {
    const zone = e.currentTarget.closest('.target-zone') || document.querySelector(`.target-zone[data-part-id="${e.currentTarget.dataset.partId}"]`);
    if (zone) zone.classList.remove('drag-over');
  }

  function handleDrop(e) {
    e.preventDefault();
    if (state.isGameOver) return;
    const targetPartId = e.currentTarget.dataset.partId;
    const sourcePartId = e.dataTransfer.getData('text/plain') || draggedPartId;

    document.querySelectorAll('.target-zone').forEach(z => z.classList.remove('drag-over'));

    if (sourcePartId && targetPartId) {
      validatePlacement(sourcePartId, targetPartId);
    }
  }

  // TOUCH DRAG AND DROP OPTIMIZADO PARA SMARTPHONES Y TABLETS
  function setupTouchDrag(tagEl, partId) {
    let touchClone = null;
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    tagEl.addEventListener('touchstart', (e) => {
      if (state.isGameOver) return;
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isDragging = false;
      draggedPartId = partId;
    }, { passive: true });

    tagEl.addEventListener('touchmove', (e) => {
      if (state.isGameOver) return;
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX);
      const deltaY = Math.abs(touch.clientY - startY);

      // Si el dedo se desplaza más de 7px, se activa el arrastre visual
      if (!isDragging && (deltaX > 7 || deltaY > 7)) {
        isDragging = true;
        touchClone = tagEl.cloneNode(true);
        touchClone.style.position = 'fixed';
        touchClone.style.zIndex = '3000';
        touchClone.style.pointerEvents = 'none';
        touchClone.style.opacity = '0.92';
        touchClone.style.transform = 'scale(1.05)';
        touchClone.style.boxShadow = '0 12px 28px rgba(0,0,0,0.35)';
        touchClone.style.width = `${Math.min(tagEl.offsetWidth, 180)}px`;
        touchClone.style.left = `${touch.clientX - Math.min(tagEl.offsetWidth, 180) / 2}px`;
        touchClone.style.top = `${touch.clientY - 35}px`;
        document.body.appendChild(touchClone);
        tagEl.classList.add('dragging');
      }

      if (isDragging && touchClone) {
        if (e.cancelable) e.preventDefault(); // Evita scroll vertical de página mientras arrastra
        const width = Math.min(tagEl.offsetWidth, 180);
        touchClone.style.left = `${touch.clientX - width / 2}px`;
        touchClone.style.top = `${touch.clientY - 35}px`;

        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        document.querySelectorAll('.target-zone').forEach(z => z.classList.remove('drag-over'));

        if (elemBelow) {
          const zone = elemBelow.closest('.target-zone') || document.querySelector(`.target-zone[data-part-id="${elemBelow.dataset.partId}"]`);
          if (zone) zone.classList.add('drag-over');
        }
      }
    }, { passive: false });

    tagEl.addEventListener('touchend', (e) => {
      if (isDragging) {
        if (touchClone) {
          touchClone.remove();
          touchClone = null;
        }
        tagEl.classList.remove('dragging');
        document.querySelectorAll('.target-zone').forEach(z => z.classList.remove('drag-over'));

        if (state.isGameOver) return;

        const touch = e.changedTouches[0];
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);

        if (elemBelow) {
          const zone = elemBelow.closest('.target-zone') || elemBelow.closest('.target-pin');
          if (zone && zone.dataset.partId) {
            validatePlacement(partId, zone.dataset.partId);
          }
        }
        isDragging = false;
      }
    });

    tagEl.addEventListener('touchcancel', () => {
      if (touchClone) {
        touchClone.remove();
        touchClone = null;
      }
      tagEl.classList.remove('dragging');
      document.querySelectorAll('.target-zone').forEach(z => z.classList.remove('drag-over'));
      isDragging = false;
    });
  }

  // VALIDACIÓN EN MODO CONTRARRELOJ
  function validatePlacement(sourcePartId, targetPartId) {
    if (state.isGameOver) return;

    state.attempts++;

    if (sourcePartId === targetPartId) {
      // ACIERTO
      soundManager.success();
      state.correctCount++;
      state.streak++;
      state.score += Math.max(10, 100 + (state.streak * 20));
      state.matchedParts.add(sourcePartId);
      state.timerSeconds += 3;

      renderDropZones();
      renderDraggableTags();
      updateStatsUI();

      if (state.matchedParts.size === WORD_PARTS_DATA.length) {
        handleVictory();
      }

    } else {
      // ERROR
      soundManager.error();
      state.streak = 0;
      state.score = Math.max(0, state.score - 20);
      state.lives--;

      const targetEl = document.querySelector(`.target-zone[data-part-id="${targetPartId}"]`);
      if (targetEl) {
        targetEl.classList.add('shake-error');
        setTimeout(() => targetEl.classList.remove('shake-error'), 500);
      }
      
      updateStatsUI();

      if (state.lives <= 0) {
        handleGameOver('¡Te has quedado sin vidas!');
      }
    }
  }

  function highlightZoneBriefly(partId) {
    document.querySelectorAll('.target-zone.hint-active').forEach(z => z.classList.remove('hint-active'));
    document.querySelectorAll('.target-pin.selected-study-active').forEach(p => p.classList.remove('selected-study-active'));

    const zone = document.querySelector(`.target-zone[data-part-id="${partId}"]`);
    const pin = document.querySelector(`.target-pin[data-part-id="${partId}"]`);

    if (zone) zone.classList.add('hint-active');
    if (pin) pin.classList.add('selected-study-active');

    setTimeout(() => {
      if (zone) zone.classList.remove('hint-active');
      if (pin) pin.classList.remove('selected-study-active');
    }, 3000);
  }

  function updateStatsUI() {
    const total = WORD_PARTS_DATA.length;
    const current = state.matchedParts.size;
    const diff = DIFFICULTY_CONFIG[state.difficulty] || DIFFICULTY_CONFIG.normal;

    dom.statProgress.textContent = `${current} / ${total}`;
    dom.statScore.textContent = state.score;
    dom.statStreak.textContent = `🔥 ${state.streak}`;

    if (state.mode === 'study') {
      dom.statLevelBadge.style.display = 'none';
      dom.statLivesBox.style.display = 'none';
    } else {
      dom.statLevelBadge.style.display = 'flex';
      dom.statLevelText.textContent = diff.name;
      dom.statLevelText.style.color = diff.color;

      dom.statLivesBox.style.display = 'flex';
      
      const activeHearts = '❤️'.repeat(Math.max(0, state.lives));
      const lostHearts = '🖤'.repeat(Math.max(0, state.maxLives - Math.max(0, state.lives)));
      dom.statLivesDisplay.textContent = activeHearts + lostHearts;
    }
  }

  // GESTIÓN DE GAME OVER (HAS PERDIDO)
  function handleGameOver(reason) {
    state.isGameOver = true;
    clearInterval(state.timerInterval);
    soundManager.error();

    const total = WORD_PARTS_DATA.length;
    const current = state.matchedParts.size;
    const diff = DIFFICULTY_CONFIG[state.difficulty] || DIFFICULTY_CONFIG.normal;

    dom.gameOverReason.textContent = reason;
    dom.gameoverProgress.textContent = `${current} / ${total}`;
    dom.gameoverScore.textContent = `${state.score} pts`;
    dom.gameoverLevel.textContent = diff.name;

    setTimeout(() => {
      dom.gameOverModal.classList.add('show');
    }, 600);
  }

  // GESTIÓN DE VICTORIA Y EMISIÓN DE CERTIFICADO OFICIAL
  function handleVictory() {
    state.isGameOver = true;
    clearInterval(state.timerInterval);
    soundManager.fanfare();
    launchConfetti();

    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
    const formattedTime = elapsedSeconds < 60 ? `${elapsedSeconds}s` : `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;
    const accuracy = state.attempts > 0 ? Math.round((state.correctCount / state.attempts) * 100) : 100;
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    const diff = DIFFICULTY_CONFIG[state.difficulty] || DIFFICULTY_CONFIG.normal;

    setTimeout(() => {
      try {
        if (dom.certStudentNameText) dom.certStudentNameText.textContent = state.studentName;
        if (dom.certScore) dom.certScore.textContent = `${state.score} pts`;
        if (dom.certAccuracy) dom.certAccuracy.textContent = `${accuracy}%`;
        if (dom.certTime) dom.certTime.textContent = formattedTime;
        if (dom.certDate) dom.certDate.textContent = formattedDate;

        if (state.mode === 'drag') {
          // CERTIFICADO DE MODO DESAFÍO (CONCEPTOS)
          if (dom.certModalTitle) dom.certModalTitle.textContent = "🏆 ¡Felicitaciones! Has Superado el Desafío de Conceptos";
          if (dom.certDiplomaTitle) dom.certDiplomaTitle.textContent = "Certificado de Dominio Conceptual";
          if (dom.certLevel) dom.certLevel.textContent = `${diff.name} (Desafío)`;
          if (dom.certDescriptionText) {
            dom.certDescriptionText.innerHTML = `Por haber identificado y relacionado exitosamente contra el tiempo los <strong>13 conceptos y funciones fundamentales de la interfaz de Microsoft Word</strong> en el nivel <strong>${diff.name}</strong>, demostrando sólido dominio conceptual y destreza en su aplicación.`;
          }
        } else {
          // CERTIFICADO DE MODO CONTRARRELOJ (AGILIDAD Y ARRASTRE)
          if (dom.certModalTitle) dom.certModalTitle.textContent = "🏆 ¡Felicitaciones! Has Superado el Contrarreloj";
          if (dom.certDiplomaTitle) dom.certDiplomaTitle.textContent = "Certificado de Dominio y Agilidad Digital";
          if (dom.certLevel) dom.certLevel.textContent = `${diff.name} (Contrarreloj)`;
          if (dom.certDescriptionText) {
            dom.certDescriptionText.innerHTML = `Por haber identificado y ubicado contra el tiempo las <strong>13 partes fundamentales de la interfaz de Microsoft Word</strong> en el nivel <strong>${diff.name}</strong>, demostrando rapidez, agilidad y dominio integral del procesador de textos.`;
          }
        }
      } catch (err) {
        console.error("Error al poblar certificado:", err);
      }

      if (dom.certificateModal) {
        dom.certificateModal.classList.add('show');
      }
    }, 500);
  }

  // MOTOR DE CONFETI EN CANVAS
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#1e40af', '#16a34a', '#7c3aed', '#ea580c', '#d97706', '#db2777', '#0d9488', '#dc2626'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 4 - 2
      });
    }

    let animationFrame;
    let startTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (Date.now() - startTime < 4500) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    draw();
  }

  // INICIAR APLICACIÓN
  init();

});
