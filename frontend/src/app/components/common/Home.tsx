import { selectedPageSectionAtom } from "@/atoms/pageAtoms";
import { Container } from "@mantine/core";
import { useAtom } from "jotai";
import NftsSection from "../NftsSections";
import GlobalHooks from "./GlobalHooks";
import ProfileSection from "../ProfileSection";

const HomePage = () => {
  const [selectedPageSection] = useAtom(selectedPageSectionAtom);

  return (
    <Container>
      <GlobalHooks />
      {selectedPageSection.id === "profile" && <ProfileSection />}
      {selectedPageSection.id === "all-minted" && <NftsSection type="all" />}
      {selectedPageSection.id === "my-minted" && <NftsSection type="user" />}
    </Container>
  );
};

export default HomePage;
