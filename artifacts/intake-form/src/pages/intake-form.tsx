   <button
        type="button"
        onClick={addEntry}
        className="flex items-center gap-2 self-start px-4 py-2 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors focus:outline-none focus:ring-2"
        style={{ borderColor: B.lightPink, color: B.darkRose, "--tw-ring-color": B.brandPink } as React.CSSProperties}
        onMouseEnter={event => (event.currentTarget.style.backgroundColor = B.blushLight)}
        onMouseLeave={event => (event.currentTarget.style.backgroundColor = "transparent")}
      >
        <Plus className="w-4 h-4" />
        Add another medication
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
function StepContent({ stepIndex, form, onChange, onCancerHistoryChange, onMedicationChange, errors }: {
  stepIndex: number;
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancerHistoryChange: (entries: CancerEntry[]) => void;
  onMedicationChange: (entries: MedicationEntry[]) => void;
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
      <Field label="Marital Status" htmlFor="maritalStatus">
        <select id="maritalStatus" name="maritalStatus" value={form.maritalStatus} onChange={onChange} className="form-input">
          <option value="">— Select —</option>
          {MARITAL_STATUS_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </Field>
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
      <div className="border-t border-slate-100 pt-5">
        <p className="text-base font-bold text-slate-800 mb-1">Emergency Contact</p>
        <p className="text-sm text-slate-500 mb-4">Who should we contact in case of an emergency?</p>
        <div className="flex flex-col gap-4">
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
      </div>
    </div>
  );

  // Step 2 — Provider & Visit
  if (stepIndex === 2) return (
    <div className="flex flex-col gap-5">
      <TwoCol>
        <Field label="Primary Care Physician" htmlFor="primaryCarePhysician" hint="Your regular doctor, if you have one.">
          <input id="primaryCarePhysician" name="primaryCarePhysician" type="text" value={form.primaryCarePhysician} onChange={onChange} className="form-input" placeholder="e.g. Dr. Maria Lopez" />
        </Field>
        <Field label="Primary Care Physician Phone" htmlFor="primaryCarePhysicianPhone">
          <input id="primaryCarePhysicianPhone" name="primaryCarePhysicianPhone" type="tel" value={form.primaryCarePhysicianPhone} onChange={onChange} className="form-input" placeholder="e.g. (555) 111-2222" />
        </Field>
      </TwoCol>
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
          <div>
            <p className="text-base font-semibold text-slate-700 mb-1.5">Current Medications</p>
            <MedicationEntryList entries={form.currentMedications} onChange={onMedicationChange} />
          </div>
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
        <div className="mt-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Screening History</p>
          <TwoCol>
            <Field label="Last Pap Smear" htmlFor="lastPapSmear">
              <input id="lastPapSmear" name="lastPapSmear" type="date" value={form.lastPapSmear} onChange={onChange} className="form-input" />
            </Field>
            <Field label="Last Mammogram" htmlFor="lastMammogram">
              <input id="lastMammogram" name="lastMammogram" type="date" value={form.lastMammogram} onChange={onChange} className="form-input" />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Last Colonoscopy" htmlFor="lastColposcopy">
              <input id="lastColposcopy" name="lastColposcopy" type="date" value={form.lastColposcopy} onChange={onChange} className="form-input" />
            </Field>
            <Field label="Last Bone Density" htmlFor="lastBoneDensity">
              <input id="lastBoneDensity" name="lastBoneDensity" type="date" value={form.lastBoneDensity} onChange={onChange} className="form-input" />
            </Field>
          </TwoCol>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Number of Pregnancies" htmlFor="numberOfPregnancies">
              <input id="numberOfPregnancies" name="numberOfPregnancies" type="text" value={form.numberOfPregnancies} onChange={onChange} className="form-input" placeholder="e.g. 2" />
            </Field>
            <Field label="Number of Miscarriages" htmlFor="numberOfMiscarriages">
              <input id="numberOfMiscarriages" name="numberOfMiscarriages" type="text" value={form.numberOfMiscarriages} onChange={onChange} className="form-input" placeholder="e.g. 0" />
            </Field>
            <Field label="Number of Abortions" htmlFor="numberOfAbortions">
              <input id="numberOfAbortions" name="numberOfAbortions" type="text" value={form.numberOfAbortions} onChange={onChange} className="form-input" placeholder="e.g. 0" />
            </Field>
          </div>
          <Field label="Delivery Type" htmlFor="deliveryType">
            <select id="deliveryType" name="deliveryType" value={form.deliveryType} onChange={onChange} className="form-input">
              <option value="">— Select —</option>
              <option value="Vaginal">Vaginal</option>
              <option value="Cesarean (C-section)">Cesarean (C-section)</option>
              <option value="Both">Both Vaginal and Cesarean</option>
              <option value="N/A">Not Applicable</option>
            </select>
          </Field>
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

  // Step 4 — Insurance
  if (stepIndex === 4) return (
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

  // Step 5 — Legal & Signature
  if (stepIndex === 5) return (
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
    if (form.emergencyContactName) parts.push(`Emergency: ${form.emergencyContactName}`);
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
    parts.push(form.insuranceProvider || "No insurance provided");
    if (form.hasSecondaryInsurance) parts.push("+ Secondary");
  } else if (stepIndex === 5) {
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
        <PrintRow label="Marital Status" value={form.maritalStatus} />
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

      <PrintSection title="Address & Emergency Contact">
        <PrintRow label="Street Address" value={form.address} />
        <div className="print-two-col">
          <PrintRow label="City" value={form.city} />
          <PrintRow label="State" value={form.state} />
        </div>
        <PrintRow label="ZIP Code" value={form.zip} />
        <PrintRow label="Emergency Contact Name" value={form.emergencyContactName} />
        <div className="print-two-col">
          <PrintRow label="Emergency Contact Phone" value={form.emergencyContactPhone} />
          <PrintRow label="Relationship to Patient" value={form.emergencyContactRelationship} />
        </div>
      </PrintSection>

      <PrintSection title="Provider & Visit">
        <div className="print-two-col">
          <PrintRow label="Primary Care Physician" value={form.primaryCarePhysician} />
          <PrintRow label="Primary Care Physician Phone" value={form.primaryCarePhysicianPhone} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Pharmacy Name" value={form.pharmacyName} />
          <PrintRow label="Pharmacy Phone" value={form.pharmacyPhone} />
        </div>
        <PrintRow label="Pharmacy Address" value={form.pharmacyAddress} />
        <PrintRow label="Reason for Visit" value={form.reasonForVisit} />
        <PrintRow label="Current Medications & Dosages" value={formatMedicationEntries(form.currentMedications)} />
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
        <div className="print-two-col">
          <PrintRow label="Last Pap Smear" value={formatDate(form.lastPapSmear)} />
          <PrintRow label="Last Mammogram" value={formatDate(form.lastMammogram)} />
        </div>
        <div className="print-two-col">
          <PrintRow label="Last Colonoscopy" value={formatDate(form.lastColposcopy)} />
          <PrintRow label="Last Bone Density" value={formatDate(form.lastBoneDensity)} />
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
          <PrintRow label="Number of Miscarriages" value={form.numberOfMiscarriages} />
          <PrintRow label="Number of Abortions" value={form.numberOfAbortions} />
        </div>
        <PrintRow label="Delivery Type" value={form.deliveryType} />
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
