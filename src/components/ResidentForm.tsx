import React, { useState } from 'react'
import { Resident } from '../types'


export default function ResidentForm({initial, onSave}:{initial?:Resident, onSave:(r:Resident)=>void}){
const [firstName, setFirstName] = useState(initial?.firstName||'')
const [lastName, setLastName] = useState(initial?.lastName||'')
const [address, setAddress] = useState(initial?.address||'')
const [contact, setContact] = useState(initial?.contact||'')


const save = ()=>{
const r: Resident = {
id: initial?.id || crypto.randomUUID(),
firstName, lastName, address, contact
}
onSave(r)
}


return (
<div className="space-y-2">
<div className="flex gap-2">
<input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First name" className="border rounded px-2 py-1 flex-1" />
<input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last name" className="border rounded px-2 py-1 flex-1" />
</div>
<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" className="border rounded px-2 py-1 w-full" />
<input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Contact" className="border rounded px-2 py-1 w-full" />
<div className="flex justify-end">
<button onClick={save} className="bg-slate-800 text-white px-3 py-1 rounded">Save</button>
</div>
</div>
)
}