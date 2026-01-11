import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  profile: "nodejsUser",
});

export const createUploadSignedUrl = async ({ key, contentType }) => {
  //   console.log({ contentType });
  const command = new PutObjectCommand({
    Bucket: "stuff-vault",
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
    signableHeaders: new Set(["content-type"]),
  });

  //   console.log(url);
  return url;
};

export const createGetSignedUrl = async ({
  key,
  download = false,
  fileName,
}) => {
  const command = new GetObjectCommand({
    Bucket: "stuff-vault",
    Key: key,
    ResponseContentDisposition: `${
      download ? "attachment" : "inline"
    }; filename=${encodeURIComponent(fileName)}`,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  return url;
};

export const getS3FileMetaData = async (key) => {
  const command = new HeadObjectCommand({
    Bucket: "stuff-vault",
    Key: key,
  });

  return s3Client.send(command);
};

export const deleteS3File = async (key) => {
  // console.log({key});
  const command = new DeleteObjectCommand({
    Bucket: "stuff-vault",
    Key: key,
  });

  return s3Client.send(command);
};

export const deleteS3Files = async (keys) => {
  const command = new DeleteObjectsCommand({
    Bucket: "stuff-vault",
    Delete: {
      Objects: keys,
      Quite: false,
    },
  });

  return s3Client.send(command);
};
