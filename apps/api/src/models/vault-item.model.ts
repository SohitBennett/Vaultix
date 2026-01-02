import mongoose, { Document, Schema } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  name: string; // Display name (not encrypted)
  category?: string; // Category for organization (not encrypted)
  favorite: boolean; // Favorite flag (not encrypted)
  encryptedData: string; // Base64-encoded encrypted payload
  iv: string; // Base64-encoded initialization vector
  createdAt: Date;
  updatedAt: Date;
}

const vaultItemSchema = new Schema<IVaultItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [255, 'Name cannot exceed 255 characters'],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    encryptedData: {
      type: String,
      required: [true, 'Encrypted data is required'],
    },
    iv: {
      type: String,
      required: [true, 'IV is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
vaultItemSchema.index({ userId: 1, createdAt: -1 });
vaultItemSchema.index({ userId: 1, favorite: 1 });
vaultItemSchema.index({ userId: 1, category: 1 });

// Text index for searching by name
vaultItemSchema.index({ name: 'text' });

// Don't return sensitive fields in JSON (though they're encrypted anyway)
vaultItemSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.userId; // Don't expose userId in responses
    return ret;
  },
});

export const VaultItem = mongoose.model<IVaultItem>('VaultItem', vaultItemSchema);