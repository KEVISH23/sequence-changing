import { injectable } from "inversify";
import { Content } from "../models";
import mongoose, { PipelineStage } from "mongoose";

@injectable()
export class ContentService {
    async addContent(data: any) {
        try {
            const { sectionId } = data
            const sequenceCount = await Content.findOne({ sectionId }).sort({ sequence: -1 })
            const contentObject = {
                ...data,
                sequence: sequenceCount ? sequenceCount.sequence + 1 : 1
            }
            await Content.create(contentObject)
        } catch (error) {
            throw (error)
        }
    }

    async getAllContent(id: string | undefined) {
        try {

            let matchQuery = {
                $match: {}
            }

            id ? matchQuery = {
                $match: {
                    sectionId: new mongoose.Types.ObjectId(id)
                }
            } : null
            const pipeline: PipelineStage[] = [
                {
                    ...matchQuery
                },
                {
                    $lookup: {
                        from: "items",
                        localField: "itemId",
                        foreignField: "_id",
                        as: "itemDetails"
                    }
                },
                {
                    $unwind: {
                        path: '$itemDetails'
                    }
                },
            ]
            id && pipeline.push({ $sort: { sequence: 1 } })
            return await Content.aggregate(pipeline)
        } catch (error) {
            throw (error)
        }
    }
    async deleteContent(id: string) {
        try {
            const deletingContent = await Content.findByIdAndDelete(id)
            const deletedContent = deletingContent?.sequence
            const deletedSectionId = deletingContent?.sectionId
            if (!deletedContent) {
                throw new Error('No section found of such ID')
            }
            const data = await Content.updateMany({ sequence: { $gt: deletedContent }, sectionId: new mongoose.Types.ObjectId(deletedSectionId) }, {
                $inc: {
                    sequence: -1
                }
            })
        } catch (error) {
            throw (error)
        }
    }
    async updateContentSequence(id: string, sequence: number) {
        try {
            const content = await Content.findById(id)
            if (!content?.sequence) {
                throw new Error('No such content found')
            }
            const sectionId = content?.sectionId
            const lastSection = await Content.findOne({ sectionId }).sort({ sequence: -1 })
            const lastsequence = lastSection?.sequence

            if (lastsequence && sequence > lastsequence) {
                throw new Error('Invalid Sequence provided');
            }

            const changesInSequence = sequence - content.sequence;
            const addSub = content.sequence < sequence ? -1 : 1;
            const minSequence = Math.min(sequence, content.sequence);
            const maxSequence = Math.max(sequence, content.sequence);

            await Content.updateMany(
                {
                    sectionId: new mongoose.Types.ObjectId(sectionId),
                    sequence: { $gte: minSequence, $lte: maxSequence }
                },
                [
                    {
                        $set: {
                            sequence: {
                                $cond: {
                                    if: { $eq: ["$sequence", content.sequence] },
                                    then: { $add: ["$sequence", changesInSequence] },
                                    else: { $add: ["$sequence", addSub] }
                                }
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            throw (error)
        }
    }
}