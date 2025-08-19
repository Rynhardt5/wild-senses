'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  UserCheck,
  Search,
  Download,
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  Printer,
  Tag,
  Edit,
  Trash2,
} from 'lucide-react'
import type { Registration } from '@/lib/types'
import { PrintableRegistrationList } from '@/components/printable-registration-list'
import { NameTagsPrint } from '@/components/name-tags-print'
import { syncRegistrations } from '@/lib/data-storage'

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [showPrintView, setShowPrintView] = useState(false)
  const [showNameTags, setShowNameTags] = useState(false)
  const [editingRegistration, setEditingRegistration] =
    useState<Registration | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Registration>>({})
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setError('') // Clear any previous errors
      const data = await syncRegistrations()
      setRegistrations(data)
    } catch (err) {
      console.error('Error loading registrations:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load registrations'
      )
    } finally {
      setLoading(false)
    }
  }

  const toggleCheckIn = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkedIn: !currentStatus }),
      })

      if (!response.ok) throw new Error('Failed to update check-in status')

      // Refresh the data
      await loadRegistrations()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update check-in status'
      )
    }
  }

  const handleEditRegistration = (registration: Registration) => {
    console.log('[v0] Edit button clicked for registration:', registration.id)
    setEditingRegistration(registration)
    setEditFormData(registration)
  }

  const saveEditedRegistration = async () => {
    if (!editingRegistration) return

    console.log(
      '[v0] Saving edited registration:',
      editingRegistration.id,
      editFormData
    )
    try {
      const response = await fetch(
        `/api/registrations/${editingRegistration.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFormData),
        }
      )

      console.log('[v0] Edit response status:', response.status)
      if (!response.ok) throw new Error('Failed to update registration')

      console.log('[v0] Registration updated successfully')
      setEditingRegistration(null)
      setEditFormData({})
      await loadRegistrations()
    } catch (err) {
      console.error('[v0] Error updating registration:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to update registration'
      )
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    console.log('[v0] Delete registration called for ID:', id)
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
      })

      console.log('[v0] Delete response status:', response.status)
      if (!response.ok) throw new Error('Failed to delete registration')

      console.log('[v0] Registration deleted successfully')
      setDeleteConfirmId(null)
      await loadRegistrations()
    } catch (err) {
      console.error('[v0] Error deleting registration:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to delete registration'
      )
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Child Names',
      'Ages',
      'Parent Name',
      'Parent Email',
      'Parent Phone',
      'Emergency Contact',
      'Emergency Phone',
      'Allergies',
      'Special Needs',
      'Checked In',
      'Registration Date',
    ]

    const csvData = registrations.map((reg) => [
      reg.childNames,
      reg.childAges,
      reg.parentName,
      reg.parentEmail,
      reg.parentPhone,
      reg.emergencyContactName,
      reg.emergencyContactPhone,
      reg.allergies || 'None',
      reg.neurodivergencies || 'None',
      reg.checkedIn ? 'Yes' : 'No',
      new Date(reg.registrationDate).toLocaleDateString(),
    ])

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n')

    try {
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wild-senses-registrations-${
        new Date().toISOString().split('T')[0]
      }.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('Failed to export CSV:', error)
      setError('Failed to export CSV file')
    }
  }

  const handlePrintList = () => {
    setShowPrintView(true)
  }

  const handlePrintNameTags = () => {
    setShowNameTags(true)
  }

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.childNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const checkedInCount = registrations.filter((reg) => reg.checkedIn).length
  const totalRegistrations = registrations.length

  if (showPrintView) {
    return (
      <PrintableRegistrationList 
        registrations={filteredRegistrations} 
        onBack={() => setShowPrintView(false)}
      />
    )
  }

  if (showNameTags) {
    return (
      <NameTagsPrint
        registrations={filteredRegistrations.filter((reg) => !reg.checkedIn)}
        onBack={() => setShowNameTags(false)}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registrations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRegistrations}
            className="ml-4 bg-transparent"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {checkedInCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalRegistrations - checkedInCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Management</CardTitle>
          <CardDescription>
            View and manage all program registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search registrations
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by child name, parent name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={handlePrintList}
                className="flex items-center gap-2 bg-transparent"
              >
                <Printer className="h-4 w-4" />
                Print List
              </Button>
              <Button
                variant="outline"
                onClick={handlePrintNameTags}
                className="flex items-center gap-2 bg-transparent"
              >
                <Tag className="h-4 w-4" />
                Print Name Tags
              </Button>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Child Names</TableHead>
                  <TableHead>Ages</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Emergency Contact</TableHead>
                  <TableHead>Special Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchTerm
                        ? 'No registrations match your search.'
                        : 'No registrations yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        {registration.childNames}
                      </TableCell>
                      <TableCell>{registration.childAges}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {registration.parentName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {registration.parentEmail}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {registration.parentPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {registration.emergencyContactName}
                          </div>
                          <div className="text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {registration.emergencyContactPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {registration.allergies && (
                            <div>
                              <span className="font-medium text-red-600">
                                Allergies:
                              </span>
                              <p className="text-gray-600">
                                {registration.allergies}
                              </p>
                            </div>
                          )}
                          {registration.neurodivergencies && (
                            <div>
                              <span className="font-medium text-blue-600">
                                Special Needs:
                              </span>
                              <p className="text-gray-600">
                                {registration.neurodivergencies}
                              </p>
                            </div>
                          )}
                          {!registration.allergies &&
                            !registration.neurodivergencies && (
                              <span className="text-gray-400">None noted</span>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            registration.checkedIn ? 'default' : 'secondary'
                          }
                        >
                          {registration.checkedIn
                            ? 'Checked In'
                            : 'Not Checked In'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={
                              registration.checkedIn ? 'outline' : 'default'
                            }
                            onClick={() =>
                              toggleCheckIn(
                                registration.id,
                                registration.checkedIn
                              )
                            }
                            className="text-xs"
                          >
                            {registration.checkedIn ? 'Check Out' : 'Check In'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log(
                                '[v0] Edit button clicked for:',
                                registration.id
                              )
                              handleEditRegistration(registration)
                            }}
                            className="text-xs flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log(
                                '[v0] Delete button clicked for:',
                                registration.id
                              )
                              setDeleteConfirmId(registration.id)
                            }}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Registration Dialog */}
      <Dialog
        open={!!editingRegistration}
        onOpenChange={() => setEditingRegistration(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
            <DialogDescription>
              Update registration details for {editingRegistration?.childNames}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="childNames">Child Names</Label>
                <Input
                  id="childNames"
                  value={editFormData.childNames || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      childNames: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="childAges">Ages</Label>
                <Input
                  id="childAges"
                  value={editFormData.childAges || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      childAges: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  value={editFormData.parentName || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      parentName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={editFormData.parentEmail || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      parentEmail: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentPhone">Parent Phone</Label>
                <Input
                  id="parentPhone"
                  value={editFormData.parentPhone || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      parentPhone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactName">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergencyContactName"
                  value={editFormData.emergencyContactName || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      emergencyContactName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                value={editFormData.emergencyContactPhone || ''}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    emergencyContactPhone: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={editFormData.allergies || ''}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    allergies: e.target.value,
                  })
                }
                placeholder="Any allergies or dietary restrictions..."
              />
            </div>
            <div>
              <Label htmlFor="neurodivergencies">Special Needs</Label>
              <Textarea
                id="neurodivergencies"
                value={editFormData.neurodivergencies || ''}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    neurodivergencies: e.target.value,
                  })
                }
                placeholder="Any neurodivergencies or special needs..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRegistration(null)}
            >
              Cancel
            </Button>
            <Button onClick={saveEditedRegistration}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmId && handleDeleteRegistration(deleteConfirmId)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
