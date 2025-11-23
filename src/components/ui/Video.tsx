interface VideoProps {
  value: {
    url: string
    caption?: string
  }
}

function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/
  )
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return url
  }

  return null
}

export function Video({ value }: VideoProps) {
  const embedUrl = getVideoEmbedUrl(value.url)

  if (!embedUrl) {
    return (
      <div className="my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          Unsupported video URL format. Please use YouTube, Vimeo, or a direct video file.
        </p>
      </div>
    )
  }

  const isDirectVideo = value.url.match(/\.(mp4|webm|ogg)$/i)

  return (
    <figure className="my-8">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
        {isDirectVideo ? (
          <video
            controls
            className="w-full h-full"
            src={embedUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={value.caption || 'Video'}
          />
        )}
      </div>
      {value.caption && (
        <figcaption className="text-center text-sm text-gray-600 mt-3">
          {value.caption}
        </figcaption>
      )}
    </figure>
  )
}
