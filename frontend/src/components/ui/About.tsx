interface Props {
  onBack: () => void;
}

export function About({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-1"
        >
          &larr; กลับไปหน้าแผนที่
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thailand Election 69 อภินิหาร หรือไม่?
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          นี้เป็นเพียงการวิเคราะห์ข้อมูล ไม่ได้ชี้นำหรือกล่าวหาใคร
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            เกี่ยวกับโปรเจกต์นี้
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            โปรเจกต์นี้เป็นการวิเคราะห์ข้อมูลผลการเลือกตั้งครั้งที่ 69
            ของประเทศไทย โดยนำข้อมูลจากแหล่งเปิดมาแสดงผลในรูปแบบแผนที่
            เพื่อให้ประชาชนสามารถตรวจสอบและวิเคราะห์ข้อมูลได้ด้วยตนเอง
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            "กระสุนหล่น" คืออะไร?
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>
              ในการเลือกตั้ง ผู้มีสิทธิเลือกตั้งจะได้รับบัตร 2 ใบ — บัตร
              สส.เขต (เลือกคน) และบัตรบัญชีรายชื่อ (เลือกพรรค)
              โดยหมายเลขบนบัตร สส.เขต คือหมายเลขผู้สมัคร
              ส่วนหมายเลขบนบัตรบัญชีรายชื่อ คือหมายเลขพรรค
              ซึ่งเป็นคนละหมายเลขกัน
            </p>
            <p>
              "กระสุนหล่น" หมายถึงการที่มีการซื้อเสียง
              แล้วผู้ขายเสียงลงคะแนนหมายเลขเดียวกันทั้งสองใบ เช่น
              ถ้าถูกซื้อให้กาเบอร์ 5 ในบัตร สส.เขต ก็กาเบอร์ 5
              ในบัตรบัญชีรายชื่อด้วย
              ทำให้พรรคเล็กที่บังเอิญมีหมายเลขตรงกับผู้สมัคร สส.เขต ที่ชนะ
              ได้คะแนนบัญชีรายชื่อในเขตนั้นสูงผิดปกติเมื่อเทียบกับค่าเฉลี่ยระดับประเทศ
            </p>
            <p>
              การวิเคราะห์นี้เปรียบเทียบคะแนนบัญชีรายชื่อของพรรคที่มีหมายเลขตรงกับผู้สมัครที่ชนะ
              กับค่าเฉลี่ยระดับประเทศของพรรคนั้น หากสูงกว่ามาก
              อาจบ่งชี้ว่าเกิดปรากฏการณ์ "กระสุนหล่น" ในเขตนั้น
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            แหล่งข้อมูลดิบ
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://static-ectreport69.ect.go.th/data/data/refs/info_party_overview.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                ECT — ข้อมูลภาพรวมพรรค (info_party_overview.json)
              </a>
            </li>
            <li>
              <a
                href="https://stats-ectreport69.ect.go.th/data/records/stats_party.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                ECT — สถิติพรรค (stats_party.json)
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            แรงบันดาลใจและอ้างอิง
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.thaipbs.or.th/election69/result/en/geo?region=all&view=area"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                Thai PBS — Election 69 Results Map
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Pethon/election_69_analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                Pethon/election_69_analyzer — GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/smiley159/election-69"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                smiley159/election-69 — GitHub
              </a>
            </li>
            <li>
              <a
                href="https://drive.google.com/drive/folders/1Um_xLk5kmzX9VSSTJ_jS9YcJ8GuvBy7J?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                Google Drive — เอกสารวิเคราะห์
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/p/1HXFFzfwZE/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                Facebook — โพสต์วิเคราะห์
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
