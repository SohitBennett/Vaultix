'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Lock, Shield, Lightbulb, Hash, Key, Settings } from 'lucide-react';
import {
  generatePassword,
  calculatePasswordStrength,
  getStrengthInfo,
  type PasswordOptions,
} from '@/lib/password-generator/generator';
import { PASSWORD_PRESETS, getDefaultPreset } from '@/lib/password-generator/presets';

// Icon mapping
const iconMap: Record<string, any> = {
  Lock,
  Shield,
  Lightbulb,
  Hash,
  Key,
  Settings,
};

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
  showCopyButton?: boolean;
  compact?: boolean;
}

export function PasswordGenerator({
  onPasswordGenerated,
  showCopyButton = true,
  compact = false,
}: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>(getDefaultPreset().options);
  const [selectedPreset, setSelectedPreset] = useState('strong');
  const [copied, setCopied] = useState(false);
  const [showCustomOptions, setShowCustomOptions] = useState(false);

  // Generate initial password
  useEffect(() => {
    generateNewPassword();
  }, []);

  const generateNewPassword = () => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      if (onPasswordGenerated) {
        onPasswordGenerated(newPassword);
      }
    } catch (error) {
      console.error('Password generation error:', error);
    }
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = PASSWORD_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setOptions(preset.options);
      setShowCustomOptions(presetId === 'custom');
      
      // Generate immediately with new preset
      setTimeout(() => {
        try {
          const newPassword = generatePassword(preset.options);
          setPassword(newPassword);
          if (onPasswordGenerated) {
            onPasswordGenerated(newPassword);
          }
        } catch (error) {
          console.error('Password generation error:', error);
        }
      }, 0);
    }
  };

  const handleOptionChange = (key: keyof PasswordOptions, value: any) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const strength = password ? calculatePasswordStrength(password) : null;
  const strengthInfo = strength ? getStrengthInfo(strength) : null;

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all duration-150 flex-1 font-mono text-sm"
          />
          <button
            onClick={generateNewPassword}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-all duration-150"
          >
            Generate
          </button>
        </div>
        {strengthInfo && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthInfo.color} transition-all duration-300`}
                style={{ width: `${strengthInfo.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{strengthInfo.label}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generated Password Display */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Generated Password</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-150 flex-1 font-mono text-lg"
          />
          <button
            onClick={generateNewPassword}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-all duration-150"
            title="Generate new password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {showCopyButton && (
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 font-medium transition-all duration-150"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Strength Meter */}
        {strengthInfo && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Strength:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{strengthInfo.label}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthInfo.color} transition-all duration-300`}
                style={{ width: `${strengthInfo.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {PASSWORD_PRESETS.map(preset => {
            const IconComponent = iconMap[preset.icon];
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-150 ${
                  selectedPreset === preset.id
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {IconComponent && <IconComponent className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{preset.name}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Options */}
      {showCustomOptions && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Length: {options.length}</label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {options.length} characters
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="128"
              value={options.length}
              onChange={(e) =>
                handleOptionChange('length', parseInt(e.target.value))
              }
              className="w-full accent-gray-900 dark:accent-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={(e) =>
                  handleOptionChange('uppercase', e.target.checked)
                }
                className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded accent-blue-600 dark:accent-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) =>
                  handleOptionChange('lowercase', e.target.checked)
                }
                className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded accent-blue-600 dark:accent-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded accent-blue-600 dark:accent-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => handleOptionChange('symbols', e.target.checked)}
                className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded accent-blue-600 dark:accent-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Symbols (!@#$...)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer col-span-2">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) =>
                  handleOptionChange('excludeAmbiguous', e.target.checked)
                }
                className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded accent-blue-600 dark:accent-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Exclude ambiguous (il1Lo0O)</span>
            </label>
          </div>

          <button
            onClick={generateNewPassword}
            className="w-full px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 font-medium transition-all duration-150"
          >
            Generate with Custom Settings
          </button>
        </div>
      )}
    </div>
  );
}