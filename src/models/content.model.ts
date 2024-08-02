import mongoose from "mongoose";
const ContentSchema = new mongoose.Schema({
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Section id is required'],
        ref: 'section'
    },
    itemId:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Item id is required'],
        ref: 'item'
    },
    buttonText: {
        type: String,
        required: [true, 'Button text is required'],
        default: "Watch free"
    },
    buttonBgColor: {
        type: String,
        required: [true, 'Button color is required'],
        default: "black"
    },
    buttonTextColor: {
        type: String,
        required: [true, 'Button text color is required'],
        default: "white"
    },
    isFree: {
        type: Boolean,
        default: false
    },
    freeBadgeColor: {
        type: String,
        required: [true, 'freeBadgeColor is required'],
        default: "aqua"
    },
    freeBadgeBgColor: {
        type: String,
        required: [true, 'freeBadgeBgColor is required'],
        default: "black"
    },
    sequence: {
        type: Number,
        required: true
    },

}, {
    timestamps: true
})

const Content = mongoose.model('content', ContentSchema)
export { Content }