import { getAvalanche, createTests, Matcher } from "./e2etestlib"
import { InfoAPI } from "src/apis/info/api"
import BN from "bn.js"

describe("Info", () => {

  const avalanche = getAvalanche()
  let info = avalanche.Info()

  // test_name          response_promise               resp_fn                 matcher           expected_value/obtained_value
  const tests_spec: any = [
    ["getBlockchainID", ()=>info.getBlockchainID("X"), (x)=>x,                 Matcher.toBe,     ()=>"2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"],
    ["getNetworkID",    ()=>info.getNetworkID(),       (x)=>x,                 Matcher.toBe,     ()=>"12345"],
    ["getNetworkName",  ()=>info.getNetworkName(),     (x)=>x,                 Matcher.toBe,     ()=>"local"],
    ["getNodeId",       ()=>info.getNodeID(),          (x)=>x,                 Matcher.toBe,     ()=>"NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"],
    ["getNodeVersion",  ()=>info.getNodeVersion(),     (x)=>x,                 Matcher.toMatch,  ()=>/^avalanche\/\d*\.\d*\.\d*$/],
    ["isBootstrapped",  ()=>info.isBootstrapped("X"),  (x)=>x,                 Matcher.toBe,     ()=>true],
    ["peers",           ()=>info.peers(),              (x)=>x.length,          Matcher.toBe,     ()=>4],
    ["getTxFee1",       ()=>info.getTxFee(),           (x)=>x.txFee,           Matcher.toEqual,  ()=>new BN(1000000)],
    ["getTxFee2",       ()=>info.getTxFee(),           (x)=>x.creationTxFee,   Matcher.toEqual,  ()=>new BN(1000000)],
  ]

  createTests(tests_spec)

})
