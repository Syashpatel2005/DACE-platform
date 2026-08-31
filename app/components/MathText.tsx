import { InlineMath, BlockMath } from "react-katex";

function parseSegments(text: string) {
  const segments: { type: "text" | "inline" | "block"; content: string }[] = [];
  const regex = /\$\$(.+?)\$\$|\$(.+?)\$/gs;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "block", content: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: "inline", content: match[2] });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }
  return segments;
}

export default function MathText({ text }: { text: string }) {
  const segments = parseSegments(text);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "block") {
          return <BlockMath key={i} math={seg.content} />;
        }
        if (seg.type === "inline") {
          return <InlineMath key={i} math={seg.content} />;
        }
        return <span key={i}>{seg.content}</span>;
      })}
    </>
  );
}