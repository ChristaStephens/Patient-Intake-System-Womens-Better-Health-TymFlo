import { useState, useEffect, useRef, useCallback } from "react";
import {
  Info,
  X,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Stethoscope,
  ClipboardList,
  Phone,
  Shield,
  PenLine,
  AlertCircle,
  FileDown,
  Lock,
  Mail,
  Plus,
  Trash2,
} from "lucide-react";
import Footer, { PrintFooter } from "@/components/footer";
import { PRACTICE_NAME, PRACTICE_EMAIL, IS_DEMO, PRACTICE_ADDRESS, PRACTICE_PHYSICIANS } from "@/lib/config";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STORAGE_KEY = "intake_form_data";
const STEP_KEY = "intake_form_step";

/* ── Brand color tokens (mirrors CSS variables) ─────────────── */
const B = {
  deepBerry: "#3d0e22",
  darkRose: "#6b1e3d",
  brandPink: "#9b3060",
  lightPink: "#c96090",
  blush: "#f0c0d4",
  blushLight: "#faf0f4",
} as const;

/* ── Medical Condition List ─────────────────────────────────── */
const CONDITIONS: { label: string; key: string }[] = [
  { label: "Allergies", key: "allergies" },
  { label: "Anemia", key: "anemia" },
  { label: "Anxiety Disorder", key: "anxietyDisorder" },
  { label: "Arthritis", key: "arthritis" },
  { label: "Asthma", key: "asthma" },
  { label: "AIDS / HIV", key: "aidsHiv" },
  { label: "Bleeding Disorder", key: "bleedingDisorder" },
  { label: "Blood Transfusion", key: "bloodTransfusion" },
  { label: "Cancer", key: "cancer" },
  { label: "Crohn's Disease", key: "crohnsDisease" },
  { label: "Diabetes", key: "diabetes" },
  { label: "Depression", key: "depression" },
  { label: "DVT", key: "dvt" },
  { label: "GERD", key: "gerd" },
  { label: "Glaucoma", key: "glaucoma" },
  { label: "Heart Disease", key: "heartDisease" },
  { label: "Heart Problems", key: "heartProblems" },
  { label: "Hepatitis A, B, or C", key: "hepatitis" },
  { label: "High Blood Pressure", key: "highBloodPressure" },
  { label: "High Cholesterol", key: "highCholesterol" },
  { label: "IBS", key: "ibs" },
  { label: "Kidney Disorder", key: "kidneyDisorder" },
  { label: "Liver Disorder", key: "liverDisorder" },
  { label: "Lung Disease", key: "lungDisease" },
  { label: "Migraines", key: "migraines" },
  { label: "Osteoporosis", key: "osteoporosis" },
  { label: "Phlebitis", key: "phlebitis" },
  { label: "Skin Disorder", key: "skinDisorder" },
  { label: "Stomach Ulcer", key: "stomachUlcer" },
  { label: "Stroke", key: "stroke" },
  { label: "Thyroid Disease", key: "thyroidDisease" },
  { label: "Tuberculosis", key: "tuberculosis" },
  { label: "Venereal Disease", key: "venerealDisorder" },
  { label: "Seizure", key: "seizure" },
  { label: "Sickle Cell", key: "sickleCell" },
];

/* ── OB/GYN Condition List ──────────────────────────────────── */
const OBGYN_CONDITIONS: { label: string; key: string }[] = [
  { label: "Abnormal Vaginal Bleeding", key: "abnormalVaginalBleeding" },
  { label: "Abnormal Pap Smear", key: "abnormalPapSmear" },
  { label: "Bleeding Between Periods", key: "bleedingBetweenPeriods" },
  { label: "Breast Lump", key: "breastLump" },
  { label: "Breast Cancer", key: "breastCancer" },
  { label: "Breast Surgery", key: "breastSurgery" },
  { label: "Cervical Cancer", key: "cervicalCancer" },
  { label: "Chlamydia", key: "chlamydia" },
  { label: "Colonoscopy", key: "colonoscopy" },
  { label: "Chiral Surgery", key: "chiralSurgery" },
  { label: "Endometriosis", key: "endometriosis" },
  { label: "Extreme Menstrual Pain", key: "extremeMenstrualPain" },
  { label: "Fibroids", key: "fibroids" },
  { label: "Genital Warts", key: "genitalWarts" },
  { label: "Gonorrhea", key: "gonorrhea" },
  { label: "Herpes", key: "herpes" },
  { label: "Hot Flashes", key: "hotFlashes" },
  { label: "HPV", key: "hpv" },
  { label: "Infertility", key: "infertility" },
  { label: "Irregular Periods", key: "irregularPeriods" },
  { label: "Nipple Discharge", key: "nippleDischarge" },
  { label: "Ovarian Cysts", key: "ovarianCysts" },
  { label: "Ovarian Cancer", key: "ovarianCancer" },
  { label: "Painful Intercourse", key: "painfulIntercourse" },
  { label: "Pelvic Inflammatory Disease", key: "pelvicInflammatoryDisease" },
  { label: "Pelvic Floor Issues", key: "pelvicFloorIssues" },
  { label: "Uterine Cancer", key: "uterineCancer" },
  { label: "Urinary Incontinence", key: "urinaryIncontinence" },
  { label: "Yeast Infection", key: "yeastInfection" },
  { label: "Hormone Replacement Therapy", key: "hormoneReplacementTherapy" },
];

function capFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function pastKey(key: string): string { return `past${capFirst(key)}`; }
function famKey(key: string): string { return `family${capFirst(key)}`; }
function obgynKey(key: string): string { return `obgyn${capFirst(key)}`; }

/* ── Cancer History Entry ───────────────────────────────────── */
interface CancerEntry {
  id: string;
  relation: string;
  cancerType: string;
  ageAtDiagnosis: string;
}

/* ── FormData ───────────────────────────────────────────────── */
interface FormData {
  // Personal
  firstName: string; lastName: string; preferredName: string;
  dateOfBirth: string; email: string; phone: string;
  sex: string; genderIdentity: string; pronouns: string;
  race: string; ethnicity: string; preferredLanguage: string;
  // Address
  address: string; city: string; state: string; zip: string;
  // Provider & Visit
  primaryCarePhysician: string;
  pharmacyName: string; pharmacyAddress: string; pharmacyPhone: string;
  reasonForVisit: string; currentMedications: string; allergies: string;
  // Past Medical History — checkboxes
  pastAllergies: boolean; pastAnemia: boolean; pastAnxietyDisorder: boolean;
  pastArthritis: boolean; pastAsthma: boolean; pastAidsHiv: boolean;
  pastBleedingDisorder: boolean; pastBloodTransfusion: boolean;
  pastCancer: boolean; pastCrohnsDisease: boolean; pastDiabetes: boolean;
  pastDepression: boolean; pastDvt: boolean; pastGerd: boolean;
  pastGlaucoma: boolean; pastHeartDisease: boolean; pastHeartProblems: boolean;
  pastHepatitis: boolean; pastHighBloodPressure: boolean; pastHighCholesterol: boolean;
  pastIbs: boolean; pastKidneyDisorder: boolean; pastLiverDisorder: boolean;
  pastLungDisease: boolean; pastMigraines: boolean; pastOsteoporosis: boolean;
  pastPhlebitis: boolean; pastSkinDisorder: boolean; pastStomachUlcer: boolean;
  pastStroke: boolean; pastThyroidDisease: boolean; pastTuberculosis: boolean;
  pastVenerealDisorder: boolean; pastSeizure: boolean; pastSickleCell: boolean;
  pastMedicalOther: string;
  // Clinical free-text
  pastSurgeries: string; pastHospitalizations: string; chronicConditions: string;
  // Family Medical History — checkboxes (same conditions)
  familyAllergies: boolean; familyAnemia: boolean; familyAnxietyDisorder: boolean;
  familyArthritis: boolean; familyAsthma: boolean; familyAidsHiv: boolean;
  familyBleedingDisorder: boolean; familyBloodTransfusion: boolean;
  familyCancer: boolean; familyCrohnsDisease: boolean; familyDiabetes: boolean;
  familyDepression: boolean; familyDvt: boolean; familyGerd: boolean;
  familyGlaucoma: boolean; familyHeartDisease: boolean; familyHeartProblems: boolean;
  familyHepatitis: boolean; familyHighBloodPressure: boolean; familyHighCholesterol: boolean;
  familyIbs: boolean; familyKidneyDisorder: boolean; familyLiverDisorder: boolean;
  familyLungDisease: boolean; familyMigraines: boolean; familyOsteoporosis: boolean;
  familyPhlebitis: boolean; familySkinDisorder: boolean; familyStomachUlcer: boolean;
  familyStroke: boolean; familyThyroidDisease: boolean; familyTuberculosis: boolean;
  familyVenerealDisorder: boolean; familySeizure: boolean; familySickleCell: boolean;
  familyHistoryOther: string;
  // OB/GYN History — checkboxes
  obgynAbnormalVaginalBleeding: boolean; obgynAbnormalPapSmear: boolean;
  obgynBleedingBetweenPeriods: boolean; obgynBreastLump: boolean;
  obgynBreastCancer: boolean; obgynBreastSurgery: boolean;
  obgynCervicalCancer: boolean; obgynChlamydia: boolean;
  obgynColonoscopy: boolean; obgynChiralSurgery: boolean;
  obgynEndometriosis: boolean; obgynExtremeMenstrualPain: boolean;
  obgynFibroids: boolean; obgynGenitalWarts: boolean;
  obgynGonorrhea: boolean; obgynHerpes: boolean;
  obgynHotFlashes: boolean; obgynHpv: boolean;
  obgynInfertility: boolean; obgynIrregularPeriods: boolean;
  obgynNippleDischarge: boolean; obgynOvarianCysts: boolean;
  obgynOvarianCancer: boolean; obgynPainfulIntercourse: boolean;
  obgynPelvicInflammatoryDisease: boolean; obgynPelvicFloorIssues: boolean;
  obgynUterineCancer: boolean; obgynUrinaryIncontinence: boolean;
  obgynYeastInfection: boolean; obgynHormoneReplacementTherapy: boolean;
  // Menstrual & Reproductive History
  lastPeriodDate: string;
  periodFrequency: string;
  periodDuration: string;
  periodsHeavy: string;
  periodsAffectActivities: string;
  numberOfPregnancies: string;
  deliveryType: string;
  // Social / Behavioral History
  tobaccoUse: string; alcoholUse: string; substanceUse: string;
  sexuallyActive: string;
  stdCheck: string;
  domesticAbuse: string;
  caffeinePerDay: string;
  exerciseFrequency: string;
  // Family / Patient Cancer History
  cancerHistory: CancerEntry[];
  // Emergency
  emergencyContactName: string; emergencyContactPhone: string; emergencyContactRelationship: string;
  // Insurance
  relationshipToInsured: string; primaryInsuredName: string; primaryInsuredDOB: string;
  insuranceProvider: string; policyNumber: string; groupNumber: string;
  hasSecondaryInsurance: boolean;
  secondaryInsuranceProvider: string; secondaryPolicyNumber: string; secondaryGroupNumber: string;
  // Legal
  agreeToPrivacyNotice: boolean; agreeToAssignmentOfBenefits: boolean;
  agreeToFinancialResponsibility: boolean; agreeToInsuranceWaiver: boolean;
  agreeToTerms: boolean;
  signatureText: string; signatureDate: string;
  signatureData: string; signatureTimestamp: string;
}

const BOOL_FALSE_CONDITIONS: Record<string, boolean> = {};
CONDITIONS.forEach(({ key }) => {
  BOOL_FALSE_CONDITIONS[pastKey(key)] = false;
  BOOL_FALSE_CONDITIONS[famKey(key)] = false;
});
OBGYN_CONDITIONS.forEach(({ key }) => {
  BOOL_FALSE_CONDITIONS[obgynKey(key)] = false;
});

