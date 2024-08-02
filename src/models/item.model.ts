import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    }
}, {
    timestamps: true
})

const Item = mongoose.model('item', ItemSchema)
export { Item }