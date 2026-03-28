import type { Resource } from "../../types";
import { useResourceTypes } from "../../hooks/useResourceTypes";

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const { data: resourceTypes = [] } = useResourceTypes()
  const typeRecord = resourceTypes.find((rt) => rt.value === resource.type)
  const badgeClass = typeRecord ? `badge-${typeRecord.color}` : 'badge-ghost'

  return (
    <div
      className="card bg-base-100 border-2 border-base-200 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer rounded-2xl min-h-[180px]"
      onClick={() => onClick(resource)}
    >
      <div className="card-body gap-3 p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`badge badge-sm font-bold uppercase tracking-wide rounded-md py-3 px-2 ${badgeClass}`}
          >
            {typeRecord?.emoji} {resource.type}
          </span>
          {resource.category && (
            <span className="text-xs text-base-content/40 font-medium">
              {resource.category.name}
            </span>
          )}
          {resource.language === 'es' && (
            <span className="text-xs text-base-content/40 ml-auto">🇪🇸</span>
          )}
        </div>
        <h3 className="font-bold text-base leading-snug line-clamp-2 tracking-tight">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-sm text-base-content/60 line-clamp-3 leading-relaxed">
            {resource.description}
          </p>
        )}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {resource.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="badge badge-ghost badge-xs">
                {tag.name}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="badge badge-ghost badge-xs">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
