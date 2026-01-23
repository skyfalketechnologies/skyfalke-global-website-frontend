const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pagesDir = path.join(__dirname, '../src/pages');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add 'use client' if not present and file uses hooks
  if (!content.includes("'use client'") && 
      (content.includes('useState') || content.includes('useEffect') || content.includes('useParams') || content.includes('useNavigate'))) {
    content = "'use client';\n\n" + content;
    modified = true;
  }

  // Replace react-router-dom imports
  if (content.includes("from 'react-router-dom'") || content.includes('from "react-router-dom"')) {
    // Replace useParams
    content = content.replace(/import\s*{\s*useParams\s*}\s*from\s*['"]react-router-dom['"];?/g, 
      "import { useParams } from 'next/navigation';");
    
    // Replace useNavigate
    content = content.replace(/import\s*{\s*useNavigate\s*}\s*from\s*['"]react-router-dom['"];?/g, 
      "import { useRouter } from 'next/navigation';");
    
    // Replace useLocation
    content = content.replace(/import\s*{\s*useLocation\s*}\s*from\s*['"]react-router-dom['"];?/g, 
      "import { usePathname } from 'next/navigation';");
    
    // Replace Link import (keep other imports)
    content = content.replace(/import\s*{\s*([^}]*)\s*Link\s*([^}]*)\s*}\s*from\s*['"]react-router-dom['"];?/g, 
      (match, before, after) => {
        const otherImports = (before + after).trim().replace(/,\s*,/g, ',').replace(/^,|,$/g, '');
        if (otherImports) {
          return `import { ${otherImports} } from 'react-router-dom';\nimport Link from 'next/link';`;
        }
        return "import Link from 'next/link';";
      });
    
    // Replace standalone Link import
    content = content.replace(/import\s*{\s*Link\s*}\s*from\s*['"]react-router-dom['"];?/g, 
      "import Link from 'next/link';");
    
    modified = true;
  }

  // Update useParams usage
  if (content.includes('useParams()')) {
    // Handle destructuring: const { id } = useParams();
    content = content.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*useParams\(\);?/g, 
      (match, vars) => {
        const varList = vars.split(',').map(v => v.trim());
        const declarations = varList.map(v => {
          const varName = v.split(':')[0].trim();
          return `  const ${varName} = params?.${varName};`;
        }).join('\n');
        return `const params = useParams();\n${declarations}`;
      });
    modified = true;
  }

  // Update useNavigate to useRouter
  content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 
    'const router = useRouter();');
  content = content.replace(/navigate\(/g, 'router.push(');
  modified = true;

  // Update useLocation to usePathname
  content = content.replace(/const\s+location\s*=\s*useLocation\(\);?/g, 
    'const pathname = usePathname();');
  content = content.replace(/location\.pathname/g, 'pathname');
  modified = true;

  // Replace Link to= with href=
  content = content.replace(/<Link\s+to=/g, '<Link href=');
  modified = true;

  // Replace Navigate component usage
  if (content.includes('<Navigate')) {
    console.warn(`⚠️  File ${filePath} uses <Navigate> component. Manual update needed.`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('🔄 Updating pages to Next.js...\n');

const files = walkDir(pagesDir);
let updatedCount = 0;

files.forEach(file => {
  try {
    if (updateFile(file)) {
      updatedCount++;
      const relativePath = path.relative(process.cwd(), file);
      console.log(`✅ Updated: ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
});

console.log(`\n✨ Updated ${updatedCount} files!`);
console.log('\n⚠️  Note: Some files may need manual review, especially those using <Navigate> component.');

