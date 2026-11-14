'use client'

import { useMemo, useState } from 'react'
import { LeaderPortal } from '@/components/leader-portal'
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileText,
  Filter,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MoreHorizontal,
  Music2,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'

type ReportStatus = 'Pending' | 'Approved' | 'Rejected'
type Report = {
  id: string
  choir: string
  date: string
  leader: string
  submitted: string
  present: number
  absent: number
  status: ReportStatus
}

const initialReports: Report[] = [
  { id: 'ATT-0248', choir: 'Abizera Yesu', date: 'Nov 12, 2026', leader: 'Emmanuel Niyonzima', submitted: '18 min ago', present: 42, absent: 6, status: 'Pending' },
  { id: 'ATT-0247', choir: 'Maranatha', date: 'Nov 12, 2026', leader: 'Grace Uwase', submitted: '1 hour ago', present: 36, absent: 3, status: 'Pending' },
  { id: 'ATT-0246', choir: 'Abacunguwe', date: 'Nov 10, 2026', leader: 'Samuel Habimana', submitted: 'Yesterday', present: 29, absent: 8, status: 'Pending' },
  { id: 'ATT-0245', choir: "N'Ubwo Yesu Yaza", date: 'Nov 09, 2026', leader: 'Aline Mukamana', submitted: '2 days ago', present: 51, absent: 4, status: 'Approved' },
  { id: 'ATT-0244', choir: 'Army of God', date: 'Nov 08, 2026', leader: 'Jean Claude', submitted: '3 days ago', present: 33, absent: 2, status: 'Approved' },
  { id: 'ATT-0243', choir: 'Maranatha', date: 'Nov 06, 2026', leader: 'Grace Uwase', submitted: 'Nov 7', present: 34, absent: 5, status: 'Rejected' },
]

const choirs = [
  { name: 'Abizera Yesu', members: 48, rate: 88, color: 'gold' },
  { name: 'Maranatha', members: 39, rate: 92, color: 'blue' },
  { name: 'Abacunguwe', members: 37, rate: 79, color: 'mint' },
  { name: "N'Ubwo Yesu Yaza", members: 55, rate: 94, color: 'violet' },
  { name: 'Army of God', members: 42, rate: 86, color: 'coral' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Attendance reports', icon: ClipboardCheck, count: '3' },
  { label: 'Choir leaders', icon: Users },
  { label: 'Choirs & members', icon: Activity },
]

function BrandMark() {
  return <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
}

function Sidebar({ active, onSelect, onSignOut, mobileOpen, closeMobile }: {
  active: string
  onSelect: (label: string) => void
  onSignOut: () => void
  mobileOpen: boolean
  closeMobile: () => void
}) {
  return <>
    {mobileOpen && <button className="mobile-scrim" onClick={closeMobile} aria-label="Close navigation" />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <a className="brand" href="#overview" aria-label="Mashenyi choir admin home"><BrandMark /><span className="brand-text">mashenyi<span>CHOIR ADMIN</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map(({ label, icon: Icon, count }) => <button key={label} onClick={() => { onSelect(label); closeMobile() }} className={`nav-item ${active === label ? 'nav-active' : ''}`}>
          <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}
        </button>)}
      </nav>
      <div className="sidebar-section-heading"><span>YOUR CHOIRS</span><button aria-label="View all choirs"><MoreHorizontal size={17} /></button></div>
      <div className="choir-nav">
        {choirs.map((choir) => <button key={choir.name} onClick={() => onSelect('Choirs & members')}><span className={`choir-dot dot-${choir.color}`} />{choir.name}</button>)}
      </div>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={16} /></div><strong>Need a hand?</strong><p>Learn how to review and manage reports.</p><button onClick={() => onSelect('Help center')}>Visit help center <ArrowUpRight size={13} /></button></div>
        <button className="nav-item settings-link" onClick={() => onSelect('Settings')}><Settings2 size={17} /><span>Settings</span></button>
        <div className="profile-row"><div className="avatar avatar-admin">DM</div><div className="profile-copy"><strong>Daniel Mutabazi</strong><span>System administrator</span></div><button onClick={onSignOut} aria-label="Sign out" className="signout-button"><LogOut size={16} /></button></div>
      </div>
    </aside>
  </>
}

function StatusPill({ status }: { status: ReportStatus }) {
  return <span className={`status-pill status-${status.toLowerCase()}`}><span />{status}</span>
}

