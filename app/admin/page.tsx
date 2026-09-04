const stats = [
  {
    label: "TOTAL SISWA",
    value: "1,452",
  },
  {
    label: "TOTAL GURU",
    value: "84",
  },
  {
    label: "TOTAL KELAS",
    value: "36",
  },
  {
    label: "MATA PELAJARAN",
    value: "24",
  },
];

const activities = [
  {
    time: "09:42",
    title: "Guru baru ditambahkan",
    category: "Kategori: Guru",
  },
  {
    time: "08:15",
    title: "Jadwal Ujian Semester dipublikasikan",
    category: "Kategori: Assessment",
  },
  {
    time: "Kemarin",
    title: 'Materi "Algoritma Dasar" diunggah oleh Bpk. Rudi',
    category: "Kategori: Materi",
  },
  {
    time: "Kemarin",
    title: "Maintenance sistem selesai",
    category: "Kategori: Sistem",
  },
];

const management = [
  {
    title: "Kelola Guru",
    description: "Atur akses, profil, dan penugasan mengajar.",
    meta: "84 GURU AKTIF",
  },
  {
    title: "Kelola Siswa",
    description: "Pendaftaran, data diri, dan mutasi siswa.",
    meta: "1,452 SISWA TERDAFTAR",
  },
  {
    title: "Kelola Kelas",
    description: "Pembagian kelas, rombel, dan wali kelas.",
    meta: "36 KELAS AKTIF",
  },
];

const learning = [
  {
    title: "Materi",
    description: "Kelola repository materi pembelajaran.",
  },
  {
    title: "Tugas",
    description: "Pantau penugasan dan pengumpulan.",
  },
  {
    title: "Assessment",
    description: "Konfigurasi ujian dan bank soal.",
  },
];

const evaluation = [
  {
    title: "Penilaian",
    description: "Monitor rekapitulasi nilai akademik.",
  },
  {
    title: "Laporan",
    description: "Cetak / ekspor data statistik performa.",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen px-8 py-8">

      {/* HEADER */}
      <section className="mb-10">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#6F7072]">
          Administrator
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
          Administrator Workspace
        </h1>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#6F7072]">
          Selamat Datang, Admin. Kelola pengguna, struktur akademik,
          konten pembelajaran, dan aktivitas sistem.
        </p>
      </section>

      {/* STATISTICS */}
      <section className="grid grid-cols-4 border-y border-[#292B30]">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-r border-[#292B30] px-5 py-5 last:border-r-0"
          >
            <p className="text-[9px] tracking-[0.12em] text-[#6F7072]">
              {stat.label}
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#F2F0EA]">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* ACTIVITY + ACADEMIC SNAPSHOT */}
      <section className="mt-10 grid grid-cols-2 gap-10">

        {/* ACTIVITY */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">◉</span>

            <h2 className="text-sm font-medium text-[#F2F0EA]">
              Aktivitas Sistem
            </h2>
          </div>

          <div className="border-t border-[#292B30]">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="grid grid-cols-[70px_1fr] gap-4 border-b border-[#202226] py-4"
              >
                <span className="text-[9px] text-[#6F7072]">
                  {activity.time}
                </span>

                <div>
                  <p className="text-[11px] text-[#F2F0EA]">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-[9px] text-[#6F7072]">
                    {activity.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACADEMIC SNAPSHOT */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">▣</span>

            <h2 className="text-sm font-medium text-[#F2F0EA]">
              Academic Snapshot
            </h2>
          </div>

          <div className="border-t border-[#292B30]">

            <div className="flex items-center justify-between border-b border-[#202226] py-4">
              <span className="text-[10px] text-[#6F7072]">
                Kelas Paling Aktif
              </span>

              <span className="text-[10px] text-[#F2F0EA]">
                XII PPLG 1
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#202226] py-4">
              <span className="text-[10px] text-[#6F7072]">
                Materi Terbaru
              </span>

              <span className="text-[10px] text-[#F2F0EA]">
                Pemrograman Web Lanjut
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#202226] py-4">
              <span className="text-[10px] text-[#6F7072]">
                Tugas Terbaru
              </span>

              <span className="text-[10px] text-[#F2F0EA]">
                Proyek Akhir Semester
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#202226] py-4">
              <span className="text-[10px] text-[#6F7072]">
                Assessment Terbaru
              </span>

              <span className="text-[10px] text-[#F2F0EA]">
                Ujian Tengah Semester
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* MANAGEMENT */}
      <section className="mt-12">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#F2F0EA]">
            ⚙ Manajemen
          </h2>

          <button className="bg-[#F59E0B] px-3 py-2 text-[9px] font-medium text-[#0B0C0E] transition hover:bg-[#FFB11B]">
            + TAMBAH DATA
          </button>
        </div>

        <div className="grid grid-cols-3 border-y border-[#292B30]">

          {management.map((item) => (
            <div
              key={item.title}
              className="border-r border-[#292B30] px-5 py-5 last:border-r-0"
            >
              <h3 className="text-[11px] font-medium text-[#F2F0EA]">
                {item.title}
              </h3>

              <p className="mt-2 text-[9px] leading-4 text-[#6F7072]">
                {item.description}
              </p>

              <p className="mt-3 text-[8px] tracking-[0.08em] text-[#F59E0B]">
                {item.meta}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* LEARNING + EVALUATION */}
      <section className="mt-12 grid grid-cols-2 gap-10 pb-10">

        {/* LEARNING */}
        <div>
          <h2 className="mb-5 text-sm font-medium text-[#F2F0EA]">
            ◉ Learning
          </h2>

          <div className="border-t border-[#292B30]">
            {learning.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-[#202226] py-4"
              >
                <div>
                  <h3 className="text-[11px] text-[#F2F0EA]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[9px] text-[#6F7072]">
                    {item.description}
                  </p>
                </div>

                <span className="text-[#A4A3A0]">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* EVALUATION */}
        <div>
          <h2 className="mb-5 text-sm font-medium text-[#F2F0EA]">
            ▣ Evaluation
          </h2>

          <div className="border-t border-[#292B30]">
            {evaluation.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-[#202226] py-4"
              >
                <div>
                  <h3 className="text-[11px] text-[#F2F0EA]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[9px] text-[#6F7072]">
                    {item.description}
                  </p>
                </div>

                <span className="text-[#A4A3A0]">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}