"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  FileText,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";

function cx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface EvaluationData {
  evaluation_metadata: {
    horse_id: string;
    horse_name: string;
    evaluated_at: string;
    age_years: number;
  };
  risk_appetite: {
    status: "ELIGIBLE" | "INELIGIBLE" | "UW_SUBMIT";
    category: string;
    reason: string;
    underwriting_notes: string | null;
  };
  coverage_eligibility: {
    value_assessment: {
      insured_value: number;
      qualifies_for_major_medical: boolean;
      qualifies_for_classic_without_coinsurance: boolean;
      notes: string;
    };
    eligible_coverages: {
      classic_major_medical: {
        eligible: boolean;
        coinsurance_required: boolean;
        notes: string;
      };
      basic_major_medical: {
        eligible: boolean;
        limit: number | null;
        notes: string;
      };
      special_major_medical: {
        eligible: boolean;
        notes: string;
      };
      medical_assistance: {
        eligible: boolean;
        notes: string;
      };
      external_accident_mm: {
        eligible: boolean;
      };
      surgical: {
        eligible: boolean;
      };
      colic: {
        eligible: boolean;
      };
    };
    recommendations: Array<{
      coverage_type: string;
      priority: "primary" | "secondary" | "alternative";
      reason: string;
    }>;
  };
  next_steps: string[];
  warnings: string[];
}

