import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Blu Maze Button Component
 * Consistent button styling across the app
 */

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.disabled;
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'secondary':
        return Colors.blue;
      case 'outline':
        return 'transparent';
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#000000';
      case 'secondary':
        return Colors.text;
      case 'outline':
        return Colors.text;
      default:
        return '#000000';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : Colors.text} />
      ) : (
        <Text style={[
          styles.text,
          { color: getTextColor() },
          textStyle,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.text,
  },
  text: {
    ...Typography.button,
  },
});
