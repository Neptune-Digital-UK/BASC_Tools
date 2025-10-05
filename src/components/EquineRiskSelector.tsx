"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertTriangle, Info, Mail } from "lucide-react";

/**
 * Equine Appetite Guide — interactive agent tool
 * Built from Bascule Mortality Appetite guidance and training themes.
 *
 * Notes for editors:
 * - Update the DATA object as appetite evolves.
 * - Results show: Eligible / Ineligible / Submit for UW Approval / Conditional.
 * - Includes quick mailto link to underwriting and a printable summary.
 */

// ---------- Appetite Data (edit here) ----------
interface Rule {
  label: string;
  status: string;
  note?: string;
}

const DATA: Array<{
  category: string;
  notes?: string;
  rules: Rule[];
}> = [
  {
    category: "Western",
    notes: "Performance uses should be specified.",
    rules: [
      { label: "Cutting", status: "ELIGIBLE" },
      { label: "Reining", status: "ELIGIBLE" },
      { label: "Ranch Versatility", status: "ELIGIBLE" },
      { label: "Ranch", status: "ELIGIBLE" },
      { label: "Roping", status: "ELIGIBLE" },
      { label: "Steer Wrestling", status: "ELIGIBLE" },
      { label: "Trail Riding", status: "ELIGIBLE" },
      { label: "Barrel Racing", status: "ELIGIBLE" },
      { label: "Performance (specify use)", status: "ELIGIBLE" },
      { label: "Halter", status: "INELIGIBLE" },
      { label: "Western Pleasure Show (Appaloosa / QH / Paint)", status: "INELIGIBLE" },
    ],
  },
  {
    category: "Sport Horse (incl. Thoroughbred)",
    rules: [
      { label: "Hunters", status: "ELIGIBLE" },
      { label: "Jumpers", status: "ELIGIBLE" },
      { label: "Dressage", status: "ELIGIBLE" },
      { label: "Foxhunting", status: "ELIGIBLE" },
      { label: "Eventing", status: "ELIGIBLE" },
      { label: "Combined Driving", status: "ELIGIBLE" },
      { label: "Polo", status: "ELIGIBLE" },
      { label: "TB Breeding", status: "INELIGIBLE" },
      { label: "Racing (Non-QH)", status: "INELIGIBLE" },
      { label: "Bloodstock (Rearing / Yearlings)", status: "INELIGIBLE" },
    ],
  },
  {
    category: "Breed-Specific Show Horses",
    rules: [
      { label: "Saddlebred", status: "ELIGIBLE" },
      { label: "Arabian", status: "ELIGIBLE" },
      { label: "Morgan", status: "ELIGIBLE" },
      { label: "Racking Horse", status: "INELIGIBLE" },
      { label: "Paso Fino", status: "INELIGIBLE" },
      { label: "Non-flat Shod Horses", status: "INELIGIBLE" },
      { label: "Miniature Horse", status: "INELIGIBLE" },
      { label: "Donkey", status: "INELIGIBLE" },
      { label: "Mule", status: "INELIGIBLE" },
      { label: "Tennessee Walker", status: "INELIGIBLE" },
      { label: "Friesian (pleasure / breeding)", status: "INELIGIBLE", note: "USEF Dressage use may be acceptable — see Pleasure/Sport rules" },
    ],
  },
  {
    category: "Ponies",
    rules: [
      { label: "All Types", status: "ELIGIBLE" },
    ],
  },
  {
    category: "Draft Horses (Under Saddle)",
    rules: [
      { label: "Under Saddle (non-utility)", status: "UW_SUBMIT", note: "Submit for approval prior to binding; clean loss history required." },
      { label: "Utility / Pulling / Farm Work", status: "INELIGIBLE" },
      { label: "Amish Cart / Farm (Standardbred, Draft)", status: "INELIGIBLE" },
    ],
  },
  {
    category: "Breeding Horses",
    rules: [
      { label: "Broodmare (≥60 days post-foaling)", status: "ELIGIBLE" },
      { label: "Due to foal within 3 months (not currently insured)", status: "INELIGIBLE" },
    ],
  },
  {
    category: "Pleasure Horses",
    rules: [
      { label: "Show Driving", status: "ELIGIBLE" },
      { label: "Trail Riding", status: "ELIGIBLE" },
      { label: "Spanish Dancing Horses", status: "INELIGIBLE" },
      { label: "Parade Horses", status: "INELIGIBLE" },
      { label: "Friesian (USEF Dressage)", status: "ELIGIBLE", note: "Per Sport/Dressage appetite; confirm use and show level." },
    ],
  },
  {
    category: "Mounted Activities",
    rules: [
      { label: "Mounted Shooting", status: "INELIGIBLE", note: "Not eligible." },
      { label: "Mounted Patrol", status: "INELIGIBLE", note: "Not eligible." },
    ],
  },
  {
    category: "Quarter Horse Racing",
    rules: [
      { label: "Racing ≤ $50,000 value", status: "ELIGIBLE" },
      { label: "Racing > $50,000 value", status: "UW_SUBMIT", note: "Submit to UW." },
    ],
  },
];

