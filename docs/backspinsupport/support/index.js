/* ═══════════════════════════════════════════════════════════════
   Backspin Support — index.js
   ═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────
// ENVIRONMENT  (dev vs production)
// ─────────────────────────────────────────────────────────────────
const _isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const _serverUrl   = _isLocalhost
  ? 'http://localhost:3000'
  : 'https://eddyzow.herokuapp.com';
const SUPPORT_UNREAD_KEY = 'bsp_support_unread_counts';

function readSupportIdentityFromUrl() {
  const params = new URLSearchParams(window.location.search || '');
  const username = String(params.get('username') || '').trim().slice(0, 80);
  const playerId = String(params.get('playerId') || username).trim().slice(0, 80);
  const supportToken = String(params.get('supportToken') || '').trim();
  return { username, playerId, supportToken };
}

// ─────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────────────
const S = {
  en: {
    botName: 'Spinny',
    online: 'Online now',
    connecting: 'Connecting…',
    reconnecting: 'Reconnecting…',
    aiError: "I'm having a connection issue right now. Please try again, or email support@backspingames.com.",
    greeting: 'Hey! I\'m <b>Spinny</b>, your Backspin support assistant.',
    greetSub: 'What do you need help with today?',
    aiDisclaimer: 'AI may be inaccurate. Backspin is not liable for AI-generated inaccuracies.',
    thinkingTitle: 'Looking that up…',
    thinkingSub: 'Checking the best answer for you.',
    articleLabel: 'Help article',
    loadingConversations: 'Loading conversations…',
    quickLabel: 'QUICK HELP',
    topicsLabel: 'TOPICS',
    refundTitle: 'Match Refund',
    refundSub: 'Crash · Freeze · Wrong result',
    refundPrompt: 'I can help with that! To get your refund reviewed quickly, please describe:\n• What happened (crash, freeze, wrong result?)\n• When the match took place\n• The entry fee amount\n\nThe more detail, the faster we can resolve it.',
    questionsLabel: 'What\'s your question?',
    notListed: 'My question isn\'t listed',
    somethingElse: 'Something else',
    didItHelp: 'Did that answer your question?',
    yesLabel: '👍 Yes, thanks!',
    noLabel: '💬 Not quite',
    placeholder: 'Type your question…',
    hardMsg: 'No problem — <b>type your question in your own words</b> and I\'ll do my best to help. 👇',
    aiFirst: '<b>Tell me exactly what\'s going on</b> and I\'ll help you right away. 👇',
    sorryMsg: 'I\'m sorry I wasn\'t able to fully resolve this. 😔',
    transferOffer: 'Would you like me to connect you with a real person on our support team?',
    transferYes: '🧑‍💼 Yes, connect me',
    transferNo: '💬 Let me try again',
    packagingMsg: 'On it! Packaging up our conversation and routing it to the team…',
    ticketMsg: 'You\'re all set! 🙌 A human agent will reply within <b>24 hours</b> on weekdays (Mon–Fri, 9AM–5PM Madrid). Anything else?',
    retryMsg: 'Of course! Type your question and I\'ll give it another shot. 👇',
    teamTitle: 'You\'re in the queue!',
    teamSub: 'Your conversation has been forwarded to our support team. They\'ll reach out via the email on your account.',
    ticketId: 'Ticket ID',
    emailSupport: '✉️  Email Support',
    copyEmail: '📋  Copy Email',
    copied: '✅  Copied!',
    escHead: '🧑‍💼 This might need our team',
    escSub: 'This type of issue is often best resolved by a human who can see your account.',
    escHrs: 'Mon–Fri · 9 AM – 5 PM Madrid',
    backTopics: '← Back to topics',
    thatIsAll: 'That\'s all, thanks!',
    awesomeMsg: '🎯 Awesome! Glad I could help. Another question? I\'m always here.',
    doneFarewell: 'Happy to help! Have a great game. 🎯',
    speakHuman: 'Speak to a human',
    speakHumanSub: 'Support team · Mon–Fri, 9 AM–5 PM Madrid',
    gotIt: 'Got it!',
    catPrefix: 'common questions. Which one fits your issue?',
    catIntro: 'Here are the common questions for',
    catSuffix: 'Which one fits your issue?',
    needsHumanMsg: "I can see this needs a human to look into your account directly — let me get someone for you.",
    generatedIn: 'Generated in',
    aiLang: 'English',
    whatElse: 'What else can I help you with?',
    openTicket: '🎫  Open Support Ticket',
    ticketOpenedTitle: '✅ Ticket Opened',
    ticketOpenedSub: 'Our team will review your issue and reply to your account email within 24 hours (Mon–Fri).',
    addMoreInfo: '💬 The more detail you can add below, the faster we can help:',
    addedToTicket: '✓ Added to your ticket',
    ticketUpdated: 'Got it — added to your ticket. Anything else you\'d like to include?',
    sentToSupport: 'Sent to support',
    ticketClosedNotice: 'This ticket is closed. Reopen it from support if you need to continue.',
    ticketClosedLabel: 'Closed by support',
    ticketWaitingLabel: 'Support replied',
    ticketOpenLabel: 'Awaiting support reply',
    newReplyLabel: 'New reply',
    ticketHiddenNotice: 'This ticket was removed from your support inbox by support.',
    gameErrorLabel: 'I had an error in my game',
    gameErrorSub: 'What kind of error did you experience?',
    errorCrash: '💥 The app crashed',
    errorFreeze: '🥶 The game froze',
    errorWrongResult: '❌ Wrong result recorded',
    errorOther: '❓ Something else went wrong',
    newConversation: '🔄 Start a new conversation',
    inboxTitle: 'Backspin Support',
    inboxSub: 'How can we help you today?',
    inboxNewBtn: 'New conversation',
    inboxSectionOpen: 'Open',
    inboxSectionClosed: 'Closed',
    inboxEmpty: 'No conversations yet',
    inboxEmptySub: 'Tap the button below to get started.',
    inboxEmptyHint: 'Popular topics',
    badgeOpen: '● Open',
    badgeClosed: 'Closed',
    resumedTitle: 'Resumed',
    cat_deposits: 'Deposits, Payments & Withdrawals',
    cat_withdrawals: 'Withdrawals',
    cat_matchrefund: 'I had an error in my game',
    cat_events: 'Events & Competitions',
    cat_bonus: 'Bonus Cash & Promos',
    cat_app: 'App & Technical Issues',
    cat_account: 'My Account',
    q_deposits_how: 'How do I make a deposit?',
    q_deposits_methods: 'What payment methods are accepted?',
    q_deposits_fee: 'Is there a deposit fee?',
    q_deposits_declined: 'My payment was declined',
    q_withdrawals_how: 'How do I withdraw my winnings?',
    q_withdrawals_time: 'How long do withdrawals take?',
    q_withdrawals_info: 'What info do I need to withdraw?',
    q_withdrawals_bonus: 'What happens to my Bonus Cash when I withdraw?',
    q_withdrawals_missing: "My withdrawal hasn't arrived",
    q_matchrefund_howrefund: 'How do I request a match refund?',
    q_matchrefund_crash: 'The app crashed during a match',
    q_matchrefund_froze: 'The game froze and I lost my entry',
    q_matchrefund_wrongresult: 'The match result was wrong',
    q_matchrefund_refundtime: 'How long does a refund take?',
    q_events_wildwest: 'What is the Wild West event?',
    q_events_milestones: 'How do Wild West milestones work?',
    q_events_roulette: 'What is Bandits Roulette?',
    q_events_bounty: 'How does the Bounty Board work?',
    q_events_prizes: 'When are event prizes delivered?',
    q_bonus_what: 'What is Bonus Cash?',
    q_bonus_earn: 'How do I earn free Bonus Cash?',
    q_bonus_codes: 'How do promo codes work?',
    q_bonus_forfeited: 'Why was my Bonus Cash removed?',
    q_app_crash: 'The app keeps crashing',
    q_app_login: "I can't log in",
    q_app_android: 'Where do I download the Android app?',
    q_app_requirements: 'What are the system requirements?',
    q_account_verify: 'How do I verify my account?',
    q_account_password: 'I forgot my password',
    q_account_locked: 'My account is locked or banned',
    q_account_multiple: 'Can I have more than one account?',
    q_account_age: 'What is the minimum age to play?',
  },
  es: {
    botName: 'Spinny',
    online: 'En línea',
    connecting: 'Conectando…',
    reconnecting: 'Reconectando…',
    aiError: 'Tengo un problema de conexión. Inténtalo de nuevo o escribe a support@backspingames.com.',
    greeting: '¡Hola! Soy <b>Spinny</b>, tu asistente de soporte de Backspin.',
    greetSub: '¿En qué puedo ayudarte hoy?',
    aiDisclaimer: 'La IA puede cometer errores. Backspin no se hace responsable de inexactitudes generadas por IA.',
    thinkingTitle: 'Buscando eso…',
    thinkingSub: 'Comprobando la mejor respuesta para ti.',
    articleLabel: 'Artículo de ayuda',
    loadingConversations: 'Cargando conversaciones…',
    quickLabel: 'AYUDA RÁPIDA',
    topicsLabel: 'TEMAS',
    refundTitle: 'Reembolso de Partida',
    refundSub: 'Fallo · Congelado · Resultado incorrecto',
    refundPrompt: '¡Puedo ayudarte! Para procesar tu reembolso rápidamente, descríbeme:\n• Qué pasó (¿fallo, congelado, resultado incorrecto?)\n• Cuándo ocurrió la partida\n• El importe de la entrada\n\nCon más detalles, lo resolveremos más rápido.',
    questionsLabel: '¿Cuál es tu pregunta?',
    notListed: 'Mi pregunta no está en la lista',
    somethingElse: 'Otra cosa',
    didItHelp: '¿Respondió eso tu pregunta?',
    yesLabel: '👍 ¡Sí, gracias!',
    noLabel: '💬 No del todo',
    placeholder: 'Escribe tu pregunta…',
    hardMsg: 'Sin problema — <b>escribe tu pregunta con tus propias palabras</b>. 👇',
    aiFirst: '<b>Cuéntame exactamente qué pasa</b> y te ayudaré de inmediato. 👇',
    sorryMsg: 'Lo siento, no he podido resolver esto completamente. 😔',
    transferOffer: '¿Quieres que te conecte con una persona real de nuestro equipo?',
    transferYes: '🧑‍💼 Sí, conéctame',
    transferNo: '💬 Quiero intentarlo de nuevo',
    packagingMsg: '¡En ello! Enviando nuestra conversación al equipo…',
    ticketMsg: '¡Listo! 🙌 Un agente humano responderá en <b>24 horas</b> entre semana (Lun–Vie, 9–17h Madrid). ¿Necesitas algo más?',
    retryMsg: '¡Claro! Escribe tu pregunta y lo intentaré de nuevo. 👇',
    teamTitle: '¡Estás en la cola!',
    teamSub: 'Tu conversación ha sido enviada al equipo de soporte. Se pondrán en contacto por el correo de tu cuenta.',
    ticketId: 'ID de Ticket',
    emailSupport: '✉️  Contactar Soporte',
    copyEmail: '📋  Copiar Email',
    copied: '✅  ¡Copiado!',
    escHead: '🧑‍💼 Esto puede necesitar a nuestro equipo',
    escSub: 'Este tipo de problema se resuelve mejor con un agente humano que pueda ver tu cuenta.',
    escHrs: 'Lun–Vie · 9–17h Madrid',
    backTopics: '← Volver a temas',
    thatIsAll: '¡Eso es todo, gracias!',
    awesomeMsg: '🎯 ¡Genial! Me alegra haber ayudado. ¿Otra pregunta?',
    doneFarewell: '¡A jugar! 🎯',
    speakHuman: 'Hablar con una persona',
    speakHumanSub: 'Soporte · Lun–Vie, 9–17h Madrid',
    gotIt: '¡Entendido!',
    catPrefix: 'preguntas frecuentes. ¿Cuál es la tuya?',
    catIntro: 'Aquí tienes las preguntas frecuentes de',
    catSuffix: '¿Cuál es la tuya?',
    needsHumanMsg: 'Esto necesita que alguien de nuestro equipo revise tu cuenta directamente — déjame conseguirte un agente.',
    generatedIn: 'Generado en',
    aiLang: 'Español',
    whatElse: '¿En qué más puedo ayudarte?',
    openTicket: '🎫  Abrir Ticket de Soporte',
    ticketOpenedTitle: '✅ Ticket Abierto',
    ticketOpenedSub: 'Nuestro equipo revisará tu problema y responderá al correo de tu cuenta en 24 horas (Lun–Vie).',
    addMoreInfo: '💬 Cuanta más información añadas, más rápido podremos ayudarte:',
    addedToTicket: '✓ Añadido a tu ticket',
    ticketUpdated: 'Entendido — añadido a tu ticket. ¿Algo más que quieras incluir?',
    sentToSupport: 'Enviado a soporte',
    ticketClosedNotice: 'Este ticket está cerrado. Ábrelo de nuevo desde soporte si necesitas continuar.',
    ticketClosedLabel: 'Cerrado por soporte',
    ticketWaitingLabel: 'Soporte respondió',
    ticketOpenLabel: 'Esperando respuesta de soporte',
    newReplyLabel: 'Nueva respuesta',
    ticketHiddenNotice: 'Este ticket fue eliminado de tu bandeja de soporte por el equipo.',
    gameErrorLabel: 'Tuve un error en mi partida',
    gameErrorSub: '¿Qué tipo de error experimentaste?',
    errorCrash: '💥 La app se cerró sola',
    errorFreeze: '🥶 El juego se congeló',
    errorWrongResult: '❌ Resultado incorrecto registrado',
    errorOther: '❓ Otro problema',
    newConversation: '🔄 Iniciar nueva conversación',
    inboxTitle: 'Soporte Backspin',
    inboxSub: '¿Cómo podemos ayudarte hoy?',
    inboxNewBtn: 'Nueva conversación',
    inboxSectionOpen: 'Abiertas',
    inboxSectionClosed: 'Cerradas',
    inboxEmpty: 'Aún no hay conversaciones',
    inboxEmptySub: 'Toca el botón de abajo para comenzar.',
    inboxEmptyHint: 'Temas populares',
    badgeOpen: '● Abierto',
    badgeClosed: 'Cerrado',
    resumedTitle: 'Reanudado',
    cat_deposits: 'Depósitos, Pagos y Retiros',
    cat_withdrawals: 'Retiros',
    cat_matchrefund: 'Tuve un error en mi partida',
    cat_events: 'Eventos y Competiciones',
    cat_bonus: 'Dinero Bonus y Promos',
    cat_app: 'App y Problemas Técnicos',
    cat_account: 'Mi Cuenta',
    q_deposits_how: '¿Cómo hago un depósito?',
    q_deposits_methods: '¿Qué métodos de pago se aceptan?',
    q_deposits_fee: '¿Hay comisión por depósito?',
    q_deposits_declined: 'Mi pago fue rechazado',
    q_withdrawals_how: '¿Cómo retiro mis ganancias?',
    q_withdrawals_time: '¿Cuánto tardan los retiros?',
    q_withdrawals_info: '¿Qué información necesito para retirar?',
    q_withdrawals_bonus: '¿Qué pasa con mi Dinero Bonus al retirar?',
    q_withdrawals_missing: 'Mi retiro no ha llegado',
    q_matchrefund_howrefund: '¿Cómo solicito un reembolso de partida?',
    q_matchrefund_crash: 'La app se cerró durante una partida',
    q_matchrefund_froze: 'El juego se congeló y perdí mi entrada',
    q_matchrefund_wrongresult: 'El resultado de la partida fue incorrecto',
    q_matchrefund_refundtime: '¿Cuánto tarda un reembolso?',
    q_events_wildwest: '¿Qué es el evento Wild West?',
    q_events_milestones: '¿Cómo funcionan los hitos de Wild West?',
    q_events_roulette: '¿Qué es la Ruleta Bandidos?',
    q_events_bounty: '¿Cómo funciona el Tablero de Recompensas?',
    q_events_prizes: '¿Cuándo se entregan los premios del evento?',
    q_bonus_what: '¿Qué es el Dinero Bonus?',
    q_bonus_earn: '¿Cómo consigo Dinero Bonus gratis?',
    q_bonus_codes: '¿Cómo funcionan los códigos promo?',
    q_bonus_forfeited: '¿Por qué me quitaron el Dinero Bonus?',
    q_app_crash: 'La app sigue cerrando sola',
    q_app_login: 'No puedo iniciar sesión',
    q_app_android: '¿Dónde descargo la app de Android?',
    q_app_requirements: '¿Cuáles son los requisitos del sistema?',
    q_account_verify: '¿Cómo verifico mi cuenta?',
    q_account_password: 'Olvidé mi contraseña',
    q_account_locked: 'Mi cuenta está bloqueada o baneada',
    q_account_multiple: '¿Puedo tener más de una cuenta?',
    q_account_age: '¿Cuál es la edad mínima para jugar?',
  },
  fr: {
    botName: 'Spinny',
    online: 'En ligne',
    connecting: 'Connexion…',
    reconnecting: 'Reconnexion…',
    aiError: 'Problème de connexion. Réessaie ou écris à support@backspingames.com.',
    greeting: 'Salut ! Je suis <b>Spinny</b>, ton assistant support Backspin.',
    greetSub: 'Comment puis-je t\'aider aujourd\'hui ?',
    aiDisclaimer: 'L’IA peut être inexacte. Backspin n’est pas responsable des erreurs générées par l’IA.',
    thinkingTitle: 'Je vérifie ça…',
    thinkingSub: 'Je cherche la meilleure réponse pour toi.',
    articleLabel: 'Article d’aide',
    loadingConversations: 'Chargement des conversations…',
    quickLabel: 'AIDE RAPIDE',
    topicsLabel: 'SUJETS',
    refundTitle: 'Remboursement de Partie',
    refundSub: 'Crash · Gel · Mauvais résultat',
    refundPrompt: 'Je peux t\'aider ! Pour traiter ton remboursement rapidement, décris-moi :\n• Ce qui s\'est passé (crash, gel, mauvais résultat ?)\n• Quand la partie a eu lieu\n• Le montant de la mise\n\nPlus de détails = résolution plus rapide.',
    questionsLabel: 'Quelle est ta question ?',
    notListed: 'Ma question n\'est pas listée',
    somethingElse: 'Autre chose',
    didItHelp: 'Est-ce que ça a répondu à ta question ?',
    yesLabel: '👍 Oui, merci !',
    noLabel: '💬 Pas vraiment',
    placeholder: 'Tape ta question…',
    hardMsg: 'Pas de souci — <b>écris ta question dans tes propres mots</b>. 👇',
    aiFirst: '<b>Dis-moi exactement ce qui se passe</b> et je t\'aide tout de suite. 👇',
    sorryMsg: 'Désolé de ne pas avoir pu résoudre ça complètement. 😔',
    transferOffer: 'Tu veux que je te connecte avec quelqu\'un de notre équipe ?',
    transferYes: '🧑‍💼 Oui, connecte-moi',
    transferNo: '💬 Laisse-moi réessayer',
    packagingMsg: 'Je m\'en occupe ! J\'envoie notre conversation à l\'équipe…',
    ticketMsg: 'C\'est fait ! 🙌 Un agent humain répondra sous <b>24h</b> en semaine (Lun–Ven, 9h–17h Madrid). Autre chose ?',
    retryMsg: 'Bien sûr ! Pose ta question et je réessaie. 👇',
    teamTitle: 'Tu es dans la file !',
    teamSub: 'Ta conversation a été transmise à l\'équipe. Ils te contacteront par email.',
    ticketId: 'N° de Ticket',
    emailSupport: '✉️  Contacter le Support',
    copyEmail: '📋  Copier l\'Email',
    copied: '✅  Copié !',
    escHead: '🧑‍💼 Cela nécessite peut-être notre équipe',
    escSub: 'Ce type de problème est souvent mieux géré par un agent humain qui peut voir ton compte.',
    escHrs: 'Lun–Ven · 9h–17h Madrid',
    backTopics: '← Retour aux sujets',
    thatIsAll: 'C\'est tout, merci !',
    awesomeMsg: '🎯 Super ! Ravi d\'avoir pu aider. Une autre question ?',
    doneFarewell: 'Bonne partie ! 🎯',
    speakHuman: 'Parler à un humain',
    speakHumanSub: 'Support · Lun–Ven, 9h–17h Madrid',
    gotIt: 'Compris !',
    catPrefix: 'questions fréquentes. Laquelle correspond ?',
    catIntro: 'Voici les questions fréquentes pour',
    catSuffix: 'Laquelle correspond ?',
    needsHumanMsg: 'Cela nécessite quelqu\'un de notre équipe pour examiner ton compte directement — je vais te trouver un agent.',
    generatedIn: 'Généré en',
    aiLang: 'Français',
    whatElse: 'Autre chose que je puisse faire ?',
    openTicket: '🎫  Ouvrir un Ticket',
    ticketOpenedTitle: '✅ Ticket Ouvert',
    ticketOpenedSub: 'Notre équipe examinera ton problème et répondra à l\'email de ton compte sous 24h (Lun–Ven).',
    addMoreInfo: '💬 Plus tu donnes de détails, plus vite on peut t\'aider :',
    addedToTicket: '✓ Ajouté à ton ticket',
    ticketUpdated: 'Compris — ajouté à ton ticket. Autre chose à ajouter ?',
    sentToSupport: 'Envoyé au support',
    ticketClosedNotice: 'Ce ticket est fermé. Rouvre-le via le support si tu dois continuer.',
    ticketClosedLabel: 'Fermé par le support',
    ticketWaitingLabel: 'Le support a répondu',
    ticketOpenLabel: 'En attente d’une réponse du support',
    newReplyLabel: 'Nouvelle réponse',
    ticketHiddenNotice: 'Ce ticket a été retiré de ta boîte de support par le support.',
    gameErrorLabel: 'J\'ai eu une erreur dans ma partie',
    gameErrorSub: 'Quel type d\'erreur as-tu rencontré ?',
    errorCrash: '💥 L\'appli a planté',
    errorFreeze: '🥶 Le jeu s\'est figé',
    errorWrongResult: '❌ Mauvais résultat enregistré',
    errorOther: '❓ Autre problème',
    newConversation: '🔄 Démarrer une nouvelle conversation',
    inboxTitle: 'Support Backspin',
    inboxSub: 'Comment pouvons-nous vous aider ?',
    inboxNewBtn: 'Nouvelle conversation',
    inboxSectionOpen: 'Ouvertes',
    inboxSectionClosed: 'Fermées',
    inboxEmpty: 'Aucune conversation pour l\'instant',
    inboxEmptySub: 'Appuyez sur le bouton ci-dessous pour commencer.',
    inboxEmptyHint: 'Sujets populaires',
    badgeOpen: '● Ouvert',
    badgeClosed: 'Fermé',
    resumedTitle: 'Repris',
    cat_deposits: 'Dépôts, Paiements & Retraits',
    cat_withdrawals: 'Retraits',
    cat_matchrefund: 'J\'ai eu une erreur dans ma partie',
    cat_events: 'Événements & Compétitions',
    cat_bonus: 'Bonus Cash & Promos',
    cat_app: 'App & Problèmes Techniques',
    cat_account: 'Mon Compte',
    q_deposits_how: 'Comment faire un dépôt ?',
    q_deposits_methods: 'Quels moyens de paiement sont acceptés ?',
    q_deposits_fee: 'Y a-t-il des frais de dépôt ?',
    q_deposits_declined: 'Mon paiement a été refusé',
    q_withdrawals_how: 'Comment retirer mes gains ?',
    q_withdrawals_time: 'Combien de temps prennent les retraits ?',
    q_withdrawals_info: 'Quelles infos faut-il pour retirer ?',
    q_withdrawals_bonus: 'Que devient mon Bonus Cash quand je retire ?',
    q_withdrawals_missing: 'Mon retrait n\'est pas arrivé',
    q_matchrefund_howrefund: 'Comment demander un remboursement ?',
    q_matchrefund_crash: 'L\'appli a planté pendant une partie',
    q_matchrefund_froze: 'Le jeu s\'est figé et j\'ai perdu ma mise',
    q_matchrefund_wrongresult: 'Le résultat de la partie était mauvais',
    q_matchrefund_refundtime: 'Combien de temps dure un remboursement ?',
    q_events_wildwest: 'C\'est quoi l\'event Wild West ?',
    q_events_milestones: 'Comment fonctionnent les paliers Wild West ?',
    q_events_roulette: 'C\'est quoi la Roulette Bandits ?',
    q_events_bounty: 'Comment fonctionne le Tableau de Primes ?',
    q_events_prizes: 'Quand les prix de l\'event sont-ils remis ?',
    q_bonus_what: 'C\'est quoi le Bonus Cash ?',
    q_bonus_earn: 'Comment gagner du Bonus Cash gratuitement ?',
    q_bonus_codes: 'Comment fonctionnent les codes promo ?',
    q_bonus_forfeited: 'Pourquoi mon Bonus Cash a disparu ?',
    q_app_crash: 'L\'appli plante continuellement',
    q_app_login: 'Je ne peux pas me connecter',
    q_app_android: 'Où télécharger l\'appli Android ?',
    q_app_requirements: 'Quelle est la configuration requise ?',
    q_account_verify: 'Comment vérifier mon compte ?',
    q_account_password: 'J\'ai oublié mon mot de passe',
    q_account_locked: 'Mon compte est bloqué ou banni',
    q_account_multiple: 'Puis-je avoir plusieurs comptes ?',
    q_account_age: 'Quel est l\'âge minimum pour jouer ?',
  }
};

let lang = 'en';
function t(k) { return (S[lang] && S[lang][k]) || S.en[k] || k; }

// ─────────────────────────────────────────────────────────────────
// CONTENT DATABASE
// ─────────────────────────────────────────────────────────────────
const C = {
  deposits: {
    merged_with_withdrawals: true,
    icon:'💳', color:'#5B8AF0', bg:'rgba(91,138,240,0.14)',
    qs:[
      { id:'how',      qKey:'q_deposits_how',
        intro:'Deposit directly in the app:',
        steps:['Open the Backspin app','Go to the <b>Shop</b> screen','Choose an amount or enter your own','Pay with card or Apple / Google Pay','Tap <b>Deposit</b> — funds arrive instantly'],
        note:'💡 Minimum ~$10 · 3% processing fee applies' },
      { id:'methods',  qKey:'q_deposits_methods',
        body:'Backspin accepts:',
        bullets:['Visa, Mastercard, American Express','Apple Pay (iOS)','Google Pay (Android)'],
        note:'💡 All payments are in USD.' },
      { id:'fee',      qKey:'q_deposits_fee',
        body:'A <b>3% processing fee</b> applies to all deposits to cover payment processing.' },
      { id:'declined', qKey:'q_deposits_declined',
        body:'Usually caused by a bank block or wrong details:',
        bullets:['Check your card number, expiry, and CVV','Confirm billing address matches your card','Some banks block gaming platforms — call your bank to allow it','Try a different method (e.g. Apple Pay)'],
        warn:'⚠️ Still failing? Our team can investigate.', escalate:true },
      { id:'withdrawals_how',     qKey:'q_withdrawals_how',
        intro:'Withdrawals go to your bank via international transfer:',
        steps:['Go to your <b>Profile</b> in the app','Tap <b>Withdraw</b>','Enter your IBAN + SWIFT/BIC','Confirm identity if prompted','Submit — processed within 24h on weekdays'],
        warn:'⚠️ Bonus Cash is automatically forfeited on withdrawal.' },
      { id:'withdrawals_time',    qKey:'q_withdrawals_time',
        body:'Processing times:',
        bullets:['<b>Weekdays (Mon–Fri):</b> ~24 hours','<b>Weekends:</b> up to 72 hours'],
        note:'💡 Your bank may add extra time on their end.' },
      { id:'withdrawals_info',    qKey:'q_withdrawals_info',
        body:'You\'ll need:',
        bullets:['IBAN or bank account number','SWIFT/BIC code','Verified Backspin account (required for first withdrawal)'] },
      { id:'withdrawals_bonus',   qKey:'q_withdrawals_bonus',
        body:'<b>Bonus Cash is automatically forfeited.</b> Only real cash is paid out — Bonus Cash is promotional money and cannot be withdrawn.' },
      { id:'withdrawals_missing', qKey:'q_withdrawals_missing',
        body:'If your withdrawal is past the expected window, our team needs to investigate this directly.',
        escalate:true }
    ]
  },
  withdrawals: { _hidden: true,
    icon:'💸', color:'#28E08E', bg:'rgba(40,224,142,0.12)',
    qs:[
      { id:'how',     qKey:'q_withdrawals_how',
        intro:'Withdrawals go to your bank via international transfer:',
        steps:['Go to your <b>Profile</b> in the app','Tap <b>Withdraw</b>','Enter your IBAN + SWIFT/BIC','Confirm identity if prompted','Submit — processed within 24h on weekdays'],
        warn:'⚠️ Bonus Cash is automatically forfeited on withdrawal.' },
      { id:'time',    qKey:'q_withdrawals_time',
        body:'Processing times:',
        bullets:['<b>Weekdays (Mon–Fri):</b> ~24 hours','<b>Weekends:</b> up to 72 hours'],
        note:'💡 Your bank may add extra time on their end.' },
      { id:'info',    qKey:'q_withdrawals_info',
        body:'You\'ll need:',
        bullets:['IBAN or bank account number','SWIFT/BIC code','Verified Backspin account (required for first withdrawal)'] },
      { id:'bonus',   qKey:'q_withdrawals_bonus',
        body:'<b>Bonus Cash is automatically forfeited.</b> Only real cash is paid out — Bonus Cash is promotional money and cannot be withdrawn.' },
      { id:'missing', qKey:'q_withdrawals_missing',
        body:'If your withdrawal is past the expected window, our team needs to investigate this directly.',
        escalate:true }
    ]
  },
  matchrefund: {
    icon:'⚠️', errorFlow: true,
    color:'#FF5F5F', bg:'rgba(255,95,95,0.11)',
    qs:[
      { id:'howrefund',   qKey:'q_matchrefund_howrefund',
        intro:'Report it via In-App Support for the fastest resolution:',
        steps:['Open the app and tap your <b>Profile</b> (top right)','Go to <b>Support → Message</b>','Select topic: <b>Failed Match</b>','Include your Match ID and describe what happened','The team reviews and responds ASAP'],
        note:'💡 The match must have a final result recorded before a refund can be issued.',
        escalate:true },
      { id:'crash',       qKey:'q_matchrefund_crash',
        intro:'Try these steps first:',
        steps:['Force close and reopen the app','Check if a match result was recorded','If no result or wrong result, report it via In-App Support'],
        note:'💡 Include your Match ID when reporting — this speeds up the review.',
        escalate:true },
      { id:'froze',       qKey:'q_matchrefund_froze',
        body:'If the game froze mid-match and you were charged but got no result, this qualifies for review. Contact our team with your Match ID and we\'ll look into it.',
        escalate:true },
      { id:'wrongresult', qKey:'q_matchrefund_wrongresult',
        body:'If you believe the result was incorrectly recorded, our team can review the match logs. Please report via In-App Support with your Match ID and a brief description of what happened.',
        escalate:true },
      { id:'refundtime',  qKey:'q_matchrefund_refundtime',
        body:'Once submitted, match refund reviews typically take <b>1–3 business days</b>. You\'ll be notified via the email on your account when a decision is made.' }
    ]
  },
  events: {
    icon:'🤠', color:'#F0A030', bg:'rgba(240,160,48,0.11)',
    qs:[
      { id:'wildwest',   qKey:'q_events_wildwest',
        intro:'Wild West is the current Major Event — <b>March 9–31, 2026</b>:',
        bullets:['Theme: <b>Sheriffs vs Outlaws</b>','Teams assigned randomly','Earn cups to reach milestone tiers','Each tier unlocks a guaranteed cash prize','Bounty Board challenges add extra rewards'],
        note:'💡 Must be Level 8+ and registered before the event starts.' },
      { id:'milestones', qKey:'q_events_milestones',
        intro:'Each cup tier you reach guarantees a reward:',
        bullets:['🥉 Tier 1 — 1,500 cups → $10 + $15 offer','🥈 Tier 2 — 2,500 cups → $20 + $25 offer','🥇 Tier 3 — 5,000 cups → $50 + $50 offer','⭐ Tier 4 — 10,000 cups → $100 + $100 + Roulette','🌟 Tier 5 — 30,000 cups → $200 + $200 + Roulette','💫 Tier 6 — 70,000 cups → $300 + $300 + Roulette','🏆 Tier 7 — 130,000 cups → MacBook + Roulette'],
        note:'💡 Milestones stack — you earn a reward for every tier you reach.' },
      { id:'roulette',   qKey:'q_events_roulette',
        intro:'A bonus prize raffle for Tier 4+ players:',
        bullets:['3 players per eligible tier selected by raffle','Each gets 1 spin — max prize $7,500','Scheduled for April 2, 2026'] },
      { id:'bounty',     qKey:'q_events_bounty',
        intro:'Earn extra by defeating bounty targets:',
        bullets:['<b>Win vs bounty:</b> 10% of entry fee returned','<b>Lose vs bounty:</b> 5% still returned','Submit a screenshot of your eligible match'] },
      { id:'prizes',     qKey:'q_events_prizes',
        body:'Up to <b>60 days</b> after the event ends. Bonus Cash prizes are faster; physical prizes (like the MacBook) may take longer due to shipping.' }
    ]
  },
  bonus: {
    icon:'🎁', color:'#A87FFF', bg:'rgba(168,127,255,0.12)',
    qs:[
      { id:'what',      qKey:'q_bonus_what',
        intro:'<b>Bonus Cash</b> is promotional money for entering games:',
        bullets:['Covers ~10% of entry fees','<b>Cannot be withdrawn</b> under any circumstances','Forfeited automatically when you withdraw','Earned through promos, events, and rewards'] },
      { id:'earn',      qKey:'q_bonus_earn',
        intro:'Several ways to earn for free:',
        bullets:['⭐ Leave an App Store or Play Store review','👥 Refer friends — earn when they win','🎬 Join the Creator Program','📺 Watch live on YouTube / Kick for stream codes','📢 Discord announcements and event giveaways'] },
      { id:'codes',     qKey:'q_bonus_codes',
        intro:'Codes are shared live on stream or in Discord:',
        bullets:['Watch YouTube or Kick live — some codes are stream-only','Check Discord announcements for posted codes','<b>Codes expire 24 hours</b> after posting','Enter codes in the Shop or Promo section'],
        note:'💡 Follow Backspin on YouTube and Kick to never miss one.' },
      { id:'forfeited', qKey:'q_bonus_forfeited',
        body:'Bonus Cash is <b>automatically forfeited when you withdraw</b>. This is by design — only your real cash balance is paid out.' }
    ]
  },
  app: { _hidden: true,
    icon:'📱', color:'#FF7D7D', bg:'rgba(255,125,125,0.11)',
    qs:[
      { id:'crash',        qKey:'q_app_crash',
        intro:'Try these steps in order:',
        steps:['Force close the app completely','Restart your device','Update to the latest version','Clear cache (Android: Settings → App → Clear Cache)','Reinstall if the issue persists'],
        note:'💡 Crash mid-match? Use the Match Refund category.',
        escalate:true },
      { id:'login',        qKey:'q_app_login',
        body:'Most login issues are connection or password related:',
        bullets:['Check your internet connection','Verify your email and password are correct','Tap <b>Forgot Password</b> on the login screen','Check spam folder for the reset email','Reinstall the app if nothing else works'] },
      { id:'android',      qKey:'q_app_android',
        body:'Download directly from our link:',
        link:{ label:'⬇️  Download for Android', url:'https://backspingames.onelink.me/NiHh/q34momex' },
        note:'💡 Also on the iOS App Store — search Backspin Games.' },
      { id:'requirements', qKey:'q_app_requirements',
        bullets:['<b>iOS:</b> 12.0 or later','<b>Android:</b> 6.0 or later','<b>Storage:</b> 100 MB free','<b>Internet:</b> Stable connection required','<b>RAM:</b> 2 GB or more recommended'] }
    ]
  },
  account: {
    icon:'👤', color:'#4ECDC4', bg:'rgba(78,205,196,0.11)',
    qs:[
      { id:'verify',   qKey:'q_account_verify',
        intro:'Required before your first withdrawal:',
        bullets:['You\'ll be prompted automatically in the app','A valid government-issued ID is required','Some accounts need a <b>verification call</b>','Contact support below to schedule a call'],
        escalate:true },
      { id:'password', qKey:'q_account_password',
        intro:'Reset it quickly:',
        steps:['Open Backspin and tap <b>Forgot Password</b>','Enter your account email','Check inbox (and spam) for the reset link','Tap the link and set a new password'] },
      { id:'locked',   qKey:'q_account_locked',
        body:'Account issues are handled directly by our team. Please reach out with your username and email.',
        escalate:true },
      { id:'multiple', qKey:'q_account_multiple',
        body:'<b>No</b> — one account per person only. Multiple accounts violate our Terms and can result in a <b>permanent ban on all accounts</b>.' },
      { id:'age',      qKey:'q_account_age',
        body:'You must be <b>18 or older</b>. Age verification is strictly enforced with no exceptions.' }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────
// SOCKET.IO + HTTP FALLBACK
// ─────────────────────────────────────────────────────────────────
let sockReady   = false;
let pendingAI   = false;
let activeTyping = null;
let aiTimeout   = null;
let sessionId   = 'ws-' + Math.random().toString(36).slice(2, 10);
let clientId = '';
let supportIdentity = readSupportIdentityFromUrl();
let supportAuthReady = false;

const sock = io(_serverUrl, { transports: ['websocket', 'polling'], reconnectionAttempts: 5 });

function updateConnStatus(state) {
  const dot = document.getElementById('status-dot');
  const txt = document.getElementById('status-text');
  if (!dot || !txt) return;
  dot.className = 'status-dot ' + state;
  txt.className = 'status-text ' + state;
  txt.textContent = state === 'online'  ? t('online')
                  : state === 'offline' ? t('reconnecting')
                  : t('connecting');
}

sock.on('connect',       () => {
  sockReady = true;
  updateConnStatus('online');
  if (supportAuthReady) {
    sock.emit('support:client:subscribe', {
      playerId: clientId,
      username: supportIdentity.username,
      supportToken: supportIdentity.supportToken,
    });
  }
  if (activeTicketId) sock.emit('support:ticket:join', { ticketId: activeTicketId });
});
sock.on('disconnect',    () => { sockReady = false; updateConnStatus('offline'); });
sock.on('connect_error', () => { sockReady = false; updateConnStatus('error');   });

sock.on('support:chat:response', result => {
  if (aiTimeout) { clearTimeout(aiTimeout); aiTimeout = null; }
  pendingAI = false;
  removeTyping();
  handleAIResponse(result);
});

sock.on('support:ticket:summary', payload => {
  const ticket = payload?.ticket;
  if (!ticket) return;
  upsertConversation(ticket);
  if (ticket.id === activeTicketId) {
    setTicketComposerState(ticket);
    appendTicketStateNote(ticket.status);
  }
  if (!document.getElementById('inbox-screen')?.classList.contains('hidden')) renderInboxList();
});

sock.on('support:ticket:message', payload => {
  const ticket = payload?.ticket;
  const message = payload?.message;
  if (ticket) upsertConversation(ticket);
  if (!message || seenTicketMessageIds.has(message.id)) return;
  seenTicketMessageIds.add(message.id);
  const isActiveTicketOpen = payload.ticketId === activeTicketId && !chatScreen.classList.contains('hidden');

  if (message.senderType === 'agent' && !isActiveTicketOpen) {
    markUnread(payload.ticketId);
    if (!document.getElementById('inbox-screen')?.classList.contains('hidden')) renderInboxList();
    return;
  }

  if (!isActiveTicketOpen) return;
  clearUnread(payload.ticketId);
  if (ticket) setTicketComposerState(ticket);
  if (message.senderType === 'agent') {
    staffBubble(message.text, message.authorName || 'Backspin Support', { persist: true });
    unlockInput();
    inputLocked = false;
  }
  appendTicketStateNote(ticket?.status);
});

sock.on('support:ticket:hidden', payload => {
  const ticketId = payload?.ticketId;
  if (!ticketId) return;
  if (payload?.reason === 'archived_by_support') {
    const existing = conversations.find(ticket => ticket.id === ticketId) || { id: ticketId };
    const archivedTicket = { ...existing, status: 'closed', archived: true };
    upsertConversation(archivedTicket);
    clearUnread(ticketId);
    if (ticketId === activeTicketId) {
      setTicketComposerState(archivedTicket);
      appendTicketStateNote('closed');
      showSupportToast(t('ticketClosedNotice'), 'info');
    }
    if (!document.getElementById('inbox-screen')?.classList.contains('hidden')) renderInboxList();
    return;
  }
  handleHiddenTicket(ticketId);
});

sock.on('support:ticket:archived', payload => {
  const ticket = payload?.ticket;
  if (!ticket?.id) return;
  upsertConversation({ ...ticket, status: 'closed', archived: true });
  clearUnread(ticket.id);
  if (ticket.id === activeTicketId) {
    setTicketComposerState({ ...ticket, status: 'closed' });
    appendTicketStateNote('closed');
    showSupportToast(t('ticketClosedNotice'), 'info');
  }
  if (!document.getElementById('inbox-screen')?.classList.contains('hidden')) renderInboxList();
});

sock.on('support:ticket:restored', payload => {
  const ticket = payload?.ticket;
  if (!ticket?.id) return;
  upsertConversation(ticket);
  if (!document.getElementById('inbox-screen')?.classList.contains('hidden')) renderInboxList();
});

async function callAI(text) {
  const historySlice = conversationHistory.slice(-10).slice(0, -1);
  const payload = { message: text, history: historySlice, sessionId, userLang: lang, ...getSupportAuthPayload() };

  if (sockReady) {
    sock.emit('support:chat', payload);
    aiTimeout = setTimeout(() => {
      if (pendingAI) {
        pendingAI = false;
        removeTyping();
        showErrBubble(t('aiError'));
        unlockInput();
        inputLocked = false;
      }
    }, 15000);
  } else {
    try {
      const res = await fetch(`${_serverUrl}/api/support/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory: historySlice, sessionId, userLang: lang, ...getSupportAuthPayload() })
      });
      const result = await res.json();
      pendingAI = false;
      removeTyping();
      handleAIResponse(result);
    } catch (err) {
      pendingAI = false;
      removeTyping();
      showErrBubble(t('aiError'));
      unlockInput();
      inputLocked = false;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────
let stage = 1;
let noCount = 0;
let chatLog = [];
let conversationHistory = [];
let inputLocked = false;
let activeTicketId = null;
let ticketMessages = [];
let pendingMatchId = false;
let pendingMatchCat = null;
let pendingTicketCategory = 'general';
let activeDraftKey = 'new';
let unreadState = {};
let ticketComposerLocked = false;
const MAX_LEN = 500;
const DRAFTS_KEY = 'bsp_support_drafts';
let draftStore = {};
let inboxRenderToken = 0;
const seenTicketMessageIds = new Set();

function sanitizeClientMessage(text) {
  return String(text || '')
    .replace(/\u0000/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{3,}/g, '  ')
    .trim()
    .slice(0, MAX_LEN);
}

// ─────────────────────────────────────────────────────────────────
// DOM HELPERS
// ─────────────────────────────────────────────────────────────────
const feed     = document.getElementById('feed');
const inputBar = document.getElementById('input-bar');
const msgInput = document.getElementById('msg-input');
const sendBtn  = document.getElementById('send-btn');
const charCount = document.getElementById('char-count');
const toastStack = document.getElementById('support-toast-stack');

function getSupportAuthPayload() {
  return {
    username: supportIdentity.username,
    playerId: clientId,
    supportToken: supportIdentity.supportToken,
  };
}

function appendSupportAuthParams(path) {
  const url = new URL(`${_serverUrl}/api/support${path}`);
  if (supportIdentity.username && !url.searchParams.has('username')) url.searchParams.set('username', supportIdentity.username);
  if (clientId && !url.searchParams.has('playerId')) url.searchParams.set('playerId', clientId);
  if (supportIdentity.supportToken && !url.searchParams.has('supportToken')) url.searchParams.set('supportToken', supportIdentity.supportToken);
  return url.toString();
}

function setSupportAccessLocked(locked, reason = '') {
  supportAuthReady = !locked;
  ticketComposerLocked = locked;
  inputLocked = locked;
  msgInput.disabled = locked;
  sendBtn.disabled = locked;
  if (reason) showSupportToast(reason, 'error');
}

function applyPlayerIdentityToUi() {
  const inboxSubEl = document.getElementById('inbox-sub');
  if (inboxSubEl && supportIdentity.username) {
    inboxSubEl.textContent = `Welcome, ${supportIdentity.username}! · ${t('inboxSub')}`;
  }
}

async function ensurePlayerIdentity() {
  supportIdentity = readSupportIdentityFromUrl();
  clientId = supportIdentity.playerId;
  if (!supportIdentity.username || !clientId) {
    setSupportAccessLocked(true, 'Open support from the Backspin app so we can verify your username.');
    throw new Error('Player authentication required');
  }

  const data = await fetch(appendSupportAuthParams('/auth/player'))
    .then(res => res.json().then(body => ({ ok: res.ok, body })))
    .catch(() => ({ ok: false, body: { error: 'Player authentication required' } }));

  if (!data.ok || data.body?.ok === false || !data.body?.player?.playerId) {
    setSupportAccessLocked(true, data.body?.error || 'Player authentication required');
    throw new Error(data.body?.error || 'Player authentication required');
  }

  supportIdentity = {
    username: data.body.player.username,
    playerId: data.body.player.playerId,
    supportToken: supportIdentity.supportToken,
  };
  clientId = supportIdentity.playerId;
  supportAuthReady = true;
  inputLocked = false;
  ticketComposerLocked = false;
  msgInput.disabled = false;
  applyPlayerIdentityToUi();
}

function loadDraftStore() {
  try { draftStore = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}'); }
  catch (_) { draftStore = {}; }
}

function saveDraftStore() {
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(draftStore)); } catch (_) {}
}

function loadUnreadState() {
  try { unreadState = JSON.parse(localStorage.getItem(SUPPORT_UNREAD_KEY) || '{}'); }
  catch (_) { unreadState = {}; }
}

function saveUnreadState() {
  try { localStorage.setItem(SUPPORT_UNREAD_KEY, JSON.stringify(unreadState)); } catch (_) {}
}

function getUnreadCount(ticketId) {
  return Number(unreadState[ticketId] || 0);
}

function markUnread(ticketId) {
  if (!ticketId) return;
  unreadState[ticketId] = getUnreadCount(ticketId) + 1;
  saveUnreadState();
}

function clearUnread(ticketId) {
  if (!ticketId) return;
  delete unreadState[ticketId];
  saveUnreadState();
}

function showSupportToast(message, type = 'info') {
  if (!toastStack || !message) return;
  const toast = document.createElement('div');
  toast.className = `support-toast ${type}`;
  toast.textContent = message;
  toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function removeConversation(ticketId) {
  conversations = conversations.filter(ticket => ticket.id !== ticketId);
  clearUnread(ticketId);
}

function handleHiddenTicket(ticketId) {
  const wasActive = activeTicketId === ticketId;
  removeConversation(ticketId);
  if (wasActive) {
    leaveTicketRoom();
    clearDraft('ticket:' + ticketId);
    activeTicketId = null;
    ticketMessages = [];
    ticketComposerLocked = false;
    setActiveDraftKey('new');
    feed.innerHTML = '';
    showInbox();
  } else if (!document.getElementById('inbox-screen')?.classList.contains('hidden')) {
    renderInboxList();
  }
  showSupportToast(t('ticketHiddenNotice'), 'info');
}

function getDraftStorageKey(key = activeDraftKey) {
  return `draft:${key || 'new'}`;
}

function setActiveDraftKey(key) {
  activeDraftKey = key || 'new';
}

function persistDraft(key = activeDraftKey) {
  const storageKey = getDraftStorageKey(key);
  const value = String(msgInput.value || '').slice(0, MAX_LEN);
  if (value.trim()) draftStore[storageKey] = value;
  else delete draftStore[storageKey];
  saveDraftStore();
}

function clearDraft(key = activeDraftKey) {
  delete draftStore[getDraftStorageKey(key)];
  saveDraftStore();
}

function migrateDraft(fromKey, toKey) {
  const fromStorageKey = getDraftStorageKey(fromKey);
  const toStorageKey = getDraftStorageKey(toKey);
  if (!draftStore[fromStorageKey] || fromStorageKey === toStorageKey) return;
  draftStore[toStorageKey] = draftStore[fromStorageKey];
  delete draftStore[fromStorageKey];
  saveDraftStore();
}

function syncComposerState() {
  msgInput.style.height = 'auto';
  msgInput.style.height = '48px';
  const len = msgInput.value.length;
  if (len > 400) {
    charCount.textContent = `${len}/${MAX_LEN}`;
    charCount.className = len > MAX_LEN ? 'over visible' : 'warn visible';
  } else {
    charCount.className = '';
    charCount.textContent = '';
  }
  validateInput();
}

function restoreDraft(key = activeDraftKey) {
  msgInput.value = draftStore[getDraftStorageKey(key)] || '';
  syncComposerState();
}

function setTicketComposerState(ticket) {
  const isClosed = ticket?.status === 'closed';
  ticketComposerLocked = isClosed;
  inputBar.classList.toggle('ticket-closed', isClosed);
  msgInput.disabled = isClosed;
  msgInput.placeholder = isClosed ? t('ticketClosedNotice') : t('placeholder');
  if (isClosed) {
    msgInput.value = '';
    clearDraft();
    sendBtn.disabled = true;
  } else {
    syncComposerState();
  }
}

function triggerHaptic(style = 'selection') {
  try {
    if (window.ReactNativeWebView?.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'haptic', style }));
    }
  } catch (_) {}

  try {
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage(style);
    } else if (window.webkit?.messageHandlers?.haptics) {
      window.webkit.messageHandlers.haptics.postMessage({ style });
    }
  } catch (_) {}

  try {
    if (navigator.vibrate) {
      const pattern = style === 'success' ? [12, 24, 14] : style === 'warning' ? [18] : [8];
      navigator.vibrate(pattern);
    }
  } catch (_) {}
}

function isInteractiveDisabled(el) {
  return !el
    || el.disabled
    || el.getAttribute('aria-disabled') === 'true'
    || el.classList.contains('disabled')
    || el.classList.contains('is-locked');
}

function clearTapFeedback() {
  document.querySelectorAll('.tap-pressed').forEach(el => el.classList.remove('tap-pressed'));
}

const INTERACTIVE_SELECTOR = '.chip, .ebtn, .inbox-fab, .lang-btn, #send-btn, #hdr-back, .convo-card, .ans-link';

document.addEventListener('pointerdown', e => {
  const target = e.target.closest(INTERACTIVE_SELECTOR);
  if (!target || isInteractiveDisabled(target)) return;
  target.classList.add('tap-pressed');
}, true);

['pointerup', 'pointercancel', 'scroll'].forEach(evt => {
  document.addEventListener(evt, clearTapFeedback, true);
});

document.addEventListener('click', e => {
  const target = e.target.closest(INTERACTIVE_SELECTOR);
  if (!target || isInteractiveDisabled(target)) return;
  triggerHaptic(target.matches('#send-btn, .inbox-fab, .ebtn-p') ? 'impactLight' : 'selection');
}, true);

window.addEventListener('pagehide', () => persistDraft());

function scrollBottom() {
  requestAnimationFrame(() => feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' }));
}

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function plainText(s) {
  return String(s || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n\s+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function appendChatEntry(role, text, meta = {}) {
  const clean = plainText(text);
  if (!clean) return null;
  const entry = {
    role,
    text: clean,
    sourceKind: meta.sourceKind || (role === 'bot' ? 'spinny_default' : role === 'agent' ? 'staff' : 'typed'),
    authorName: meta.authorName || '',
  };
  chatLog.push(entry);
  return entry;
}

function normalizeConversationMessages(messages, messageObjects) {
  const hasStructuredObjects = Array.isArray(messageObjects)
    && messageObjects.length
    && messageObjects.some(m => m && typeof m === 'object' && (m.role || m.text || m.content));

  let result;
  if (hasStructuredObjects) {
    result = messageObjects
      .map(m => ({
        role: m.role === 'assistant' ? 'bot' : (m.role || 'user'),
        text: plainText(m.text || m.content || ''),
        authorName: m.authorName || '',
        senderType: m.senderType || '',
        sourceKind: m.sourceKind || ''
      }))
      .filter(m => m.text);
  } else {
    result = (Array.isArray(messages) ? messages : [])
      .map(m => {
        if (m && typeof m === 'object') {
          return {
            role: m.role === 'assistant' ? 'bot' : (m.role || 'user'),
            text: plainText(m.text || m.content || ''),
            authorName: m.authorName || '',
            senderType: m.senderType || '',
            sourceKind: m.sourceKind || ''
          };
        }
        return { role: 'user', text: plainText(m), authorName: '', senderType: '', sourceKind: 'typed' };
      })
      .filter(m => m.text);
  }

  // Deduplicate consecutive messages with identical role+text.
  // This cleans up tickets created before a bug that stored each message twice.
  return result.filter((m, i) => {
    if (i === 0) return true;
    const prev = result[i - 1];
    return !(prev.role === m.role && prev.text === m.text);
  });
}

function buildTicketTranscript() {
  return chatLog.map(m => ({ role: m.role, text: m.text, authorName: m.authorName || '', sourceKind: m.sourceKind || '' }));
}

function getConversationSubject(messages) {
  const transcript = Array.isArray(messages) ? messages : [];
  const firstUser = transcript.find(m => m.role === 'user' && m.text && !/^👍|^💬|^←|^🔄/.test(m.text));
  return firstUser?.text || 'Support Request';
}

function spinnyAvatarMarkup(sizeClass = '') {
  const cls = sizeClass ? ` brand-logo ${sizeClass}` : 'brand-logo';
  return `<img class="${cls}" src="logo.webp" alt="" />`;
}

function botBubble(html, showAv = true, i18nKey = null, extraData = null, options = {}) {
  const row = document.createElement('div');
  row.className = 'row bot';
  const i18nAttr = i18nKey ? ` data-i18n="${i18nKey}"` : '';
  let extraAttrs = '';
  if (extraData) {
    for (const [k, v] of Object.entries(extraData)) {
      extraAttrs += ` data-${k}="${v}"`;
    }
  }
  row.innerHTML = `<div class="row-av${showAv ? '' : ' hidden'}">${spinnyAvatarMarkup()}</div><div class="bubble"${i18nAttr}${extraAttrs}>${html}</div>`;
  feed.appendChild(row);
  if (options.persist !== false) appendChatEntry('bot', options.logText || html, { sourceKind: options.sourceKind || 'spinny_default' });
  scrollBottom();
  return row;
}

function userBubble(text, options = {}) {
  const row = document.createElement('div');
  row.className = 'row user';
  row.innerHTML = `<div class="bubble">${esc(text)}</div>`;
  feed.appendChild(row);
  if (options.persist !== false) appendChatEntry('user', options.logText || text, { sourceKind: options.sourceKind || 'typed' });
  scrollBottom();
  return row;
}

function staffBubble(text, authorName = 'Backspin Support', options = {}) {
  const row = document.createElement('div');
  row.className = 'row bot staff-row';
  row.innerHTML = `<div class="row-av">${spinnyAvatarMarkup()}</div><div class="bubble staff-bubble"><div class="staff-label">${esc(authorName)}</div>${esc(text).replace(/\n/g, '<br>')}</div>`;
  feed.appendChild(row);
  if (options.persist !== false) appendChatEntry('agent', options.logText || text, { sourceKind: options.sourceKind || 'staff', authorName });
  scrollBottom();
  return row;
}

function showTyping() {
  const row = document.createElement('div');
  row.className = 'row bot typing-row';
  row.innerHTML = `<div class="row-av">${spinnyAvatarMarkup()}</div><div class="typing-card"><div class="typing-card-head"><span class="typing-ping"></span>${esc(t('thinkingTitle'))}</div><div class="typing-card-sub">${esc(t('thinkingSub'))}</div><div class="typing-bubble"><span></span><span></span><span></span></div></div>`;
  feed.appendChild(row);
  scrollBottom();
  activeTyping = row;
  return row;
}

function removeTyping() {
  if (activeTyping && activeTyping.parentNode === feed) feed.removeChild(activeTyping);
  activeTyping = null;
}

function showErrBubble(msg) {
  triggerHaptic('warning');
  const w = document.createElement('div');
  w.className = 'err-row';
  w.innerHTML = `<div class="err-bubble">⚡ ${esc(msg)}</div>`;
  feed.appendChild(w);
  scrollBottom();
}

function chipsRow(items) {
  const wrap = document.createElement('div');
  wrap.className = 'chips-wrap';
  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (item.cls ? ' ' + item.cls : '');
    if (item.i18nKey) {
      btn.dataset.i18nKey = item.i18nKey;
      if (item.emoji) btn.dataset.i18nEmoji = item.emoji;
    }
    btn.innerHTML = item.emoji
      ? `<span class="chip-icon">${item.emoji}</span><span class="chip-label">${esc(item.label)}</span>`
      : `<span class="chip-label">${esc(item.label)}</span>`;
    if (item.data) {
      Object.assign(btn.dataset, item.data);
      if (item.data.qkey) btn.dataset.qkey = item.data.qkey;
    }
    btn.addEventListener('click', () => handleChip(btn, wrap));
    wrap.appendChild(btn);
  });
  feed.appendChild(wrap);
  scrollBottom();
  return wrap;
}

function disableChips(wrap) {
  if (!wrap) return;
  wrap.querySelectorAll('.chip').forEach(b => {
    b.classList.add('disabled');
    b.disabled = true;
    b.setAttribute('aria-disabled', 'true');
  });
}

function showInputBar() {
  inputBar.classList.add('visible');
  restoreDraft();
  setTimeout(() => {
    msgInput.placeholder = t('placeholder');
    if (ticketComposerLocked) {
      setTicketComposerState({ status: 'closed' });
      return;
    }
    msgInput.focus();
    const end = msgInput.value.length;
    msgInput.setSelectionRange(end, end);
  }, 80);
}
function hideInputBar() {
  persistDraft();
  inputBar.classList.remove('visible');
  msgInput.blur();
}
function lockInput()    { sendBtn.disabled = true; msgInput.readOnly = true; }
function unlockInput()  {
  if (ticketComposerLocked) {
    setTicketComposerState({ status: 'closed' });
    return;
  }
  msgInput.readOnly = false;
  msgInput.disabled = false;
  syncComposerState();
  msgInput.focus();
}
function validateInput(){ sendBtn.disabled = ticketComposerLocked || msgInput.value.trim().length === 0 || msgInput.value.length > MAX_LEN; }

// ─────────────────────────────────────────────────────────────────
// FAQ ANSWER TRANSLATIONS  (ES / FR overrides — EN lives in C)
// ─────────────────────────────────────────────────────────────────
const ANS = {
  es: {
    deposits_how:            { intro:'Deposita directamente en la app:', steps:['Abre la app de Backspin','Ve a la pantalla de <b>Tienda</b>','Elige un monto o ingresa el tuyo','Paga con tarjeta o Apple / Google Pay','Toca <b>Depositar</b> — los fondos llegan al instante'], note:'💡 Mínimo ~$10 · Se aplica una comisión de procesamiento del 3%' },
    deposits_methods:        { body:'Backspin acepta:', bullets:['Visa, Mastercard, American Express','Apple Pay (iOS)','Google Pay (Android)'], note:'💡 Todos los pagos son en USD.' },
    deposits_fee:            { body:'Se aplica una <b>comisión de procesamiento del 3%</b> a todos los depósitos para cubrir los costos de procesamiento.' },
    deposits_declined:       { body:'Suele ser causado por un bloqueo bancario o datos incorrectos:', bullets:['Revisa el número de tarjeta, fecha de vencimiento y CVV','Confirma que la dirección de facturación coincide con tu tarjeta','Algunos bancos bloquean plataformas de juego — llama a tu banco para permitirlo','Prueba otro método (p. ej. Apple Pay)'], warn:'⚠️ ¿Sigue fallando? Nuestro equipo puede investigar.' },
    withdrawals_how:         { intro:'Los retiros van a tu banco mediante transferencia internacional:', steps:['Ve a tu <b>Perfil</b> en la app','Toca <b>Retirar</b>','Ingresa tu IBAN + SWIFT/BIC','Confirma tu identidad si se te solicita','Envía — procesado en 24h en días hábiles'], warn:'⚠️ El Bono en Efectivo se pierde automáticamente al retirar.' },
    withdrawals_time:        { body:'Tiempos de procesamiento:', bullets:['<b>Días hábiles (Lun–Vie):</b> ~24 horas','<b>Fines de semana:</b> hasta 72 horas'], note:'💡 Tu banco puede añadir tiempo adicional por su parte.' },
    withdrawals_info:        { body:'Necesitarás:', bullets:['IBAN o número de cuenta bancaria','Código SWIFT/BIC','Cuenta Backspin verificada (requerida para el primer retiro)'] },
    withdrawals_bonus:       { body:'<b>El Bono en Efectivo se pierde automáticamente.</b> Solo se paga el dinero real — el Bono en Efectivo es dinero promocional y no puede retirarse.' },
    withdrawals_missing:     { body:'Si tu retiro supera el plazo esperado, nuestro equipo necesita investigar directamente.' },
    matchrefund_howrefund:   { intro:'Repórtalo a través del Soporte In-App para la resolución más rápida:', steps:['Abre la app y toca tu <b>Perfil</b> (arriba a la derecha)','Ve a <b>Soporte → Mensaje</b>','Selecciona el tema: <b>Partida Fallida</b>','Incluye tu ID de Partida y describe lo que ocurrió','El equipo revisa y responde lo antes posible'], note:'💡 La partida debe tener un resultado final registrado antes de emitir el reembolso.' },
    matchrefund_crash:       { intro:'Prueba estos pasos primero:', steps:['Cierra y vuelve a abrir la app','Verifica si se registró un resultado de partida','Si no hay resultado o es incorrecto, repórtalo a través del Soporte In-App'], note:'💡 Incluye tu ID de Partida al reportar — esto acelera la revisión.' },
    matchrefund_froze:       { body:'Si el juego se congeló en mitad de la partida y se te cobró pero no obtuviste resultado, esto califica para revisión.' },
    matchrefund_wrongresult: { body:'Si crees que el resultado fue registrado incorrectamente, nuestro equipo puede revisar los registros.' },
    matchrefund_refundtime:  { body:'Una vez enviado, las revisiones suelen tardar <b>1–3 días hábiles</b>.' },
    events_wildwest:         { intro:'Wild West es el Evento Principal actual — <b>9–31 de marzo de 2026</b>:', bullets:['Tema: <b>Sheriffs vs Forajidos</b>','Equipos asignados aleatoriamente','Gana copas para alcanzar niveles de hito','Cada nivel desbloquea un premio en efectivo garantizado','Los desafíos del Tablón de Recompensas añaden premios extra'], note:'💡 Se requiere ser Nivel 8+ y registrarse antes de que empiece el evento.' },
    events_milestones:       { intro:'Cada nivel de copa que alcances garantiza una recompensa:', bullets:['🥉 Nivel 1 — 1.500 copas → $10 + oferta de $15','🥈 Nivel 2 — 2.500 copas → $20 + oferta de $25','🥇 Nivel 3 — 5.000 copas → $50 + oferta de $50','⭐ Nivel 4 — 10.000 copas → $100 + $100 + Ruleta','🌟 Nivel 5 — 30.000 copas → $200 + $200 + Ruleta','💫 Nivel 6 — 70.000 copas → $300 + $300 + Ruleta','🏆 Nivel 7 — 130.000 copas → MacBook + Ruleta'], note:'💡 Los hitos se acumulan.' },
    events_roulette:         { intro:'Un sorteo de premio extra para jugadores de Nivel 4+:', bullets:['3 jugadores por nivel elegible seleccionados por sorteo','Cada uno recibe 1 giro — premio máximo $7.500','Programado para el 2 de abril de 2026'] },
    events_bounty:           { intro:'Gana extra derrotando a los objetivos de recompensa:', bullets:['<b>Ganas vs recompensa:</b> se devuelve el 10% de la entrada','<b>Pierdes vs recompensa:</b> se devuelve el 5% igualmente','Envía una captura de pantalla de tu partida elegible'] },
    events_prizes:           { body:'Hasta <b>60 días</b> después de que termine el evento.' },
    bonus_what:              { intro:'<b>El Bono en Efectivo</b> es dinero promocional para participar en partidas:', bullets:['Cubre ~10% de las tarifas de entrada','<b>No puede retirarse</b> bajo ninguna circunstancia','Se pierde automáticamente al retirar','Se obtiene a través de promos, eventos y recompensas'] },
    bonus_earn:              { intro:'Varias formas de ganar gratis:', bullets:['⭐ Deja una reseña en App Store o Play Store','👥 Refiere amigos — gana cuando ellos ganen','🎬 Únete al Programa de Creadores','📺 Mira en directo en YouTube / Kick para obtener códigos','📢 Anuncios y sorteos de Discord y eventos'] },
    bonus_codes:             { intro:'Los códigos se comparten en directo en stream o en Discord:', bullets:['Mira YouTube o Kick en directo — algunos códigos son exclusivos del stream','Consulta los anuncios de Discord para códigos publicados','<b>Los códigos expiran 24 horas</b> después de publicarse','Ingresa los códigos en la sección de Tienda o Promos'], note:'💡 Sigue a Backspin en YouTube y Kick.' },
    bonus_forfeited:         { body:'El Bono en Efectivo <b>se pierde automáticamente al retirar</b>.' },
    app_crash:               { intro:'Prueba estos pasos en orden:', steps:['Cierra la app completamente','Reinicia tu dispositivo','Actualiza a la última versión','Limpia la caché (Android: Ajustes → App → Limpiar Caché)','Reinstala si el problema persiste'], note:'💡 ¿Crash en mitad de una partida? Usa la categoría de Reembolso de Partida.' },
    app_login:               { body:'La mayoría de los problemas de inicio de sesión son de conexión o contraseña:', bullets:['Verifica tu conexión a internet','Comprueba que el correo y la contraseña sean correctos','Toca <b>Olvidé mi Contraseña</b> en la pantalla de inicio','Revisa la carpeta de spam para el correo de restablecimiento','Reinstala la app si nada más funciona'] },
    app_android:             { body:'Descarga directamente desde nuestro enlace:', note:'💡 También en la App Store de iOS.' },
    app_requirements:        { bullets:['<b>iOS:</b> 12.0 o posterior','<b>Android:</b> 6.0 o posterior','<b>Almacenamiento:</b> 100 MB libres','<b>Internet:</b> Conexión estable requerida','<b>RAM:</b> 2 GB o más recomendados'] },
    account_verify:          { intro:'Requerido antes del primer retiro:', bullets:['Se te pedirá automáticamente en la app','Se requiere un ID de gobierno válido','Algunas cuentas necesitan una <b>llamada de verificación</b>','Contacta con soporte a continuación'] },
    account_password:        { intro:'Restablécela rápidamente:', steps:['Abre Backspin y toca <b>Olvidé mi Contraseña</b>','Introduce tu correo electrónico de la cuenta','Revisa la bandeja de entrada (y spam) para el enlace','Toca el enlace y establece una nueva contraseña'] },
    account_locked:          { body:'Los problemas de cuenta son manejados directamente por nuestro equipo.' },
    account_multiple:        { body:'<b>No</b> — una cuenta por persona únicamente.' },
    account_age:             { body:'Debes tener <b>18 años o más</b>.' }
  },
  fr: {
    deposits_how:            { intro:'Déposez directement dans l\'application :', steps:['Ouvrez l\'application Backspin','Allez à l\'écran <b>Boutique</b>','Choisissez un montant ou entrez le vôtre','Payez par carte ou Apple / Google Pay','Appuyez sur <b>Déposer</b> — les fonds arrivent instantanément'], note:'💡 Minimum ~10 $ · Des frais de traitement de 3 % s\'appliquent' },
    deposits_methods:        { body:'Backspin accepte :', bullets:['Visa, Mastercard, American Express','Apple Pay (iOS)','Google Pay (Android)'], note:'💡 Tous les paiements sont en USD.' },
    deposits_fee:            { body:'Des <b>frais de traitement de 3 %</b> s\'appliquent à tous les dépôts.' },
    deposits_declined:       { body:'Généralement causé par un blocage bancaire :', bullets:['Vérifiez le numéro de carte, la date d\'expiration et le CVV','Confirmez que l\'adresse de facturation correspond à votre carte','Certaines banques bloquent les plateformes de jeu — appelez votre banque','Essayez une autre méthode (ex. Apple Pay)'], warn:'⚠️ Toujours en échec ? Notre équipe peut enquêter.' },
    withdrawals_how:         { intro:'Les retraits vont à votre banque via virement international :', steps:['Allez à votre <b>Profil</b> dans l\'application','Appuyez sur <b>Retirer</b>','Entrez votre IBAN + SWIFT/BIC','Confirmez votre identité si demandé','Soumettez — traité sous 24h en jours ouvrables'], warn:'⚠️ Le Bonus Cash est automatiquement perdu lors du retrait.' },
    withdrawals_time:        { body:'Délais de traitement :', bullets:['<b>Jours ouvrables (Lun–Ven) :</b> ~24 heures','<b>Week-ends :</b> jusqu\'à 72 heures'], note:'💡 Votre banque peut ajouter du temps supplémentaire.' },
    withdrawals_info:        { body:'Vous aurez besoin de :', bullets:['IBAN ou numéro de compte bancaire','Code SWIFT/BIC','Compte Backspin vérifié (requis pour le premier retrait)'] },
    withdrawals_bonus:       { body:'<b>Le Bonus Cash est automatiquement perdu.</b> Seul l\'argent réel est versé.' },
    withdrawals_missing:     { body:'Si votre retrait dépasse la fenêtre prévue, notre équipe doit enquêter directement.' },
    matchrefund_howrefund:   { intro:'Signalez-le via le Support In-App :', steps:['Ouvrez l\'application et appuyez sur votre <b>Profil</b>','Allez à <b>Support → Message</b>','Sélectionnez le sujet : <b>Match Échoué</b>','Incluez votre ID de Match et décrivez ce qui s\'est passé','L\'équipe examine et répond dès que possible'], note:'💡 Le match doit avoir un résultat final enregistré.' },
    matchrefund_crash:       { intro:'Essayez ces étapes d\'abord :', steps:['Fermez l\'application et rouvrez-la','Vérifiez si un résultat de match a été enregistré','S\'il n\'y a pas de résultat, signalez-le via le Support In-App'], note:'💡 Incluez votre ID de Match lors du signalement.' },
    matchrefund_froze:       { body:'Si le jeu s\'est figé en plein match et que vous avez été débité sans résultat, cela est éligible à un examen.' },
    matchrefund_wrongresult: { body:'Si vous pensez que le résultat a été mal enregistré, notre équipe peut examiner les journaux.' },
    matchrefund_refundtime:  { body:'Une fois soumis, les examens prennent généralement <b>1–3 jours ouvrables</b>.' },
    events_wildwest:         { intro:'Wild West est l\'Événement Majeur actuel — <b>9–31 mars 2026</b> :', bullets:['Thème : <b>Shérifs vs Hors-la-loi</b>','Équipes assignées aléatoirement','Gagnez des coupes pour atteindre les paliers de jalons','Chaque palier débloque un prix en cash garanti','Les défis du Tableau des Primes ajoutent des récompenses'], note:'💡 Niveau 8+ requis et inscription avant le début de l\'événement.' },
    events_milestones:       { intro:'Chaque palier de coupe atteint garantit une récompense :', bullets:['🥉 Palier 1 — 1 500 coupes → 10 $','🥈 Palier 2 — 2 500 coupes → 20 $','🥇 Palier 3 — 5 000 coupes → 50 $','⭐ Palier 4 — 10 000 coupes → 100 $','🌟 Palier 5 — 30 000 coupes → 200 $','💫 Palier 6 — 70 000 coupes → 300 $','🏆 Palier 7 — 130 000 coupes → MacBook'], note:'💡 Les jalons s\'accumulent.' },
    events_roulette:         { intro:'Un tirage au sort pour les joueurs Palier 4+ :', bullets:['3 joueurs par palier éligible sélectionnés par tirage','Chacun reçoit 1 spin — prix maximum 7 500 $','Prévu pour le 2 avril 2026'] },
    events_bounty:           { intro:'Gagnez plus en battant les cibles de prime :', bullets:['<b>Victoire vs prime :</b> 10 % des frais d\'entrée remboursés','<b>Défaite vs prime :</b> 5 % remboursés quand même','Soumettez une capture d\'écran'] },
    events_prizes:           { body:'Jusqu\'à <b>60 jours</b> après la fin de l\'événement.' },
    bonus_what:              { intro:'<b>Le Bonus Cash</b> est de l\'argent promotionnel :', bullets:['Couvre ~10 % des frais d\'entrée','<b>Ne peut pas être retiré</b>','Perdu automatiquement lors du retrait','Obtenu via promos, événements et récompenses'] },
    bonus_earn:              { intro:'Plusieurs façons de gagner gratuitement :', bullets:['⭐ Laissez un avis sur l\'App Store ou Play Store','👥 Parrainez des amis','🎬 Rejoignez le Programme Créateur','📺 Regardez en direct sur YouTube / Kick','📢 Annonces Discord et concours d\'événements'] },
    bonus_codes:             { intro:'Les codes sont partagés en direct sur stream ou dans Discord :', bullets:['Regardez YouTube ou Kick en direct','Consultez les annonces Discord','<b>Les codes expirent 24 heures</b> après la publication','Entrez les codes dans la section Boutique ou Promos'], note:'💡 Suivez Backspin sur YouTube et Kick.' },
    bonus_forfeited:         { body:'Le Bonus Cash est <b>automatiquement perdu lors du retrait</b>.' },
    app_crash:               { intro:'Essayez ces étapes dans l\'ordre :', steps:['Fermez complètement l\'application','Redémarrez votre appareil','Mettez à jour vers la dernière version','Videz le cache (Android : Paramètres → Application → Vider le cache)','Réinstallez si le problème persiste'], note:'💡 Crash en plein match ? Utilisez la catégorie Remboursement de Match.' },
    app_login:               { body:'La plupart des problèmes de connexion sont liés à la connexion internet ou au mot de passe :', bullets:['Vérifiez votre connexion internet','Vérifiez que l\'email et le mot de passe sont corrects','Appuyez sur <b>Mot de passe oublié</b>','Vérifiez les spams pour l\'email de réinitialisation','Réinstallez l\'application si rien ne fonctionne'] },
    app_android:             { body:'Téléchargez directement depuis notre lien :', note:'💡 Aussi sur l\'App Store iOS.' },
    app_requirements:        { bullets:['<b>iOS :</b> 12.0 ou ultérieur','<b>Android :</b> 6.0 ou ultérieur','<b>Stockage :</b> 100 Mo libres','<b>Internet :</b> Connexion stable requise','<b>RAM :</b> 2 Go ou plus recommandés'] },
    account_verify:          { intro:'Requis avant votre premier retrait :', bullets:['Vous serez invité automatiquement dans l\'application','Une pièce d\'identité officielle valide est requise','Certains comptes nécessitent un <b>appel de vérification</b>','Contactez le support ci-dessous'] },
    account_password:        { intro:'Réinitialisez-le rapidement :', steps:['Ouvrez Backspin et appuyez sur <b>Mot de passe oublié</b>','Entrez l\'email de votre compte','Vérifiez la boîte de réception (et les spams)','Définissez un nouveau mot de passe'] },
    account_locked:          { body:'Les problèmes de compte sont traités directement par notre équipe.' },
    account_multiple:        { body:'<b>Non</b> — un compte par personne uniquement.' },
    account_age:             { body:'Vous devez avoir <b>18 ans ou plus</b>.' }
  }
};

// ─────────────────────────────────────────────────────────────────
// ANSWER RENDERER
// ─────────────────────────────────────────────────────────────────
function renderAnsPlain(catId, q) {
  const cat = C[catId];
  const ansLang = ANS[lang] || {};
  const ov = ansLang[catId + '_' + q.id] || ansLang[q.id] || {};
  const f = (field) => ov[field] !== undefined ? ov[field] : q[field];
  const lines = [];
  lines.push(`${cat.icon} ${t('cat_' + catId)} — ${t(q.qKey)}`);
  if (f('intro')) lines.push(plainText(f('intro')));
  if (f('body'))  lines.push(plainText(f('body')));
  const steps = f('steps');
  if (steps?.length) steps.forEach((s, i) => lines.push(`${i + 1}. ${plainText(s)}`));
  const bullets = f('bullets');
  if (bullets?.length) bullets.forEach(b => lines.push(`• ${plainText(b)}`));
  if (f('note')) lines.push(plainText(f('note')));
  if (f('warn')) lines.push(plainText(f('warn')));
  return lines.join('\n');
}

function renderAns(catId, q) {
  const cat = C[catId];
  const ansLang = ANS[lang] || {};
  const ov = ansLang[catId + '_' + q.id] || ansLang[q.id] || {};
  const f  = (field) => ov[field] !== undefined ? ov[field] : q[field];
  let h = `<article class="article-card"><div class="ans-inner">`;
  h += `<div class="article-card-head"><div class="cat-pill" style="background:${cat.bg};color:${cat.color}">${cat.icon} ${t('cat_' + catId)}</div><div class="article-kicker">${esc(t('articleLabel'))}</div></div>`;
  h += `<div class="article-title">${t(q.qKey)}</div>`;
  if (f('intro')) h += `<div>${f('intro')}</div>`;
  if (f('body'))  h += `<div>${f('body')}</div>`;
  const steps = f('steps');
  if (steps?.length) {
    h += '<div class="ans-steps">';
    steps.forEach((s,i) => { h += `<div class="step-row"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`; });
    h += '</div>';
  }
  const bullets = f('bullets');
  if (bullets?.length) {
    h += '<div class="ans-bullets">';
    bullets.forEach(b => { h += `<div class="bul-row"><div class="bul-dot"></div><div class="bul-text">${b}</div></div>`; });
    h += '</div>';
  }
  if (f('note')) h += `<div class="info-box">${f('note')}</div>`;
  if (f('warn')) h += `<div class="warn-box">${f('warn')}</div>`;
  if (q.link) h += `<a class="ans-link article-link" href="${q.link.url}" target="_blank" rel="noopener">${q.link.label}</a>`;
  h += '</div></article>';
  return h;
}

// ─────────────────────────────────────────────────────────────────
// STAGE 1 — GUIDED FAQ
// ─────────────────────────────────────────────────────────────────
async function startGreeting() {
  await delay(300);

  const row = document.createElement('div');
  row.className = 'row bot';
  row.style.alignItems = 'flex-start';
  row.innerHTML = `
    <div class="greeting-hero">
      <div class="gh-av-wrap">
        <div class="gh-ring"></div>
        <div class="gh-av">${spinnyAvatarMarkup('hero-logo')}</div>
      </div>
      <div class="gh-text">
        <div class="bot-name" id="g-name">${t('botName')}</div>
        <div class="gh-bubble" id="g-bubble">${t('greeting')}<span class="greet-sub">${t('greetSub')}</span></div>
        <div class="support-disclaimer chat-disclaimer" id="support-disclaimer-chat">${esc(t('aiDisclaimer'))}</div>
      </div>
    </div>`;
  feed.appendChild(row);
  scrollBottom();

  await delay(400);
  showHomeChips();
}

function showHomeChips() {
  const catWrap = document.createElement('div');
  catWrap.className = 'chips-wrap cat-grid';

  Object.keys(C).forEach(key => {
    const cat = C[key];
    if (cat._hidden) return;
    const btn = document.createElement('button');
    btn.className = 'chip cat';
    btn.innerHTML = `<span class="chip-icon">${cat.icon}</span><span class="chip-label">${esc(t('cat_' + key))}</span>`;
    btn.dataset.action = 'pick-cat';
    btn.dataset.cat = key;
    btn.dataset.i18nCat = key;
    btn.addEventListener('click', () => handleChip(btn, catWrap));
    catWrap.appendChild(btn);
  });

  const elseBtn = document.createElement('button');
  elseBtn.className = 'chip cat white';
  elseBtn.innerHTML = `<span class="chip-icon">💬</span><span class="chip-label">${esc(t('somethingElse'))}</span>`;
  elseBtn.dataset.action = 'go-ai';
  elseBtn.dataset.i18nKey = 'somethingElse';
  elseBtn.dataset.i18nEmoji = '💬';
  elseBtn.addEventListener('click', () => handleChip(elseBtn, catWrap));
  catWrap.appendChild(elseBtn);

  feed.appendChild(catWrap);
  scrollBottom();
}

async function handlePickCat(btn, wrap, catId) {
  disableChips(wrap);
  const cat = C[catId];
  pendingTicketCategory = cat.errorFlow ? 'refund' : 'general';
  userBubble(cat.icon + ' ' + t('cat_' + catId), { sourceKind: 'button' });

  if (cat.errorFlow) {
    await delay(250);
    showTyping(); await delay(700); removeTyping();
    botBubble('Before I can help, I need your <b>Match ID</b>. You can find it in the app under <b>Recent Matches</b>. What is your Match ID?');
    pendingMatchId = true;
    pendingMatchCat = catId;
    enterStage2();
    return;
  }

  await delay(250);
  showTyping();
  await delay(700);
  removeTyping();

  botBubble(`${t('gotIt')} ${t('catIntro')} ${t('cat_' + catId)}. ${t('catSuffix')}`, true, null, { 'i18n-composite': 'gotIt+catPrefix', 'i18n-cat': catId });

  const items = cat.qs.map(q => ({
    label: t(q.qKey),
    cls: 'white',
    data: { action:'pick-q', cat:catId, q:q.id, qkey: q.qKey }
  }));
  items.push({ label: t('notListed'), cls: 'gold', emoji: '💬', i18nKey: 'notListed', data: { action:'go-ai' } });
  chipsRow(items);
}

async function handlePickQ(btn, wrap, catId, qId) {
  disableChips(wrap);
  const cat = C[catId];
  const q = cat.qs.find(x => x.id === qId);
  const qLabel = t(q.qKey);
  userBubble(qLabel, { sourceKind: 'button' });

  await delay(250);
  showTyping();
  await delay(850);
  removeTyping();

  botBubble(renderAns(catId, q), true, null, null, { logText: renderAnsPlain(catId, q) });

  if (q.escalate) {
    await delay(250);
    addEscCard();
    return;
  }

  await delay(350);
  askHelpful('faq');
}

function askHelpful(mode) {
  botBubble(t('didItHelp'), false, 'didItHelp');
  chipsRow([
    { label: t('yesLabel'), cls: 'green', i18nKey: 'yesLabel', data: { action:'helpful-yes' } },
    { label: t('noLabel'),  cls: '',      i18nKey: 'noLabel',  data: { action: mode === 'faq' ? 'helpful-no-faq' : 'helpful-no-ai' } }
  ]);
}

async function handleHelpfulYes(btn, wrap) {
  disableChips(wrap);
  triggerHaptic('success');
  userBubble(t('yesLabel'), { sourceKind: 'button' });
  noCount = 0;
  await delay(250);
  showTyping(); await delay(600); removeTyping();
  botBubble(t('awesomeMsg'), true, 'awesomeMsg');
  await delay(300);
  chipsRow([
    { label: t('backTopics'), cls: 'green', i18nKey: 'backTopics', data: { action:'restart' } },
    { label: t('thatIsAll'),  cls: '',      i18nKey: 'thatIsAll',  data: { action:'done' } }
  ]);
}

async function handleHelpfulNoFaq(btn, wrap) {
  disableChips(wrap);
  userBubble(t('noLabel'), { sourceKind: 'button' });
  await delay(200);
  showTyping(); await delay(650); removeTyping();
  botBubble(t('hardMsg'), true, 'hardMsg');
  enterStage2();
}

async function handleHelpfulNoAi(btn, wrap) {
  disableChips(wrap);
  userBubble(t('noLabel'), { sourceKind: 'button' });
  noCount++;
  if (noCount >= 1) {
    await delay(200);
    showTyping(); await delay(700); removeTyping();
    botBubble(t('sorryMsg'), true, 'sorryMsg');
    await delay(300);
    offerTransfer();
  } else {
    await delay(200);
    showTyping(); await delay(600); removeTyping();
    botBubble(t('hardMsg'), true, 'hardMsg');
    unlockInput();
  }
}

// ─────────────────────────────────────────────────────────────────
// STAGE 2 — AI CHAT
// ─────────────────────────────────────────────────────────────────
function enterStage2() {
  stage = 2;
  showInputBar();
}

async function handleUserMessage(text) {
  if (inputLocked || pendingAI || ticketComposerLocked) return;
  inputLocked = true;

  if (pendingMatchId) {
    userBubble(text, { persist: false });
    pendingMatchId = false;
    const catId = pendingMatchCat;
    pendingMatchCat = null;
    appendChatEntry('user', 'Match ID: ' + text, { sourceKind: 'typed' });
    await delay(300);
    showTyping(); await delay(600); removeTyping();
    botBubble(`Got it! Match ID <b>${esc(text)}</b>. What type of issue did you experience?`);
    chipsRow([
      { label: t('errorCrash'),       cls: 'white', i18nKey: 'errorCrash',       data: { action:'pick-q', cat:catId, q:'crash' } },
      { label: t('errorFreeze'),      cls: 'white', i18nKey: 'errorFreeze',      data: { action:'pick-q', cat:catId, q:'froze' } },
      { label: t('errorWrongResult'), cls: 'white', i18nKey: 'errorWrongResult', data: { action:'pick-q', cat:catId, q:'wrongresult' } },
      { label: t('errorOther'),       cls: 'gold',  i18nKey: 'errorOther',       data: { action:'go-ai' } },
    ]);
    unlockInput();
    inputLocked = false;
    return;
  }

  userBubble(text);

  if (activeTicketId) {
    ticketMessages = buildTicketTranscript();
    lockInput();
    const confirmRow = document.createElement('div');
    confirmRow.className = 'ticket-update-confirm';
    confirmRow.textContent = t('sentToSupport') + ' · ' + activeTicketId;
    feed.appendChild(confirmRow);
    scrollBottom();
    try {
      const ticket = await appendSupportTicketMessage(activeTicketId, text, 'player');
      setTicketComposerState(ticket);
      appendTicketStateNote(ticket.status);
    } catch (err) {
      if (/unavailable|not found|forbidden/i.test(err.message || '')) {
        handleHiddenTicket(activeTicketId);
      } else
      if (/closed/i.test(err.message || '')) {
        setTicketComposerState({ status: 'closed' });
        appendTicketStateNote('closed');
        showErrBubble(t('ticketClosedNotice'));
      } else {
        showErrBubble('Could not update your ticket right now. Please try again.');
      }
    }
    unlockInput();
    inputLocked = false;
    return;
  }

  pendingAI = true;
  lockInput();
  conversationHistory.push({ role: 'user', content: text });
  showTyping();
  await callAI(text);
}

function handleAIResponse(rawResult) {
  let result = rawResult;
  if (typeof rawResult === 'string') {
    try { result = JSON.parse(rawResult); } catch(_) {}
  }
  let reply = (result && typeof result.response === 'string') ? result.response : t('aiError');
  const safeReply = reply.replace(/\n/g, '<br>');
  botBubble(`${safeReply}<div class="ai-lang-tag">🤖 ${t('generatedIn')} ${t('aiLang')}</div>`, true, null, null, { sourceKind: 'ai_generated', logText: reply });
  conversationHistory.push({ role: 'assistant', content: reply });

  setTimeout(() => {
    askHelpful('ai');
    unlockInput();
    inputLocked = false;
  }, 350);
}

// ─────────────────────────────────────────────────────────────────
// HUMAN TRANSFER
// ─────────────────────────────────────────────────────────────────
function offerTransfer() {
  botBubble(t('transferOffer'), true, 'transferOffer');
  chipsRow([
    { label: t('transferYes'), cls: 'gold',  i18nKey: 'transferYes', data: { action:'transfer-yes' } },
    { label: t('transferNo'),  cls: 'white', i18nKey: 'transferNo',  data: { action:'transfer-no'  } }
  ]);
}

async function handleTransferYes(btn, wrap) {
  disableChips(wrap);
  userBubble(t('transferYes'), { sourceKind: 'button' });
  await delay(200);
  showTyping(); await delay(1000); removeTyping();
  botBubble(t('packagingMsg'), true, 'packagingMsg');

  await delay(600);
  ticketMessages = buildTicketTranscript();
  const subject = getConversationSubject(ticketMessages);
  try {
    const ticket = await createSupportTicket(subject, ticketMessages, pendingTicketCategory);
    activeTicketId = ticket.id;
    migrateDraft('new', 'ticket:' + activeTicketId);
    setActiveDraftKey('ticket:' + activeTicketId);
    joinTicketRoom(activeTicketId);
  } catch (err) {
    showErrBubble('Could not open a support ticket right now. Please try again.');
    unlockInput();
    inputLocked = false;
    return;
  }
  triggerHaptic('success');

  const card = document.createElement('div');
  card.className = 'transfer-card';
  card.innerHTML = `
    <div class="transfer-icon">🎉</div>
    <div class="transfer-title" data-i18n-title="teamTitle">${t('teamTitle')}</div>
    <div class="transfer-sub" data-i18n-sub="teamSub">${t('teamSub')}</div>
    <div class="transfer-ticket" data-i18n-ticket="ticketId">${t('ticketId')}: <b>${activeTicketId}</b></div>`;
  feed.appendChild(card);
  scrollBottom();

  appendTicketStateNote('open');
  setTicketComposerState({ status: 'open' });
  enterStage2();
}

async function handleTransferNo(btn, wrap) {
  disableChips(wrap);
  noCount = 0;
  userBubble(t('transferNo'), { sourceKind: 'button' });
  await delay(200);
  showTyping(); await delay(600); removeTyping();
  botBubble(t('retryMsg'), true, 'retryMsg');
  enterStage2();
}

// ─────────────────────────────────────────────────────────────────
// ESCALATION CARD
// ─────────────────────────────────────────────────────────────────
function addEscCard() {
  const card = document.createElement('div');
  card.className = 'esc-card';
  const btnId = 'esc-ticket-btn-' + Date.now();
  card.innerHTML = `
    <div class="esc-head">${t('escHead')}</div>
    <div class="esc-sub">${t('escSub')}</div>
    <div class="esc-btns">
      <button class="ebtn ebtn-p" id="${btnId}">${t('openTicket')}</button>
    </div>
    <div class="esc-hrs">${t('escHrs')}</div>`;
  feed.appendChild(card);
  document.getElementById(btnId).addEventListener('click', () => openSupportTicket(document.getElementById(btnId)));
  scrollBottom();
}

async function openSupportTicket(triggerBtn) {
  if (triggerBtn) {
    triggerBtn.disabled = true;
    triggerBtn.classList.add('is-locked');
    triggerBtn.setAttribute('aria-disabled', 'true');
  }
  if (activeTicketId) return;

  feed.querySelectorAll('.chips-wrap').forEach(w => disableChips(w));

  ticketMessages = buildTicketTranscript();
  const ticketSubject = getConversationSubject(ticketMessages);
  try {
    const ticket = await createSupportTicket(ticketSubject, ticketMessages, pendingTicketCategory);
    activeTicketId = ticket.id;
    migrateDraft('new', 'ticket:' + activeTicketId);
    setActiveDraftKey('ticket:' + activeTicketId);
    joinTicketRoom(activeTicketId);
  } catch (err) {
    showErrBubble('Could not open a support ticket right now. Please try again.');
    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.classList.remove('is-locked');
      triggerBtn.removeAttribute('aria-disabled');
    }
    return;
  }
  triggerHaptic('success');

  await delay(200);
  showTyping(); await delay(900); removeTyping();

  const card = document.createElement('div');
  card.className = 'transfer-card';
  card.innerHTML = `
    <div class="transfer-icon">🎫</div>
    <div class="transfer-title" data-i18n-title="ticketOpenedTitle">${t('ticketOpenedTitle')}</div>
    <div class="transfer-sub" data-i18n-sub="ticketOpenedSub">${t('ticketOpenedSub')}</div>
    <div class="transfer-ticket" data-i18n-ticket="ticketId">${t('ticketId')}: <b>${activeTicketId}</b></div>`;
  feed.appendChild(card);
  scrollBottom();

  appendTicketStateNote('open');
  setTicketComposerState({ status: 'open' });
  enterStage2();
}

// ─────────────────────────────────────────────────────────────────
// RESTART / DONE
// ─────────────────────────────────────────────────────────────────
async function handleRestart(btn, wrap) {
  disableChips(wrap);
  stage = 1; noCount = 0; conversationHistory = []; chatLog = [];
  activeTicketId = null; ticketMessages = [];
  pendingMatchId = false; pendingMatchCat = null;
  pendingTicketCategory = 'general';
  ticketComposerLocked = false;
  inputBar.classList.remove('ticket-closed');
  clearDraft(activeDraftKey);
  msgInput.value = '';
  syncComposerState();
  setActiveDraftKey('new');
  userBubble(t('backTopics'), { sourceKind: 'button' });
  await delay(200);
  showTyping(); await delay(500); removeTyping();
  botBubble(t('whatElse'), true, 'whatElse');
  hideInputBar();
  showHomeChips();
}

async function handleDone(btn, wrap) {
  disableChips(wrap);
  userBubble(t('thatIsAll'), { sourceKind: 'button' });
  await delay(200);
  showTyping(); await delay(600); removeTyping();
  botBubble(t('doneFarewell'), true, 'doneFarewell');
  hideInputBar();
  await delay(500);
  chipsRow([
    { label: t('newConversation'), cls: 'green', i18nKey: 'newConversation', data: { action:'new-conversation' } }
  ]);
}

// ─────────────────────────────────────────────────────────────────
// CHIP DISPATCHER
// ─────────────────────────────────────────────────────────────────
function handleChip(btn, wrap) {
  if (!btn || btn.disabled || btn.classList.contains('disabled') || btn.dataset.busy === '1') return;
  btn.dataset.busy = '1';
  const a   = btn.dataset.action;
  const cat = btn.dataset.cat;
  const q   = btn.dataset.q;
  if (a === 'pick-cat')             handlePickCat(btn, wrap, cat);
  else if (a === 'pick-q')          handlePickQ(btn, wrap, cat, q);
  else if (a === 'go-ai')           handleGoAi(btn, wrap);
  else if (a === 'helpful-yes')     handleHelpfulYes(btn, wrap);
  else if (a === 'helpful-no-faq')  handleHelpfulNoFaq(btn, wrap);
  else if (a === 'helpful-no-ai')   handleHelpfulNoAi(btn, wrap);
  else if (a === 'transfer-yes')    handleTransferYes(btn, wrap);
  else if (a === 'transfer-no')     handleTransferNo(btn, wrap);
  else if (a === 'restart')         handleRestart(btn, wrap);
  else if (a === 'done')            handleDone(btn, wrap);
  else if (a === 'new-conversation') handleNewConversation(btn, wrap);
}

async function handleNewConversation(btn, wrap) {
  disableChips(wrap);
  stage = 1; noCount = 0; conversationHistory = []; chatLog = [];
  activeTicketId = null; ticketMessages = [];
  pendingMatchId = false; pendingMatchCat = null;
  pendingTicketCategory = 'general';
  ticketComposerLocked = false;
  inputBar.classList.remove('ticket-closed');
  leaveTicketRoom();
  clearDraft(activeDraftKey);
  msgInput.value = '';
  syncComposerState();
  setActiveDraftKey('new');
  feed.innerHTML = '';
  hideInputBar();
  showInbox();
}

async function handleGoAi(btn, wrap) {
  disableChips(wrap);
  userBubble('💬 ' + t('somethingElse'), { sourceKind: 'button' });
  await delay(200);
  showTyping(); await delay(750); removeTyping();
  botBubble(t('aiFirst'), true, 'aiFirst');
  enterStage2();
}

// ─────────────────────────────────────────────────────────────────
// INPUT BAR EVENTS
// ─────────────────────────────────────────────────────────────────
msgInput.addEventListener('input', () => {
  if (/[\r\n]/.test(msgInput.value)) {
    msgInput.value = msgInput.value.replace(/[\r\n]+/g, ' ');
  }
  syncComposerState();
  persistDraft();
});

msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    doSend();
    return;
  }
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

msgInput.addEventListener('paste', e => {
  const pasted = (e.clipboardData || window.clipboardData)?.getData('text') || '';
  if (!/[\r\n]/.test(pasted)) return;
  e.preventDefault();
  const sanitized = sanitizeClientMessage(pasted);
  const start = msgInput.selectionStart || 0;
  const end = msgInput.selectionEnd || 0;
  msgInput.setRangeText(sanitized, start, end, 'end');
  msgInput.dispatchEvent(new Event('input', { bubbles: true }));
});

sendBtn.addEventListener('click', doSend);

function doSend() {
  const text = sanitizeClientMessage(msgInput.value);
  if (!text || text.length > MAX_LEN || inputLocked || pendingAI) return;
  msgInput.value = '';
  clearDraft();
  syncComposerState();
  sendBtn.disabled = true;
  const allWraps = feed.querySelectorAll('.chips-wrap');
  for (let i = allWraps.length - 1; i >= 0; i--) {
    const w = allWraps[i];
    if (w.querySelector('.chip:not(.disabled)')) { disableChips(w); break; }
  }
  handleUserMessage(text);
}

// ─────────────────────────────────────────────────────────────────
// LANGUAGE SWITCHER
// ─────────────────────────────────────────────────────────────────
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const newLang = btn.dataset.lang;
    if (newLang === lang) return;
    lang = newLang;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    const hdrName = document.getElementById('hdr-name');
    if (hdrName) hdrName.textContent = t('botName');
    msgInput.placeholder = t('placeholder');
    updateConnStatus(sockReady ? 'online' : 'offline');

    const gBubble = document.getElementById('g-bubble');
    if (gBubble) gBubble.innerHTML = `${t('greeting')}<span class="greet-sub">${t('greetSub')}</span>`;
    const gName = document.getElementById('g-name');
    if (gName) gName.textContent = t('botName');
    const inboxDisclaimer = document.getElementById('support-disclaimer-inbox');
    if (inboxDisclaimer) inboxDisclaimer.textContent = t('aiDisclaimer');
    const chatDisclaimer = document.getElementById('support-disclaimer-chat');
    if (chatDisclaimer) chatDisclaimer.textContent = t('aiDisclaimer');

    feed.querySelectorAll('.chip[data-i18n-key]').forEach(c => {
      const key = c.dataset.i18nKey;
      const emoji = c.dataset.i18nEmoji;
      c.innerHTML = emoji
        ? `<span class="chip-icon">${emoji}</span><span class="chip-label">${esc(t(key))}</span>`
        : `<span class="chip-label">${esc(t(key))}</span>`;
    });

    feed.querySelectorAll('.chip[data-i18n-cat]').forEach(c => {
      const catKey = c.dataset.i18nCat;
      const cat = C[catKey];
      if (!cat) return;
      c.innerHTML = `<span class="chip-icon">${cat.icon}</span><span class="chip-label">${esc(t('cat_' + catKey))}</span>`;
    });

    feed.querySelectorAll('.bubble[data-i18n]').forEach(el => {
      el.innerHTML = t(el.dataset.i18n);
    });

    feed.querySelectorAll('.bubble[data-i18n-composite]').forEach(el => {
      const type = el.dataset.i18nComposite;
      if (type === 'gotIt+catPrefix') {
        const catKey = el.dataset.i18nCat;
        if (catKey) el.innerHTML = `${t('gotIt')} ${t('catIntro')} ${t('cat_' + catKey)}. ${t('catSuffix')}`;
      }
    });

    feed.querySelectorAll('.chip[data-qkey]').forEach(c => {
      c.innerHTML = `<span class="chip-label">${esc(t(c.dataset.qkey))}</span>`;
    });

    feed.querySelectorAll('.esc-card').forEach(card => {
      const head = card.querySelector('.esc-head');
      const sub  = card.querySelector('.esc-sub');
      const hrs  = card.querySelector('.esc-hrs');
      const openBtn = card.querySelector('.ebtn-p');
      if (head)    head.textContent  = t('escHead');
      if (sub)     sub.textContent   = t('escSub');
      if (hrs)     hrs.textContent   = t('escHrs');
      if (openBtn) openBtn.textContent = t('openTicket');
    });

    feed.querySelectorAll('.transfer-card').forEach(card => {
      const title  = card.querySelector('.transfer-title');
      const sub    = card.querySelector('.transfer-sub');
      const ticket = card.querySelector('.transfer-ticket');
      if (title && title.dataset.i18nTitle) title.textContent = t(title.dataset.i18nTitle);
      if (sub   && sub.dataset.i18nSub)     sub.textContent   = t(sub.dataset.i18nSub);
      if (ticket && ticket.dataset.i18nTicket) {
        const id = ticket.querySelector('b')?.textContent || '';
        ticket.innerHTML = `${t(ticket.dataset.i18nTicket)}: <b>${id}</b>`;
      }
    });

    feed.querySelectorAll('.ticket-update-confirm').forEach(el => {
      const parts = el.textContent.split(' · ');
      const ticketNum = parts[1] || '';
      el.textContent = t('addedToTicket') + (ticketNum ? ' · ' + ticketNum : '');
    });

    const inboxTitle  = document.getElementById('inbox-title');
    const inboxSubEl  = document.getElementById('inbox-sub');
    const inboxNewBtn = document.getElementById('inbox-new-btn');
    if (inboxTitle)  inboxTitle.textContent = t('inboxTitle');
    if (inboxSubEl)  inboxSubEl.textContent = t('inboxSub');
    if (inboxNewBtn) inboxNewBtn.innerHTML  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>${t('inboxNewBtn')}`;

    renderInboxList();
  });
});

// ─────────────────────────────────────────────────────────────────
// CONVERSATIONS INBOX + SUPPORT TICKETS API
// ─────────────────────────────────────────────────────────────────
let conversations = [];
let currentTicketRoomId = null;

async function supportApi(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (supportIdentity.supportToken) headers['x-support-player-token'] = supportIdentity.supportToken;
  const res = await fetch(appendSupportAuthParams(path), {
    ...options,
    headers
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || 'Support request failed');
  return data;
}

function upsertConversation(ticket) {
  if (!ticket?.id) return;
  const idx = conversations.findIndex(c => c.id === ticket.id);
  if (idx >= 0) conversations[idx] = { ...conversations[idx], ...ticket };
  else conversations.unshift(ticket);
  conversations.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
}

async function loadConversations() {
  try {
    const data = await supportApi('/tickets');
    conversations = Array.isArray(data.tickets) ? data.tickets : [];
    conversations.forEach(ticket => {
      if (ticket.lastMessageSender === 'agent' && ticket.status === 'waiting_on_player' && !getUnreadCount(ticket.id)) {
        unreadState[ticket.id] = 1;
      }
    });
    saveUnreadState();
  } catch (err) {
    console.warn('Support ticket load failed:', err.message);
    conversations = [];
  }
  return conversations;
}

async function createSupportTicket(subject, messages, category = 'general') {
  const data = await supportApi('/tickets', {
    method: 'POST',
    body: JSON.stringify({
      ...getSupportAuthPayload(),
      subject,
      language: lang,
      messages,
      category,
    })
  });
  upsertConversation(data.ticket);
  return data.ticket;
}

async function appendSupportTicketMessage(ticketId, text, senderType = 'player', authorName = '') {
  const data = await supportApi(`/tickets/${encodeURIComponent(ticketId)}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      ...getSupportAuthPayload(),
      senderType,
      authorName,
      text,
      sourceKind: senderType === 'player' ? 'typed' : senderType === 'agent' ? 'staff' : 'spinny_default',
    })
  });
  upsertConversation(data.ticket);
  return data.ticket;
}

async function fetchSupportTicket(ticketId) {
  const data = await supportApi(`/tickets/${encodeURIComponent(ticketId)}`);
  upsertConversation(data.ticket);
  return data.ticket;
}

function joinTicketRoom(ticketId) {
  const safeId = String(ticketId || '').trim();
  if (currentTicketRoomId && currentTicketRoomId !== safeId && sockReady) {
    sock.emit('support:ticket:leave', { ticketId: currentTicketRoomId });
  }
  currentTicketRoomId = safeId || null;
  if (safeId && sockReady) sock.emit('support:ticket:join', { ticketId: safeId });
}

function leaveTicketRoom() {
  if (currentTicketRoomId && sockReady) sock.emit('support:ticket:leave', { ticketId: currentTicketRoomId });
  currentTicketRoomId = null;
}

function ticketStateLabel(status) {
  if (status === 'closed') return t('ticketClosedLabel');
  if (status === 'waiting_on_player') return '';
  return t('ticketOpenLabel');
}

function removeTicketStateNotes() {
  feed.querySelectorAll('.ticket-state-note').forEach(node => node.remove());
}

function appendTicketStateNote(status) {
  const label = ticketStateLabel(status);
  removeTicketStateNotes();
  if (!label) return;
  const row = document.createElement('div');
  row.className = `ticket-state-note ${status || 'open'}`;
  row.textContent = label;
  feed.appendChild(row);
  scrollBottom();
}

function renderInboxList(loading = false) {
  const list = document.getElementById('inbox-list');
  if (!list) return;
  if (loading) {
    list.innerHTML = `
      <div class="inbox-loading" aria-live="polite" aria-label="${esc(t('loadingConversations'))}">
        <div class="inbox-loading-card"></div>
        <div class="inbox-loading-card short"></div>
      </div>`;
    return;
  }
  if (!conversations.length) {
    list.innerHTML = `
      <div class="inbox-empty">
        <div class="inbox-empty-icon">💬</div>
        <div class="inbox-empty-title">${t('inboxEmpty')}</div>
        <div class="inbox-empty-sub">${t('inboxEmptySub')}</div>
        <div class="inbox-empty-hint-title">${t('inboxEmptyHint')}</div>
        <div class="inbox-empty-hints">
          <div class="inbox-empty-hint-chip">💸 ${esc(t('cat_withdrawals'))}</div>
          <div class="inbox-empty-hint-chip">⚠️ ${esc(t('cat_matchrefund'))}</div>
          <div class="inbox-empty-hint-chip">👤 ${esc(t('cat_account'))}</div>
        </div>
      </div>`;
    return;
  }
  const openOnes   = conversations.filter(c => c.status === 'open' || c.status === 'waiting_on_player');
  const closedOnes = conversations.filter(c => c.status === 'closed');
  let html = '';
  if (openOnes.length) {
    html += `<div class="inbox-section-lbl">${t('inboxSectionOpen')}</div>`;
    openOnes.forEach(c => { html += convoCardHTML(c); });
  }
  if (closedOnes.length) {
    html += `<div class="inbox-section-lbl">${t('inboxSectionClosed')}</div>`;
    closedOnes.forEach(c => { html += convoCardHTML(c); });
  }
  list.innerHTML = html;
}

function convoCardHTML(c) {
  const date  = new Date(c.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const isActive = c.status === 'open' || c.status === 'waiting_on_player';
  const unreadCount = getUnreadCount(c.id);
  const badge = isActive
    ? `<span class="convo-badge open">${t('badgeOpen')}</span>`
    : `<span class="convo-badge closed">${t('badgeClosed')}</span>`;
  return `<div class="convo-card ${c.status} ${unreadCount ? 'has-unread' : ''}" onclick="openConversation('${esc(c.id)}')">
    <div class="convo-card-top">
      <span class="convo-card-id">${esc(c.id)}</span>
      <span class="convo-card-date">${date}</span>
    </div>
    ${unreadCount ? `<div class="convo-unread-pill">⚡ ${t('newReplyLabel')}</div>` : ''}
    <div class="convo-card-subject">${esc(c.subject)}</div>
    <div class="convo-card-preview">${esc(c.preview)}</div>
    ${badge}
  </div>`;
}

const inboxScreen = document.getElementById('inbox-screen');
const chatScreen  = document.getElementById('chat-screen');
const hdrBack     = document.getElementById('hdr-back');

function showInbox() {
  const renderToken = ++inboxRenderToken;
  leaveTicketRoom();
  inboxScreen.classList.remove('hidden');
  chatScreen.classList.add('hidden');
  if (hdrBack) hdrBack.classList.remove('visible');
  renderInboxList(true);
  window.setTimeout(async () => {
    if (renderToken !== inboxRenderToken) return;
    if (!supportAuthReady) return;
    await loadConversations();
    renderInboxList();
  }, 140);
}

function showChat() {
  inboxScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  if (hdrBack) hdrBack.classList.add('visible');
}

function startNewConversation() {
  if (!supportAuthReady) return;
  stage = 1; noCount = 0; conversationHistory = []; chatLog = [];
  activeTicketId = null; ticketMessages = [];
  pendingMatchId = false; pendingMatchCat = null;
  pendingTicketCategory = 'general';
  ticketComposerLocked = false;
  inputBar.classList.remove('ticket-closed');
  leaveTicketRoom();
  persistDraft();
  msgInput.value = '';
  syncComposerState();
  setActiveDraftKey('new');
  feed.innerHTML = '';
  hideInputBar();
  showChat();
  startGreeting();
}

async function openConversation(ticketId) {
  let convo = conversations.find(c => c.id === ticketId);
  try {
    convo = await fetchSupportTicket(ticketId);
  } catch (err) {
    console.warn('Support ticket open failed:', err.message);
    if (!convo) { startNewConversation(); return; }
  }
  stage = 2; noCount = 0; conversationHistory = []; chatLog = [];
  activeTicketId = convo.id;
  clearUnread(convo.id);
  setActiveDraftKey('ticket:' + ticketId);
  pendingMatchId = false; pendingMatchCat = null;
  pendingTicketCategory = convo.category === 'refund' ? 'refund' : 'general';
  feed.innerHTML = '';
  showChat();
  joinTicketRoom(convo.id);

  const transcript = normalizeConversationMessages(convo.messages, convo.messageObjects);
  chatLog = transcript.map(m => ({ role: m.role, text: m.text, sourceKind: m.sourceKind || '', authorName: m.authorName || '' }));
  ticketMessages = buildTicketTranscript();

  if (transcript.length) {
    transcript.forEach(m => {
      if (m.role === 'user') userBubble(m.text, { persist: false, sourceKind: m.sourceKind || 'typed' });
      else if (m.role === 'agent') staffBubble(m.text, m.authorName || 'Backspin Support', { persist: false, logText: m.text, sourceKind: m.sourceKind || 'staff' });
      else botBubble(esc(m.text).replace(/\n/g, '<br>'), true, null, null, { persist: false, logText: m.text, sourceKind: m.sourceKind || 'spinny_default' });
    });
  }
  appendTicketStateNote(convo.status);
  setTicketComposerState(convo);
  enterStage2();
}

// ─────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─────────────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────────────
msgInput.placeholder = t('placeholder');
loadDraftStore();
loadUnreadState();
ensurePlayerIdentity()
  .catch(err => {
    console.warn('Support auth failed:', err.message);
  })
  .finally(() => {
    applyPlayerIdentityToUi();
    if (sockReady && supportAuthReady) {
      sock.emit('support:client:subscribe', {
        playerId: clientId,
        username: supportIdentity.username,
        supportToken: supportIdentity.supportToken,
      });
    }
    showInbox();
  });
