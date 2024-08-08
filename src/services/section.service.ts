import { injectable } from "inversify";
import { Content, Section } from "../models";
import { PipelineStage } from "mongoose";

@injectable()
export class SectionService {
    async addSection(data: any) {
        try {
            await Section.create(data)
        } catch (error) {
            throw (error)
        }
    }

    async getSection() {
        try {
            // return await Section.find().sort({ sequence: 1 })
            const pipeline: PipelineStage[] = [
                {
                    $lookup: {
                        from: "contents",
                        localField: "_id",
                        foreignField: "sectionId",
                        as: "contentDetails",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "items",
                                    localField: "itemId",
                                    foreignField: "_id",
                                    as: "itemsDetails"
                                }
                            }
                            ,
                            {
                                $unwind: {
                                    path: "$itemsDetails"
                                }
                            }
                        ]
                    }
                }, {
                    $sort: {
                        sequence: 1,
                    }
                },
                {
                    $addFields: {
                        contentDetails: {
                            $sortArray: {
                                input: "$contentDetails",
                                sortBy: { sequence: 1 }
                            }
                        }
                    }
                }
            ]

            return await Section.aggregate(pipeline)
        } catch (error) {
            throw (error)
        }
    }
    async deleteSection(id: string) {
        try {
            const deletingSection = await Section.findByIdAndDelete(id)
            const deletedSequence = deletingSection?.sequence
            if (!deletedSequence) {
                throw new Error('No section found of such ID')
            }
            const data = await Section.updateMany({ sequence: { $gt: deletedSequence } }, {
                $inc: {
                    sequence: -1
                }
            })
            // console.log(data)
        } catch (error) {
            throw (error)
        }
    }
    async updateSectionSequence(id: string, sequence: number) {
        try {
            const totalDocuments = await Section.countDocuments();
            if (sequence > totalDocuments || sequence < 1) {
                throw new Error('Invalid Sequence provided');
            }

            const toBeUpdatedSection = await Section.findById(id);
            if (!toBeUpdatedSection?.sequence) {
                throw new Error('Section not found');
            }

            const changesInSequence = sequence - toBeUpdatedSection.sequence;
            const addSub = toBeUpdatedSection.sequence < sequence ? -1 : 1;
            const minSequence = Math.min(sequence, toBeUpdatedSection.sequence);
            const maxSequence = Math.max(sequence, toBeUpdatedSection.sequence);

            await Section.updateMany(
                {
                    sequence: { $gte: minSequence, $lte: maxSequence }
                },
                [
                    {
                        $set: {
                            sequence: {
                                $cond: {
                                    if: { $eq: ["$sequence", toBeUpdatedSection.sequence] },
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