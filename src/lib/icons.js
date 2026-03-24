const ICON_GROUPS = [
  {
    emoji: '✉️',
    keywords: [
      'email',
      'mail',
      'inbox',
      'gmail',
      'outlook',
      'מייל',
      'אימייל',
      'מכתב',
      'דואר',
    ],
  },
  {
    emoji: '📞',
    keywords: [
      'call',
      'phone',
      'ring',
      'dial',
      'שיחה',
      'טלפון',
      'להתקשר',
      'להרים טלפון',
    ],
  },
  {
    emoji: '💬',
    keywords: [
      'message',
      'chat',
      'reply',
      'whatsapp',
      'slack',
      'teams',
      'הודעה',
      'ווטסאפ',
      'וואטסאפ',
      'צ׳אט',
      'צאט',
      'להשיב',
    ],
  },
  {
    emoji: '📅',
    keywords: [
      'meeting',
      'zoom',
      'calendar',
      'appointment',
      'schedule',
      'פגישה',
      'זום',
      'יומן',
      'לקבוע פגישה',
      'פגישת',
    ],
  },
  {
    emoji: '✍️',
    keywords: [
      'write',
      'draft',
      'document',
      'doc',
      'notes',
      'proposal',
      'לכתוב',
      'כתיבה',
      'מסמך',
      'טיוטה',
      'סיכום',
      'לנסח',
    ],
  },
  {
    emoji: '📖',
    keywords: [
      'read',
      'article',
      'book',
      'review',
      'study material',
      'לקרוא',
      'קריאה',
      'מאמר',
      'ספר',
      'לעבור על',
      'סקירה',
    ],
  },
  {
    emoji: '🛒',
    keywords: [
      'shop',
      'shopping',
      'buy',
      'store',
      'grocery',
      'order',
      'קניות',
      'לקנות',
      'סופר',
      'להזמין',
      'רכישה',
    ],
  },
  {
    emoji: '💸',
    keywords: [
      'pay',
      'payment',
      'invoice',
      'budget',
      'bank',
      'tax',
      'bill',
      'לשלם',
      'תשלום',
      'חשבונית',
      'תקציב',
      'בנק',
      'מס',
      'חשבון',
    ],
  },
  {
    emoji: '🧺',
    keywords: ['laundry', 'wash clothes', 'כביסה'],
  },
  {
    emoji: '🧹',
    keywords: [
      'clean',
      'tidy',
      'organize home',
      'dishes',
      'house',
      'לנקות',
      'ניקיון',
      'לסדר',
      'סדר',
      'כלים',
      'בית',
    ],
  },
  {
    emoji: '🏋️',
    keywords: [
      'workout',
      'gym',
      'run',
      'exercise',
      'fitness',
      'אימון',
      'כושר',
      'ריצה',
      'להתאמן',
      'הליכה',
    ],
  },
  {
    emoji: '🧘',
    keywords: ['yoga', 'stretch', 'meditate', 'יוגה', 'מדיטציה', 'נשימות', 'מתיחות'],
  },
  {
    emoji: '🍳',
    keywords: [
      'cook',
      'meal prep',
      'kitchen',
      'recipe',
      'לבשל',
      'בישול',
      'מטבח',
      'להכין אוכל',
    ],
  },
  {
    emoji: '🍽️',
    keywords: ['food', 'eat', 'dinner', 'lunch', 'breakfast', 'אוכל', 'ארוחה', 'לאכול'],
  },
  {
    emoji: '🎓',
    keywords: [
      'learn',
      'study',
      'course',
      'lesson',
      'class',
      'homework',
      'ללמוד',
      'לימוד',
      'שיעור',
      'קורס',
      'תרגיל',
      'שיעורי בית',
    ],
  },
  {
    emoji: '💻',
    keywords: [
      'code',
      'coding',
      'dev',
      'deploy',
      'bug',
      'debug',
      'feature',
      'program',
      'קוד',
      'פיתוח',
      'באג',
      'דיבאג',
      'פיצר',
      'פיצ׳ר',
      'לתכנת',
    ],
  },
  {
    emoji: '🚗',
    keywords: ['drive', 'car', 'trip', 'travel', 'נסיעה', 'רכב', 'לנסוע'],
  },
  {
    emoji: '🚌',
    keywords: ['bus', 'train', 'transport', 'commute', 'אוטובוס', 'רכבת', 'תחבורה'],
  },
];

const normalizeText = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\n/g, ' ')
    .replace(/[.,/#!$%^&*;:{}=_`~()?"'׳״+-]/g, ' ')
    .replace(/\s+/g, ' ');

export const getLocalEmoji = (text) => {
  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return '📝';
  }

  for (const group of ICON_GROUPS) {
    if (group.keywords.some((keyword) => normalizedText.includes(keyword))) {
      return group.emoji;
    }
  }

  return '📝';
};