const INITIAL_FORM: FormData = {
  firstName: "", lastName: "", preferredName: "",
  dateOfBirth: "", email: "", phone: "",
  sex: "", genderIdentity: "", pronouns: "",
  race: "", ethnicity: "", preferredLanguage: "",
  address: "", city: "", state: "", zip: "",
  primaryCarePhysician: "",
  pharmacyName: "", pharmacyAddress: "", pharmacyPhone: "",
  reasonForVisit: "", currentMedications: "", allergies: "",
  // past medical checkboxes
  pastAllergies: false, pastAnemia: false, pastAnxietyDisorder: false,
  pastArthritis: false, pastAsthma: false, pastAidsHiv: false,
  pastBleedingDisorder: false, pastBloodTransfusion: false,
  pastCancer: false, pastCrohnsDisease: false, pastDiabetes: false,
  pastDepression: false, pastDvt: false, pastGerd: false,
  pastGlaucoma: false, pastHeartDisease: false, pastHeartProblems: false,
  pastHepatitis: false, pastHighBloodPressure: false, pastHighCholesterol: false,
  pastIbs: false, pastKidneyDisorder: false, pastLiverDisorder: false,
  pastLungDisease: false, pastMigraines: false, pastOsteoporosis: false,
  pastPhlebitis: false, pastSkinDisorder: false, pastStomachUlcer: false,
  pastStroke: false, pastThyroidDisease: false, pastTuberculosis: false,
  pastVenerealDisorder: false, pastSeizure: false, pastSickleCell: false,
  pastMedicalOther: "",
  pastSurgeries: "", pastHospitalizations: "", chronicConditions: "",
  // family medical checkboxes
  familyAllergies: false, familyAnemia: false, familyAnxietyDisorder: false,
  familyArthritis: false, familyAsthma: false, familyAidsHiv: false,
  familyBleedingDisorder: false, familyBloodTransfusion: false,
  familyCancer: false, familyCrohnsDisease: false, familyDiabetes: false,
  familyDepression: false, familyDvt: false, familyGerd: false,
  familyGlaucoma: false, familyHeartDisease: false, familyHeartProblems: false,
  familyHepatitis: false, familyHighBloodPressure: false, familyHighCholesterol: false,
  familyIbs: false, familyKidneyDisorder: false, familyLiverDisorder: false,
  familyLungDisease: false, familyMigraines: false, familyOsteoporosis: false,
  familyPhlebitis: false, familySkinDisorder: false, familyStomachUlcer: false,
  familyStroke: false, familyThyroidDisease: false, familyTuberculosis: false,
  familyVenerealDisorder: false, familySeizure: false, familySickleCell: false,
  familyHistoryOther: "",
  // OB/GYN checkboxes
  obgynAbnormalVaginalBleeding: false, obgynAbnormalPapSmear: false,
  obgynBleedingBetweenPeriods: false, obgynBreastLump: false,
  obgynBreastCancer: false, obgynBreastSurgery: false,
  obgynCervicalCancer: false, obgynChlamydia: false,
  obgynColonoscopy: false, obgynChiralSurgery: false,
  obgynEndometriosis: false, obgynExtremeMenstrualPain: false,
  obgynFibroids: false, obgynGenitalWarts: false,
  obgynGonorrhea: false, obgynHerpes: false,
  obgynHotFlashes: false, obgynHpv: false,
  obgynInfertility: false, obgynIrregularPeriods: false,
  obgynNippleDischarge: false, obgynOvarianCysts: false,
  obgynOvarianCancer: false, obgynPainfulIntercourse: false,
  obgynPelvicInflammatoryDisease: false, obgynPelvicFloorIssues: false,
  obgynUterineCancer: false, obgynUrinaryIncontinence: false,
  obgynYeastInfection: false, obgynHormoneReplacementTherapy: false,
  // Menstrual & Reproductive
  lastPeriodDate: "", periodFrequency: "", periodDuration: "",
  periodsHeavy: "", periodsAffectActivities: "",
  numberOfPregnancies: "", deliveryType: "",
  // Social
  tobaccoUse: "", alcoholUse: "", substanceUse: "",
  sexuallyActive: "", stdCheck: "", domesticAbuse: "",
  caffeinePerDay: "", exerciseFrequency: "",
  // Cancer history
  cancerHistory: [],
  // Emergency
  emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelationship: "",
  // Insurance
  relationshipToInsured: "self", primaryInsuredName: "", primaryInsuredDOB: "",
  insuranceProvider: "", policyNumber: "", groupNumber: "",
  hasSecondaryInsurance: false,
  secondaryInsuranceProvider: "", secondaryPolicyNumber: "", secondaryGroupNumber: "",
  // Legal
  agreeToPrivacyNotice: false, agreeToAssignmentOfBenefits: false,
  agreeToFinancialResponsibility: false, agreeToInsuranceWaiver: false,
  agreeToTerms: false,
  signatureText: "", signatureDate: "",
  signatureData: "", signatureTimestamp: "",
};

/* ── Steps ──────────────────────────────────────────────────── */
const STEPS = [
  { id: "personal", title: "Personal Information", Icon: User },
  { id: "address", title: "Address", Icon: MapPin },
  { id: "provider", title: "Provider & Visit", Icon: Stethoscope },
  { id: "history", title: "Clinical History", Icon: ClipboardList },
  { id: "emergency", title: "Emergency Contact", Icon: Phone },
  { id: "insurance", title: "Insurance", Icon: Shield },
  { id: "legal", title: "Legal & Signature", Icon: PenLine },
] as const;

type FieldErrors = Record<string, string>;

/* ── Storage helpers ────────────────────────────────────────── */
function serializeForm(data: FormData): string { return JSON.stringify(data); }

function deserializeForm(raw: string): FormData | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return { ...INITIAL_FORM, ...parsed } as FormData;
    }
    return null;
  } catch { return null; }
}

function loadFromStorage(storage: Storage): FormData | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? deserializeForm(raw) : null;
  } catch { return null; }
}

function saveToStorage(storage: Storage, data: FormData): void {
  storage.setItem(STORAGE_KEY, serializeForm(data));
}

function clearFromStorage(storage: Storage): void {
  storage.removeItem(STORAGE_KEY);
  storage.removeItem(STEP_KEY);
}

function formatDate(val: string) {
  if (!val) return "";
  const [y, m, d] = val.split("-");
  if (!y || !m || !d) return val;
  return `${m}/${d}/${y}`;
}

/* ── Validation ─────────────────────────────────────────────── */
function validateStep(stepIndex: number, form: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (stepIndex === 0) {
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
    if (!form.email.trim()) errors.email = "Email address is required.";
    if (!form.phone.trim()) errors.phone = "Phone number is required.";
  }
  if (stepIndex === 1) {
    if (!form.address.trim()) errors.address = "Street address is required.";
  }
  if (stepIndex === 2) {
    if (!form.reasonForVisit.trim()) errors.reasonForVisit = "Please describe your reason for visiting.";
  }
  if (stepIndex === 6) {
    if (!form.agreeToPrivacyNotice) errors.agreeToPrivacyNotice = "You must acknowledge the Notice of Privacy Practices.";
    if (!form.agreeToAssignmentOfBenefits) errors.agreeToAssignmentOfBenefits = "You must agree to the Assignment of Benefits.";
    if (!form.agreeToFinancialResponsibility) errors.agreeToFinancialResponsibility = "You must acknowledge financial responsibility.";
    if (!form.agreeToInsuranceWaiver) errors.agreeToInsuranceWaiver = "You must acknowledge the Insurance & Claims Notice of Responsibility.";
    if (!form.signatureText.trim() && !form.signatureData) errors.signatureText = "Please sign by drawing or typing your full legal name.";
  }
  return errors;
}

/* ── CSV Export ─────────────────────────────────────────────── */
function generateCSV(form: FormData): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const pastSelected = CONDITIONS.filter(c => form[pastKey(c.key) as keyof FormData] as boolean).map(c => c.label).join(", ");
  const famSelected = CONDITIONS.filter(c => form[famKey(c.key) as keyof FormData] as boolean).map(c => c.label).join(", ");
  const obgynSelected = OBGYN_CONDITIONS.filter(c => form[obgynKey(c.key) as keyof FormData] as boolean).map(c => c.label).join(", ");
  const cancerHistoryStr = (form.cancerHistory || [])
    .map(e => `${e.relation}: ${e.cancerType} (age ${e.ageAtDiagnosis})`)
    .join("; ");

  const rows: [string, string][] = [
    ["Last Name", form.lastName],
    ["First Name", form.firstName],
    ["Preferred Name", form.preferredName],
    ["Date of Birth", formatDate(form.dateOfBirth)],
    ["Email", form.email],
    ["Phone", form.phone],
    ["Sex Assigned at Birth", form.sex],
    ["Gender Identity", form.genderIdentity],
    ["Pronouns", form.pronouns],
    ["Race", form.race],
    ["Ethnicity", form.ethnicity],
    ["Preferred Language", form.preferredLanguage],
    ["Address", form.address],
    ["City", form.city],
    ["State", form.state],
    ["ZIP Code", form.zip],
    ["Primary Care Physician", form.primaryCarePhysician],
    ["Pharmacy Name", form.pharmacyName],
    ["Pharmacy Address", form.pharmacyAddress],
    ["Pharmacy Phone", form.pharmacyPhone],
    ["Reason for Visit", form.reasonForVisit],
    ["Current Medications", form.currentMedications],
    ["Drug Allergies", form.allergies],
    ["Past Medical History (Conditions)", pastSelected],
    ["Past Medical History (Other)", form.pastMedicalOther],
    ["Past Surgeries", form.pastSurgeries],
    ["Past Hospitalizations", form.pastHospitalizations],
    ["Chronic Conditions", form.chronicConditions],
    ["Family Medical History (Conditions)", famSelected],
    ["Family Medical History (Other)", form.familyHistoryOther],
    ["OB/GYN History", obgynSelected],
    ["Last Period Date", formatDate(form.lastPeriodDate)],
    ["Period Frequency", form.periodFrequency],
    ["Period Duration", form.periodDuration],
    ["Heavy Periods", form.periodsHeavy],
    ["Periods Affect Daily Activities", form.periodsAffectActivities],
    ["Number of Pregnancies", form.numberOfPregnancies],
    ["Delivery Type", form.deliveryType],
    ["Sexually Active", form.sexuallyActive],
    ["STD Screening Requested", form.stdCheck],
    ["Domestic/Verbal Abuse in Home", form.domesticAbuse],
    ["Caffeine Per Day", form.caffeinePerDay],
    ["Exercise Frequency", form.exerciseFrequency],
    ["Family/Patient Cancer History", cancerHistoryStr],
    ["Tobacco Use", form.tobaccoUse],
    ["Alcohol Use", form.alcoholUse],
    ["Substance Use", form.substanceUse],
    ["Emergency Contact Name", form.emergencyContactName],
    ["Emergency Contact Phone", form.emergencyContactPhone],
    ["Emergency Contact Relationship", form.emergencyContactRelationship],
    ["Relationship to Primary Insured", form.relationshipToInsured],
    ["Primary Insured Name", form.primaryInsuredName],
    ["Primary Insured DOB", formatDate(form.primaryInsuredDOB)],
    ["Insurance Provider", form.insuranceProvider],
    ["Policy Number", form.policyNumber],
    ["Group Number", form.groupNumber],
    ["Secondary Insurance", form.hasSecondaryInsurance ? "Yes" : "No"],
    ["Secondary Insurance Provider", form.secondaryInsuranceProvider],
    ["Secondary Policy Number", form.secondaryPolicyNumber],
    ["Secondary Group Number", form.secondaryGroupNumber],
    ["Privacy Notice Acknowledged", form.agreeToPrivacyNotice ? "Yes" : "No"],
    ["Assignment of Benefits Agreed", form.agreeToAssignmentOfBenefits ? "Yes" : "No"],
    ["Financial Responsibility Acknowledged", form.agreeToFinancialResponsibility ? "Yes" : "No"],
    ["Insurance Waiver / Notice of Responsibility", form.agreeToInsuranceWaiver ? "Yes" : "No"],
    ["Patient Certification", form.agreeToTerms ? "Yes" : "No"],
    ["Electronic Signature", form.signatureText || (form.signatureData ? "[Drawn Signature — see PDF]" : "")],
    ["Signature Date/Time", form.signatureTimestamp || form.signatureDate],
  ];
  return rows.map(([k, v]) => `${escape(k)},${escape(v)}`).join("\n");
}

