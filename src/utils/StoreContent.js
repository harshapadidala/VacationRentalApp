import { Web3Storage } from "web3.storage";

const web3storage_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhjNWZkOEJGRDM4YkM0ZTYzOEVlZUE3ZDAzOGRhQmJFQUE0RTAxMjMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODA5MDgxNTEzNjMsIm5hbWUiOiJEZW1vIn0.8sr4WNwmjpExosES-vbyYJ3_p4cCVbECYaALvlxF9_0";

function GetAccessToken() {
  return web3storage_key;
}

function MakeStorageClient() {
  return new Web3Storage({ token: GetAccessToken() });
}

export const StoreContent = async (files) => {
  // console.log("Uploading files to IPFS with web3.storage....");
  // const client = MakeStorageClient();
  // const cid = await client.put([files]);
  // console.log("Stored files with cid:", cid);
  // return cid;

  console.log("Uploading files to IPFS with web3.storage....");
  const client = MakeStorageClient();
  if (!client) {
    console.log("Error: failed to initialize storage client");
    return null;
  }

  try {
    const cid = await client.put([files]);
    console.log("Stored files with cid:", cid);
    return cid;
  } catch (err) {
    console.log("Error storing files:", err);
    return null;
  }
};
