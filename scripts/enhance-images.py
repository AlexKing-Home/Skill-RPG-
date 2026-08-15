from pathlib import Path

import cv2
import numpy as np
import pillow_avif  # noqa: F401 - registers AVIF support in Pillow
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

PORTRAITS = [
    ROOT / "public/skins/male-swordsman.jpg",
    ROOT / "public/skins/male-spearman.jpg",
    ROOT / "public/skins/male-assassin.jpg",
    ROOT / "public/skins/male-archer.jpg",
    ROOT / "public/skins/female-swordsman.jpg",
    ROOT / "public/skins/female-spearman.avif",
    ROOT / "public/skins/female-assassin.avif",
    ROOT / "public/skins/female-archer.avif",
]

MAPS = [
    ROOT / "public/ui/world-map-reference-v2.webp",
    ROOT / "public/ui/world-map.webp",
    ROOT / "public/ui/location-map-reference-v2.webp",
    ROOT / "public/ui/location-map.webp",
]


def resize_for_target(image: np.ndarray, *, target_height=None, target_width=None):
    height, width = image.shape[:2]
    if target_height is not None:
        scale = max(1.0, target_height / height)
    else:
        scale = max(1.0, target_width / width)

    size = (int(round(width * scale)), int(round(height * scale)))
    if size == (width, height):
        return image
    return cv2.resize(image, size, interpolation=cv2.INTER_LANCZOS4)


def improve_detail(image: np.ndarray):
    # Preserve the approved artwork: only gentle denoise, local contrast and sharpening.
    image = cv2.bilateralFilter(image, 5, 14, 14)

    lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
    light, channel_a, channel_b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.22, tileGridSize=(8, 8))
    enhanced_light = clahe.apply(light)
    contrast = cv2.cvtColor(
        cv2.merge((enhanced_light, channel_a, channel_b)), cv2.COLOR_LAB2RGB
    )
    image = cv2.addWeighted(image, 0.7, contrast, 0.3, 0)

    blurred = cv2.GaussianBlur(image, (0, 0), 0.85)
    image = cv2.addWeighted(image, 1.34, blurred, -0.34, 0)
    return np.clip(image, 0, 255).astype(np.uint8)


def save_image(path: Path, image: np.ndarray):
    output = Image.fromarray(image)
    suffix = path.suffix.lower()
    if suffix in {".jpg", ".jpeg"}:
        output.save(path, "JPEG", quality=94, optimize=True, progressive=True)
    elif suffix == ".webp":
        output.save(path, "WEBP", quality=93, method=6)
    elif suffix == ".avif":
        output.save(path, "AVIF", quality=90, speed=5)
    else:
        raise ValueError(f"Unsupported image format: {path}")


def enhance(path: Path, *, target_height=None, target_width=None):
    with Image.open(path) as source:
        rgb = source.convert("RGB")
    image = np.asarray(rgb)
    image = resize_for_target(
        image, target_height=target_height, target_width=target_width
    )
    image = improve_detail(image)
    save_image(path, image)
    height, width = image.shape[:2]
    print(f"enhanced {path.relative_to(ROOT)} -> {width}x{height}")


def main():
    for portrait in PORTRAITS:
        enhance(portrait, target_height=1280)
    for map_image in MAPS:
        enhance(map_image, target_width=1600)


if __name__ == "__main__":
    main()
