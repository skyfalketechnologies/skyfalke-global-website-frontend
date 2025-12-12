# Case Study Images Setup Guide

## Overview
Each case study should have its own unique image to make it visually distinct and professional. This guide explains how to set up images for your case studies.

## Image Requirements

### Primary Image
- **Purpose**: Main hero image displayed at the top of the case study detail page
- **Size**: Recommended 1200x800px or similar aspect ratio
- **Format**: JPG, PNG, or WebP
- **Content**: Should represent the project, client, or industry

### Additional Images
- **Purpose**: Gallery images shown in the project gallery section
- **Quantity**: 2-4 additional images recommended
- **Captions**: Optional but recommended for better context

## How to Add Images

### Method 1: Through Admin Form
1. Go to `/system/dashboard/case-studies`
2. Click "Add New Case Study" or edit an existing one
3. Scroll to the "Project Images" section
4. Add image URLs and captions
5. Set one image as "Primary" (this will be the hero image)
6. Save the case study

### Method 2: Using the Script
Run the provided script to automatically add sample images:

```bash
cd server
node scripts/updateCaseStudyImages.js
```

## Image Sources

### Recommended Sources
- **Unsplash**: High-quality, free stock photos
- **Your own photos**: Project screenshots, team photos, office photos
- **Client photos**: With permission, use client's office or team photos
- **Stock photos**: Professional business and technology images

### Unsplash Categories for Case Studies
- Business meetings: `https://images.unsplash.com/photo-1551434678-e076c223a692`
- Data analytics: `https://images.unsplash.com/photo-1460925895917-afdab827c52f`
- Digital marketing: `https://images.unsplash.com/photo-1553877522-43269d4ea984`
- Cloud technology: `https://images.unsplash.com/photo-1559136555-9303baea8ebd`
- Business intelligence: `https://images.unsplash.com/photo-1551288049-bebda4e38f71`

## Best Practices

### Image Selection
- Choose images that relate to the project or industry
- Ensure high quality and professional appearance
- Use consistent style across all case studies
- Avoid generic stock photos when possible

### Technical Considerations
- Use HTTPS URLs for all images
- Optimize images for web (compress but maintain quality)
- Include descriptive alt text and captions
- Test images load properly on all devices

### SEO Benefits
- Unique images improve page uniqueness
- Image captions can include relevant keywords
- Alt text helps with accessibility and SEO
- Visual content increases engagement

## Troubleshooting

### Images Not Loading
- Check if URLs are accessible
- Ensure URLs use HTTPS
- Verify image format is supported
- Check for broken links

### Fallback Images
- If no images are set, the system uses a default business image
- Error handling automatically falls back to default image
- Always test with and without images

## Example Setup

```javascript
// Example case study with images
{
  title: "E-commerce Platform Development",
  images: [
    {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
      caption: "Modern e-commerce platform interface",
      isPrimary: true
    },
    {
      url: "https://images.unsplash.com/photo-1556742111-a301076d9d18",
      caption: "Mobile-responsive design",
      isPrimary: false
    },
    {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
      caption: "Payment integration dashboard",
      isPrimary: false
    }
  ]
}
```

## Next Steps
1. Run the script to add sample images to existing case studies
2. Review and customize images for each case study
3. Add your own project photos where available
4. Test the case study detail pages to ensure images display correctly
