export interface Translations {
  title: string;
  subtitle: string;
  aboutLink: string;
  loading: string;
  hideControls: string;
  showControls: string;
  constituency: string;
  partyList: string;
  spillover: string;
  ballotMatch: string;
  noMatch: string;
  low: string;
  high: string;
  showPartyColor: string;
  showGradient: string;
  clickToToggle: string;
  selectNumber: string;
  nationalAvg: string;
  belowLabel: string;
  hideBelowLabel: string;
  off: string;
  votes: string;
  rank2: string;
  margin: string;
  turnout: string;
  constituencyWinner: string;
  partyListLucky: string;
  ballotNumber: string;
  fromParty: string;
  votesInArea: string;
  nationalAvgTooltip: string;
  excess: string;
  suspicious: string;
  notSmallParty: string;
  noSpilloverData: string;
  noBallotData: string;
  partyListMatchingNumber: string;
  sameNumberConstituency: string;
  party: string;
  noCandidate: string;
  points: string;
  backToMap: string;
  aboutProject: string;
  aboutProjectContent: string;
  whatIsSpillover: string;
  spilloverP1: string;
  spilloverP2: string;
  spilloverP3: string;
  rawDataSources: string;
  ectPartyOverview: string;
  ectStatsParty: string;
  inspirationAndReferences: string;
  analysisDocuments: string;
  analysisFacebook: string;
}

const th: Translations = {
  // App
  title: "Thailand Election 69 อภินิหาร หรือไม่?",
  subtitle: "นี้เป็นเพียงการวิเคราะห์ข้อมูล ไม่ได้ชี้นำหรือกล่าวหาใคร",
  aboutLink: "เกี่ยวกับ",
  loading: "Loading election data...",
  hideControls: "Hide controls",
  showControls: "Show controls",

  // ViewToggle
  constituency: "สส.เขต",
  partyList: "บช.รายชื่อ",
  spillover: "กระสุนหล่น หรือไม่?",
  ballotMatch: "เบอร์ตรง",

  // Legend
  noMatch: "No match",
  low: "Low",
  high: "High (+3%+)",
  showPartyColor: "แสดงสีพรรค",
  showGradient: "ไล่เชดสี",
  clickToToggle: "กดเพื่อเปลี่ยน",
  selectNumber: "เลือกเบอร์:",
  nationalAvg: "เฉลี่ยประเทศ",
  belowLabel: "ต่ำ/ไม่เกิน",
  hideBelowLabel: "ซ่อนเขตที่ต่ำกว่า:",
  off: "ปิด",

  // Tooltip
  votes: "คะแนน",
  rank2: "อันดับ 2",
  margin: "ห่าง",
  turnout: "ผู้มาใช้สิทธิ",
  constituencyWinner: "ผู้ชนะ สส.เขต",
  partyListLucky: "บช.รายชื่อ ผู้รับโชค",
  ballotNumber: "เบอร์",
  fromParty: "จากพรรค",
  votesInArea: "คะแนนในเขต",
  nationalAvgTooltip: "ค่าเฉลี่ยประเทศ",
  excess: "ส่วนต่าง",
  suspicious: "น่าสงสัย หรือไม่?: พรรคเล็กได้คะแนนเกินปกติ ตรงกับเบอร์ผู้ชนะ สส.เขต",
  notSmallParty: "พรรคที่ตรงเบอร์ไม่ใช่พรรคเล็ก — โอกาสกระสุนหล่นต่ำ",
  noSpilloverData: "ไม่มีข้อมูลกระสุนหล่น",
  noBallotData: "ไม่มีข้อมูลเบอร์ตรง",
  partyListMatchingNumber: "บช.รายชื่อ (พรรคตรงเบอร์)",
  sameNumberConstituency: "สส.เขต เบอร์เดียวกัน",
  party: "พรรค",
  noCandidate: "ไม่มีผู้สมัคร",
  points: "จุด",

  // About
  backToMap: "กลับไปหน้าแผนที่",
  aboutProject: "เกี่ยวกับโปรเจกต์นี้",
  aboutProjectContent:
    "โปรเจกต์นี้เป็นการวิเคราะห์ข้อมูลผลการเลือกตั้งครั้งที่ 69 ของประเทศไทย โดยนำข้อมูลจากแหล่งเปิดมาแสดงผลในรูปแบบแผนที่ เพื่อให้ประชาชนสามารถตรวจสอบและวิเคราะห์ข้อมูลได้ด้วยตนเอง",
  whatIsSpillover: '"กระสุนหล่น" คืออะไร?',
  spilloverP1:
    "ในการเลือกตั้ง ผู้มีสิทธิเลือกตั้งจะได้รับบัตร 2 ใบ — บัตร สส.เขต (เลือกคน) และบัตรบัญชีรายชื่อ (เลือกพรรค) โดยหมายเลขบนบัตร สส.เขต คือหมายเลขผู้สมัคร ส่วนหมายเลขบนบัตรบัญชีรายชื่อ คือหมายเลขพรรค ซึ่งเป็นคนละหมายเลขกัน",
  spilloverP2:
    '"กระสุนหล่น" หมายถึงการที่มีการซื้อเสียง แล้วผู้ขายเสียงลงคะแนนหมายเลขเดียวกันทั้งสองใบ เช่น ถ้าถูกซื้อให้กาเบอร์ 5 ในบัตร สส.เขต ก็กาเบอร์ 5 ในบัตรบัญชีรายชื่อด้วย ทำให้พรรคเล็กที่บังเอิญมีหมายเลขตรงกับผู้สมัคร สส.เขต ที่ชนะ ได้คะแนนบัญชีรายชื่อในเขตนั้นสูงผิดปกติเมื่อเทียบกับค่าเฉลี่ยระดับประเทศ',
  spilloverP3:
    "การวิเคราะห์นี้เปรียบเทียบคะแนนบัญชีรายชื่อของพรรคที่มีหมายเลขตรงกับผู้สมัครที่ชนะ กับค่าเฉลี่ยระดับประเทศของพรรคนั้น หากสูงกว่ามาก อาจบ่งชี้ว่าเกิดปรากฏการณ์ \"กระสุนหล่น\" ในเขตนั้น",
  rawDataSources: "แหล่งข้อมูลดิบ",
  ectPartyOverview: "ECT — ข้อมูลภาพรวมพรรค (info_party_overview.json)",
  ectStatsParty: "ECT — สถิติพรรค (stats_party.json)",
  inspirationAndReferences: "แรงบันดาลใจและอ้างอิง",
  analysisDocuments: "Google Drive — เอกสารวิเคราะห์",
  analysisFacebook: "Facebook — โพสต์วิเคราะห์",
};

