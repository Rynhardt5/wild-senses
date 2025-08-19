"use client"

import type { Registration } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface NameTagsPrintProps {
  registrations: Registration[]
  onBack?: () => void
}

export function NameTagsPrint({ registrations, onBack }: NameTagsPrintProps) {
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
              margin: 0.25in;
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

      <div className="print-area p-4 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">Wild Senses Name Tags</h1>
          <p className="text-sm text-gray-600">Cut along dotted lines</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="border-2 border-dashed border-gray-400 p-4 bg-green-50 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-green-700 font-medium mb-1">WILD SENSES</div>
                <div className="text-2xl font-bold text-green-800 mb-2">{reg.childNames}</div>
                <div className="text-sm text-gray-600 mb-2">Ages: {reg.childAges}</div>

                {(reg.allergies || reg.neurodivergencies) && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded p-2 text-xs">
                    <div className="font-medium text-yellow-800 mb-1">⚠️ SPECIAL ATTENTION</div>
                    {reg.allergies && (
                      <div className="text-red-700">
                        <strong>Allergies:</strong>{" "}
                        {reg.allergies.length > 30 ? reg.allergies.substring(0, 30) + "..." : reg.allergies}
                      </div>
                    )}
                    {reg.neurodivergencies && (
                      <div className="text-blue-700">
                        <strong>Special Needs:</strong>{" "}
                        {reg.neurodivergencies.length > 30
                          ? reg.neurodivergencies.substring(0, 30) + "..."
                          : reg.neurodivergencies}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500">
                  <div>Parent: {reg.parentName}</div>
                  <div>Emergency: {reg.emergencyContactName}</div>
                  <div>{reg.emergencyContactPhone}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs text-gray-600 text-center">
          <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()} | Wild Senses Children&apos;s Program</p>
        </div>
      </div>
    </div>
  )
}
