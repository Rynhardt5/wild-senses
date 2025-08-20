import { type NextRequest, NextResponse } from "next/server"
import type { RegistrationFormData, Registration } from "@/lib/types"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GIST_ID = process.env.GIST_ID
const GIST_FILENAME = "registrations.json"

async function loadRegistrations(): Promise<Registration[]> {
  try {
    
    if (!GITHUB_TOKEN || !GIST_ID) {
      console.error("[v0] Missing GitHub token or Gist ID")
      return []
    }

    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch gist:", response.status, response.statusText)
      return []
    }

    const gist = await response.json()
    const fileContent = gist.files[GIST_FILENAME]?.content

    if (fileContent) {
      const registrations = JSON.parse(fileContent)
      return registrations
    } else {
      return []
    }
  } catch (error) {
    console.error("[v0] Error loading registrations from GitHub Gist:", error)
    return []
  }
}

async function saveRegistrations(registrations: Registration[]): Promise<void> {
  try {
    
    if (!GITHUB_TOKEN || !GIST_ID) {
      throw new Error("Missing GitHub token or Gist ID")
    }

    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(registrations, null, 2)
          }
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to update gist: ${response.status} ${response.statusText}`)
    }

  } catch (error) {
    console.error("[v0] Error saving registrations to GitHub Gist:", error)
    throw error
  }
}

export async function GET() {
  try {
    const registrations = await loadRegistrations()
    return NextResponse.json(registrations)
  } catch (error) {
    console.error("[v0] Error loading registrations:", error)
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: RegistrationFormData = await request.json()

    if (
      !formData.parentName ||
      !formData.parentEmail ||
      !formData.parentPhone ||
      !formData.childNames ||
      !formData.childAges ||
      !formData.emergencyContactName ||
      !formData.emergencyContactPhone
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const registrations = await loadRegistrations()
    const registration: Registration = {
      id: Date.now().toString(),
      ...formData,
      checkedIn: false,
      registrationDate: new Date().toISOString(),
    }

    registrations.push(registration)
    await saveRegistrations(registrations)

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating registration:", error)
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 })
  }
}
