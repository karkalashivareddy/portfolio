import StatBlock from "../ui/StatBlock";

export default function CodingVerdict() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 open-list">
      <div className="py-5">
        <StatBlock value={2531} label="Problems solved" source="Codolio aggregate" />
      </div>
      <div className="py-5">
        <StatBlock value={5} label="Platforms" source="CC · LC · GFG · HR · CF" />
      </div>
      <div className="py-5">
        <StatBlock value={50} suffix="+" label="Rated contests" source="36 CodeChef + 14 LeetCode" />
      </div>
      <div className="py-5">
        <StatBlock value={91} suffix="d" label="Longest streak" source="LeetCode · GFG" />
      </div>
    </div>
  );
}
