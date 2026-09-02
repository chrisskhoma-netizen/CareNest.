import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coffee,
  HeartPulse,
  Home,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Pill,
  Plus,
  RotateCcw,
  Settings,
  SkipForward,
  Smile,
  Stethoscope,
  Sunrise,
  Sunset,
  X,
  CircleDot,
  CircleCheck,
  CircleDashed,
  Send,
  ArrowLeft,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Page = 'Home' | 'Medications' | 'Symptoms' | 'Messages' | 'Reminders' | 'Care Team' | 'Settings';

const disabledPages: Page[] = ['Messages', 'Reminders', 'Care Team', 'Settings'];

type NavItem = { label: Page; icon: LucideIcon };

type Task = { label: string; done: boolean; icon: LucideIcon; time?: string };

type MedStatus = 'due' | 'upcoming' | 'completed' | 'missed';

type MedItem = {
  name: string;
  dosage: string;
  amount: string;
  timing: string;
  time: string;
  status: MedStatus;
};

const medications: MedItem[] = [
  { name: 'Amlodipine', dosage: '5 mg', amount: '1 pill', timing: 'Before breakfast', time: '9:00 AM', status: 'due' },
  { name: 'Atorvastatin', dosage: '20 mg', amount: '1 pill', timing: 'After dinner', time: '8:00 PM', status: 'upcoming' },
  { name: 'Metformin', dosage: '500 mg', amount: '1 pill', timing: 'With lunch', time: '12:00 PM', status: 'missed' },
];

type FeelingKey = 'good' | 'okay' | 'not_good' | 'poor';

const feelingOptions: { key: FeelingKey; emoji: string; label: string }[] = [
  { key: 'good', emoji: '🙂', label: 'Good' },
  { key: 'okay', emoji: '😐', label: 'Okay' },
  { key: 'not_good', emoji: '🙁', label: 'Not good' },
  { key: 'poor', emoji: '😣', label: 'Poor' },
];

const symptomOptions = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Joint Pain', 'Shortness of Breath', 'Chest Pressure', 'Fever', 'Loss of Appetite', 'Cough'] as const;

type CheckIn = {
  feeling: FeelingKey;
  symptoms: string[];
  note: string;
  savedAt: string;
};

type CareMember = {
  name: string;
  role: string;
  available: boolean;
  initials: string;
};

const careTeam: CareMember[] = [
  { name: 'Sarah Johnson', role: 'Caregiver', available: true, initials: 'SJ' },
  { name: 'Dr. Michael Lee', role: 'Healthcare professional', available: false, initials: 'ML' },
];

const quickHelpOptions = [
  'I need help with my medication',
  'I don\'t feel well',
  'I have a question',
  'Something else',
];

const navItems: NavItem[] = [
  { label: 'Home', icon: Home },
  { label: 'Medications', icon: Pill },
  { label: 'Symptoms', icon: Activity },
  { label: 'Messages', icon: MessageCircle },
  { label: 'Reminders', icon: Bell },
  { label: 'Care Team', icon: Stethoscope },
  { label: 'Settings', icon: Settings },
];

const initialTasks: Task[] = [
  { label: 'Take morning medication', done: true, icon: Pill },
  { label: 'Check blood pressure', done: true, icon: HeartPulse },
  { label: "Track how I'm feeling", done: true, icon: Smile },
  { label: 'Take evening medication', done: false, icon: Pill, time: '8:00 PM' },
];

type TicketStatus = 'taken' | 'soon' | 'scheduled' | 'missed';

type MedTicket = {
  id: string;
  name: string;
  dosage: string;
  amount: string;
  instructions: string;
  time: string;
  timeLabel: string;
  period: 'morning' | 'afternoon' | 'evening';
  status: TicketStatus;
  prevStatus?: TicketStatus;
  takenTime?: string;
};

const initialTickets: MedTicket[] = [
  { id: 'amlodipine', name: 'Amlodipine', dosage: '5 mg', amount: '1 pill', instructions: 'Before breakfast', time: '08:00', timeLabel: '8:00', period: 'morning', status: 'taken', takenTime: '8:02 AM' },
  { id: 'lisinopril', name: 'Lisinopril', dosage: '10 mg', amount: '1 pill', instructions: 'Before breakfast', time: '08:00', timeLabel: '8:00', period: 'morning', status: 'taken', takenTime: '8:05 AM' },
  { id: 'metformin', name: 'Metformin', dosage: '500 mg', amount: '1 pill', instructions: 'With lunch', time: '12:00', timeLabel: '12:00', period: 'afternoon', status: 'missed' },
  { id: 'vitamin-d', name: 'Vitamin D', dosage: '1000 IU', amount: '1 tablet', instructions: 'With food', time: '14:00', timeLabel: '2:00', period: 'afternoon', status: 'soon' },
  { id: 'atorvastatin', name: 'Atorvastatin', dosage: '20 mg', amount: '1 pill', instructions: 'After dinner', time: '20:00', timeLabel: '8:00', period: 'evening', status: 'scheduled' },
  { id: 'aspirin', name: 'Aspirin', dosage: '81 mg', amount: '1 pill', instructions: 'After dinner', time: '20:00', timeLabel: '8:00', period: 'evening', status: 'scheduled' },
];

