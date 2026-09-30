import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { phone, name, serial, date, time, doctorName } = await request.json()

    let formattedPhone = phone.trim()
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "88" + formattedPhone
    }

    const apiKey = "QerHVybO9zWb5VlTnMil"
    const senderId = "8809611080095" // Developers page-e dewa nirdisto sender id

    const message = `Dear ${name}, your appointment with ${doctorName} is confirmed for ${date} at ${time}. Serial No: #${String(serial).padStart(2, '0')}. Thank you, Pulse Specialised Hospital.`

    const smsUrl = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${formattedPhone}&message=${encodeURIComponent(message)}&senderid=${senderId}`

    const response = await fetch(smsUrl)
    const data = await response.json()

    console.log("BulkSMSBD Response:", data)

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("SMS Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}