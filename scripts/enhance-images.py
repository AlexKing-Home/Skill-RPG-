from __future__ import annotations

import base64
import io
import re
from pathlib import Path

import cv2
import numpy as np
import pillow_avif  # noqa: F401 - registers AVIF support in Pillow
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".webp", ".avif", ".png"}

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

BACKGROUND = ROOT / "public/backgrounds/welcome-bg.jpg"

MAPS = [
    ROOT / "public/ui/world-map-reference-v2.webp",
    ROOT / "public/ui/world-map.webp",
    ROOT / "public/ui/location-map-reference-v2.webp",
    ROOT / "public/ui/location-map.webp",
    ROOT / "public/ui/swamp-location.webp",
]

CRESTS = [
    ROOT / "public/ui/crest.webp",
    ROOT / "public/ui/creation-crest.webp",
]

# Images embedded in JS are part of the shipped game too. Keeping the same
# chunk files avoids changing game logic while allowing a higher-resolution,
# higher-quality encode to be produced by CI without generative tools.
EMBEDDED_ART = [
    {
        "name": "floor-one-map",
        "chunks": sorted((ROOT / "src/data/mapChunks").glob("floor1-*.js")),
        "target_width": 1800,
        "quality": 95,
    },
    {
        "name": "swamp-base",
        "chunks": sorted((ROOT / "src/data/swampLocationChunks").glob("swamp-*.js")),
        "target_width": 1550,
        "quality": 95,
    },
    {
        "name": "swamp-deep-path",
        "chunks": [
            ROOT / "src/data/swampSubLocationChunks/deep-01.js",
            ROOT / "src/data/swampSubLocationChunks/deep-02.js",
        ],
        "target_width": 1536,
        "quality": 95,
    },
    {
        "name": "swamp-roots-burrow",
        "chunks": [
            ROOT / "src/data/swampSubLocationChunks/roots-01.js",
            ROOT / "src/data/swampSubLocationChunks/roots-02.js",
        ],
        "target_width": 1536,
        "quality": 95,
    },
]


def resize_for_target(
    image: np.ndarray,
    *,
    target_height: int | None = None,
    target_width: int | None = None,
    max_scale: float = 4.0,
):
    height, width = image.shape[:2]
    if target_height is not None:
        requested_scale = target_height / height
    else:
        requested_scale = target_width / width

    scale = min(max(1.0, requested_scale), max_scale)
    size = (int(round(width * scale)), int(round(height * scale)))
    if size == (width, height):
        return image
    return cv2.resize(image, size, interpolation=cv2.INTER_LANCZOS4)


def improve_detail(image: np.ndarray):
    """Improve clarity without redesigning or generating any visual content."""
    # Very light edge-preserving cleanup removes compression noise while keeping
    # painted texture. Local contrast and unsharp masking recover perceived
    # detail after browser scaling on high-density mobile displays.
    image = cv2.bilateralFilter(image, 5, 12, 12)

    lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
    light, channel_a, channel_b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.18, tileGridSize=(8, 8))
    enhanced_light = clahe.apply(light)
    contrast = cv2.cvtColor(
        cv2.merge((enhanced_light, channel_a, channel_b)), cv2.COLOR_LAB2RGB
    )
    image = cv2.addWeighted(image, 0.78, contrast, 0.22, 0)

    blurred = cv2.GaussianBlur(image, (0, 0), 0.8)
    image = cv2.addWeighted(image, 1.28, blurred, -0.28, 0)
    return np.clip(image, 0, 255).astype(np.uint8)


def save_image(path: Path, image: np.ndarray):
    output = Image.fromarray(image)
    suffix = path.suffix.lower()
    if suffix in {".jpg", ".jpeg"}:
        output.save(path, "JPEG", quality=95, optimize=True, progressive=True, subsampling=0)
    elif suffix == ".webp":
        output.save(path, "WEBP", quality=95, method=6)
    elif suffix == ".avif":
        output.save(path, "AVIF", quality=92, speed=4)
    elif suffix == ".png":
        output.save(path, "PNG", optimize=True)
    else:
        raise ValueError(f"Unsupported image format: {path}")


