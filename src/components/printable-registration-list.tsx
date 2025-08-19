"use client"

import type { Registration } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PrintableRegistrationListProps {
  registrations: Registration[]
  onBack?: () => void
}

export function PrintableRegistrationList({ registrations, onBack }: PrintableRegistrationListProps) {

  return (
    <div className="block">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
            @page {
              margin: 0.5in;
            }
          }
        `,
        }}
      />

      {/* Back Button - visible on screen but hidden when printing */}
      <div className="no-print mb-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Panel
        </Button>
      </div>

      <div className="print-area p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Wild Senses Program</h1>
          <h2 className="text-xl text-gray-700 mb-4">Registration List</h2>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Children Names & Ages</th>
              <th className="border border-gray-300 p-2 text-left">Parent Name & Contact</th>
              <th className="border border-gray-300 p-2 text-left">Emergency Contact</th>
              <th className="border border-gray-300 p-2 text-left">Special Notes</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={reg.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border border-gray-300 p-2 font-medium">
                  <div className="font-semibold">{reg.childNames}</div>
                  <div className="text-sm text-gray-600">Ages: {reg.childAges}</div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="font-semibold">{reg.parentName}</div>
                  <div className="text-sm text-gray-600">{reg.parentPhone}</div>
                  <div className="text-xs text-gray-500">{reg.parentEmail}</div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="font-semibold">{reg.emergencyContactName}</div>
                  <div className="text-sm text-gray-600">{reg.emergencyContactPhone}</div>
                </td>
                <td className="border border-gray-300 p-2 text-xs">
                  {reg.allergies && (
                    <div className="mb-1">
                      <strong>Allergies:</strong> {reg.allergies}
                    </div>
                  )}
                  {reg.neurodivergencies && (
                    <div className="mb-1">
                      <strong>Special Needs:</strong> {reg.neurodivergencies}
                    </div>
                  )}
                  {!reg.allergies && !reg.neurodivergencies && (
                    <span className="text-gray-400">None</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>


      </div>
    </div>
  )
}