const periodConfig: Record<MedTicket['period'], { label: string; icon: LucideIcon }> = {
  morning: { label: 'Morning', icon: Sunrise },
  afternoon: { label: 'Afternoon', icon: Coffee },
  evening: { label: 'Evening', icon: Sunset },
};

function App() {
  const [activePage, setActivePage] = useState<Page>('Home');
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [takenTime, setTakenTime] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; sub?: string } | null>(null);
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [messagePrefill, setMessagePrefill] = useState<string>('');

  const navigateTo = (page: Page) => {
    if (disabledPages.includes(page)) return;
    setActivePage(page);
    setMobileNavOpen(false);
  };

  const showToast = (message: string, sub?: string) => {
    setToast({ message, sub });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTakeMedication = () => {
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setTakenTime(now);
    setMedicationTaken(true);
    showToast('Medication taken', 'Amlodipine 5 mg · ' + now);
  };

  const handleUndo = () => {
    setMedicationTaken(false);
    setTakenTime('');
    showToast('Medication restored', 'Amlodipine 5 mg is due now');
  };

  const handleSaveCheckIn = (feeling: FeelingKey, symptoms: string[], note: string) => {
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setCheckIn({ feeling, symptoms, note, savedAt: now });
    showToast('Your check-in is saved', `Feeling: ${feelingOptions.find(f => f.key === feeling)?.label} · ${now}`);
  };

  const handleStartMessage = (prefill: string) => {
    setMessagePrefill(prefill);
    setActivePage('Messages');
    setMobileNavOpen(false);
  };

  const medsTaken = medicationTaken ? 3 : 2;
  const medsTotal = 3;
  const tasksDone = 3;
  const tasksTotal = 4;

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={navigateTo} mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <main className="main-area">
        <Header onMenu={() => setMobileNavOpen(true)} onNavigate={navigateTo} onAddMedication={() => navigateTo('Medications')} />
        {activePage === 'Home' ? (
          <HomePage
            medicationTaken={medicationTaken}
            takenTime={takenTime}
            onTakeMedication={handleTakeMedication}
            onUndo={handleUndo}
            medsTaken={medsTaken}
            medsTotal={medsTotal}
            tasksDone={tasksDone}
            tasksTotal={tasksTotal}
            onNavigate={navigateTo}
            checkIn={checkIn}
          />
        ) : activePage === 'Medications' ? (
          <MedicationsPage onNavigate={navigateTo} onToast={showToast} homeMedTaken={medicationTaken} onHomeTake={handleTakeMedication} onHomeUndo={handleUndo} homeTakenTime={takenTime} />
        ) : activePage === 'Symptoms' ? (
          <SymptomsPage
            checkIn={checkIn}
            onSave={handleSaveCheckIn}
            onNavigate={navigateTo}
          />
        ) : activePage === 'Messages' ? (
          <MessagesPage
            onNavigate={navigateTo}
            prefill={messagePrefill}
            onSent={() => showToast('Message sent', 'Sarah Johnson will be notified.')}
          />
        ) : (
          <PlaceholderPage page={activePage} onNavigate={navigateTo} />
        )}
      </main>
      {toast && <Toast message={toast.message} sub={toast.sub} />}
    </div>
  );
}

function Toast({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className="toast">
        <div className="toast-icon"><CheckCircle2 size={20} /></div>
        <div className="toast-content">
          <strong>{message}</strong>
          {sub && <span>{sub}</span>}
        </div>
      </div>
    </div>
  );
}

const statusConfig: Record<MedStatus, { label: string; icon: LucideIcon; className: string }> = {
  due: { label: 'Due now', icon: CircleDot, className: 'status-due' },
  upcoming: { label: 'Upcoming', icon: Clock3, className: 'status-upcoming' },
  completed: { label: 'Completed', icon: CircleCheck, className: 'status-completed' },
  missed: { label: 'Missed', icon: CircleDashed, className: 'status-missed' },
};

function StatusBadge({ status }: { status: MedStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`status-badge ${cfg.className}`}>
      <Icon size={13} strokeWidth={2.4} />
      {cfg.label}
    </span>
  );
}

