/**
 * Expo Config Plugin: Fix Firebase iOS Swift Pods
 *
 * This plugin fixes the "Swift pods cannot yet be integrated as static libraries" error
 * by modifying the Podfile to use modular headers and static frameworks.
 */

const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withFirebaseIOSFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.log('⚠️  Podfile not found, skipping Firebase fix');
        return config;
      }

      let podfileContent = fs.readFileSync(podfilePath, 'utf8');

      // Check if already modified
      if (podfileContent.includes('$RNFirebaseAsStaticFramework')) {
        console.log('✅ Firebase iOS fix already applied');
        return config;
      }

      console.log('🔧 Applying Firebase iOS fix to Podfile...');

      // Find the line with require_relative and add our config right after
      const requireRelativeRegex = /(require_relative.*?\n)/;

      const firebaseConfig = `
# ========================================
# React Native Firebase iOS Fix
# ========================================
# Use static frameworks for Firebase
$RNFirebaseAsStaticFramework = true

# Use modular headers for Firebase dependencies
use_modular_headers!

`;

      podfileContent = podfileContent.replace(requireRelativeRegex, `$1${firebaseConfig}`);

      // Find the post_install block
      const postInstallStart = podfileContent.indexOf('post_install do |installer|');

      if (postInstallStart !== -1) {
        // Find the end of the existing post_install block
        let braceCount = 0;
        let postInstallEnd = postInstallStart;
        let inBlock = false;

        for (let i = postInstallStart; i < podfileContent.length; i++) {
          if (podfileContent[i] === '|') {
            inBlock = true;
            continue;
          }

          if (inBlock) {
            if (podfileContent.substring(i, i + 2) === 'do') {
              braceCount++;
            } else if (podfileContent.substring(i, i + 3) === 'end') {
              braceCount--;
              if (braceCount === -1) {
                postInstallEnd = i;
                break;
              }
            }
          }
        }

        // Insert our custom configurations before the final 'end'
        const customPostInstall = `
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

        podfileContent = podfileContent.substring(0, postInstallEnd) + customPostInstall + podfileContent.substring(postInstallEnd);
      }

      // Write the modified Podfile
      fs.writeFileSync(podfilePath, podfileContent);

      console.log('✅ Firebase iOS fix applied successfully!');
      console.log('📝 Modified Podfile at:', podfilePath);

      return config;
    },
  ]);
};

module.exports = withFirebaseIOSFix;
