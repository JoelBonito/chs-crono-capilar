#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];

// Paths
const PACKAGE_ROOT = path.join(__dirname, '..');
const TARGET_DIR = process.cwd();
const AGENT_SRC = path.join(PACKAGE_ROOT, '.agent');
const AGENT_DEST = path.join(TARGET_DIR, '.agent');

// Instruction files to copy to project root
// Note: GEMINI.md is inside .agent/rules/ and copied with the .agent folder
const INSTRUCTION_FILES = ['CLAUDE.md'];

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            // Overwrite or skip? Let's overwrite for init
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function init() {
    console.log('🚀 Initializing Inove AI Framework...');

    // 1. Copy .agent folder
    if (!fs.existsSync(AGENT_SRC)) {
        console.error('❌ Error: Could not find source .agent folder.');
        process.exit(1);
    }

    console.log(`📦 Copying .agent folder to ${TARGET_DIR}...`);
    try {
        copyDir(AGENT_SRC, AGENT_DEST);
        console.log('✅ .agent folder copied successfully.');
    } catch (error) {
        console.error('❌ Error copying files:', error.message);
        process.exit(1);
    }

    // 1.5 Copy instruction files (CLAUDE.md, GEMINI.md)
    console.log('📝 Copying AI instruction files...');
    for (const file of INSTRUCTION_FILES) {
        const srcFile = path.join(PACKAGE_ROOT, file);
        const destFile = path.join(TARGET_DIR, file);

        if (fs.existsSync(srcFile)) {
            try {
                fs.copyFileSync(srcFile, destFile);
                console.log(`   ✅ ${file} copied.`);
            } catch (error) {
                console.warn(`   ⚠️ Warning: Could not copy ${file}: ${error.message}`);
            }
        } else {
            console.warn(`   ⚠️ Warning: ${file} not found in package.`);
        }
    }

    // 1.6 Setup .claude folder with project_instructions
    const claudeDir = path.join(TARGET_DIR, '.claude');
    const projectInstructionsSrc = path.join(PACKAGE_ROOT, '.claude', 'project_instructions.md');
    const projectInstructionsDest = path.join(claudeDir, 'project_instructions.md');

    if (fs.existsSync(projectInstructionsSrc)) {
        console.log('🔧 Setting up .claude folder...');
        try {
            if (!fs.existsSync(claudeDir)) {
                fs.mkdirSync(claudeDir, { recursive: true });
            }
            fs.copyFileSync(projectInstructionsSrc, projectInstructionsDest);
            console.log('   ✅ .claude/project_instructions.md copied.');
        } catch (error) {
            console.warn(`   ⚠️ Warning: Could not setup .claude folder: ${error.message}`);
        }
    }

    // 2. Install Git Hooks
    const hooksScript = path.join(AGENT_DEST, 'scripts', 'install_git_hooks.sh');
    if (fs.existsSync(hooksScript)) {
        console.log('🔧 Installing Git Hooks...');
        try {
            // Make executable
            fs.chmodSync(hooksScript, '755');
            // Execute
            execSync(`bash "${hooksScript}"`, { stdio: 'inherit' });
        } catch (error) {
            console.warn('⚠️ Warning: Failed to install git hooks automatically.');
            console.warn('   You can run manually: bash .agent/scripts/install_git_hooks.sh');
        }
    }

    // 3. First Session Start
    const autoSessionScript = path.join(AGENT_DEST, 'scripts', 'auto_session.py');
    if (fs.existsSync(autoSessionScript)) {
        console.log('🤖 Starting first session...');
        try {
            // Check if python3 exists
            execSync('python3 --version', { stdio: 'ignore' });
            execSync(`python3 "${autoSessionScript}" start`, { stdio: 'inherit' });
        } catch (error) {
            console.log('ℹ️  Could not auto-start session (python3 missing or error).');
            console.log('   Run manually: python3 .agent/scripts/auto_session.py start');
        }
    }

    console.log('\n🎉 Setup Complete! Inove AI Framework is ready.');
    console.log('   Run "python3 .agent/scripts/dashboard.py" to check status.');
}

function showHelp() {
    console.log(`
Inove AI Framework CLI

Usage:
  npx @joelbonito/inove-ai-framework init   Install framework in current directory
  npx @joelbonito/inove-ai-framework help   Show this help
`);
}

switch (command) {
    case 'init':
        init();
        break;
    case 'help':
    case '--help':
    case '-h':
    default:
        showHelp();
        break;
}
