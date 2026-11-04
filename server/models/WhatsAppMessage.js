const mongoose = require('mongoose');

const whatsAppMessageSchema = new mongoose.Schema({
  // Message identifiers
  messageId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  wabaId: {
    type: String, // WhatsApp Business Account ID
    trim: true
  },
  
  // Contact information
  from: {
    type: String,
    required: true,
    index: true // Phone number in E.164 format (e.g., +254712345678)
  },
  to: {
    type: String,
    required: true // Business phone number
  },
  contactName: {
    type: String,
    trim: true
  },
  
  // Message content
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'document', 'location', 'contacts', 'interactive', 'template', 'sticker'],
    default: 'text'
  },
  body: {
    type: String,
    trim: true
  },
  mediaUrl: {
    type: String,
    trim: true
  },
  mediaId: {
    type: String,
    trim: true
  },
  caption: {
    type: String,
    trim: true
  },
  
  // Message direction
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true,
    index: true
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed', 'pending'],
    default: 'pending',
    index: true
  },
  statusTimestamp: {
    type: Date
  },
  errorCode: {
    type: String
  },
  errorMessage: {
    type: String
  },
  
  // Template message (for outbound template messages)
  templateName: {
    type: String,
    trim: true
  },
  templateParams: [{
    type: String
  }],
  
  // Interactive message data
  interactiveData: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Context (for replies)
  context: {
    from: String,
    id: String
  },
  
  // Association with Contact model
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    index: true
  },

  // Association with Lead model (CRM)
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    index: true
  },
  
  // Association with User (for outbound messages sent by admin)
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  
  // Tags for organization
  tags: [{
    type: String,
    trim: true
  }],
  
  // Notes
  notes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
whatsAppMessageSchema.index({ from: 1, timestamp: -1 });
whatsAppMessageSchema.index({ contactId: 1, timestamp: -1 });
whatsAppMessageSchema.index({ direction: 1, status: 1, timestamp: -1 });
whatsAppMessageSchema.index({ createdAt: -1 });

// Method to mark as read
whatsAppMessageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to update status
whatsAppMessageSchema.methods.updateStatus = function(status, errorCode = null, errorMessage = null) {
  this.status = status;
  this.statusTimestamp = new Date();
  if (errorCode) this.errorCode = errorCode;
  if (errorMessage) this.errorMessage = errorMessage;
  return this.save();
};

// Static method to get conversation with a contact.
// Inbound messages store the counterpart in `from` (digits only, e.g. 254712345678)
// while outbound store it in `to` (E.164, e.g. +254712345678), so match both fields
// and both formats.
whatsAppMessageSchema.statics.getConversation = async function(phoneNumber, limit = 50) {
  const digits = String(phoneNumber).replace(/\D/g, '');
  const variants = [digits, `+${digits}`];
  return this.find({ $or: [{ from: { $in: variants } }, { to: { $in: variants } }] })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('contactId', 'name email company')
    .populate('leadId', 'firstName lastName email company status')
    .populate('sentBy', 'name email');
};

// Static method to mark all inbound messages in a conversation as read
whatsAppMessageSchema.statics.markConversationRead = async function(phoneNumber) {
  const digits = String(phoneNumber).replace(/\D/g, '');
  const variants = [digits, `+${digits}`];
  return this.updateMany(
    { direction: 'inbound', from: { $in: variants }, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

// Static method to get unread messages count
whatsAppMessageSchema.statics.getUnreadCount = async function() {
  return this.countDocuments({ 
    direction: 'inbound', 
    isRead: false 
  });
};

// Static method to get recent conversations, grouped by the customer's phone
// number regardless of message direction. The counterpart is `from` for inbound
// messages and `to` for outbound; formats are normalized to digits only.
whatsAppMessageSchema.statics.getRecentConversations = async function(limit = 20) {
  return this.aggregate([
    {
      $addFields: {
        counterpart: {
          $cond: [{ $eq: ['$direction', 'inbound'] }, '$from', '$to']
        }
      }
    },
    {
      $addFields: {
        counterpartKey: {
          $replaceAll: { input: '$counterpart', find: '+', replacement: '' }
        }
      }
    },
    {
      $sort: { timestamp: -1 }
    },
    {
      $group: {
        _id: '$counterpartKey',
        lastMessage: { $first: '$$ROOT' },
        messageCount: { $sum: 1 },
        contactName: { $max: '$contactName' },
        contactId: { $max: '$contactId' },
        leadId: { $max: '$leadId' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$direction', 'inbound'] }, { $eq: ['$isRead', false] }] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.timestamp': -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'contacts',
        localField: 'contactId',
        foreignField: '_id',
        as: 'contact'
      }
    },
    {
      $unwind: {
        path: '$contact',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'leads',
        localField: 'leadId',
        foreignField: '_id',
        as: 'lead',
        pipeline: [
          { $project: { firstName: 1, lastName: 1, company: 1, status: 1, leadRating: 1 } }
        ]
      }
    },
    {
      $unwind: {
        path: '$lead',
        preserveNullAndEmptyArrays: true
      }
    }
  ]);
};

// Static method to get message statistics
whatsAppMessageSchema.statics.getStats = async function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = new Date(startDate);
    if (endDate) matchStage.timestamp.$lte = new Date(endDate);
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        inbound: { $sum: { $cond: [{ $eq: ['$direction', 'inbound'] }, 1, 0] } },
        outbound: { $sum: { $cond: [{ $eq: ['$direction', 'outbound'] }, 1, 0] } },
        sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
        delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
        unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    inbound: 0,
    outbound: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    unread: 0
  };
};

module.exports = mongoose.model('WhatsAppMessage', whatsAppMessageSchema);