function Sidebar({ activePage, onNavigate, mobileOpen, onClose }: { activePage: Page; onNavigate: (page: Page) => void; mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      {mobileOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><HeartPulse size={19} strokeWidth={2.5} /></div>
          <span>CareNest</span>
          {mobileOpen && <button className="icon-button mobile-close" onClick={onClose} aria-label="Close navigation"><X size={19} /></button>}
        </div>
        <div className="sidebar-label">Your care space</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => {
            const isDisabled = disabledPages.includes(label);
            return (
              <button
                key={label}
                className={`nav-item ${activePage === label ? 'nav-item-active' : ''} ${isDisabled ? 'nav-item-disabled' : ''}`}
                onClick={() => onNavigate(label)}
                aria-current={activePage === label ? 'page' : undefined}
                aria-disabled={isDisabled}
              >
                <Icon size={19} strokeWidth={activePage === label ? 2.4 : 1.9} />
                <span>{label}</span>
                {label === 'Messages' && <span className="message-dot" aria-label="1 unread message" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon"><CircleHelp size={18} /></div>
            <div><strong>Need a hand?</strong><span>We're here when you need us.</span></div>
            <ChevronRight size={16} className="support-arrow" />
          </div>
          <button className="profile-row" onClick={() => onNavigate('Settings')} aria-disabled={true}>
            <div className="avatar">MS</div>
            <div className="profile-copy"><strong>Margaret Smith</strong><span>Personal account</span></div>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, onNavigate, onAddMedication }: { onMenu: () => void; onNavigate: (page: Page) => void; onAddMedication: () => void }) {
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={22} /></button>
      <div className="topbar-actions">
        <button className="primary-button add-med-cta" onClick={onAddMedication}><Plus size={17} /> Add Medication</button>
        <button className="icon-button notification-button" onClick={() => onNavigate('Messages')} aria-label="View notifications"><Bell size={19} /><span className="notification-dot" /></button>
        <button className="profile-chip" onClick={() => onNavigate('Settings')}>
          <span className="top-avatar">MS</span>
          <span className="profile-name">Margaret Smith</span>
          <ChevronDown size={16} className="profile-chevron" />
        </button>
      </div>
    </header>
  );
}

function HomePage({ medicationTaken, takenTime, onTakeMedication, onUndo, medsTaken, medsTotal, tasksDone, tasksTotal, onNavigate, checkIn }: { medicationTaken: boolean; takenTime: string; onTakeMedication: () => void; onUndo: () => void; medsTaken: number; medsTotal: number; tasksDone: number; tasksTotal: number; onNavigate: (page: Page) => void; checkIn: CheckIn | null }) {
  const feelingInfo = checkIn ? (feelingOptions.find(f => f.key === checkIn.feeling) ?? feelingOptions[0]) : feelingOptions[0];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> {today}</div>
          <h1>Good morning, Margaret</h1>
          <p className="intro-copy">Here's what you need to do today.</p>
        </div>
      </div>

      <div className="kpi-row kpi-row-three">
        <KpiBlock icon={Pill} label="Medications" value={`${medsTaken} of ${medsTotal}`} sub="taken today" accent="green" caption="Your daily medication overview" onNavigate={onNavigate} />
        <KpiBlock icon={CheckCircle2} label="Tasks" value={`${tasksDone} of ${tasksTotal}`} sub="completed" accent="green" caption="Things to do for your health" onNavigate={onNavigate} />
        <KpiBlock icon={Smile} label="Feeling" value={feelingInfo.label} sub={feelingInfo.emoji} accent="coral" caption="How you're doing today" onNavigate={onNavigate} />
      </div>

      <Banner
        severity="info"
        icon={Bell}
        title="Don't forget"
        message="You have 1 medication later today."
        actionLabel="View reminders"
        onAction={() => onNavigate('Reminders')}
      />

      <div className="dashboard-grid">
        <section className="content-column">
          <div className="glass-block med-block">
            <SectionHeading title="Today's medication" />
            <p className="card-subtitle">Your current and next doses for today.</p>
            <MedicationCard taken={medicationTaken} takenTime={takenTime} onTake={onTakeMedication} onUndo={onUndo} />
            <NextMedicationRow />
            <button className="card-add-action" onClick={() => onNavigate('Medications')}><Plus size={15} /> Add medication</button>
          </div>

          <div className="glass-block tasks-block">
            <SectionHeading title="Today's tasks" />
            <p className="card-subtitle">Health tasks to complete throughout the day.</p>
            <div className="task-list">
              {initialTasks.map((task) => <TaskRow key={task.label} {...task} />)}
            </div>
            <button className="card-add-action" onClick={() => onNavigate('Home')}><Plus size={15} /> Add task</button>
          </div>
        </section>

        <aside className="side-column">
          <div className="glass-block schedule-block">
            <SectionHeading title="Today's schedule" />
            <p className="card-subtitle">Track your medications and health tasks throughout the day.</p>
            <ScheduleList />
            <button className="card-add-action" onClick={() => onNavigate('Medications')}><Plus size={15} /> Add to schedule</button>
          </div>

          <div className="glass-block symptom-block">
            <SectionHeading title="How are you feeling?" />
            <p className="card-subtitle">A quick daily check-in on your wellbeing.</p>
            <div className="symptom-block-state">
              <span className="symptom-block-emoji">{feelingInfo.emoji}</span>
              <strong>{feelingInfo.label}</strong>
            </div>
            <p className="symptom-block-meta">{checkIn ? `Last updated today at ${checkIn.savedAt}` : 'Not checked in yet'}</p>
            <button className="outline-button symptom-block-cta" onClick={() => onNavigate('Symptoms')}>
              {checkIn ? 'Update' : 'Check in'} <ChevronRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function KpiBlock({ icon: Icon, label, value, sub, accent, caption, onNavigate }: { icon: LucideIcon; label: string; value: string; sub: string; accent: 'green' | 'coral' | 'lime'; caption: string; onNavigate?: (page: Page) => void }) {
  return (
    <div className={`glass-block kpi-block kpi-${accent}`}>
      <div className="kpi-top">
        <div className={`kpi-icon kpi-icon-${accent}`}><Icon size={18} strokeWidth={2} /></div>
        <span className="kpi-label">{label}</span>
        <div className="kpi-actions">
          {onNavigate && (
            <button className="kpi-chevron" onClick={() => onNavigate(label === 'Medications' ? 'Medications' : label === 'Tasks' ? 'Home' : 'Symptoms')} aria-label={`View ${label} details`}>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="kpi-caption">{caption}</p>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

function ScheduleList() {
  const events: { time: string; label: string; sub: string; type: 'med' | 'task' }[] = [
    { time: '6:00 PM', label: 'Check blood pressure', sub: 'Health task', type: 'task' },
    { time: '8:00 PM', label: 'Atorvastatin 20 mg', sub: '1 pill · After dinner', type: 'med' },
  ];

  return (
    <div className="schedule-list">
      {events.map((ev, i) => (
        <div key={i} className={`schedule-item ${ev.type === 'med' ? 'schedule-item-med' : 'schedule-item-task'}`}>
          <div className="schedule-item-time">{ev.time}</div>
          <div className="schedule-item-body">
            <strong>{ev.label}</strong>
            <span>{ev.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action && onAction && <button className="text-button" onClick={onAction}>{action}<ArrowRight size={15} /></button>}
    </div>
  );
}

function MedicationCard({ taken, takenTime, onTake, onUndo }: { taken: boolean; takenTime: string; onTake: () => void; onUndo: () => void }) {
  return (
    <article className={`medication-card ${taken ? 'medication-done' : ''}`}>
      <div className="medication-card-header">
        <div className="medication-time"><Clock3 size={15} /> 9:00 AM</div>
        <StatusBadge status={taken ? 'completed' : 'due'} />
      </div>
      <div className="medication-main">
        <div className="pill-icon"><Pill size={23} /></div>
        <div>
          <h3>Amlodipine 5 mg</h3>
          <p>1 pill <span>·</span> Before breakfast</p>
        </div>
      </div>
      {taken ? (
        <div className="medication-done-section">
          <div className="ticket-status-zone ticket-status-taken">
            <CheckCircle2 size={20} />
            <div>
              <strong>Medication taken</strong>
              <span>Amlodipine 5 mg · {takenTime}</span>
            </div>
          </div>
          <button className="ticket-undo-button" onClick={onUndo}><RotateCcw size={15} /> Undo</button>
        </div>
      ) : (
        <button className="secondary-button medication-cta" onClick={onTake}><Check size={18} /> Mark as taken</button>
      )}
    </article>
  );
}

function NextMedicationRow() {
  return (
    <div className="next-medication">
      <span className="next-label">Next medication</span>
      <div className="next-med-row">
        <div className="next-med-icon"><Pill size={17} /></div>
        <div className="next-med-info">
          <strong>Atorvastatin 20 mg</strong>
          <span>1 pill · After dinner</span>
        </div>
        <span className="next-med-time">8:00 PM</span>
      </div>
    </div>
  );
}

function TaskRow({ label, done, icon: Icon, time }: { label: string; done: boolean; icon: LucideIcon; time?: string }) {
  return (
    <div className={`task-row ${done ? 'task-done' : ''}`}>
      <span className={`task-checkbox ${done ? 'checkbox-checked' : ''}`}>
        {done && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="task-icon"><Icon size={17} /></span>
      <span className="task-label">{label}</span>
      {done ? <span className="done-text">Completed</span> : time ? <span className="task-time">{time}</span> : null}
    </div>
  );
}

function Banner({ severity, icon: Icon, title, message, actionLabel, onAction, onClose }: { severity: 'info' | 'warning' | 'alert'; icon: LucideIcon; title: string; message: string; actionLabel?: string; onAction?: () => void; onClose?: () => void }) {
  return (
    <div className={`banner banner-${severity}`} role="alert">
      <div className="banner-icon"><Icon size={20} /></div>
      <div className="banner-content">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      {actionLabel && onAction && (
        <button className="banner-action" onClick={onAction}>{actionLabel}</button>
      )}
      {onClose && (
        <button className="banner-close" onClick={onClose} aria-label="Dismiss"><X size={18} /></button>
      )}
    </div>
  );
}

function MedicationsPage({ onNavigate, onToast, homeMedTaken, onHomeTake, onHomeUndo, homeTakenTime }: { onNavigate: (page: Page) => void; onToast: (msg: string, sub?: string) => void; homeMedTaken: boolean; onHomeTake: () => void; onHomeUndo: () => void; homeTakenTime: string }) {
  const [tickets, setTickets] = useState<MedTicket[]>(initialTickets);
  const [missedBannerVisible, setMissedBannerVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const todayDate = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const isToday = selectedDate.getTime() === todayDate.getTime();
  const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dateLabel = isToday ? 'Today' : formattedDate;

  const shiftDate = (days: number) => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d;
    });
  };

  const takenCount = tickets.filter(t => t.status === 'taken').length;
  const totalCount = tickets.length;
  const progressPct = Math.round((takenCount / totalCount) * 100);
  const ringCircumference = 2 * Math.PI * 52;
  const ringOffset = ringCircumference - (progressPct / 100) * ringCircumference;

  const handleTake = (id: string) => {
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setTickets(prev => prev.map(t => t.id === id ? { ...t, prevStatus: t.status, status: 'taken', takenTime: now } : t));
    const med = tickets.find(t => t.id === id);
    onToast('Medication taken', `${med?.name} ${med?.dosage} · ${now}`);
  };

  const handleUndo = (id: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== id) return t;
      const restore = t.prevStatus ?? 'scheduled';
      return { ...t, status: restore, prevStatus: undefined, takenTime: undefined };
    }));
    const med = tickets.find(t => t.id === id);
    onToast('Medication restored', `${med?.name} ${med?.dosage} is back to pending`);
  };

  const handleSkip = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, prevStatus: t.status, status: 'missed' } : t));
    const med = tickets.find(t => t.id === id);
    onToast('Medication skipped', `${med?.name} ${med?.dosage} marked as missed`);
  };

  const scrollToMissed = () => {
    const el = document.getElementById('med-metformin');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ticket-highlight');
      setTimeout(() => el.classList.remove('ticket-highlight'), 2000);
    }
  };

  const hasMissed = tickets.some(t => t.status === 'missed');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const grouped = (['morning', 'afternoon', 'evening'] as const).map(period => ({
    period,
    items: tickets.filter(t => t.period === period),
  }));

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <div className="date-nav">
            <button className="date-nav-arrow" onClick={() => shiftDate(-1)} aria-label="Previous day"><ChevronLeft size={18} /></button>
            <span className="date-nav-label">{dateLabel}</span>
            <button className="date-nav-arrow" onClick={() => shiftDate(1)} aria-label="Next day"><ChevronRight size={18} /></button>
          </div>
          <h1>{isToday ? "Today's Medications" : 'Medications'}</h1>
          <p className="intro-copy">Your medication schedule for {isToday ? 'today' : formattedDate.toLowerCase()}.</p>
        </div>
      </div>

      {hasMissed && missedBannerVisible && (
        <Banner
          severity="warning"
          icon={AlertTriangle}
          title="Missed dose alert"
          message="You have 1 missed medication today."
          actionLabel="View missed dose"
          onAction={scrollToMissed}
          onClose={() => setMissedBannerVisible(false)}
        />
      )}

      <div className="glass-block progress-card">
        <div className="progress-ring-wrapper">
          <svg className="progress-ring" width="120" height="120" viewBox="0 0 120 120">
            <circle className="progress-ring-bg" cx="60" cy="60" r="52" fill="none" strokeWidth="10" />
            <circle
              className="progress-ring-fill"
              cx="60" cy="60" r="52" fill="none" strokeWidth="10"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="progress-ring-text">
            <strong>{takenCount}</strong>
            <span>of {totalCount}</span>
          </div>
        </div>
        <div className="progress-card-info">
          <div className="progress-card-title">Daily progress</div>
          <div className="progress-card-count">{takenCount} of {totalCount} doses taken</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-card-stats">
            <span className="progress-stat progress-stat-taken"><CheckCircle2 size={14} /> {takenCount} taken</span>
            <span className="progress-stat progress-stat-remaining"><Clock3 size={14} /> {totalCount - takenCount} remaining</span>
          </div>
        </div>
      </div>

      <div className="med-groups">
        {grouped.map(({ period, items }) => {
          if (items.length === 0) return null;
          const cfg = periodConfig[period];
          const PeriodIcon = cfg.icon;
          return (
            <section key={period} className="med-group">
              <div className="med-group-header">
                <div className="med-group-icon"><PeriodIcon size={18} /></div>
                <h2>{cfg.label}</h2>
                <span className="med-group-count">{items.length} {items.length === 1 ? 'medication' : 'medications'}</span>
              </div>
              <div className="med-tickets">
                {items.map(ticket => (
                  <MedTicketCard key={ticket.id} ticket={ticket} onTake={handleTake} onUndo={handleUndo} onSkip={handleSkip} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MedTicketCard({ ticket, onTake, onUndo, onSkip }: { ticket: MedTicket; onTake: (id: string) => void; onUndo: (id: string) => void; onSkip: (id: string) => void }) {
  const ampm = ticket.period === 'morning' ? 'AM' : ticket.period === 'afternoon' ? 'PM' : 'PM';

  return (
    <article className={`med-ticket med-ticket-${ticket.status}`} id={`med-${ticket.id}`} aria-label={`${ticket.name} ${ticket.dosage}`}>
      <div className="med-ticket-stub">
        <span className="med-ticket-stub-time">{ticket.timeLabel}</span>
        <span className="med-ticket-stub-period">{ampm}</span>
      </div>
      <div className="med-ticket-divider" />
      <div className="med-ticket-body">
        <div className="med-ticket-main">
          <div className="med-ticket-icon"><Pill size={22} /></div>
          <div className="med-ticket-info">
            <h3>{ticket.name} <span className="med-ticket-dosage">{ticket.dosage}</span></h3>
            <p>{ticket.amount} · {ticket.instructions}</p>
          </div>
        </div>
        <div className="med-ticket-status">
          {ticket.status === 'taken' && (
            <>
              <div className="ticket-status-zone ticket-status-taken">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Taken</strong>
                  <span>Today at {ticket.takenTime}</span>
                </div>
              </div>
              <button className="ticket-undo-button" onClick={() => onUndo(ticket.id)} aria-label={`Undo taking ${ticket.name}`}>
                <RotateCcw size={15} /> Undo
              </button>
            </>
          )}
          {ticket.status === 'soon' && (
            <>
              <div className="ticket-status-zone ticket-status-soon">
                <Clock3 size={18} />
                <div>
                  <strong>Due soon</strong>
                  <span>Take now</span>
                </div>
              </div>
              <button className="primary-button ticket-action" onClick={() => onTake(ticket.id)} aria-label={`Mark ${ticket.name} as taken`}>
                <Check size={18} /> Mark as taken
              </button>
            </>
          )}
          {ticket.status === 'scheduled' && (
            <>
              <div className="ticket-status-zone ticket-status-scheduled">
                <Clock3 size={18} />
                <div>
                  <strong>Scheduled</strong>
                  <span>Take at {ticket.timeLabel} {ampm}</span>
                </div>
              </div>
              <button className="outline-button ticket-action" onClick={() => onTake(ticket.id)} aria-label={`Mark ${ticket.name} as taken`}>
                <Check size={16} /> Mark as taken
              </button>
            </>
          )}
          {ticket.status === 'missed' && (
            <>
              <div className="ticket-status-zone ticket-status-missed">
                <AlertTriangle size={18} />
                <div>
                  <strong>Missed</strong>
                  <span>Was due at {ticket.timeLabel} {ampm}</span>
                </div>
              </div>
              <div className="ticket-action-group">
                <button className="outline-button ticket-action-skip" onClick={() => onSkip(ticket.id)} aria-label={`Skip ${ticket.name}`}>
                  <SkipForward size={16} /> Skip
                </button>
                <button className="primary-button ticket-action" onClick={() => onTake(ticket.id)} aria-label={`Mark ${ticket.name} as taken`}>
                  <Check size={16} /> Taken
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function SymptomsPage({ checkIn, onSave, onNavigate }: { checkIn: CheckIn | null; onSave: (feeling: FeelingKey, symptoms: string[], note: string) => void; onNavigate: (page: Page) => void }) {
  const [feeling, setFeeling] = useState<FeelingKey | null>(checkIn?.feeling ?? null);
  const [symptoms, setSymptoms] = useState<string[]>(checkIn?.symptoms ?? []);
  const [note, setNote] = useState(checkIn?.note ?? '');
  const [saved, setSaved] = useState(false);
  const [savedTime, setSavedTime] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => prev.includes(symptom)
      ? prev.filter(s => s !== symptom)
      : [...prev, symptom]);
  };

  const canSave = feeling !== null;
  const showAlert = feeling === 'not_good' || feeling === 'poor';

  const handleSave = () => {
    if (!feeling) return;
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    onSave(feeling, symptoms, note);
    setSaved(true);
    setSavedTime(now);
  };

  const handleEdit = () => {
    setSaved(false);
  };

  const handleNotifyDoctor = () => {
    const feelingLabel = feelingOptions.find(f => f.key === feeling)?.label ?? '';
    const symptomsText = symptoms.length > 0 ? symptoms.join(', ') : 'No specific symptoms';
    const prefill = `I'm feeling ${feelingLabel.toLowerCase()} today. Symptoms: ${symptomsText}. Please contact me.`;
    onNavigate('Messages');
    setTimeout(() => {
      const event = new CustomEvent('prefill-message', { detail: prefill });
      window.dispatchEvent(event);
    }, 100);
  };

  if (saved && feeling) {
    const feelingInfo = feelingOptions.find(f => f.key === feeling)!;
    return (
      <div className="page-content">
        <div className="page-intro">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> Daily check-in</div>
            <h1>How are you feeling today?</h1>
            <p className="intro-copy">It only takes a moment to check in.</p>
          </div>
        </div>

        <div className="checkin-saved-card">
          <div className="checkin-saved-banner">
            <CheckCircle2 size={28} />
            <div>
              <strong>Your check-in is saved</strong>
              <span>Taking you back to your dashboard is easy.</span>
            </div>
          </div>
          <div className="checkin-saved-body">
            <div className="checkin-saved-feeling">
              <span className="checkin-saved-emoji">{feelingInfo.emoji}</span>
              <div>
                <strong>Feeling: {feelingInfo.label}</strong>
                <span>Today, {savedTime}</span>
              </div>
            </div>
            {symptoms.length > 0 && (
              <div className="checkin-saved-symptoms">
                <span className="checkin-saved-symptoms-label">Symptoms:</span>
                <div className="checkin-saved-chips">
                  {symptoms.map(s => <span key={s} className="checkin-saved-chip">{s}</span>)}
                </div>
              </div>
            )}
            {note && (
              <div className="checkin-saved-note">
                <span className="checkin-saved-note-label">Note:</span>
                <p>{note}</p>
              </div>
            )}
          </div>
          <div className="checkin-saved-actions">
            <button className="outline-button" onClick={handleEdit}><RotateCcw size={15} /> Edit check-in</button>
            <button className="primary-button" onClick={() => onNavigate('Home')}><Home size={17} /> Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Daily check-in</div>
          <h1>How are you feeling today?</h1>
          <p className="intro-copy">It only takes a moment to check in.</p>
        </div>
      </div>

      <section className="checkin-section">
        <SectionHeading title="How are you feeling today?" />
        <p className="checkin-sub">Select the option that best describes your current mood and energy.</p>
        <div className="feeling-grid">
          {feelingOptions.map(opt => (
            <button
              key={opt.key}
              className={`feeling-option ${feeling === opt.key ? 'feeling-selected' : ''}`}
              onClick={() => setFeeling(opt.key)}
              aria-pressed={feeling === opt.key}
            >
              <span className="feeling-option-emoji">{opt.emoji}</span>
              <span className="feeling-option-label">{opt.label}</span>
              {feeling === opt.key && <span className="feeling-check"><Check size={14} strokeWidth={3} /></span>}
            </button>
          ))}
        </div>
      </section>

      <section className="checkin-section">
        <SectionHeading title="Any symptoms today?" />
        <p className="checkin-sub">Select one or multiple symptoms you are experiencing right now.</p>
        <div className="symptom-chips">
          {symptomOptions.map(symptom => {
            const selected = symptoms.includes(symptom);
            return (
              <button
                key={symptom}
                className={`symptom-chip ${selected ? 'symptom-selected' : ''}`}
                onClick={() => toggleSymptom(symptom)}
                aria-pressed={selected}
              >
                <span className={`symptom-check-icon ${selected ? 'symptom-check-on' : ''}`}>
                  {selected && <Check size={14} strokeWidth={3} />}
                </span>
                {symptom}
              </button>
            );
          })}
        </div>
      </section>

      <section className="checkin-section">
        <SectionHeading title="Notes" />
        <p className="checkin-sub">Type any additional details for your caregiver (optional).</p>
        <textarea
          className="checkin-note"
          placeholder="Add a note…"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
        />
      </section>

      <div className="checkin-save-row">
        <button
          className={`primary-button checkin-save ${!canSave ? 'button-disabled' : ''}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          <Check size={18} /> Save today's check-in
        </button>
      </div>

      {showAlert && (
        <Banner
          severity="alert"
          icon={ShieldAlert}
          title="Your health is our priority"
          message="Consider notifying your medical team about how you feel."
          actionLabel="Notify Doctor Now"
          onAction={handleNotifyDoctor}
        />
      )}
    </div>
  );
}

function MessagesPage({ onNavigate, prefill, onSent }: { onNavigate: (page: Page) => void; prefill: string; onSent: () => void }) {
  const [selectedMember, setSelectedMember] = useState<CareMember | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) {
        setSelectedMember(careTeam[1]);
        setMessage(detail);
        setSent(false);
      }
    };
    window.addEventListener('prefill-message', handler);
    return () => window.removeEventListener('prefill-message', handler);
  }, []);

  const openComposer = (member: CareMember, prefillText?: string) => {
    setSelectedMember(member);
    setMessage(prefillText || prefill || '');
    setSent(false);
  };

  const handleSend = () => {
    if (!selectedMember || !message.trim()) return;
    setSentTo(selectedMember.name);
    setSent(true);
    onSent();
  };

  const handleBack = () => {
    setSelectedMember(null);
    setSent(false);
    setMessage('');
  };

  if (sent) {
    return (
      <div className="page-content">
        <div className="page-intro">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> Messages sent</div>
            <h1>Message sent</h1>
            <p className="intro-copy">{sentTo} will be notified.</p>
          </div>
        </div>
        <div className="message-sent-card">
          <div className="message-sent-banner">
            <CheckCircle2 size={28} />
            <div>
              <strong>Message sent</strong>
              <span>{sentTo} will be notified.</span>
            </div>
          </div>
          <div className="message-sent-actions">
            <button className="outline-button" onClick={handleBack}><ArrowLeft size={16} /> Send another</button>
            <button className="primary-button" onClick={() => onNavigate('Home')}><Home size={17} /> Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMember) {
    return (
      <div className="page-content">
        <div className="page-intro">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> New message</div>
            <h1>Message your care team</h1>
            <p className="intro-copy">Write a message and we'll send it along.</p>
          </div>
        </div>

        <div className="composer-card">
          <div className="composer-to">
            <span className="composer-to-label">To:</span>
            <div className="composer-to-person">
              <span className="composer-avatar">{selectedMember.initials}</span>
              <div>
                <strong>{selectedMember.name}</strong>
                <span>{selectedMember.role}</span>
              </div>
            </div>
          </div>
          <textarea
            className="composer-textarea"
            placeholder="How can we help?"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            autoFocus
          />
          <div className="composer-actions">
            <button className="outline-button" onClick={handleBack}><ArrowLeft size={16} /> Back</button>
            <button
              className={`primary-button ${!message.trim() ? 'button-disabled' : ''}`}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <Send size={17} /> Send message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Stay connected</div>
          <h1>Care team</h1>
          <p className="intro-copy">Get help or send a message.</p>
        </div>
      </div>

      <SectionHeading title="Your care team" />
      <div className="care-team-list">
        {careTeam.map(member => (
          <div key={member.name} className="care-team-row">
            <div className="care-team-avatar">{member.initials}</div>
            <div className="care-team-info">
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </div>
            {member.available && <span className="care-team-status"><span className="care-team-dot" /> Available</span>}
            <button className="outline-button care-team-message" onClick={() => openComposer(member)}>
              <MessageCircle size={15} /> Message
            </button>
          </div>
        ))}
      </div>

      <section className="quick-help-section">
        <SectionHeading title="How can we help?" />
        <div className="quick-help-grid">
          {quickHelpOptions.map(option => (
            <button
              key={option}
              className="quick-help-card"
              onClick={() => openComposer(careTeam[0], option)}
            >
              <span className="quick-help-icon"><CircleHelp size={18} /></span>
              <span className="quick-help-text">{option}</span>
              <ChevronRight size={16} className="quick-help-arrow" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function PlaceholderPage({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  const pageInfo: Record<Page, { icon: LucideIcon; eyebrow: string; title: string; copy: string }> = {
    Home: { icon: LayoutDashboard, eyebrow: 'Your care space', title: 'Home', copy: '' },
    Medications: { icon: Pill, eyebrow: 'Medication list', title: 'Your medications', copy: 'Keep your medication schedule in one simple place.' },
    Symptoms: { icon: Activity, eyebrow: 'Daily check-ins', title: 'Your symptoms', copy: 'Notice how you feel and keep a gentle record over time.' },
    Messages: { icon: MessageCircle, eyebrow: 'Stay connected', title: 'Messages', copy: 'Your care team is just a message away.' },
    Reminders: { icon: Bell, eyebrow: 'Your schedule', title: 'Reminders', copy: "See what's coming up and keep your day moving comfortably." },
    'Care Team': { icon: Stethoscope, eyebrow: 'People supporting you', title: 'Care team', copy: 'The people helping you feel your best, all in one place.' },
    Settings: { icon: Settings, eyebrow: 'Personal account', title: 'Settings', copy: 'Manage your preferences and how CareNest works for you.' },
  };
  const info = pageInfo[page];
  const Icon = info.icon;
  return (
    <div className="page-content placeholder-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> {info.eyebrow}</div>
          <h1>{info.title}</h1>
          <p className="intro-copy">{info.copy}</p>
        </div>
      </div>
      <div className="empty-state">
        <div className="empty-icon"><Icon size={27} /></div>
        <h2>This space is ready for you.</h2>
        <p>This area will grow with your care journey. For now, head back home to see your next step.</p>
        <button className="primary-button" onClick={() => onNavigate('Home')}><Home size={17} /> Back to home</button>
      </div>
    </div>
  );
}

export default App;