const en: Translations = {
  // App
  title: "Thailand Election 69: Miracle or Not?",
  subtitle: "This is only a data analysis — not an accusation or implication of anyone.",
  aboutLink: "About",
  loading: "Loading election data...",
  hideControls: "Hide controls",
  showControls: "Show controls",

  // ViewToggle
  constituency: "Constituency",
  partyList: "Party List",
  spillover: "Spillover Votes?",
  ballotMatch: "Ballot Match",

  // Legend
  noMatch: "No match",
  low: "Low",
  high: "High (+3%+)",
  showPartyColor: "Party colors",
  showGradient: "Gradient",
  clickToToggle: "click to toggle",
  selectNumber: "Select number:",
  nationalAvg: "National avg",
  belowLabel: "Low/below",
  hideBelowLabel: "Hide areas below:",
  off: "Off",

  // Tooltip
  votes: "votes",
  rank2: "Rank 2",
  margin: "Margin",
  turnout: "Turnout",
  constituencyWinner: "Constituency Winner",
  partyListLucky: "Party List Lucky Beneficiary",
  ballotNumber: "No.",
  fromParty: "from",
  votesInArea: "Votes in area",
  nationalAvgTooltip: "National avg",
  excess: "Excess",
  suspicious: "Suspicious? Small party received abnormally high votes matching constituency winner's number",
  notSmallParty: "Matching party is not a small party — low spillover probability",
  noSpilloverData: "No spillover data",
  noBallotData: "No ballot match data",
  partyListMatchingNumber: "Party List (matching number)",
  sameNumberConstituency: "Constituency (same number)",
  party: "Party",
  noCandidate: "No candidate",
  points: "pts",

  // About
  backToMap: "Back to map",
  aboutProject: "About This Project",
  aboutProjectContent:
    "This project analyzes the results of Thailand's 69th general election using open data displayed on an interactive map, allowing citizens to verify and analyze the data themselves.",
  whatIsSpillover: 'What is "Spillover Voting"?',
  spilloverP1:
    "In Thai elections, voters receive two ballots — a constituency ballot (vote for a candidate) and a party-list ballot (vote for a party). The number on the constituency ballot is the candidate's number, while the number on the party-list ballot is the party's number — these are different numbering systems.",
  spilloverP2:
    '"Spillover voting" refers to vote-buying where the voter marks the same number on both ballots. For example, if paid to vote for No. 5 on the constituency ballot, they also mark No. 5 on the party-list ballot. This causes small parties that happen to share the same number as the winning constituency candidate to receive abnormally high party-list votes in that area compared to their national average.',
  spilloverP3:
    "This analysis compares the party-list votes of parties whose number matches the winning constituency candidate against that party's national average. If significantly higher, it may indicate the \"spillover voting\" phenomenon in that constituency.",
  rawDataSources: "Raw Data Sources",
  ectPartyOverview: "ECT — Party Overview Data (info_party_overview.json)",
  ectStatsParty: "ECT — Party Statistics (stats_party.json)",
  inspirationAndReferences: "Inspiration & References",
  analysisDocuments: "Google Drive — Analysis Documents",
  analysisFacebook: "Facebook — Analysis Post",
};

export type Language = "th" | "en";
export const translations: Record<Language, Translations> = { th, en };
