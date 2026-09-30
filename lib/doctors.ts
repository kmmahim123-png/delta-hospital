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
    title: "Chairman, Pulse Specialised Hospital Ltd.",
    qualifications: "MBBS (Dhaka), CCD-Diabetology, CCD-Cardiology (BIRDEM), FCPS (Part-2)",
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
    title: "Managing Director, Pulse Specialised Hospital Ltd.",
    qualifications: "MBBS (Dhaka), CCD (BIRDEM), FCPS (Cardiology) Course",
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
    title: "Director, Pulse Specialised Hospital Ltd.",
    qualifications: "MBBS, MRCP (London), FCPS (Medicine)",
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
    title: "National Institute of Cardiovascular Diseases",
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
    title: "Consultant, Pulse Specialised Hospital Ltd.",
    qualifications: "MBBS, BCS (Health), DLO (ENT)",
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
    title: "Asst. Registrar, Shaheed Suhrawardy Medical College",
    qualifications: "MBBS, BCS (Health), FCPS (Medicine), D-Card, CCD (BIRDEM)",
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
    qualifications: "MBBS, MCPS, FCPS (Surgery), FCPS (Urology) Thesis",
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
    title: "Assistant Professor, Dhaka National Medical College",
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
    title: "Gynae, Obs & Infertility Specialist",
    qualifications: "MBBS, BCS (Health), FCPS, MCPS (Gynae & Obs), DMUD",
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
    title: "Director, Pulse Specialised Hospital Ltd.",
    qualifications: "MBBS, FCPS (Gynae & Obs) Part-2, DMU, CCD",
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
    qualifications: "MBBS, BCS (Health), MS (Surgery), PGT (Gynae Oncology)",
    photo: "",
    fee: 800,
    room: "211",
    schedule: [{ days: ["Sun", "Wed"], time: "7:00 PM - 9:00 PM" }],
  },
  {
    id: "12",
    name: "Dr. Naima Sultana",
    nameBn: "ডাঃ নাঈমা সুলতানা",
    specialization: "Newborn, Child & Adolescent Specialist",
    title: "Ex-Assistant Director, Bangladesh National Nutrition Council",
    qualifications: "MBBS, BCS (Health), FCPS (Paed), PG Hospital Dhaka",
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
    qualifications: "MBBS, M.Phil (DU)",
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
    qualifications: "MBBS, BCS (Health), MD (Dermatology)",
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
    title: "Asst. Professor, Dhaka Community Medical College",
    qualifications: "MBBS, D-Ortho (BSMMU), AO Trauma Training",
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
    title: "Asst. Registrar, National Institute of Diseases of the Chest",
    qualifications: "MBBS, BCS, DMUD, MS (Chest Surgery), CCD",
    photo: "",
    fee: 800,
    room: "216",
    schedule: [{ days: ["Sat", "Sun", "Mon"], time: "7:00 PM - 9:00 PM" }],
  }
];