function downloadCSV(form: FormData): void {
  const csv = generateCSV(form);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `patient-intake-${form.lastName || "form"}-${form.firstName || ""}.csv`.replace(/\s+/g, "-").toLowerCase();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Main Component ─────────────────────────────────────────── */

export default function IntakeForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [showDownload, setShowDownload] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [sessionConfirmation, setSessionConfirmation] = useState<string | null>(null);
  const [deviceConfirmation, setDeviceConfirmation] = useState<string | null>(null);
  const [clearConfirmation, setClearConfirmation] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChecked, setModalChecked] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalFirstFocusRef = useRef<HTMLButtonElement>(null);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const deviceSaveButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sessionData = loadFromStorage(sessionStorage);
    const localData = loadFromStorage(localStorage);
    const data = sessionData ?? localData;
    if (data) setForm(data);
    try {
      const savedStep = sessionStorage.getItem(STEP_KEY) ?? localStorage.getItem(STEP_KEY);
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (!isNaN(stepNum) && stepNum >= 0 && stepNum <= STEPS.length) {
          const completed = new Set<number>();
          for (let i = 0; i < stepNum; i++) completed.add(i);
          setCompletedSteps(completed);
          const isAllDone = stepNum >= STEPS.length;
          setCurrentStep(isAllDone ? STEPS.length - 1 : stepNum);
          setExpandedStep(isAllDone ? STEPS.length - 1 : stepNum);
          setShowDownload(isAllDone);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name as keyof FormData;
      const value =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setForm((prev) => ({ ...prev, [name]: value }));
      setFieldErrors((prev) => {
        if (prev[name as string]) {
          const next = { ...prev };
          delete next[name as string];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const handleCancerHistoryChange = useCallback((entries: CancerEntry[]) => {
    setForm((prev) => ({ ...prev, cancerHistory: entries }));
  }, []);

  const saveStepProgress = (stepNum: number) => {
    try {
      const key = String(stepNum);
      if (sessionStorage.getItem(STORAGE_KEY)) sessionStorage.setItem(STEP_KEY, key);
      if (localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STEP_KEY, key);
    } catch { /* ignore */ }
  };

  const handleStepSave = (stepIndex: number) => {
    const errors = validateStep(stepIndex, form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorId = Object.keys(errors)[0];
      setTimeout(() => {
        document.getElementById(firstErrorId)?.scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById(firstErrorId)?.focus();
      }, 50);
      return;
    }
    setFieldErrors({});

    const updatedForm = stepIndex === 6 && !form.signatureTimestamp
      ? {
          ...form,
          signatureDate: new Date().toLocaleDateString(),
          signatureTimestamp: new Date().toLocaleString("en-US", {
            weekday: "long", year: "numeric", month: "long",
            day: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
          }),
        }
      : form;
    if (updatedForm !== form) setForm(updatedForm);

    const nextCompleted = new Set(completedSteps);
    nextCompleted.add(stepIndex);
    setCompletedSteps(nextCompleted);
    const isLast = stepIndex === STEPS.length - 1;
    if (isLast) {
      setShowDownload(true);
      setExpandedStep(stepIndex);
      saveStepProgress(STEPS.length);
    } else {
      const nextStep = stepIndex + 1;
      setCurrentStep(nextStep);
      setExpandedStep(nextStep);
      saveStepProgress(nextStep);
      setTimeout(() => {
        document.getElementById(`step-section-${nextStep}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleToggleStep = (stepIndex: number) => {
    setFieldErrors({});
    setExpandedStep((prev) => (prev === stepIndex ? -1 : stepIndex));
  };

  const progress = showDownload
    ? 100
    : currentStep === 0
    ? 0
    : Math.round((currentStep / STEPS.length) * 100);

  const handleSessionSave = () => {
    saveToStorage(sessionStorage, form);
    setSessionConfirmation("Your progress has been saved for this session.");
    setDeviceConfirmation(null); setClearConfirmation(null);
    setTimeout(() => setSessionConfirmation(null), 6000);
  };

  const handleDeviceSaveRequest = () => {
    setModalChecked(false);
    setModalOpen(true);
    setTimeout(() => modalFirstFocusRef.current?.focus(), 50);
  };

  const handleModalSave = () => {
    if (!modalChecked) return;
    saveToStorage(localStorage, form);
    try { localStorage.setItem(STEP_KEY, String(showDownload ? STEPS.length : currentStep)); } catch { /* ignore */ }
    setModalOpen(false);
    setDeviceConfirmation("Your progress has been saved on this device. To protect your privacy, use this feature only on a personal device.");
    setSessionConfirmation(null); setClearConfirmation(null);
    setTimeout(() => setDeviceConfirmation(null), 8000);
    deviceSaveButtonRef.current?.focus();
  };

  const handleModalClose = () => {
    setModalOpen(false);
    deviceSaveButtonRef.current?.focus();
  };

  const handleClear = () => {
    clearFromStorage(sessionStorage);
    clearFromStorage(localStorage);
    setForm(INITIAL_FORM);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setExpandedStep(0);
    setShowDownload(false);
    setFieldErrors({});
    setClearConfirmation("Your saved form information has been removed from this device and browser.");
    setSessionConfirmation(null); setDeviceConfirmation(null);
    setTimeout(() => setClearConfirmation(null), 6000);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { handleModalClose(); return; }
      if (e.key === "Tab") {
        if (!focusable.length) return;
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
        else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    if (!tooltipVisible) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipButtonRef.current && !tooltipButtonRef.current.contains(e.target as Node) &&
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltipVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltipVisible]);

  const tooltipId = "device-save-tooltip";
  const modalTitleId = "modal-title";
  const modalDescId = "modal-desc";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Demo Banner */}
        {IS_DEMO && (
          <div className="no-print mb-5 flex items-center gap-3 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3" role="alert" aria-label="Demo notice">
            <span className="shrink-0 rounded-md bg-amber-400 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-amber-900">Demo</span>
            <p className="text-sm font-medium text-amber-900 leading-snug">
              This is a <strong>demo version</strong> for evaluation only. It is not licensed for patient use.
              Contact <a href="mailto:hello@tymflo.com" className="underline hover:text-amber-700">hello@tymflo.com</a> to license TymFlo for your practice.
            </p>
          </div>
        )}

        {/* Header */}
        <header className="mb-5 no-print text-center">
          <h1 className="text-3xl font-bold mb-0.5 leading-tight" style={{ color: B.deepBerry }}>
            Patient Intake Form
          </h1>
          <p className="font-semibold text-base" style={{ color: B.darkRose }}>{PRACTICE_NAME}</p>
          <p className="text-slate-500 text-sm">
            {PRACTICE_ADDRESS.street} · {PRACTICE_ADDRESS.city}, {PRACTICE_ADDRESS.state} {PRACTICE_ADDRESS.zip}
          </p>
          <p className="text-slate-500 text-sm">
            Phone: {PRACTICE_ADDRESS.phone} · Fax: {PRACTICE_ADDRESS.fax}
          </p>
          <p className="text-slate-500 text-sm mt-0.5">
            {PRACTICE_PHYSICIANS.join(" · ")}
          </p>
          <p className="text-slate-500 text-base mt-2">Fill in each section below. Your progress is saved as you go.</p>
        </header>

        {/* Privacy Notice Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 no-print" role="note" aria-label="Privacy notice"
          style={{ backgroundColor: B.blushLight, border: `1px solid ${B.blush}` }}>
          <Lock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: B.darkRose }} aria-hidden="true" />
          <p className="text-sm leading-relaxed" style={{ color: B.deepBerry }}>
            <strong>Your information is not stored on this website.</strong> After completing the form, you will download or print your information and send it directly to the office.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 no-print" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Form progress: ${progress}%`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              {showDownload ? "All sections complete" : `Section ${Math.min(currentStep + 1, STEPS.length)} of ${STEPS.length}`}
            </span>
            <span className="text-sm font-semibold" style={{ color: B.darkRose }}>{progress}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, backgroundColor: B.brandPink }} />
          </div>
          <div className="flex items-center mt-3 gap-1" aria-hidden="true">
            {STEPS.map((step, i) => {
              const done = completedSteps.has(i);
              const isCurrent = i === currentStep && !showDownload;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`step-dot ${done ? "step-dot-done" : isCurrent ? "step-dot-current" : "step-dot-upcoming"}`} title={step.title}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <span>{i + 1}</span>}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-0.5 flex-1 mx-1 rounded" style={{ backgroundColor: done ? B.lightPink : "#cbd5e1" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3 no-print" role="list" aria-label="Form sections">
          {STEPS.map((step, stepIndex) => {
            const isCompleted = completedSteps.has(stepIndex);
            const isExpanded = expandedStep === stepIndex;
            const isLocked = stepIndex > currentStep && !isCompleted;
            const { Icon } = step;
            const hasErrors = isExpanded && Object.keys(fieldErrors).length > 0;

            return (
              <div
                key={step.id}
                id={`step-section-${stepIndex}`}
                role="listitem"
                className="rounded-2xl border-2 transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: isLocked
                    ? "#e2e8f0"
                    : isExpanded && !isCompleted
                    ? B.brandPink
                    : isCompleted && !isExpanded
                    ? B.blush
                    : isCompleted && isExpanded
                    ? B.lightPink
                    : "#e2e8f0",
                  backgroundColor: isLocked
                    ? "#f8fafc"
                    : isCompleted && !isExpanded
                    ? "#fdf8fa"
                    : "#ffffff",
                  opacity: isLocked ? 0.6 : 1,
                }}
              >
                <button
                  type="button"
                  onClick={() => !isLocked && handleToggleStep(stepIndex)}
                  disabled={isLocked}
                  aria-expanded={isExpanded}
                  aria-controls={`step-content-${stepIndex}`}
                  className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors
                    ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-inset"}
                  `}
                  style={{ "--tw-ring-color": B.brandPink } as React.CSSProperties}
                >
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isCompleted ? B.brandPink : isExpanded ? B.blush : "#e2e8f0",
                      color: isCompleted ? "#ffffff" : isExpanded ? B.darkRose : "#64748b",
                    }}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-semibold leading-tight"
                        style={{ color: isLocked ? "#94a3b8" : isCompleted ? B.deepBerry : "#1e293b" }}>
                        {step.title}
                      </span>
                      {isCompleted && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ color: B.darkRose, backgroundColor: B.blush }}>Done</span>
                      )}
                    </div>
                    {isLocked && <p className="text-sm text-slate-400 mt-0.5">Complete the previous section to unlock this one.</p>}
                    {isCompleted && !isExpanded && <SectionSummary stepIndex={stepIndex} form={form} />}
                  </div>
                  {!isLocked && (
                    <div className="shrink-0 text-slate-400" aria-hidden="true">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                </button>

                {isExpanded && !isLocked && (
                  <div id={`step-content-${stepIndex}`} className="px-6 pb-6">
                    <div className="border-t border-slate-100 pt-5">
                      {hasErrors && (
                        <div className="mb-5 flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3" role="alert">
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <p className="text-sm text-rose-700 font-medium">Please fill in all required fields before continuing.</p>
                        </div>
                      )}
                      <StepContent
                        stepIndex={stepIndex}
                        form={form}
                        onChange={handleChange}
                        onCancerHistoryChange={handleCancerHistoryChange}
                        errors={fieldErrors}
                      />
                      <div className="mt-6 flex items-center gap-3">
                        {isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleToggleStep(stepIndex)}
                            className="flex-1 py-3 px-5 rounded-xl border-2 border-slate-300 text-slate-700 text-base font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStepSave(stepIndex)}
                          className="flex-1 py-3 px-5 rounded-xl text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-sm"
                          style={{ backgroundColor: B.darkRose, "--tw-ring-color": B.brandPink } as React.CSSProperties}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = B.deepBerry)}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = B.darkRose)}
                        >
                          {stepIndex === STEPS.length - 1
                            ? "Sign & Complete Form"
                            : isCompleted
                            ? "Save Changes & Continue"
                            : "Save & Continue"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Download Section */}
        {showDownload && (
          <div className="mt-6 rounded-2xl border-2 p-7 shadow-lg no-print" role="region" aria-label="Download your completed form"
            style={{ borderColor: B.deepBerry, backgroundColor: B.deepBerry }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <Download className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Your Form Is Ready</h2>
            </div>
            <p className="text-base mb-5 leading-relaxed" style={{ color: B.blush }}>
              All sections are complete. Download a copy to bring with you or share with your provider.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => { window.print(); setHasDownloaded(true); setShowEmailDialog(true); }}
                aria-label="Download completed form as PDF"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ backgroundColor: B.lightPink, color: "#ffffff", "--tw-ring-color": B.blush } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = B.brandPink)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = B.lightPink)}
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                Download as PDF
              </button>
              <button
                type="button"
                onClick={() => { downloadCSV(form); setHasDownloaded(true); setShowEmailDialog(true); }}
                aria-label="Export form data as CSV for EHR import"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors border"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff", borderColor: "rgba(255,255,255,0.25)", "--tw-ring-color": "rgba(255,255,255,0.5)" } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.22)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)")}
              >
                <FileDown className="w-5 h-5" aria-hidden="true" />
                Export for EHR (CSV)
              </button>
            </div>
            <p className="text-sm mt-3 text-center font-medium" style={{ color: B.blush }}>
              After downloading your completed form, please email it as an attachment to{" "}
              <a
                href={`mailto:${PRACTICE_EMAIL}`}
                className="underline hover:opacity-80"
                style={{ color: "#ffffff" }}
              >
                {PRACTICE_EMAIL}
              </a>.
            </p>
            <p className="text-xs mt-2 text-center" style={{ color: B.blush }}>
              The CSV file can be imported into most electronic health record systems.
            </p>
            <p className="text-xs mt-4 pt-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,192,212,0.7)" }}>
              This intake system is intended for use by patients of{" "}
              <span className="font-medium" style={{ color: B.blush }}>{PRACTICE_NAME}</span> only.
            </p>
          </div>
        )}

        {/* Save Tools */}
        <div className="mt-6 rounded-2xl p-6 no-print" role="region" aria-label="Save your progress"
          style={{ border: `1px solid ${B.blush}`, backgroundColor: B.blushLight }}>
          {hasDownloaded ? (
            /* Downloaded — only show Clear Saved Data */
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: B.deepBerry }}>Privacy & Data</h2>
              <p className="text-sm mb-5" role="note" style={{ color: B.darkRose }}>
                Your form is complete. You can remove any locally saved data from this device at any time.
              </p>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={handleClear} className="save-btn save-btn-clear" aria-label="Clear saved data">
                  Clear Saved Data
                </button>
                <p className="helper-text">Removes any saved form information from this device and browser.</p>
                {clearConfirmation && <p role="status" aria-live="polite" className="confirmation-msg text-rose-700 bg-rose-50">{clearConfirmation}</p>}
              </div>
            </div>
          ) : (
            /* Form in progress — show all three options */
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: B.deepBerry }}>Save Your Progress</h2>
              <p className="text-sm mb-5" role="note" style={{ color: B.darkRose }}>
                Your form information stays in this browser unless you choose to print or download it.
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-5">
                <div className="flex flex-col gap-1 flex-1">
                  <button type="button" onClick={handleSessionSave} className="save-btn save-btn-session" aria-label="Save for this session">
                    Save for This Session
                  </button>
                  <p className="helper-text">Saves your progress temporarily while this browser tab stays open.</p>
                  {sessionConfirmation && <p role="status" aria-live="polite" className="confirmation-msg" style={{ color: B.darkRose, backgroundColor: B.blush }}>{sessionConfirmation}</p>}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2 relative">
                    <button ref={deviceSaveButtonRef} type="button" onClick={handleDeviceSaveRequest} className="save-btn save-btn-device" aria-label="Save progress on this device" aria-describedby={tooltipId}>
                      Save Progress on This Device
                    </button>
                    <div className="relative">
                      <button ref={tooltipButtonRef} type="button" aria-label="Privacy information about saving on this device" aria-describedby={tooltipId} aria-expanded={tooltipVisible}
                        onClick={() => setTooltipVisible((v) => !v)} onKeyDown={(e) => { if (e.key === "Escape") setTooltipVisible(false); }} className="tooltip-trigger">
                        <Info className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <div ref={tooltipRef} id={tooltipId} role="tooltip" aria-hidden={!tooltipVisible} className={`tooltip-content ${tooltipVisible ? "tooltip-visible" : "tooltip-hidden"}`}>
                        This saves your progress only on this device and browser so you can come back later. Do not use this option on a shared or public computer.
                      </div>
                    </div>
                  </div>
                  <p className="helper-text">Saves your progress only on this device and browser so you can return later.</p>
                  {deviceConfirmation && <p role="status" aria-live="polite" className="confirmation-msg text-emerald-700 bg-emerald-50">{deviceConfirmation}</p>}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <button type="button" onClick={handleClear} className="save-btn save-btn-clear" aria-label="Clear saved data">
                    Clear Saved Data
                  </button>
                  <p className="helper-text">Removes any saved form information from this device and browser.</p>
                  {clearConfirmation && <p role="status" aria-live="polite" className="confirmation-msg text-rose-700 bg-rose-50">{clearConfirmation}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Print View */}
        <div className="print-only" aria-hidden="true">
          <PrintView form={form} />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Email Prompt Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print" role="dialog" aria-modal="true" aria-label="Send your intake form">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEmailDialog(false)} aria-hidden="true" />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: B.blush }}>
                  <Mail className="w-5 h-5" style={{ color: B.darkRose }} aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 leading-snug">Next Step: Send Your Form</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailDialog(false)}
                aria-label="Close dialog"
                className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 ml-2"
                style={{ "--tw-ring-color": B.brandPink } as React.CSSProperties}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Email your completed intake form to{" "}
              <span className="font-semibold text-slate-800">{PRACTICE_NAME}</span> at:
            </p>
            <a
              href={`mailto:${PRACTICE_EMAIL}?subject=Patient Intake Form — ${PRACTICE_NAME}&body=Please find my completed patient intake form attached.`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors mb-4"
              style={{ backgroundColor: B.darkRose, "--tw-ring-color": B.brandPink } as React.CSSProperties}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = B.deepBerry)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = B.darkRose)}
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              Email to {PRACTICE_EMAIL}
            </a>
            <button
              type="button"
              onClick={() => setShowEmailDialog(false)}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Device Save Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print" role="dialog" aria-modal="true" aria-labelledby={modalTitleId} aria-describedby={modalDescId}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleModalClose} aria-hidden="true" />
          <div ref={modalRef} className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 id={modalTitleId} className="text-lg font-bold text-slate-800 pr-4 leading-snug">Save Progress on This Device</h2>
              <button ref={modalFirstFocusRef} type="button" onClick={handleModalClose} aria-label="Close dialog"
                className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": B.brandPink } as React.CSSProperties}>
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <p id={modalDescId} className="text-sm text-slate-600 mb-5 leading-relaxed">
              Your information will be saved only on this device and in this browser so you can return later and continue your form.{" "}
              <strong>For your privacy, do not use this feature on a shared or public computer.</strong>
            </p>
            <div className="flex items-start gap-3 mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <input id="modal-privacy-checkbox" type="checkbox" checked={modalChecked} onChange={(e) => setModalChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300" style={{ accentColor: B.brandPink }} aria-required="true" />
              <label htmlFor="modal-privacy-checkbox" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                I understand this saves my information only on this device and browser. Do not use this option on a shared or public computer.
              </label>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={handleModalClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors">Cancel</button>
              <button type="button" onClick={handleModalSave} disabled={!modalChecked} aria-disabled={!modalChecked}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ backgroundColor: B.darkRose, "--tw-ring-color": B.brandPink } as React.CSSProperties}>
                Save on This Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Condition Checklist Helper ─────────────────────────────── */

function ConditionChecklist({ prefix, form, onChange }: {
  prefix: "past" | "family";
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
      {CONDITIONS.map(({ label, key }) => {
        const fieldName = `${prefix}${capFirst(key)}`;
        const checked = form[fieldName as keyof FormData] as boolean;
        return (
          <label key={fieldName} className="flex items-center gap-2 cursor-pointer group py-0.5">
            <input
              id={fieldName}
              name={fieldName}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="h-4 w-4 shrink-0 rounded border-slate-300"
              style={{ accentColor: B.brandPink }}
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-snug">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

function OBGYNChecklist({ form, onChange }: {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
      {OBGYN_CONDITIONS.map(({ label, key }) => {
        const fieldName = obgynKey(key);
        const checked = form[fieldName as keyof FormData] as boolean;
        return (
          <label key={fieldName} className="flex items-center gap-2 cursor-pointer group py-0.5">
            <input
              id={fieldName}
              name={fieldName}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="h-4 w-4 shrink-0 rounded border-slate-300"
              style={{ accentColor: B.brandPink }}
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-snug">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ── Yes/No Radio Group ─────────────────────────────────────── */
function YesNo({ name, value, onChange, id }: {
  name: string;
  value: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex gap-6" role="group" aria-labelledby={`${id}-label`}>
      {["Yes", "No"].map(opt => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            className="h-4 w-4 border-slate-300"
            style={{ accentColor: B.brandPink }}
          />
          <span className="text-sm text-slate-700">{opt}</span>
        </label>
      ))}
    </div>
  );
}

/* ── Cancer History Table ────────────────────────────────────── */
function CancerHistoryTable({ entries, onChange }: {
  entries: CancerEntry[];
  onChange: (entries: CancerEntry[]) => void;
}) {
  const addRow = () => {
    onChange([...entries, { id: crypto.randomUUID(), relation: "", cancerType: "", ageAtDiagnosis: "" }]);
  };
  const removeRow = (id: string) => {
    onChange(entries.filter(e => e.id !== id));
  };
  const updateRow = (id: string, field: keyof Omit<CancerEntry, "id">, value: string) => {
    onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div className="flex flex-col gap-3">
      {entries.length === 0 && (
        <p className="text-sm text-slate-400 italic">No entries yet. Click "Add Entry" to add a family or personal cancer history.</p>
      )}
      {entries.map((entry, idx) => (
        <div key={entry.id} className="flex flex-col sm:flex-row gap-2 items-start rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-xs font-semibold text-slate-400 pt-2 shrink-0 w-5">{idx + 1}.</span>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block" htmlFor={`cancer-relation-${entry.id}`}>
                Who (relation)
              </label>
              <input
                id={`cancer-relation-${entry.id}`}
                type="text"
                value={entry.relation}
                onChange={e => updateRow(entry.id, "relation", e.target.value)}
                className="form-input"
                placeholder="e.g. Mother, Self"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block" htmlFor={`cancer-type-${entry.id}`}>
                Type of Cancer
              </label>
              <input
                id={`cancer-type-${entry.id}`}
                type="text"
                value={entry.cancerType}
                onChange={e => updateRow(entry.id, "cancerType", e.target.value)}
                className="form-input"
                placeholder="e.g. Breast, Colon"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block" htmlFor={`cancer-age-${entry.id}`}>
                Age at Diagnosis
              </label>
              <input
                id={`cancer-age-${entry.id}`}
                type="text"
                value={entry.ageAtDiagnosis}
                onChange={e => updateRow(entry.id, "ageAtDiagnosis", e.target.value)}
                className="form-input"
                placeholder="e.g. 52"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeRow(entry.id)}
            aria-label={`Remove entry ${idx + 1}`}
            className="shrink-0 mt-1 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors focus:outline-none focus:ring-2"
        style={{ borderColor: B.lightPink, color: B.darkRose, "--tw-ring-color": B.brandPink } as React.CSSProperties}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = B.blushLight)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <Plus className="w-4 h-4" />
        Add Entry
      </button>
    </div>
  );
}

/* ── Signature Pad (draw) ─────────────────────────────────────── */
function SignaturePad({ onSigned, onCleared }: {
  onSigned: (dataUrl: string) => void;
  onCleared: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasContentRef = useRef(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = B.deepBerry;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = B.deepBerry;
  }, []);

  function getXY(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    isDrawingRef.current = true;
    const pos = getXY(e);
    lastPosRef.current = pos;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function doDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getXY(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
    if (!hasContentRef.current) {
      hasContentRef.current = true;
      setHasContent(true);
    }
  }

  function endDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    isDrawingRef.current = false;
    lastPosRef.current = null;
    if (hasContentRef.current && canvasRef.current) {
      onSigned(canvasRef.current.toDataURL("image/png"));
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasContentRef.current = false;
    setHasContent(false);
    onCleared();
  }

  return (
    <div>
      <div className="relative border-2 rounded-xl bg-white overflow-hidden" style={{ height: "110px", borderColor: B.blush }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={doDraw}
          onMouseUp={endDraw}
          onMouseLeave={(e) => { if (isDrawingRef.current) endDraw(e as unknown as React.MouseEvent); }}
          onTouchStart={startDraw}
          onTouchMove={doDraw}
          onTouchEnd={endDraw}
        />
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <p className="text-slate-400 text-sm italic">Draw your signature here</p>
          </div>
        )}
      </div>
      {hasContent && (
        <button type="button" onClick={clearCanvas}
          className="mt-1.5 text-xs underline focus:outline-none" style={{ color: B.brandPink }}>
          Clear &amp; redraw
        </button>
      )}
    </div>
  );
}

/* ── Signature Block (draw + type switcher) ───────────────────── */
function SignatureBlock({ form, onChange, errors }: {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: FieldErrors;
}) {
  const [mode, setMode] = useState<"draw" | "type">(form.signatureData ? "draw" : "type");

  function fakeEvent(name: string, value: string) {
    return { target: { name, value, type: "text" } } as unknown as React.ChangeEvent<HTMLInputElement>;
  }

  const hasError = !!errors.signatureText;

  return (
    <div className="rounded-xl border-2 p-5" style={{
      borderColor: hasError ? "#fca5a5" : B.blush,
      backgroundColor: hasError ? "#fff1f2" : B.blushLight,
    }}>
      <p className="text-sm font-bold mb-1 uppercase tracking-wide" style={{ color: B.deepBerry }}>Electronic Signature</p>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Your signature confirms you have read and agreed to all authorizations on this form.
      </p>

      <div className="flex gap-1 mb-4 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        {(["draw", "type"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2"
            style={{
              backgroundColor: mode === m ? B.darkRose : "transparent",
              color: mode === m ? "#ffffff" : "#64748b",
              "--tw-ring-color": B.brandPink,
            } as React.CSSProperties}
          >
            {m === "draw" ? "Draw" : "Type"}
          </button>
        ))}
      </div>

      {mode === "draw" ? (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Sign using your mouse or finger:</p>
          <SignaturePad
            onSigned={(dataUrl) => onChange(fakeEvent("signatureData", dataUrl))}
            onCleared={() => onChange(fakeEvent("signatureData", ""))}
          />
        </div>
      ) : (
        <div>
          <Field label="Type your full legal name to sign" required htmlFor="signatureText" error={errors.signatureText}>
            <input
              id="signatureText"
              name="signatureText"
              type="text"
              value={form.signatureText}
              onChange={onChange}
              className={`form-input text-lg ${hasError ? "form-input-error" : ""}`}
              aria-required="true"
              placeholder="Your full legal name"
              autoComplete="name"
            />
          </Field>
          {form.signatureText && (
            <div className="mt-3 p-3 bg-white rounded-lg" style={{ border: `1px solid ${B.blush}` }}>
              <p className="text-xs text-slate-500 mb-1">Signed as:</p>
              <p className="signature-display">{form.signatureText}</p>
            </div>
          )}
        </div>
      )}

      {hasError && (
        <p className="mt-2 text-sm text-rose-700 flex items-center gap-1.5" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Please sign by drawing or typing your full legal name.
        </p>
      )}
    </div>
  );
}

/* ── Step Content ─────────────────────────────────────────────── */
function StepContent({ stepIndex, form, onChange, onCancerHistoryChange, errors }: {
  stepIndex: number;
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancerHistoryChange: (entries: CancerEntry[]) => void;
  errors: FieldErrors;
}) {
  const checkboxOnChange = onChange as (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Step 0 — Personal Information
  if (stepIndex === 0) return (
    <div className="flex flex-col gap-5">
      <TwoCol>
        <Field label="First Name" required htmlFor="firstName" error={errors.firstName}>
          <input id="firstName" name="firstName" type="text" autoComplete="given-name" value={form.firstName} onChange={onChange} className={`form-input ${errors.firstName ? "form-input-error" : ""}`} aria-required="true" placeholder="e.g. Jane" />
        </Field>
        <Field label="Last Name" required htmlFor="lastName" error={errors.lastName}>
          <input id="lastName" name="lastName" type="text" autoComplete="family-name" value={form.lastName} onChange={onChange} className={`form-input ${errors.lastName ? "form-input-error" : ""}`} aria-required="true" placeholder="e.g. Smith" />
        </Field>
      </TwoCol>
      <Field label="Preferred Name" htmlFor="preferredName" hint="The name you like to be called, if different from your legal name.">
        <input id="preferredName" name="preferredName" type="text" value={form.preferredName} onChange={onChange} className="form-input" placeholder="e.g. Janie" />
      </Field>
      <Field label="Date of Birth" required htmlFor="dateOfBirth" error={errors.dateOfBirth}>
        <input id="dateOfBirth" name="dateOfBirth" type="date" autoComplete="bday" value={form.dateOfBirth} onChange={onChange} className={`form-input ${errors.dateOfBirth ? "form-input-error" : ""}`} aria-required="true" />
      </Field>
      <TwoCol>
        <Field label="Email Address" required htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} className={`form-input ${errors.email ? "form-input-error" : ""}`} aria-required="true" placeholder="e.g. jane@email.com" />
        </Field>
        <Field label="Phone Number" required htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={onChange} className={`form-input ${errors.phone ? "form-input-error" : ""}`} aria-required="true" placeholder="e.g. (555) 000-0000" />
        </Field>
      </TwoCol>
      <TwoCol>
        <Field label="Sex Assigned at Birth" htmlFor="sex">
          <select id="sex" name="sex" value={form.sex} onChange={onChange} className="form-input">
            <option value="">— Select —</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Intersex">Intersex</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </Field>
        <Field label="Gender Identity" htmlFor="genderIdentity">
          <select id="genderIdentity" name="genderIdentity" value={form.genderIdentity} onChange={onChange} className="form-input">
            <option value="">— Select —</option>
            <option value="Woman">Woman</option>
            <option value="Man">Man</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Transgender woman">Transgender woman</option>
            <option value="Transgender man">Transgender man</option>
            <option value="Prefer to self-describe">Prefer to self-describe</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </Field>
      </TwoCol>
      <Field label="Pronouns" htmlFor="pronouns" hint="e.g. She/Her, He/Him, They/Them">
        <input id="pronouns" name="pronouns" type="text" value={form.pronouns} onChange={onChange} className="form-input" placeholder="e.g. She/Her" />
      </Field>
      <TwoCol>
        <Field label="Race" htmlFor="race">
          <select id="race" name="race" value={form.race} onChange={onChange} className="form-input">
            <option value="">— Select —</option>
            <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
            <option value="Asian">Asian</option>
            <option value="Black or African American">Black or African American</option>
            <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
            <option value="White">White</option>
            <option value="Multiracial">Multiracial</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </Field>
        <Field label="Ethnicity" htmlFor="ethnicity">
          <select id="ethnicity" name="ethnicity" value={form.ethnicity} onChange={onChange} className="form-input">
            <option value="">— Select —</option>
            <option value="Hispanic or Latino">Hispanic or Latino</option>
            <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </Field>
      </TwoCol>
      <Field label="Preferred Language" htmlFor="preferredLanguage">
        <select id="preferredLanguage" name="preferredLanguage" value={form.preferredLanguage} onChange={onChange} className="form-input">
          <option value="">— Select —</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="Mandarin">Mandarin Chinese</option>
          <option value="Cantonese">Cantonese Chinese</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Korean">Korean</option>
          <option value="Russian">Russian</option>
          <option value="Arabic">Arabic</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Tagalog">Tagalog</option>
          <option value="Other">Other</option>
        </select>
      </Field>
    </div>
  );

  // Step 1 — Address
  if (stepIndex === 1) return (
    <div className="flex flex-col gap-5">
      <Field label="Street Address" required htmlFor="address" error={errors.address}>
        <input id="address" name="address" type="text" autoComplete="street-address" value={form.address} onChange={onChange} className={`form-input ${errors.address ? "form-input-error" : ""}`} aria-required="true" placeholder="e.g. 123 Main Street" />
      </Field>
      <TwoCol>
        <Field label="City" htmlFor="city">
          <input id="city" name="city" type="text" autoComplete="address-level2" value={form.city} onChange={onChange} className="form-input" placeholder="e.g. Farmington Hills" />
        </Field>
        <Field label="State" htmlFor="state">
          <input id="state" name="state" type="text" autoComplete="address-level1" value={form.state} onChange={onChange} className="form-input" placeholder="e.g. MI" />
        </Field>
      </TwoCol>
      <Field label="ZIP Code" htmlFor="zip">
        <input id="zip" name="zip" type="text" autoComplete="postal-code" value={form.zip} onChange={onChange} className="form-input" placeholder="e.g. 48334" />
      </Field>
    </div>
  );

  // Step 2 — Provider & Visit
  if (stepIndex === 2) return (
    <div className="flex flex-col gap-5">
      <Field label="Primary Care Physician" htmlFor="primaryCarePhysician" hint="Your regular doctor, if you have one.">
        <input id="primaryCarePhysician" name="primaryCarePhysician" type="text" value={form.primaryCarePhysician} onChange={onChange} className="form-input" placeholder="e.g. Dr. Maria Lopez" />
      </Field>
      <div className="border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Preferred Pharmacy</p>
        <div className="flex flex-col gap-4">
          <Field label="Pharmacy Name" htmlFor="pharmacyName">
            <input id="pharmacyName" name="pharmacyName" type="text" value={form.pharmacyName} onChange={onChange} className="form-input" placeholder="e.g. CVS, Walgreens, Rite Aid" />
          </Field>
          <TwoCol>
            <Field label="Pharmacy Address" htmlFor="pharmacyAddress">
              <input id="pharmacyAddress" name="pharmacyAddress" type="text" value={form.pharmacyAddress} onChange={onChange} className="form-input" placeholder="e.g. 456 Oak Ave, Farmington Hills" />
            </Field>
            <Field label="Pharmacy Phone" htmlFor="pharmacyPhone">
              <input id="pharmacyPhone" name="pharmacyPhone" type="tel" value={form.pharmacyPhone} onChange={onChange} className="form-input" placeholder="e.g. (555) 111-2222" />
            </Field>
          </TwoCol>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Today's Visit</p>
        <div className="flex flex-col gap-4">
          <Field label="Reason for Visit" required htmlFor="reasonForVisit" error={errors.reasonForVisit} hint="In a few words, describe why you are visiting today.">
            <textarea id="reasonForVisit" name="reasonForVisit" rows={3} value={form.reasonForVisit} onChange={onChange} className={`form-input resize-y ${errors.reasonForVisit ? "form-input-error" : ""}`} aria-required="true" placeholder="e.g. Annual checkup, follow-up visit" />
          </Field>
          <Field label="Current Medications" htmlFor="currentMedications" hint='List any medications you take regularly. Write "None" if you take no medications.'>
            <textarea id="currentMedications" name="currentMedications" rows={3} value={form.currentMedications} onChange={onChange} className="form-input resize-y" placeholder="e.g. Lisinopril 10mg, Aspirin 81mg" />
          </Field>
          <Field label="Drug Allergies" htmlFor="allergies" hint='List any known drug allergies. Write "None" if you have no known drug allergies.'>
            <textarea id="allergies" name="allergies" rows={2} value={form.allergies} onChange={onChange} className="form-input resize-y" placeholder="e.g. Penicillin, Sulfa drugs" />
          </Field>
        </div>
      </div>
    </div>
  );

  // Step 3 — Clinical History
  if (stepIndex === 3) return (
    <div className="flex flex-col gap-6">

      {/* Past Medical History */}
      <div>
        <p className="text-base font-bold text-slate-800 mb-1">Past Medical History</p>
        <p className="text-sm text-slate-500 mb-4">Check all conditions that apply to you personally.</p>
        <ConditionChecklist prefix="past" form={form} onChange={checkboxOnChange} />
        <div className="mt-4">
          <Field label="Other" htmlFor="pastMedicalOther">
            <input id="pastMedicalOther" name="pastMedicalOther" type="text" value={form.pastMedicalOther} onChange={onChange} className="form-input" placeholder="Any other conditions not listed above" />
          </Field>
        </div>
      </div>

      {/* Clinical free-text */}
      <div className="border-t border-slate-100 pt-5 flex flex-col gap-4">
        <Field label="Past Surgeries" htmlFor="pastSurgeries" hint='List any surgeries you have had. Include the approximate year if you remember. Write "None" if not applicable.'>
          <textarea id="pastSurgeries" name="pastSurgeries" rows={2} value={form.pastSurgeries} onChange={onChange} className="form-input resize-y" placeholder="e.g. Appendix removed (2015), Knee surgery (2019)" />
        </Field>
        <Field label="Past Hospitalizations" htmlFor="pastHospitalizations" hint='List any times you have been admitted to a hospital. Write "None" if not applicable.'>
          <textarea id="pastHospitalizations" name="pastHospitalizations" rows={2} value={form.pastHospitalizations} onChange={onChange} className="form-input resize-y" placeholder="e.g. Pneumonia (2020), Childbirth (2018)" />
        </Field>
        <Field label="Chronic or Ongoing Medical Conditions" htmlFor="chronicConditions" hint='List any long-term health conditions not covered above. Write "None" if not applicable.'>
          <textarea id="chronicConditions" name="chronicConditions" rows={2} value={form.chronicConditions} onChange={onChange} className="form-input resize-y" placeholder="e.g. Fibromyalgia, Lupus" />
        </Field>
      </div>

      {/* OB/GYN History */}
      <div className="border-t border-slate-100 pt-5">
        <p className="text-base font-bold text-slate-800 mb-1">OB/GYN History</p>
        <p className="text-sm text-slate-500 mb-4">Have you ever had or do you currently have any of the following?</p>
        <OBGYNChecklist form={form} onChange={checkboxOnChange} />
      </div>

      {/* Menstrual History */}
      <div className="border-t border-slate-100 pt-5">
        <p className="text-base font-bold text-slate-800 mb-4">Menstrual History</p>
        <div className="flex flex-col gap-4">
          <Field label="First day of your last period" htmlFor="lastPeriodDate">
            <input id="lastPeriodDate" name="lastPeriodDate" type="date" value={form.lastPeriodDate} onChange={onChange} className="form-input" />
          </Field>
          <TwoCol>
            <Field label="How often does your period occur?" htmlFor="periodFrequency">
              <input id="periodFrequency" name="periodFrequency" type="text" value={form.periodFrequency} onChange={onChange} className="form-input" placeholder="e.g. Every 28 days" />
            </Field>
            <Field label="How long does your period last?" htmlFor="periodDuration">
              <input id="periodDuration" name="periodDuration" type="text" value={form.periodDuration} onChange={onChange} className="form-input" placeholder="e.g. 5 days" />
            </Field>
          </TwoCol>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p id="periodsHeavy-label" className="text-base font-semibold text-slate-700">Are your periods heavy?</p>
              <YesNo id="periodsHeavy" name="periodsHeavy" value={form.periodsHeavy} onChange={checkboxOnChange} />
            </div>
            <div className="flex flex-col gap-2">
              <p id="periodsAffectActivities-label" className="text-base font-semibold text-slate-700">Do your periods affect your daily activities?</p>
              <YesNo id="periodsAffectActivities" name="periodsAffectActivities" value={form.periodsAffectActivities} onChange={checkboxOnChange} />
            </div>
          </div>
          <TwoCol>
            <Field label="Number of Pregnancies" htmlFor="numberOfPregnancies">
              <input id="numberOfPregnancies" name="numberOfPregnancies" type="text" value={form.numberOfPregnancies} onChange={onChange} className="form-input" placeholder="e.g. 2" />
            </Field>
            <Field label="Delivery Type" htmlFor="deliveryType">
              <select id="deliveryType" name="deliveryType" value={form.deliveryType} onChange={onChange} className="form-input">
                <option value="">— Select —</option>
                <option value="Vaginal">Vaginal</option>
                <option value="Cesarean (C-section)">Cesarean (C-section)</option>
                <option value="Both">Both Vaginal and Cesarean</option>
                <option value="N/A">Not Applicable</option>
              </select>
            </Field>
          </TwoCol>
        </div>
      </div>

      {/* Family Medical History */}
      <div className="border-t border-slate-100 pt-5">
        <p className="text-base font-bold text-slate-800 mb-1">Family Medical History</p>
        <p className="text-sm text-slate-500 mb-4">Check any conditions that run in your immediate family (parents, siblings, children).</p>
        <ConditionChecklist prefix="family" form={form} onChange={checkboxOnChange} />
        <div className="mt-4">
          <Field label="Other" htmlFor="familyHistoryOther">
            <input id="familyHistoryOther" name="familyHistoryOther" type="text" value={form.familyHistoryOther} onChange={onChange} className="form-input" placeholder="Any other family conditions not listed above" />
          </Field>
        </div>
      </div>

      {/* Family / Patient Cancer History */}
      <div className="border-t border-slate-100 pt-5">
        <p className="text-base font-bold text-slate-800 mb-1">Family / Patient Cancer History</p>
        <p className="text-sm text-slate-500 mb-4">List each person who has had cancer, what kind, and age at diagnosis.</p>
        <CancerHistoryTable entries={form.cancerHistory || []} onChange={onCancerHistoryChange} />
      </div>

      {/* Social History */}
      <div className="border-t border-slate-100 pt-5">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Social History</p>
        <div className="flex flex-col gap-4">
          <TwoCol>
            <Field label="Tobacco Use" htmlFor="tobaccoUse">
              <select id="tobaccoUse" name="tobaccoUse" value={form.tobaccoUse} onChange={onChange} className="form-input">
                <option value="">— Select —</option>
                <option value="Never">Never</option>
                <option value="Former user">Former user</option>
                <option value="Current user">Current user</option>
              </select>
            </Field>
            <Field label="Alcohol Use" htmlFor="alcoholUse">
              <select id="alcoholUse" name="alcoholUse" value={form.alcoholUse} onChange={onChange} className="form-input">
                <option value="">— Select —</option>
                <option value="None">None</option>
                <option value="Occasional (1–2 drinks/week)">Occasional (1–2 drinks/week)</option>
                <option value="Moderate (3–7 drinks/week)">Moderate (3–7 drinks/week)</option>
                <option value="Heavy (more than 7 drinks/week)">Heavy (more than 7 drinks/week)</option>
              </select>
            </Field>
          </TwoCol>
          <Field label="Recreational Substance Use" htmlFor="substanceUse" hint='Write "None" if not applicable. Your answers are confidential.'>
            <textarea id="substanceUse" name="substanceUse" rows={2} value={form.substanceUse} onChange={onChange} className="form-input resize-y" placeholder="e.g. None, Marijuana occasionally" />
          </Field>

          {/* Behavioral Questions */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-4">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Additional Health Questions</p>
            <p className="text-xs text-slate-500 -mt-2">Your answers are confidential and help your provider give you the best care.</p>

            <div className="flex flex-col gap-2">
              <p id="sexuallyActive-label" className="text-base font-semibold text-slate-700">Are you sexually active?</p>
              <YesNo id="sexuallyActive" name="sexuallyActive" value={form.sexuallyActive} onChange={checkboxOnChange} />
            </div>

            <div className="flex flex-col gap-2">
              <p id="stdCheck-label" className="text-base font-semibold text-slate-700">Do you wish to be checked for STDs?</p>
              <YesNo id="stdCheck" name="stdCheck" value={form.stdCheck} onChange={checkboxOnChange} />
            </div>

            <div className="flex flex-col gap-2">
              <p id="domesticAbuse-label" className="text-base font-semibold text-slate-700">Has anyone in your home ever physically or verbally abused you?</p>
              <YesNo id="domesticAbuse" name="domesticAbuse" value={form.domesticAbuse} onChange={checkboxOnChange} />
            </div>

            <TwoCol>
              <Field label="How much caffeine do you drink per day?" htmlFor="caffeinePerDay">
                <input id="caffeinePerDay" name="caffeinePerDay" type="text" value={form.caffeinePerDay} onChange={onChange} className="form-input" placeholder="e.g. 2 cups of coffee" />
              </Field>
              <Field label="How often do you exercise?" htmlFor="exerciseFrequency">
                <input id="exerciseFrequency" name="exerciseFrequency" type="text" value={form.exerciseFrequency} onChange={onChange} className="form-input" placeholder="e.g. 3x per week, daily walks" />
              </Field>
            </TwoCol>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4 — Emergency Contact
  if (stepIndex === 4) return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-500 -mt-1">Who should we contact in case of an emergency?</p>
      <Field label="Full Name" htmlFor="emergencyContactName">
        <input id="emergencyContactName" name="emergencyContactName" type="text" value={form.emergencyContactName} onChange={onChange} className="form-input" placeholder="e.g. John Smith" />
      </Field>
      <TwoCol>
        <Field label="Phone Number" htmlFor="emergencyContactPhone">
          <input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" value={form.emergencyContactPhone} onChange={onChange} className="form-input" placeholder="e.g. (555) 000-0000" />
        </Field>
        <Field label="Relationship to You" htmlFor="emergencyContactRelationship">
          <input id="emergencyContactRelationship" name="emergencyContactRelationship" type="text" value={form.emergencyContactRelationship} onChange={onChange} className="form-input" placeholder="e.g. Spouse, Parent, Friend" />
        </Field>
      </TwoCol>
    </div>
  );

  // Step 5 — Insurance
  if (stepIndex === 5) return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-500 -mt-1">If you have health insurance, please fill in the details below. Leave blank if you do not have insurance.</p>
      <Field label="Your Relationship to the Primary Insured" htmlFor="relationshipToInsured">
        <select id="relationshipToInsured" name="relationshipToInsured" value={form.relationshipToInsured} onChange={onChange} className="form-input">
          <option value="self">Self (I am the primary insured)</option>
          <option value="spouse">Spouse / Domestic Partner</option>
          <option value="child">Child</option>
          <option value="other">Other</option>
        </select>
      </Field>
      {form.relationshipToInsured !== "self" && (
        <TwoCol>
          <Field label="Primary Insured Full Name" htmlFor="primaryInsuredName">
            <input id="primaryInsuredName" name="primaryInsuredName" type="text" value={form.primaryInsuredName} onChange={onChange} className="form-input" placeholder="Name on the insurance card" />
          </Field>
          <Field label="Primary Insured Date of Birth" htmlFor="primaryInsuredDOB">
            <input id="primaryInsuredDOB" name="primaryInsuredDOB" type="date" value={form.primaryInsuredDOB} onChange={onChange} className="form-input" />
          </Field>
        </TwoCol>
      )}
      <div className="border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Primary Insurance</p>
        <div className="flex flex-col gap-4">
          <Field label="Insurance Provider" htmlFor="insuranceProvider">
            <input id="insuranceProvider" name="insuranceProvider" type="text" value={form.insuranceProvider} onChange={onChange} className="form-input" placeholder="e.g. Blue Cross Blue Shield" />
          </Field>
          <TwoCol>
            <Field label="Policy Number" htmlFor="policyNumber" hint="Found on your insurance card.">
              <input id="policyNumber" name="policyNumber" type="text" value={form.policyNumber} onChange={onChange} className="form-input" />
            </Field>
            <Field label="Group Number" htmlFor="groupNumber" hint="Found on your insurance card.">
              <input id="groupNumber" name="groupNumber" type="text" value={form.groupNumber} onChange={onChange} className="form-input" />
            </Field>
          </TwoCol>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input id="hasSecondaryInsurance" name="hasSecondaryInsurance" type="checkbox" checked={form.hasSecondaryInsurance} onChange={onChange}
            className="h-5 w-5 rounded border-slate-300" style={{ accentColor: B.brandPink }} />
          <span className="text-base font-semibold text-slate-700">I have a secondary insurance plan</span>
        </label>
        {form.hasSecondaryInsurance && (
          <div className="mt-4 flex flex-col gap-4">
            <Field label="Secondary Insurance Provider" htmlFor="secondaryInsuranceProvider">
              <input id="secondaryInsuranceProvider" name="secondaryInsuranceProvider" type="text" value={form.secondaryInsuranceProvider} onChange={onChange} className="form-input" placeholder="e.g. Medicare, Aetna" />
            </Field>
            <TwoCol>
              <Field label="Secondary Policy Number" htmlFor="secondaryPolicyNumber">
                <input id="secondaryPolicyNumber" name="secondaryPolicyNumber" type="text" value={form.secondaryPolicyNumber} onChange={onChange} className="form-input" />
              </Field>
              <Field label="Secondary Group Number" htmlFor="secondaryGroupNumber">
                <input id="secondaryGroupNumber" name="secondaryGroupNumber" type="text" value={form.secondaryGroupNumber} onChange={onChange} className="form-input" />
              </Field>
            </TwoCol>
          </div>
        )}
      </div>
    </div>
  );

  // Step 6 — Legal & Signature
  if (stepIndex === 6) return (
    <div className="flex flex-col gap-6">

      {/* Notice of Privacy Practices */}
      <div className={`rounded-xl border-2 p-4 ${errors.agreeToPrivacyNotice ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
        <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Acknowledgment of Receipt of Privacy Notice</p>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          This practice is required by law to maintain the privacy of your health information and to provide you with a Notice of Privacy Practices. The Notice describes how your medical information may be used and disclosed, and how you can access this information. By checking the box below, you acknowledge that you have been offered a copy of our Notice of Privacy Practices.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input id="agreeToPrivacyNotice" name="agreeToPrivacyNotice" type="checkbox" checked={form.agreeToPrivacyNotice} onChange={onChange}
            className="mt-0.5 h-5 w-5 rounded border-slate-300" style={{ accentColor: B.brandPink }} aria-required="true" />
          <span className="text-base text-slate-800 leading-relaxed font-medium">
            I acknowledge receipt of this practice's Notice of Privacy Practices and understand how my health information may be used.
          </span>
        </label>
        {errors.agreeToPrivacyNotice && <p id="agreeToPrivacyNotice-error" className="error-msg mt-2">{errors.agreeToPrivacyNotice}</p>}
      </div>

      {/* Assignment of Benefits */}
      <div className={`rounded-xl border-2 p-4 ${errors.agreeToAssignmentOfBenefits ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
        <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Assignment of Benefits</p>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          I authorize direct payment of insurance benefits to this practice for services rendered. I understand that I am financially responsible for any amounts not covered by my insurance, including co-pays, deductibles, and non-covered services.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input id="agreeToAssignmentOfBenefits" name="agreeToAssignmentOfBenefits" type="checkbox" checked={form.agreeToAssignmentOfBenefits} onChange={onChange}
            className="mt-0.5 h-5 w-5 rounded border-slate-300" style={{ accentColor: B.brandPink }} aria-required="true" />
          <span className="text-base text-slate-800 leading-relaxed font-medium">
            I authorize this practice to bill my insurance directly and understand I am responsible for any remaining balance.
          </span>
        </label>
        {errors.agreeToAssignmentOfBenefits && <p id="agreeToAssignmentOfBenefits-error" className="error-msg mt-2">{errors.agreeToAssignmentOfBenefits}</p>}
      </div>

      {/* Financial Responsibility */}
      <div className={`rounded-xl border-2 p-4 ${errors.agreeToFinancialResponsibility ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
        <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Financial Responsibility</p>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          I acknowledge that I am personally responsible for all charges for services rendered at this practice, regardless of insurance coverage. I agree to pay all outstanding balances including co-pays, deductibles, coinsurance, and any services not covered by my insurance plan.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input id="agreeToFinancialResponsibility" name="agreeToFinancialResponsibility" type="checkbox" checked={form.agreeToFinancialResponsibility} onChange={onChange}
            className="mt-0.5 h-5 w-5 rounded border-slate-300" style={{ accentColor: B.brandPink }} aria-required="true" />
          <span className="text-base text-slate-800 leading-relaxed font-medium">
            I understand and accept responsibility for all charges for services provided at this practice.
          </span>
        </label>
        {errors.agreeToFinancialResponsibility && <p id="agreeToFinancialResponsibility-error" className="error-msg mt-2">{errors.agreeToFinancialResponsibility}</p>}
      </div>

      {/* Insurance Waiver — Notice of Responsibility */}
      <div className={`rounded-xl border-2 p-4 ${errors.agreeToInsuranceWaiver ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
        <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Insurance & Claims — Notice of Responsibility</p>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          I authorize this practice to submit claims to my insurance carrier on my behalf. I understand that my insurance company may require additional information to process my claim and that I am responsible for any amounts not covered, including but not limited to deductibles, co-payments, coinsurance, and non-covered services. In the event my claim is denied in whole or in part, I acknowledge that I remain fully responsible for all charges incurred. I agree to pay any balance due upon request.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input id="agreeToInsuranceWaiver" name="agreeToInsuranceWaiver" type="checkbox" checked={form.agreeToInsuranceWaiver} onChange={onChange}
            className="mt-0.5 h-5 w-5 rounded border-slate-300" style={{ accentColor: B.brandPink }} aria-required="true" />
          <span className="text-base text-slate-800 leading-relaxed font-medium">
            I authorize claim submission on my behalf and accept full financial responsibility for any denied, uncovered, or outstanding balances.
          </span>
        </label>
        {errors.agreeToInsuranceWaiver && <p id="agreeToInsuranceWaiver-error" className="error-msg mt-2">{errors.agreeToInsuranceWaiver}</p>}
      </div>

      {/* Patient Certification */}
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Patient Certification</p>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          I certify that the information I have provided in this form is accurate and complete to the best of my knowledge.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input id="agreeToTerms" name="agreeToTerms" type="checkbox" checked={form.agreeToTerms} onChange={onChange}
            className="mt-0.5 h-5 w-5 rounded border-slate-300" style={{ accentColor: B.brandPink }} />
          <span className="text-base text-slate-800 leading-relaxed font-medium">
            I certify that all information I have provided is accurate and complete.
          </span>
        </label>
      </div>

      <SignatureBlock form={form} onChange={onChange} errors={errors} />
    </div>
  );

  return null;
}

/* ── Section Summary ─────────────────────────────────────────── */

function SectionSummary({ stepIndex, form }: { stepIndex: number; form: FormData }) {
  const parts: string[] = [];
  if (stepIndex === 0) {
    if (form.firstName || form.lastName) parts.push(`${form.firstName} ${form.lastName}`.trim());
    if (form.dateOfBirth) parts.push(formatDate(form.dateOfBirth));
  } else if (stepIndex === 1) {
    if (form.city || form.state) parts.push(`${form.city}${form.city && form.state ? ", " : ""}${form.state}`);
  } else if (stepIndex === 2) {
    if (form.reasonForVisit) parts.push(form.reasonForVisit.length > 50 ? form.reasonForVisit.slice(0, 50) + "…" : form.reasonForVisit);
  } else if (stepIndex === 3) {
    const pastCount = CONDITIONS.filter(c => form[pastKey(c.key) as keyof FormData] as boolean).length;
    const obgynCount = OBGYN_CONDITIONS.filter(c => form[obgynKey(c.key) as keyof FormData] as boolean).length;
    const famCount = CONDITIONS.filter(c => form[famKey(c.key) as keyof FormData] as boolean).length;
    if (pastCount > 0) parts.push(`${pastCount} past condition${pastCount !== 1 ? "s" : ""}`);
    if (obgynCount > 0) parts.push(`${obgynCount} OB/GYN condition${obgynCount !== 1 ? "s" : ""}`);
    if (famCount > 0) parts.push(`${famCount} family condition${famCount !== 1 ? "s" : ""}`);
    if (!pastCount && !obgynCount && !famCount) parts.push("No conditions reported");
  } else if (stepIndex === 4) {
    if (form.emergencyContactName) parts.push(form.emergencyContactName);
    if (form.emergencyContactRelationship) parts.push(form.emergencyContactRelationship);
  } else if (stepIndex === 5) {
    parts.push(form.insuranceProvider || "No insurance provided");
    if (form.hasSecondaryInsurance) parts.push("+ Secondary");
  } else if (stepIndex === 6) {
    parts.push(
      form.signatureText ? `Signed by ${form.signatureText}` :
      form.signatureData ? "Signed (drawn)" :
      "Pending signature"
    );
  }
  if (!parts.length) return null;
  return <p className="text-sm text-slate-500 mt-0.5 truncate">{parts.join(" · ")}</p>;
}

/* ── Shared UI Helpers ───────────────────────────────────────── */

function Field({ label, required, htmlFor, hint, error, children }: {
  label: string;
  required?: boolean;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-base font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-600 ml-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-sm text-slate-500 -mt-0.5">{hint}</p>}
      {children}
      {error && <p id={`${htmlFor}-error`} className="error-msg" role="alert">{error}</p>}
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

/* ── Print View ─────────────────────────────────────────────── */

function PrintRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="print-row">
      <span className="print-label">{label}</span>
      <span className="print-value">{value || "\u00a0"}</span>
    </div>
  );
}

function PrintSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="print-section">
      <h2 className="print-section-title">{title}</h2>
      {children}
    </div>
  );
}

function PrintYesNo({ label, value }: { label: string; value: string }) {
  return (
    <div className="print-yesno-row">
      <span className="print-yesno-label">{label}</span>
      <span className="print-yesno-answer">{value || "—"}</span>
    </div>
  );
}

function PrintView({ form }: { form: FormData }) {
  const pastSelected = CONDITIONS.filter(c => form[pastKey(c.key) as keyof FormData] as boolean).map(c => c.label);
  const famSelected = CONDITIONS.filter(c => form[famKey(c.key) as keyof FormData] as boolean).map(c => c.label);
  const obgynSelected = OBGYN_CONDITIONS.filter(c => form[obgynKey(c.key) as keyof FormData] as boolean).map(c => c.label);

  return (
    <div className="print-document">
      {IS_DEMO && <div className="demo-watermark" aria-hidden="true">DEMO</div>}
      {IS_DEMO && (
        <div className="demo-print-notice">
          <strong>DEMO — NOT LICENSED FOR PATIENT USE</strong>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          For evaluation purposes only. Contact hello@tymflo.com to purchase a license.
        </div>
      )}
      <div className="print-doc-header">
        <h1 className="print-doc-title">Patient Intake Form</h1>
        <p className="print-doc-practice">{PRACTICE_NAME}</p>
        <p className="print-doc-practice" style={{ fontStyle: "normal", fontSize: "8pt", color: "#444" }}>
          {PRACTICE_ADDRESS.street} · {PRACTICE_ADDRESS.city}, {PRACTICE_ADDRESS.state} {PRACTICE_ADDRESS.zip} · Ph: {PRACTICE_ADDRESS.phone} · Fax: {PRACTICE_ADDRESS.fax}
        </p>
        <p className="print-doc-practice" style={{ fontStyle: "normal", fontSize: "8pt", color: "#444" }}>
          {PRACTICE_PHYSICIANS.join(" · ")}
        </p>
        <p className="print-doc-subtitle">Date printed: {new Date().toLocaleDateString()}</p>
      </div>

      <PrintSection title="Personal Information">
        <div className="print-two-col">
          <PrintRow label="First Name" value={form.firstName} />
          <PrintRow label="Last Name" value={form.lastName} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Preferred Name" value={form.preferredName} />
          <PrintRow label="Date of Birth" value={formatDate(form.dateOfBirth)} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Email" value={form.email} />
          <PrintRow label="Phone" value={form.phone} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Sex Assigned at Birth" value={form.sex} />
          <PrintRow label="Gender Identity" value={form.genderIdentity} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Pronouns" value={form.pronouns} />
          <PrintRow label="Preferred Language" value={form.preferredLanguage} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Race" value={form.race} />
          <PrintRow label="Ethnicity" value={form.ethnicity} />
        </div>
      </PrintSection>

      <PrintSection title="Address">
        <PrintRow label="Street Address" value={form.address} />
        <div className="print-two-col">
          <PrintRow label="City" value={form.city} />
          <PrintRow label="State" value={form.state} />
        </div>
        <PrintRow label="ZIP Code" value={form.zip} />
      </PrintSection>

      <PrintSection title="Provider & Visit">
        <PrintRow label="Primary Care Physician" value={form.primaryCarePhysician} />
        <div className="print-two-col">
          <PrintRow label="Pharmacy Name" value={form.pharmacyName} />
          <PrintRow label="Pharmacy Phone" value={form.pharmacyPhone} />
        </div>
        <PrintRow label="Pharmacy Address" value={form.pharmacyAddress} />
        <PrintRow label="Reason for Visit" value={form.reasonForVisit} />
        <PrintRow label="Current Medications" value={form.currentMedications} />
        <PrintRow label="Drug Allergies" value={form.allergies} />
      </PrintSection>

      <PrintSection title="Clinical History — Past Medical History">
        <div className="print-checklist">
          {CONDITIONS.map(({ label, key }) => {
            const checked = form[pastKey(key) as keyof FormData] as boolean;
            return (
              <div key={key} className="print-check-item">
                <span className="print-checkbox">{checked ? "☑" : "☐"}</span>
                <span>{label}</span>
              </div>
            );
          })}
          <div className="print-check-item">
            <span className="print-checkbox">☐</span>
            <span>Other: {form.pastMedicalOther || "_______________________"}</span>
          </div>
        </div>
        <PrintRow label="Past Surgeries" value={form.pastSurgeries} />
        <PrintRow label="Past Hospitalizations" value={form.pastHospitalizations} />
        <PrintRow label="Additional Chronic Conditions" value={form.chronicConditions} />
      </PrintSection>

      <PrintSection title="OB/GYN History">
        <p className="print-subtitle">Have you ever had or do you currently have any of the following?</p>
        <div className="print-checklist">
          {OBGYN_CONDITIONS.map(({ label, key }) => {
            const checked = form[obgynKey(key) as keyof FormData] as boolean;
            return (
              <div key={key} className="print-check-item">
                <span className="print-checkbox">{checked ? "☑" : "☐"}</span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </PrintSection>

      <PrintSection title="Menstrual History">
        <div className="print-two-col">
          <PrintRow label="First Day of Last Period" value={formatDate(form.lastPeriodDate)} />
          <PrintRow label="Period Frequency" value={form.periodFrequency} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Period Duration" value={form.periodDuration} />
          <PrintRow label="Number of Pregnancies" value={form.numberOfPregnancies} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Delivery Type" value={form.deliveryType} />
        </div>
        <PrintYesNo label="Are your periods heavy?" value={form.periodsHeavy} />
        <PrintYesNo label="Do your periods affect your daily activities?" value={form.periodsAffectActivities} />
      </PrintSection>

      <PrintSection title="Clinical History — Family Medical History">
        <p className="print-subtitle">Immediate family (parents, siblings, children)</p>
        <div className="print-checklist">
          {CONDITIONS.map(({ label, key }) => {
            const checked = form[famKey(key) as keyof FormData] as boolean;
            return (
              <div key={key} className="print-check-item">
                <span className="print-checkbox">{checked ? "☑" : "☐"}</span>
                <span>{label}</span>
              </div>
            );
          })}
          <div className="print-check-item">
            <span className="print-checkbox">☐</span>
            <span>Other: {form.familyHistoryOther || "_______________________"}</span>
          </div>
        </div>
      </PrintSection>

      {(form.cancerHistory || []).length > 0 && (
        <PrintSection title="Family / Patient Cancer History">
          <table className="print-cancer-table">
            <thead>
              <tr>
                <th>Relation</th>
                <th>Type of Cancer</th>
                <th>Age at Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {(form.cancerHistory || []).map(entry => (
                <tr key={entry.id}>
                  <td>{entry.relation}</td>
                  <td>{entry.cancerType}</td>
                  <td>{entry.ageAtDiagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PrintSection>
      )}

      <PrintSection title="Social History">
        <div className="print-two-col">
          <PrintRow label="Tobacco Use" value={form.tobaccoUse} />
          <PrintRow label="Alcohol Use" value={form.alcoholUse} />
        </div>
        <PrintRow label="Substance Use" value={form.substanceUse} />
        <PrintYesNo label="Are you sexually active?" value={form.sexuallyActive} />
        <PrintYesNo label="Do you wish to be checked for STDs?" value={form.stdCheck} />
        <PrintYesNo label="Has anyone in your home ever physically or verbally abused you?" value={form.domesticAbuse} />
        <div className="print-two-col">
          <PrintRow label="Caffeine Per Day" value={form.caffeinePerDay} />
          <PrintRow label="Exercise Frequency" value={form.exerciseFrequency} />
        </div>
      </PrintSection>

      <PrintSection title="Emergency Contact">
        <PrintRow label="Full Name" value={form.emergencyContactName} />
        <div className="print-two-col">
          <PrintRow label="Phone Number" value={form.emergencyContactPhone} />
          <PrintRow label="Relationship" value={form.emergencyContactRelationship} />
        </div>
      </PrintSection>

      <PrintSection title="Insurance">
        <PrintRow label="Relationship to Primary Insured" value={form.relationshipToInsured} />
        {form.relationshipToInsured !== "self" && (
          <div className="print-two-col">
            <PrintRow label="Primary Insured Name" value={form.primaryInsuredName} />
            <PrintRow label="Primary Insured DOB" value={formatDate(form.primaryInsuredDOB)} />
          </div>
        )}
        <PrintRow label="Insurance Provider" value={form.insuranceProvider} />
        <div className="print-two-col">
          <PrintRow label="Policy Number" value={form.policyNumber} />
          <PrintRow label="Group Number" value={form.groupNumber} />
        </div>
        {form.hasSecondaryInsurance && (
          <>
            <PrintRow label="Secondary Insurance Provider" value={form.secondaryInsuranceProvider} />
            <div className="print-two-col">
              <PrintRow label="Secondary Policy Number" value={form.secondaryPolicyNumber} />
              <PrintRow label="Secondary Group Number" value={form.secondaryGroupNumber} />
            </div>
          </>
        )}
      </PrintSection>

      <PrintSection title="Legal Authorizations & Signature">
        <div className="print-agreement">
          <span className="print-checkbox">{form.agreeToPrivacyNotice ? "☑" : "☐"}</span>
          <span><strong>Acknowledgment of Receipt of Privacy Notice:</strong> I acknowledge receipt of this practice's Notice of Privacy Practices and understand how my health information may be used.</span>
        </div>
        <div className="print-agreement">
          <span className="print-checkbox">{form.agreeToAssignmentOfBenefits ? "☑" : "☐"}</span>
          <span><strong>Assignment of Benefits:</strong> I authorize direct payment of insurance benefits to this practice and accept financial responsibility for remaining balances.</span>
        </div>
        <div className="print-agreement">
          <span className="print-checkbox">{form.agreeToFinancialResponsibility ? "☑" : "☐"}</span>
          <span><strong>Financial Responsibility:</strong> I acknowledge responsibility for all charges for services rendered.</span>
        </div>
        <div className="print-agreement">
          <span className="print-checkbox">{form.agreeToInsuranceWaiver ? "☑" : "☐"}</span>
          <span><strong>Insurance & Claims — Notice of Responsibility:</strong> I authorize claim submission on my behalf and accept full financial responsibility for any denied, uncovered, or outstanding balances.</span>
        </div>
        <div className="print-agreement">
          <span className="print-checkbox">{form.agreeToTerms ? "☑" : "☐"}</span>
          <span><strong>Patient Certification:</strong> I certify that all information provided is accurate and complete.</span>
        </div>
        <div className="print-signature-row">
          <div className="print-signature-line">
            {form.signatureData
              ? <img src={form.signatureData} alt="Patient drawn signature" className="print-signature-img" />
              : <p className="print-signature-name">{form.signatureText}</p>
            }
            <span className="print-label">Electronic Signature</span>
          </div>
          <div className="print-signature-line">
            <p className="print-signature-name print-signature-date">{form.signatureTimestamp || form.signatureDate}</p>
            <span className="print-label">Date &amp; Time Signed</span>
          </div>
        </div>
      </PrintSection>

      <PrintFooter />
    </div>
  );
}
