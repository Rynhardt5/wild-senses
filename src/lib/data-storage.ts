import type { Registration } from "./types"

// Client-side utility to sync registrations from server
export async function syncRegistrations(): Promise<Registration[]> {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/registrations")

      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.error("[v0] GET request failed:", response.status, response.statusText)
        const errorText = await response.text()
        console.error("[v0] Error response body:", errorText)
      }
    } catch (error) {
      console.error("[v0] Error syncing registrations:", error)
    }
  }
  return []
}
