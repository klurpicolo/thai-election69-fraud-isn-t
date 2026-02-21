import { useLanguage } from "../../lib/i18n";

interface Props {
  onBack: () => void;
}

export function About({ onBack }: Props) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-1"
        >
          &larr; {t.backToMap}
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.title}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {t.subtitle}
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {t.aboutProject}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t.aboutProjectContent}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {t.whatIsSpillover}
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>{t.spilloverP1}</p>
            <p>{t.spilloverP2}</p>
            <p>{t.spilloverP3}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {t.rawDataSources}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://static-ectreport69.ect.go.th/data/data/refs/info_party_overview.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                {t.ectPartyOverview}
              </a>
            </li>
            <li>
              <a
                href="https://stats-ectreport69.ect.go.th/data/records/stats_party.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                {t.ectStatsParty}
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {t.inspirationAndReferences}
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
                {t.analysisDocuments}
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/p/1HXFFzfwZE/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
              >
                {t.analysisFacebook}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
