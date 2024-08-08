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


const pipeline= [
  {
    $lookup: {
      from: "sections",
      localField: "sectionId",
      foreignField: "_id",
      as: "sectionDetails"
    }
  },{
    $unwind: {
      path: "$sectionDetails",
    }
  },{
    $lookup: {
      from: "items",
      localField: "itemId",
      foreignField: "_id",
      as: "itemsDetails"
    }
  },{
    $unwind:{
      path:"$itemsDetails"
    }
  },{
    $group: {
      _id: "$sectionId",
      content:{$push:"$_id"},
      items:{$push:"$itemsDetails"},
      sectionDetails:{$first:"$sectionDetails"},
      sectionSequence:{$first:"$sectionDetails.sequence"}
    }
  },
  {
    $sort: {
      sectionSequence: 1
    }
  }
]

const pipeline1 = [
  {
    $lookup: {
      from: "sections",
      localField: "sectionId",
      foreignField: "_id",
      as: "sectionDetails"
    }
  },
  {
    $unwind: {
      path: "$sectionDetails"
    }
  },
  {
    $lookup: {
      from: "items",
      localField: "itemId",
      foreignField: "_id",
      as: "itemsDetails"
    }
  },
  {
    $unwind: {
      path: "$itemsDetails"
    }
  },
  {
    $group: {
      _id: "$sectionId",
      content: {
        $push: {
          _id: "$_id",
          sequence: "$sequence",
          itemsDetails: "$itemsDetails"
        }
      },
      sectionDetails: {
        $first: "$sectionDetails"
      },
      sectionSequence: {
        $first: "$sectionDetails.sequence"
      }
    }
  },
  {
    $sort: {
      sectionSequence: 1
    }
  },
  {
    $addFields: {
      content: {
        $sortArray: {
          input: "$content",
          sortBy: { sequence: 1 }
        }
      }
    }
  }
]
return await Content.aggregate(pipeline)