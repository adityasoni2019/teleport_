import React from "react";
import LeftPanel from "./Components/LeftPanel";
import RightPanel from "./Components/RightPanel";
import MidPanel from "./Components/MidPanel";

function App() {
  return (
    <div className="flex w-full h-screen">
      <LeftPanel />
      <MidPanel  />
      <RightPanel  />
    </div>
  );
}

export default App;