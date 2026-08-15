import { useEffect, useRef, useState } from "react";

function decodeBase64DataUrl(dataUrl) {
  const [header, payload = ""] = dataUrl.split(",", 2);
  const mime = header.match(/^data:([^;]+);base64$/)?.[1] ?? "application/octet-stream";
  const binary = window.atob(payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return { bytes, mime };
}

export default function EmbeddedArtCanvas({ dataUrl, className = "", ariaLabel }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    let bitmap = null;

    async function drawArt() {
      setStatus("loading");

      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { bytes, mime } = decodeBase64DataUrl(dataUrl);
        const blob = new Blob([bytes], { type: mime });
        bitmap = await window.createImageBitmap(blob);

        if (cancelled) return;

        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Canvas 2D context is unavailable");

        context.drawImage(bitmap, 0, 0);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    drawArt();

    return () => {
      cancelled = true;
      bitmap?.close?.();
    };
  }, [dataUrl]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        role="img"
        aria-label={ariaLabel}
        data-art-status={status}
      />
      {status !== "ready" && (
        <div className="embedded-art-status" aria-live="polite">
          {status === "error" ? "Не удалось загрузить локацию" : "Загрузка локации…"}
        </div>
      )}
    </>
  );
}
