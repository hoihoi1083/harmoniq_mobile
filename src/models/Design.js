import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    canvasPosition: {
        x: Number,
        y: Number
    },
    compassRotation: Number,
    scale: Number,

    localItems: [{
        id: String,
        _type: String,
        activeIcon: String,
        direction: String,
        data: {
            cateType: String,
            _type: String,
            label: String,
            icon: String,
            // activeIcon: String,
            parentRoom: {
                type: mongoose.Schema.Types.Mixed,
                default: null
            },
            size: {
                width: Number,
                height: Number
            },
        },
        size: {
            width: Number,
            height: Number
        },
        position: {
            x: Number,
            y: Number
        },
        rotation: {
            type: Number,
            default: 0
        },
        parentId: {
            type: String,
            default: null
        },
        offset: {
            x: Number,
            y: Number
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 更新时自动更新updatedAt字段
designSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Design = mongoose.models.Design || mongoose.model('Design', designSchema);

export default Design; 