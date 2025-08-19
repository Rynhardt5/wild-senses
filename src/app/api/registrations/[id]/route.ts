import { type NextRequest, NextResponse } from "next/server"
import type { Registration } from "@/lib/types"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join("/tmp", "wild-senses-data")
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json")

async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function loadRegistrations(): Promise<Registration[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(REGISTRATIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveRegistrations(registrations: Registration[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2))
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
