export type Resident = {
id: string
firstName: string
lastName: string
birthdate?: string
address?: string
contact?: string
purok?: string
}


export type Certificate = {
id: string
residentId: string
type: string
issuedAt: string
}


export type BlotterEntry = {
id: string
complainant: string
respondent: string
summary: string
date: string
status: 'open'|'closed'|'pending'
}