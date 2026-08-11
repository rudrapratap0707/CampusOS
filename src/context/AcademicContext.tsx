import React, { createContext, useContext, useState, useEffect } from "react";
import NotificationContainer, { Toast, ConfirmDialogState } from "../components/common/NotificationContainer";

export const simulateHash = (plainText: string) => btoa("CAMPUS_" + plainText + "_OS");

export interface Subject { code: string; title: string; dept: string; hours: string; credits: number; }
export interface Faculty { id: string; firstName: string; lastName: string; email: string; dept: string; passwordHash?: string; hasChangedPassword?: boolean; }
export interface Batch { name: string; dept: string; coordinator: string; currentSemester: number; academicSession: string; }
export interface Student { rollNo: string; firstName: string; lastName: string; email: string; phone: string; batch: string; fatherName?: string; motherName?: string; enrollmentNo?: string; address?: string; passwordHash?: string; hasChangedPassword?: boolean; }
export interface AttendanceRecord { date: string; batch: string; semester?: number; subject: string; topic: string; records: { rollNo: string; status: "Present" | "Absent" }[]; }
export interface SubjectMark { subjectCode: string; internalTest: number; assignment: number; ese: number; }
export interface SemesterResult { semester: number; marks: { [subjectCode: string]: SubjectMark }; sgpa: number; totalCreditsEarned: number; backlogs: string[]; }
export interface StudentMarkRecord { rollNo: string; batch: string; history: SemesterResult[]; cgpa?: number; }
export interface ProfileUpdateRequest { id: string; rollNo: string; batch: string; requestedPhone: string; requestedAddress: string; status: "Pending" | "Approved" | "Rejected"; }
export interface PasswordResetRequest { id: string; userType: "faculty" | "student"; identifier: string; batch?: string; newPasswordHash: string; status: "Pending" | "Approved" | "Rejected"; }
export interface BatchSubjectAssignment { [batchSemKey: string]: { [subjectCode: string]: string; }; }
export interface BatchSelectedSubjects { [batchSemKey: string]: string[]; }

interface AcademicContextType {
  simulateHash: (plainText: string) => string;
  
