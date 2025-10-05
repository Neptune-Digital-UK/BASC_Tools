import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, ArrowRight, Users, FileText, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Bascule Toolkit</h1>
                <p className="text-xs text-gray-600">Insurance Agent Toolkit</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Insurance Agent Tools
            </h2>
            <p className="text-base text-gray-600 max-w-2xl">
              Streamline your insurance processes with our comprehensive suite of tools designed specifically for insurance agents.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Sport Horse Eligibility Tool */}
            <Card className="hover:shadow-lg transition-shadow duration-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-[#2bd5db]/10 rounded-lg">
                    <Calculator className="h-6 w-6 text-[#2bd5db]" />
                  </div>
                  <CardTitle className="text-lg">Medical Coverage Eligibility</CardTitle>
                </div>
                <CardDescription>
                  Determine eligibility for Bascule&apos;s Major Medical insurance (Sport Horse & Western) based on horse type, value, use, age, and coverage preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="text-sm text-gray-600">
                    <strong>Features:</strong>
                    <ul className="mt-1 ml-4 list-disc">
                      <li>Sport & Western horse categories</li>
                      <li>Real-time eligibility assessment</li>
                      <li>Multi-step wizard interface</li>
                      <li>Coverage recommendations</li>
                      <li>Mobile-responsive design</li>
                    </ul>
                  </div>
                  <Link href="/tools/sport-horse-eligibility">
                    <Button className="w-full group mt-8">
                      Launch Tool
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Equine Risk Selector Tool */}
            <Card className="hover:shadow-lg transition-shadow duration-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Equine Risk Selector</CardTitle>
                </div>
                <CardDescription>
                  Determine appetite eligibility for equine mortality insurance based on breed, use, and category with instant results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="text-sm text-gray-600">
                    <strong>Features:</strong>
                    <ul className="mt-1 ml-4 list-disc">
                      <li>Comprehensive breed & use categories</li>
                      <li>Real-time eligibility assessment</li>
                      <li>Search and filter capabilities</li>
                      <li>Direct underwriting contact</li>
                      <li>Printable summaries</li>
                    </ul>
                  </div>
                  <Link href="/tools/equine-risk-selector">
                    <Button className="w-full group mt-8">
                      Launch Tool
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 opacity-60 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg text-gray-400">Application Library</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Coming soon: Access all of our application templates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Tools Section */}
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">More Tools Coming Soon</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Under Development</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Premium Calculator</li>
                    <li>• Risk Assessment Tool</li>
                    <li>• Claims Processing Assistant</li>
                    <li>• Compliance Checker</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Planned Features</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Document Templates</li>
                    <li>• Quote Comparison Tool</li>
                    <li>• Renewal Reminder System</li>
                    <li>• Analytics Dashboard</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 BASC Tools. Built for insurance professionals.</p>
            <p className="text-sm mt-2">
              This tool summarizes potential eligibility and is not a final offer of coverage. 
              Actual eligibility depends on full underwriting review and policy terms.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}