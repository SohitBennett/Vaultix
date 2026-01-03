import { generateRandomBytes } from '../crypto/utils';

/**
 * Character sets for password generation
 */
export const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: 'il1Lo0O', // Characters that look similar
} as const;

/**
 * Password generation options
 */
export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

/**
 * Password strength levels
 */
export enum PasswordStrength {
  VERY_WEAK = 'very_weak',
  WEAK = 'weak',
  FAIR = 'fair',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong',
}

/**
 * Generate a cryptographically secure random password
 * 
 * @param options - Password generation options
 * @returns Generated password
 */
export function generatePassword(options: PasswordOptions): string {
  // Build character pool based on options
  let charPool = '';
  
  if (options.uppercase) charPool += CHAR_SETS.uppercase;
  if (options.lowercase) charPool += CHAR_SETS.lowercase;
  if (options.numbers) charPool += CHAR_SETS.numbers;
  if (options.symbols) charPool += CHAR_SETS.symbols;

  // Remove ambiguous characters if requested
  if (options.excludeAmbiguous) {
    const ambiguous = CHAR_SETS.ambiguous.split('');
    charPool = charPool.split('').filter(char => !ambiguous.includes(char)).join('');
  }

  // Validate we have characters to work with
  if (charPool.length === 0) {
    throw new Error('At least one character set must be selected');
  }

  if (options.length < 4 || options.length > 128) {
    throw new Error('Password length must be between 4 and 128 characters');
  }

  // Generate password using crypto.getRandomValues
  const password: string[] = [];
  const randomBytes = generateRandomBytes(options.length);

  for (let i = 0; i < options.length; i++) {
    const randomIndex = randomBytes[i] % charPool.length;
    password.push(charPool[randomIndex]);
  }

  // Ensure password meets requirements (has at least one of each selected type)
  const generatedPassword = password.join('');
  
  if (!meetsRequirements(generatedPassword, options)) {
    // Regenerate if requirements not met (rare case)
    return generatePassword(options);
  }

  return generatedPassword;
}

/**
 * Check if password meets the selected requirements
 */
function meetsRequirements(password: string, options: PasswordOptions): boolean {
  if (options.uppercase && !/[A-Z]/.test(password)) return false;
  if (options.lowercase && !/[a-z]/.test(password)) return false;
  if (options.numbers && !/[0-9]/.test(password)) return false;
  if (options.symbols && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) return false;
  return true;
}

/**
 * Calculate password strength
 * 
 * @param password - Password to analyze
 * @returns Strength level
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) score += 1;

  // Penalize common patterns
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/^[0-9]+$/.test(password)) score -= 2; // All numbers
  if (/^[a-zA-Z]+$/.test(password)) score -= 1; // All letters

  // Determine strength
  if (score <= 2) return PasswordStrength.VERY_WEAK;
  if (score <= 4) return PasswordStrength.WEAK;
  if (score <= 6) return PasswordStrength.FAIR;
  if (score <= 8) return PasswordStrength.STRONG;
  return PasswordStrength.VERY_STRONG;
}

/**
 * Get strength info (color, label, percentage)
 */
export function getStrengthInfo(strength: PasswordStrength): {
  color: string;
  label: string;
  percentage: number;
} {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return { color: 'bg-red-500', label: 'Very Weak', percentage: 20 };
    case PasswordStrength.WEAK:
      return { color: 'bg-orange-500', label: 'Weak', percentage: 40 };
    case PasswordStrength.FAIR:
      return { color: 'bg-yellow-500', label: 'Fair', percentage: 60 };
    case PasswordStrength.STRONG:
      return { color: 'bg-green-500', label: 'Strong', percentage: 80 };
    case PasswordStrength.VERY_STRONG:
      return { color: 'bg-green-600', label: 'Very Strong', percentage: 100 };
  }
}

/**
 * Generate a memorable passphrase
 * Uses common words with random separators
 * 
 * @param wordCount - Number of words (3-8)
 * @param separator - Separator between words
 * @returns Generated passphrase
 */
export function generatePassphrase(
  wordCount: number = 4,
  separator: string = '-'
): string {
  // Simple word list (in production, use a larger dictionary)
  const words = [
    'correct', 'horse', 'battery', 'staple', 'cloud', 'mountain', 'river',
    'forest', 'ocean', 'desert', 'thunder', 'lightning', 'sunset', 'sunrise',
    'galaxy', 'planet', 'rocket', 'comet', 'meteor', 'nebula', 'cosmos',
    'dragon', 'phoenix', 'unicorn', 'griffin', 'wizard', 'knight', 'castle',
    'treasure', 'crystal', 'diamond', 'emerald', 'sapphire', 'ruby', 'gold',
    'silver', 'bronze', 'copper', 'iron', 'steel', 'titanium', 'platinum',
    'rainbow', 'butterfly', 'eagle', 'falcon', 'hawk', 'owl', 'raven',
    'wolf', 'bear', 'lion', 'tiger', 'leopard', 'panther', 'jaguar',
  ];

  if (wordCount < 3 || wordCount > 8) {
    throw new Error('Word count must be between 3 and 8');
  }

  const selectedWords: string[] = [];
  const randomBytes = generateRandomBytes(wordCount);

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = randomBytes[i] % words.length;
    selectedWords.push(words[randomIndex]);
  }

  return selectedWords.join(separator);
}

/**
 * Generate a PIN code
 * 
 * @param length - PIN length (4-8)
 * @returns Generated PIN
 */
export function generatePIN(length: number = 6): string {
  if (length < 4 || length > 8) {
    throw new Error('PIN length must be between 4 and 8');
  }

  const randomBytes = generateRandomBytes(length);
  return Array.from(randomBytes)
    .map(byte => byte % 10)
    .join('');
}