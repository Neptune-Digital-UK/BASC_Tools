"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
} from "@/components/ui/combobox";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Loader2,
  Send,
  RefreshCw,
  Copy,
  Check,
  Code,
  X,
  Mail
} from "lucide-react";
import ToolNavigation from "@/components/ToolNavigation";

function cx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Breed options based on eligibility rules
const BREED_OPTIONS = [
  { value: "", label: "Select Breed..." },
  { value: "Andalusian", label: "Andalusian" },
  { value: "Appaloosa", label: "Appaloosa" },
  { value: "Arabian", label: "Arabian" },
  { value: "Arabian Cross", label: "Arabian Cross" },
  { value: "Belgian Warmblood", label: "Belgian Warmblood" },
  { value: "Clydesdale", label: "Clydesdale" },
  { value: "Cross", label: "Cross" },
  { value: "Draft Horse", label: "Draft Horse" },
  { value: "Dutch Warmblood", label: "Dutch Warmblood" },
  { value: "Fox Trotter", label: "Fox Trotter" },
  { value: "Friesian", label: "Friesian" },
  { value: "Gypsy Vanner", label: "Gypsy Vanner" },
  { value: "Hackney", label: "Hackney" },
  { value: "Haflinger", label: "Haflinger" },
  { value: "Hanoverian", label: "Hanoverian" },
  { value: "Holsteiner", label: "Holsteiner" },
  { value: "Icelandic", label: "Icelandic" },
  { value: "Irish Sport Horse", label: "Irish Sport Horse" },
  { value: "Lipizzaner", label: "Lipizzaner" },
  { value: "Lusitano", label: "Lusitano" },
  { value: "Miniature", label: "Miniature" },
  { value: "Mixed Breed", label: "Mixed Breed" },
  { value: "Morgan", label: "Morgan" },
  { value: "Mustang", label: "Mustang" },
  { value: "National Show Horse", label: "National Show Horse" },
  { value: "Oldenburg", label: "Oldenburg" },
  { value: "Paint", label: "Paint" },
  { value: "Paso Fino", label: "Paso Fino" },
  { value: "Percheron", label: "Percheron" },
  { value: "Pinto", label: "Pinto" },
  { value: "Pony", label: "Pony" },
  { value: "Pure Spanish Horse", label: "Pure Spanish Horse" },
  { value: "Quarter Horse", label: "Quarter Horse" },
  { value: "Quarter Horse Cross", label: "Quarter Horse Cross" },
  { value: "Quarter Horse/Paint", label: "Quarter Horse/Paint" },
  { value: "Rocky Mountain Horse", label: "Rocky Mountain Horse" },
  { value: "Saddlebred", label: "Saddlebred" },
  { value: "Selle Français", label: "Selle Français" },
  { value: "Shetland", label: "Shetland" },
  { value: "Standardbred", label: "Standardbred" },
  { value: "Tennessee Walking Horse", label: "Tennessee Walking Horse" },
  { value: "Thoroughbred", label: "Thoroughbred" },
  { value: "Thoroughbred Cross", label: "Thoroughbred Cross" },
  { value: "Warmblood", label: "Warmblood" },
  { value: "Welsh", label: "Welsh" },
];

