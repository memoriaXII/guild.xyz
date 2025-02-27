import { Box, HStack, Icon, Link, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import QRCode from "qrcode.react"

type Props = {
  inviteLink: string
}

const InviteLink = ({ inviteLink }: Props): JSX.Element => {
  if (!inviteLink?.length) return null

  return (
    <HStack spacing={6} maxW="full">
      <QRCode
        size={80}
        value={inviteLink ?? ""}
        style={{
          border: "2px solid var(--chakra-colors-gray-500)",
          borderRadius: "var(--chakra-radii-md)",
        }}
      />
      <Box overflow={"hidden"}>
        <Text>Here’s your invite link:</Text>
        <Link
          maxW={"full"}
          href={inviteLink}
          colorScheme="blue"
          isExternal
          fontWeight={"semibold"}
        >
          <Text as="span" noOfLines={1}>
            {inviteLink}
          </Text>
          <Icon as={ArrowSquareOut} mx="1" />
        </Link>
      </Box>
    </HStack>
  )
}

export default InviteLink
