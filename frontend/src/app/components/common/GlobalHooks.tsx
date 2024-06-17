import useDyamicAuth from "@/hooks/useDynamicAuth";
import useMintedTokens from "@/hooks/useMintedTokens";

// This component is used to call all global hooks that are used in the application
const GlobalHooks = () => {
    const FETCH_DATA = true;

    useMintedTokens(FETCH_DATA);
    useDyamicAuth();

    return null;
};

export default GlobalHooks;