import { ChildPuzzle } from '../types/game';
import { AppLanguage } from '../types/i18n';

export const CHILD_PUZZLES: ChildPuzzle[] = [
  // 1. Mini Grid: Happy Smiley (3x3)
  {
    id: 'kid-1',
    category: 'grid',
    title: 'Happy Smiley Face',
    titleTa: 'மகிழ்ச்சியான சிரிக்கும் முகம்',
    titleFr: 'Visage Souriant Joyeux',
    titleEs: 'Carita Feliz Sonriente',
    titleHi: 'मुस्कुराता हुआ चेहरा',
    question: 'Paint the tiles to draw a smiling face! Look at the number clues.',
    questionTa: 'எண்களைப் பார்த்து கட்டங்களைத் தொட்டு ஒரு சிரிக்கும் முகத்தை வரையுங்கள்!',
    questionFr: 'Peins les cases pour dessiner un visage souriant ! Regarde les indices chiffrés.',
    questionEs: '¡Pinta las casillas para dibujar una carita feliz! Mira las pistas de números.',
    questionHi: 'संख्याओं के सुराग देखकर चौकोर बक्सों को रंगें और मुस्कुराता चेहरा बनाएँ!',
    hint: 'Row 1 has 2 dots for the eyes. Row 3 has 3 dots for the big smile!',
    hintTa: 'முதல் வரிசையில் 2 கண்கள் உள்ளன. 3-வது வரிசையில் 3 கட்டங்களும் புன்னகைக்கானவை!',
    hintFr: 'La ligne 1 a 2 yeux. La ligne 3 a 3 cases pour le grand sourire !',
    hintEs: '¡La fila 1 tiene 2 ojos. La fila 3 tiene 3 casillas para la gran sonrisa!',
    hintHi: 'पहली पंक्ति में 2 आँखें हैं। तीसरी पंक्ति में 3 बक्से बड़ी मुस्कान के लिए हैं!',
    type: 'grid',
    gridSize: 3,
    icon: '😊',
    gridSolution: [
      [1, 0, 1], // eyes
      [0, 0, 0], // nose / space
      [1, 1, 1], // smile
    ],
    rowClues: [[1, 1], [0], [3]],
    colClues: [[1, 1], [1], [1, 1]],
    explanation: 'Awesome! You drew two happy eyes and a big joyful smile!',
    explanationTa: 'அற்புதம்! இரண்டு பிரகாசமான கண்களையும் அழகான புன்னகையையும் வரைந்துவிட்டீர்கள்!',
    explanationFr: 'Génial ! Tu as dessiné deux yeux joyeux et un grand sourire !',
    explanationEs: '¡Genial! ¡Dibujaste dos ojos alegres y una gran sonrisa!',
    explanationHi: 'शाबाश! आपने दो चमकती आँखें और प्यारी मुस्कान बना दी!',
  },

  // 2. Pattern: Red & Yellow Balloons
  {
    id: 'kid-2',
    category: 'pattern',
    title: 'Color Balloon Pattern',
    titleTa: 'வண்ண பலூன் தாள வரிசை',
    titleFr: 'Suite de Ballons de Couleurs',
    titleEs: 'Patrón de Globos de Colores',
    titleHi: 'रंगीन गुब्बारों का क्रम',
    question: 'What color balloon comes next in the cheerful parade?',
    questionTa: 'அடுத்த பலூன் என்ன வண்ணத்தில் வர வேண்டும் என்று சொல்லுங்கள்?',
    questionFr: 'De quelle couleur sera le prochain ballon dans le défilé ?',
    questionEs: '¿De qué color es el siguiente globo del desfile?',
    questionHi: 'इस सुंदर कतार में अगला गुब्बारा किस रंग का होगा?',
    hint: 'Say it out loud: Red, Yellow, Red, Yellow...',
    hintTa: 'சத்தமாகச் சொல்லுங்கள்: சிவப்பு, மஞ்சள், சிவப்பு, மஞ்சள்...',
    hintFr: 'Dis-le à voix haute : Rouge, Jaune, Rouge, Jaune...',
    hintEs: 'Dilo en voz alta: Rojo, Amarillo, Rojo, Amarillo...',
    hintHi: 'ज़ोर से बोलें: लाल, पीला, लाल, पीला...',
    type: 'choice',
    icon: '🎈',
    sequenceVisual: [
      { emoji: '🔴', label: 'Red', labelTa: 'சிவப்பு', labelFr: 'Rouge', labelEs: 'Rojo', labelHi: 'लाल' },
      { emoji: '🟡', label: 'Yellow', labelTa: 'மஞ்சள்', labelFr: 'Jaune', labelEs: 'Amarillo', labelHi: 'पीला' },
      { emoji: '🔴', label: 'Red', labelTa: 'சிவப்பு', labelFr: 'Rouge', labelEs: 'Rojo', labelHi: 'लाल' },
      { emoji: '🟡', label: 'Yellow', labelTa: 'மஞ்சள்', labelFr: 'Jaune', labelEs: 'Amarillo', labelHi: 'पीला' },
      { emoji: '🔴', label: 'Red', labelTa: 'சிவப்பு', labelFr: 'Rouge', labelEs: 'Rojo', labelHi: 'लाल' },
      { emoji: '❓', label: 'Next?', labelTa: 'அடுத்து?', labelFr: 'Suivant ?', labelEs: '¿Siguiente?', labelHi: 'अगला?' },
    ],
    options: [
      { id: 0, label: 'Yellow Balloon', labelTa: 'மஞ்சள் பலூன்', labelFr: 'Ballon Jaune', labelEs: 'Globo Amarillo', labelHi: 'पीला गुब्बारा', emoji: '🟡' },
      { id: 1, label: 'Red Balloon', labelTa: 'சிவப்பு பலூன்', labelFr: 'Ballon Rouge', labelEs: 'Globo Rojo', labelHi: 'लाल गुब्बारा', emoji: '🔴' },
      { id: 2, label: 'Green Balloon', labelTa: 'பச்சை பலூன்', labelFr: 'Ballon Vert', labelEs: 'Globo Verde', labelHi: 'हरा गुब्बारा', emoji: '🟢' },
      { id: 3, label: 'Blue Balloon', labelTa: 'நீல பலூன்', labelFr: 'Ballon Bleu', labelEs: 'Globo Azul', labelHi: 'नीला गुब्बारा', emoji: '🔵' },
    ],
    correctAnswerIndex: 0,
    explanation: 'Super job! The colors alternate: Red, Yellow, Red, Yellow, Red, and then Yellow!',
    explanationTa: 'சபாஷ்! சிவப்பு, மஞ்சள், சிவப்பு, மஞ்சள் வரிசையில் அடுத்து மஞ்சள் பலூன் தான்!',
    explanationFr: 'Bravo ! Les couleurs alternent : Rouge, Jaune, Rouge, Jaune, Rouge, puis Jaune !',
    explanationEs: '¡Excelente! Los colores alternan: Rojo, Amarillo, Rojo, Amarillo, Rojo y ¡Amarillo!',
    explanationHi: 'बहुत बढ़िया! लाल, पीला, लाल, पीला के बाद पीला गुब्बारा ही आता है!',
  },

  // 3. Mini Grid: Little Red Heart (3x3)
  {
    id: 'kid-3',
    category: 'grid',
    title: 'Little Love Heart',
    titleTa: 'அன்பின் இதய வடிவம்',
    titleFr: 'Petit Cœur d’Amour',
    titleEs: 'Lindo Corazón',
    titleHi: 'प्यारा सा दिल',
    question: 'Fill in the squares to draw a lovely heart shape!',
    questionTa: 'கட்டங்களைத் தொட்டு அழகான இதய வடிவத்தை வரையவும்!',
    questionFr: 'Remplis les cases pour dessiner un joli cœur !',
    questionEs: '¡Rellena las casillas para dibujar un hermoso corazón!',
    questionHi: 'बक्सों को भरकर एक सुंदर दिल का आकार बनाएँ!',
    hint: 'Fill row 1 and row 2, then just the middle bottom tile for row 3!',
    hintTa: 'முதல் வரிசையில் 2, இரண்டாவது வரிசையில் 3, அடியில் நடுவில் ஒன்று!',
    hintFr: 'Remplis les lignes 1 et 2, puis juste la case du milieu en bas !',
    hintEs: '¡Rellena fila 1 y 2, y solo el centro inferior en la fila 3!',
    hintHi: 'पहली व दूसरी पंक्ति भरें, फिर तीसरी पंक्ति में सिर्फ बीच वाला बक्सा!',
    type: 'grid',
    gridSize: 3,
    icon: '❤️',
    gridSolution: [
      [1, 0, 1],
      [1, 1, 1],
      [0, 1, 0],
    ],
    rowClues: [[1, 1], [3], [1]],
    colClues: [[2], [2], [2]],
    explanation: 'You made a beautiful heart! Great deductive painting!',
    explanationTa: 'அழகான இதயத்தை வரைந்து விட்டீர்கள்! உங்கள் திறமை சூப்பர்!',
    explanationFr: 'Tu as fait un magnifique cœur ! Bravo !',
    explanationEs: '¡Hiciste un corazón precioso! ¡Gran deducción!',
    explanationHi: 'आपने एक खूबसूरत दिल बनाया! कमाल की सोच!',
  },

  // 4. Animal Pattern: Cat & Dog Friends
  {
    id: 'kid-4',
    category: 'animals',
    title: 'Puppy & Kitty March',
    titleTa: 'பூனையும் நாய்க்குட்டியும்',
    titleFr: 'La Marche du Chiot et Chaton',
    titleEs: 'El Desfile del Perrito y Gatito',
    titleHi: 'बिल्ली और कुत्ते की जोड़ी',
    question: 'Which sweet pet is next in line to get a treat?',
    questionTa: 'அடுத்து வரப்போகும் செல்லப் பிராணி எது?',
    questionFr: 'Quel gentil animal est le prochain pour avoir une friandise ?',
    questionEs: '¿Qué tierna mascota es la siguiente en recibir un premio?',
    questionHi: 'कतार में आगे कौन सा प्यारा पालतू जानवर आएगा?',
    hint: 'Listen to the rhythm: Meow, Woof, Meow, Woof...',
    hintTa: 'மியாவ், லொள், மியாவ், லொள்... அடுத்து என்ன வரும்?',
    hintFr: 'Écoute le rythme : Miaou, Ouaf, Miaou, Ouaf...',
    hintEs: 'Escucha el ritmo: Miau, Guau, Miau, Guau...',
    hintHi: 'लय सुनें: म्याऊँ, भौं, म्याऊँ, भौं...',
    type: 'choice',
    icon: '🐾',
    sequenceVisual: [
      { emoji: '🐱', label: 'Kitty', labelTa: 'பூனை', labelFr: 'Chaton', labelEs: 'Gatito', labelHi: 'बिल्ली' },
      { emoji: '🐶', label: 'Puppy', labelTa: 'நாய்', labelFr: 'Chiot', labelEs: 'Perrito', labelHi: 'कुत्ता' },
      { emoji: '🐱', label: 'Kitty', labelTa: 'பூனை', labelFr: 'Chaton', labelEs: 'Gatito', labelHi: 'बिल्ली' },
      { emoji: '🐶', label: 'Puppy', labelTa: 'நாய்', labelFr: 'Chiot', labelEs: 'Perrito', labelHi: 'कुत्ता' },
      { emoji: '🐱', label: 'Kitty', labelTa: 'பூனை', labelFr: 'Chaton', labelEs: 'Gatito', labelHi: 'बिल्ली' },
      { emoji: '❓', label: 'Who is next?', labelTa: 'அடுத்து யார்?', labelFr: 'Qui ensuite ?', labelEs: '¿Quién sigue?', labelHi: 'आगे कौन?' },
    ],
    options: [
      { id: 0, label: 'Puppy Dog', labelTa: 'நாய்க்குட்டி', labelFr: 'Chiot', labelEs: 'Perrito', labelHi: 'पिल्ला (कुत्ता)', emoji: '🐶' },
      { id: 1, label: 'Little Kitty', labelTa: 'பூனைக்குட்டி', labelFr: 'Petit Chaton', labelEs: 'Gatito', labelHi: 'बिल्ली', emoji: '🐱' },
      { id: 2, label: 'Bunny Rabbit', labelTa: 'முயல் குட்டி', labelFr: 'Lapin', labelEs: 'Conejito', labelHi: 'खरगोश', emoji: '🐰' },
      { id: 3, label: 'Singing Bird', labelTa: 'பாடும் குருவி', labelFr: 'Oiseau', labelEs: 'Pajarito', labelHi: 'चिड़िया', emoji: '🐦' },
    ],
    correctAnswerIndex: 0,
    explanation: 'Hooray! After the kitty comes the happy puppy!',
    explanationTa: 'சரியான பதில்! பூனைக்குப் பிறகு வாலாட்டும் நாய்க்குட்டி வருகிறது!',
    explanationFr: 'Hourra ! Après le chaton vient le joyeux chiot !',
    explanationEs: '¡Hurra! ¡Después del gatito viene el alegre perrito!',
    explanationHi: 'अरे वाह! बिल्ली के बाद प्यारा कुत्ता ही आता है!',
  },

  // 5. Mini Grid: Twinkle Star (3x3)
  {
    id: 'kid-5',
    category: 'grid',
    title: 'Twinkle Bright Star',
    titleTa: 'மின்னும் விண்மீன்',
    titleFr: 'Étoile Brillante Scintillante',
    titleEs: 'Estrella Brillante',
    titleHi: 'चमचमाता तारा',
    question: 'Draw a shining plus-star in the sky!',
    questionTa: 'வானில் மின்னும் நட்சத்திரத்தை கட்டங்களில் வரையுங்கள்!',
    questionFr: 'Dessine une étoile brillante dans le ciel !',
    questionEs: '¡Dibuja una estrella brillante en el cielo!',
    questionHi: 'आसमान में चमकता हुआ सितारा बनाएँ!',
    hint: 'Fill the top center, all 3 in the middle, and bottom center.',
    hintTa: 'மேலே நடுவில் 1, நடு வரிசையில் 3, அடியில் நடுவில் 1 கட்டம்!',
    hintFr: 'Remplis le haut au milieu, les 3 au milieu, et le bas au milieu.',
    hintEs: '¡Pinta arriba al centro, las 3 del medio y abajo al centro!',
    hintHi: 'ऊपर बीच में, बीच की तीनों, और नीचे बीच में रंग भरें।',
    type: 'grid',
    gridSize: 3,
    icon: '⭐',
    gridSolution: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    rowClues: [[1], [3], [1]],
    colClues: [[1], [3], [1]],
    explanation: 'Twinkle, twinkle little star! Perfect symmetrical star!',
    explanationTa: 'அருமை! அழகான நட்சத்திர வடிவம் துல்லியமாக உருவானது!',
    explanationFr: 'Brille, brille petite étoile ! Une étoile parfaite !',
    explanationEs: '¡Brilla, brilla estrellita! ¡Estrella simétrica perfecta!',
    explanationHi: 'ट्विंकल ट्विंकल लिटिल स्टार! एकदम सही तारा!',
  },

  // 6. Counting IQ: Rocket Countdown
  {
    id: 'kid-6',
    category: 'counting',
    title: 'Rocket Blastoff Numbers',
    titleTa: 'ராக்கெட் விண்வெளி பயணம்',
    titleFr: 'Décollage de la Fusée',
    titleEs: 'Despegue del Cohete Espacial',
    titleHi: 'रॉकेट की अंतरिक्ष उड़ान',
    question: 'The rocket is counting up to launch! What number comes next?',
    questionTa: 'ராக்கெட் கிளம்ப எண்கள் எண்ணப்படுகின்றன: 1, 2, 3, 4... அடுத்து என்ன எண்?',
    questionFr: 'La fusée compte pour décoller ! Quel chiffre vient après ?',
    questionEs: '¡El cohete cuenta para despegar! ¿Qué número sigue?',
    questionHi: 'रॉकेट उड़ने की गिनती चल रही है: 1, 2, 3, 4... आगे क्या आएगा?',
    hint: 'Count with your fingers: 1, 2, 3, 4...',
    hintTa: 'விரல்களில் எண்ணுங்கள்: 1, 2, 3, 4...',
    hintFr: 'Compte sur tes doigts : 1, 2, 3, 4...',
    hintEs: 'Cuenta con tus dedos: 1, 2, 3, 4...',
    hintHi: 'उंगलियों पर गिनें: 1, 2, 3, 4...',
    type: 'choice',
    icon: '🚀',
    sequenceVisual: [
      { emoji: '1️⃣', label: 'One', labelTa: 'ஒன்று', labelFr: 'Un', labelEs: 'Uno', labelHi: 'एक' },
      { emoji: '2️⃣', label: 'Two', labelTa: 'இரண்டு', labelFr: 'Deux', labelEs: 'Dos', labelHi: 'दो' },
      { emoji: '3️⃣', label: 'Three', labelTa: 'மூன்று', labelFr: 'Trois', labelEs: 'Tres', labelHi: 'तीन' },
      { emoji: '4️⃣', label: 'Four', labelTa: 'நான்கு', labelFr: 'Quatre', labelEs: 'Cuatro', labelHi: 'चार' },
      { emoji: '❓', label: 'Next?', labelTa: 'அடுத்து?', labelFr: 'Suivant ?', labelEs: '¿Siguiente?', labelHi: 'अगला?' },
    ],
    options: [
      { id: 0, label: 'Number 5', labelTa: 'எண் 5', labelFr: 'Numéro 5', labelEs: 'Número 5', labelHi: 'संख्या 5', emoji: '5️⃣' },
      { id: 1, label: 'Number 6', labelTa: 'எண் 6', labelFr: 'Numéro 6', labelEs: 'Número 6', labelHi: 'संख्या 6', emoji: '6️⃣' },
      { id: 2, label: 'Number 3', labelTa: 'எண் 3', labelFr: 'Numéro 3', labelEs: 'Número 3', labelHi: 'संख्या 3', emoji: '3️⃣' },
      { id: 3, label: 'Number 8', labelTa: 'எண் 8', labelFr: 'Numéro 8', labelEs: 'Número 8', labelHi: 'संख्या 8', emoji: '8️⃣' },
    ],
    correctAnswerIndex: 0,
    explanation: 'Blast off! 1, 2, 3, 4, 5! You got it right on target!',
    explanationTa: 'ராக்கெட் சீறிப் பாய்ந்தது! 1, 2, 3, 4, 5! சரியான விடை!',
    explanationFr: 'Décollage réussi ! 1, 2, 3, 4, 5 ! En plein dans le mille !',
    explanationEs: '¡Despegue! 1, 2, 3, 4, 5! ¡Exacto en el blanco!',
    explanationHi: 'रॉकेट उड़ा! 1, 2, 3, 4, 5! बिल्कुल सही उत्तर!',
  },

  // 7. Mini Grid: Sailboat on Water (4x4)
  {
    id: 'kid-7',
    category: 'grid',
    title: 'Little Ocean Sailboat',
    titleTa: 'கடல் பாய்மரப் படகு',
    titleFr: 'Petit Voilier sur l’Océan',
    titleEs: 'Velerito en el Mar',
    titleHi: 'समुद्र में छोटी नाव',
    question: 'Paint a mini sailboat gliding on blue water!',
    questionTa: 'நீலக் கடலில் மிதக்கும் பாய்மரப் படகை வரையுங்கள்!',
    questionFr: 'Peins un petit voilier qui glisse sur l’eau bleue !',
    questionEs: '¡Pinta un velerito navegando en el agua azul!',
    questionHi: 'नीले पानी में तैरती हुई सुंदर नाव बनाएँ!',
    hint: 'Row 1 has 1 sail tip, Row 2 has 2 sail tiles, Row 3 is the mast, Row 4 is the boat hull!',
    hintTa: 'வரிசை 1-ல் பாய்மர உச்சி, வரிசை 2-ல் பாய், வரிசை 4-ல் 4 கட்டங்களும் படகின் அடிப்பகுதி!',
    hintFr: 'Ligne 1 pointe de voile, ligne 2 deux cases, ligne 4 toute la coque !',
    hintEs: '¡Fila 1 punta de vela, fila 2 dos velas, fila 4 todo el casco!',
    hintHi: 'पंक्ति 1 में पाल का सिरा, पंक्ति 2 में 2 बक्से, पंक्ति 4 में पूरी नाव का तला!',
    type: 'grid',
    gridSize: 4,
    icon: '⛵',
    gridSolution: [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 1],
    ],
    rowClues: [[1], [2], [1], [4]],
    colClues: [[1], [4], [2], [1]],
    explanation: 'Splendid sailing! You created the mast and hull cleanly!',
    explanationTa: 'அற்புதம்! பாய்மரமும் படகும் மிக அழகாக வந்துவிட்டன!',
    explanationFr: 'Magnifique navigation ! Le mât et la coque sont parfaits !',
    explanationEs: '¡Espléndida navegación! ¡Mástil y casco perfectos!',
    explanationHi: 'वाह! मस्तूल और नाव का तला बिल्कुल सही बना!',
  },

  // 8. Pattern: Sun, Cloud, Rainbow
  {
    id: 'kid-8',
    category: 'pattern',
    title: 'Magical Weather Sky',
    titleTa: 'வானிலை மாயாஜாலம்',
    titleFr: 'Ciel Météo Magique',
    titleEs: 'Cielo Mágico del Clima',
    titleHi: 'जादुई मौसम का आसमान',
    question: 'What appears in the sky after the sunny rain cloud?',
    questionTa: 'சூரியன், மழை மேகம் ஆகியவற்றுக்கு பின் வானில் தோன்றுவது எது?',
    questionFr: 'Qu’apparaît-il dans le ciel après le nuage de pluie ?',
    questionEs: '¿Qué aparece en el cielo después de la nube lluviosa?',
    questionHi: 'सूरज और बारिश के बादल के बाद आसमान में क्या चमकता है?',
    hint: 'Sun shines, Rain cloud pours, then comes the colorful...',
    hintTa: 'சூரியன், மழை, பின்னர் வானில் தோன்றும் வண்ணமயமான...',
    hintFr: 'Le soleil brille, la pluie tombe, puis vient le magnifique...',
    hintEs: 'El sol brilla, la lluvia cae y luego viene el colorido...',
    hintHi: 'सूरज निकला, बारिश हुई, फिर खिला रंग-बिरंगा...',
    type: 'choice',
    icon: '🌈',
    sequenceVisual: [
      { emoji: '☀️', label: 'Sun', labelTa: 'சூரியன்', labelFr: 'Soleil', labelEs: 'Sol', labelHi: 'सूरज' },
      { emoji: '🌧️', label: 'Rain', labelTa: 'மழை', labelFr: 'Pluie', labelEs: 'Lluvia', labelHi: 'बारिश' },
      { emoji: '🌈', label: 'Rainbow', labelTa: 'வானவில்', labelFr: 'Arc-en-ciel', labelEs: 'Arcoíris', labelHi: 'इंद्रधनुष' },
      { emoji: '☀️', label: 'Sun', labelTa: 'சூரியன்', labelFr: 'Soleil', labelEs: 'Sol', labelHi: 'सूरज' },
      { emoji: '🌧️', label: 'Rain', labelTa: 'மழை', labelFr: 'Pluie', labelEs: 'Lluvia', labelHi: 'बारिश' },
      { emoji: '❓', label: 'What is next?', labelTa: 'அடுத்து என்ன?', labelFr: 'Quoi ensuite ?', labelEs: '¿Qué sigue?', labelHi: 'आगे क्या?' },
    ],
    options: [
      { id: 0, label: 'Bright Rainbow', labelTa: 'அழகிய வானவில்', labelFr: 'Arc-en-ciel Brillant', labelEs: 'Lindo Arcoíris', labelHi: 'सतरंगी इंद्रधनुष', emoji: '🌈' },
      { id: 1, label: 'Snowflake', labelTa: 'பனித்துளி', labelFr: 'Flocon de Neige', labelEs: 'Copo de Nieve', labelHi: 'बर्फ का कण', emoji: '❄️' },
      { id: 2, label: 'Thunderbolt', labelTa: 'இடி மின்னல்', labelFr: 'Éclair', labelEs: 'Rayo', labelHi: 'बिजली', emoji: '⚡' },
      { id: 3, label: 'Moon', labelTa: 'நிலா', labelFr: 'Lune', labelEs: 'Luna', labelHi: 'चाँद', emoji: '🌙' },
    ],
    correctAnswerIndex: 0,
    explanation: 'Beautiful! Sun, Rain, Rainbow repeats! You are a weather detective!',
    explanationTa: 'அருமை! சூரியன், மழை, வானவில் வரிசை மீண்டும் சுழல்கிறது!',
    explanationFr: 'Magnifique ! Soleil, Pluie, Arc-en-ciel se répète !',
    explanationEs: '¡Hermoso! ¡Sol, Lluvia, Arcoíris se repite!',
    explanationHi: 'शाबाश! सूरज, बारिश, और फिर इंद्रधनुष ही खिलता है!',
  },

  // 9. Counting: Frog Hop Hops (Skip by 2)
  {
    id: 'kid-9',
    category: 'counting',
    title: 'Happy Frog Lilypad Hops',
    titleTa: 'தவளையின் இலைத் தாவல்',
    titleFr: 'Sauts de Grenouille sur Nénuphars',
    titleEs: 'Saltitos de la Rana',
    titleHi: 'मेंढक की छलाँगें',
    question: 'The frog hops 2 lily pads each jump: 2, 4, 6... Where does it land next?',
    questionTa: 'தவளை இரண்டு இரண்டாகத் தாவுகிறது: 2, 4, 6... அடுத்து எங்கே குதிக்கும்?',
    questionFr: 'La grenouille saute de 2 en 2 : 2, 4, 6... Où atterrit-elle ensuite ?',
    questionEs: 'La ranita salta de 2 en 2: 2, 4, 6... ¿Dónde aterriza después?',
    questionHi: 'मेंढक 2-2 कदम कूदता है: 2, 4, 6... अगली छलाँग कहाँ लगेगी?',
    hint: 'Add 2 more to 6: 6 + 2 = ?',
    hintTa: '6 உடன் 2 கூட்டுங்கள்: 6 + 2 = ?',
    hintFr: 'Ajoute 2 de plus à 6 : 6 + 2 = ?',
    hintEs: 'Suma 2 más a 6: 6 + 2 = ¿?',
    hintHi: '6 में 2 और जोड़ें: 6 + 2 = ?',
    type: 'choice',
    icon: '🐸',
    sequenceVisual: [
      { emoji: '2️⃣', label: 'Hop 2', labelTa: 'படி 2', labelFr: 'Saut 2', labelEs: 'Salto 2', labelHi: 'कदम 2' },
      { emoji: '4️⃣', label: 'Hop 4', labelTa: 'படி 4', labelFr: 'Saut 4', labelEs: 'Salto 4', labelHi: 'कदम 4' },
      { emoji: '6️⃣', label: 'Hop 6', labelTa: 'படி 6', labelFr: 'Saut 6', labelEs: 'Salto 6', labelHi: 'कदम 6' },
      { emoji: '❓', label: 'Next Lilypad?', labelTa: 'அடுத்த இலை?', labelFr: 'Prochain Nénuphar ?', labelEs: '¿Siguiente Hoja?', labelHi: 'अगला पत्ता?' },
    ],
    options: [
      { id: 0, label: 'Pad 8', labelTa: 'எண் 8', labelFr: 'Feuille 8', labelEs: 'Hoja 8', labelHi: 'पत्ता 8', emoji: '8️⃣' },
      { id: 1, label: 'Pad 7', labelTa: 'எண் 7', labelFr: 'Feuille 7', labelEs: 'Hoja 7', labelHi: 'पत्ता 7', emoji: '7️⃣' },
      { id: 2, label: 'Pad 9', labelTa: 'எண் 9', labelFr: 'Feuille 9', labelEs: 'Hoja 9', labelHi: 'पत्ता 9', emoji: '9️⃣' },
      { id: 3, label: 'Pad 10', labelTa: 'எண் 10', labelFr: 'Feuille 10', labelEs: 'Hoja 10', labelHi: 'पत्ता 10', emoji: '🔟' },
    ],
    correctAnswerIndex: 0,
    explanation: 'Ribbit! 2, 4, 6, 8! You are super fast at skip counting!',
    explanationTa: 'கொக் கொக்! 2, 4, 6, 8! நீங்கள் இரட்டைப் படிகளில் கில்லாடி!',
    explanationFr: 'Coâââ ! 2, 4, 6, 8 ! Tu es super fort en comptage par bonds !',
    explanationEs: '¡Croac! ¡2, 4, 6, 8! ¡Eres súper rápido contando de 2 en 2!',
    explanationHi: 'टर्र-टर्र! 2, 4, 6, 8! आप गिनती में बहुत तेज़ हैं!',
  },
];

