import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { RegistrationFormData, Registration } from "@/lib/types"

const DATA_DIR = path.join("/tmp", "wild-senses-data")
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json")

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    console.log("[v0] Creating data directory:", DATA_DIR)
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function loadRegistrations(): Promise<Registration[]> {
  try {
    console.log("[v0] Attempting to read registrations file:", REGISTRATIONS_FILE)
    await ensureDataDirectory()
    const data = await fs.readFile(REGISTRATIONS_FILE, "utf-8")
    const registrations = JSON.parse(data)
    console.log("[v0] Successfully loaded registrations:", registrations.length)
    return registrations
  } catch {
    console.log("[v0] No existing registrations file found, starting with empty array")
    return []
  }
}

async function saveRegistrations(registrations: Registration[]): Promise<void> {
  await ensureDataDirectory()
  console.log("[v0] Saving registrations to file:", REGISTRATIONS_FILE)
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2))
  console.log("[v0] Registrations saved successfully")
}

export async function GET() {
  try {
    console.log("[v0] GET request for registrations")
    const registrations = await loadRegistrations()
    console.log("[v0] Returning registrations:", registrations.length)
    console.log("[v0] Registration data being returned:", JSON.stringify(registrations, null, 2))
    return NextResponse.json(registrations)
  } catch (error) {
    console.error("[v0] Error loading registrations:", error)
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST request for new registration")
    const formData: RegistrationFormData = await request.json()
    console.log("[v0] Form data received:", {
      parentName: formData.parentName,
      childNames: formData.childNames,
      hasEmergencyContact: !!formData.emergencyContactName,
    })

    if (
      !formData.parentName ||
      !formData.parentEmail ||
      !formData.parentPhone ||
      !formData.childNames ||
      !formData.childAges ||
      !formData.emergencyContactName ||
      !formData.emergencyContactPhone
    ) {
      console.log("[v0] Missing required fields:", {
        parentName: !!formData.parentName,
        parentEmail: !!formData.parentEmail,
        parentPhone: !!formData.parentPhone,
        childNames: !!formData.childNames,
        childAges: !!formData.childAges,
        emergencyContactName: !!formData.emergencyContactName,
        emergencyContactPhone: !!formData.emergencyContactPhone,
      })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const registrations = await loadRegistrations()
    const registration: Registration = {
      id: Date.now().toString(),
      ...formData,
      checkedIn: false,
      registrationDate: new Date().toISOString(),
    }

    console.log("[v0] Created registration with ID:", registration.id)
    registrations.push(registration)
    await saveRegistrations(registrations)
    console.log("[v0] Registration saved successfully, total count:", registrations.length)

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating registration:", error)
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 })
  }
}
