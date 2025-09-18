import ToolNavigation from '@/components/ToolNavigation'

export default function ToolTemplatePage() {
  return (
    <>
      <ToolNavigation toolName="Tool Template" />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h1 className="text-2xl font-semibold mb-4">Tool Template</h1>
              <p className="text-gray-600 mb-6">
                This is a template for creating new tools. Copy this file and modify it for your new tool.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="font-medium mb-2">To create a new tool:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Copy this file to a new directory under <code>/tools/</code></li>
                  <li>Update the tool name in the ToolNavigation component</li>
                  <li>Replace the content with your tool&apos;s functionality</li>
                  <li>Add a link to the new tool on the homepage</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
