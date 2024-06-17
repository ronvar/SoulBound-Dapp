import { Container, Stack, Text } from "@mantine/core";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <Container w={"100%"} mt={"lg"} mb={"lg"}>
      <Stack>
        <Text fz={"xl"} weight={700} mb={"sm"}>
          {title}
        </Text>
        {children}
      </Stack>
    </Container>
  );
};

export default Section;
