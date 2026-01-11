// This is not in use currently because we are using free distribution.
// We are getting the error of download because currently we can not attacht the content-policy of download due to free distribution

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const privateKey = process.env.CLOUDfONT_PRIVATE_KEY;
const keyPairId = "-------";
// const dateLessThan = "2026-01-07"; // any Date constructor compatible
const dateLessThan = new Date(Date.now() + 1000 * 60 * 60).toISOString();

const distributionName = `https://Distribution_domain_name.cloudfront.net`;

export const getCloudFontGetSignedUrl = ({
  key,
  download = false,
  fileName,
}) => {
  const url = `${distributionName}/${key}?response-content-disposition=${encodeURIComponent(
    `${download ? "attachment" : "inline"};filename=${fileName}`
  )}`;
  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });

  return signedUrl;
  //   console.log(signedUrl);
};
