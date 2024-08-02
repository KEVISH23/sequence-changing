let addSub = 1;
const totalDocuments = await Section.countDocuments();
if (sequence > totalDocuments) {
  throw new Error("Invalid Sequence provided");
}
const toBeUpdatedSection = await Section.findById(id);
if (!toBeUpdatedSection?.sequence) {
  throw new Error("Section not found");
}
const changesInSequence = sequence - toBeUpdatedSection.sequence;
let conditionalObject = {
  sequence: { $gte: sequence, $lte: toBeUpdatedSection.sequence },
};
if (toBeUpdatedSection.sequence < sequence) {
  conditionalObject = {
    sequence: { $gte: toBeUpdatedSection.sequence, $lte: sequence },
  };
  addSub = -1;
}
console.log(conditionalObject);
await Section.updateMany(conditionalObject, [
  {
    $set: {
      sequence: {
        $cond: {
          if: { $eq: ["$sequence", toBeUpdatedSection.sequence] },
          then: { $add: ["$sequence", changesInSequence] },
          else: { $add: ["$sequence", addSub] },
        },
      },
    },
  },
]);