  // ==========================================
  // NEW SYSTEM NOTIFICATION ENGINE EXPORTS
  // ==========================================
  showToast: (type: "success" | "error" | "warning" | "info", title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;

  departments: string[]; addDept: (dept: string) => void; editDept: (oldDept: string, newDept: string) => void; deleteDept: (dept: string) => void;
  faculties: Faculty[]; addFaculty: (faculty: Faculty) => void; deleteFaculty: (id: string) => void;
  batches: Batch[]; addBatch: (batch: Batch) => void; editBatch: (index: number, updated: Batch) => void; deleteBatch: (index: number) => void;
  promoteBatch: (batchName: string, newCoordinatorEmail: string) => void;
  subjects: Subject[]; addSubject: (sub: Subject) => void; editSubject: (code: string, updated: Subject) => void; deleteSubject: (code: string) => void;
  students: Student[]; addStudent: (student: Student) => void; editStudent: (rollNo: string, updated: Partial<Student>) => void; deleteStudent: (rollNo: string) => void;
  attendanceRecords: AttendanceRecord[]; saveAttendance: (record: AttendanceRecord) => void;
  studentMarksDb: StudentMarkRecord[]; saveSubjectInternalAndEse: (rollNo: string, batch: string, semester: number, subjectCode: string, internalTest: number, assignment: number, ese: number) => void;
  submittedSubjects: { [batch_sem_subject: string]: boolean }; submitSubjectToCoordinator: (batch: string, semester: number, subjectCode: string) => void;
  coordinatorApprovals: { [batch_sem: string]: boolean }; forwardBatchToAdmin: (batch: string, semester: number) => void;
  publishedBatches: { [batch_sem: string]: boolean }; adminPublishBatchResult: (batchName: string, semester: number) => void; adminUnpublishBatchResult: (batchName: string, semester: number) => void;
  profileRequests: ProfileUpdateRequest[]; requestProfileUpdate: (rollNo: string, batch: string, phone: string, address: string) => void; approveProfileUpdate: (id: string) => void; rejectProfileUpdate: (id: string) => void;
  batchSubjectAssignments: BatchSubjectAssignment; updateBatchSubjectAssignments: (batchName: string, semester: number, assignments: { [subjectCode: string]: string }) => void;
  batchSelectedSubjects: BatchSelectedSubjects; updateBatchSelectedSubjects: (batchName: string, semester: number, selectedCodes: string[]) => void;
  passwordRequests: PasswordResetRequest[]; requestPasswordReset: (userType: "faculty" | "student", identifier: string, newPasswordHash: string, batch?: string) => void; approvePasswordReset: (id: string) => void; rejectPasswordReset: (id: string) => void; changePasswordDirectly: (userType: "faculty" | "student", identifier: string, newPasswordHash: string) => void;
  condonationLimit: string; setCondonationLimit: (limit: string) => void; gradingMode: string; setGradingMode: (mode: string) => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const simulateHash = (plainText: string) => btoa("CAMPUS_" + plainText + "_OS");

  // ==========================================
  // NOTIFICATION STATE & LOGIC
  // ==========================================
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const showToast = (type: "success" | "error" | "warning" | "info", title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000); // Auto dismiss after 4s
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const [departments, setDepartments] = useState<string[]>(() => { const saved = localStorage.getItem("campusos_departments"); return saved ? JSON.parse(saved) : ["School of Computer Application"]; });
  const [faculties, setFaculties] = useState<Faculty[]>(() => { const saved = localStorage.getItem("campusos_faculties"); return saved ? JSON.parse(saved) : []; });
  const [batches, setBatches] = useState<Batch[]>(() => { const saved = localStorage.getItem("campusos_batches"); return saved ? JSON.parse(saved) : []; });
  const [subjects, setSubjects] = useState<Subject[]>(() => { const saved = localStorage.getItem("campusos_subjects"); return saved ? JSON.parse(saved) : []; });
  const [students, setStudents] = useState<Student[]>(() => { const saved = localStorage.getItem("campusos_students"); return saved ? JSON.parse(saved) : []; });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => { const saved = localStorage.getItem("campusos_attendance"); return saved ? JSON.parse(saved) : []; });
  const [studentMarksDb, setStudentMarksDb] = useState<StudentMarkRecord[]>(() => { const saved = localStorage.getItem("campusos_marks_v5"); return saved ? JSON.parse(saved) : []; });
  const [submittedSubjects, setSubmittedSubjects] = useState<{ [key: string]: boolean }>(() => { const saved = localStorage.getItem("campusos_submitted_subs_v2"); return saved ? JSON.parse(saved) : {}; });
  const [coordinatorApprovals, setCoordinatorApprovals] = useState<{ [key: string]: boolean }>(() => { const saved = localStorage.getItem("campusos_coord_approvals_v2"); return saved ? JSON.parse(saved) : {}; });
  const [publishedBatches, setPublishedBatches] = useState<{ [key: string]: boolean }>(() => { const saved = localStorage.getItem("campusos_published_batches_v2"); return saved ? JSON.parse(saved) : {}; });
  const [batchSubjectAssignments, setBatchSubjectAssignments] = useState<BatchSubjectAssignment>(() => { const saved = localStorage.getItem("campusos_batch_sub_assign_v2"); return saved ? JSON.parse(saved) : {}; });
  const [batchSelectedSubjects, setBatchSelectedSubjects] = useState<BatchSelectedSubjects>(() => { const saved = localStorage.getItem("campusos_batch_selected_subs_v2"); return saved ? JSON.parse(saved) : {}; });
  const [profileRequests, setProfileRequests] = useState<ProfileUpdateRequest[]>(() => { const saved = localStorage.getItem("campusos_profile_req"); return saved ? JSON.parse(saved) : []; });
  const [passwordRequests, setPasswordRequests] = useState<PasswordResetRequest[]>(() => { const saved = localStorage.getItem("campusos_password_reqs"); return saved ? JSON.parse(saved) : []; });

  const [condonationLimit, setCondonationLimit] = useState<string>("65");
  const [gradingMode, setGradingMode] = useState<string>("Absolute Grading (10-Point CBCS)");

