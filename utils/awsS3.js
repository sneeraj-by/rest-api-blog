const {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const generateCode = require("../utils/generateCode");

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async ({ file, ext }) => {
  const Key = `${generateCode(12)}_${Date.now()}${ext}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
    Body: file.buffer,
    contentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  try {
    await client.send(command);
    return Key;
  } catch (error) {
    console.log(error);
  }
};

const fetchSignedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  try {
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return url;
  } catch (error) {
    console.log(error);
  }
};

const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);
  try {
    await client.send(command);
    return;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadFileToS3, fetchSignedUrl, deleteFileFromS3 };
