// components/BannerAd.tsx
import Image from "next/image";

interface BannerAdProps {
  image: string;
  alt: string;
}

export default function BannerAd({ image, alt }: BannerAdProps) {
  return (
    <div className="relative h-20 rounded-lg overflow-hidden">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