const STATUS_META = {
  ELIGIBLE: { label: "Eligible", icon: <CheckCircle className="h-5 w-5" />, tone: "text-green-700", badge: "bg-green-100" },
  INELIGIBLE: { label: "Ineligible", icon: <AlertTriangle className="h-5 w-5" />, tone: "text-red-700", badge: "bg-red-100" },
  UW_SUBMIT: { label: "Submit to Underwriting", icon: <Info className="h-5 w-5" />, tone: "text-blue-700", badge: "bg-blue-100" },
  CONDITIONAL: { label: "Conditional", icon: <Info className="h-5 w-5" />, tone: "text-amber-700", badge: "bg-amber-100" },
};

function cx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EquineRiskSelector() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visible = useMemo(() => {
    const norm = (s: string) => s.toLowerCase();
    const q = norm(query);

    return DATA.map((cat) => ({
      ...cat,
      rules: cat.rules.filter((r) =>
        q
          ? norm(cat.category).includes(q) || norm(r.label).includes(q)
          : true
      ),
    })).filter((cat) => (activeCategory ? cat.category === activeCategory : true));
  }, [query, activeCategory]);

  const allCategories = DATA.map((d) => d.category);

  const [selection, setSelection] = useState<{category?: string; rule?: string}>(() => ({}));

  const selectedRule = useMemo(() => {
    if (!selection.category || !selection.rule) return null;
    const cat = DATA.find((d) => d.category === selection.category);
    return cat?.rules.find((r) => r.label === selection.rule) ?? null;
  }, [selection]);

  const statusMeta = selectedRule ? STATUS_META[selectedRule.status as keyof typeof STATUS_META] : null;

  const printableSummary = useMemo(() => {
    if (!selectedRule) return "";
    return `Category: ${selection.category}\nUse/Breed: ${selection.rule}\nStatus: ${STATUS_META[selectedRule.status as keyof typeof STATUS_META].label}\nNotes: ${selectedRule.note ?? "—"}`;
  }, [selectedRule, selection]);

  function copySummary() {
    navigator.clipboard.writeText(printableSummary);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Equine Appetite Guide</h1>
        <p className="text-sm text-muted-foreground">Quickly determine appetite eligibility and next steps based on breed/use and category.</p>
      </header>

      <Card className="shadow-sm">
        <CardContent className="p-4 grid md:grid-cols-3 gap-3 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter</label>
            <div className="flex gap-2">
              <Input
                placeholder="Search breed/use or category (e.g., 'Dressage', 'Draft', 'Roping')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button variant="secondary" onClick={() => setQuery("")}>Clear</Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full border rounded-md p-2"
              value={activeCategory ?? ""}
              onChange={(e) => setActiveCategory(e.target.value || null)}
            >
              <option value="">All categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Actions</label>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>Print</Button>
              <a href="mailto:underwriting@basculeuw.com?subject=Risk%20Question%20-%20Equine" className="inline-flex items-center">
                <Button variant="default" className="flex items-center gap-2"><Mail className="h-4 w-4"/> Ask UW</Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {visible.map((cat) => (
          <Card key={cat.category} className="shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{cat.category}</h2>
                {cat.notes && (
                  <span className="text-xs text-muted-foreground">{cat.notes}</span>
                )}
              </div>
              <div className="space-y-2">
                {cat.rules.map((r) => {
                  const meta = STATUS_META[r.status as keyof typeof STATUS_META];
                  const active = selection.category === cat.category && selection.rule === r.label;
                  return (
                    <button
                      key={r.label}
                      onClick={() => setSelection({ category: cat.category, rule: r.label })}
                      className={cx(
                        "w-full text-left border rounded-md p-3 hover:shadow-sm transition",
                        active ? "border-black/20" : "border-muted"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cx("inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full", meta.badge, meta.tone)}>
                            {meta.icon}
                            {meta.label}
                          </span>
                          <span className="font-medium">{r.label}</span>
                        </div>
                        {r.note && <span className="text-xs text-muted-foreground">{r.note}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selection summary */}
      {selectedRule && (
        <Card className="shadow-md border-2">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              {statusMeta?.icon}
              <h3 className="text-xl font-semibold">Result: {statusMeta?.label}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-medium">{selection.category}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Use / Breed</div>
                <div className="font-medium">{selection.rule}</div>
              </div>
            </div>
            {selectedRule.note && (
              <div className="text-sm"><span className="font-medium">Notes:</span> {selectedRule.note}</div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="secondary" onClick={copySummary}>Copy summary</Button>
              <a
                href={`mailto:underwriting@basculeuw.com?subject=Submit%20for%20UW:%20${encodeURIComponent(selection.rule!)}&body=${encodeURIComponent(printableSummary)}`}
              >
                <Button>Pre-fill email to UW</Button>
              </a>
            </div>
            <p className="text-xs text-muted-foreground pt-2">Guidance is illustrative and subject to policy forms and underwriting review. If a risk doesn&apos;t fit this guide, email underwriting@basculeuw.com.</p>
          </CardContent>
        </Card>
      )}

      <footer className="text-xs text-muted-foreground">
        Built for agents. Update the dataset above as the appetite evolves.
      </footer>
    </div>
  );
}
