import { ShadowRootWrapper } from "@/app/ShadowRootWrapper";
import { FoxioApp } from "@/app/FoxioApp";
import styles from "./index.css?inline";

export default function App() {
  return (
    <ShadowRootWrapper styles={styles}>
      {(mountNode) => (
        <FoxioApp
          targetElement={mountNode}
          config={{
            title: "Foxio",
            logo: "/fox.png",
            initialRoute: "/tutorial",
            theme: "light",
            colorTheme: "orange",
          }}
        />
      )}
    </ShadowRootWrapper>
  );
}
