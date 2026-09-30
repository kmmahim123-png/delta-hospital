"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Tab State
  const [activeTab, setActiveTab] = useState<'appointments' | 'lab'>('appointments')

  const [bookings, setBookings] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [sampleRequests, setSampleRequests] = useState<any[]>([])
  const [uploadedPhones, setUploadedPhones] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  // আগামী ৭ দিনের ডেট জেনারেট করা
  const availableDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dbDate = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-GB');
    return { dbDate, displayDate };
  });

  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")

  const [appliedDoctor, setAppliedDoctor] = useState<string>("all")
  const [appliedDate, setAppliedDate] = useState<string>("all")

  const [reportPhone, setReportPhone] = useState('')
  const [reportRows, setReportRows] = useState<{ name: string; file: File | null }[]>([
    { name: '', file: null }
  ])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const authState = sessionStorage.getItem('adminAuth')
    if (authState === 'true') {
      setIsAuthenticated(true)
    }
    setIsAuthChecking(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([cleanupOldBookings(), cleanupOldReports(), cleanupOldSampleRequests()]).then(() => fetchInitialData())
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(() => {
        fetchDynamicData()
      }, 10000)
      return () => clearInterval(intervalId)
    }
  }, [isAuthenticated])

  async function cleanupOldBookings() {
    const today = new Date().toISOString().split('T')[0]
    try {
      await supabase.from('bookings').delete().lt('booking_date', today)
    } catch (error) {
      console.error("Cleanup error:", error)
    }
  }

  async function cleanupOldReports() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoffDateTime = sevenDaysAgo.toISOString()
    try {
      await supabase.from('reports').delete().lt('created_at', cutoffDateTime)
    } catch (error) {
      console.error("Report cleanup error:", error)
    }
  }

  // ৭ দিন বা তার আগের কমপ্লিট হওয়া স্যাম্পল কালেকশন রিকোয়েস্ট অটোমেটিক ডিলিট করার ফাংশন
  async function cleanupOldSampleRequests() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoffDateTime = sevenDaysAgo.toISOString()
    try {
      await supabase.from('sample_requests').delete().eq('status', 'Completed').lt('created_at', cutoffDateTime)
    } catch (error) {
      console.error("Sample request cleanup error:", error)
    }
  }

  async function fetchInitialData() {
    setLoading(true)
    const { data: doctorsData } = await supabase.from('doctors').select('*')
    if (doctorsData && doctorsData.length > 0) {
      setDoctors(doctorsData)
    }
    await fetchDynamicData()
    setLoading(false)
  }

  async function fetchDynamicData() {
    const { data: bookingsData } = await supabase
      .from('bookings').select('*, doctors(name)')
      .order('booking_date', { ascending: true })
      .order('serial_number', { ascending: true })
    if (bookingsData) setBookings(bookingsData)

    const { data: samplesData } = await supabase
      .from('sample_requests').select('*').order('created_at', { ascending: false })
    if (samplesData) setSampleRequests(samplesData)

    const { data: reportsData } = await supabase.from('reports').select('patient_phone')
    if (reportsData) {
      const phones = Array.from(new Set(reportsData.map(r => r.patient_phone)))
      setUploadedPhones(phones)
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'pulse123') {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminAuth', 'true')
    } else {
      setLoginError('Incorrect password!')
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    sessionStorage.removeItem('adminAuth')
  }

  function handleSearchAppointments() {
    setAppliedDoctor(selectedDoctor)
    setAppliedDate(selectedDate)
  }

  async function handleMarkComplete(id: number) {
    setBookings(bookings.map(booking => booking.id === id ? { ...booking, status: 'Completed' } : booking))
    await supabase.from('bookings').update({ status: 'Completed' }).eq('id', id)
  }

  async function handleDeleteBooking(id: number, doctorId: number, bookingDate: string, deletedSerial: number) {
    if (confirm("Are you sure you want to delete this appointment? Serial numbers will be updated automatically.")) {
      try {
        const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id)
        if (deleteError) throw deleteError

        const { data: remainingBookings } = await supabase
          .from('bookings')
          .select('id, serial_number')
          .eq('doctor_id', doctorId)
          .eq('booking_date', bookingDate)
          .gt('serial_number', deletedSerial)
          .order('serial_number', { ascending: true })

        if (remainingBookings && remainingBookings.length > 0) {
          for (const booking of remainingBookings) {
            await supabase
              .from('bookings')
              .update({ serial_number: booking.serial_number - 1 })
              .eq('id', booking.id)
          }
        }

        fetchDynamicData()
      } catch (err: any) {
        alert("Error updating serials: " + err.message)
      }
    }
  }

  async function handleDeleteSampleRequest(id: number) {
    if (confirm("Are you sure you want to delete this sample collection request?")) {
      try {
        await supabase.from('sample_requests').delete().eq('id', id)
        fetchDynamicData()
      } catch (err: any) {
        alert("Error: " + err.message)
      }
    }
  }

  async function handleMarkSampleComplete(id: number) {
    setSampleRequests(sampleRequests.map(req => req.id === id ? { ...req, status: 'Completed' } : req))
    await supabase.from('sample_requests').update({ status: 'Completed' }).eq('id', id)
  }

  function handleQuickUploadReport(phone: string) {
    setReportPhone(phone)
    setActiveTab('lab')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const downloadPDF = () => {
    window.print()
  }

  const addReportRow = () => {
    setReportRows([...reportRows, { name: '', file: null }])
  }

  const removeReportRow = (index: number) => {
    const updated = reportRows.filter((_, i) => i !== index)
    setReportRows(updated)
  }

  async function handleUploadReports(e: React.FormEvent) {
    e.preventDefault()
    if (!reportPhone || reportRows.length === 0) return
    
    for (const row of reportRows) {
      if (!row.name || !row.file) {
        alert('Please fill all report names and select files.')
        return
      }
    }

    setUploading(true)
    try {
      for (const row of reportRows) {
        const fileExt = row.file!.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage.from('reports').upload(fileName, row.file!)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(fileName)
        const { error: dbError } = await supabase.from('reports').insert({ 
          patient_phone: reportPhone, 
          file_url: publicUrl, 
          report_name: row.name 
        })
        if (dbError) throw dbError
      }

      alert('All reports uploaded successfully!')
      setReportPhone('')
      setReportRows([{ name: '', file: null }])
      fetchDynamicData()
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  if (isAuthChecking) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Loading...</div>

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-2">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full h-12 px-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Login</button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) return <div className="min-h-screen bg-gray-50 p-10 text-center font-semibold text-gray-600">Loading Professional Dashboard...</div>

  const filteredBookings = bookings.filter(b => {
    const matchDoctor = appliedDoctor === 'all' || b.doctor_id?.toString() === appliedDoctor
    const matchDate = appliedDate === 'all' || b.booking_date === appliedDate
    return matchDoctor && matchDate
  })

  const activeBookings = filteredBookings.filter(b => b.status !== 'Completed').length

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        
        <div className="no-print">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Pulse Hospital Admin</h1>
            <button onClick={handleLogout} className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-medium transition">Logout</button>
          </div>

          <div className="flex gap-2 mb-8 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
            <button 
              onClick={() => setActiveTab('appointments')} 
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Doctor Appointments
            </button>
            <button 
              onClick={() => setActiveTab('lab')} 
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${activeTab === 'lab' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Lab & Reports
            </button>
          </div>
        </div>

        {activeTab === 'appointments' && (
          <div>
            <div className="no-print flex flex-wrap gap-4 items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-600">Doctor:</label>
                <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="px-3 py-1.5 border rounded-md bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[200px]">
                  <option value="all">All Doctors</option>
                  {doctors.map(doc => (<option key={doc.id} value={doc.id}>{doc.name}</option>))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-600">Date:</label>
                <select 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  className="px-3 py-1.5 border rounded-md bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All 7 Days (Aksathe)</option>
                  {availableDates.map(date => (
                    <option key={date.dbDate} value={date.dbDate}>
                      {date.displayDate}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleSearchAppointments} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition shadow-sm"
              >
                Search Appointments
              </button>

              <button onClick={downloadPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition shadow-sm ml-auto">
                Download PDF
              </button>
            </div>

            <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-500">Total Appointments</h2>
                <p className="text-4xl font-bold mt-2 text-blue-600">{filteredBookings.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-500">Pending Appointments</h2>
                <p className="text-4xl font-bold mt-2 text-orange-500">{activeBookings}</p>
              </div>
            </div>

            <div id="printable-area" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12">
              <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Pulse Hospital - Appointments List ({appliedDate === 'all' ? 'All 7 Days' : new Date(appliedDate).toLocaleDateString('en-GB')})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-sm uppercase tracking-wider">
                      <th className="px-6 py-3 border-b font-medium">Serial</th>
                      <th className="px-6 py-3 border-b font-medium">Patient Details</th>
                      <th className="px-6 py-3 border-b font-medium">Doctor</th>
                      <th className="px-6 py-3 border-b font-medium">Date</th>
                      <th className="px-6 py-3 border-b font-medium">Status</th>
                      <th className="px-6 py-3 border-b font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 border-b transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600">#{booking.serial_number}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{booking.patient_name} <span className="text-xs font-normal text-gray-500">(Age: {booking.age || 'N/A'})</span></div>
                          <div className="text-sm text-gray-600 font-mono mt-1">{booking.phone}</div>
                          {booking.symptoms && (
                            <div className="text-xs text-orange-600 mt-1.5 bg-orange-50 inline-block px-2 py-0.5 rounded border border-orange-100"><span className="font-semibold">Symptoms:</span> {booking.symptoms}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{booking.doctors?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.booking_date).toLocaleDateString('en-GB')}</td>
                        
                        <td className="px-6 py-4">
                          {booking.status === 'Completed' ? (
                            <span className="text-xs text-gray-400 italic">Done</span>
                          ) : (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Pending</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {booking.status !== 'Completed' ? (
                              <>
                                <button onClick={() => handleMarkComplete(booking.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs transition-colors font-medium">Mark Done</button>
                                <button onClick={() => handleDeleteBooking(booking.id, booking.doctor_id, booking.booking_date, booking.serial_number)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs transition-colors font-medium">Delete</button>
                              </>
                            ) : (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No appointments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="no-print">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Report Upload</h2>
              <form onSubmit={handleUploadReports} className="space-y-4">
                <div className="flex flex-col gap-1 max-w-md">
                  <label className="text-sm font-semibold text-gray-600">Patient Phone</label>
                  <input type="tel" required value={reportPhone} onChange={(e) => setReportPhone(e.target.value)} placeholder="017XXXXXXXX" className="border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-600 block">Reports List</label>
                  {reportRows.map((row, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center bg-gray-50 p-3 rounded-md border">
                      <input 
                        type="text" 
                        required 
                        value={row.name} 
                        onChange={(e) => {
                          const updated = [...reportRows];
                          updated[index].name = e.target.value;
                          setReportRows(updated);
                        }} 
                        placeholder="Report Name (e.g. CBC / X-Ray)" 
                        className="border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px] bg-white" 
                      />
                      <input 
                        type="file" 
                        required 
                        onChange={(e) => {
                          const updated = [...reportRows];
                          updated[index].file = e.target.files?.[0] || null;
                          setReportRows(updated);
                        }} 
                        className="border rounded-md px-4 py-1.5 outline-none bg-white file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 flex-1 min-w-[200px]" 
                      />
                      {reportRows.length > 1 && (
                        <button type="button" onClick={() => removeReportRow(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm">Remove</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 items-center pt-2">
                  <button type="button" onClick={addReportRow} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1">
                    <span>+ Add Another Report</span>
                  </button>

                  <button type="submit" disabled={uploading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition disabled:bg-blue-300 ml-auto">
                    {uploading ? 'Uploading...' : 'Upload All Reports'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b bg-indigo-50 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-indigo-900">Home Sample Collection Requests</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-sm uppercase tracking-wider">
                      <th className="px-6 py-3 border-b font-medium">Collection Date</th>
                      <th className="px-6 py-3 border-b font-medium">Patient Info</th>
                      <th className="px-6 py-3 border-b font-medium">Address</th>
                      <th className="px-6 py-3 border-b font-medium">Tests Required</th>
                      <th className="px-6 py-3 border-b font-medium">Status</th>
                      <th className="px-6 py-3 border-b font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRequests.map((req) => {
                      const isReportUploaded = uploadedPhones.includes(req.phone)

                      return (
                        <tr key={req.id} className="hover:bg-gray-50 border-b transition-colors">
                          <td className="px-6 py-4 font-bold text-indigo-600">{req.collection_date ? new Date(req.collection_date).toLocaleDateString('en-GB') : 'N/A'}</td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{req.patient_name}</div>
                            <div className="text-sm text-gray-600 font-mono mt-1">{req.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">{req.address}</td>
                          <td className="px-6 py-4 text-sm font-medium text-indigo-600">{req.tests}</td>
                          <td className="px-6 py-4">
                            {req.status === 'Completed' ? (<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Collected</span>) : (<span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Pending</span>)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {req.status !== 'Completed' ? (
                                <>
                                  <button onClick={() => handleMarkSampleComplete(req.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs transition-colors font-medium">Mark Collected</button>
                                  <button onClick={() => handleDeleteSampleRequest(req.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs transition-colors font-medium">Delete</button>
                                </>
                              ) : (
                                <>
                                  {isReportUploaded ? (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold inline-flex items-center gap-1">✓ Report Uploaded</span>
                                  ) : (
                                    <button onClick={() => handleQuickUploadReport(req.phone)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs transition-colors font-medium">Upload Report</button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {sampleRequests.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No sample collection requests found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}