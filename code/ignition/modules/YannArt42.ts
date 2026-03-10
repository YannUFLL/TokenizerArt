import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const YannArtModule = buildModule("YannArt42", (m) => {

  const contract = m.contract("YannArt42");

  return { contract };
});

export default YannArtModule;