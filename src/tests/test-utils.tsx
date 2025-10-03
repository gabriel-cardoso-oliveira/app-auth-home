import { render, RenderOptions } from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "@/design/theme";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={tamaguiConfig}>{children}</TamaguiProvider>
);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";

export { customRender as render };
