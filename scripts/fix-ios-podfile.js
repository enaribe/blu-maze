#!/usr/bin/env node

/**
 * EAS Build Script: Fix Firebase iOS Podfile
 *
 * This script modifies the Podfile to fix the Firebase Swift pods error.
 * It runs after the iOS prebuild step in EAS Build.
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔧 [Fix iOS Podfile] Starting...\n');

const podfilePath = path.join(__dirname, '..', 'ios', 'Podfile');

// Check if Podfile exists
if (!fs.existsSync(podfilePath)) {
  console.log('⚠️  [Fix iOS Podfile] Podfile not found at:', podfilePath);
  console.log('⚠️  [Fix iOS Podfile] Skipping modifications\n');
  process.exit(0);
}

console.log('✅ [Fix iOS Podfile] Podfile found at:', podfilePath);

// Read Podfile
let podfileContent = fs.readFileSync(podfilePath, 'utf8');

// Check if already modified
if (podfileContent.includes('$RNFirebaseAsStaticFramework')) {
  console.log('✅ [Fix iOS Podfile] Already modified, skipping\n');
  process.exit(0);
}

console.log('🔧 [Fix iOS Podfile] Applying modifications...\n');

// Create backup
const backupPath = podfilePath + '.backup';
fs.writeFileSync(backupPath, podfileContent);
console.log('✅ [Fix iOS Podfile] Backup created at:', backupPath);

// Find the first line after require statements
const lines = podfileContent.split('\n');
let insertIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('require') || lines[i].trim().startsWith('#')) {
    insertIndex = i + 1;
  } else if (lines[i].trim() !== '') {
    break;
  }
}

if (insertIndex === -1) {
  insertIndex = 0;
}

// Insert Firebase configurations
const firebaseConfig = `
# ========================================
# React Native Firebase iOS Fix
# ========================================
# Use static frameworks for Firebase
$RNFirebaseAsStaticFramework = true

# Use modular headers for Firebase dependencies
use_modular_headers!
`;

lines.splice(insertIndex, 0, firebaseConfig);
podfileContent = lines.join('\n');

// Now find and enhance post_install
if (podfileContent.includes('post_install do |installer|')) {
  console.log('✅ [Fix iOS Podfile] Found post_install block');

  // Find the end of post_install
  const postInstallRegex = /(post_install do \|installer\|[\s\S]*?)(^\s*end\s*$)/m;
  const match = podfileContent.match(postInstallRegex);

  if (match) {
    const beforeEnd = match[1];
    const endStatement = match[2];

    const customConfig = `
  # ========================================
  # Firebase Swift Pods Compatibility Fix
  # ========================================
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Disable Swift module interface verification
      config.build_settings['OTHER_SWIFT_FLAGS'] = '$(inherited) -no-verify-emitted-module-interface'

      # Fix deployment target consistency
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'

      # Enable modules for Swift/ObjC interoperability
      config.build_settings['CLANG_ENABLE_MODULES'] = 'YES'
      config.build_settings['GENERATE_MODULEMAP_FILE'] = 'YES'

      # Xcode 15+ requirement
      config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'

      # Firebase compatibility
      config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
      config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
      config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'

      # Disable treating non-modular include warnings as errors
      config.build_settings['OTHER_CFLAGS'] = '$(inherited) -Wno-error=non-modular-include-in-framework-module'

      # Specifically for Firebase pods
      if target.name.start_with?('RNFB') || target.name.start_with?('Firebase')
        config.build_settings['CLANG_WARN_NON_MODULAR_INCLUDE_IN_FRAMEWORK_MODULES'] = 'NO'
        config.build_settings['GCC_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
      end
    end
  end
`;

    podfileContent = podfileContent.replace(
      postInstallRegex,
      beforeEnd + customConfig + '\n' + endStatement
    );

    console.log('✅ [Fix iOS Podfile] Enhanced post_install block');
  }
}

// Write modified Podfile
fs.writeFileSync(podfilePath, podfileContent);

console.log('\n✅ [Fix iOS Podfile] Modifications applied successfully!');
console.log('📝 [Fix iOS Podfile] Modified Podfile at:', podfilePath);
console.log('💾 [Fix iOS Podfile] Backup saved at:', backupPath);
console.log('\n🎉 [Fix iOS Podfile] Done!\n');

process.exit(0);
