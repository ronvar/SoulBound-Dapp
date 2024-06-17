"use client";
import DynamicWrapper from "@/contextWrappers/dynamicWrapper";
import dotenv from "dotenv";
import { Container, MantineProvider } from "@mantine/core";
import Layout from "./components/common/AppLayout";
import Sidebar from "./components/common/Sidebar";
import { AuthProvider } from "@/contextWrappers/authContext";
import HomePage from "./components/common/Home";

dotenv.config();

export default function Home() {
  return (
    <AuthProvider>
    <DynamicWrapper>
      <MantineProvider withNormalizeCSS withGlobalStyles withCSSVariables>
        <Layout size={"100%"} sidebar={<Sidebar />}>
          <Container maw={"calc(100%)"} pl={100}>
            <HomePage />
          </Container>
        </Layout>
      </MantineProvider>
    </DynamicWrapper>
    </AuthProvider>
  );
}
