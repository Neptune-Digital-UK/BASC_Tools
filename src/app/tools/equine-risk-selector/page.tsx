import ToolNavigation from '@/components/ToolNavigation'
import EquineRiskSelector from '@/components/EquineRiskSelector'

export default function EquineRiskSelectorPage() {
  return (
    <>
      <ToolNavigation toolName="Equine Risk Selector" />
      <main className="py-8">
        <EquineRiskSelector />
      </main>
    </>
  )
}
