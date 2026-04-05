import type { Resource } from "../../types";
import { useResourceTypes } from "../../hooks/useResourceTypes";

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
  style?: React.CSSProperties;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  documentation: {
    bg: 'oklch(0.66 0.18 280 / 0.15)',
    text: 'oklch(0.75 0.16 280)',
    dot: 'oklch(0.66 0.18 280)',
  },
  tool: {
    bg: 'oklch(0.78 0.17 75 / 0.15)',
    text: 'oklch(0.85 0.14 75)',
    dot: 'oklch(0.78 0.17 75)',
  },
  article: {
    bg: 'oklch(0.72 0.17 162 / 0.15)',
    text: 'oklch(0.78 0.14 162)',
    dot: 'oklch(0.72 0.17 162)',
  },
  video: {
    bg: 'oklch(0.65 0.22 25 / 0.15)',
    text: 'oklch(0.72 0.18 25)',
    dot: 'oklch(0.65 0.22 25)',
  },
  course: {
    bg: 'oklch(0.68 0.15 215 / 0.15)',
    text: 'oklch(0.75 0.13 215)',
    dot: 'oklch(0.68 0.15 215)',
  },
}

const DEFAULT_TYPE_COLOR = {
  bg: 'oklch(0.28 0.02 265 / 0.5)',
  text: 'oklch(0.65 0.02 265)',
  dot: 'oklch(0.45 0.02 265)',
}

export function ResourceCard({ resource, onClick, style }: ResourceCardProps) {
  const { data: resourceTypes = [] } = useResourceTypes()
  const typeRecord = resourceTypes.find((rt) => rt.value === resource.type)
  const typeColors = TYPE_COLORS[resource.type] ?? DEFAULT_TYPE_COLOR

  return (
    <div
      className="resource-card flex flex-col gap-3 p-5 min-h-[180px]"
      style={style}
      onClick={() => onClick(resource)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(resource)}
    >
      {/* Top row: type badge + category + language */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="type-badge"
          style={{
            background: typeColors.bg,
            color: typeColors.text,
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: typeColors.dot,
              display: 'inline-block',
              flexShrink: 0,
              boxShadow: `0 0 6px ${typeColors.dot}`,
            }}
          />
          {typeRecord?.emoji} {resource.type}
        </span>

        {resource.category && (
          <span
            className="text-xs font-medium"
            style={{ color: 'oklch(0.48 0.02 265)' }}
          >
            {resource.category.name}
          </span>
        )}

        {resource.language === 'es' && (
          <span
            className="text-xs ml-auto"
            style={{ color: 'oklch(0.48 0.02 265)' }}
          >
            🇪🇸
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="font-bold text-base leading-snug line-clamp-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'oklch(0.92 0.012 265)',
          letterSpacing: '-0.01em',
        }}
      >
        {resource.title}
      </h3>

      {/* Description */}
      {resource.description && (
        <p
          className="text-sm line-clamp-2 leading-relaxed flex-1"
          style={{ color: 'oklch(0.55 0.02 265)' }}
        >
          {resource.description}
        </p>
      )}

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className="tag-pill" style={{ cursor: 'default' }}>
              {tag.name}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="tag-pill" style={{ cursor: 'default' }}>
              +{resource.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
