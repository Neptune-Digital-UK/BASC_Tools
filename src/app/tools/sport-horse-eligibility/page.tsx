import ToolNavigation from '@/components/ToolNavigation'
import SportHorseEligibilityWizard from '@/components/SportHorseEligibilityWizard'

export default function SportHorseEligibilityPage() {
  return (
    <>
      <ToolNavigation toolName="Medical Coverage Eligibility Tool" />
      <main className="py-8">
        <SportHorseEligibilityWizard />
      </main>
    </>
  )
}
