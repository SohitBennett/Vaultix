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
            className="input flex-1 font-mono text-sm"
          />
          <button
            onClick={generateNewPassword}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Generate
          </button>
        </div>
        {strengthInfo && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthInfo.color} transition-all duration-300`}
                style={{ width: `${strengthInfo.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium">{strengthInfo.label}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generated Password Display */}
      <div>
        <label className="label">Generated Password</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            readOnly
            className="input flex-1 font-mono text-lg"
          />
          <button
            onClick={generateNewPassword}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            title="Generate new password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {showCopyButton && (
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
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
              <span className="text-sm text-gray-600">Strength:</span>
              <span className="text-sm font-semibold">{strengthInfo.label}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
        <label className="label">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {PASSWORD_PRESETS.map(preset => {
            const IconComponent = iconMap[preset.icon];
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedPreset === preset.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {IconComponent && <IconComponent className="w-5 h-5 text-gray-700" />}
                  <span className="font-semibold">{preset.name}</span>
                </div>
                <p className="text-xs text-gray-600">{preset.description}</p>
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
              <label className="label">Length: {options.length}</label>
              <span className="text-sm text-gray-600">
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
              className="w-full"
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
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) =>
                  handleOptionChange('lowercase', e.target.checked)
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => handleOptionChange('symbols', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm">Symbols (!@#$...)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer col-span-2">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) =>
                  handleOptionChange('excludeAmbiguous', e.target.checked)
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm">Exclude ambiguous (il1Lo0O)</span>
            </label>
          </div>

          <button
            onClick={generateNewPassword}
            className="w-full btn-primary"
          >
            Generate with Custom Settings
          </button>
        </div>
      )}
    </div>
  );
}