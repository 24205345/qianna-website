"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageBlob } from "./get-cropped-image";

const ASPECT = 16 / 9;

interface ProfilePhotoCropFieldProps {
  currentImageUrl: string;
  currentImageAlt: string;
}

const labelClass = "block text-sm font-medium text-stone-700";
const helpClass = "mt-1 text-xs leading-5 text-stone-500";

export default function ProfilePhotoCropField({
  currentImageUrl,
  currentImageAlt,
}: ProfilePhotoCropFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickInputRef = useRef<HTMLInputElement>(null);

  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("profile-photo.jpg");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [sourceUrl, previewUrl]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function resetCropState() {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(null);
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    if (pickInputRef.current) pickInputRef.current.value = "";
  }

  function handlePickFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(null);
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);

    setFileName(file.name.replace(/\.[^.]+$/, "") + ".jpg");
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    setIsCropping(true);
  }

  async function handleApplyCrop() {
    if (!sourceUrl || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedImageBlob(sourceUrl, croppedAreaPixels);
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      resetCropState();
    } catch {
      setError("Could not crop the image. Try another file.");
    }
  }

  function handleClearSelection() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
  }

  const displayUrl = previewUrl ?? (currentImageUrl || null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass} htmlFor="profile_image_pick">
          Upload profile photo (optional)
        </label>
        <input
          ref={pickInputRef}
          id="profile_image_pick"
          type="file"
          accept="image/*"
          onChange={handlePickFile}
          className="mt-1 w-full text-sm text-stone-600 file:mr-4 file:rounded-md file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-stone-700"
        />
        <p className={helpClass}>
          Choose any photo, then crop to 16:9 landscape before saving. No need to resize beforehand.
        </p>
      </div>

      <input ref={fileInputRef} type="file" name="profile_image" className="hidden" tabIndex={-1} />

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {isCropping && sourceUrl ? (
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm font-medium text-stone-800">Crop to 16:9</p>
          <p className={helpClass}>Drag to reposition. Scroll to zoom.</p>

          <div className="relative mt-3 aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-stone-200">
            <Cropper
              image={sourceUrl}
              crop={crop}
              zoom={zoom}
              aspect={ASPECT}
              objectFit="cover"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApplyCrop}
              className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700"
            >
              Apply crop
            </button>
            <button
              type="button"
              onClick={resetCropState}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {previewUrl ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-stone-500">New cropped photo ready — save the form to upload.</p>
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-700"
          >
            Clear selection
          </button>
        </div>
      ) : null}

      {displayUrl ? (
        <div>
          <p className={labelClass}>
            {previewUrl ? "Cropped preview" : "Current profile photo preview"}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt={currentImageAlt}
            className="mt-2 aspect-video w-full max-w-4xl rounded-2xl border border-stone-200 object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
