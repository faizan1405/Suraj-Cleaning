"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
  fill = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setErrored(false);
  }, [src]);

  if (errored || !imgSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-[#f1f5f9] text-slate-400 ${
          fill ? "absolute inset-0" : ""
        } ${className ?? ""}`}
      >
        <svg
          className="w-10 h-10 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25A2.25 2.25 0 0 1 5.25 3h4.5a.75.75 0 0 1 .53.22l2.47 2.47h5.25A2.25 2.25 0 0 1 21 7.5v10.5a2.25 2.25 0 0 1-2.25 2.25Z"
          />
        </svg>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={0}
      height={0}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
