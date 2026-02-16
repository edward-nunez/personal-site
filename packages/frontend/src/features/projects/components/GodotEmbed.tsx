import { useState } from 'react';

interface GodotEmbedProps {
  url: string;
  title: string;
}

export function GodotEmbed({ url, title }: GodotEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-bg-tertiary rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-fg-muted">Loading game...</p>
          </div>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-fg-secondary mb-2">Failed to load game</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline"
            >
              Open in new tab
            </a>
          </div>
        </div>
      ) : (
        <iframe
          src={url}
          title={title}
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          allow="fullscreen"
        />
      )}
    </div>
  );
}