def enhance(
    path: Path,
    *,
    target_height: int | None = None,
    target_width: int | None = None,
    max_scale: float = 4.0,
):
    if not path.exists():
        print(f"skip missing {path.relative_to(ROOT)}")
        return

    before_bytes = path.stat().st_size
    with Image.open(path) as source:
        rgb = source.convert("RGB")
        before_size = rgb.size
    image = np.asarray(rgb)
    image = resize_for_target(
        image,
        target_height=target_height,
        target_width=target_width,
        max_scale=max_scale,
    )
    image = improve_detail(image)
    save_image(path, image)
    height, width = image.shape[:2]
    print(
        f"enhanced {path.relative_to(ROOT)}: "
        f"{before_size[0]}x{before_size[1]} -> {width}x{height}; "
        f"{before_bytes} -> {path.stat().st_size} bytes"
    )


def read_chunk(path: Path) -> str:
    source = path.read_text(encoding="utf-8")
    match = re.search(r'export default\s+["\']([^"\']*)["\'];?', source, re.S)
    if not match:
        raise ValueError(f"Cannot read base64 chunk from {path.relative_to(ROOT)}")
    return match.group(1)


def write_chunks(paths: list[Path], encoded: str):
    if not paths:
        raise ValueError("Chunk list is empty")

    # Split evenly so no single generated JS file grows disproportionately.
    chunk_size = (len(encoded) + len(paths) - 1) // len(paths)
    for index, path in enumerate(paths):
        start = index * chunk_size
        end = min(len(encoded), start + chunk_size)
        chunk = encoded[start:end]
        path.write_text(f'export default "{chunk}";\n', encoding="utf-8")


def enhance_embedded_art(config: dict):
    paths = config["chunks"]
    if not paths or any(not path.exists() for path in paths):
        print(f"skip incomplete embedded art {config['name']}")
        return

    encoded = "".join(read_chunk(path) for path in paths)
    source_bytes = base64.b64decode(encoded)
    with Image.open(io.BytesIO(source_bytes)) as source:
        rgb = source.convert("RGB")
        before_size = rgb.size

    image = np.asarray(rgb)
    image = resize_for_target(
        image,
        target_width=config["target_width"],
        max_scale=4.0,
    )
    image = improve_detail(image)

    buffer = io.BytesIO()
    Image.fromarray(image).save(
        buffer,
        "WEBP",
        quality=config.get("quality", 95),
        method=6,
    )
    output_bytes = buffer.getvalue()

    # Validate the generated binary before touching source chunks.
    with Image.open(io.BytesIO(output_bytes)) as check:
        check.load()
        after_size = check.size

    write_chunks(paths, base64.b64encode(output_bytes).decode("ascii"))
    print(
        f"enhanced embedded {config['name']}: "
        f"{before_size[0]}x{before_size[1]} -> {after_size[0]}x{after_size[1]}; "
        f"{len(source_bytes)} -> {len(output_bytes)} bytes"
    )


def enhance_navigation_assets():
    navigation_dir = ROOT / "public/ui/navigation"
    if not navigation_dir.exists():
        return
    for path in sorted(navigation_dir.rglob("*")):
        if path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES:
            enhance(path, target_width=1200, max_scale=3.0)


def main():
    # Background is full-screen and needs enough pixels for high-DPI phones.
    enhance(BACKGROUND, target_width=1920, max_scale=4.0)

    for portrait in PORTRAITS:
        enhance(portrait, target_height=1600, max_scale=3.0)

    for map_image in MAPS:
        enhance(map_image, target_width=1800, max_scale=3.0)

    for crest in CRESTS:
        enhance(crest, target_width=512, max_scale=4.0)

    enhance_navigation_assets()

    for config in EMBEDDED_ART:
        enhance_embedded_art(config)


if __name__ == "__main__":
    main()
