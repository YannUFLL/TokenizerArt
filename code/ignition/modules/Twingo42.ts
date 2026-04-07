import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Twingo42 = buildModule("Twingo42", (m) => {

  const contract = m.contract("Twingo42");

  return { contract };
});

export default Twingo42