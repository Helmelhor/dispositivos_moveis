// components/ui/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
}) => {
  const variantStyles: any = {
    primary: { backgroundColor: '#0A66C2', color: '#FFFFFF' },
    secondary: { backgroundColor: '#E1E8ED', color: '#000000' },
    outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#0A66C2', color: '#0A66C2' },
    danger: { backgroundColor: '#DC2626', color: '#FFFFFF' },
  };

  const sizeStyles: any = {
    small: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 },
    medium: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 },
    large: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 },
  };

  const variant_style = variantStyles[variant];
  const size_style = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: variant_style.backgroundColor,
          ...(variant_style.borderWidth && { borderWidth: variant_style.borderWidth }),
          ...(variant_style.borderColor && { borderColor: variant_style.borderColor }),
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant_style.color} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: variant_style.color, ...size_style },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontWeight: '600',
  },
});
