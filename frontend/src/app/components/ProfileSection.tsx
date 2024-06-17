import { AuthContext } from "@/contextWrappers/authContext"
import { Box, Center, Stack, Text } from "@mantine/core";
import { useContext } from "react"
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const ProfileSection = () => {
    const { user } = useContext(AuthContext);
    const validUser = !!user?.dynamic_user_id && !!user?.email;

    return (
        <Box w={"100%"}>
            <Center>
                <Stack align="center">
                    <Text fz={40} weight={700}>My Details</Text>
                    {validUser && (
                        <Stack spacing={16}>
                            <Text fz={"lg"} weight={700}>
                                Email: <Text inline weight={400}>{user?.email}</Text>
                            </Text>
                            <Text fz={"lg"} weight={700}>
                                User ID: <Text inline weight={400}>{user?.user_id}</Text>
                            </Text>
                            {!!user.wallet_address && (
                                <Text fz={"lg"} weight={700}>
                                Wallet Address: <Text inline weight={400}>{user?.wallet_address}</Text>
                            </Text>
                            )}
                            {!user?.wallet_address && (
                                <Stack spacing={16}>
                                    <Text fz={"lg"} weight={700}>
                                        {`You don't have a wallet connected yet. You can do that now.`}
                                    </Text>
                                    <DynamicWidget />
                                </Stack>
                                )}
                        </Stack>
                    )}
                    {!validUser && (
                        <Text fz={"xl"} weight={700}>
                            {"No user found"}
                        </Text>
                    )}
                </Stack>
            </Center>
        </Box>
    )
}

export default ProfileSection;