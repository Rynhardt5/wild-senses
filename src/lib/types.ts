export interface Registration {
  id: string
  parentName: string
  parentEmail: string
  parentPhone: string
  childNames: string
  childAges: string
  allergies: string
  neurodivergencies: string
  emergencyContactName: string
  emergencyContactPhone: string
  checkedIn: boolean
  registrationDate: string
}

export interface RegistrationFormData {
  parentName: string
  parentEmail: string
  parentPhone: string
  childNames: string
  childAges: string
  allergies: string
  neurodivergencies: string
  emergencyContactName: string
  emergencyContactPhone: string
}
