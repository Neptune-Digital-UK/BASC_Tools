"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, ChevronRight, Info, RefreshCw } from "lucide-react";
// Updated utility function to match new code
function cx(...s: (string | undefined | false)[]) { return s.filter(Boolean).join(" "); }

// Horse Coverage Eligibility – Combined (Sport + Western)
// Start: ask if the horse is Western or Sport → then follow each product's rules.
// Value → Use (dynamic per category) → Age → Preferences → Results
// Notes:
// - All Classic MM labels include "(with coinsurance)". The $100k+ note remains "without coinsurance".
// - Western Barrel: only External Accident MM, Basic MM ($7,500 limit only), Surgical; NOT Special, Classic, or Medical Assistance.
// - Western General (Cutting/Reining/Roping/Steer Wrestling/Ranch/Ranch Versatility/Breeding/Yearlings 31+ days/Rearing/Breed Show/Pleasure):
//   Classic (with coinsurance), Basic, Special, Medical Assistance, External Accident MM, Surgical, Colic.
// - Sport Eventing: only External Accident MM, Surgical.
// - Sport Dressage: < $50k → not Basic/Classic/Special/Medical Assistance (still External Accident MM, Surgical). ≥ $50k → eligible for Basic/Classic/Special/Medical Assistance (+ External Accident MM, Surgical).
// - Sport Polo/Racing: Colic only.
// - Sport General (Hunters/Jumpers/Fox/Show Driving/Breeding/Yearlings 31+ days/Rearing/Breed Show/Pleasure):
//   Classic/Basic/Special/Medical Assistance + External Accident MM + Surgical + Colic.
// - Age: 31 days–20 years → Classic/Basic/Special eligible. Ponies over 20 years → Medical Assistance removed, Surgical/Colic removed, Major Medical eligibility based on value.

const CATEGORIES = [
  { key: "western", label: "Western" },
  { key: "sport", label: "Sport Horse" },
];

const USES_SPORT = [
  { key: "eventing", label: "Eventing" },
  { key: "dressage", label: "Dressage" },
  { key: "polo_racing", label: "Polo or Racing" },
  { key: "general_sport", label: "Hunters / Jumpers / Fox Hunting / Show Driving / Breeding / Yearlings (31+ days) / Rearing / Breed Show / Pleasure (incl. under $20k with Medical Assistance)" },
];

const USES_WESTERN = [
  { key: "barrel", label: "Barrel" },
  { key: "general_western", label: "Cutting / Reining / Roping / Steer Wrestling / Ranch / Ranch Versatility / Breeding / Yearlings (31+ days) / Rearing / Breed Show / Pleasure (incl. under $20k with Medical Assistance)" },
];

const AGE_BANDS = [
  { key: "31d_20y", label: "31 days – 20 years" },
  { key: "over20", label: "A Pony over 20 years" },
];

const PREFS = [
  { key: "broad_coverage", label: "Broad coverage for diagnostics/lameness" },
  { key: "no_copay", label: "No co-pay (okay with diagnostic/lameness sub-limits)" },
];

