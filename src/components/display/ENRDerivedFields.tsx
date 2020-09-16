import React, {useEffect, useState} from "react";
import {ENR} from "@chainsafe/discv5";

import NamedOutput from "./NamedOutput";

type DisplayValue = string | number;

async function getDerivedKVs(enr: ENR): Promise<{key: string; value: DisplayValue}[]> {
  const kvs = [];
  kvs.push({key: "node id", value: enr.nodeId});
  kvs.push({key: "peer id", value: (await enr.peerId()).toB58String()});
  const muTypes = ["tcp4", "tcp6", "udp4", "udp6"] as const;
  for (const muType of muTypes) {
    const mu = await enr.getFullMultiaddr(muType);
    if (mu) {
      kvs.push({key: `${muType} multiaddr`, value: mu.toString()});
    }
  }
  return kvs;
}

export default function ENRDerivedFields({enr}: {enr: ENR}): JSX.Element {
  const [ENRDerivedFields, setENRDerivedFields] = useState(null as ({key: string; value: DisplayValue}[]) | null);
  useEffect(() => {
    if (!ENRDerivedFields) {
      getENRDerivedFields();
    }
  }, []);
  const getENRDerivedFields = async (): Promise<void> => setENRDerivedFields(await getDerivedKVs(enr));
  return (
    <>
      {
        ENRDerivedFields && ENRDerivedFields.map(f => <NamedOutput key={f.key} name={f.key} value={f.value} />)
      }
    </>
  );
}