// Use/Activity options
const USE_OPTIONS = [
  { value: "", label: "Select Use/Activity..." },
  { value: "All Around", label: "All Around" },
  { value: "Barrel Racing", label: "Barrel Racing" },
  { value: "Cutting", label: "Cutting" },
  { value: "Dressage", label: "Dressage" },
  { value: "Trail Riding", label: "Trail Riding" },
  { value: "Roping", label: "Roping" },
  { value: "Hunter", label: "Hunter" },
  { value: "Jumper", label: "Jumper" },
  { value: "Breeding", label: "Breeding" },
  { value: "Bucking", label: "Bucking" },
  { value: "Driving", label: "Driving" },
  { value: "Eventing", label: "Eventing" },
  { value: "Foxhunting", label: "Foxhunting" },
  { value: "Performance", label: "Performance" },
  { value: "Polo", label: "Polo" },
  { value: "Prospective Foal", label: "Prospective Foal" },
  { value: "Pulling", label: "Pulling" },
  { value: "Racing", label: "Racing" },
  { value: "Ranch", label: "Ranch" },
  { value: "Ranch Versatility", label: "Ranch Versatility" },
  { value: "Rearing", label: "Rearing" },
  { value: "Reining", label: "Reining" },
  { value: "Rodeo", label: "Rodeo" },
  { value: "Retired", label: "Retired" },
  { value: "Showing", label: "Showing" },
  { value: "Spanish Dancing", label: "Spanish Dancing" },
  { value: "Steer Wrestling", label: "Steer Wrestling" },
  { value: "Western Pleasure (Competitively)", label: "Western Pleasure (Competitively)" },
  { value: "Yearling (Non Racing)", label: "Yearling (Non Racing)" },
  { value: "Yearling (Racing)", label: "Yearling (Racing)" },
  { value: "Other", label: "Other" },
];

// Sex options
const SEX_OPTIONS = [
  { value: "", label: "Select Sex..." },
  { value: "Colt", label: "Colt" },
  { value: "Stallion", label: "Stallion" },
  { value: "Gelding", label: "Gelding" },
  { value: "Filly", label: "Filly" },
  { value: "Mare", label: "Mare" },
];

