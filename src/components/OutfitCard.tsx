import Link from "next/link";
import Image from "next/image";

interface OutfitCardProps {
  id: string;
  title?: string;
  mainImageUrl: string | null;
  categoryName?: string;
}

export default function OutfitCard({
  id,
  title,
  mainImageUrl,
}: OutfitCardProps) {
  return (
    <Link href={`/outfit/${id}`} className="block border-none outline-none group">
      <div className="w-[280px] h-[450px] relative bg-gray-100 rounded-[2rem] overflow-hidden flex flex-col shadow-sm group-hover:shadow-xl transition-all duration-500">
        {mainImageUrl ? (
          <>
            <Image
              src={mainImageUrl}
              alt={title || "Outfit"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 280px, 320px"
            />
            {/* Subtle overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 text-white">
              <span className="block text-sm font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-max">
                View Outfit
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-lg" style={{ fontFamily: "var(--font-serif)" }}>Outfit image</span>
          </div>
        )}
      </div>
    </Link>
  );
}
