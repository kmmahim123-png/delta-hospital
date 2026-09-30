export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export type Day = typeof DAYS[number];

export const SPECIALIZATIONS = [
  "General Surgery & Medicine",
  "Medicine & Cardiology",
  "Medicine & Chest Diseases",
  "Cardiology & Medicine",
  "ENT Specialist & Surgeon",
  "Medicine & Hormone",
  "General, Laparoscopic & Urology Surgeon",
  "General & Laparoscopic Surgeon",
  "Gynae & Obs Specialist & Surgeon",
  "Gynae, Obs & Infertility",
  "Newborn, Child & Adolescent Specialist",
  "Skin, Venereal, Allergy",
  "Dermatology & Dermatosurgery",
  "Orthopedics & Trauma",
  "Medicine & Chest Disease Specialist"
] as const;

export type Specialization = string;

export interface ScheduleSlot {
  days: string[];
  time: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  specialization: string;
  title: string;
  qualifications: string;
  experience?: string;
  photo: string;
  fee?: number;
  room?: string;
  schedule: ScheduleSlot[];
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Md. Farhad Hossain",
    nameBn: "ডাঃ মোঃ ফরহাদ হোসেন",
    specialization: "General Surgery & Medicine",
    title: "Chairman, Pulse Specialised Hospital Ltd. | Surgeon & General Physician, Mugda Medical College Hospital",
    qualifications: "MBBS (Dhaka), CCD-Diabetology (BIRDEM), CCD-Cardiology (BIRDEM), FCPS (Part-2) Colorectal Surgery",
    photo: "", 
    fee: 800,
    room: "201",
    schedule: [{ days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], time: "7:00 PM - 10:00 PM" }],
  },
  {
    id: "2",
    name: "Dr. Md. Sohel Rana",
    nameBn: "ডাঃ মোঃ সোহেল রানা",
    specialization: "Medicine & Cardiology",
    title: "Managing Director, Pulse Specialised Hospital Ltd. | General Physician, Dhaka Medical College Hospital",
    qualifications: "MBBS (Dhaka), CCD (BIRDEM), CCD-Cardiology (BIRDEM), FCPS (Cardiology) Course",
    photo: "",
    fee: 800,
    room: "202",
    schedule: [{ days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], time: "7:00 PM - 10:00 PM" }],
  },
  {
    id: "3",
    name: "Dr. Md. Monir Hossain",
    nameBn: "ডাঃ মোঃ মনির হোসেন",
    specialization: "Medicine & Chest Diseases",
    title: "Director, Pulse Specialised Hospital Ltd. | Ex-Registrar (Medicine), Dhaka Medical College Hospital",
    qualifications: "MBBS, MRCP (London), FCPS (Medicine), Ex-Ad-din BRUYH Medical College",
    photo: "",
    fee: 800,
    room: "203",
    schedule: [{ days: ["Sat", "Mon", "Thu"], time: "7:00 PM - 9:00 PM" }],
  },
  {
    id: "4",
    name: "Dr. Md. Hasan Iqbal",
    nameBn: "ডাঃ মোঃ হাসান ইকবাল",
    specialization: "Cardiology & Medicine",
    title: "National Institute of Cardiovascular Diseases, Sher-e-Bangla Nagar, Dhaka",
    qualifications: "MBBS, BCS (Health), MD (Cardiology), FCPS (Medicine-F), CCD (BIRDEM)",
    photo: "",
    fee: 800,
    room: "204",
    schedule: [{ days: ["Sun", "Wed"], time: "7:00 PM - 9:00 PM" }],
  },
  {
    id: "5",
    name: "Dr. M. A. Hasnat",
    nameBn: "ডাঃ এম এ হাসনাত",
    specialization: "ENT Specialist & Surgeon",
    title: "Consultant, Pulse Specialised Hospital Ltd. | ENT Dept., Dhaka Medical College Hospital",
    qualifications: "MBBS, BCS (Health), DLO (ENT), Ex-PG Hospital Dhaka",
    photo: "",
    fee: 800,
    room: "205",
    schedule: [{ days: ["Sat", "Sun", "Mon", "Wed"], time: "6:00 PM - 7:00 PM" }],
  },
  {
    id: "6",
    name: "Dr. Nahid Hasan",
    nameBn: "ডাঃ নাহিদ হাসান",
    specialization: "Medicine & Hormone",
    title: "Asst. Registrar (Hormone Dept.), Shaheed Suhrawardy Medical College Hospital",
    qualifications: "MBBS, BCS (Health), FCPS (Medicine), D-Card (BSMMU), CCD (BIRDEM)",
    photo: "",
    fee: 800,
    room: "206",
    schedule: [{ days: ["Mon", "Wed"], time: "3:00 PM - 5:00 PM" }],
  },
  {
    id: "7",
    name: "Dr. Md. Nazmul Arefin",
    nameBn: "ডাঃ মোঃ নাজমুল আরেফিন",
    specialization: "General, Laparoscopic & Urology Surgeon",
    title: "Consultant (Surgery), Dhaka Medical College Hospital",
    qualifications: "MBBS, MCPS (Surgery), FCPS (Surgery), FCPS (Urology Thesis)",
    photo: "",
    fee: 800,
    room: "207",
    schedule: [{ days: ["Sat", "Mon"], time: "7:00 PM - 9:00 PM" }],
  },
  {
    id: "8",
    name: "Dr. Md. Abdullah Al Mansur",
    nameBn: "ডাঃ মোঃ আব্দুল্লাহ আল মানসুর",
    specialization: "General & Laparoscopic Surgeon",
    title: "Assistant Professor (Surgery), Dhaka National Medical College | Hepatobiliary Surgeon, PG Hospital",
    qualifications: "MBBS, FCPS (Surgery)",
    photo: "",
    fee: 800,
    room: "208",
    schedule: [{ days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], time: "On Call" }],
  },
  {
    id: "9",
    name: "Dr. Sabina Yasmin",
    nameBn: "ডাঃ সাবিনা ইয়াসমিন",
    specialization: "Gynae & Obs Specialist & Surgeon",
    title: "OCC (Dhaka Medical College Hospital) | Infertility & Laparoscopy Specialist",
    qualifications: "MBBS, BCS (Health), FCPS, MCPS (Gynae & Obs), DMUD (Ultra)",
    photo: "",
    fee: 800,
    room: "209",
    schedule: [{ days: ["Mon", "Tue", "Fri"], time: "7:00 PM - 9:00 PM" }],
  },
  {
    id: "10",
    name: "Dr. Sharira Subha Arthe",
    nameBn: "ডাঃ শারীরা সুবহা অর্থী",
    specialization: "Gynae, Obs & Infertility",
    title: "Director, Pulse Specialised Hospital Ltd. & Consultant Sonologist",
    qualifications: "MBBS, FCPS (Gynae & Obs) Part-2, DMU (BSMMU), Special Training in Infertility (Dataset), Advanced Training in Hysterectomy, Thyroid & Breast Ultrasonogram, CCD (BIRDEM)",
    photo: "",
    fee: 800,
    room: "210",
    schedule: [{ days: ["Sun", "Tue", "Thu"], time: "7:00 PM - 9:00 PM" }],
  },
  {
    id: "11",
    name: "Dr. Ayesha Akter",
    nameBn: "ডাঃ আয়েশা আক্তার",
    specialization: "Gynae & Obs Specialist & Surgeon",
    title: "Mugda Medical College Hospital, Dhaka",
    qualifications: "MBBS, BCS (Health), MS (Gynae & Obs), PGT in Gynae Oncology (NICRH)",
    photo: "",
    fee: 800,
    room: "211",
    schedule: [{ days: ["Sun", "Wed"], time: "7:00 PM - 9:00 PM" }],
  },
  {
    id: "12",
    name: "Dr. Naima Sultana",
    nameBn: "ডাঃ নাঈমা সুলতana",
    specialization: "Newborn, Child & Adolescent Specialist",
    title: "Ex-Assistant Director, Bangladesh National Nutrition Council | PG Hospital Dhaka",
    qualifications: "MBBS, BCS (Health), FCPS (Paediatrics)",
    photo: "",
    fee: 800,
    room: "212",
    schedule: [{ days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], time: "8:00 PM - 10:00 PM" }],
  },
  {
    id: "13",
    name: "Prof. Dr. Oanaiza Rahman",
    nameBn: "অধ্যাপক ডাঃ ওয়ানাইজা রহমান",
    specialization: "Skin, Venereal, Allergy",
    title: "Dhaka National Medical College, Dhaka",
    qualifications: "MBBS, M.Phil (DU), Special Training in Dermatology (Singapore)",
    photo: "",
    fee: 800,
    room: "213",
    schedule: [{ days: ["Sun", "Tue", "Thu"], time: "7:00 PM - 8:30 PM" }],
  },
  {
    id: "14",
    name: "Dr. Tarek Md. Shahjahan",
    nameBn: "ডাঃ তারেক মোঃ শাহজাহান",
    specialization: "Dermatology & Dermatosurgery",
    title: "Dhaka Medical College Hospital, Dhaka",
    qualifications: "MBBS, BCS (Health), MD (Dermatology), Fellowship in Dermatology",
    photo: "",
    fee: 800,
    room: "214",
    schedule: [{ days: ["Mon", "Wed"], time: "3:00 PM - 6:00 PM" }],
  },
  {
    id: "15",
    name: "Dr. S.M. Masum Billah",
    nameBn: "ডাঃ এস.এম. মাসুম বিল্লাহ",
    specialization: "Orthopedics & Trauma",
    title: "Asst. Professor, Dept. of Orthopedic Surgery, Dhaka Community Medical College & Hospital",
    qualifications: "MBBS (Sir Salimullah Medical College), D-Ortho (BSMMU, Ex-PG Hospital), AO Trauma & Basic Trauma Training, Special Training in Ilizarov",
    photo: "",
    fee: 800,
    room: "215",
    schedule: [{ days: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"], time: "6:00 PM - 7:00 PM" }],
  },
  {
    id: "16",
    name: "Dr. Naim Ibn Abdur Razzak",
    nameBn: "ডাঃ নাঈম ইবনে আবদুর রাজ্জাক",
    specialization: "Medicine & Chest Disease Specialist",
    title: "Asst. Registrar, National Institute of Diseases of the Chest & Hospital, Mohakhali",
    qualifications: "MBBS (Dhaka), BCS (Health), DMUD (Ultrasonography), MS (Chest Surgery), CCD (BIRDEM)",
    photo: "",
    fee: serial/fee ? 800 : 800,
    room: "216",
    schedule: [{ days: ["Sat", "Sun", "Mon"], time: "7:00 PM - 9:00 PM" }],
  }
];