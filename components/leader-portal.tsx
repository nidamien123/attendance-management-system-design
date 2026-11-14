'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronDown,
  Download,
  FileText,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Music2,
  Save,
  ShieldCheck,
  Users,
} from 'lucide-react'

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused'
type LeaderSection = 'Attendance' | 'Leader account' | 'PDF reports' | 'Choir'
type LeaderReport = { id: string; date: string; status: 'Pending' | 'Approved'; present: number; absent: number }

const leaderReports: LeaderReport[] = [
  { id: 'ATT-0248', date: 'Nov 12, 2026', status: 'Pending', present: 42, absent: 6 },
  { id: 'ATT-0239', date: 'Nov 05, 2026', status: 'Approved', present: 45, absent: 3 },
  { id: 'ATT-0227', date: 'Oct 29, 2026', status: 'Approved', present: 40, absent: 8 },
]

const initialMembers = [
  { name: 'Emmanuel Niyonzima', role: 'Tenor', status: 'Present' as AttendanceStatus },
  { name: 'Grace Uwase', role: 'Soprano', status: 'Present' as AttendanceStatus },
  { name: 'Samuel Habimana', role: 'Bass', status: 'Late' as AttendanceStatus },
  { name: 'Aline Mukamana', role: 'Alto', status: 'Absent' as AttendanceStatus },
  { name: 'Jean Claude', role: 'Tenor', status: 'Present' as AttendanceStatus },
  { name: 'Diane Uwera', role: 'Soprano', status: 'Present' as AttendanceStatus },
  { name: 'Patrick Mugenzi', role: 'Bass', status: 'Excused' as AttendanceStatus },
  { name: 'Claudine Ingabire', role: 'Alto', status: 'Present' as AttendanceStatus },
]

const leaderNav: { label: LeaderSection; icon: typeof CalendarCheck }[] = [
  { label: 'Attendance', icon: CalendarCheck },
  { label: 'Leader account', icon: KeyRound },
  { label: 'PDF reports', icon: FileText },
  { label: 'Choir', icon: Music2 },
]

