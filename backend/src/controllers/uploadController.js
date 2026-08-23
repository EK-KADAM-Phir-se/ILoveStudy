const fs = require('fs');
const path = require('path');

// Base directory and public domain for Utho uploads
const UPLOAD_BASE_DIR = process.env.UPLOAD_BASE_DIR || '/var/www/ilovestudy/uploads';
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || 'https://ilovestudy.in/uploads').replace(/\/$/, '');

// Utility: Convert legacy Supabase Storage URLs to Utho URLs
function convertSupabaseUrlToUthoUrl(url) {
  if (!url || typeof url !== 'string') return url;
  
  // Match pattern: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<filepath>
  const supabaseRegex = /https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/(QuestionBank|test-pdfs)\/(.+)/i;
  const match = url.match(supabaseRegex);
  if (match) {
    const bucket = match[1];
    const filePath = match[2];
    return `${PUBLIC_BASE_URL}/${bucket}/${filePath}`;
  }
  return url;
}

// Utility: Sanitize filename to prevent path traversal and unsafe chars
function sanitizeFilename(originalName) {
  if (!originalName) return `file_${Date.now()}`;
  let baseName = path.basename(originalName);
  baseName = baseName.replace(/[^a-zA-Z0-9.\-_ ()]/g, '_');
  if (baseName.startsWith('.') || !baseName) {
    baseName = `file_${Date.now()}_${baseName.replace(/^\.+/, '') || 'file'}`;
  }
  return baseName;
}

// Utility: Sanitize subfolder path (stripping ../ and unsafe chars)
function sanitizeSubfolder(subfolder) {
  if (!subfolder) return '';
  const parts = String(subfolder).split(/[/\\]/).filter(p => p && p !== '.' && p !== '..');
  const safeParts = parts.map(p => p.replace(/[^a-zA-Z0-9.\-_ ()]/g, '_'));
  return safeParts.join('/');
}

// Allowed MIME types and extensions
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_PDF_EXTS = ['.pdf'];

/**
 * Handle Uploading PDF files (Target: /var/www/ilovestudy/uploads/test-pdfs/)
 */
exports.uploadPdf = async (req, res) => {
  try {
    const { fileName, fileData, subfolder, overwrite } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'fileName and fileData (base64) are required' });
    }

    const cleanName = sanitizeFilename(fileName);
    const ext = path.extname(cleanName).toLowerCase();
    
    if (!ALLOWED_PDF_EXTS.includes(ext)) {
      return res.status(400).json({ error: 'Invalid file type. Only PDF files are allowed.' });
    }

    // Decode base64 file data
    let base64Content = fileData;
    if (fileData.includes(',')) {
      base64Content = fileData.split(',')[1];
    }
    const buffer = Buffer.from(base64Content, 'base64');

    // Verify PDF header (%PDF-)
    const pdfHeader = buffer.slice(0, 5).toString('ascii');
    if (!pdfHeader.startsWith('%PDF-')) {
      return res.status(400).json({ error: 'File validation failed. Invalid PDF binary content.' });
    }

    // Determine target path
    const safeSubDir = sanitizeSubfolder(subfolder);
    const targetDir = safeSubDir 
      ? path.join(UPLOAD_BASE_DIR, 'test-pdfs', safeSubDir)
      : path.join(UPLOAD_BASE_DIR, 'test-pdfs');

    // Ensure directory exists automatically
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Handle duplicate filename safely
    let finalFileName = cleanName;
    let finalPath = path.join(targetDir, finalFileName);
    
    if (fs.existsSync(finalPath) && !overwrite) {
      const timeStamp = Date.now();
      const nameWithoutExt = path.basename(cleanName, ext);
      finalFileName = `${timeStamp}_${nameWithoutExt}${ext}`;
      finalPath = path.join(targetDir, finalFileName);
    }

    // Save file to Utho filesystem
    fs.writeFileSync(finalPath, buffer);

    const relativeUrlPath = safeSubDir ? `${safeSubDir}/${finalFileName}` : finalFileName;
    const publicUrl = `${PUBLIC_BASE_URL}/test-pdfs/${relativeUrlPath}`;

    return res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully to Utho server',
      url: publicUrl,
      fileName: finalFileName,
      path: `test-pdfs/${relativeUrlPath}`
    });
  } catch (error) {
    console.error('❌ Error uploading PDF to Utho server:', error);
    return res.status(500).json({ error: 'Failed to save PDF file to server storage' });
  }
};

/**
 * Handle Uploading Image files (Target: /var/www/ilovestudy/uploads/QuestionBank/)
 */
exports.uploadImage = async (req, res) => {
  try {
    const { fileName, fileData, subfolder, overwrite } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'fileName and fileData (base64) are required' });
    }

    const cleanName = sanitizeFilename(fileName);
    const ext = path.extname(cleanName).toLowerCase();

    if (!ALLOWED_IMAGE_EXTS.includes(ext)) {
      return res.status(400).json({ error: 'Invalid file type. Only PNG, JPG, WEBP, GIF, and SVG images are allowed.' });
    }

    // Decode base64 file data
    let base64Content = fileData;
    if (fileData.includes(',')) {
      base64Content = fileData.split(',')[1];
    }
    const buffer = Buffer.from(base64Content, 'base64');

    // Determine target path
    const safeSubDir = sanitizeSubfolder(subfolder);
    const targetDir = safeSubDir 
      ? path.join(UPLOAD_BASE_DIR, 'QuestionBank', safeSubDir)
      : path.join(UPLOAD_BASE_DIR, 'QuestionBank');

    // Ensure directory exists automatically
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Handle duplicate filename safely
    let finalFileName = cleanName;
    let finalPath = path.join(targetDir, finalFileName);
    
    if (fs.existsSync(finalPath) && !overwrite) {
      const timeStamp = Date.now();
      const nameWithoutExt = path.basename(cleanName, ext);
      finalFileName = `${timeStamp}_${nameWithoutExt}${ext}`;
      finalPath = path.join(targetDir, finalFileName);
    }

    // Save file to Utho filesystem
    fs.writeFileSync(finalPath, buffer);

    const relativeUrlPath = safeSubDir ? `${safeSubDir}/${finalFileName}` : finalFileName;
    const publicUrl = `${PUBLIC_BASE_URL}/QuestionBank/${relativeUrlPath}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Utho server',
      url: publicUrl,
      fileName: finalFileName,
      path: `QuestionBank/${relativeUrlPath}`
    });
  } catch (error) {
    console.error('❌ Error uploading image to Utho server:', error);
    return res.status(500).json({ error: 'Failed to save image file to server storage' });
  }
};

exports.convertSupabaseUrlToUthoUrl = convertSupabaseUrlToUthoUrl;
