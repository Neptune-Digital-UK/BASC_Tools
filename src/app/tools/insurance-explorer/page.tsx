'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from '@/components/ui/combobox'
import ToolNavigation from '@/components/ToolNavigation'
import { Search, X, ChevronDown, ChevronUp, FileText } from 'lucide-react'

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToolNavigation toolName="Medical Product Explorer" />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Product Explorer</h1>
            <p className="text-gray-600">
              Compare medical insurance products side-by-side to help clients find the right coverage. Expand multiple rows to compare detailed information.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search Bar and Filters Row */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                  {/* Search Bar */}
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                    <Input
                      type="text"
                      placeholder="Search plans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-10 h-10"
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
                      <ComboboxTrigger className="h-10 text-sm" />
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
                      <ComboboxTrigger className="h-10 text-sm" />
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
                      <ComboboxTrigger className="h-10 text-sm" />
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
                      <ComboboxTrigger className="h-10 text-sm" />
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
            </CardContent>
          </Card>

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
      </main>

      {/* Footer */}
      <footer className="border-t bg-white shadow-sm mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              This tool provides general information about medical insurance products. Always verify coverage details
              and consult with underwriting for specific cases.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