export function getLocalizedChildPuzzle(puz: ChildPuzzle, lang: AppLanguage) {
  const isTa = lang === 'ta';
  const isFr = lang === 'fr';
  const isEs = lang === 'es';
  const isHi = lang === 'hi';

  const title =
    (isTa
      ? puz.titleTa
      : isFr
      ? puz.titleFr
      : isEs
      ? puz.titleEs
      : isHi
      ? puz.titleHi
      : puz.title) || puz.title;

  const question =
    (isTa
      ? puz.questionTa
      : isFr
      ? puz.questionFr
      : isEs
      ? puz.questionEs
      : isHi
      ? puz.questionHi
      : puz.question) || puz.question;

  const hint =
    (isTa
      ? puz.hintTa
      : isFr
      ? puz.hintFr
      : isEs
      ? puz.hintEs
      : isHi
      ? puz.hintHi
      : puz.hint) || puz.hint;

  const explanation =
    (isTa
      ? puz.explanationTa
      : isFr
      ? puz.explanationFr
      : isEs
      ? puz.explanationEs
      : isHi
      ? puz.explanationHi
      : puz.explanation) || puz.explanation;

  const options = puz.options?.map((opt) => ({
    id: opt.id,
    emoji: opt.emoji,
    color: opt.color,
    label:
      (isTa
        ? opt.labelTa
        : isFr
        ? opt.labelFr
        : isEs
        ? opt.labelEs
        : isHi
        ? opt.labelHi
        : opt.label) || opt.label,
  }));

  const sequenceVisual = puz.sequenceVisual?.map((item) => ({
    emoji: item.emoji,
    color: item.color,
    shape: item.shape,
    label:
      (isTa
        ? item.labelTa
        : isFr
        ? item.labelFr
        : isEs
        ? item.labelEs
        : isHi
        ? item.labelHi
        : item.label) || item.label,
  }));

  return {
    ...puz,
    title,
    question,
    hint,
    explanation,
    options,
    sequenceVisual,
  };
}
