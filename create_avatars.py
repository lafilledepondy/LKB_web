#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create img directory if it doesn't exist
os.makedirs('img', exist_ok=True)

# Define people and their colors
people = [
    ('jane_smith.jpg', 'JS', '#4285f4', 'white'),
    ('john_doe.jpg', 'JD', '#34a853', 'white'),
    ('bob_wilson.jpg', 'BW', '#ea4335', 'white'),
    ('alice_chen.jpg', 'AC', '#fbbc05', 'black'),
    ('sarah_johnson.jpg', 'SJ', '#ff6d01', 'white'),
    ('default.jpg', 'User', '#cccccc', 'white')
]

# Image specifications
SIZE = 200  # 200x200 pixels (1:1 aspect ratio)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    if hex_color == 'white':
        return (255, 255, 255)
    elif hex_color == 'black':
        return (0, 0, 0)
    else:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_avatar(filename, initials, bg_color, text_color):
    """Create a circular avatar image"""
    # Create a square image
    img = Image.new('RGB', (SIZE, SIZE), hex_to_rgb(bg_color))
    draw = ImageDraw.Draw(img)
    
    # Draw a circle (fill the entire image)
    draw.ellipse([0, 0, SIZE, SIZE], fill=hex_to_rgb(bg_color))
    
    # Try to use a system font, fallback to default
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', 60)
    except:
        try:
            font = ImageFont.truetype('/usr/share/fonts/TTF/arial.ttf', 60)
        except:
            try:
                font = ImageFont.load_default()
            except:
                font = None
    
    # Calculate text position for centering
    if font:
        bbox = draw.textbbox((0, 0), initials, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    else:
        # Fallback for default font
        text_width = len(initials) * 20
        text_height = 30
        font = ImageFont.load_default()
    
    x = (SIZE - text_width) // 2
    y = (SIZE - text_height) // 2
    
    # Draw the text
    draw.text((x, y), initials, fill=hex_to_rgb(text_color), font=font)
    
    # Save the image
    img.save(f'img/{filename}', 'JPEG', quality=90)
    print(f"Created: img/{filename}")

# Create all avatars
for filename, initials, bg_color, text_color in people:
    create_avatar(filename, initials, bg_color, text_color)

print("All avatar images created successfully!")
print("Images are 200x200 pixels (1:1 aspect ratio) in JPG format")
