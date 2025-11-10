'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from '@/components/ui/combobox'
import ToolNavigation from '@/components/ToolNavigation'
import { Search, X, ChevronDown, ChevronUp, FileText, Plus, Minus, ChevronLeft, ChevronRight, List, LayoutGrid } from 'lucide-react'

interface RateOption {
  horseCategory: string
  sumInsured: string
  deductible: string
  coPay: string
  limit: string
  premium: string
  notes?: string
}

interface InsurancePlan {
  id: string
  planName: string
  company: string
  stateFilingApproved: string
  coPay: string
  ageEligibility: string
  useAndValueEligibility: string
  specialLimits: string
  exclusions: string
  rates?: RateOption[]
}

// Comprehensive US state list
const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
]

// Helper function to check if a plan is available in a specific state
const isPlanAvailableInState = (plan: InsurancePlan, stateCode: string): boolean => {
  if (stateCode === 'all') return true
  
  const stateInfo = plan.stateFilingApproved.toLowerCase()
  
  // Handle "All states except X" pattern
  if (stateInfo.includes('all states except')) {
    const exceptPattern = /except\s+([A-Z,\s&]+)/i
    const match = stateInfo.match(exceptPattern)
    if (match) {
      const excludedStates = match[1].split(/[,&\s]+/).filter(s => s.length === 2)
      return !excludedStates.includes(stateCode)
    }
    return true // If we can't parse, assume available
  }
  
  // Handle comma-separated list of states
  const availableStates = stateInfo.split(',').map(s => s.trim().toUpperCase())
  return availableStates.some(state => state.includes(stateCode.toUpperCase()))
}