export default function SportHorseEligibilityWizard() {
  const [step, setStep] = useState(1); // 1: Category, 2: Value, 3: Use, 4: Age, 5: Prefs, 6: Results
  const [category, setCategory] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [use, setUse] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [prefs, setPrefs] = useState<string[]>([]);

  const numericValue = useMemo(() => {
    const n = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : NaN;
  }, [value]);

  const valueStatus = useMemo(() => {
    if (!value) return null;
    if (Number.isNaN(numericValue)) return { type: "error", text: "Please enter a number." } as const;
    if (numericValue < 20000) return { type: "info", text: "Not eligible for Major Medical (Under $20k). Medical Assistance still available." } as const;
    if (numericValue >= 100000) return { type: "ok", text: "$100k+ value: eligible for Classic Major Medical without coinsurance (subject to use & age)." } as const;
    return { type: "ok", text: "Eligible for Major Medical (subject to use & age)." } as const;
  }, [numericValue, value]);

  function resetAll() {
    setStep(1); 
    setCategory(""); 
    setValue(""); 
    setUse(""); 
    setAge(""); 
    setPrefs([]);
  }

  const uses = category === "western" ? USES_WESTERN : category === "sport" ? USES_SPORT : [];

  // Base eligibility by category+use (before age/value gates)
  const baseEligibility = useMemo(() => {
    const none = { classic:false, basic:false, special:false, medical_assistance:false, external_accident:false, surgical:false, colic:false };

    if (category === "sport") {
      switch (use) {
        case "eventing":
          return { ...none, external_accident:true, surgical:true };
        case "dressage":
          if (!Number.isNaN(numericValue) && numericValue >= 50000) {
            return { classic:true, basic:true, special:true, medical_assistance:true, external_accident:true, surgical:true, colic:false };
          } else {
            return { ...none, external_accident:true, surgical:true };
          }
        case "polo_racing":
          return { ...none, colic:true };
        case "general_sport":
          return { classic:true, basic:true, special:true, medical_assistance:true, external_accident:true, surgical:true, colic:true };
        default:
          return none;
      }
    }

    if (category === "western") {
      switch (use) {
        case "barrel":
          // Only External Accident MM, Basic MM ($7,500 limit only), Surgical
          return { ...none, external_accident:true, surgical:true, basic:true };
        case "general_western":
          return { classic:true, basic:true, special:true, medical_assistance:true, external_accident:true, surgical:true, colic:true };
        default:
          return none;
      }
    }

    return none;
  }, [category, use, numericValue]);

  // Apply age adjustments
  const ageAdjustedEligibility = useMemo(() => {
    const e = { ...baseEligibility } as Record<string, boolean>;
    if (age === "over20") {
      // For ponies over 20 years old:
      // - Remove Medical Assistance (new logic)
      // - Remove Surgical and Colic (new logic)
      // - Keep Major Medical eligibility (Basic/Classic/Special) based on value
      e.medical_assistance = false;
      e.surgical = false;
      e.colic = false;
      // Classic Major Medical is already handled by base eligibility logic
    }
    return e;
  }, [baseEligibility, age]);

  const valueGateAllowsMM = useMemo(() => {
    if (Number.isNaN(numericValue)) return false;
    return numericValue >= 20000; // Under $20k → not eligible for Major Medical
  }, [numericValue]);

  const finalEligibility = useMemo(() => {
    const e = { ...ageAdjustedEligibility } as Record<string, boolean>;
    if (!valueGateAllowsMM) {
      e.basic = false; e.classic = false; e.special = false;
      // Medical Assistance is already handled in ageAdjustedEligibility for ponies over 20
      // For horses 31 days - 20 years, Medical Assistance remains available if base allowed
    }
    return e;
  }, [ageAdjustedEligibility, valueGateAllowsMM, age]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (prefs.includes("broad_coverage")) {
      if (finalEligibility.classic) recs.push("Classic Major Medical (with coinsurance) — broadest coverage profile");
      if (finalEligibility.special) recs.push("Special Major Medical — broad coverage with sub‑limits");
    }
    if (prefs.includes("no_copay")) {
      if (finalEligibility.basic) {
        if (category === "western" && use === "barrel") recs.push("Basic Major Medical — $7,500 limit only");
        else recs.push("Basic Major Medical — no co‑pay, with diagnostic/lameness sub‑limits");
      }
      if (finalEligibility.special) recs.push("Special Major Medical — broader than Basic, may fit no‑co‑pay preference");
    }
    if (recs.length === 0) {
      if (finalEligibility.classic) recs.push("Classic Major Medical (with coinsurance)");
      else if (finalEligibility.special) recs.push("Special Major Medical");
      else if (finalEligibility.basic) recs.push(category === "western" && use === "barrel" ? "Basic Major Medical — $7,500 limit only" : "Basic Major Medical");
      else if (finalEligibility.medical_assistance) recs.push("Medical Assistance — available even under $20k");
    }
    const addNonMM: string[] = [];
    if (finalEligibility.external_accident) addNonMM.push("Equine External Accident Major Medical");
    if (finalEligibility.surgical) addNonMM.push("Surgical");
    if (finalEligibility.colic) addNonMM.push("Colic");
    return { recs, addNonMM };
  }, [finalEligibility, prefs, category, use]);

  const canContinueCat = !!category;
  const canContinueStep1 = valueStatus && valueStatus.type !== "error" && value !== "";
  const canContinueStep2 = !!use;
  const canContinueStep3 = !!age;
  const canContinueStep4 = prefs.length > 0; // Make preferences mandatory

  const showUnder20kMessage = !Number.isNaN(numericValue) && numericValue < 20000;
  const show100kNote = !Number.isNaN(numericValue) && numericValue >= 100000 && finalEligibility.classic;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">Medical Coverage Eligibility</h1>
        <Button variant="ghost" onClick={resetAll} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <ProgressBar step={step} />

      {step === 1 && (
        <Card className="mt-4 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-2">Step 0 · Type of Horse</h2>
            <p className="text-sm text-gray-600 mb-3">Is this a Western or Sport horse?</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <button key={c.key} onClick={() => setCategory(c.key)} className={cx("p-4 rounded-2xl border text-left hover:shadow-sm transition", category===c.key && "ring-2 ring-offset-2")}> 
                  <div className="font-medium mb-1">{c.label}</div>
                  <div className="text-xs text-gray-600">Select category</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setStep(2)} disabled={!canContinueCat} className="gap-2">Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="mt-4 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Step 1 · Horse Value</h2>
              <Button variant="ghost" onClick={() => setStep(1)} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Enter the insured value (USD).</p>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                inputMode="decimal"
                placeholder="$50,000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-2xl border p-3 focus:outline-none focus:ring-2"
              />
              <Button onClick={() => setStep(3)} disabled={!canContinueStep1} className="gap-2">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {valueStatus && (
              <div
                className={cx("mt-4 text-sm flex items-start gap-2", valueStatus.type === "error" && "text-red-600", valueStatus.type === "ok" && "text-emerald-700", valueStatus.type === "info" && "text-slate-700")}
              >
                {valueStatus.type === "error" ? (
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                ) : (
                  <Info className="h-4 w-4 mt-0.5" />
                )}
                <span>{valueStatus.text}</span>
              </div>
            )}
            {showUnder20kMessage && (<p className="mt-2 text-xs text-slate-500">For horses under $20,000, Major Medical is unavailable. You can still consider Medical Assistance.</p>)}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="mt-4 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Step 2 · Horse Use</h2>
              <Button variant="ghost" onClick={() => setStep(2)} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {uses.map((u) => (
                <button
                  key={u.key}
                  onClick={() => setUse(u.key)}
                  className={cx("p-4 rounded-2xl border text-left hover:shadow-sm transition", use===u.key && "ring-2 ring-offset-2")}
                >
                  <div className="font-medium mb-1">{u.label}</div>
                  <div className="text-xs text-gray-600">Select the primary use/discipline</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setStep(4)} disabled={!canContinueStep2} className="gap-2">Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="mt-4 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Step 3 · Horse Age</h2>
              <Button variant="ghost" onClick={() => setStep(3)} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {AGE_BANDS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => setAge(a.key)}
                  className={cx("p-4 rounded-2xl border text-left hover:shadow-sm transition", age===a.key && "ring-2 ring-offset-2")}
                >
                  <div className="font-medium mb-1">{a.label}</div>
                  <div className="text-xs text-gray-600">Choose the age range</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setStep(5)} disabled={!canContinueStep3} className="gap-2">Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card className="mt-4 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Step 4 · Coverage Preferences</h2>
              <Button variant="ghost" onClick={() => setStep(4)} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
            </div>
            <p className="text-sm text-gray-600 mt-1 mb-3">Please select what matters most to you.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PREFS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPrefs((prev) => prev.includes(p.key) ? prev.filter(x=>x!==p.key) : [...prev, p.key])}
                  className={cx("p-4 rounded-2xl border text-left hover:shadow-sm transition", prefs.includes(p.key) && "ring-2 ring-offset-2")}
                >
                  <div className="font-medium mb-1">{p.label}</div>
                  <div className="text-xs text-gray-600">Tap to {prefs.includes(p.key) ? "remove" : "select"}</div>
                </button>
              ))}
            </div>
            <div className="mt-4">
              {prefs.length === 0 && (
                <p className="text-sm text-gray-500 mb-3">Please select at least one preference to continue.</p>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setStep(6)} disabled={!canContinueStep4} className="gap-2">See Results <ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 6 && (
        <Results
          category={category}
          value={numericValue}
          useKey={use}
          ageKey={age}
          finalEligibility={finalEligibility}
          recommendations={recommendations}
          onBack={() => setStep(5)}
          onReset={resetAll}
          show100kNote={show100kNote}
        />
      )}
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  const labels = ["Type", "Value", "Use", "Age", "Preferences", "Results"];
  return (
    <div className="grid grid-cols-6 gap-2">
      {labels.map((l, i) => (
        <div key={l} className={cx("h-2 rounded-full", i < step ? "bg-[#2BD5DB]" : "bg-gray-200")}></div>
      ))}
    </div>
  );
}

