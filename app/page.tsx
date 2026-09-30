"use client"

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEmergencyModal, setIsEmergencyModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // 2 Slides Setup
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroSlides = [
    {
      title: "Book Doctor Appointments Hassle-Free",
      desc: "Find the right doctor and schedule appointments in just a few clicks with expert specialists.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      bgGradient: "from-[#e0f4f1] to-[#e8f5fe]",
      border: "border-teal-100",
      isEmergency: false
    },
    {
      title: "Quick Reserve & Emergency Ambulance Care",
      desc: "Instant priority admission, stretcher support, and 24/7 rapid ambulance service at your call.",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
      bgGradient: "from-[#fef2f2] to-[#fff1f2]",
      border: "border-rose-100",
      isEmergency: true
    }
  ]

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Touch / Drag swipe handlers for banner
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrentSlide(1)
    } else if (touchEndX.current - touchStartX.current > 50) {
      setCurrentSlide(0)
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Today's date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0]
  const maxDateObj = new Date()
  maxDateObj.setDate(maxDateObj.getDate() + 6)
  const maxDateStr = maxDateObj.toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    doctor_id: '',
    booking_date: todayStr,
    age: '',
    patient_type: 'New',
    symptoms: ''
  })

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [isDoctorAbsent, setIsDoctorAbsent] = useState(false)

  useEffect(() => {
    fetchDoctors()
  }, [])

  async function fetchDoctors() {
    try {
      const { data, error } = await supabase.from('doctors').select('*')
      if (error) throw error
      if (data) setDoctors(data)
    } catch (err) {
      console.error('Error fetching doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  const specializations = Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)))

  const filteredDoctors = formData.specialization 
    ? doctors.filter(d => d.specialization === formData.specialization) 
    : doctors

  const handleDoctorChange = (docId: string) => {
    setFormData(prev => ({ ...prev, doctor_id: docId }))
    const doc = doctors.find(d => d.id.toString() === docId)
    if (doc) {
      setSelectedDoctor(doc)
      setIsDoctorAbsent(doc.status === 'Absent' || doc.status === 'Off')
    } else {
      setSelectedDoctor(null)
      setIsDoctorAbsent(false)
    }
  }

  // Open modal directly from Doctor Card with default selection
  const handleCardClick = (doc: any) => {
    setFormData({
      name: '',
      phone: '',
      specialization: doc.specialization || '',
      doctor_id: doc.id.toString(),
      booking_date: todayStr,
      age: '',
      patient_type: 'New',
      symptoms: ''
    })
    setSelectedDoctor(doc)
    setIsDoctorAbsent(doc.status === 'Absent' || doc.status === 'Off')
    setSubmitted(false)
    setIsModalOpen(true)
  }

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isDoctorAbsent) {
      alert('Selected doctor is absent on this date. Please choose another date or doctor.')
      return
    }

    try {
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', formData.doctor_id)
        .eq('booking_date', formData.booking_date)

      const nextSerial = (count || 0) + 1

      const { error } = await supabase.from('bookings').insert({
        patient_name: formData.name,
        phone: formData.phone,
        doctor_id: formData.doctor_id,
        booking_date: formData.booking_date,
        age: formData.age ? parseInt(formData.age) : null,
        patient_type: formData.patient_type,
        symptoms: formData.symptoms,
        serial_number: nextSerial,
        status: 'Pending'
      })

      if (error) throw error
      setSubmitted(true)
    } catch (err: any) {
      alert('Booking failed: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-teal-100 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <header className="bg-[#0e8377] text-white py-3.5 px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <h2 className="text-[11px] font-medium tracking-wide text-teal-100">ডেল্টা হেলথ কেয়ার যাত্রাবাড়ী লিমিটেড</h2>
              <h1 className="font-bold text-sm sm:text-base">Delta Health Care Jatrabari LTD.</h1>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-teal-100 font-normal">তথ্য যোগাযোগ ও ডাক্টার সিরিয়ালের জন্য হটলাইন</span>
            <a href="tel:01886700789" className="flex items-center gap-2 text-lg sm:text-xl font-extrabold tracking-wider text-white mt-0.5 hover:underline">
              <span>📞</span> <span>০১৮৮৬৭০০৭৮৯</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/admin" className="bg-[#0a665e] hover:bg-[#074e47] text-white px-6 py-2 rounded-lg font-bold text-sm transition shadow-sm border border-teal-600">
              Log In
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`bg-gradient-to-r ${heroSlides[currentSlide].bgGradient} rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between shadow-md border ${heroSlides[currentSlide].border} relative overflow-hidden min-h-[420px] transition-all duration-500`}
          >
            
            {/* Left Content */}
            <div className="max-w-2xl mb-8 md:mb-0 z-10">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                {currentSlide === 0 ? (
                  <>Book Doctor Appointments <span className="text-[#0e8377]">Hassle-Free</span></>
                ) : (
                  <>Quick Reserve & <span className="text-rose-600">Emergency Care</span></>
                )}
              </h1>
              <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
                {heroSlides[currentSlide].desc}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                {currentSlide === 0 ? (
                  <button 
                    onClick={() => { 
                      setFormData({ name: '', phone: '', specialization: '', doctor_id: '', booking_date: todayStr, age: '', patient_type: 'New', symptoms: '' });
                      setSelectedDoctor(null);
                      setSubmitted(false); 
                      setIsModalOpen(true); 
                    }}
                    className="bg-[#0e8377] hover:bg-[#0a665e] text-white px-8 py-3.5 rounded-xl font-bold text-base transition shadow-lg active:scale-95"
                  >
                    Booking Appointment
                  </button>
                ) : (
                  <button 
                    onClick={() => { setSubmitted(false); setIsEmergencyModal(true); }}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 rounded-xl font-bold text-base transition shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <span>⚡ Quick Reserve / Emergency</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Image Container */}
            <div className="w-full md:w-auto flex justify-center z-10">
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[320px] sm:max-w-[360px]">
                <img 
                  src={heroSlides[currentSlide].image} 
                  alt="Hospital Banner" 
                  className="rounded-xl w-full h-[220px] object-cover transition-all duration-700 transform hover:scale-105"
                />
              </div>
            </div>

            {/* Exactly 2 Dots at Bottom Center */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${currentSlide === index ? (currentSlide === 0 ? 'bg-[#0e8377] w-8' : 'bg-rose-600 w-8') : 'bg-slate-300 w-3'}`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* Our Doctors Section */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Our Doctors</h2>
            <div className="flex gap-2">
              <button onClick={scrollLeft} className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 text-slate-700 font-bold transition text-lg shadow-xs">
                ‹
              </button>
              <button onClick={scrollRight} className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 text-slate-700 font-bold transition text-lg shadow-xs">
                ›
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading specialist doctors...</div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {doctors.map((doc) => (
                <div 
                  key={doc.id} 
                  onClick={() => handleCardClick(doc)}
                  className="min-w-[260px] sm:min-w-[280px] bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition snap-start flex-shrink-0 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="w-full h-48 mx-auto rounded-xl bg-slate-100 mb-4 overflow-hidden border border-slate-100">
                    <img 
                      src={doc.image_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"} 
                      alt={doc.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="bg-[#7ac5cd]/40 border border-[#7ac5cd] rounded-xl p-3 text-left">
                    <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                    <p className="text-xs text-slate-700 mt-0.5 font-medium">
                      {doc.specialization || "General Physician"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#93d4df] text-slate-800 py-12 px-6 sm:px-12 mt-16 border-t border-teal-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-base">Delta Health Care Jatrabari Ltd.</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              We’re always by your side on your healthcare journey providing trusted services to help you stay healthy.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base mb-3 text-slate-900">Contact Us</h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <p className="flex items-start gap-2">
                <span>📍</span> <span>169/1-B, West Dholaipar (Opposite to Geet Sangeet Cinnema Hall)</span>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> <a href="tel:01783873354" className="font-mono font-bold hover:underline">01783-873354</a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-3 text-slate-900">Quick Link</h3>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/deltahealthcarejatrabarilimited/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700 font-bold shadow-sm hover:bg-slate-50 transition">f</a>
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700 font-bold shadow-sm hover:bg-slate-50 transition">t</a>
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700 font-bold shadow-sm hover:bg-slate-50 transition">w</a>
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700 font-bold shadow-sm hover:bg-slate-50 transition">in</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-teal-200/60 mt-8 pt-6 text-center text-xs text-slate-700 font-medium">
          Copyright © 2026 Delta Health Care
        </div>
      </footer>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4 font-bold">✓</div>
                <h3 className="text-xl font-bold text-slate-900">Your Appointment Request Submitted Successfully.</h3>
                <p className="text-sm text-slate-500 mt-2">Your appointment will be confirmed through return SMS or telephonic communication.</p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-6 bg-[#0e8377] text-white px-6 py-2 rounded-xl text-sm font-semibold"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Booking Appointment</h3>
                <form onSubmit={handleBookingSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Full Name" 
                        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Your Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="017XXXXXXXX" 
                        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Specialization</label>
                      <select 
                        required
                        value={formData.specialization}
                        onChange={e => setFormData({...formData, specialization: e.target.value, doctor_id: ''})}
                        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec: any, idx) => (
                          <option key={idx} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Select Doctor</label>
                      <select 
                        required
                        value={formData.doctor_id}
                        onChange={e => handleDoctorChange(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        <option value="">Select Doctor</option>
                        {filteredDoctors.map(doc => (
                          <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Doctor Profile Preview Box if doctor selected */}
                  {selectedDoctor && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{selectedDoctor.name}</p>
                        <p className="text-slate-600">{selectedDoctor.degree || "MBBS, Specialist"}</p>
                        <p className="text-[#0e8377] font-medium mt-0.5">{selectedDoctor.workplace || "Delta Health Care & Hospital"}</p>
                      </div>
                      {isDoctorAbsent && (
                        <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-md text-[11px]">
                          ⚠️ Absent Today
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Select Date (Next 7 Days)</label>
                      <input 
                        type="date" 
                        required 
                        min={todayStr}
                        max={maxDateStr}
                        value={formData.booking_date}
                        onChange={e => setFormData({...formData, booking_date: e.target.value})}
                        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Age</label>
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        placeholder="Age" 
                        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">Symptoms / Note</label>
                    <input 
                      type="text" 
                      value={formData.symptoms}
                      onChange={e => setFormData({...formData, symptoms: e.target.value})}
                      placeholder="Brief symptoms..." 
                      className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isDoctorAbsent}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition mt-2 ${isDoctorAbsent ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0e8377] hover:bg-[#0a665e] text-white'}`}
                  >
                    {isDoctorAbsent ? 'Doctor is Absent' : 'Submit Appointment'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      {isEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 border-t-4 border-rose-600">
            <button 
              onClick={() => setIsEmergencyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-rose-600 mb-1">⚡ Quick Reserve & Emergency</h3>
            <p className="text-xs text-slate-500 mb-4">Direct priority support for immediate assistance.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Emergency slot requested! Our team will call you immediately.'); setIsEmergencyModal(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Patient Name</label>
                <input type="text" required placeholder="Full Name" className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Emergency Phone Number</label>
                <input type="tel" required placeholder="017XXXXXXXX" className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Emergency Reason / Details</label>
                <textarea rows={2} required placeholder="Describe emergency condition..." className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-sm transition">
                Confirm Emergency Reserve
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}