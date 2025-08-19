import type { Registration } from "./types"

// Client-side utility to sync registrations from server
export async function syncRegistrations(): Promise<Registration[]> {
  if (typeof window !== "undefined") {
    try {
      console.log("[v0] Making GET request to /api/registrations")
      const response = await fetch("/api/registrations")
      console.log("[v0] GET response status:", response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] GET response data:", data)
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