function Results({
  category,
  value,
  useKey,
  ageKey,
  finalEligibility,
  recommendations,
  onBack,
  onReset,
  show100kNote,
}: {
  category: string;
  value: number;
  useKey: string;
  ageKey: string;
  finalEligibility: Record<string, boolean>;
  recommendations: { recs: string[]; addNonMM: string[] };
  onBack: () => void;
  onReset: () => void;
  show100kNote: boolean;
}) {
  const useLabel = useMemo(() => {
    const src = category === "western" ? USES_WESTERN : USES_SPORT;
    return src.find((u) => u.key === useKey)?.label || "—";
  }, [category, useKey]);
  const ageLabel = AGE_BANDS.find((a) => a.key === ageKey)?.label || "—";

  const mmLabels: string[] = [];
  if (finalEligibility.classic) mmLabels.push("Classic Major Medical (with coinsurance)");
  if (finalEligibility.special) mmLabels.push("Special Major Medical");
  if (finalEligibility.basic) mmLabels.push(category === "western" && useKey === "barrel" ? "Basic Major Medical — $7,500 limit only" : "Basic Major Medical");
  if (finalEligibility.medical_assistance) mmLabels.push("Medical Assistance");

  const otherList = [
    finalEligibility.external_accident && "Equine External Accident Major Medical",
    finalEligibility.surgical && "Surgical",
    finalEligibility.colic && "Colic",
  ].filter(Boolean) as string[];

  const hasMM = mmLabels.length > 0;

  return (
    <Card className="mt-4 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-medium">Eligibility Results</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={onReset} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Start Over
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3 mt-2">
          <InfoTile title="Type" value={category ? (category === "western" ? "Western" : "Sport Horse") : "—"} />
          <InfoTile title="Value" value={Number.isFinite(value) ? `$${value.toLocaleString()}` : "—"} />
          <InfoTile title="Use" value={useLabel} />
          <InfoTile title="Age" value={ageLabel} />
        </div>

        {show100kNote && (
          <div className="mt-4 text-sm p-3 rounded-xl bg-emerald-50">
            Horses valued at $100,000+ are eligible for Classic Major Medical without coinsurance (subject to use & age).
          </div>
        )}

        <section className="mt-6">
          <h3 className="font-medium mb-2">Eligible Coverage</h3>
          {hasMM ? (
            <ul className="list-disc ml-5 text-sm leading-6">
              {mmLabels.map((x) => (<li key={x}>{x}</li>))}
            </ul>
          ) : (
            <p className="text-sm">Major Medical not available based on the answers provided.</p>
          )}

          {otherList.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-1">Other Eligible Options</div>
              <ul className="list-disc ml-5 text-sm leading-6">
                {otherList.map((x) => (<li key={x}>{x}</li>))}
              </ul>
            </div>
          )}
        </section>

        {recommendations.recs.length > 0 && (
          <section className="mt-6">
            <h3 className="font-medium mb-2">Suggested Fit</h3>
            <ul className="list-disc ml-5 text-sm leading-6">
              {recommendations.recs.map((x) => (<li key={x}>{x}</li>))}
            </ul>
          </section>
        )}

        {recommendations.addNonMM.length > 0 && (
          <section className="mt-4">
            <div className="text-xs text-gray-600">
              Consider these alongside Major Medical where applicable.
            </div>
          </section>
        )}

        <div className="mt-6 text-xs text-gray-500">
          This tool summarizes potential eligibility and is not a final offer of coverage. Actual eligibility depends on full underwriting review and policy terms.
        </div>
      </CardContent>
    </Card>
  );
}

function InfoTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
      <div className="text-sm mt-1 font-medium">{value}</div>
    </div>
  );
}
