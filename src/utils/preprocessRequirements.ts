import { Requirement } from "types"

const preprocessRequirements = (requirements: Array<Requirement>) => {
  if (!requirements || !Array.isArray(requirements)) return undefined

  const freeRequirement = requirements.find(
    (requirement) => requirement.type === "FREE"
  )

  if (freeRequirement) return [freeRequirement]

  // see the comment in Requirements.tsx at line 42
  return (
    requirements
      // Setting unused props to undefined, so we don't send them to the API
      .map((requirement) => {
        const processedRequirement = {
          ...requirement,
          nftRequirementType: undefined,
        }

        if (requirement.address === "0x0000000000000000000000000000000000000000")
          requirement.address = undefined

        if (
          requirement.data?.attribute &&
          !requirement.data?.attribute?.trait_type &&
          !requirement.data?.attribute?.value &&
          !requirement.data?.attribute?.interval
        )
          requirement.data.attribute = undefined

        if (
          requirement.type === "ALLOWLIST" &&
          !requirement.data?.addresses &&
          !requirement.data?.hideAllowlist
        )
          requirement.data.addresses = []

        // Deleting ID here, we don't want to update it, and it might also cause bugs
        delete processedRequirement.id

        return processedRequirement
      })
  )
}

export default preprocessRequirements
