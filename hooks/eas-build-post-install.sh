#!/bin/bash

# EAS Build Hook: Fix Firebase iOS Swift pods issue
# This script runs after npm install during EAS Build

set -e

echo "🔧 [EAS Hook] Running post-install hook to fix Firebase iOS pods..."

# Check if we're building for iOS
if [ "$EAS_BUILD_PLATFORM" = "ios" ]; then
  echo "✅ [EAS Hook] iOS build detected, fixing Podfile..."

  PODFILE_PATH="$EAS_BUILD_WORKDIR/ios/Podfile"

  if [ -f "$PODFILE_PATH" ]; then
    echo "✅ [EAS Hook] Podfile found at $PODFILE_PATH"

    # Create backup
    cp "$PODFILE_PATH" "$PODFILE_PATH.backup"
    echo "✅ [EAS Hook] Backup created: $PODFILE_PATH.backup"

    # Check if fix already applied
    if grep -q "\$RNFirebaseAsStaticFramework" "$PODFILE_PATH"; then
      echo "⚠️ [EAS Hook] Firebase fix already applied, skipping..."
    else
      echo "🔧 [EAS Hook] Applying Firebase fix..."

      # Add Firebase static framework flag at the beginning (after require_relative)
      sed -i '' '/require_relative/a\
# React Native Firebase - use static frameworks\
$RNFirebaseAsStaticFramework = true\
\
# Use modular headers for Firebase dependencies\
use_modular_headers!
' "$PODFILE_PATH"

      echo "✅ [EAS Hook] Added \$RNFirebaseAsStaticFramework = true"
      echo "✅ [EAS Hook] Added use_modular_headers!"

      # Now add post_install fixes
      # Find the post_install block and add our configurations
      cat >> "$PODFILE_PATH" << 'EOF'

# Custom post_install for Firebase compatibility
post_install do |installer|
  # Existing Expo post_install
  if defined?(react_native_post_install)
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
  end

  # Firebase Swift pods fix
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Disable Swift module interface verification
      config.build_settings['OTHER_SWIFT_FLAGS'] = '$(inherited) -no-verify-emitted-module-interface'

      # Fix deployment target
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
end
EOF

      echo "✅ [EAS Hook] Added post_install configurations"
    fi

    echo "✅ [EAS Hook] Podfile successfully modified!"
    echo "📄 [EAS Hook] Podfile preview:"
    head -n 20 "$PODFILE_PATH"
  else
    echo "⚠️ [EAS Hook] Podfile not found at $PODFILE_PATH, skipping..."
  fi
else
  echo "⏭ [EAS Hook] Not an iOS build, skipping Podfile modifications"
fi

echo "✅ [EAS Hook] Post-install hook completed successfully!"