const insurancePlans: InsurancePlan[] = [
  {
    id: '1',
    planName: 'External Accident Major Medical',
    company: 'Accelerant',
    stateFilingApproved: 'AL, AZ, CO, CT, DE, DC, GA, FL, IA, ID, IL, IN, KS, KY, ME, MI, MN, MA, MO, MS, MT, NC, NE, NH, NJ, NM, NV, OH, PA, RI, SC, TN, TX, VA, WA and WV',
    coPay: 'None',
    ageEligibility: '31 days and up',
    useAndValueEligibility: 'All uses & values; (Excludes: Racing & Polo); *Note, limit does not cap at the value of the horse*',
    specialLimits: 'Coverage includes: Colic (medical or surgical), treatment for illness due to accidental injury (e.g., lacerations), neurological disorders from illness (EPM, West Nile, EHV), and Lyme disease. Diagnostics covered: Radiographs, ultrasound, blood work, and myelogram for visible, external, traumatic injuries.',
    exclusions: 'Diagnostics or treatment for lameness and ulcers (e.g., navicular, pedal osteitis, arthritis, DJD, vertebral/skeletal abnormalities, bone spavin, bone chips, OCD, tendonitis, ligament desmitis). Nuclear scintigraphy (bone scan) and MRI also excluded. Pre-existing conditions, routine maintenance, homeopathic treatments, elective surgeries',
    rates: [
      { horseCategory: 'Sport Horse', sumInsured: '> $0', deductible: '$375', coPay: '0%', limit: '$5,000', premium: '$525' },
      { horseCategory: 'Western', sumInsured: '> $0', deductible: '$375', coPay: '0%', limit: '$5,000', premium: '$475' }
    ]
  },
  {
    id: '2',
    planName: 'Basic Major Medical',
    company: 'Accelerant',
    stateFilingApproved: 'AL, AZ, CO, CT, DE, DC, GA, FL, IA, ID, IL, IN, KS, KY, ME, MI, MN, MA, MO, MS, MT, NC, NE, NH, NJ, NM, NV, OH, PA, RI, SC, TN, TX, VA, WA and WV',
    coPay: 'None',
    ageEligibility: '31 days and up',
    useAndValueEligibility: 'All uses & values $20k+ (Excludes: Racing, Polo, Eventing, Dressage < $50k) Barrel horses qualify for $7,500 limit',
    specialLimits: 'Lameness: $2.5k/claim, $4k/year; Diagnostics: $2.5k/claim, $4k/year; Gastric Ulcers: $2.5k max',
    exclusions: 'Only covers dental if caused by a visible external accident, pre-existing conditions, routine maintenance, homeopathic treatments, elective surgeries.',
    rates: [
      { horseCategory: 'Sport Horse', sumInsured: '≥ $20,000', deductible: '$425', coPay: '0%', limit: '$7,500', premium: '$575' },
      { horseCategory: 'Sport Horse', sumInsured: '≥ $20,000', deductible: '$500', coPay: '0%', limit: '$10,000', premium: '$675' },
      { horseCategory: 'Sport Horse', sumInsured: '≥ $20,000', deductible: '$600', coPay: '0%', limit: '$15,000', premium: '$825' },
      { horseCategory: 'Western', sumInsured: '≥ $20,000', deductible: '$425', coPay: '0%', limit: '$7,500', premium: '$525' },
      { horseCategory: 'Western', sumInsured: '≥ $20,000', deductible: '$500', coPay: '0%', limit: '$10,000', premium: '$625' },
      { horseCategory: 'Western', sumInsured: '≥ $20,000', deductible: '$600', coPay: '0%', limit: '$15,000', premium: '$775' }
    ]
  },
  {
    id: '3',
    planName: 'Special Major Medical',
    company: 'Accelerant',
    stateFilingApproved: 'AL, AZ, CO, CT, DE, DC, GA, FL, IA, ID, IL, IN, KS, KY, ME, MI, MN, MA, MO, MS, MT, NC, NE, NH, NJ, NM, NV, OH, PA, RI, SC, TN, TX, VA, WA and WV',
    coPay: 'None',
    ageEligibility: '31 days and up',
    useAndValueEligibility: 'Values $20k+ (Excludes: Racing, Polo, Eventing, Barrel & Dressage < $50k)',
    specialLimits: 'Lameness: $2.5k/claim; Diagnostics: 50% of limit; Gastric Ulcers: $2.5k max',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments, elective surgeries',
    rates: [
      { horseCategory: 'Sport Horse', sumInsured: '≥ $20,000', deductible: '$425', coPay: '0%', limit: '$7,500', premium: '$575' },
      { horseCategory: 'Sport Horse', sumInsured: '≥ $20,000', deductible: '$500', coPay: '0%', limit: '$10,000', premium: '$675' },
      { horseCategory: 'Sport Horse', sumInsured: '≥ $20,000', deductible: '$600', coPay: '0%', limit: '$15,000', premium: '$825' },
      { horseCategory: 'Western', sumInsured: '≥ $20,000', deductible: '$425', coPay: '0%', limit: '$7,500', premium: '$525' },
      { horseCategory: 'Western', sumInsured: '≥ $20,000', deductible: '$500', coPay: '0%', limit: '$10,000', premium: '$625' },
      { horseCategory: 'Western', sumInsured: '≥ $20,000', deductible: '$600', coPay: '0%', limit: '$15,000', premium: '$775' }
    ]
  },
  {
    id: '4',
    planName: 'Classic Major Medical (20% Co-Pay)',
    company: 'Accelerant & Hanover',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: '20%',
    ageEligibility: '31 days through 20 years',
    useAndValueEligibility: 'Values $20k+ (Excludes: Racing, Polo, Eventing, Barrel & Dressage < $50k)',
    specialLimits: 'Shockwave: $1.2k/claim; Regenerative: $3k/claim; Ulcers: $2.5k max',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments, elective surgeries',
    rates: [
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$500', coPay: '20%', limit: '$7,500', premium: '$500' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$500', coPay: '20%', limit: '$10,000', premium: '$550' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$500', coPay: '20%', limit: '$12,500', premium: '$675' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$500', coPay: '20%', limit: '$15,000', premium: '$750' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$1,000', coPay: '20%', limit: '$7,500', premium: '$440' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$1,000', coPay: '20%', limit: '$10,000', premium: '$460' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$1,000', coPay: '20%', limit: '$12,500', premium: '$560' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$1,000', coPay: '20%', limit: '$15,000', premium: '$620' }
    ]
  },
  {
    id: '5',
    planName: 'Classic Major Medical (No Co-Pay)',
    company: 'Accelerant & Hanover',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: 'None',
    ageEligibility: '31 days through 20 years',
    useAndValueEligibility: 'Values $100k+ (Excludes: Racing, Polo, Eventing, Barrel)',
    specialLimits: 'Shockwave: $1.2k/claim; Regenerative: $3k/claim; Ulcers: $2.5k max',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments, elective surgeries',
    rates: [
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$500', coPay: '0%', limit: '$7,500', premium: '$700' },
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$500', coPay: '0%', limit: '$10,000', premium: '$750' },
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$500', coPay: '0%', limit: '$12,500', premium: '$875' },
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$500', coPay: '0%', limit: '$15,000', premium: '$950' },
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$1,000', coPay: '0%', limit: '$7,500', premium: '$640' },
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$1,000', coPay: '0%', limit: '$10,000', premium: '$660' },
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$1,000', coPay: '0%', limit: '$12,500', premium: '$760' },
      { horseCategory: 'Any', sumInsured: '≥ $100,000', deductible: '$1,000', coPay: '0%', limit: '$15,000', premium: '$820' }
    ]
  },
  {
    id: '6',
    planName: 'Medical Assistance',
    company: 'Accelerant & Hanover',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: '20%',
    ageEligibility: '31 days through 20 years',
    useAndValueEligibility: 'All values (Caps at value of horse) (Excludes: Racing, Polo, Eventing, Barrel Racers & Dressage <$50k)',
    specialLimits: 'Shockwave/Bisphosphonate: $750; Regenerative: $500; Ulcers: $1.5k; Lameness: 6 months',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments, elective surgeries',
    rates: [
      { horseCategory: 'Any', sumInsured: '< $20,000', deductible: '$1,000', coPay: '20%', limit: '$7,500', premium: '$650' },
      { horseCategory: 'Any', sumInsured: '≥ $20,000', deductible: '$500', coPay: '20%', limit: '$7,500', premium: '$400' }
    ]
  },
  {
    id: '7',
    planName: 'Emergency Colic Surgery',
    company: 'Accelerant & Hanover',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: 'None',
    ageEligibility: '31 days through 20 years',
    useAndValueEligibility: 'Any Value',
    specialLimits: '$5k total coverage',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments',
    rates: [
      { horseCategory: 'Any', sumInsured: '> $0', deductible: '$0', coPay: '0%', limit: '$5,000', premium: 'Included' }
    ]
  },
  {
    id: '8',
    planName: 'Colic Treatment',
    company: 'Accelerant & Hanover',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: '20%',
    ageEligibility: '31 days through 20 years',
    useAndValueEligibility: 'Horses $15k+ & Any Use',
    specialLimits: '$5k total; $2k if no surgery; After-care: 50% of surgery or 15 days',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments',
    rates: [
      { horseCategory: 'Any', sumInsured: '≥ $15,000', deductible: '$250', coPay: '20%', limit: '$5,000', premium: '$175' }
    ]
  },
  {
    id: '9',
    planName: 'Surgical (Accelerant & Hanover)',
    company: 'Accelerant & Hanover',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: '20%',
    ageEligibility: '31 days through 20 years',
    useAndValueEligibility: 'Any use (excludes Race Horse)',
    specialLimits: 'After-care: 50% of surgery or 15 days',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments. Surgery not under general anesthesia and elective surgery, non-essential procedures',
    rates: [
      { horseCategory: 'Any (excludes Race Horse)', sumInsured: 'Any', deductible: '$250', coPay: '20%', limit: '$5,000', premium: '$100' },
      { horseCategory: 'Any (excludes Race Horse)', sumInsured: 'Any', deductible: '$250', coPay: '20%', limit: '$10,000', premium: '$150' },
      { horseCategory: 'Any (excludes Race Horse)', sumInsured: 'Any', deductible: '$250', coPay: '20%', limit: '$15,000', premium: '$200' }
    ]
  },
  {
    id: '10',
    planName: 'Surgical (Accelerant - Zero Deductible)',
    company: 'Accelerant',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: 'None',
    ageEligibility: '31 days and up',
    useAndValueEligibility: 'Any value (No value cap)',
    specialLimits: 'After-care: 50% of surgery or 15 days',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments. Surgery not under general anesthesia and elective surgery, non-essential procedures',
    rates: [
      { horseCategory: 'Any', sumInsured: 'Any', deductible: '$0', coPay: '0%', limit: '$5,000', premium: '$100' },
      { horseCategory: 'Any', sumInsured: 'Any', deductible: '$0', coPay: '0%', limit: '$10,000', premium: '$200' }
    ]
  },
  {
    id: '11',
    planName: 'Surgical (Race Horse)',
    company: 'Accelerant & Hanover',
    stateFilingApproved: 'AL, AR, AZ, CA, CO, CT, DE, DC, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY',
    coPay: '20%',
    ageEligibility: '31 days through 20 years',
    useAndValueEligibility: 'Race Horse Only',
    specialLimits: 'After-care: 50% of surgery or 15 days',
    exclusions: 'Pre-existing conditions, routine maintenance, homeopathic treatments. Surgery not under general anesthesia and elective surgery, non-essential procedures',
    rates: [
      { horseCategory: 'Race Horse', sumInsured: 'Race Horse', deductible: '$250', coPay: '20%', limit: '$5,000', premium: '$200' }
    ]
  }
]