export function LeaderPortal({ onSignOut, onSwitchToAdmin }: { onSignOut: () => void; onSwitchToAdmin: () => void }) {
  const [active, setActive] = useState<LeaderSection>('Attendance')
  const [members, setMembers] = useState(initialMembers)
  const [notice, setNotice] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [printedReport, setPrintedReport] = useState(leaderReports[0])

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function printAttendanceReport(report: LeaderReport) {
    setPrintedReport(report)
    window.setTimeout(() => window.print(), 100)
  }

  function updateAttendance(index: number, status: AttendanceStatus) {
    setMembers((current) => current.map((member, memberIndex) => memberIndex === index ? { ...member, status } : member))
  }

  function submitAttendance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    showNotice('Attendance report submitted to the administrator for review.')
  }

  function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newPassword = String(formData.get('newPassword') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')
    if (newPassword.length < 8) {
      showNotice('Choose a password with at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      showNotice('The new password and confirmation do not match.')
      return
    }
    setPasswordSaved(true)
    showNotice('Password updated for this demo session.')
    event.currentTarget.reset()
  }

  const countByStatus = (status: AttendanceStatus) => members.filter((member) => member.status === status).length

  return <div className="leader-shell">
    <aside className="leader-sidebar">
      <a className="brand leader-brand" href="#leader-attendance"><span className="leader-brand-icon"><Music2 size={18} /></span><span className="brand-text">mashenyi<span>CHOIR PORTAL</span></span></a>
      <div className="leader-choir-card"><span className="leader-choir-label">YOUR ASSIGNED CHOIR</span><strong>Abizera Yesu</strong><span className="leader-members-count"><Users size={13} /> 48 active members</span></div>
      <div className="workspace-label">LEADER WORKSPACE</div>
      <nav className="side-nav" aria-label="Choir leader navigation">{leaderNav.map(({ label, icon: Icon }) => <button className={`nav-item ${active === label ? 'nav-active' : ''}`} key={label} onClick={() => setActive(label)}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'PDF reports' && <span className="nav-count">2</span>}</button>)}</nav>
      <div className="leader-sidebar-bottom"><button className="leader-back-admin" onClick={onSwitchToAdmin}><ArrowLeft size={15} /> Switch to admin dashboard</button><div className="profile-row"><div className="avatar avatar-admin">EN</div><div className="profile-copy"><strong>Emmanuel Niyonzima</strong><span>Choir leader</span></div><button onClick={onSignOut} aria-label="Sign out" className="signout-button"><LogOut size={16} /></button></div></div>
    </aside>
    <main className="leader-main">
      <header className="topbar leader-topbar"><div className="breadcrumb">Leader workspace <span>›</span> <strong>{active}</strong></div><div className="leader-topbar-right"><span className="leader-role-badge"><ShieldCheck size={13} /> Choir leader</span><div className="avatar avatar-admin">EN</div></div></header>
      <div className="leader-content">
        <div className="leader-welcome"><div><div className="leader-kicker">THURSDAY, NOVEMBER 12, 2026 <span>·</span> ABIZERA YESU</div><h1>{active === 'Attendance' ? 'Good morning, Emmanuel' : active}</h1><p>{active === 'Attendance' ? 'Record this week’s rehearsal attendance and send it for review.' : `Manage your ${active.toLowerCase()} for Abizera Yesu.`}</p></div>{active === 'PDF reports' && <button className="button-primary leader-print-button" onClick={() => printAttendanceReport(printedReport)}><Download size={15} /> Print / save as PDF</button>}</div>

        {active === 'Attendance' && <>
          <section className="leader-summary-grid" aria-label="Attendance summary"><article className="leader-summary-card"><span className="leader-summary-icon"><Users size={17} /></span><span className="leader-summary-label">CHOIR MEMBERS</span><strong>48</strong><small>Assigned to your choir</small></article><article className="leader-summary-card"><span className="leader-summary-icon present-icon"><Check size={17} /></span><span className="leader-summary-label">PRESENT TODAY</span><strong>{countByStatus('Present')}</strong><small>Including members marked late: {countByStatus('Late')}</small></article><article className="leader-summary-card"><span className="leader-summary-icon report-icon"><FileText size={17} /></span><span className="leader-summary-label">REPORTS THIS MONTH</span><strong>4</strong><small>1 report pending review</small></article></section>
          <form className="leader-panel attendance-form" onSubmit={submitAttendance}><div className="leader-panel-heading"><div><div className="leader-section-icon"><CalendarCheck size={17} /></div><div><h2>Rehearsal attendance</h2><p>Thursday, November 12 · Weekly choir practice</p></div></div><span className="leader-draft-pill"><span /> Draft</span></div><div className="attendance-helper"><BookOpen size={15} /><span>Mark each member’s status, then submit this report to the administrator for review.</span></div><div className="attendance-list-heading"><span>CHOIR MEMBER</span><span>STATUS</span></div><div className="leader-member-list">{members.map((member, index) => <div className="leader-member-row" key={member.name}><div className="leader-member-person"><span className="avatar avatar-leader">{member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{member.name}</strong><small>{member.role}</small></span></div><label className="member-status-select"><span className="sr-only">Attendance status for {member.name}</span><select value={member.status} onChange={(event) => updateAttendance(index, event.target.value as AttendanceStatus)}><option>Present</option><option>Absent</option><option>Late</option><option>Excused</option></select><ChevronDown size={13} /></label></div>)}</div><div className="attendance-form-footer"><span><LockKeyhole size={13} /> Submitted reports are locked for review.</span><button className="button-primary" type="submit"><Check size={15} /> Submit attendance report</button></div></form>
        </>}

        {active === 'Leader account' && <section className="leader-panel account-panel"><div className="leader-panel-heading"><div><div className="leader-section-icon"><KeyRound size={17} /></div><div><h2>Leader account</h2><p>Profile and password settings</p></div></div><span className="leader-role-badge"><ShieldCheck size={13} /> Leader access</span></div><div className="account-profile"><div className="account-avatar">EN</div><div><h3>Emmanuel Niyonzima</h3><p>Choir leader · Abizera Yesu</p></div><span className="account-active"><i /> Active</span></div><div className="account-details"><div><span>EMAIL ADDRESS</span><strong>emmanuel.niyonzima@mashenyi.org</strong></div><div><span>ASSIGNED CHOIR</span><strong>Abizera Yesu</strong></div><div><span>ACCOUNT ROLE</span><strong>Choir leader</strong></div></div><form className="password-form" onSubmit={savePassword}><div className="password-title"><KeyRound size={16} /><div><h3>Change password</h3><p>Use at least 8 characters. Your password is not saved in this preview.</p></div></div><label>Current password<input type="password" name="currentPassword" required minLength={8} autoComplete="current-password" /></label><div className="password-fields"><label>New password<input type="password" name="newPassword" required minLength={8} autoComplete="new-password" /></label><label>Confirm new password<input type="password" name="confirmPassword" required minLength={8} autoComplete="new-password" /></label></div><div className="password-form-footer"><span>{passwordSaved ? 'Password change demonstrated for this session.' : 'Password updates require a connected secure account service.'}</span><button className="button-primary" type="submit"><Save size={15} /> Update password</button></div></form></section>}

        {active === 'PDF reports' && <section className="leader-panel pdf-reports-panel"><div className="leader-panel-heading"><div><div className="leader-section-icon"><FileText size={17} /></div><div><h2>Your attendance reports</h2><p>Print or save a report as a PDF from your browser.</p></div></div></div><div className="pdf-callout"><ShieldCheck size={18} /><div><strong>Only your choir’s reports</strong><p>As a choir leader, you can access reports submitted for Abizera Yesu only.</p></div></div><div className="report-history-list">{leaderReports.map((report) => <article className="report-history-row" key={report.id}><span className="pdf-file-icon"><FileText size={17} /></span><div className="report-history-copy"><strong>{report.id} <span>· {report.date}</span></strong><small>{report.present} present · {report.absent} absent</small></div><span className={`history-status history-${report.status.toLowerCase()}`}>{report.status}</span><button className="button-secondary pdf-row-button" onClick={() => printAttendanceReport(report)}><Download size={14} /> PDF</button></article>)}</div><div className="leader-print-sheet"><div className="print-brand">ADEPR MASHENYI <span>CHOIR ATTENDANCE REPORT</span></div><h1>Abizera Yesu</h1><p>Rehearsal attendance · {printedReport.date} · Report {printedReport.id}</p><div className="print-summary"><span>Present <strong>{printedReport.present}</strong></span><span>Absent <strong>{printedReport.absent}</strong></span><span>Total members <strong>{printedReport.present + printedReport.absent}</strong></span><span>Status <strong>{printedReport.status}</strong></span></div><p className="print-submitted-by">Submitted by Emmanuel Niyonzima · Choir leader · ADEPR Mashenyi</p></div></section>}

        {active === 'Choir' && <section className="leader-panel choir-roster-panel"><div className="leader-panel-heading"><div><div className="leader-section-icon"><Music2 size={17} /></div><div><h2>Abizera Yesu</h2><p>Your assigned choir · 48 active members</p></div></div><span className="leader-role-badge">Choir roster</span></div><div className="choir-details-banner"><div className="choir-banner-mark"><Music2 size={22} /></div><div><span>YOUR CHOIR</span><h3>Abizera Yesu</h3><p>Led by Emmanuel Niyonzima · ADEPR Mashenyi</p></div><div className="choir-banner-count"><strong>48</strong><span>members</span></div></div><div className="roster-heading"><h3>Choir members</h3><span>Showing 8 of 48 members</span></div><div className="leader-member-list">{members.map((member) => <div className="leader-member-row" key={member.name}><div className="leader-member-person"><span className="avatar avatar-leader">{member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{member.name}</strong><small>{member.role}</small></span></div><span className="roster-member-status">Active member</span></div>)}</div><p className="roster-note"><LockKeyhole size={13} /> Contact the administrator to update your choir roster.</p></section>}
      </div>
    </main>
    {notice && <div className="toast-message leader-toast" role="status"><Check size={16} />{notice}</div>}
  </div>
}
