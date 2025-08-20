import { type NextRequest, NextResponse } from "next/server"
import type { Registration } from "@/lib/types"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GIST_ID = process.env.GIST_ID
const GIST_FILENAME = "registrations.json"

async function loadRegistrations(): Promise<Registration[]> {
  try {
    console.log("[v0] Loading registrations from GitHub Gist for individual operation")
    
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
      console.log("[v0] Successfully loaded registrations for individual operation:", registrations.length)
      return registrations
    } else {
      console.log("[v0] No existing registrations found")
      return []
    }
  } catch (error) {
    console.error("[v0] Error loading registrations from GitHub Gist:", error)
    return []
  }
}

async function saveRegistrations(registrations: Registration[]): Promise<void> {
  try {
    console.log("[v0] Saving registrations to GitHub Gist for individual operation, count:", registrations.length)
    
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

    console.log("[v0] Registrations saved successfully to GitHub Gist for individual operation")
  } catch (error) {
    console.error("[v0] Error saving registrations to GitHub Gist:", error)
    throw error
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updates = await request.json()
    const currentRegistrations = await loadRegistrations()

    const { id } = await params
    const registrationIndex = currentRegistrations.findIndex((reg) => reg.id === id)

    if (registrationIndex === -1) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    const updatedRegistration = { ...currentRegistrations[registrationIndex], ...updates }
    currentRegistrations[registrationIndex] = updatedRegistration
    await saveRegistrations(currentRegistrations)

    return NextResponse.json(updatedRegistration)
  } catch (error) {
    console.error("Error updating registration:", error)
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentRegistrations = await loadRegistrations()
    const { id } = await params
    const registrationIndex = currentRegistrations.findIndex((reg) => reg.id === id)

    if (registrationIndex === -1) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    currentRegistrations.splice(registrationIndex, 1)
    await saveRegistrations(currentRegistrations)

    return NextResponse.json({ message: "Registration deleted successfully" })
  } catch (error) {
    console.error("Error deleting registration:", error)
    return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 })
  }
}