export default function EligibilityParser() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<EvaluationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleParse() {
    setError(null);
    setParsed(null);
    
    try {
      const data = JSON.parse(input);
      setParsed(data);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  }

  function handleClear() {
    setInput("");
    setParsed(null);
    setError(null);
  }

  function handleCopySummary() {
    if (!parsed) return;
    
    const summary = `
ELIGIBILITY SUMMARY - ${parsed.evaluation_metadata.horse_name}

Horse Details:
- Name: ${parsed.evaluation_metadata.horse_name}
- Age: ${parsed.evaluation_metadata.age_years} years
- Value: $${parsed.coverage_eligibility.value_assessment.insured_value.toLocaleString()}
- Category: ${parsed.risk_appetite.category.toUpperCase()}

Risk Appetite: ${parsed.risk_appetite.status}
${parsed.risk_appetite.reason}

Eligible Coverages:
${Object.entries(parsed.coverage_eligibility.eligible_coverages)
  .filter(([_, v]) => typeof v === 'object' ? v.eligible : v)
  .map(([k, _]) => `- ${formatCoverageName(k)}`)
  .join('\n')}

Recommendations:
${parsed.coverage_eligibility.recommendations.map(r => `- [${r.priority.toUpperCase()}] ${r.coverage_type}: ${r.reason}`).join('\n')}

Next Steps:
${parsed.next_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Eligibility Response Parser</h1>
        <p className="text-sm text-muted-foreground">
          Paste the JSON response from the eligibility evaluation agent to view a formatted summary.
        </p>
      </header>

      {/* Input Section */}
      {!parsed && (
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                JSON Response
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Paste JSON response here, e.g.:&#10;{&#10;  "evaluation_metadata": { ... },&#10;  "risk_appetite": { ... },&#10;  ...&#10;}'
                className="w-full h-64 p-4 rounded-md border font-mono text-sm focus:outline-none focus:ring-2"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Parse Error</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleParse} disabled={!input.trim()}>
                Parse & View
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsed Results */}
      {parsed && (
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Evaluation Results</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopySummary}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Summary
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" /> New Evaluation
              </Button>
            </div>
          </div>

          {/* Horse Info Card */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Horse Information</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <InfoTile label="Horse Name" value={parsed.evaluation_metadata.horse_name} />
                <InfoTile label="Age" value={`${parsed.evaluation_metadata.age_years} years`} />
                <InfoTile 
                  label="Insured Value" 
                  value={`$${parsed.coverage_eligibility.value_assessment.insured_value.toLocaleString()}`} 
                />
                <InfoTile 
                  label="Category" 
                  value={parsed.risk_appetite.category.toUpperCase()} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Risk Appetite Status */}
          <Card className={cx(
            "shadow-md border-2",
            parsed.risk_appetite.status === "ELIGIBLE" && "border-green-200 bg-green-50",
            parsed.risk_appetite.status === "INELIGIBLE" && "border-red-200 bg-red-50",
            parsed.risk_appetite.status === "UW_SUBMIT" && "border-blue-200 bg-blue-50"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {parsed.risk_appetite.status === "ELIGIBLE" && (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                {parsed.risk_appetite.status === "INELIGIBLE" && (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                {parsed.risk_appetite.status === "UW_SUBMIT" && (
                  <AlertTriangle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    Risk Appetite: {parsed.risk_appetite.status.replace("_", " ")}
                  </h3>
                  <p className="text-sm">{parsed.risk_appetite.reason}</p>
                  {parsed.risk_appetite.underwriting_notes && (
                    <p className="text-sm mt-2 font-medium">
                      UW Notes: {parsed.risk_appetite.underwriting_notes}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value Assessment */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Value Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  {parsed.coverage_eligibility.value_assessment.qualifies_for_major_medical ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium">Major Medical Qualification</div>
                    <div className="text-sm text-gray-600">
                      {parsed.coverage_eligibility.value_assessment.qualifies_for_major_medical 
                        ? "Qualifies for Major Medical coverage" 
                        : "Does not qualify for Major Medical coverage"}
                    </div>
                  </div>
                </div>
                {parsed.coverage_eligibility.value_assessment.qualifies_for_classic_without_coinsurance && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Classic Without Coinsurance</div>
                      <div className="text-sm text-gray-600">
                        Eligible for Classic Major Medical without coinsurance ($100k+)
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  <Info className="h-4 w-4 inline mr-2" />
                  {parsed.coverage_eligibility.value_assessment.notes}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligible Coverages */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Eligible Coverages</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <CoverageItem
                  name="Classic Major Medical"
                  eligible={parsed.coverage_eligibility.eligible_coverages.classic_major_medical.eligible}
                  notes={parsed.coverage_eligibility.eligible_coverages.classic_major_medical.notes}
                  extra={
                    parsed.coverage_eligibility.eligible_coverages.classic_major_medical.coinsurance_required
                      ? "Coinsurance required"
                      : parsed.coverage_eligibility.eligible_coverages.classic_major_medical.eligible
                      ? "No coinsurance required"
                      : undefined
                  }
                />
                <CoverageItem
                  name="Basic Major Medical"
                  eligible={parsed.coverage_eligibility.eligible_coverages.basic_major_medical.eligible}
                  notes={parsed.coverage_eligibility.eligible_coverages.basic_major_medical.notes}
                  extra={
                    parsed.coverage_eligibility.eligible_coverages.basic_major_medical.limit
                      ? `Limit: $${parsed.coverage_eligibility.eligible_coverages.basic_major_medical.limit.toLocaleString()}`
                      : undefined
                  }
                />
                <CoverageItem
                  name="Special Major Medical"
                  eligible={parsed.coverage_eligibility.eligible_coverages.special_major_medical.eligible}
                  notes={parsed.coverage_eligibility.eligible_coverages.special_major_medical.notes}
                />
                <CoverageItem
                  name="Medical Assistance"
                  eligible={parsed.coverage_eligibility.eligible_coverages.medical_assistance.eligible}
                  notes={parsed.coverage_eligibility.eligible_coverages.medical_assistance.notes}
                />
                <CoverageItem
                  name="External Accident MM"
                  eligible={parsed.coverage_eligibility.eligible_coverages.external_accident_mm.eligible}
                />
                <CoverageItem
                  name="Surgical"
                  eligible={parsed.coverage_eligibility.eligible_coverages.surgical.eligible}
                />
                <CoverageItem
                  name="Colic"
                  eligible={parsed.coverage_eligibility.eligible_coverages.colic.eligible}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {parsed.coverage_eligibility.recommendations.length > 0 && (
            <Card className="shadow-sm border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Coverage Recommendations</h3>
                <div className="space-y-3">
                  {parsed.coverage_eligibility.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                      <div className={cx(
                        "px-2 py-1 rounded text-xs font-medium",
                        rec.priority === "primary" && "bg-blue-600 text-white",
                        rec.priority === "secondary" && "bg-blue-400 text-white",
                        rec.priority === "alternative" && "bg-gray-400 text-white"
                      )}>
                        {rec.priority.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{rec.coverage_type}</div>
                        <div className="text-sm text-gray-600">{rec.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps & Warnings */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Next Steps */}
            {parsed.next_steps.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {parsed.next_steps.map((step, idx) => (
                      <li key={idx} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {parsed.warnings.length > 0 && (
              <Card className="shadow-sm border-amber-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Warnings
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {parsed.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span className="text-gray-700">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function CoverageItem({ 
  name, 
  eligible, 
  notes, 
  extra 
}: { 
  name: string; 
  eligible: boolean; 
  notes?: string;
  extra?: string;
}) {
  return (
    <div className={cx(
      "p-3 rounded-lg border-2",
      eligible ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
    )}>
      <div className="flex items-start gap-2">
        {eligible ? (
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className={cx(
            "font-medium text-sm",
            eligible ? "text-green-900" : "text-gray-500"
          )}>
            {name}
          </div>
          {extra && (
            <div className="text-xs text-gray-600 mt-0.5">{extra}</div>
          )}
          {notes && (
            <div className="text-xs text-gray-600 mt-1">{notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCoverageName(key: string): string {
  return key
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

