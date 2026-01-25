import type { PasswordOptions } from './generator';

/**
 * Preset configurations for different use cases
 */
export interface PasswordPreset {
  id: string;
  name: string;
  description: string;
  options: PasswordOptions;
  icon: string;
}

export const PASSWORD_PRESETS: PasswordPreset[] = [
  {
    id: 'strong',
    name: 'Strong',
    description: 'Highly secure with all character types',
    icon: 'Lock',
    options: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: true,
    },
  },
  {
    id: 'maximum',
    name: 'Maximum Security',
    description: 'Ultra-secure 32 character password',
    icon: 'Shield',
    options: {
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: true,
    },
  },
  {
    id: 'memorable',
    name: 'Memorable',
    description: 'Easy to remember without symbols',
    icon: 'Lightbulb',
    options: {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true,
    },
  },
  {
    id: 'pin',
    name: 'PIN',
    description: 'Numeric only (6 digits)',
    icon: 'Hash',
    options: {
      length: 6,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
      excludeAmbiguous: false,
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Simple alphanumeric password',
    icon: 'Key',
    options: {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: false,
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Customize all settings',
    icon: 'Settings',
    options: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false,
    },
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): PasswordPreset | undefined {
  return PASSWORD_PRESETS.find(preset => preset.id === id);
}

/**
 * Get default preset
 */
export function getDefaultPreset(): PasswordPreset {
  return PASSWORD_PRESETS[0]; // Strong preset
}