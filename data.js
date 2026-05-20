const APP_DATA = {
  es: {
    title: 'CronoFuerza MTN',
    subtitle: 'Control de Glucemia, Estrés e Hipertrofia',
    phases: {
      morning: {
        title: 'FASE MAÑANA 06:40h - 12:00h',
        items: [
          'Losartán 50mg. Tomar estrictamente en ayunas a las 06:40h.',
          'Creatina Segura 3g. Con el primer vaso de agua. Dosis limpia y adaptada a tu Nefropatía IgA.',
          'Aprovecha la ventana de escuela de los niños 08:15h para tareas de casa, cocinar proteína y organizar el día.'
        ]
      },
      afternoon: {
        title: 'FASE TARDE 12:00h - 20:00h',
        items: [
          'Powernap protectora universal 20 min para bajar cortisol.',
          'Siesta de emergencia 14:00h - 15:00h si estás solo con los niños.',
          'Siesta extendida de 90 min si tienes apoyo familiar.',
          'Bloque Kettlebell 10-15 min libres. Haz tu EMOM de swings y sentadillas.'
        ]
      },
      night: {
        title: 'FASE NOCHE / MADRUGADA 20:00h - 06:40h',
        items: [
          'Cena proteica enfocada en proteína y sin picos de azúcar antes del turno.',
          'Si estás entrando o saliendo de noche, prioriza sueño profundo y oscuridad.',
          'Si no trabajas de noche, acuéstate a las 23:30h. Habitación a 18C y pantallas fuera desde las 22:30h.'
        ]
      }
    },
    turnos: {
      M: {
        title: 'Día de Mañana',
        phases: ['morning', 'afternoon', 'night'],
        extra: []
      },
      T: {
        title: 'Día de Tarde',
        phases: ['morning', 'afternoon', 'night'],
        extra: ['Ajusta el powernap para no llegar vacío al turno.']
      },
      ENTRAN: {
        title: 'Día que ENTRAS de Noche',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Llegas a la noche con energía. Reduce el sueño largo por la tarde si necesitas dormir de noche.'
        ]
      },
      ENTREN: {
        title: 'Día ENTRE Noches',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Día de recuperación entre noches. El objetivo principal es dormir, comer proteína y moverte poco.'
        ]
      },
      SALIENTE: {
        title: 'Día Saliente',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Llegas a casa tras la noche. Prioriza desayuno, oscuridad y sueño inmediato.'
        ]
      },
      SALIENTE24H: {
        title: 'Día Saliente 24h',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Tras una guardia larga, evita sobrecargarte con ejercicio. Hidratación y siesta primero.'
        ]
      },
      LIBRE: {
        title: 'Día Libre',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Aprovecha para organizar comida, entrenamiento y recuperación.'
        ]
      }
    },
    familia: {
      APOYO: 'Tienes apoyo familiar. Puedes usar una siesta más larga y bloquear un EMOM corto.',
      SOLOCOLE: 'Estás solo con peques. El plan prioriza ventanas de descanso corto y tareas eficientes.'
    },
    checklist: [
      'Creatina Segura 3g',
      'Vitamina D3 con pescado graso',
      'Kettlebell 10-15m EMOM',
      'Recortar pan a 40g / primero proteína',
      'Controlar puñado de frutos secos',
      'Completar 3L de agua',
      'Losartán 50mg tomado'
    ],
    statsLabel: 'Tu Consistencia Semanal',
    saveOk: 'Progreso guardado correctamente.',
    noSelection: 'Selecciona turno y situación familiar para generar el plan.'
  },
  pt: {
    title: 'CronoFora MTN',
    subtitle: 'Controlo de Glicemia, Stress e Hipertrofia',
    phases: {
      morning: {
        title: 'FASE MANHÃ 06:40h - 12:00h',
        items: [
          'Losartan 50mg. Tomar em jejum às 06:40h.',
          'Creatina Segura 3g. Com o primeiro copo de água. Dose limpa e adaptada à tua Nefropatia IgA.',
          'Aproveita a janela da escola dos miúdos 08:15h para tarefas de casa, cozinhar proteína e organizar o dia.'
        ]
      },
      afternoon: {
        title: 'FASE TARDE 12:00h - 20:00h',
        items: [
          'Powernap protetor universal 20 min para baixar o cortisol.',
          'Sesta de emergência 14:00h - 15:00h se estiveres sozinho com os miúdos.',
          'Sesta alargada de 90 min se tiveres apoio familiar.',
          'Bloco Kettlebell 10-15 min livres. Faz o teu EMOM de swings e agachamentos.'
        ]
      },
      night: {
        title: 'FASE NOITE / MADRUGADA 20:00h - 06:40h',
        items: [
          'Jantar proteico focado em proteína e sem picos de açúcar antes do turno.',
          'Se estás a entrar ou a sair da noite, prioriza sono profundo e escuridão.',
          'Se não trabalhas de noite, deita-te às 23:30h. Quarto a 18C e ecrãs fora desde as 22:30h.'
        ]
      }
    },
    turnos: {
      M: {
        title: 'Dia de Manhã',
        phases: ['morning', 'afternoon', 'night'],
        extra: []
      },
      T: {
        title: 'Dia de Tarde',
        phases: ['morning', 'afternoon', 'night'],
        extra: ['Ajusta o powernap para não chegares vazio ao turno.']
      },
      ENTRAN: {
        title: 'Dia que ENTRAS de Noite',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Chegas à noite com energia. Reduz o sono longo da tarde se precisares dormir à noite.'
        ]
      },
      ENTREN: {
        title: 'Dia ENTRE Noites',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Dia de recuperação entre noites. O objetivo principal é dormir, comer proteína e mover-te pouco.'
        ]
      },
      SALIENTE: {
        title: 'Dia Saliente',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Chegas a casa após a noite. Prioriza pequeno-almoço, escuridão e sono imediato.'
        ]
      },
      SALIENTE24H: {
        title: 'Dia Saliente 24h',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Após uma guarda longa, evita sobrecarregar-te com exercício. Hidratação e sesta primeiro.'
        ]
      },
      LIBRE: {
        title: 'Dia Livre',
        phases: ['morning', 'afternoon', 'night'],
        extra: [
          'Aproveita para organizar comida, treino e recuperação.'
        ]
      }
    },
    familia: {
      APOYO: 'Tens apoio familiar. Podes usar uma sesta mais longa e bloquear um EMOM curto.',
      SOLOCOLE: 'Estás sozinho com os miúdos. O plano prioriza janelas de descanso curto e tarefas eficientes.'
    },
    checklist: [
      'Creatina Segura 3g',
      'Vitamina D3 com peixe gordo',
      'Kettlebell 10-15m EMOM',
      'Cortar pão para 40g / primeiro proteína',
      'Controlar punhado de frutos secos',
      'Completar 3L de água',
      'Losartan 50mg tomado'
    ],
    statsLabel: 'Tua Consistência Semanal',
    saveOk: 'Progresso guardado com sucesso.',
    noSelection: 'Seleciona turno e situação familiar para gerar o plano.'
  }
};

const WATER_TARGET = 12;
const WATER_STORAGE_KEY = 'mtnwg';
const HISTORY_STORAGE_KEY = 'mtnhv10';