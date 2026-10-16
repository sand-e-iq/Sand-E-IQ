import { DetectiveCase } from '../types/game';
import { AppLanguage } from '../types/i18n';

export const DETECTIVE_MEHUL_CASES: DetectiveCase[] = [
  // CASE 1: Chettinad Mansion Rain Mystery
  {
    id: 'case-1',
    caseNumber: 1,
    difficulty: 'easy',
    title: 'The Chettinad Mansion Diamond Theft',
    titleTa: 'செட்டிநாடு மாளிகைத் திருட்டு',
    titleFr: 'Le Vol de Diamant du Manoir Chettinad',
    titleEs: 'El Robo de Diamantes de la Mansión Chettinad',
    titleHi: 'चेट्टीनाड हवेली की हीरे की चोरी',
    synopsis:
      'On a stormy afternoon with torrential rain pouring in Karaikudi, a priceless royal diamond disappeared from the locked master bedroom safe. Detective Arunan interrogated the 3 staff members present in the mansion.',
    synopsisTa:
      'காரைக்குடியில் உள்ள செட்டிநாடு மாளிகையில் பலத்த அடைமழை பெய்து கொண்டிருந்தபோது, அறையில் இருந்த விலைமதிப்பற்ற வைர நெக்லஸ் திருடு போனது. துப்பறியும் அருணன் மாளிகையில் இருந்த மூவரிடம் விசாரணை நடத்தினார்.',
    synopsisFr:
      'Lors d’un après-midi d’orage avec une pluie torrentielle à Karaikudi, un diamant royal inestimable a disparu du coffre-fort de la chambre principale fermée à clé. Le détective Arunan a interrogé les 3 employés présents.',
    synopsisEs:
      'En una tarde de tormenta con lluvia torrencial en Karaikudi, un valioso diamante real desapareció de la caja fuerte del dormitorio principal bajo llave. El detective Arunan interrogó a los 3 empleados presentes.',
    synopsisHi:
      'कराईकुडी की चेट्टीनाड हवेली में मूसलाधार बारिश के दौरान बेडरूम की तिजोरी से कीमती शाही हीरा गायब हो गया। जासूस अरूनन ने हवेली में मौजूद 3 कर्मचारियों से पूछताछ की।',
    sceneVisualEmoji: '🏰 💎 ⛈️',
    crimeSceneDetails: [
      'Weather: Heavy monsoon storm with non-stop torrential downpour outside.',
      'Time of Theft: Between 2:00 PM and 3:00 PM.',
      'The bedroom window was locked from the inside.',
    ],
    crimeSceneDetailsTa: [
      'வானிலை: வெளியே இடி மின்னலுடன் விடாமல் கனமழை பெய்து கொண்டிருந்தது.',
      'திருட்டு நடந்த நேரம்: மதியம் 2:00 மணி முதல் 3:00 மணி வரை.',
      'படுக்கையறை ஜன்னல் உள்பக்கமாக தாழிடப்பட்டிருந்தது.',
    ],
    crimeSceneDetailsFr: [
      'Météo : Violente tempête de mousson avec pluie battante incessante dehors.',
      'Heure du vol : Entre 14h00 et 15h00.',
      'La fenêtre de la chambre était verrouillée de l’intérieur.',
    ],
    crimeSceneDetailsEs: [
      'Clima: Fuerte tormenta monzónica con lluvia torrencial sin cesar afuera.',
      'Hora del robo: Entre las 14:00 y las 15:00 horas.',
      'La ventana del dormitorio estaba cerrada por dentro.',
    ],
    crimeSceneDetailsHi: [
      'मौसम: बाहर बिजली कड़कने के साथ लगातार मूसलाधार बारिश हो रही थी।',
      'चोरी का समय: दोपहर 2:00 से 3:00 बजे के बीच।',
      'कमरे की खिड़की अंदर से बंद थी।',
    ],
    suspects: [
      {
        id: 0,
        name: 'Ramu',
        nameTa: 'ராமு (சமையல்காரர்)',
        nameFr: 'Ramu (Le Cuisinier)',
        nameEs: 'Ramu (El Cocinero)',
        nameHi: 'रामू (रसोइया)',
        role: 'Head Chef',
        roleTa: 'தலைமை சமையல்காரர்',
        roleFr: 'Chef Cuisinier',
        roleEs: 'Jefe de Cocina',
        roleHi: 'मुख्य रसोइया',
        avatar: '👨‍🍳',
        statement: 'I was in the kitchen boiling soup and baking fresh hot buns for lunch.',
        statementTa: 'நான் மதியம் முழுவதும் சமையலறையில் சூடான சூப்பும், ரொட்டியும் செய்து கொண்டிருந்தேன் ஐயா.',
        statementFr: 'J’étais en cuisine à préparer la soupe et cuire des petits pains chauds pour le déjeuner.',
        statementEs: 'Estuve en la cocina hirviendo sopa y horneando panecillos calientes para el almuerzo.',
        statementHi: 'मैं रसोई में गरमा-गरम सूप और रोटियाँ बना रहा था हुज़ूर।',
      },
      {
        id: 1,
        name: 'Velu',
        nameTa: 'வேலு (தோட்டக்காரர்)',
        nameFr: 'Velu (Le Jardinier)',
        nameEs: 'Velu (El Jardinero)',
        nameHi: 'वेलु (माली)',
        role: 'Gardener',
        roleTa: 'தோட்டக்காரர்',
        roleFr: 'Jardinier',
        roleEs: 'Jardinero',
        roleHi: 'माली',
        avatar: '👨‍🌾',
        statement:
          'I was busy out in the garden with the hose, watering all the rose bushes and jasmine plants.',
        statementTa:
          'மதியம் 2 மணிக்கு நான் தோட்டத்தில் உள்ள ரோஜா மற்றும் மல்லிகைச் செடிகளுக்கு குழாய் மூலம் தண்ணீர் ஊற்றிக் கொண்டிருந்தேன்!',
        statementFr:
          'J’étais occupé dans le jardin avec le tuyau d’arrosage à arroser tous les rosiers et jasmins.',
        statementEs:
          'Estuve ocupado en el jardín con la manguera, regando los rosales y los jazmines.',
        statementHi:
          'मैं दोपहर 2 बजे बगीचे में पाइप से गुलाब और चमेली के पौधों को पानी दे रहा था!',
      },
      {
        id: 2,
        name: 'Mani',
        nameTa: 'மணி (காவலாளி)',
        nameFr: 'Mani (Le Gardien)',
        nameEs: 'Mani (El Guardia)',
        nameHi: 'मणि (चौकीदार)',
        role: 'Gate Security Guard',
        roleTa: 'வாசல் காவலாளி',
        roleFr: 'Agent de Sécurité',
        roleEs: 'Guardia de Seguridad',
        roleHi: 'द्वारपाल',
        avatar: '👮‍♂️',
        statement: 'I was sitting inside the security cabin watching the front gate. Nobody entered.',
        statementTa: 'நான் வாசல் கேபினில் அமர்ந்து பிரதான வாயிலையே பார்த்துக் கொண்டிருந்தேன். யாரும் வரவில்லை.',
        statementFr: 'J’étais assis dans la guérite de sécurité à surveiller la grille principale. Personne n’est entré.',
        statementEs: 'Estuve sentado en la cabina de seguridad vigilando la puerta principal. Nadie entró.',
        statementHi: 'मैं सुरक्षा केबिन में बैठकर मुख्य द्वार पर नज़र रख रहा था। कोई अंदर नहीं आया।',
      },
    ],
    clues: [
      {
        label: 'Monsoon Weather',
        labelTa: 'அடைமழை வானிலை',
        labelFr: 'Pluie de Mousson',
        labelEs: 'Lluvia Monzónica',
        labelHi: 'मूसलाधार वर्षा',
        icon: '🌧️',
        description: 'Heavy rain was pouring all afternoon across the garden.',
        descriptionTa: 'மதியம் முழுவதும் தோட்டத்தில் பலத்த மழை கொட்டிக் கொண்டிருந்தது.',
        descriptionFr: 'Une forte pluie tombait tout l’après-midi sur le jardin.',
        descriptionEs: 'Llovía intensamente durante toda la tarde en el jardín.',
        descriptionHi: 'दोपहर भर बगीचे में ज़ोरदार बारिश हो रही थी।',
      },
      {
        label: 'Muddy Footsteps',
        labelTa: 'ஈரமான மண் தடம்',
        labelFr: 'Traces de Boue',
        labelEs: 'Huellas de Barro',
        labelHi: 'कीचड़ के निशान',
        icon: '👣',
        description: 'Wet garden soil traces leading toward the mansion back stairs.',
        descriptionTa: 'தோட்டத்தின் சேற்று மண் படிந்த காலடித் தடம் பின்கட்டு படிக்கட்டு வரை சென்றது.',
        descriptionFr: 'Des traces de terre humide du jardin mènent à l’escalier arrière.',
        descriptionEs: 'Huellas de tierra mojada del jardín llevan hacia la escalera trasera.',
        descriptionHi: 'गीली मिट्टी के पैरों के निशान हवेली की पिछली सीढ़ियों तक जा रहे थे।',
      },
    ],
    question: 'Who is the culprit behind the diamond heist?',
    questionTa: 'வைரத்தை திருடிய உண்மையான திருடன் யார் என்று கண்டுபிடியுங்கள்?',
    questionFr: 'Qui est le coupable derrière le vol du diamant ?',
    questionEs: '¿Quién es el culpable del robo del diamante?',
    questionHi: 'हीरा चुराने वाला असली चोर कौन है?',
    correctSuspectId: 1, // Velu
    mehulVerdict:
      'Gardener Velu is the thief! It was pouring rain outside—nobody waters rose bushes in the middle of a torrential downpour! His alibi is completely fabricated!',
    mehulVerdictTa:
      'தோட்டக்காரர் வேலுவே திருடன்! வெளியே அடைமழை வெளுத்து வாங்கும்போது, எந்த முட்டாள் செடிகளுக்கு தண்ணீர் ஊற்றிக் கொண்டிருப்பான்?! மாட்டிக்கொண்டான் வேலு!',
    mehulVerdictFr:
      'C’est le jardinier Velu le voleur ! Il pleuvait des cordes dehors : personne n’arrose les rosiers au beau milieu d’un déluge torrentiel ! Son alibi est entièrement inventé !',
    mehulVerdictEs:
      '¡El jardinero Velu es el ladrón! Estaba cayendo un diluvio afuera: ¡nadie riega rosales en medio de una lluvia torrencial! ¡Su coartada es totalmente falsa!',
    mehulVerdictHi:
      'माली वेलु ही चोर है! बाहर मूसलाधार बारिश हो रही थी—इतनी भारी बारिश में पौधों को पानी कौन देता है?! वेलु रंगे हाथों पकड़ा गया!',
    mehulCatchphraseTa: 'துப்பறியும் அருணனின் கண்ணில் எந்தத் திருடனும் தப்ப முடியாது!',
    mehulCatchphraseFr: 'Aucun criminel ne peut échapper à l’œil perçant du détective Arunan !',
    mehulCatchphraseEs: '¡Ningún criminal puede escapar a la aguda mirada del detective Arunan!',
    mehulCatchphraseHi: 'जासूस अरूनन की पैनी नज़र से कोई भी चोर बच नहीं सकता!',
  },

  // CASE 2: The Poisoned Iced Lemon Tea
  {
    id: 'case-2',
    caseNumber: 2,
    difficulty: 'medium',
    title: 'The Mystery of the Poisoned Iced Tea',
    titleTa: 'விஷம் கலந்த குளிர்பான மர்மம்',
    titleFr: 'Le Mystère du Thé Glacé Empoisonné',
    titleEs: 'El Misterio del Té Helado Envenenado',
    titleHi: 'ज़हरीली आइस्ड टी का रहस्य',
    synopsis:
      'On a scorching hot afternoon at a beachside cafe in Chennai, four friends ordered glasses of identical iced lemon tea. Priya drank 3 glasses quickly within 2 minutes. Anand sipped his single glass slowly over 40 minutes. Anand suddenly collapsed from poison, while Priya was completely unharmed! How did Priya survive?',
    synopsisTa:
      'சென்னைக் கடற்கரை விடுதியில் நண்பர்கள் நால்வர் குளிர்பானம் (Iced Tea) அருந்தினர். பிரியா ஒரே நிமிடத்தில் மடமடவென 3 கிளாஸ் குடித்தார். ஆனால் ஆனந்த் 40 நிமிடங்களாக மெதுவாக உறிஞ்சி குடித்தார். திடீரென ஆனந்துக்கு விஷம் ஏறி மயங்கினார்; பிரியாவுக்கு எதுவுமே ஆகவில்லை! பிரியா எப்படி தப்பினார்?',
    synopsisFr:
      'Par un après-midi brûlant dans un café en bord de plage à Chennai, quatre amis commandent du thé glacé au citron identique. Priya a bu 3 verres rapidement en 2 minutes. Anand a bu son unique verre lentement pendant 40 minutes. Anand s’effondre empoisonné, tandis que Priya n’a absolument rien ! Comment Priya a-t-elle survécu ?',
    synopsisEs:
      'En una tarde calurosa en un café frente a la playa en Chennai, cuatro amigos pidieron vasos idénticos de té helado con limón. Priya bebió 3 vasos en 2 minutos. Anand tomó su vaso lentamente durante 40 minutos. ¡Anand colapsó envenenado, mientras Priya resultó ilesa! ¿Cómo sobrevivió Priya?',
    synopsisHi:
      'चेन्नई के एक बीच कैफे में दोस्तों ने आइस्ड लेमन टी पी। प्रिया ने 2 मिनट में 3 गिलास पी लिए, जबकि आनंद ने 40 मिनट तक धीरे-धीरे पिया। अचानक आनंद ज़हर से बेहोश हो गया पर प्रिया को कुछ नहीं हुआ! प्रिया कैसे बची?',
    sceneVisualEmoji: '☕ 🧊 ☠️',
    crimeSceneDetails: [
      'Both drinks came from the exact same pitcher of freshly brewed tea.',
      'The poison was completely odorless and clear.',
      'Anand drank very slowly as the ice cubes melted.',
    ],
    crimeSceneDetailsTa: [
      'இருவரின் பானமும் ஒரே பாத்திரத்தில் இருந்து ஊற்றப்பட்டது.',
      'விஷம் எந்த வாசனையோ நிறமோ இல்லாதது.',
      'ஆனந்த் மெதுவாக குடித்ததால் ஐஸ் கட்டிகள் முழுமையாக உருகின.',
    ],
    crimeSceneDetailsFr: [
      'Les deux boissons provenaient de la même carafe de thé fraîchement infusé.',
      'Le poison était totalement inodore et transparent.',
      'Anand a bu très lentement à mesure que les glaçons fondaient.',
    ],
    crimeSceneDetailsEs: [
      'Ambas bebidas venían de la misma jarra de té recién preparado.',
      'El veneno era inodoro y transparente.',
      'Anand bebió muy despacio mientras los cubitos de hielo se derretían.',
    ],
    crimeSceneDetailsHi: [
      'दोनों गिलास एक ही जग से भरे गए थे।',
      'ज़हर पूरी तरह रंगहीन और गंधहीन था।',
      'आनंद बहुत धीरे-धीरे पी रहा था और बर्फ पिघलती गई।',
    ],
    suspects: [
      {
        id: 0,
        name: 'The Waiter secretly swapped Anand’s glass',
        nameTa: 'பரிமாறுபவர் ஆனந்தின் கிளாஸை மாற்றினார்',
        nameFr: 'Le serveur a discrètement échangé le verre',
        nameEs: 'El camarero cambió el vaso en secreto',
        nameHi: 'वेटर ने चोरी से आनंद का गिलास बदल दिया',
        role: 'Cafe Waiter',
        roleTa: 'விடுதி பணியாளர்',
        roleFr: 'Serveur de Café',
        roleEs: 'Camarero',
        roleHi: 'कैफे वेटर',
        avatar: '🤵',
        statement: 'I brought both glasses on the same tray straight to their table!',
        statementTa: 'நான் இரு கிளாஸ்களையும் ஒரே தட்டில்தான் வைத்து மேசைக்கு கொண்டு வந்தேன்!',
        statementFr: 'J’ai apporté les deux verres sur le même plateau directement à leur table !',
        statementEs: '¡Traje ambos vasos en la misma bandeja directo a la mesa!',
        statementHi: 'मैं दोनों गिलास एक ही ट्रे में लेकर सीधा मेज़ पर आया था!',
      },
      {
        id: 1,
        name: 'The poison was hidden inside the ice cubes',
        nameTa: 'விஷம் ஐஸ் கட்டிகளுக்குள் (Ice Cubes) உறைந்திருந்தது!',
        nameFr: 'Le poison était congelé dans les glaçons',
        nameEs: 'El veneno estaba dentro de los cubitos de hielo',
        nameHi: 'ज़हर बर्फ के टुकड़ों के अंदर जमा हुआ था',
        role: 'Detective Arunan’s Chemical Clue',
        roleTa: 'அருணனின் அறிவியல் துப்பு',
        roleFr: 'Indice Chimique de Arunan',
        roleEs: 'Pista Química de Arunan',
        roleHi: 'अरूनन का रासायनिक सुराग',
        avatar: '🧊',
        statement: 'Priya drank so fast before the ice melted; Anand waited until the poison melted!',
        statementTa:
          'பிரியா ஐஸ் உருகுவதற்கு முன்பே வேகமாக குடித்துவிட்டார்; ஆனந்த் குடித்தபோது ஐஸ் உருகி விஷம் கலந்தது!',
        statementFr:
          'Priya a bu avant que la glace ne fonde ; Anand a attendu que le poison se libère dans le verre !',
        statementEs:
          '¡Priya bebió antes de que el hielo se derritiera; Anand esperó hasta que el veneno se liberó!',
        statementHi:
          'प्रिया ने बर्फ पिघलने से पहले पी लिया; आनंद के पीते समय बर्फ पिघलकर ज़हर घुल गया!',
      },
      {
        id: 2,
        name: 'The lemon wedge had poison coating',
        nameTa: 'எலுமிச்சை பழத்தில் விஷம் தடவப்பட்டிருந்தது',
        nameFr: 'La tranche de citron était empoisonnée',
        nameEs: 'La rodaja de limón tenía veneno',
        nameHi: 'नींबू के टुकड़े पर ज़हर लगा था',
        role: 'Kitchen Clue',
        roleTa: 'சமையல் துப்பு',
        roleFr: 'Indice de Cuisine',
        roleEs: 'Pista de Cocina',
        roleHi: 'रसोई का सुराग',
        avatar: '🍋',
        statement: 'Only Anand squeezed the lemon slice into his glass.',
        statementTa: 'ஆனந்த் மட்டுமே எலுமிச்சையை கிளாசில் பிழிந்தார்.',
        statementFr: 'Seul Anand a pressé sa rondelle de citron dans son verre.',
        statementEs: 'Solo Anand exprimió la rodaja de limón en su vaso.',
        statementHi: 'केवल आनंद ने नींबू निचोड़ा था।',
      },
    ],
    clues: [
      {
        label: 'Floating Ice Cubes',
        labelTa: 'மிதக்கும் ஐஸ் கட்டிகள்',
        labelFr: 'Glaçons Flottants',
        labelEs: 'Cubitos de Hielo',
        labelHi: 'तैरती हुई बर्फ',
        icon: '🧊',
        description: 'Solid frozen cubes take 15-20 minutes to melt completely.',
        descriptionTa: 'கெட்டியான ஐஸ் கட்டிகள் உருக 15 முதல் 20 நிமிடங்கள் வரை ஆகும்.',
        descriptionFr: 'Les glaçons mettent 15 à 20 minutes pour fondre complètement.',
        descriptionEs: 'Los cubitos sólidos tardan 15 a 20 minutos en derretirse.',
        descriptionHi: 'बर्फ पिघलने में 15 से 20 मिनट का समय लगता है।',
      },
      {
        label: 'Speed of Drinking',
        labelTa: 'குடித்த வேகம்',
        labelFr: 'Vitesse de Boisson',
        labelEs: 'Velocidad al Beber',
        labelHi: 'पीने की गति',
        icon: '⚡',
        description: 'Priya finished her drinks in under 120 seconds.',
        descriptionTa: 'பிரியா 2 நிமிடங்களுக்குள்ளேயே முழு பானத்தையும் குடித்து முடித்தார்.',
        descriptionFr: 'Priya a terminé ses verres en moins de 120 secondes.',
        descriptionEs: 'Priya terminó sus bebidas en menos de 120 segundos.',
        descriptionHi: 'प्रिया ने 2 मिनट से भी कम समय में गिलास खत्म कर दिए थे।',
      },
    ],
    question: 'How did the poison affect only Anand?',
    questionTa: 'விஷம் ஆனந்தை மட்டும் தாக்கியதன் உண்மையான காரணம் என்ன?',
    questionFr: 'Comment le poison n’a-t-il affecté qu’Anand ?',
    questionEs: '¿Cómo afectó el veneno solo a Anand?',
    questionHi: 'ज़हर का असर केवल आनंद पर ही क्यों हुआ?',
    correctSuspectId: 1, // Poison in ice cubes
    mehulVerdict:
      'The poison was frozen inside the ice cubes! Priya drank her iced tea so rapidly that the ice cubes stayed solid, keeping the poison trapped. Anand drank slowly, letting the ice melt and releasing the lethal poison into the tea!',
    mehulVerdictTa:
      'சரியான கணிப்பு! விஷம் ஐஸ் கட்டிகளுக்குள் உறைந்திருந்தது! பிரியா மின்னல் வேகத்தில் குடித்ததால் ஐஸ் உருகவே இல்லை; ஆனந்த் மெதுவாக குடித்ததால் ஐஸ் உருகி விஷம் பானத்தில் கரைந்தது! துப்பறியும் அருணனின் அறிவுக்கு இணை எதுவுமில்லை!',
    mehulVerdictFr:
      'Le poison était congelé dans les glaçons ! Priya a bu si rapidement que les glaçons sont restés solides. Anand a bu lentement, laissant fondre la glace et libérant le poison mortel dans son thé !',
    mehulVerdictEs:
      '¡El veneno estaba congelado en los cubitos de hielo! Priya bebió tan rápido que el hielo permaneció sólido. ¡Anand bebió despacio, el hielo se derritió y liberó el veneno!',
    mehulVerdictHi:
      'ज़हर बर्फ के टुकड़ों के भीतर जमा हुआ था! प्रिया ने इतनी तेज़ी से पिया कि बर्फ पिघली ही नहीं, जबकि आनंद के धीरे-धीरे पीने से बर्फ पिघल गई और ज़हर चाय में घुल गया!',
    mehulCatchphraseTa: 'அருணனின் மூளைக்கு முன்னால் எந்த மர்மமும் மண்டியிட வேண்டும்!',
    mehulCatchphraseFr: 'Aucun mystère ne résiste à la sagacité du détective Arunan !',
    mehulCatchphraseEs: '¡Ningún misterio puede resistir el ingenio del detective Arunan!',
    mehulCatchphraseHi: 'जासूस अरूनन की बुद्धिमानी के आगे हर रहस्य झुक जाता है!',
  },

  // CASE 3: Marina Beach Crutch Footprints
  {
    id: 'case-3',
    caseNumber: 3,
    difficulty: 'medium',
    title: 'The Marina Beach Footprints Lie',
    titleTa: 'மெரினா கடற்கரை மர்மக் காலடி',
    titleFr: 'Le Faux Témoignage de la Plage Marina',
    titleEs: 'La Falsa Huella en la Playa Marina',
    titleHi: 'मरीना बीच के पदचिह्नों का झूठ',
    synopsis:
      'A man named Kumar claimed he was walking with his wooden crutches on the soft sand of Marina Beach when a masked man pushed him and stole his bag of gold coins. Detective Arunan looked closely at the sand and immediately arrested Kumar for filing a fake police report! What did Arunan notice?',
    synopsisTa:
      'குமார் என்பவர் மெரினா கடற்கரை மணலில் ஊன்றுகோலுடன் நடந்து சென்றபோது, ஒருவன் தன் தங்கக் காசுகள் பையை பறித்துச் சென்றதாக புகார் கூறினார். மணலைப் பார்த்த துப்பறியும் அருணன் உடனே குமாரைக் கைது செய்தார்! அருணன் எதைக் கண்டுபிடித்தார்?',
    synopsisFr:
      'Un homme nommé Kumar prétendait marcher avec ses béquilles en bois sur le sable de la plage Marina lorsqu’un individu masqué l’a bousculé et lui a volé son sac de pièces d’or. Le détective Arunan a observé le sable et a aussitôt arrêté Kumar pour fausse déclaration ! Qu’a remarqué Arunan ?',
    synopsisEs:
      'Un hombre llamado Kumar afirmó que caminaba con sus muletas de madera por la arena de la playa Marina cuando un enmascarado lo empujó y le robó una bolsa de monedas de oro. ¡El detective Arunan miró la arena y lo arrestó por denuncia falsa! ¿Qué notó Arunan?',
    synopsisHi:
      'कुमार नामक व्यक्ति ने दावा किया कि वह बैसाखियों के सहारे मरीना बीच की रेत पर चल रहा था, तभी एक नकाबपोश ने उसे धक्का देकर सोने के सिक्कों का थैला छीन लिया। जासूस अरूनन ने रेत को ध्यान से देखा और तुरंत कुमार को झूठी शिकायत के आरोप में पकड़ लिया! अरूनन ने क्या देखा?',
    sceneVisualEmoji: '🏖️ 🩼 👣',
    crimeSceneDetails: [
      'The incident supposedly happened on undisturbed soft white sand.',
      'Kumar has a cast on his right leg and carries wooden crutches.',
      'Clear shoe tracks lead to the spot where he fell.',
    ],
    crimeSceneDetailsTa: [
      'சம்பவம் நடந்த இடம் மென்மையான கடற்கரை மணல் பரப்பு.',
      'குமார் தனது வலது காலில் கட்டு போட்டு ஊன்றுகோலுடன் வந்தார்.',
      'மணலில் அவர் நடந்து வந்த காலடித் தடங்கள் தெளிவாக பதிந்திருந்தன.',
    ],
    crimeSceneDetailsFr: [
      'L’incident s’est produit sur du sable blanc fin et intact.',
      'Kumar a un plâtre à la jambe droite et porte des béquilles en bois.',
      'Des traces de chaussures nettes mènent au lieu de la chute.',
    ],
    crimeSceneDetailsEs: [
      'El incidente ocurrió en arena suave y sin alterar.',
      'Kumar lleva yeso en la pierna derecha y usa muletas.',
      'Huellas claras de zapatos conducen al lugar de la caída.',
    ],
    crimeSceneDetailsHi: [
      'घटना स्थल समुद्र तट की कोमल और साफ रेत थी।',
      'कुमार के दाहिने पैर पर प्लास्टर था और वह लकड़ी की बैसाखी लिए था।',
      'रेत पर गिरने के स्थान तक जूतों के स्पष्ट निशान थे।',
    ],
    suspects: [
      {
        id: 0,
        name: 'The footprints showed running, not walking',
        nameTa: 'காலடிகள் ஓடிய தடத்தைக் காட்டின',
        nameFr: 'Les empreintes montraient une course, pas une marche',
        nameEs: 'Las huellas mostraban que iba corriendo, no caminando',
        nameHi: 'पैरों के निशान चलने के नहीं बल्कि भागने के थे',
        role: 'Sand Track Clue',
        roleTa: 'மணல் தடம்',
        roleFr: 'Trace sur le Sable',
        roleEs: 'Pista de Arena',
        roleHi: 'रेत का निशान',
        avatar: '🏃',
        statement: 'He ran away from the thief.',
        statementTa: 'அவர் திருடனிடமிருந்து தப்பித்து வேகமாக ஓடினார்.',
        statementFr: 'Il fuyait le voleur en courant.',
        statementEs: 'Huyó del ladrón a toda prisa.',
        statementHi: 'वह चोर से बचने के लिए भागा।',
      },
      {
        id: 1,
        name: 'There were shoe footprints, but ZERO crutch holes in the sand!',
        nameTa: 'காலடித் தடம் மட்டுமே இருந்தது; ஊன்றுகோல் பதிந்த துளைகளே இல்லை!',
        nameFr: 'Il y avait des pas, mais AUCUN trou de béquille dans le sable !',
        nameEs: '¡Había pisadas, pero CERO marcas de muletas en la arena!',
        nameHi: 'जूतों के निशान थे, पर रेत में बैसाखी का एक भी गड्ढा नहीं था!',
        role: 'Physical Evidence',
        roleTa: 'நேரடி சான்று',
        roleFr: 'Preuve Matérielle',
        roleEs: 'Evidencia Física',
        roleHi: 'ठोस सबूत',
        avatar: '🩼',
        statement: 'A person on crutches must leave round circular indentations beside each step!',
        statementTa:
          'ஊன்றுகோல் வைத்து நடப்பவர் மணலில் நடந்தால் ஊன்றுகோலின் வட்டக் குழிகள் விழுந்திருக்க வேண்டும்; ஆனால் இரண்டு காலடிகளும் சமமாக இருந்தன!',
        statementFr:
          'Une personne en béquilles laisse obligatoirement des trous circulaires à chaque pas !',
        statementEs:
          '¡Alguien con muletas deja hoyos redondos junto a cada pisada en la arena suave!',
        statementHi:
          'बैसाखी से चलने वाले के हर कदम के साथ रेत में गोल गड्ढे बनने ही चाहिए थे!',
      },
      {
        id: 2,
        name: 'The gold coins were too heavy to carry on beach',
        nameTa: 'தங்கக் காசுகளின் எடை மணலில் தூக்க முடியாத அளவு அதிகம்',
        nameFr: 'Les pièces d’or étaient trop lourdes à transporter',
        nameEs: 'Las monedas eran demasiado pesadas para llevarlas en la playa',
        nameHi: 'सोने के सिक्के इतने भारी थे कि रेत पर चलना असंभव था',
        role: 'Weight Theory',
        roleTa: 'எடை கொள்கை',
        roleFr: 'Hypothèse du Poids',
        roleEs: 'Teoría del Peso',
        roleHi: 'वज़न का तर्क',
        avatar: '💰',
        statement: 'Nobody can walk with that much gold.',
        statementTa: 'அவ்வளவு எடையுடன் மணலில் நடக்க முடியாது.',
        statementFr: 'Personne ne peut marcher avec autant d’or.',
        statementEs: 'Nadie puede caminar con tanto oro.',
        statementHi: 'इतने सोने के साथ कोई नहीं चल सकता।',
      },
    ],
    clues: [
      {
        label: 'Sand Impressions',
        labelTa: 'மணல் பதிவுகள்',
        labelFr: 'Empreintes de Sable',
        labelEs: 'Marcas en la Arena',
        labelHi: 'रेत पर निशान',
        icon: '🔍',
        description: 'Wet and dry sand accurately captures every point of contact.',
        descriptionTa: 'மணலில் ஊன்றப்படும் ஊன்றுகோல் ஆழமான வட்டப் பள்ளத்தை உருவாக்கும்.',
        descriptionFr: 'Le sable fin capture fidèlement chaque point de contact.',
        descriptionEs: 'La arena suave registra con fidelidad cada punto de contacto.',
        descriptionHi: 'रेत पर पड़ने वाला हर दबाव साफ़ दिखाई देता है।',
      },
    ],
    question: 'How did Detective Arunan prove Kumar’s story was 100% fake?',
    questionTa: 'குமார் கூறியது அப்பட்டமான பொய் என்பதை அருணன் எப்படி நிரூபித்தார்?',
    questionFr: 'Comment le détective Arunan a-t-il prouvé que l’histoire de Kumar était fausse ?',
    questionEs: '¿Cómo demostró Arunan que la historia de Kumar era totalmente falsa?',
    questionHi: 'अरूनन ने कैसे साबित किया कि कुमार की कहानी 100% झूठी थी?',
    correctSuspectId: 1, // Zero crutch holes
    mehulVerdict:
      'If Kumar was genuinely walking on crutches on soft beach sand, there would be deep circular holes next to every footprint! The sand showed two healthy feet walking normally with zero crutch marks. Kumar faked the injury and hid the gold for insurance fraud!',
    mehulVerdictTa:
      'அற்புதம்! ஊன்றுகோல் வைத்து மென்மையான மணலில் நடந்தால் ஊன்றுகோலின் குழிகள் மணலில் விழுந்திருக்க வேண்டும்! அங்கே இரண்டு பாதங்களின் காலடி மட்டுமே பதிந்திருந்தது. குமார் ஊன்றுகோலை கையில் பிடித்துக் கொண்டு காலால் நடந்து வந்து நாடகமாடியுள்ளார்!',
    mehulVerdictFr:
      'Si Kumar marchait réellement avec des béquilles sur le sable, il y aurait eu de profonds trous circulaires à chaque pas ! Il n’y avait que deux pieds normaux. Kumar simulait pour escroquer l’assurance !',
    mehulVerdictEs:
      '¡Si Kumar hubiera caminado con muletas por la arena suave, habría hoyos circulares profundos junto a cada pisada! Solo había dos pies caminando normalmente. ¡Kumar fingió para cobrar el seguro!',
    mehulVerdictHi:
      'अगर कुमार वास्तव में रेत पर बैसाखी के सहारे चल रहा होता, तो हर कदम के साथ गोल गड्ढे होते! रेत पर सिर्फ दो स्वस्थ पैरों के निशान थे। कुमार ने बीमा हड़पने के लिए झूठी कहानी गढ़ी थी!',
    mehulCatchphraseTa: 'மணல் மீது காலடி பொய் சொல்லாது! அருணனின் தீர்ப்பு துல்லியமானது!',
    mehulCatchphraseFr: 'Les traces de pas ne mentent jamais ! La déduction de Arunan est implacable !',
    mehulCatchphraseEs: '¡Las huellas en la arena nunca mienten! ¡El veredicto de Arunan es infalible!',
    mehulCatchphraseHi: 'रेत पर निशान कभी झूठ नहीं बोलते! अरूनन का फ़ैसला सटीक है!',
  },

  // CASE 4: The Mirror Clock Alibi
  {
    id: 'case-4',
    caseNumber: 4,
    difficulty: 'hard',
    title: 'The Mirror Clock Photo Alibi',
    titleTa: 'கண்ணாடி சுவர்க்கடிகார மர்மம்',
    titleFr: 'L’Alibi du Miroir et de l’Horloge',
    titleEs: 'La Coartada del Reloj en el Espejo',
    titleHi: 'आईने में घड़ी का झूठा बहाना',
    synopsis:
      'A luxury electronics warehouse in Madurai was robbed at exactly 8:15 PM. Suspect Dinesh presented an alibi selfie showing himself eating biryani at a famous hotel, pointing to the wall clock behind him clearly showing 8:15 PM. Detective Arunan smiled and handcuffed him on the spot! Why?',
    synopsisTa:
      'மதுரையில் உள்ள மின்னணு கிடங்கு இரவு 8:15 மணிக்கு கொள்ளையடிக்கப்பட்டது. சந்தேக நபரான தினேஷ், தான் அதே நேரத்தில் உணவகத்தில் பிரியாணி சாப்பிட்டதாக ஒரு செல்ஃபி புகைப்படத்தைக் காட்டினார். பின்னணியில் இருந்த கடிகாரம் 8:15 எனக் காட்டியது. அதைப் பார்த்த அருணன் புன்னகையுடன் அவரை கைது செய்தார்! ஏன்?',
    synopsisFr:
      'Un entrepôt électronique de luxe à Madurai a été cambriolé à 20h15 précises. Le suspect Dinesh a présenté un selfie où on le voit manger un biryani, pointant une horloge murale marquant 20h15. Le détective Arunan a souri et l’a menotté sur place ! Pourquoi ?',
    synopsisEs:
      'Un almacén en Madurai fue asaltado exactamente a las 8:15 PM. El sospechoso Dinesh presentó una selfie comiendo biryani señalando un reloj de pared que marcaba las 8:15 PM. ¡El detective Arunan sonrió y lo arrestó de inmediato! ¿Por qué?',
    synopsisHi:
      'मदुरै के गोदाम में रात 8:15 बजे चोरी हुई। संदिग्ध दिनेश ने एक सेल्फी दिखाई जिसमें वह बिरयानी खा रहा था और पीछे दीवार घड़ी में 8:15 बज रहे थे। अरूनन ने मुस्कुराकर उसे तुरंत गिरफ़्तार कर लिया! क्यों?',
    sceneVisualEmoji: '📸 🕰️ 🪞',
    crimeSceneDetails: [
      'The selfie was taken in the hotel mirror.',
      'The clock in the reflection showed the hour hand pointing to 8 and minute hand to 3.',
      'Phones flip images when taken as front-camera mirror selfies.',
    ],
    crimeSceneDetailsTa: [
      'செல்ஃபி புகைப்படம் உணவகத்தின் பெரிய கண்ணாடியைப் பார்த்து எடுக்கப்பட்டது.',
      'கண்ணாடியில் தெரியும் கடிகாரத்தில் முட்கள் 8:15 போல் தோன்றின.',
      'கண்ணாடியின் பிம்பம் இடவல மாற்றத்திற்கு (Lateral Inversion) உட்படும்.',
    ],
    crimeSceneDetailsFr: [
      'Le selfie a été pris face au grand miroir du restaurant.',
      'L’horloge dans le reflet semblait indiquer 8h15.',
      'Les miroirs inversent horizontalement la gauche et la droite.',
    ],
    crimeSceneDetailsEs: [
      'La selfie fue tomada frente al espejo del hotel.',
      'El reloj en el reflejo parecía marcar las 8:15.',
      'Los espejos invierten la izquierda y la derecha.',
    ],
    crimeSceneDetailsHi: [
      'सेल्फी होटल के बड़े आईने में ली गई थी।',
      'आईने के प्रतिबिंब में घड़ी 8:15 जैसी दिख रही थी।',
      'आईने में दाएँ और बाएँ का पार्श्व परिवर्तन (Lateral Inversion) होता है।',
    ],
    suspects: [
      {
        id: 0,
        name: 'The clock battery was dead',
        nameTa: 'கடிகாரத்தில் பேட்டரி இல்லை',
        nameFr: 'La pile de l’horloge était à plat',
        nameEs: 'La pila del reloj estaba agotada',
        nameHi: 'घड़ी की बैटरी खत्म हो चुकी थी',
        role: 'Suspect Theory A',
        roleTa: 'விருப்பம் அ',
        roleFr: 'Hypothèse A',
        roleEs: 'Teoría A',
        roleHi: 'तर्क क',
        avatar: '🔋',
        statement: 'The clock has been stuck on 8:15 for months.',
        statementTa: 'அந்த கடிகாரம் பல மாதங்களாக ஓடாமல் நின்றிருந்தது.',
        statementFr: 'Cette horloge est bloquée sur 8h15 depuis des mois.',
        statementEs: 'Ese reloj lleva meses detenido en las 8:15.',
        statementHi: 'घड़ी महीनों से 8:15 पर ही रुकी हुई थी।',
      },
      {
        id: 1,
        name: 'In a mirror reflection, 8:15 is actually 3:45 PM!',
        nameTa: 'கண்ணாடியின் எதிரொலிப்பில் 8:15 என்பது உண்மையில் 3:45 மணி!',
        nameFr: 'Dans un miroir, 8h15 correspond en réalité à 15h45 !',
        nameEs: '¡En el reflejo de un espejo, las 8:15 son en realidad las 3:45!',
        nameHi: 'आईने के प्रतिबिंब में 8:15 का अर्थ वास्तव में दोपहर 3:45 बजना है!',
        role: 'Optical Deduction',
        roleTa: 'ஒளியியல் துப்பு',
        roleFr: 'Déduction Optique',
        roleEs: 'Deducción Óptica',
        roleHi: 'ऑप्टिकल सुराग',
        avatar: '🪞',
        statement: 'Mirror laterally inverts clock hands! Real time was 3:45 PM in the afternoon!',
        statementTa:
          'கண்ணாடியில் தெரியும் பிம்பம் தலைகீழானது (இடவலம் மாறும்)! கண்ணாடியில் 8:15 ஆக தெரிவது உண்மையில் மதியம் 3:45 மணி!',
        statementFr:
          'Le miroir inverse les aiguilles ! L’heure réelle était 15h45 l’après-midi !',
        statementEs:
          '¡El espejo invierte las manecillas! ¡La hora real era las 3:45 de la tarde!',
        statementHi:
          'आईने में घड़ी की सुइयाँ उल्टी दिखती हैं! असली समय दोपहर के 3:45 बज रहे थे!',
      },
      {
        id: 2,
        name: 'The biryani plate was empty',
        nameTa: 'பிரியாணி தட்டு காலியாக இருந்தது',
        nameFr: 'L’assiette était déjà vide',
        nameEs: 'El plato de comida estaba vacío',
        nameHi: 'बिरयानी की थाली खाली थी',
        role: 'Food Clue',
        roleTa: 'விருப்பம் இ',
        roleFr: 'Indice Repas',
        roleEs: 'Pista de Comida',
        roleHi: 'खाने का तर्क',
        avatar: '🍛',
        statement: 'Nobody eats biryani at 8:15 PM.',
        statementTa: 'அவர் சாப்பிட்ட உணவு மதிய உணவு.',
        statementFr: 'Personne ne mange de biryani à cette heure.',
        statementEs: 'Nadie come biryani a esa hora.',
        statementHi: 'उस समय कोई खाना नहीं खाता।',
      },
    ],
    clues: [
      {
        label: 'Lateral Inversion',
        labelTa: 'இடவல மாற்றம்',
        labelFr: 'Inversion Latérale',
        labelEs: 'Inversión Lateral',
        labelHi: 'पार्श्व परिवर्तन',
        icon: '🪞',
        description: 'Mirrors swap left and right. 12:00 - 8:15 reflection gives 3:45.',
        descriptionTa: 'கண்ணாடியில் முட்கள் இடம் மாறும். 8:15 கண்ணாடியில் தெரிந்தால் உண்மை நேரம் 3:45!',
        descriptionFr: 'Le miroir inverse la gauche et la droite. Le reflet de 8h15 donne 3h45.',
        descriptionEs: 'El espejo invierte izquierda y derecha. El reflejo de 8:15 es 3:45.',
        descriptionHi: 'आईने में बायाँ-दायाँ बदल जाता है। 8:15 का प्रतिबिंब असल में 3:45 होता है।',
      },
    ],
    question: 'Why did the photo alibi prove Dinesh was guilty?',
    questionTa: 'அந்த செல்ஃபி புகைப்படம் தினேஷை எப்படி சிக்க வைத்தது?',
    questionFr: 'Pourquoi la photo prouve-t-elle la culpabilité de Dinesh ?',
    questionEs: '¿Por qué la selfie demuestra que Dinesh es culpable?',
    questionHi: 'उस सेल्फी से कैसे साबित हुआ कि दिनेश ही दोषी है?',
    correctSuspectId: 1, // Mirror reflection = 3:45
    mehulVerdict:
      'Because the selfie was taken facing a mirror! In a mirror, the hands of an analog clock are laterally reversed: an apparent 8:15 is actually 3:45 in the afternoon! Dinesh took the picture hours before the heist to create a fake alibi!',
    mehulVerdictTa:
      'சபாஷ்! கண்ணாடி இடவல மாற்றம் செய்யும்! கண்ணாடியில் 8:15 எனத் தெரிவது உண்மையில் மதியம் 3:45 மணி! இரவில் திருடிவிட்டு, மதியம் எடுத்த புகைப்படத்தைக் காட்டி தப்பிக்க நினைத்தான் தினேஷ்! துப்பறியும் அருணன் அவனது தந்திரத்தை உடைத்துவிட்டார்!',
    mehulVerdictFr:
      'Parce que le selfie a été pris devant un miroir ! Les aiguilles y sont inversées : un 8h15 apparent correspond en réalité à 15h45 de l’après-midi ! Dinesh a pris la photo bien avant pour fabriquer un alibi !',
    mehulVerdictEs:
      '¡Porque la selfie fue tomada frente a un espejo! Las manecillas se invierten: ¡un aparente 8:15 es en realidad las 3:45 de la tarde! Dinesh tomó la foto horas antes para fabricar su coartada.',
    mehulVerdictHi:
      'क्योंकि सेल्फी आईने के सामने ली गई थी! आईने में सुइयाँ उल्टी दिखती हैं: 8:15 जैसा दिखने वाला समय असल में दोपहर 3:45 था! दिनेश ने चोरी से कई घंटे पहले फोटो खींचकर झूठा बहाना बनाया था!',
    mehulCatchphraseTa: 'கண்ணாடியின் பிம்பம் கூட அருணனின் அறிவை ஏமாற்ற முடியாது!',
    mehulCatchphraseFr: 'Même le reflet d’un miroir ne peut tromper le détective Arunan !',
    mehulCatchphraseEs: '¡Ni el reflejo de un espejo puede engañar al detective Arunan!',
    mehulCatchphraseHi: 'आईने का प्रतिबिंब भी अरूनन की पैनी नज़र को चकमा नहीं दे सकता!',
  },

  // CASE 5: The Birthday Cake Mystery (Kid Special!)
  {
    id: 'case-5',
    caseNumber: 5,
    difficulty: 'easy',
    title: 'The Birthday Cake Chocolate Bandit',
    titleTa: 'பிறந்தநாள் கேக் திருடன் யார்?',
    titleFr: 'Le Mystère du Gâteau d’Anniversaire',
    titleEs: 'El Ladrón del Pastel de Cumpleaños',
    titleHi: 'जन्मदिन के केक का चोर कौन?',
    synopsis:
      'At young Kavin’s 7th birthday party in Coimbatore, the grand two-tier chocolate truffle cake with bright blue frosting was locked inside the pantry. Just before candle cutting, a giant slice was eaten! Three mischievous cousins claim they never touched the cake. Detective Arunan examined them and caught the culprit in 5 seconds! Who was it?',
    synopsisTa:
      'கோவை பிறந்தநாள் விழாவில், நீல நிற கிரீம் பூசப்பட்ட சாக்லேட் கேக்கின் ஒரு பெரிய துண்டு மாயமானது! மூன்று சுட்டி குழந்தைகள் "நான் கேக்கை தொடவே இல்லை" என்று சாதித்தனர். துப்பறியும் அருணன் 5 நொடியில் உண்மையான கேக் திருடனைக் கண்டுபிடித்தார்! யார் அவர்?',
    synopsisFr:
      'Lors de l’anniversaire du petit Kavin à Coimbatore, un énorme gâteau au chocolat nappé de crème bleu vif était enfermé dans le garde-manger. Juste avant de souffler les bougies, une grosse part a disparu ! Trois cousins affirment n’avoir rien touché. Le détective Arunan a démasqué le coupable en 5 secondes ! Qui est-ce ?',
    synopsisEs:
      'En el cumpleaños de Kavin en Coimbatore, un gran pastel de chocolate con crema azul brillante estaba guardado en la despensa. ¡Justo antes de cortar las velas, faltaba un gran pedazo! Tres primos juran no haberlo tocado. El detective Arunan descubrió al culpable en 5 segundos. ¿Quién fue?',
    synopsisHi:
      'कोयंबटूर में कविन के जन्मदिन पर नीली क्रीम वाला बड़ा चॉकलेट केक कमरे में रखा था। मोमबत्ती बुझाने से ठीक पहले किसी ने बड़ा टुकड़ा खा लिया! तीनों बच्चों ने कहा कि उन्होंने छुआ भी नहीं। जासूस अरूनन ने 5 सेकंड में असली चोर को पकड़ लिया! वह कौन था?',
    sceneVisualEmoji: '🎂 🎈 🕵️‍♂️',
    crimeSceneDetails: [
      'The cake had rich dark chocolate and bright royal-blue vanilla frosting.',
      'A small napkin near the cake had blue stains.',
      'The cake was eaten with bare hands, no spoon was used.',
    ],
    crimeSceneDetailsTa: [
      'கேக்கில் அடர் சாக்லேட்டும் பிரகாசமான நீல நிற வெண்ணிலா கிரீமும் இருந்தது.',
      'கேக் தட்டில் நீல நிற கிரீம் விரல் ரேகை பதிந்திருந்தது.',
      'ஸ்பூன் இன்றி கைகளாலேயே கேக் சாப்பிடப்பட்டிருந்தது.',
    ],
    crimeSceneDetailsFr: [
      'Le gâteau avait un glaçage vanille d’un bleu éclatant.',
      'Une serviette près du gâteau portait des taches bleues.',
      'Le gâteau a été mangé directement avec les doigts.',
    ],
    crimeSceneDetailsEs: [
      'El pastel tenía una crema azul brillante muy llamativa.',
      'Había una servilleta con manchas azules junto al pastel.',
      'El pastel fue comido con las manos, sin cuchara.',
    ],
    crimeSceneDetailsHi: [
      'केक पर गाढ़ी नीली क्रीम लगी हुई थी।',
      'पास में पड़े टिशू पेपर पर नीले रंग के निशान थे।',
      'केक बिना चम्मच के सीधे हाथों से खाया गया था।',
    ],
    suspects: [
      {
        id: 0,
        name: 'Arjun',
        nameTa: 'அர்ஜுன்',
        nameFr: 'Arjun',
        nameEs: 'Arjun',
        nameHi: 'अर्जुन',
        role: 'Cousin 1',
        roleTa: 'சுட்டி பையன் 1',
        roleFr: 'Cousin 1',
        roleEs: 'Primo 1',
        roleHi: 'पहला बच्चा',
        avatar: '👦',
        statement: 'I was outside playing cricket with the tennis ball. My hands are dirty from the ball!',
        statementTa: 'நான் தோட்டத்தில் கிரிக்கெட் விளையாடிக் கொண்டிருந்தேன். கையில் பந்து புழுதிதான் ஒட்டியுள்ளது!',
        statementFr: 'Je jouais dehors au cricket. Mes mains sont pleines de poussière !',
        statementEs: 'Estaba afuera jugando cricket. ¡Mis manos tienen tierra de la pelota!',
        statementHi: 'मैं बाहर क्रिकेट खेल रहा था। मेरे हाथों पर सिर्फ धूल लगी है!',
      },
      {
        id: 1,
        name: 'Kavin Jr.',
        nameTa: 'கவின் குட்டி',
        nameFr: 'Petit Kavin',
        nameEs: 'Kavin Jr.',
        nameHi: 'छोटा कविन',
        role: 'Cousin 2',
        roleTa: 'சுட்டி பையன் 2',
        roleFr: 'Cousin 2',
        roleEs: 'Primo 2',
        roleHi: 'दूसरा बच्चा',
        avatar: '🧒',
        statement:
          'I was watching cartoons the whole time! But my tongue and fingers are stained bright BLUE!',
        statementTa:
          'நான் கார்ட்டூன் தான் பார்த்துக் கொண்டிருந்தேன்! (ஆனால் அவனது நாக்கும் விரல்களும் நீல நிற கிரீமால் பளபளத்தன!)',
        statementFr:
          'Je regardais des dessins animés ! (Mais sa langue et ses doigts sont tout BLEUS !)',
        statementEs:
          '¡Estuve viendo dibujos animados! (¡Pero su lengua y dedos están manchados de AZUL!)',
        statementHi:
          'मैं तो कार्टून देख रहा था! (पर उसकी जीभ और उंगलियाँ नीले रंग से रंगी थीं!)',
      },
      {
        id: 2,
        name: 'Nisha',
        nameTa: 'நிஷா',
        nameFr: 'Nisha',
        nameEs: 'Nisha',
        nameHi: 'निशा',
        role: 'Cousin 3',
        roleTa: 'சுட்டி பெண் 3',
        roleFr: 'Cousine 3',
        roleEs: 'Prima 3',
        roleHi: 'तीसरी बच्ची',
        avatar: '👧',
        statement: 'I was blowing up balloons for the stage. My mouth is tired!',
        statementTa: 'நான் மேடை அலங்காரத்திற்காக பலூன்களை ஊதிக் கொண்டிருந்தேன்.',
        statementFr: 'Je gonflais des ballons pour la fête. J’ai mal aux joues !',
        statementEs: 'Estuve inflando globos para la fiesta. ¡Me duelen las mejillas!',
        statementHi: 'मैं सजावट के लिए गुब्बारे फुला रही थी।',
      },
    ],
    clues: [
      {
        label: 'Blue Frosting Stain',
        labelTa: 'நீல நிற கிரீம் கறை',
        labelFr: 'Glaçage Bleu',
        labelEs: 'Mancha Azul',
        labelHi: 'नीली क्रीम का निशान',
        icon: '🧁',
        description: 'Bright blue food color stains skin and tongue for hours.',
        descriptionTa: 'நீல நிற கிரீம் சாப்பிட்டால் நாக்கிலும் விரலிலும் உடனே நீல சாயம் ஒட்டிக்கொள்ளும்.',
        descriptionFr: 'Le colorant bleu tache la langue et les doigts pendant des heures.',
        descriptionEs: 'El colorante azul mancha la piel y la lengua durante horas.',
        descriptionHi: 'नीला रंग घंटों तक जीभ और उंगलियों पर चढ़ा रहता है।',
      },
    ],
    question: 'Who ate the secret slice of the birthday cake?',
    questionTa: 'பிறந்தநாள் கேக்கை திருடித் தின்ற சுட்டி யார்?',
    questionFr: 'Qui a mangé la part secrète du gâteau ?',
    questionEs: '¿Quién se comió el pedazo de pastel?',
    questionHi: 'केक का टुकड़ा किसने चुराकर खाया?',
    correctSuspectId: 1, // Kavin Jr with blue tongue
    mehulVerdict:
      'Kavin Jr. ate the cake! The frosting was bright blue, and his mouth and fingers were covered in blue cream! You can’t hide sweet evidence from Detective Arunan!',
    mehulVerdictTa:
      'கவின் குட்டிதான் கேக்கை ருசித்து சாப்பிட்ட திருடன்! நீல நிற கிரீம் அவனது உதட்டிலும் விரல்களிலும் அப்பட்டமாக ஒட்டியிருந்தது! துப்பறியும் அருணன் சிரித்துக்கொண்டே கண்டுபிடித்துவிட்டார்!',
    mehulVerdictFr:
      'C’est le petit Kavin qui a mangé le gâteau ! La crème était bleu vif et ses doigts comme sa langue en étaient recouverts ! Impossible de tromper le détective Arunan !',
    mehulVerdictEs:
      '¡Kavin Jr. se comió el pastel! ¡La crema era azul brillante y su boca y dedos estaban cubiertos de azul! ¡No puedes ocultarle pruebas dulces a Arunan!',
    mehulVerdictHi:
      'छोटे कविन ने ही केक खाया था! केक की नीली क्रीम उसकी जीभ और उंगलियों पर साफ़ दिखाई दे रही थी! जासूस अरूनन से कोई सबूत नहीं छिप सकता!',
    mehulCatchphraseTa: 'சுவையான கேக்காக இருந்தாலும், துப்பறியும் மெஹுலுக்கு அது துப்பு மட்டுமே!',
    mehulCatchphraseFr: 'Même le plus doux des gâteaux laisse une trace indélébile !',
    mehulCatchphraseEs: '¡Hasta el dulce más delicioso deja su rastro!',
    mehulCatchphraseHi: 'चाहे कितना भी मीठा केक हो, अरूनन की नज़र से सबूत नहीं बचता!',
  },

  // CASE 6: The Midnight Museum Window Heist
  {
    id: 'case-6',
    caseNumber: 6,
    difficulty: 'hard',
    title: 'The Midnight Museum Window Heist',
    titleTa: 'அருங்காட்சியக தங்கச் சிலை திருட்டு',
    titleFr: 'Le Cambriolage du Musée de Minuit',
    titleEs: 'El Robo de Medianoche en el Museo',
    titleHi: 'संग्रहालय की आधी रात की चोरी',
    synopsis:
      'A golden Chola idol vanished from the Thanjavur Heritage Museum at midnight. The night guard claimed an external burglar threw a heavy brick through the display window from the street outside to break in and rob the statue. Detective Arunan examined the window and arrested the guard on the spot! How did Arunan know the guard was lying?',
    synopsisTa:
      'தஞ்சாவூர் அருங்காட்சியகத்தில் இருந்த சோழர் காலத்து தங்கச் சிலை நள்ளிரவில் மாயமானது. வெளியிலிருந்து வந்த திருடன் தெருவில் நின்று ஜன்னல் மீது செங்கல்லை வீசி கண்ணாடியை உடைத்து உள்ளே வந்து திருடியதாக காவலாளி கூறினார். ஜன்னலைப் பார்த்த அருணன் உடனே காவலாளியைக் கைது செய்தார்! எப்படி?',
    synopsisFr:
      'Une idole d’or a disparu du musée du patrimoine de Thanjavur à minuit. Le gardien affirme qu’un cambrioleur a jeté une brique depuis la rue pour briser la vitre et voler la statue. Le détective Arunan a examiné la fenêtre et a arrêté le gardien sur place ! Pourquoi ?',
    synopsisEs:
      'Una valiosa estatua de oro desapareció del museo a medianoche. El guardia afirmó que un ladrón lanzó un ladrillo desde la calle rompiendo la ventana para entrar. ¡El detective Arunan miró la ventana y arrestó al guardia de inmediato! ¿Cómo lo supo?',
    synopsisHi:
      'तंजौर संग्रहालय से आधी रात को सोने की मूर्ति गायब हो गई। गार्ड ने कहा कि किसी चोर ने बाहर सड़क से ईंट फेंककर खिड़की का शीशा तोड़ा और अंदर घुस आया। अरूनन ने खिड़की देखी और तुरंत गार्ड को गिरफ़्तार कर लिया! अरूनन को कैसे पता चला?',
    sceneVisualEmoji: '🏛️ 🪟 🏺',
    crimeSceneDetails: [
      'The glass window is large and double-layered.',
      'A heavy brick was lying on the inside floor.',
      'All the shattered glass shards were lying on the OUTSIDE street, none inside!',
    ],
    crimeSceneDetailsTa: [
      'ஜன்னல் கண்ணாடி பெரிய இரட்டை அடுக்கு கண்ணாடி.',
      'ஒரு கனமான செங்கல் அருங்காட்சியகத்தின் உள்பக்க தரையில் கிடந்தது.',
      'உடைந்த கண்ணாடித் துண்டுகள் அனைத்தும் வெளிப்புறத் தெருவில் சிதறிக் கிடந்தன; உள்ளே ஒரு துண்டு கூட இல்லை!',
    ],
    crimeSceneDetailsFr: [
      'La fenêtre en verre est grande et à double vitrage.',
      'Une brique lourde gisait sur le sol à l’intérieur.',
      'Tous les éclats de verre étaient répandus DEHORS sur le trottoir, aucun dedans !',
    ],
    crimeSceneDetailsEs: [
      'La ventana es grande y de doble vidrio.',
      'Un ladrillo pesado yacía en el suelo interior.',
      '¡Todos los cristales rotos estaban afuera en la calle, ninguno adentro!',
    ],
    crimeSceneDetailsHi: [
      'खिड़की बड़ी और दोहरी कांच वाली थी।',
      'अंदर कमरे के फर्श पर एक भारी ईंट पड़ी थी।',
      'कांच के सारे टुकड़े बाहर सड़क पर बिखरे थे, अंदर एक भी टुकड़ा नहीं था!',
    ],
    suspects: [
      {
        id: 0,
        name: 'The glass shards fell OUTSIDE, proving the window was broken from INSIDE!',
        nameTa: 'கண்ணாடித் துண்டுகள் அனைத்தும் வெளியே விழுந்திருந்தன; கண்ணாடி உள்பக்கமிருந்தே உடைக்கப்பட்டது!',
        nameFr: 'Les éclats de verre sont tombés DEHORS, prouvant un bris depuis l’intérieur !',
        nameEs: '¡Los cristales cayeron AFUERA, demostrando que se rompió desde adentro!',
        nameHi: 'कांच बाहर गिरा था, यानी खिड़की अंदर से तोड़ी गई थी!',
        role: 'Forensic Physics',
        roleTa: 'தடய அறிவியல் உண்மை',
        roleFr: 'Physique Légale',
        roleEs: 'Física Forense',
        roleHi: 'फोरेंसिक सुराग',
        avatar: '🔍',
        statement: 'A brick thrown from outside pushes glass INWARD. Glass on the outside means it was smashed from within!',
        statementTa:
          'வெளியிலிருந்து செங்கல் வீசப்பட்டால் கண்ணாடி உள்பக்கம்தான் சிதறும்! ஆனால் கண்ணாடி முழுவதும் வெளியே சிதறி கிடந்ததால், உள்ளிருந்த காவலாளியே சிலையை திருடிவிட்டு நாடகமாடியுள்ளார்!',
        statementFr:
          'Un projectile venant de dehors projette le verre vers l’intérieur. Des éclats dehors prouvent un coup porté de l’intérieur !',
        statementEs:
          '¡Un ladrillo lanzado desde afuera empuja el vidrio hacia adentro! ¡Vidrios afuera significan que se golpeó desde el interior!',
        statementHi:
          'बाहर से ईंट फेंकने पर कांच अंदर गिरता। कांच बाहर बिखरा था, जिसका मतलब गार्ड ने अंदर से शीशा तोड़ा था!',
      },
      {
        id: 1,
        name: 'The brick was too clean to be from the street',
        nameTa: 'செங்கல் தெருவில் கிடந்த அளவுக்கு அழுக்காக இல்லை',
        nameFr: 'La brique était trop propre pour venir de la rue',
        nameEs: 'El ladrillo estaba demasiado limpio para ser de la calle',
        nameHi: 'ईंट इतनी साफ़ थी कि सड़क की नहीं लग रही थी',
        role: 'Brick Clue',
        roleTa: 'செங்கல் சான்று',
        roleFr: 'Indice Brique',
        roleEs: 'Pista del Ladrillo',
        roleHi: 'ईंट का तर्क',
        avatar: '🧱',
        statement: 'The brick was from the bathroom renovation.',
        statementTa: 'அந்த செங்கல் பாத்ரூம் புதுப்பித்தலில் இருந்து எடுக்கப்பட்டது.',
        statementFr: 'La brique venait des travaux des toilettes.',
        statementEs: 'El ladrillo era de unas obras del baño.',
        statementHi: 'ईंट बाथरूम के काम की लग रही थी।',
      },
      {
        id: 2,
        name: 'The thief would have cut his hands',
        nameTa: 'திருடனின் கையில் ரத்தக் காயம் ஏற்பட்டிருக்க வேண்டும்',
        nameFr: 'Le voleur se serait coupé les mains',
        nameEs: 'El ladrón se habría cortado las manos',
        nameHi: 'कांच से चोर के हाथ कट जाते',
        role: 'Injury Theory',
        roleTa: 'காய சான்று',
        roleFr: 'Théorie des Blessures',
        roleEs: 'Teoría de Lesiones',
        roleHi: 'चोट का तर्क',
        avatar: '🩸',
        statement: 'Nobody can climb through broken glass without bleeding.',
        statementTa: 'கண்ணாடி வழியாக நுழைந்தால் ரத்தக் கறை படிந்திருக்கும்.',
        statementFr: 'Impossible de passer sans laisser de sang.',
        statementEs: 'Nadie puede trepar por vidrio roto sin sangrar.',
        statementHi: 'कांच से बिना खून बहे कोई नहीं निकल सकता।',
      },
    ],
    clues: [
      {
        label: 'Glass Fracture Physics',
        labelTa: 'கண்ணாடி உடையும் அறிவியல்',
        labelFr: 'Physique des Éclats de Verre',
        labelEs: 'Física de la Fractura de Vidrio',
        labelHi: 'कांच टूटने का विज्ञान',
        icon: '🪟',
        description: 'Impact forces propel shattered fragments in the direction of the blow.',
        descriptionTa: 'தாக்கும் திசையிலேயே உடைந்த கண்ணாடித் துகள்கள் சிதறி விழும்.',
        descriptionFr: 'L’impact propulse les éclats de verre dans la direction du coup.',
        descriptionEs: 'La fuerza del golpe proyecta los fragmentos en la dirección del impacto.',
        descriptionHi: 'प्रहार की दिशा में ही कांच के टुकड़े आगे की ओर बिखरते हैं।',
      },
    ],
    question: 'How did Arunan instantly know the break-in was an inside job?',
    questionTa: 'காவலாளியே திருடிவிட்டு நாடகமாடுகிறார் என்பதை அருணன் எப்படி நொடியில் அறிந்தார்?',
    questionFr: 'Comment Arunan a-t-il su immédiatement qu’il s’agissait d’un coup monté de l’intérieur ?',
    questionEs: '¿Cómo supo Arunan al instante que fue un montaje desde adentro?',
    questionHi: 'अरूनन को तुरंत कैसे पता चला कि यह अंदर का ही काम था?',
    correctSuspectId: 0, // Glass fell outside
    mehulVerdict:
      'Simple physics! If a brick was thrown from the outside street, the glass shards would shatter INWARD into the room. Because all the glass was lying outside on the pavement, someone INSIDE the museum struck the window to fake a break-in! The guard stole the idol!',
    mehulVerdictTa:
      'அற்புதமான துப்பறிதல்! வெளியிலிருந்து செங்கல் வீசப்பட்டால் கண்ணாடி துண்டுகள் உள்பக்க அறையில்தான் விழுந்திருக்க வேண்டும்! கண்ணாடி முழுவதும் வெளியே தெருவில் சிதறிக் கிடந்ததால், காவலாளியே உள்ளிருந்து கண்ணாடியை உடைத்துவிட்டு திருடனைப் போல வேடமிட்டுள்ளார்! சோழர் சிலை மீட்கப்பட்டது!',
    mehulVerdictFr:
      'Simple physique ! Si une brique avait été lancée depuis la rue, les éclats de verre seraient tombés à L’INTÉRIEUR. Comme tout le verre était dehors sur le trottoir, quelqu’un à L’INTÉRIEUR a brisé la vitre pour simuler une effraction ! C’est le gardien le voleur !',
    mehulVerdictEs:
      '¡Física básica! Si hubieran lanzado el ladrillo desde la calle, los cristales habrían caído hacia ADENTRO. Como todo el vidrio estaba afuera en la acera, ¡alguien desde ADENTRO rompió la ventana para fingir el robo! ¡El guardia es el ladrón!',
    mehulVerdictHi:
      'सीधा विज्ञान! अगर बाहर सड़क से ईंट फेंकी जाती, तो कांच के टुकड़े अंदर कमरे में गिरते। क्योंकि सारा कांच बाहर सड़क पर पड़ा था, इसलिए अंदर मौजूद किसी व्यक्ति ने शीशा तोड़ा था! गार्ड ने ही मूर्ति चुराई थी!',
    mehulCatchphraseTa: 'அறிவியல் விதிகளுக்கு முன்னால் எந்தப் பொய்யும் நிலைக்காது! இது அருணனின் பாணி!',
    mehulCatchphraseFr: 'Les lois de la physique ne mentent jamais ! C’est la méthode Arunan !',
    mehulCatchphraseEs: '¡Las leyes de la física no mienten jamás! ¡Ese es el método Arunan!',
    mehulCatchphraseHi: 'भौतिकी के नियमों के आगे कोई झूठ टिक नहीं सकता! यही है अरूनन का अंदाज़!',
  },
];

