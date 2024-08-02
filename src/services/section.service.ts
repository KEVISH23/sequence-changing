import { injectable } from "inversify";
import { Section } from "../models";

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
            return await Section.find().sort({ sequence: 1 })
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
            if (sequence > totalDocuments) {
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