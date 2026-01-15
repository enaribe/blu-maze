/**
 * Expo Config Plugin: Fix Firebase iOS Swift Pods
 *
 * This plugin fixes the "Swift pods cannot yet be integrated as static libraries" error
 * by modifying the Podfile to use modular headers and static frameworks.
 */

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withFirebaseIOSFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.log('⚠️  [Firebase iOS Fix] Podfile not found, skipping');
        return config;
      }

      let podfileContent = fs.readFileSync(podfilePath, 'utf8');

      // Check if already modified
      if (podfileContent.includes('$RNFirebaseAsStaticFramework')) {
        console.log('✅ [Firebase iOS Fix] Already applied');
        return config;
      }

      console.log('🔧 [Firebase iOS Fix] Applying modifications...');

      // Create backup
      fs.writeFileSync(podfilePath + '.backup', podfileContent);

      // Strategy 1: Add Firebase config at the beginning (after require statements)
      const firebaseHeader = `
# ========================================
# React Native Firebase iOS Fix
# ========================================
$RNFirebaseAsStaticFramework = true
use_modular_headers!

`;

      // Find the first line after require statements
      const lines = podfileContent.split('\n');
      let insertIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('require') || line.startsWith('#') || line === '') {
          insertIndex = i + 1;
        } else {
          break;
        }
      }

      lines.splice(insertIndex, 0, firebaseHeader);
      podfileContent = lines.join('\n');

      // Strategy 2: Add custom post_install at the end if it doesn't exist
      if (!podfileContent.includes('Firebase Swift Pods Compatibility')) {
        const customPostInstall = `

# ========================================
# Firebase Swift Pods Compatibility Fix
# ========================================
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Disable Swift module interface verification
      config.build_settings['OTHER_SWIFT_FLAGS'] ||= ['$(inherited)']
      config.build_settings['OTHER_SWIFT_FLAGS'] << '-no-verify-emitted-module-interface'

      # Fix deployment target
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'

      # Enable modules
      config.build_settings['CLANG_ENABLE_MODULES'] = 'YES'
      config.build_settings['GENERATE_MODULEMAP_FILE'] = 'YES'

      # Xcode 15+
      config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'

      # Firebase compatibility
      config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
      config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
      config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      config.build_settings['OTHER_CFLAGS'] ||= ['$(inherited)']
      config.build_settings['OTHER_CFLAGS'] << '-Wno-error=non-modular-include-in-framework-module'

      # Firebase pods specific
      if target.name.start_with?('RNFB', 'Firebase')
        config.build_settings['CLANG_WARN_NON_MODULAR_INCLUDE_IN_FRAMEWORK_MODULES'] = 'NO'
        config.build_settings['GCC_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
      end
    end
  end
end
`;

        // Simply append at the end
        podfileContent += customPostInstall;
      }

      // Write modified Podfile
      fs.writeFileSync(podfilePath, podfileContent);

      console.log('✅ [Firebase iOS Fix] Applied successfully!');

      return config;
    },
  ]);
};

module.exports = withFirebaseIOSFix;