function ReviewDialog({ report, onClose, onDecision }: { report: Report; onClose: () => void; onDecision: (id: string, status: ReportStatus) => void }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="review-dialog" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <div className="dialog-top"><div className="dialog-icon"><FileText size={19} /></div><button className="icon-button" onClick={onClose} aria-label="Close report"><X size={18} /></button></div>
      <div className="dialog-eyebrow">ATTENDANCE REPORT · {report.id}</div><h2 id="review-title">{report.choir}</h2><p className="dialog-subtitle">Submitted by {report.leader} on {report.date}</p>
      <div className="review-stats"><div><span>Members present</span><strong>{report.present}</strong></div><div><span>Members absent</span><strong>{report.absent}</strong></div><div><span>Total members</span><strong>{report.present + report.absent}</strong></div></div>
      <div className="attendance-breakdown"><div className="breakdown-head"><strong>Attendance breakdown</strong><span>{Math.round(report.present / (report.present + report.absent) * 100)}% attendance</span></div><div className="breakdown-track"><div style={{ width: `${Math.round(report.present / (report.present + report.absent) * 100)}%` }} /></div><div className="breakdown-key"><span><i className="key-present" /> Present</span><span><i className="key-absent" /> Absent</span></div></div>
      {rejecting && <label className="reason-field">Reason for returning report<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Share what needs to be corrected…" rows={3} /></label>}
      <div className="dialog-actions"><button className="button-secondary" onClick={onClose}>Close</button>{report.status === 'Pending' && <><button className="button-reject" disabled={rejecting && !reason.trim()} onClick={() => rejecting ? onDecision(report.id, 'Rejected') : setRejecting(true)}>{rejecting ? 'Send back' : 'Reject report'}</button><button className="button-primary" onClick={() => onDecision(report.id, 'Approved')}><Check size={15} /> Approve report</button></>}</div>
      {rejecting && !reason.trim() && <p className="reason-hint">Add a reason before sending this report back.</p>}
    </section>
  </div>
}

function LoginScreen({ onLogin }: { onLogin: (role: 'admin' | 'leader') => void }) {
  const [role, setRole] = useState<'admin' | 'leader'>('admin')
  const [error, setError] = useState('')

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')
    if (password.length < 8) {
      setError('Enter a password with at least 8 characters.')
      return
    }
    setError('')
    onLogin(role)
  }

  return <main className="login-page"><div className="login-decoration"><div className="login-orb login-orb-one" /><div className="login-orb login-orb-two" /><div className="login-verse"><span className="verse-mark">“</span><p>Sing to the Lord a new song; sing to the Lord, all the earth.</p><span>PSALM 96:1</span></div></div><section className="login-panel"><div className="login-brand"><BrandMark /><span className="brand-text">mashenyi<span>ATTENDANCE MANAGEMENT</span></span></div><form className="login-form-wrap" onSubmit={submitLogin}><div className="login-eyebrow"><LockKeyhole size={14} /> SECURE AREA</div><h1>Welcome back.</h1><p>Sign in to access your choir workspace.</p><div className="login-role-switch" role="group" aria-label="Choose your account type"><button type="button" className={role === 'admin' ? 'login-role-active' : ''} onClick={() => setRole('admin')}><ShieldCheck size={15} /> Administrator</button><button type="button" className={role === 'leader' ? 'login-role-active' : ''} onClick={() => setRole('leader')}><Music2 size={15} /> Choir leader</button></div><label>Email address<input type="email" name="email" required autoComplete="username" placeholder={role === 'admin' ? 'admin@example.org' : 'leader@example.org'} /></label><label>Password<input type="password" name="password" required minLength={8} autoComplete="current-password" placeholder="Enter your password" /></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="button-primary login-submit" type="submit">Sign in as {role === 'admin' ? 'administrator' : 'choir leader'} <ChevronRight size={16} /></button><div className="login-note"><ShieldCheck size={15} /><span>{role === 'admin' ? 'Administrator access' : 'Assigned choir access'}</span></div><p className="demo-note">Demo only: sign-in is not connected to a secure authentication service.</p></form><span className="login-footer">ADEPR MASHENYI · ATTENDANCE MANAGEMENT</span></section></main>
}

