import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

interface ToolNavigationProps {
  toolName: string
  showBackToTools?: boolean
}

export default function ToolNavigation({ toolName, showBackToTools = true }: ToolNavigationProps) {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackToTools && (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tools
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-300" />
              </>
            )}
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            {toolName}
          </div>
        </div>
      </div>
    </header>
  )
}