  useEffect(() => { localStorage.setItem("campusos_departments", JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem("campusos_faculties", JSON.stringify(faculties)); }, [faculties]);
  useEffect(() => { localStorage.setItem("campusos_batches", JSON.stringify(batches)); }, [batches]);
  useEffect(() => { localStorage.setItem("campusos_subjects", JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem("campusos_students", JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem("campusos_attendance", JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { localStorage.setItem("campusos_marks_v5", JSON.stringify(studentMarksDb)); }, [studentMarksDb]);
  useEffect(() => { localStorage.setItem("campusos_submitted_subs_v2", JSON.stringify(submittedSubjects)); }, [submittedSubjects]);
  useEffect(() => { localStorage.setItem("campusos_coord_approvals_v2", JSON.stringify(coordinatorApprovals)); }, [coordinatorApprovals]);
  useEffect(() => { localStorage.setItem("campusos_published_batches_v2", JSON.stringify(publishedBatches)); }, [publishedBatches]);
  useEffect(() => { localStorage.setItem("campusos_batch_sub_assign_v2", JSON.stringify(batchSubjectAssignments)); }, [batchSubjectAssignments]);
  useEffect(() => { localStorage.setItem("campusos_batch_selected_subs_v2", JSON.stringify(batchSelectedSubjects)); }, [batchSelectedSubjects]);
  useEffect(() => { localStorage.setItem("campusos_profile_req", JSON.stringify(profileRequests)); }, [profileRequests]);
  useEffect(() => { localStorage.setItem("campusos_password_reqs", JSON.stringify(passwordRequests)); }, [passwordRequests]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "campusos_faculties" && e.newValue) setFaculties(JSON.parse(e.newValue));
      if (e.key === "campusos_batches" && e.newValue) setBatches(JSON.parse(e.newValue));
      if (e.key === "campusos_subjects" && e.newValue) setSubjects(JSON.parse(e.newValue));
      if (e.key === "campusos_students" && e.newValue) setStudents(JSON.parse(e.newValue));
      if (e.key === "campusos_attendance" && e.newValue) setAttendanceRecords(JSON.parse(e.newValue));
      if (e.key === "campusos_marks_v5" && e.newValue) setStudentMarksDb(JSON.parse(e.newValue));
      if (e.key === "campusos_batch_sub_assign_v2" && e.newValue) setBatchSubjectAssignments(JSON.parse(e.newValue));
      if (e.key === "campusos_batch_selected_subs_v2" && e.newValue) setBatchSelectedSubjects(JSON.parse(e.newValue));
      if (e.key === "campusos_coord_approvals_v2" && e.newValue) setCoordinatorApprovals(JSON.parse(e.newValue));
      if (e.key === "campusos_submitted_subs_v2" && e.newValue) setSubmittedSubjects(JSON.parse(e.newValue));
      if (e.key === "campusos_published_batches_v2" && e.newValue) setPublishedBatches(JSON.parse(e.newValue));
      if (e.key === "campusos_password_reqs" && e.newValue) setPasswordRequests(JSON.parse(e.newValue));
      if (e.key === "campusos_profile_req" && e.newValue) setProfileRequests(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addDept = (dept: string) => setDepartments([...departments, dept]); const editDept = (oldDept: string, newDept: string) => setDepartments(departments.map(d => d === oldDept ? newDept : d)); const deleteDept = (dept: string) => setDepartments(departments.filter(d => d !== dept));
  const addFaculty = (f: Faculty) => setFaculties([...faculties, { ...f, passwordHash: simulateHash("Campus@2026"), hasChangedPassword: false }]); const deleteFaculty = (id: string) => setFaculties(faculties.filter(f => f.id !== id));
  const addBatch = (b: Batch) => setBatches([...batches, b]); const editBatch = (index: number, updated: Batch) => { const copy = [...batches]; copy[index] = updated; setBatches(copy); }; const deleteBatch = (index: number) => setBatches(batches.filter((_, i) => i !== index));
  
  const promoteBatch = (oldBatchName: string, newCoordinatorEmail: string) => {
    let newBatchName = oldBatchName;
    setBatches(prev => prev.map(b => {
      if (b.name === oldBatchName) {
        const newSem = b.currentSemester + 1;
        if (newSem % 2 !== 0) {
          const lastDashIdx = b.name.lastIndexOf('-');
          if (lastDashIdx !== -1) {
            const prefix = b.name.substring(0, lastDashIdx);
            const numStr = b.name.substring(lastDashIdx + 1);
            if (numStr.length >= 2 && !isNaN(Number(numStr))) {
              const yearDigit = parseInt(numStr.charAt(0));
              const sectionDigit = numStr.substring(1);
              newBatchName = `${prefix}-${yearDigit + 1}${sectionDigit}`;
            }
          }
        }
        return { ...b, name: newBatchName, currentSemester: newSem, coordinator: newCoordinatorEmail };
      }
      return b;
    }));

    if (newBatchName !== oldBatchName) {
      setTimeout(() => {
        setStudents(prev => prev.map(s => s.batch === oldBatchName ? { ...s, batch: newBatchName } : s));
        setStudentMarksDb(prev => prev.map(m => m.batch === oldBatchName ? { ...m, batch: newBatchName } : m));
        setProfileRequests(prev => prev.map(r => r.batch === oldBatchName ? { ...r, batch: newBatchName } : r));
        setPasswordRequests(prev => prev.map(r => r.batch === oldBatchName ? { ...r, batch: newBatchName } : r));
        setAttendanceRecords(prev => prev.map(a => a.batch === oldBatchName ? { ...a, batch: newBatchName } : a));
      }, 50);
    }
  };

  const addSubject = (sub: Subject) => setSubjects([...subjects, sub]); const editSubject = (code: string, updated: Subject) => setSubjects(subjects.map(s => s.code === code ? updated : s)); const deleteSubject = (code: string) => setSubjects(subjects.filter(s => s.code !== code));
  const addStudent = (st: Student) => setStudents([...students, { ...st, passwordHash: simulateHash("Student@2026"), hasChangedPassword: false }]); const editStudent = (rollNo: string, updated: Partial<Student>) => { setStudents(students.map(s => s.rollNo === rollNo ? { ...s, ...updated } : s)); }; const deleteStudent = (rollNo: string) => setStudents(students.filter(s => s.rollNo !== rollNo));
  
  const saveAttendance = (record: AttendanceRecord) => { setAttendanceRecords(prev => [...prev, record]); };
  
  const saveSubjectInternalAndEse = (rollNo: string, batch: string, semester: number, subjectCode: string, internalTest: number, assignment: number, ese: number) => { 
    setStudentMarksDb(prev => { 
      const studentIndex = prev.findIndex(m => m.rollNo === rollNo);
      if (studentIndex >= 0) {
        const student = prev[studentIndex];
        const semIndex = student.history.findIndex(h => h.semester === semester);
        let newHistory = [...student.history];
        if (semIndex >= 0) { newHistory[semIndex] = { ...newHistory[semIndex], marks: { ...newHistory[semIndex].marks, [subjectCode]: { subjectCode, internalTest, assignment, ese } } }; } 
        else { newHistory.push({ semester, marks: { [subjectCode]: { subjectCode, internalTest, assignment, ese } }, sgpa: 0, totalCreditsEarned: 0, backlogs: [] }); }
        const newDb = [...prev]; newDb[studentIndex] = { ...student, history: newHistory }; return newDb;
      } else {
        return [...prev, { rollNo, batch, history: [{ semester, marks: { [subjectCode]: { subjectCode, internalTest, assignment, ese } }, sgpa: 0, totalCreditsEarned: 0, backlogs: [] }], cgpa: 0 }];
      }
    }); 
  };

  const submitSubjectToCoordinator = (batch: string, semester: number, subjectCode: string) => { setSubmittedSubjects(prev => ({ ...prev, [`${batch}_${semester}_${subjectCode}`]: true })); };
  const forwardBatchToAdmin = (batch: string, semester: number) => { setCoordinatorApprovals(prev => ({ ...prev, [`${batch}_${semester}`]: true })); };
  const adminUnpublishBatchResult = (batchName: string, semester: number) => { setPublishedBatches(prev => { const copy = { ...prev }; copy[`${batchName}_${semester}`] = false; return copy; }); };
  
  const getStudentSubjectAttendancePct = (rollNo: string, batch: string, semester: number, subjectCode: string) => {
    const subRecords = attendanceRecords.filter(r => r.batch === batch && (r.semester || 1) === semester && r.subject.includes(subjectCode));
    const totalHeld = subRecords.length;
    if (totalHeld === 0) return 100;
    const attended = subRecords.filter(r => { const stRec = r.records.find(sr => sr.rollNo === rollNo); return stRec && stRec.status === "Present"; }).length;
    return Math.round((attended / totalHeld) * 100);
  };

  const adminPublishBatchResult = (batchName: string, semester: number) => { 
    setPublishedBatches(prev => ({ ...prev, [`${batchName}_${semester}`]: true }));
    const batchSts = students.filter(s => s.batch === batchName);
    
    setStudentMarksDb(prev => {
      const copy = [...prev];
      batchSts.forEach(st => {
        let stRecIndex = copy.findIndex(m => m.rollNo === st.rollNo);
        let stRec = stRecIndex >= 0 ? { ...copy[stRecIndex] } : { rollNo: st.rollNo, batch: st.batch, history: [], cgpa: 0 };
        const activeSubjects = batchSelectedSubjects[`${batchName}_${semester}`] || [];
        let semTotalQualityPoints = 0; let semTotalCredits = 0; let semEarnedCredits = 0; let backlogs: string[] = [];
        let semIndex = stRec.history.findIndex(h => h.semester === semester);
        let currentSemResult = semIndex >= 0 ? { ...stRec.history[semIndex] } : { semester, marks: {}, sgpa: 0, totalCreditsEarned: 0, backlogs: [] };

        subjects.forEach(sub => {
          if(!activeSubjects.includes(sub.code)) return;
          const subMark = currentSemResult.marks[sub.code] || { subjectCode: sub.code, internalTest: 0, assignment: 0, ese: 0 };
          const attPct = getStudentSubjectAttendancePct(st.rollNo, batchName, semester, sub.code);
          let attMark = 0;
          if (attPct >= 90) attMark = 10; else if (attPct >= 85) attMark = 9; else if (attPct >= 80) attMark = 8; else if (attPct >= 75) attMark = 7; else if (attPct >= 70) attMark = 6; else if (attPct >= 65) attMark = 5; else attMark = Math.max(Math.round((attPct / 65) * 5), 0);
          const totalScore = subMark.internalTest + subMark.assignment + attMark + subMark.ese;
          let gradePoint = 0;
          if (totalScore >= 90) gradePoint = 10; else if (totalScore >= 80) gradePoint = 9; else if (totalScore >= 70) gradePoint = 8; else if (totalScore >= 60) gradePoint = 7; else if (totalScore >= 50) gradePoint = 6; else if (totalScore >= 40) gradePoint = 5; else { gradePoint = 0; backlogs.push(sub.code); }
          const currentCredit = sub.credits || 4; semTotalQualityPoints += gradePoint * currentCredit; semTotalCredits += currentCredit;
          if (gradePoint > 0) semEarnedCredits += currentCredit;
        });

        currentSemResult.sgpa = semTotalCredits === 0 ? 0 : Number((semTotalQualityPoints / semTotalCredits).toFixed(2));
        currentSemResult.totalCreditsEarned = semEarnedCredits;
        currentSemResult.backlogs = backlogs;

        if (semIndex >= 0) stRec.history[semIndex] = currentSemResult; else stRec.history.push(currentSemResult);
        
        let grandQualityPoints = 0; let grandCredits = 0;
        stRec.history.forEach(h => {
          if (publishedBatches[`${batchName}_${h.semester}`] || h.semester === semester) {
            grandQualityPoints += (h.sgpa * h.totalCreditsEarned);
            grandCredits += h.totalCreditsEarned;
          }
        });
        stRec.cgpa = grandCredits === 0 ? 0 : Number((grandQualityPoints / grandCredits).toFixed(2));

        if (stRecIndex >= 0) copy[stRecIndex] = stRec; else copy.push(stRec);
      });
      return copy;
    });
  };

  const updateBatchSubjectAssignments = (batchName: string, semester: number, assignments: { [subjectCode: string]: string }) => { setBatchSubjectAssignments(prev => ({ ...prev, [`${batchName}_${semester}`]: assignments })); };
  const updateBatchSelectedSubjects = (batchName: string, semester: number, selectedCodes: string[]) => { setBatchSelectedSubjects(prev => ({...prev, [`${batchName}_${semester}`]: selectedCodes})); };
  const requestProfileUpdate = (rollNo: string, batch: string, phone: string, address: string) => { const newReq: ProfileUpdateRequest = { id: Date.now().toString(), rollNo, batch, requestedPhone: phone, requestedAddress: address, status: "Pending" }; setProfileRequests(prev => [...prev.filter(r => r.rollNo !== rollNo), newReq]); };
  const approveProfileUpdate = (id: string) => { const req = profileRequests.find(r => r.id === id); if (req) { editStudent(req.rollNo, { phone: req.requestedPhone, address: req.requestedAddress }); setProfileRequests(prev => prev.filter(r => r.id !== id)); } };
  const rejectProfileUpdate = (id: string) => { setProfileRequests(prev => prev.filter(r => r.id !== id)); };
  const requestPasswordReset = (userType: "faculty" | "student", identifier: string, newPasswordHash: string, batch?: string) => { const newReq: PasswordResetRequest = { id: Date.now().toString(), userType, identifier, batch, newPasswordHash, status: "Pending" }; setPasswordRequests(prev => [...prev.filter(r => r.identifier !== identifier), newReq]); };
  const approvePasswordReset = (id: string) => { const req = passwordRequests.find(r => r.id === id); if (req) { if (req.userType === "faculty") { setFaculties(faculties.map(f => f.email === req.identifier ? { ...f, passwordHash: req.newPasswordHash, hasChangedPassword: true } : f)); } else { setStudents(students.map(s => s.rollNo === req.identifier ? { ...s, passwordHash: req.newPasswordHash, hasChangedPassword: true } : s)); } setPasswordRequests(prev => prev.filter(r => r.id !== id)); } };
  const rejectPasswordReset = (id: string) => setPasswordRequests(prev => prev.filter(r => r.id !== id));
  const changePasswordDirectly = (userType: "faculty" | "student", identifier: string, newPasswordHash: string) => { if (userType === "faculty") { setFaculties(prev => prev.map(f => f.email === identifier ? { ...f, passwordHash: newPasswordHash, hasChangedPassword: true } : f)); } else { setStudents(prev => prev.map(s => s.rollNo === identifier ? { ...s, passwordHash: newPasswordHash, hasChangedPassword: true } : s)); } };

  return (
    <AcademicContext.Provider value={{
      simulateHash, showToast, showConfirm, // EXPOSED GLOBALLY!
      departments, addDept, editDept, deleteDept, faculties, addFaculty, deleteFaculty, batches, addBatch, editBatch, deleteBatch,
      promoteBatch, subjects, addSubject, editSubject, deleteSubject, students, addStudent, editStudent, deleteStudent, attendanceRecords, saveAttendance,
      studentMarksDb, saveSubjectInternalAndEse, submittedSubjects, submitSubjectToCoordinator, coordinatorApprovals, forwardBatchToAdmin,
      publishedBatches, adminPublishBatchResult, adminUnpublishBatchResult, profileRequests, requestProfileUpdate, approveProfileUpdate, rejectProfileUpdate,
      batchSubjectAssignments, updateBatchSubjectAssignments, batchSelectedSubjects, updateBatchSelectedSubjects,
      passwordRequests, requestPasswordReset, approvePasswordReset, rejectPasswordReset, changePasswordDirectly,
      condonationLimit, setCondonationLimit, gradingMode, setGradingMode
    }}>
      <NotificationContainer 
        toasts={toasts} 
        removeToast={removeToast} 
        confirmDialog={confirmDialog} 
        closeConfirm={closeConfirm} 
      />
      {children}
    </AcademicContext.Provider>
  );
};
export const useAcademic = () => { const context = useContext(AcademicContext); if (!context) throw new Error("useAcademic must be used within an AcademicProvider"); return context; };