export function AdminDashboard() {
  const [reports, setReports] = useState(initialReports)
  const [activeNav, setActiveNav] = useState('Overview')
  const [filter, setFilter] = useState('All reports')
  const [query, setQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [currentRole, setCurrentRole] = useState<'admin' | 'leader'>('admin')
  const [notice, setNotice] = useState('')

  const pendingCount = reports.filter((report) => report.status === 'Pending').length
  const filteredReports = useMemo(() => reports.filter((report) => {
    const matchesFilter = filter === 'All reports' || report.status === filter
    const matchesSearch = `${report.id} ${report.choir} ${report.leader}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesSearch
  }), [filter, query, reports])

  function decideReport(id: string, status: ReportStatus) {
    setReports((current) => current.map((report) => report.id === id ? { ...report, status } : report))
    setNotice(status === 'Approved' ? 'Report approved successfully.' : 'Report returned to the choir leader with your feedback.')
    setSelectedReport(null)
    window.setTimeout(() => setNotice(''), 3200)
  }

  function downloadCsv() {
    const csv = ['Report ID,Choir,Date,Leader,Present,Absent,Status', ...reports.map((report) => [report.id, `"${report.choir}"`, report.date, `"${report.leader}"`, report.present, report.absent, report.status].join(','))].join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'mashenyi-attendance-reports.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  if (!signedIn) return <LoginScreen onLogin={(role) => { setCurrentRole(role); setSignedIn(true) }} />
  if (currentRole === 'leader') return <LeaderPortal onSignOut={() => setSignedIn(false)} onSwitchToAdmin={() => setCurrentRole('admin')} />

  return <div className="admin-shell">
    <Sidebar active={activeNav} onSelect={setActiveNav} onSignOut={() => setSignedIn(false)} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{activeNav}</strong></div></div><div className="topbar-right"><span className="live-status"><i /> All systems operational</span><button className="role-switch-button" onClick={() => setCurrentRole('leader')}><Users size={14} /> Leader portal</button><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="topbar-divider" /><div className="topbar-admin"><div className="avatar avatar-admin">DM</div><ChevronDown size={14} /></div></div></header>
      <div className="page-content">
        <div className="welcome-row"><div><div className="page-kicker">THURSDAY, NOVEMBER 12, 2026 <span>·</span> ADEPR MASHENYI</div><h1>{activeNav === 'Overview' ? 'Good morning, Daniel' : activeNav}</h1><p>{activeNav === 'Overview' ? 'Here’s what’s happening across your choirs today.' : `Monitor and manage ${activeNav.toLowerCase()} across ADEPR Mashenyi.`}</p></div><button className="button-secondary export-button" onClick={downloadCsv}><ArrowDownToLine size={16} /> Export reports</button></div>
        <section className="stats-grid" aria-label="Attendance overview statistics">
          <article className="stat-card"><div className="stat-top"><span className="stat-icon icon-indigo"><Users size={18} /></span><span className="stat-trend trend-up"><ArrowUpRight size={13} /> 8.2%</span></div><span className="stat-label">CHOIR MEMBERS</span><strong>221</strong><span className="stat-foot">Across 5 active choirs</span></article>
          <article className="stat-card"><div className="stat-top"><span className="stat-icon icon-gold"><FileText size={18} /></span><span className="stat-trend trend-up"><ArrowUpRight size={13} /> 12.5%</span></div><span className="stat-label">REPORTS THIS MONTH</span><strong>28</strong><span className="stat-foot">6 submitted this week</span></article>
          <article className="stat-card stat-pending-card"><div className="stat-top"><span className="stat-icon icon-orange"><Clock3 size={18} /></span><span className="stat-tag">NEEDS REVIEW</span></div><span className="stat-label">PENDING APPROVAL</span><strong>{String(pendingCount).padStart(2, '0')}</strong><span className="stat-foot">Awaiting your review</span></article>
          <article className="stat-card"><div className="stat-top"><span className="stat-icon icon-green"><Activity size={18} /></span><span className="stat-trend trend-up"><ArrowUpRight size={13} /> 3.1%</span></div><span className="stat-label">AVERAGE ATTENDANCE</span><strong>87<span className="stat-percent">%</span></strong><span className="stat-foot">Up from 83% last month</span></article>
        </section>

        <div className="dashboard-grid">
          <section className="panel attendance-panel"><div className="panel-header"><div><h2>Attendance overview</h2><p>Member attendance across all choirs</p></div><button className="select-button"><CalendarDays size={14} /> Last 7 days <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-present" /> Present</span><span><i className="legend-absent" /> Absent</span><strong>87.4% <small>average</small></strong></div><div className="chart-area" role="img" aria-label="Bar chart showing weekly attendance rates ranging from 72 to 96 percent"><div className="chart-ylabels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div><div className="chart-plot"><div className="chart-gridline line-100" /><div className="chart-gridline line-75" /><div className="chart-gridline line-50" /><div className="chart-gridline line-25" />{[{ day: 'Fri', p: 70, a: 12 }, { day: 'Sat', p: 75, a: 10 }, { day: 'Sun', p: 87, a: 8 }, { day: 'Mon', p: 68, a: 9 }, { day: 'Tue', p: 78, a: 12 }, { day: 'Wed', p: 82, a: 10 }, { day: 'Thu', p: 89, a: 7 }].map((item) => <div className="chart-day" key={item.day}><div className="bar-stack"><span className="bar-present" style={{ height: `${item.p}%` }} /><span className="bar-absent" style={{ height: `${item.a}%` }} /></div><span className="chart-day-label">{item.day}</span></div>)}</div></div></section>
          <section className="panel choir-panel"><div className="panel-header"><div><h2>Choir attendance</h2><p>Attendance rate by group</p></div><button className="icon-button subtle-icon" aria-label="More choir options"><MoreHorizontal size={19} /></button></div><div className="choir-list">{choirs.map((choir) => <div className="choir-row" key={choir.name}><div className={`choir-avatar avatar-${choir.color}`}>{choir.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><div className="choir-info"><strong>{choir.name}</strong><span>{choir.members} members</span></div><div className="choir-rate"><strong>{choir.rate}%</strong><div className="rate-track"><i className={`rate-${choir.color}`} style={{ width: `${choir.rate}%` }} /></div></div></div>)}</div><button className="view-all-button" onClick={() => setActiveNav('Choirs & members')}>View all choirs <ArrowUpRight size={14} /></button></section>
        </div>

        <section className="panel reports-panel"><div className="reports-heading"><div><div className="title-with-count"><h2>Recent attendance reports</h2><span className="report-count">{filteredReports.length}</span></div><p>Review submissions from your choir leaders</p></div><div className="report-tools"><label className="search-field"><Search size={15} /><input aria-label="Search reports" placeholder="Search reports..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="filter-select"><Filter size={14} /><select aria-label="Filter reports" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All reports</option><option>Pending</option><option>Approved</option><option>Rejected</option></select><ChevronDown size={13} /></label></div></div><div className="table-wrap"><table><thead><tr><th>REPORT</th><th>CHOIR</th><th>SUBMITTED BY</th><th>ATTENDANCE</th><th>STATUS</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{filteredReports.map((report) => <tr key={report.id} onClick={() => setSelectedReport(report)} className="report-row"><td><span className="report-id">{report.id}</span><span className="report-date">{report.date}</span></td><td><span className="table-choir"><span className="table-choir-dot" />{report.choir}</span></td><td><span className="leader-cell"><span className="avatar avatar-leader">{report.leader.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><span>{report.leader}</span></span></td><td><span className="attendance-cell"><strong>{report.present}</strong><span> / {report.present + report.absent} present</span></span></td><td><StatusPill status={report.status} /></td><td><button className="row-action" aria-label={`Review ${report.id}`} onClick={(event) => { event.stopPropagation(); setSelectedReport(report) }}><ChevronRight size={16} /></button></td></tr>)}</tbody></table>{filteredReports.length === 0 && <div className="empty-reports">No reports match your search.</div>}</div><div className="table-footer"><span>Showing <strong>{filteredReports.length}</strong> of <strong>{reports.length}</strong> reports</span><button onClick={() => setActiveNav('Attendance reports')}>View all reports <ArrowUpRight size={14} /></button></div></section>
        <footer className="page-footer"><span>© 2026 ADEPR Mashenyi · Choir Attendance Management</span><span><span className="footer-lock"><LockKeyhole size={12} /> Admin workspace</span><span className="footer-dot">·</span>Data shown is a demonstration</span></footer>
      </div>
    </main>
    {selectedReport && <ReviewDialog report={selectedReport} onClose={() => setSelectedReport(null)} onDecision={decideReport} />}
    {notice && <div className="toast-message" role="status"><Check size={16} />{notice}</div>}
  </div>
}
