export default function Video({ source }: { source: string }) {
  const isYouTube = /(?:youtube\.com\/watch\?v=|youtu\.be\/)/i.test(source);
  if (isYouTube) {
    const match = source.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    const id = match ? match[1] : null;
    const embedUrl = id ? `https://www.youtube.com/embed/${id}` : source;

    return (
      <div className="w-full aspect-video rounded-xl border border-neutral-700 mx-auto overflow-hidden">
        <iframe
          src={`${embedUrl}?rel=0`}
          title="Hero video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <video className="w-4/5 aspect-video rounded-xl mx-auto" controls preload="none">
      <source src={source} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}