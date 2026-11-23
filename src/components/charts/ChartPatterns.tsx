import type { Texture, VulnerabilityLevel } from './chartUtils';
import { levelFill, levelLine, patternId, segmentFill } from './chartUtils';

const LEVELS: VulnerabilityLevel[] = ['least', 'less', 'more', 'most'];
const TEXTURES: Exclude<Texture, 'none'>[] = ['diagonal', 'grid', 'horizontal', 'vertical'];

function lines(texture: Exclude<Texture, 'none'>, stroke: string) {
  const common = { stroke, strokeWidth: 1, strokeOpacity: 0.55 };
  switch (texture) {
    case 'diagonal': return <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" {...common} />;
    case 'grid': return <path d="M4,0 V8 M0,4 H8" {...common} />;
    case 'horizontal': return <path d="M0,4 H8" {...common} />;
    case 'vertical': return <path d="M4,0 V8" {...common} />;
  }
}

/** Put inside an <svg><defs>. Defines every level × texture pattern for this chart. */
export function SegmentPatternDefs({ prefix }: { prefix: string }) {
  return (
    <>
      {LEVELS.flatMap(level =>
        TEXTURES.map(texture => (
          <pattern key={`${level}-${texture}`} id={patternId(prefix, level, texture)} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={levelFill(level)} />
            {lines(texture, levelLine(level))}
          </pattern>
        )),
      )}
    </>
  );
}

/** A small legend swatch that shows the segment's colour and texture. */
export function SegmentSwatch({ level, texture, prefix }: { level: VulnerabilityLevel; texture: Texture; prefix: string }) {
  return (
    <svg width="16" height="16" aria-hidden="true" className="chart-swatch">
      <defs><SegmentPatternDefs prefix={`${prefix}-sw`} /></defs>
      <rect width="16" height="16" rx="2" fill={segmentFill(`${prefix}-sw`, level, texture)} />
    </svg>
  );
}
