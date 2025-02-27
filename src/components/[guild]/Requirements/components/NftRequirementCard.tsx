import { Text } from "@chakra-ui/react"
import { ImageData } from "@nouns/assets"
import DataBlock from "components/common/DataBlock"
import { NOUNS_BACKGROUNDS } from "components/create-guild/Requirements/components/NftFormCard/hooks/useNftMetadata"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import OpenseaUrl from "./common/OpenseaUrl"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const imageDataTypeMap = {
  body: "bodies",
  accessory: "accessories",
  head: "heads",
  glasses: "glasses",
}

const getNounsRequirementType = (attribute: Requirement["data"]["attribute"]) =>
  !attribute
    ? undefined
    : attribute.trait_type === "background"
    ? NOUNS_BACKGROUNDS?.[attribute.value]
    : ImageData.images?.[imageDataTypeMap[attribute.trait_type]]?.[+attribute.value]
        ?.filename

const NftRequirementCard = ({ requirement, ...rest }: Props) => {
  const { data, isValidating } = useSWRImmutable<{ image: string }>(
    requirement.address ? `/api/opensea-asset-data/${requirement.address}` : null
  )

  const shouldRenderImage =
    requirement.chain === "ETHEREUM" && requirement.name && requirement.name !== "-"

  const attributeValue =
    requirement.type === "NOUNS"
      ? getNounsRequirementType(requirement.data?.attribute)
      : requirement.data?.attribute?.value

  return (
    <RequirementCard
      image={
        shouldRenderImage && (isValidating || data?.image) ? (
          isValidating ? (
            ""
          ) : (
            data?.image
          )
        ) : (
          <Text as="span" fontWeight="bold" fontSize="xs">
            NFT
          </Text>
        )
      }
      loading={isValidating}
      footer={<OpenseaUrl requirement={requirement} />}
      {...rest}
    >
      {`Own ${
        requirement.data?.id
          ? `the #${requirement.data.id}`
          : requirement.data?.maxAmount > 0
          ? `${requirement.data?.minAmount}-${requirement.data?.maxAmount}`
          : requirement.data?.minAmount > 1
          ? `at least ${requirement.data?.minAmount}`
          : "a(n)"
      } `}

      {requirement.symbol === "-" &&
      requirement.address?.toLowerCase() ===
        "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" ? (
        "ENS"
      ) : !requirement.name || requirement.name === "-" ? (
        <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock>
      ) : (
        requirement.name
      )}

      {requirement.data?.attribute?.trait_type
        ? ` ${
            attributeValue || requirement.data?.attribute?.interval
              ? ` with ${
                  requirement.data?.attribute?.interval
                    ? `${requirement.data?.attribute?.interval?.min}-${requirement.data?.attribute?.interval?.max}`
                    : attributeValue
                } ${requirement.data?.attribute?.trait_type}`
              : ""
          }`
        : ` NFT${
            requirement.data?.maxAmount > 0 || requirement.data?.minAmount > 1
              ? "s"
              : ""
          }`}
    </RequirementCard>
  )
}

export default NftRequirementCard