export function getLocalizedCase(c: DetectiveCase, lang: AppLanguage, detectiveName: string = 'Arunan') {
  const isTa = lang === 'ta';
  const isFr = lang === 'fr';
  const isEs = lang === 'es';
  const isHi = lang === 'hi';
  const customName = detectiveName.trim() || 'Arunan';

  const replaceName = (text: string): string => {
    if (!text) return text;
    if (customName === 'Arunan') return text;
    return text
      .replace(/Detective Arunan/g, `Detective ${customName}`)
      .replace(/Détective Arunan/g, `Détective ${customName}`)
      .replace(/जासूस अरूनन/g, `जासूस ${customName}`)
      .replace(/துப்பறியும் அருணன்/g, `துப்பறியும் ${customName}`)
      .replace(/துப்பறியும் Arunan/g, `துப்பறியும் ${customName}`)
      .replace(/Arunan’s/g, `${customName}’s`)
      .replace(/Arunan's/g, `${customName}'s`)
      .replace(/அருணனின்/g, `${customName}னின்`)
      .replace(/அருணன்/g, customName)
      .replace(/Arunan/g, customName);
  };

  const rawTitle =
    (isTa ? c.titleTa : isFr ? c.titleFr : isEs ? c.titleEs : isHi ? c.titleHi : c.title) || c.title;

  const rawSynopsis =
    (isTa ? c.synopsisTa : isFr ? c.synopsisFr : isEs ? c.synopsisEs : isHi ? c.synopsisHi : c.synopsis) ||
    c.synopsis;

  const rawCrimeDetails =
    (isTa
      ? c.crimeSceneDetailsTa
      : isFr
      ? c.crimeSceneDetailsFr
      : isEs
      ? c.crimeSceneDetailsEs
      : isHi
      ? c.crimeSceneDetailsHi
      : c.crimeSceneDetails) || c.crimeSceneDetails;

  const rawQuestion =
    (isTa ? c.questionTa : isFr ? c.questionFr : isEs ? c.questionEs : isHi ? c.questionHi : c.question) ||
    c.question;

  const rawVerdict =
    (isTa
      ? c.mehulVerdictTa
      : isFr
      ? c.mehulVerdictFr
      : isEs
      ? c.mehulVerdictEs
      : isHi
      ? c.mehulVerdictHi
      : c.mehulVerdict) || c.mehulVerdict;

  const rawCatchphrase =
    (isTa
      ? c.mehulCatchphraseTa
      : isFr
      ? c.mehulCatchphraseFr
      : isEs
      ? c.mehulCatchphraseEs
      : isHi
      ? c.mehulCatchphraseHi
      : c.mehulCatchphraseTa) || c.mehulCatchphraseTa;

  const suspects = c.suspects.map((s) => ({
    id: s.id,
    avatar: s.avatar,
    name:
      (isTa ? s.nameTa : isFr ? s.nameFr : isEs ? s.nameEs : isHi ? s.nameHi : s.name) || s.name,
    role:
      (isTa ? s.roleTa : isFr ? s.roleFr : isEs ? s.roleEs : isHi ? s.roleHi : s.role) || s.role,
    statement: replaceName(
      (isTa
        ? s.statementTa
        : isFr
        ? s.statementFr
        : isEs
        ? s.statementEs
        : isHi
        ? s.statementHi
        : s.statement) || s.statement
    ),
  }));

  const clues = c.clues.map((clue) => ({
    icon: clue.icon,
    label: replaceName(
      (isTa
        ? clue.labelTa
        : isFr
        ? clue.labelFr
        : isEs
        ? clue.labelEs
        : isHi
        ? clue.labelHi
        : clue.label) || clue.label
    ),
    description: replaceName(
      (isTa
        ? clue.descriptionTa
        : isFr
        ? clue.descriptionFr
        : isEs
        ? clue.descriptionEs
        : isHi
        ? clue.descriptionHi
        : clue.description) || clue.description
    ),
  }));

  return {
    title: replaceName(rawTitle),
    synopsis: replaceName(rawSynopsis),
    crimeSceneDetails: rawCrimeDetails.map((detail) => replaceName(detail)),
    question: replaceName(rawQuestion),
    mehulVerdict: replaceName(rawVerdict),
    catchphrase: replaceName(rawCatchphrase),
    suspects,
    clues,
  };
}
