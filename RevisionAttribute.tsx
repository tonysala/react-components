interface RevisionAttributeProps {
  before: any;
  after: any;
}

export const RevisionAttribute = ({ before, after }: RevisionAttributeProps) => {
  const { from, to } = makeRevisionComparison(before, after);

  return (
    <code className={`revision-attribute ${from !== to ? "changed" : ""}`}>
      {from}
      {to}
    </code>
  );
};

export const makeRevisionComparison = (before: any, after: any) => {
  if (typeof before === 'object' && before?.id) {
    before = `${before.id}`
  }
  if (typeof after === 'object' && after?.id) {
    after = `${after.id}`
  }

  const changed = before !== after;
  const removed = before && !after;

  const from = (
    <div className="revision-change">
      { removed ? (
        <span style={{ color: "red" }}>{before ?? "not set"}</span>
      ) : (
        <span style={changed ? { color: "black" } : { color: "#bbb" }}>{before ?? "not set"}</span>
      ) }
    </div>
  );

  const to = (
    <div className="revision-change">
      <span style={changed ? { color: "green" } : { color: "#bbb" }}>{after ?? "not set"}</span>
    </div>
  );
  return { from, to, changed };
};