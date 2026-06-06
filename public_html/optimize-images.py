#!/usr/bin/env python3
"""
ASA-USA Image Optimizer
Compresses JPEGs and PNGs in-place and creates WebP variants.
Requires: pip install Pillow
Usage: python optimize-images.py
"""
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent / "images"
QUALITY_JPEG = 75
QUALITY_WEBP = 78
MAX_WIDTH = 1200  # Resize images wider than this


def optimize_image(path: Path):
    ext = path.suffix.lower()
    if ext not in (".jpg", ".jpeg", ".png"):
        return

    try:
        with Image.open(path) as im:
            # Convert palette/RGBA to RGB for JPEG/WEBP consistency
            if im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            elif im.mode != "RGB":
                im = im.convert("RGB")

            # Resize if too large
            if im.width > MAX_WIDTH:
                ratio = MAX_WIDTH / im.width
                new_height = int(im.height * ratio)
                im = im.resize((MAX_WIDTH, new_height), Image.LANCZOS)

            # Save optimized original
            if ext in (".jpg", ".jpeg"):
                im.save(path, "JPEG", quality=QUALITY_JPEG, optimize=True)
                print(f"Compressed JPEG: {path}")
            elif ext == ".png":
                # Save as optimized PNG (Pillow doesn't do aggressive PNG compression)
                im.save(path, "PNG", optimize=True)
                print(f"Optimized PNG: {path}")

            # Create WebP variant
            webp_path = path.with_suffix(".webp")
            im.save(webp_path, "WEBP", quality=QUALITY_WEBP, method=6)
            print(f"Created WebP: {webp_path}")

            # Report savings
            orig_size = path.stat().st_size
            webp_size = webp_path.stat().st_size
            if webp_size < orig_size:
                saving = (orig_size - webp_size) / orig_size * 100
                print(f"  -> WebP is {saving:.1f}% smaller")
    except Exception as e:
        print(f"Error processing {path}: {e}")


def main():
    for root, _, files in os.walk(ROOT):
        for name in files:
            optimize_image(Path(root) / name)
    print("Done!")


if __name__ == "__main__":
    main()
