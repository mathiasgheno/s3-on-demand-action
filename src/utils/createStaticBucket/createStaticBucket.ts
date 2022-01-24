import {
  S3Client,
  DeleteBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutBucketWebsiteCommand,
} from '@aws-sdk/client-s3';
import { CONFIGS } from "../../configs/configs";

const S3 = new S3Client({ region: CONFIGS.region });

const gereratePolicy = (Bucket: string): string => {
  return JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${Bucket}/*`,
        }
      ]
    }
  )
}

export async function createStaticBucket(Bucket: string): Promise<void> {
  const configurePublicAccess = () => {}
  const configureStaticContent = () => {}

  const deleteBucketCallback = async (erro: any) => {
    const deleteCommand = new DeleteBucketCommand({ Bucket });
    await S3.send(deleteCommand);
    console.info(`Bucket ${Bucket} deleted successfully`);
    return Promise.reject(erro);
  }

  const errorCallback = (erro: any) => {
    const message = `
      An erro has ocorred trying to put policies in bucket ${Bucket}.
      Bucket will be deleted.
    `;
    console.error(message);
    throw new Error(erro);
  }

  try {
    await S3.send(
      new CreateBucketCommand({
        Bucket,
      }),
    );

    await S3.send(
      new PutBucketPolicyCommand({
        Bucket,
        Policy: gereratePolicy(Bucket),
      })
    )
      .catch(errorCallback)
      .catch(deleteBucketCallback)

    await S3.send(
      new PutBucketWebsiteCommand({
        Bucket,
        WebsiteConfiguration: {
          IndexDocument: {
            Suffix: 'index.html',
          },
        }
      })
    )
  } catch (erro) {
    const message = `An erro has ocorred in deleteBucketCallback while trying to create Bucket ${Bucket}: ${erro}`;
    throw new Error(message);
  }
}

createStaticBucket('mathiasgheno-vanilla-modal-on-demand-test-4').then(console.log);
