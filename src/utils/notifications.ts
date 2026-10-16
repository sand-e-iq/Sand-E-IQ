// Sand.E IQ - Notifications & Practice Reminders Utility
// Uses Browser Notification API with full user consent and preference persistence

const NOTIF_PREF_KEY = 'sande_iq_reminder_settings_v1';

export interface NotificationSettings {
  enabled: boolean;
  time: string; // "19:00"
  streakProtection: boolean;
  soundAlert: boolean;
  lastNotifiedDate?: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  time: '19:00',
  streakProtection: true,
  soundAlert: true,
};

export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(NOTIF_PREF_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveNotificationSettings(settings: Partial<NotificationSettings>): NotificationSettings {
  const current = getNotificationSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(NOTIF_PREF_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const perm = await Notification.requestPermission();
    const granted = perm === 'granted';
    if (granted) {
      saveNotificationSettings({ enabled: true });
    }
    return granted;
  } catch (err) {
    console.error('Notification permission request error:', err);
    return false;
  }
}

export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const defaultOptions: NotificationOptions = {
      icon: '/pwa-192x192.png',
      badge: '/logo.svg',
      tag: 'sande-iq-reminder',
      ...options,
    };

    new Notification(title, defaultOptions);
    return true;
  } catch (err) {
    console.error('Error dispatching browser notification:', err);
    return false;
  }
}

// Check and trigger daily reminder if due
export function checkAndTriggerDailyReminder(streak: number = 0, isTamil: boolean = false): boolean {
  const settings = getNotificationSettings();
  if (!settings.enabled || Notification.permission !== 'granted') return false;

  const todayStr = new Date().toISOString().split('T')[0];
  if (settings.lastNotifiedDate === todayStr) {
    return false; // Already notified today
  }

  const title = isTamil
    ? '🔥 Sand.E IQ · உங்கள் தினசரி மூளைப் பயிற்சி நேரம்!'
    : '🔥 Sand.E IQ · Daily Mind Challenge Ready!';

  const body = isTamil
    ? `உங்கள் தொடர் வெற்றி: ${streak} நாட்கள்! இன்றைய தர்க்கப் புதிரைத் தீர்த்து உங்கள் நிலையை உயர்த்துங்கள்.`
    : `Your current streak: ${streak} days! Solve today's cognitive challenges to keep your mind sharp.`;

  const sent = sendBrowserNotification(title, { body });
  if (sent) {
    saveNotificationSettings({ lastNotifiedDate: todayStr });
  }
  return sent;
}
