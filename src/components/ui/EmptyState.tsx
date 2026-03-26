interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="hero min-h-48">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-base-content/60 mt-2 text-sm">{description}</p>}
          {action && (
            <button className="btn btn-primary btn-sm mt-4" onClick={action.onClick}>
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
