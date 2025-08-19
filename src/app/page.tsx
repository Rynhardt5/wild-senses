import { RegistrationForm } from "@/components/registration-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="bg-green-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Wild Senses</h1>
          <p className="text-green-100 text-lg">A Nature Connection Day for kids</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Register Your Child</h2>
            <p className="text-gray-600 mb-4">
              Friday 22nd August 10am - 1:30pm
            </p>
            <p>Before we start our adventure together I&apos;d like to gather additional information to ensure we have the best time together</p>
          </div>

          <RegistrationForm />
        </div>
      </div>

      <footer className="bg-green-800 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-green-100">Questions? Contact us for more information about the Wild Senses program.</p>
        </div>
      </footer>
    </div>
  )
}