export default function InsuranceExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [selectedCoPay, setSelectedCoPay] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [selectedHorseCategory, setSelectedHorseCategory] = useState<string>('all')
  const [comparedProducts, setComparedProducts] = useState<string[]>([])
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'comparison'>('list')
  const [expandedPlans, setExpandedPlans] = useState<string[]>([])

  // Get unique companies and copay options
  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(insurancePlans.map(plan => plan.company)))
    return ['all', ...uniqueCompanies]
  }, [])

  const coPays = useMemo(() => {
    const uniqueCoPays = Array.from(new Set(insurancePlans.map(plan => plan.coPay)))
    return ['all', ...uniqueCoPays]
  }, [])

  const horseCategories = useMemo(() => {
    const categories = new Set<string>()
    insurancePlans.forEach(plan => {
      plan.rates?.forEach(rate => {
        categories.add(rate.horseCategory)
      })
    })
    return ['all', ...Array.from(categories).sort()]
  }, [])

  // Helper function to check if a rate matches the selected horse category
  const rateMatchesCategory = (rateCategory: string, selectedCategory: string): boolean => {
    if (selectedCategory === 'all') return true
    if (rateCategory === selectedCategory) return true
    
    // If selecting a specific category, also include "Any" rates
    if (['Race Horse', 'Sport Horse', 'Western'].includes(selectedCategory) && rateCategory === 'Any') {
      return true
    }
    
    return false
  }

  // Filter plans based on search and filters
  const filteredPlans = useMemo(() => {
    return insurancePlans.filter(plan => {
      const matchesSearch = searchTerm === '' || 
        plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.useAndValueEligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.ageEligibility.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCompany = selectedCompany === 'all' || plan.company === selectedCompany
      const matchesCoPay = selectedCoPay === 'all' || plan.coPay === selectedCoPay
      const matchesState = isPlanAvailableInState(plan, selectedState)
      
      // Check if plan has at least one rate matching the selected horse category
      const matchesHorseCategory = selectedHorseCategory === 'all' || 
        plan.rates?.some(rate => rateMatchesCategory(rate.horseCategory, selectedHorseCategory))

      return matchesSearch && matchesCompany && matchesCoPay && matchesState && matchesHorseCategory
    })
  }, [searchTerm, selectedCompany, selectedCoPay, selectedState, selectedHorseCategory])

  // Helper function to filter rates by horse category
  const getFilteredRates = (plan: InsurancePlan) => {
    if (!plan.rates) return []
    if (selectedHorseCategory === 'all') return plan.rates
    return plan.rates.filter(rate => rateMatchesCategory(rate.horseCategory, selectedHorseCategory))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCompany('all')
    setSelectedCoPay('all')
    setSelectedState('all')
    setSelectedHorseCategory('all')
  }

  const hasActiveFilters = searchTerm !== '' || selectedCompany !== 'all' || selectedCoPay !== 'all' || selectedState !== 'all' || selectedHorseCategory !== 'all'

  // List view helper functions
  const togglePlanExpansion = (planId: string) => {
    setExpandedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    )
  }

  const isExpanded = (planId: string) => expandedPlans.includes(planId)

  const expandAll = () => {
    setExpandedPlans(filteredPlans.map(plan => plan.id))
  }

  const collapseAll = () => {
    setExpandedPlans([])
  }

  // Comparison helper functions
  const isProductCompared = (planId: string) => comparedProducts.includes(planId)

  const toggleProductComparison = (planId: string) => {
    if (comparedProducts.includes(planId)) {
      // Remove from comparison
      setComparedProducts(prev => prev.filter(id => id !== planId))
      setShowLimitWarning(false)
    } else {
      // Add to comparison (max 4)
      if (comparedProducts.length >= 4) {
        setShowLimitWarning(true)
        setTimeout(() => setShowLimitWarning(false), 3000)
        return
      }
      setComparedProducts(prev => [...prev, planId])
    }
  }

  const removeProductFromComparison = (planId: string) => {
    setComparedProducts(prev => prev.filter(id => id !== planId))
    setShowLimitWarning(false)
  }

  // Auto-select first product when filters change (only in comparison view)
  useEffect(() => {
    if (viewMode === 'comparison' && filteredPlans.length > 0 && comparedProducts.length === 0) {
      setComparedProducts([filteredPlans[0].id])
    }
  }, [filteredPlans, viewMode])

  // Get compared product details
  const comparedProductDetails = useMemo(() => {
    return comparedProducts.map(id => 
      insurancePlans.find(plan => plan.id === id)
    ).filter(Boolean) as InsurancePlan[]
  }, [comparedProducts])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToolNavigation toolName="Medical Product Explorer" />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header and Filters Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            {/* Header with View Toggle */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Medical Product Explorer</h1>
                <p className="text-sm text-gray-600">
                  Select products to compare side-by-side
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
                <Button
                  variant={viewMode === 'comparison' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('comparison')}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Comparison View
                </Button>
              </div>
            </div>

            {/* Filters - Horizontal Layout */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                {/* Search Bar */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Input
                    type="text"
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-10 h-10 text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Horse Category Filter */}
                <div>
                  <Combobox
                    data={horseCategories.map(cat => ({ 
                      value: cat, 
                      label: cat === 'all' ? 'All Categories' : cat 
                    }))}
                    type="category"
                    value={selectedHorseCategory}
                    onValueChange={setSelectedHorseCategory}
                  >
                    <ComboboxTrigger className="h-10 text-sm w-full" />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          {horseCategories.map(cat => (
                            <ComboboxItem key={cat} value={cat}>
                              {cat === 'all' ? 'All Categories' : cat}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {/* Company Filter */}
                <div>
                  <Combobox
                    data={companies.map(comp => ({ 
                      value: comp, 
                      label: comp === 'all' ? 'All Companies' : comp 
                    }))}
                    type="company"
                    value={selectedCompany}
                    onValueChange={setSelectedCompany}
                  >
                    <ComboboxTrigger className="h-10 text-sm w-full" />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          {companies.map(comp => (
                            <ComboboxItem key={comp} value={comp}>
                              {comp === 'all' ? 'All Companies' : comp}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {/* Co-Pay Filter */}
                <div>
                  <Combobox
                    data={coPays.map(pay => ({ 
                      value: pay, 
                      label: pay === 'all' ? 'All Co-Pays' : pay 
                    }))}
                    type="co-pay"
                    value={selectedCoPay}
                    onValueChange={setSelectedCoPay}
                  >
                    <ComboboxTrigger className="h-10 text-sm w-full" />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          {coPays.map(pay => (
                            <ComboboxItem key={pay} value={pay}>
                              {pay === 'all' ? 'All Co-Pays' : pay}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {/* State Filter */}
                <div>
                  <Combobox
                    data={[{ value: 'all', label: 'All States' }, ...US_STATES.map(state => ({ 
                      value: state.code, 
                      label: `${state.name} (${state.code})` 
                    }))]}
                    type="state"
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <ComboboxTrigger className="h-10 text-sm w-full" />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          <ComboboxItem value="all">All States</ComboboxItem>
                          {US_STATES.map(state => (
                            <ComboboxItem key={state.code} value={state.code}>
                              {state.name} ({state.code})
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2 h-8"
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conditional Rendering Based on View Mode */}
        {viewMode === 'list' ? (
          // Original List/Table View
          <div className="flex-1 py-8 overflow-y-auto">
            <div className="container mx-auto px-4 max-w-7xl">
              {/* Results Count and Controls */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredPlans.length} of {insurancePlans.length} plans
                </div>
                {filteredPlans.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={expandAll}
                      disabled={expandedPlans.length === filteredPlans.length}
                      className="text-xs"
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={collapseAll}
                      disabled={expandedPlans.length === 0}
                      className="text-xs"
                    >
                      Collapse All
                    </Button>
                  </div>
                )}
              </div>

              {/* Plans Table */}
              {filteredPlans.length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters} variant="outline" size="sm">
                        Clear all filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plan Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Co-Pay
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age Eligibility
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Use & Value
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPlans.map(plan => (
                          <>
                            <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                {plan.planName}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                {plan.company}
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  plan.coPay === 'None' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {plan.coPay}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                {plan.ageEligibility}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                                <div className="truncate" title={plan.useAndValueEligibility}>
                                  {plan.useAndValueEligibility}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePlanExpansion(plan.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  {isExpanded(plan.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </td>
                            </tr>
                            {isExpanded(plan.id) && (
                              <tr key={`${plan.id}-details`} className="bg-gray-50">
                                <td colSpan={6} className="px-4 py-6">
                                  <div className="space-y-6">
                                    {/* Rates Table */}
                                    {(() => {
                                      const filteredRates = getFilteredRates(plan)
                                      return filteredRates.length > 0 && (
                                        <div>
                                          <h4 className="font-semibold text-sm text-gray-700 mb-3">
                                            Premium Rates & Coverage Options
                                            {selectedHorseCategory !== 'all' && (
                                              <span className="ml-2 text-xs font-normal text-blue-600">
                                                (Filtered for {selectedHorseCategory})
                                              </span>
                                            )}
                                          </h4>
                                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="w-full">
                                              <thead className="bg-gray-100 border-b">
                                                <tr>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                                                    Horse Category
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                                                    Sum Insured
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                                                    Deductible
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                                                    Co-Pay
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                                                    Limit
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                                                    Premium
                                                  </th>
                                                  {filteredRates.some(r => r.notes) && (
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                                                      Notes
                                                    </th>
                                                  )}
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-gray-100">
                                                {filteredRates.map((rate, idx) => (
                                                  <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 text-xs font-medium text-blue-700">
                                                      {rate.horseCategory}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-gray-700">
                                                      {rate.sumInsured}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-gray-700">
                                                      {rate.deductible}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-gray-700">
                                                      {rate.coPay}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs font-medium text-gray-900">
                                                      {rate.limit}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs font-semibold text-green-700">
                                                      {rate.premium}
                                                    </td>
                                                    {filteredRates.some(r => r.notes) && (
                                                      <td className="px-3 py-2 text-xs text-gray-500 italic">
                                                        {rate.notes}
                                                      </td>
                                                    )}
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )
                                    })()}

                                    {/* Plan Details Grid */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                          Use & Value Eligibility (Full)
                                        </h4>
                                        <p className="text-sm text-gray-600">{plan.useAndValueEligibility}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                          State Filing Approved
                                        </h4>
                                        <p className="text-sm text-gray-600">{plan.stateFilingApproved}</p>
                                      </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                          Special Limits
                                        </h4>
                                        <p className="text-sm text-gray-600">{plan.specialLimits}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                          Exclusions
                                        </h4>
                                        <p className="text-sm text-gray-600">{plan.exclusions}</p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ) : (
          // New Comparison View
          <div className="flex-1 flex overflow-hidden relative">
          {/* Left Sidebar - Product List Only */}
          <aside className={`bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? 'w-0' : 'w-64'
          }`}>
            {!isSidebarCollapsed && (
              <>
                {/* Header with count */}
                <div className="p-3 border-b border-gray-200">
                  <div className="text-xs font-medium text-gray-700">
                    {filteredPlans.length} of {insurancePlans.length} plans
                  </div>
                </div>

                {/* Product List - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  {filteredPlans.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No plans found</h3>
                      <p className="text-xs text-gray-600 mb-3">
                        Try adjusting your filters
                      </p>
                      {hasActiveFilters && (
                        <Button onClick={clearFilters} variant="outline" size="sm">
                          Clear filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredPlans.map(plan => {
                        const isCompared = isProductCompared(plan.id)
                        
                        return (
                          <div
                            key={plan.id}
                            className={`p-3 cursor-pointer transition-all ${
                              isCompared 
                                ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => toggleProductComparison(plan.id)}
                          >
                            <h3 className={`text-sm font-medium ${
                              isCompared ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {plan.planName}
                            </h3>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-r-md p-1.5 hover:bg-gray-50 transition-all z-10 shadow-sm"
            style={{ left: isSidebarCollapsed ? '0' : '256px' }}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>

          {/* Right Detail Panel */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            <div className="h-full flex flex-col">
              {/* Header with count and warning */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Product Comparison
                    </h2>
                    <p className="text-sm text-gray-600">
                      {comparedProducts.length} of 4 products selected
                    </p>
                  </div>
                  {showLimitWarning && (
                    <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2">
                      <p className="text-xs text-amber-800">
                        Maximum 4 products can be compared
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Horizontal scrolling product cards */}
              <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
                {comparedProductDetails.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products selected
                      </h3>
                      <p className="text-gray-600">
                        Click on a product from the list to compare
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-6 h-full">
                    {comparedProductDetails.map(plan => {
                      const filteredRates = getFilteredRates(plan)
                      
                      return (
                        <Card key={plan.id} className="flex-shrink-0 w-[525px] shadow-lg">
                          <CardHeader className="pb-3 border-b bg-gray-50">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{plan.planName}</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                  {plan.company}
                                </CardDescription>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                onClick={() => removeProductFromComparison(plan.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-4 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
                            {/* Co-Pay Badge */}
                            <div>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                plan.coPay === 'None' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                Co-Pay: {plan.coPay}
                              </span>
                            </div>

                            {/* Age Eligibility */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-1">
                                Age Eligibility
                              </h4>
                              <p className="text-sm text-gray-600">{plan.ageEligibility}</p>
                            </div>

                            {/* Use & Value Eligibility */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-1">
                                Use & Value Eligibility
                              </h4>
                              <p className="text-sm text-gray-600">{plan.useAndValueEligibility}</p>
                            </div>

                            {/* Rates Table */}
                            {filteredRates.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                  Premium Rates & Coverage
                                  {selectedHorseCategory !== 'all' && (
                                    <span className="ml-2 text-xs font-normal text-blue-600">
                                      (Filtered for {selectedHorseCategory})
                                    </span>
                                  )}
                                </h4>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <table className="w-full text-xs">
                                    <thead className="bg-gray-50 border-b">
                                      <tr>
                                        <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                                          Category
                                        </th>
                                        <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                                          Deductible
                                        </th>
                                        <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                                          Limit
                                        </th>
                                        <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                                          Premium
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {filteredRates.map((rate, idx) => (
                                        <tr key={idx}>
                                          <td className="px-2 py-1.5 font-medium text-blue-700">
                                            {rate.horseCategory}
                                          </td>
                                          <td className="px-2 py-1.5 text-gray-700">
                                            {rate.deductible}
                                          </td>
                                          <td className="px-2 py-1.5 font-medium text-gray-900">
                                            {rate.limit}
                                          </td>
                                          <td className="px-2 py-1.5 font-semibold text-green-700">
                                            {rate.premium}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Special Limits */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-1">
                                Special Limits
                              </h4>
                              <p className="text-sm text-gray-600">{plan.specialLimits}</p>
                            </div>

                            {/* Exclusions */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-1">
                                Exclusions
                              </h4>
                              <p className="text-sm text-gray-600">{plan.exclusions}</p>
                            </div>

                            {/* State Filing */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-1">
                                State Filing Approved
                              </h4>
                              <p className="text-xs text-gray-600">{plan.stateFilingApproved}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="text-center text-gray-600">
            <p className="text-xs">
              This tool provides general information about medical insurance products. Always verify coverage details
              and consult with underwriting for specific cases.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

