const stats = [
  {
    label: "Materi Tersedia",
    value: "4",
    description: "materi untuk dipelajari",
  },
  {
    label: "Tugas Belum Selesai",
    value: "2",
    description: "perlu segera dikerjakan",
  },
  {
    label: "Progress Belajar",
    value: "78%",
    description: "dari seluruh pembelajaran",
  },
];

const continueLearning = {
  subject: "Pemrograman Web",
  title: "Dasar Next.js",
  progress: 72,
};

const upcomingTasks = [
  {
    title: "Membuat API dengan Next.js",
    subject: "Pemrograman Web",
    due: "2 Sep 2026",
  },
  {
    title: "Implementasi Database MongoDB",
    subject: "Database",
    due: "4 Sep 2026",
  },
];

export default function SiswaPage() {
  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#6F7072]">
          My Learning Space
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
          Good morning, Budi.
        </h1>

        <p className="mt-2 text-sm text-[#6F7072]">
          Lanjutkan pembelajaranmu dan selesaikan tugas yang masih tertunda.
        </p>
      </div>

      {/* STATISTICS */}
      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[#202226] bg-[#111214] p-5"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6F7072]">
              {stat.label}
            </p>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight text-[#F2F0EA]">
                {stat.value}
              </p>
            </div>

            <p className="mt-2 text-xs text-[#6F7072]">
              {stat.description}
            </p>
          </div>
        ))}
      </section>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* CONTINUE LEARNING */}
        <section className="xl:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#F2F0EA]">
                Continue Learning
              </p>

              <p className="mt-1 text-xs text-[#6F7072]">
                Lanjutkan materi terakhir yang kamu pelajari.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[#202226] bg-[#111214] p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6F7072]">
                  {continueLearning.subject}
                </p>

                <h2 className="mt-3 text-lg font-medium text-[#F2F0EA]">
                  {continueLearning.title}
                </h2>

                <p className="mt-2 max-w-md text-xs leading-5 text-[#6F7072]">
                  Pelajari dasar penggunaan Next.js untuk membangun aplikasi
                  web modern.
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-2xl font-semibold text-[#F2F0EA]">
                  {continueLearning.progress}%
                </p>

                <p className="mt-1 text-[10px] text-[#6F7072]">
                  completed
                </p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-6">
              <div className="h-1.5 overflow-hidden rounded-full bg-[#202226]">
                <div
                  className="h-full rounded-full bg-[#F2F0EA]"
                  style={{
                    width: `${continueLearning.progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-[10px] text-[#6F7072]">
                7 dari 10 materi selesai
              </p>

              <button
                type="button"
                className="text-xs font-medium text-[#F2F0EA] transition hover:text-[#A4A3A0]"
              >
                Continue →
              </button>
            </div>
          </div>
        </section>

        {/* UPCOMING TASKS */}
        <section className="xl:col-span-2">
          <div className="mb-3">
            <p className="text-sm font-medium text-[#F2F0EA]">
              Upcoming Tasks
            </p>

            <p className="mt-1 text-xs text-[#6F7072]">
              Tugas yang perlu kamu selesaikan.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#202226] bg-[#111214]">
            {upcomingTasks.map((task, index) => (
              <div
                key={task.title}
                className={`p-5 ${
                  index !== upcomingTasks.length - 1
                    ? "border-b border-[#202226]"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-[#F2F0EA]">
                      {task.title}
                    </h3>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-[#6F7072]">
                      {task.subject}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-md bg-[#1C1D20] px-2 py-1 text-[9px] text-[#A4A3A0]">
                    Pending
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[10px] text-[#6F7072]">
                    Due {task.due}
                  </p>

                  <button
                    type="button"
                    className="text-[10px] font-medium text-[#F2F0EA] transition hover:text-[#A4A3A0]"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* QUICK PROGRESS */}
      <section className="mt-8">
        <div className="mb-3">
          <p className="text-sm font-medium text-[#F2F0EA]">
            Learning Snapshot
          </p>

          <p className="mt-1 text-xs text-[#6F7072]">
            Ringkasan aktivitas belajarmu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#202226] bg-[#111214] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6F7072]">
              Completed
            </p>

            <p className="mt-3 text-xl font-semibold text-[#F2F0EA]">
              12
            </p>

            <p className="mt-1 text-xs text-[#6F7072]">
              materi & tugas selesai
            </p>
          </div>

          <div className="rounded-lg border border-[#202226] bg-[#111214] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6F7072]">
              Average Score
            </p>

            <p className="mt-3 text-xl font-semibold text-[#F2F0EA]">
              86
            </p>

            <p className="mt-1 text-xs text-[#6F7072]">
              rata-rata nilai
            </p>
          </div>

          <div className="rounded-lg border border-[#202226] bg-[#111214] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6F7072]">
              Learning Streak
            </p>

            <p className="mt-3 text-xl font-semibold text-[#F2F0EA]">
              5 days
            </p>

            <p className="mt-1 text-xs text-[#6F7072]">
              terus pertahankan!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}