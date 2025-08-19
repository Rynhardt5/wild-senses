"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, Info } from "lucide-react"
import type { RegistrationFormData } from "@/lib/types"

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    childNames: "",
    childAges: "",
    allergies: "",
    neurodivergencies: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof RegistrationFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("") // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit registration")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for registering <strong>{formData.childNames}</strong> for Wild Senses.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Important Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Physical Requirements & Facilities</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>
                • <strong>Steep Hill Incline:</strong> The location has a steep hill that requires physical mobility to
                traverse. Please notify us if you have any physical inability to navigate such terrain. Message Rynhardt
                / 0404 441 255
              </li>
              <li>
                • <strong>Bush Toilet:</strong> Toilet facilities are located at the bottom of the hill.
              </li>
              <li>
                • <strong>Weather Protection:</strong> We have a bush shelter and fireplace available in case of rain.
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">What to Expect</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>
                • <strong>Weather Prepared:</strong> Please dress appropriately for outdoor conditions and bring weather
                protection.
              </li>
              <li>
                • <strong>Getting Dirty:</strong> Children will get dirty during activities - please dress them in
                clothes suitable for outdoor play.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-800">Parent/Guardian Information</CardTitle>
          <CardDescription>Please provide your contact details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="parentName">Full Name *</Label>
            <Input
              id="parentName"
              value={formData.parentName}
              onChange={(e) => handleInputChange("parentName", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="parentEmail">Email Address *</Label>
            <Input
              id="parentEmail"
              type="email"
              value={formData.parentEmail}
              onChange={(e) => handleInputChange("parentEmail", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="parentPhone">Phone Number *</Label>
            <Input
              id="parentPhone"
              type="tel"
              value={formData.parentPhone}
              onChange={(e) => handleInputChange("parentPhone", e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-800">Child Information</CardTitle>
          <CardDescription>Tell us about your child/children</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="childNames">Child/Children's Names *</Label>
            <Input
              id="childNames"
              value={formData.childNames}
              onChange={(e) => handleInputChange("childNames", e.target.value)}
              placeholder="e.g., Emma, Jack "
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">If registering multiple children, separate names with commas</p>
          </div>

          <div>
            <Label htmlFor="childAges">Child/Children's Ages *</Label>
            <Input
              id="childAges"
              value={formData.childAges}
              onChange={(e) => handleInputChange("childAges", e.target.value)}
              placeholder="e.g., 6, 8"
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">If multiple children, separate ages with commas (ages 3-12)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-gray-50" >
        <CardHeader>
          <CardTitle className="text-gray-800">Important Information</CardTitle>
          <CardDescription>Help us provide the best care for your child/children</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => handleInputChange("allergies", e.target.value)}
              placeholder="Please list any food allergies, environmental allergies, or other medical conditions we should be aware of..."
              className="mt-1 min-h-20"
            />
          </div>

          <div>
            <Label htmlFor="neurodivergencies">Neurodivergencies & Special Needs</Label>
            <Textarea
              id="neurodivergencies"
              value={formData.neurodivergencies}
              onChange={(e) => handleInputChange("neurodivergencies", e.target.value)}
              placeholder="Please share any information about autism, ADHD, sensory processing differences, or other needs that would help us support your child/children..."
              className="mt-1 min-h-20"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-800">Emergency Contact</CardTitle>
          <CardDescription>Someone we can reach if you're unavailable</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
            <Input
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-700 hover:bg-green-800 text-white py-3 text-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Registration...
          </>
        ) : (
          "Register for Wild Senses"
        )}
      </Button>
    </form>
  )
}
