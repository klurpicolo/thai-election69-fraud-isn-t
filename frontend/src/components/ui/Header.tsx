import type { ViewMode } from "../../lib/types";

interface Props {
  view: ViewMode;
}

const descriptions: Record<ViewMode, string> = {
  constituency:
    "Showing which party won each constituency area. Hover to see winner details.",
  partyList:
    "Showing which party won the most party-list votes in each area.",
  spillover:
    'Testing the "number spillover" hypothesis',
  ballotMatch:
    "Comparing party-list votes for small parties whose number matches a constituency candidate's ballot number.",
  // spillover:
  //   'Testing the "number spillover" hypothesis: when voters are told to vote for candidate #N, ' +
  //   "they may also write #N on the party-list paper, accidentally boosting whichever small party " +
  //   "has that national number. Red areas show where a small party got excess votes matching the " +
  //   "winning candidate's ballot number.",
};

export function Header({ view }: Props) {
  return (
    <header className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        Thailand Election 69 — Fraud Analysis
      </h1>
      <p className="text-sm text-gray-500 mt-1 max-w-2xl mx-auto">
        {descriptions[view]}
      </p>
    </header>
  );
}
