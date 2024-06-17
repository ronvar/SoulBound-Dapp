import React, { useState } from "react";
import {
  Anchor,
  AppShell,
  Box,
  Center,
  Container,
  Header,
  Image,
  createStyles,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const GENERIC_LOGO = "https://cryptologos.cc/logos/polygon-matic-logo.png";

const useStyles = createStyles(() => ({
  genericHeader: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
    paddingRight: 20,
    paddingLeft: 20,
  },
}));

const GenericHeader = () => {
  const { classes } = useStyles();

  return (
    <Header height={88} p={"md"}>
      <div className={classes.genericHeader}>
        <Anchor href="/">
          <Image
            src={GENERIC_LOGO}
            height={40}
            width={46}
            alt="logo"
            draggable={false}
          />
        </Anchor>
        <DynamicWidget />
      </div>
    </Header>
  );
};

const Layout = ({
  children,
  headerToolbar,
  sidebar,
}: {
  children: any;
  headerToolbar?: JSX.Element;
  sidebar?: JSX.Element;
  size: string | number;
  footerToolbar?: any;
  title?: string;
  description?: string;
  image?: string;
}) => {
  const [ready, setReady] = useState(false);

  useShallowEffect(() => {
    setReady(true);
  }, []);

  return (
    <Container
      px={0}
      size={"100%"}
      style={{
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <AppShell
        navbarOffsetBreakpoint={"sm"}
        asideOffsetBreakpoint={"sm"}
        header={ready ? headerToolbar || <GenericHeader /> : undefined}
        navbar={ready ? sidebar : undefined}
        styles={(theme) => ({
          main: {
            maxWidth: `calc(100% - 100px)`,
            minHeight: `calc(100vh - ${headerToolbar ? 72 : 88}px)`,
            paddingLeft: !sidebar ? theme.spacing.md : undefined
          },
          
        })}
      >
        {ready && (
          <Box w={"100%"} maw={"100%"} pl={100} style={{
            position: "relative",
          }}>
            <Center>{children}</Center>
          </Box>
        )}
      </AppShell>
    </Container>
  );
};

export default Layout;
