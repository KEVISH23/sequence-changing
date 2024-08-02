import mongoose from 'mongoose'
const SectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: [true, 'section must have a name']
    },
    sequence:{
        type:Number,
        // required: [true, 'sequence is required']
    }
},
    {
        timestamps: true
    })
SectionSchema.pre('save',async function(next){
    try {
        const totalSections = await Section.countDocuments()
        this.sequence = totalSections+1
        next()
    } catch (error) {
        throw(error)
    }
})
const Section = mongoose.model('section', SectionSchema)
export { Section } 