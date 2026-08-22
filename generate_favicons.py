import math
from PIL import Image, ImageDraw

def create_gem_icon(size):
    # Create image with RGBA
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background rounded rect / circle
    bg_color = (11, 14, 22, 255) # #0b0e16
    border_color = (198, 161, 91, 160) # #c6a15b gold

    corner_radius = int(size * 0.22)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner_radius, fill=bg_color, outline=border_color, width=max(1, int(size * 0.03)))

    # Gemstone faceted coordinates scaled to size
    # Base box: 40x40 scale:
    # Top vertex: (20, 7)
    # Top left: (10, 16)
    # Top right: (30, 16)
    # Bottom vertex: (20, 34)
    # Table left: (15, 16)
    # Table right: (25, 16)
    scale = size / 40.0
    pad_y = size * 0.02

    def pt(x, y):
        return (x * scale, (y + pad_y) * scale)

    # Facet coordinates
    top = pt(20, 6)
    left = pt(8, 16)
    right = pt(32, 16)
    bottom = pt(20, 35)
    inner_l = pt(14, 16)
    inner_r = pt(26, 16)

    # Shaded facets
    # Left facet
    draw.polygon([top, left, inner_l], fill=(198, 161, 91, 40))
    # Right facet
    draw.polygon([top, right, inner_r], fill=(227, 201, 138, 70))
    # Center top table facet
    draw.polygon([top, inner_l, inner_r], fill=(245, 230, 185, 90))
    # Left pavilion
    draw.polygon([inner_l, left, bottom], fill=(198, 161, 91, 50))
    # Right pavilion
    draw.polygon([inner_r, right, bottom], fill=(227, 201, 138, 80))
    # Center pavilion
    draw.polygon([inner_l, inner_r, bottom], fill=(255, 240, 200, 110))

    # Stroke lines (Gold)
    line_color = (235, 205, 140, 255) # #ebcd8c
    line_w = max(1, int(size * 0.045))

    draw.polygon([top, right, bottom, left], outline=line_color, width=line_w)
    draw.line([left, right], fill=line_color, width=line_w)
    draw.line([top, inner_l], fill=line_color, width=line_w)
    draw.line([top, inner_r], fill=line_color, width=line_w)
    draw.line([inner_l, bottom], fill=line_color, width=line_w)
    draw.line([inner_r, bottom], fill=line_color, width=line_w)

    return img

# Generate various sizes
sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'favicon-48x48.png': 48,
    'favicon-96x96.png': 96,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
}

images = {}
for name, sz in sizes.items():
    img = create_gem_icon(sz)
    img.save(name, 'PNG')
    images[sz] = img
    print(f"Generated {name} ({sz}x{sz})")

# Generate multi-resolution .ico (contains 16x16, 32x32, 48x48)
ico_img = images[48]
ico_img.save('favicon.ico', format='ICO', sizes=[(16,16), (32,32), (48,48)])
print("Generated favicon.ico (16, 32, 48)")