interface FormData {
  horseName: string;
  age: string;
  breed: string;
  use: string;
  sex: string;
  purchasePrice: string;
  sumInsured: string;
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

export default function EligibilityEvaluator() {
  const [formData, setFormData] = useState<FormData>({
    horseName: "",
    age: "",
    breed: "",
    use: "",
    sex: "",
    purchasePrice: "",
    sumInsured: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationData | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugData, setDebugData] = useState<{
    request: any;
    response: any;
    responseTime: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);
  
  const searchParams = useSearchParams();
  const autoSubmitTriggered = useRef(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate progress while loading
  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; // Stop at 90% until actual completion
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  // Parse URL parameters and auto-submit (no validation)
  useEffect(() => {
    if (urlParamsProcessed || autoSubmitTriggered.current) return;

    const urlData = parseURLParams();
    if (!urlData) {
      setUrlParamsProcessed(true);
      return;
    }

    // Pre-fill form with URL data
    setFormData(urlData);

    // Auto-trigger evaluation without validation
    setUrlParamsProcessed(true);
    autoSubmitTriggered.current = true;
    
    // Trigger submission after state updates
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }, 100);
  }, [searchParams, urlParamsProcessed]);

  function formatCurrency(value: string): string {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Return empty string if no numeric value
    if (!numericValue || numericValue === '.') {
      return '';
    }
    
    // Split into integer and decimal parts
    const parts = numericValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Add thousand separators to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Reconstruct the value
    let formatted = formattedInteger;
    if (decimalPart !== undefined) {
      formatted += '.' + decimalPart.slice(0, 2); // Limit to 2 decimal places
    }
    
    return '$' + formatted;
  }

  function handleInputChange(field: keyof FormData, value: string) {
    // Format currency fields
    if (field === 'purchasePrice' || field === 'sumInsured') {
      const formatted = formatCurrency(value);
      setFormData((prev) => ({ ...prev, [field]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }

  function isFormValid(): boolean {
    return !!(
      formData.horseName &&
      formData.age &&
      formData.breed &&
      formData.use &&
      formData.sex &&
      formData.sumInsured
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    setLoadingMessage("Preparing evaluation request...");

    console.group("🤖 AI Eligibility Evaluation");
    console.log("📝 Form Data:", formData);

    try {
      // Calculate birth year from age
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - parseInt(formData.age);

      // Format the input JSON for the AI agent
      const horseData = {
        HorseActivity: formData.use,
        HorseBirthyear: birthYear,
        HorseBreed: formData.breed,
        HorseID: crypto.randomUUID(),
        HorseName: formData.horseName,
        HorseNumber: 1,
        HorseSex: formData.sex,
        HorseSumInsured: parseFloat(formData.sumInsured.replace(/[^0-9.]/g, "")),
        HorseValue: parseFloat(formData.sumInsured.replace(/[^0-9.]/g, "")),
      };

      console.log("📦 Formatted Horse Data (to be sent to AI):", JSON.stringify(horseData, null, 2));

      // Prepare API request payload
      const requestPayload = {
        messages: [
          {
            content: `Please evaluate the following horse eligibility data and respond with ONLY valid JSON (no trailing commas, no markdown, no explanation text - just the raw JSON object):

${JSON.stringify(horseData, null, 2)}

Respond with valid JSON only.`,
            role: "user",
          },
        ],
        chatbotId: "wVBzSogkMNl7a3jA_QwUu",
      };

      console.log("📤 API Request Payload:", JSON.stringify(requestPayload, null, 2));
      console.log("🌐 API Endpoint:", "https://www.chatbase.co/api/v1/chat");
      console.log("🔑 Using Authorization: Bearer 2ab89480-****-****-****-************");

      setLoadingMessage("Contacting AI agent...");
      
      // Call Chatbase API
      const startTime = performance.now();
      const response = await fetch("https://www.chatbase.co/api/v1/chat", {
        method: "POST",
        headers: {
          Authorization: "Bearer 2ab89480-00e4-46cc-9e5c-051b28980905",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });
      const endTime = performance.now();
      
      setLoadingMessage("AI analyzing eligibility criteria...");

      console.log(`⏱️  API Response Time: ${(endTime - startTime).toFixed(2)}ms`);
      console.log("📥 API Response Status:", response.status, response.statusText);
      console.log("📋 Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response Body:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📥 Raw API Response Data:", JSON.stringify(data, null, 2));
      
      setLoadingMessage("Processing evaluation results...");
      
      // Extract the content from the response
      let evaluationResult;
      if (data.text) {
        console.log("📄 AI Response Text (before cleaning):", data.text);
        
        // Try to parse the text as JSON
        try {
          // Remove markdown code blocks if present
          let cleanedText = data.text;
          if (cleanedText.includes("```json")) {
            console.log("🧹 Removing ```json markdown blocks...");
            cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
          } else if (cleanedText.includes("```")) {
            console.log("🧹 Removing ``` markdown blocks...");
            cleanedText = cleanedText.replace(/```\n?/g, "");
          }
          
          // Try to find JSON in the text if it contains other content
          const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            console.log("🔍 Found JSON object in response, extracting...");
            cleanedText = jsonMatch[0];
          }
          
          // Remove trailing commas before closing braces/brackets (invalid JSON)
          console.log("🧹 Removing trailing commas...");
          cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
          
          // Check if the text is a JSON string (wrapped in quotes with escaped content)
          if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
            console.log("🧹 Detected JSON string, parsing twice...");
            cleanedText = JSON.parse(cleanedText); // First parse to get the actual JSON string
          }
          
          console.log("📄 Cleaned Text (ready to parse):", cleanedText);
          evaluationResult = JSON.parse(cleanedText.trim());
          console.log("✅ Successfully Parsed Evaluation Result:", JSON.stringify(evaluationResult, null, 2));
        } catch (parseError) {
          console.error("❌ Parse Error:", parseError);
          console.error("❌ Failed to parse text:", data.text);
          console.error("❌ Text length:", data.text.length);
          console.error("❌ First 500 characters:", data.text.substring(0, 500));
          
          // Show a more helpful error message with preview
          const preview = data.text.length > 200 ? data.text.substring(0, 200) + "..." : data.text;
          throw new Error(
            `Failed to parse AI response as JSON. The AI returned:\n\n"${preview}"\n\nCheck the console for the full response.`
          );
        }
      } else {
        console.error("❌ Unexpected response format - no 'text' field found");
        console.error("❌ Available fields:", Object.keys(data));
        throw new Error("Unexpected API response format");
      }

      console.log("🎉 Evaluation Complete!");
      console.groupEnd();
      
      // Complete the progress bar
      setProgress(100);
      
      // Store debug data for modal
      setDebugData({
        request: requestPayload,
        response: data,
        responseTime: endTime - startTime,
      });
      
      // Small delay to show 100% completion before closing modal
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store the submitted form data alongside the result
      setSubmittedFormData(formData);
      setResult(evaluationResult);
    } catch (err) {
      console.error("❌ Submission Error:", err);
      console.groupEnd();
      setError((err as Error).message || "An error occurred while evaluating eligibility");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFormData({
      horseName: "",
      age: "",
      breed: "",
      use: "",
      sex: "",
      purchasePrice: "",
      sumInsured: "",
    });
    setResult(null);
    setSubmittedFormData(null);
    setError(null);
    setDebugData(null);
  }

  function handleCopySummary() {
    if (!result) return;
    
    const summary = `
ELIGIBILITY SUMMARY - ${result.evaluation_metadata.horse_name}

Horse Details:
- Name: ${result.evaluation_metadata.horse_name}
- Age: ${result.evaluation_metadata.age_years} years${submittedFormData ? `
- Breed: ${submittedFormData.breed}
- Sex: ${submittedFormData.sex}
- Activity: ${submittedFormData.use}` : ''}
- Value: $${result.coverage_eligibility.value_assessment.insured_value.toLocaleString()}
- Category: ${result.risk_appetite.category.toUpperCase()}

Risk Appetite: ${result.risk_appetite.status}
${result.risk_appetite.reason}

Eligible Coverages:
${Object.entries(result.coverage_eligibility.eligible_coverages)
  .filter(([_, v]) => typeof v === 'object' ? v.eligible : v)
  .map(([k, _]) => `- ${formatCoverageName(k)}`)
  .join('\n')}

Recommendations:
${result.coverage_eligibility.recommendations.map(r => `- [${r.priority.toUpperCase()}] ${r.coverage_type}: ${r.reason}`).join('\n')}

Next Steps:
${result.next_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleEmailResults() {
    if (!result) return;
    
    const emailBody = `
HORSE ELIGIBILITY EVALUATION

Horse Details:
- Name: ${result.evaluation_metadata.horse_name}
- Age: ${result.evaluation_metadata.age_years} years${submittedFormData ? `
- Breed: ${submittedFormData.breed}
- Sex: ${submittedFormData.sex}
- Activity: ${submittedFormData.use}` : ''}
- Insured Value: $${result.coverage_eligibility.value_assessment.insured_value.toLocaleString()}
- Category: ${result.risk_appetite.category.toUpperCase()}

Eligible Coverages:
${Object.entries(result.coverage_eligibility.eligible_coverages)
  .filter(([_, v]) => typeof v === 'object' ? v.eligible : v)
  .map(([k, v]) => {
    const name = formatCoverageName(k);
    let details = `- ${name}`;
    if (typeof v === 'object' && 'notes' in v && v.notes) {
      details += `\n  ${v.notes}`;
    }
    if (k === 'classic_major_medical' && typeof v === 'object' && 'coinsurance_required' in v) {
      details += v.coinsurance_required ? '\n  (Coinsurance required)' : '\n  (No coinsurance required)';
    }
    if (k === 'basic_major_medical' && typeof v === 'object' && 'limit' in v && v.limit) {
      details += `\n  (Limit: $${v.limit.toLocaleString()})`;
    }
    return details;
  })
  .join('\n')}
`.trim();

    const subject = `Eligibility Evaluation - ${result.evaluation_metadata.horse_name}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  }

  function parseURLParams(): FormData | null {
    // Check if any URL parameters are present
    const hasParams = Array.from(searchParams.keys()).length > 0;
    if (!hasParams) return null;

    // Parse parameters from URL
    const horseName = searchParams.get('horseName') || '';
    const age = searchParams.get('age') || '';
    const sex = searchParams.get('sex') || '';
    const breed = searchParams.get('breed') || '';
    const use = searchParams.get('use') || '';
    const purchasePrice = searchParams.get('purchasePrice') || '';
    const sumInsured = searchParams.get('sumInsured') || '';

    // Format currency fields if they have values
    const formattedPurchasePrice = purchasePrice ? formatCurrency(purchasePrice) : '';
    const formattedSumInsured = sumInsured ? formatCurrency(sumInsured) : '';

    return {
      horseName,
      age,
      sex,
      breed,
      use,
      purchasePrice: formattedPurchasePrice,
      sumInsured: formattedSumInsured,
    };
  }

  return (
    <>
      <Script
        id="chatbase-embed"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="wVBzSogkMNl7a3jA_QwUu";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
          `,
        }}
      />
      <ToolNavigation toolName="Eligibility Evaluator" />
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold">Eligibility Evaluator</h1>
          <p className="text-sm text-muted-foreground">
            Enter horse details to get an instant AI-powered eligibility evaluation for insurance coverage.
          </p>
        </header>

        {/* Loading Modal - Drawer on mobile, Dialog on desktop */}
        {isMobile ? (
          <Drawer open={loading} onOpenChange={() => {}} dismissible={false}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2 justify-center">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  AI Evaluation in Progress
                </DrawerTitle>
                <DrawerDescription className="text-center">
                  Analyzing {formData.horseName}&apos;s eligibility...
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="space-y-4 px-4 pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{loadingMessage}</span>
                    <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium text-gray-900 mb-1">What&apos;s happening:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Validating horse details and coverage rules</li>
                        <li>• Checking breed and activity eligibility</li>
                        <li>• Calculating value-based coverage options</li>
                        <li>• Generating personalized recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-center text-gray-500">
                  This typically takes 10-30 seconds. Please wait...
                </p>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={loading} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  AI Evaluation in Progress
                </DialogTitle>
                <DialogDescription>
                  Analyzing {formData.horseName}&apos;s eligibility...
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{loadingMessage}</span>
                    <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium text-gray-900 mb-1">What&apos;s happening:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Validating horse details and coverage rules</li>
                        <li>• Checking breed and activity eligibility</li>
                        <li>• Calculating value-based coverage options</li>
                        <li>• Generating personalized recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-center text-gray-500">
                  This typically takes 10-30 seconds. Please wait...
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}

      {!result && (
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Horse Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Horse Name *</label>
                <Input
                  type="text"
                  value={formData.horseName}
                  onChange={(e) => handleInputChange("horseName", e.target.value)}
                  placeholder="e.g., Snowballs"
                  required
                />
              </div>

              {/* Age & Sex Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age (years) *</label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="e.g., 8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sex *</label>
                  <Combobox
                    data={SEX_OPTIONS}
                    type="sex"
                    value={formData.sex}
                    onValueChange={(value) => handleInputChange("sex", value)}
                  >
                    <ComboboxTrigger />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          {SEX_OPTIONS.filter((opt) => opt.value).map((opt) => (
                            <ComboboxItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              {/* Breed & Use Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Breed *</label>
                  <Combobox
                    data={BREED_OPTIONS}
                    type="breed"
                    value={formData.breed}
                    onValueChange={(value) => handleInputChange("breed", value)}
                  >
                    <ComboboxTrigger />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          {BREED_OPTIONS.filter((opt) => opt.value).map((opt) => (
                            <ComboboxItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Use/Activity *</label>
                  <Combobox
                    data={USE_OPTIONS}
                    type="use"
                    value={formData.use}
                    onValueChange={(value) => handleInputChange("use", value)}
                  >
                    <ComboboxTrigger />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          {USE_OPTIONS.filter((opt) => opt.value).map((opt) => (
                            <ComboboxItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              {/* Purchase Price & Sum Insured Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purchase Price</label>
                  <Input
                    type="text"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                    placeholder="$50,000"
                  />
                  <p className="text-xs text-gray-500">Optional - for reference only</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sum Insured *</label>
                  <Input
                    type="text"
                    value={formData.sumInsured}
                    onChange={(e) => handleInputChange("sumInsured", e.target.value)}
                    placeholder="$50,000"
                    required
                  />
                  <p className="text-xs text-gray-500">The amount to insure the horse for</p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">Error</div>
                    <div className="whitespace-pre-wrap break-words">{error}</div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className="gap-2 w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Evaluate Eligibility
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">Evaluation Results</h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopySummary}
                className="gap-1.5 flex-1 sm:flex-initial"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> <span className="hidden xs:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> <span className="hidden xs:inline">Copy</span>
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEmailResults}
                className="gap-1.5 flex-1 sm:flex-initial"
              >
                <Mail className="h-4 w-4" /> <span className="hidden xs:inline">Email</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="gap-1.5 flex-1 sm:flex-initial"
              >
                <RefreshCw className="h-4 w-4" /> <span className="hidden xs:inline">New</span>
              </Button>
            </div>
          </div>

          {/* Horse Info Card */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Horse Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <InfoTile label="Horse Name" value={result.evaluation_metadata.horse_name} />
                <InfoTile label="Age" value={`${result.evaluation_metadata.age_years} years`} />
                {submittedFormData && (
                  <>
                    <InfoTile label="Breed" value={submittedFormData.breed} />
                    <InfoTile label="Sex" value={submittedFormData.sex} />
                    <InfoTile label="Activity" value={submittedFormData.use} />
                  </>
                )}
                <InfoTile 
                  label="Insured Value" 
                  value={`$${result.coverage_eligibility.value_assessment.insured_value.toLocaleString()}`} 
                />
                <InfoTile 
                  label="Category" 
                  value={result.risk_appetite.category.toUpperCase()} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Risk Appetite Status */}
          <Card className={cx(
            "shadow-md border-2",
            result.risk_appetite.status === "ELIGIBLE" && "border-green-200 bg-green-50",
            result.risk_appetite.status === "INELIGIBLE" && "border-red-200 bg-red-50",
            result.risk_appetite.status === "UW_SUBMIT" && "border-blue-200 bg-blue-50"
          )}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                {result.risk_appetite.status === "ELIGIBLE" && (
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                {result.risk_appetite.status === "INELIGIBLE" && (
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                {result.risk_appetite.status === "UW_SUBMIT" && (
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-semibold mb-2">
                    Risk Appetite: {result.risk_appetite.status.replace("_", " ")}
                  </h3>
                  <p className="text-sm">{result.risk_appetite.reason}</p>
                  {result.risk_appetite.underwriting_notes && (
                    <p className="text-sm mt-2 font-medium">
                      UW Notes: {result.risk_appetite.underwriting_notes}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value Assessment */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3">Value Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  {result.coverage_eligibility.value_assessment.qualifies_for_major_medical ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium">Major Medical Qualification</div>
                    <div className="text-sm text-gray-600">
                      {result.coverage_eligibility.value_assessment.qualifies_for_major_medical 
                        ? "Qualifies for Major Medical coverage" 
                        : "Does not qualify for Major Medical coverage"}
                    </div>
                  </div>
                </div>
                {result.coverage_eligibility.value_assessment.qualifies_for_classic_without_coinsurance && (
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
                  {result.coverage_eligibility.value_assessment.notes}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligible Coverages */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Eligible Coverages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CoverageItem
                  name="Classic Major Medical"
                  eligible={result.coverage_eligibility.eligible_coverages.classic_major_medical.eligible}
                  notes={result.coverage_eligibility.eligible_coverages.classic_major_medical.notes}
                  extra={
                    result.coverage_eligibility.eligible_coverages.classic_major_medical.coinsurance_required
                      ? "Coinsurance required"
                      : result.coverage_eligibility.eligible_coverages.classic_major_medical.eligible
                      ? "No coinsurance required"
                      : undefined
                  }
                />
                <CoverageItem
                  name="Basic Major Medical"
                  eligible={result.coverage_eligibility.eligible_coverages.basic_major_medical.eligible}
                  notes={result.coverage_eligibility.eligible_coverages.basic_major_medical.notes}
                  extra={
                    result.coverage_eligibility.eligible_coverages.basic_major_medical.limit
                      ? `Limit: $${result.coverage_eligibility.eligible_coverages.basic_major_medical.limit.toLocaleString()}`
                      : undefined
                  }
                />
                <CoverageItem
                  name="Special Major Medical"
                  eligible={result.coverage_eligibility.eligible_coverages.special_major_medical.eligible}
                  notes={result.coverage_eligibility.eligible_coverages.special_major_medical.notes}
                />
                <CoverageItem
                  name="Medical Assistance"
                  eligible={result.coverage_eligibility.eligible_coverages.medical_assistance.eligible}
                  notes={result.coverage_eligibility.eligible_coverages.medical_assistance.notes}
                />
                <CoverageItem
                  name="External Accident MM"
                  eligible={result.coverage_eligibility.eligible_coverages.external_accident_mm.eligible}
                />
                <CoverageItem
                  name="Surgical"
                  eligible={result.coverage_eligibility.eligible_coverages.surgical.eligible}
                />
                <CoverageItem
                  name="Colic"
                  eligible={result.coverage_eligibility.eligible_coverages.colic.eligible}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {result.coverage_eligibility.recommendations.length > 0 && (
            <Card className="shadow-sm border-2 border-blue-200">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Coverage Recommendations</h3>
                <div className="space-y-3">
                  {result.coverage_eligibility.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3 p-3 bg-blue-50 rounded-md">
                      <div className={cx(
                        "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
                        rec.priority === "primary" && "bg-blue-600 text-white",
                        rec.priority === "secondary" && "bg-blue-400 text-white",
                        rec.priority === "alternative" && "bg-gray-400 text-white"
                      )}>
                        {rec.priority.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base">{rec.coverage_type}</div>
                        <div className="text-sm text-gray-600">{rec.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps & Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Next Steps */}
            {result.next_steps.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Next Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {result.next_steps.map((step, idx) => (
                      <li key={idx} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <Card className="shadow-sm border-amber-200">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Warnings
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {result.warnings.map((warning, idx) => (
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

        {/* Debug Modal */}
        {showDebugModal && debugData && (
          <DebugModal
            debugData={debugData}
            onClose={() => setShowDebugModal(false)}
          />
        )}
      </div>
    </>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="font-semibold text-sm sm:text-base break-words">{value}</div>
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

function DebugModal({
  debugData,
  onClose,
}: {
  debugData: { request: any; response: any; responseTime: number };
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");
  const [copiedRequest, setCopiedRequest] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  function copyRequest() {
    navigator.clipboard.writeText(JSON.stringify(debugData.request, null, 2));
    setCopiedRequest(true);
    setTimeout(() => setCopiedRequest(false), 2000);
  }

  function copyResponse() {
    navigator.clipboard.writeText(JSON.stringify(debugData.response, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Code className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">API Request & Response</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Response Time: {debugData.responseTime.toFixed(2)}ms
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("request")}
            className={cx(
              "px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition flex-1 sm:flex-initial",
              activeTab === "request"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <span className="hidden sm:inline">📤 Request Payload</span>
            <span className="sm:hidden">📤 Request</span>
          </button>
          <button
            onClick={() => setActiveTab("response")}
            className={cx(
              "px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition flex-1 sm:flex-initial",
              activeTab === "response"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <span className="hidden sm:inline">📥 API Response</span>
            <span className="sm:hidden">📥 Response</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          {activeTab === "request" && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-xs sm:text-sm text-gray-600 min-w-0">
                  <div className="truncate"><strong>Endpoint:</strong> https://www.chatbase.co/api/v1/chat</div>
                  <div><strong>Method:</strong> POST</div>
                  <div><strong>Content-Type:</strong> application/json</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyRequest}
                  className="gap-2 w-full sm:w-auto flex-shrink-0"
                >
                  {copiedRequest ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-auto text-xs font-mono">
                {JSON.stringify(debugData.request, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === "response" && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-xs sm:text-sm text-gray-600">
                  <div><strong>Status:</strong> 200 OK</div>
                  <div><strong>Response Time:</strong> {debugData.responseTime.toFixed(2)}ms</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyResponse}
                  className="gap-2 w-full sm:w-auto flex-shrink-0"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-auto text-xs font-mono">
                {JSON.stringify(debugData.response, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-3 sm:p-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

