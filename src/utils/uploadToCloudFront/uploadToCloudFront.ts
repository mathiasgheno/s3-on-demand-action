import {
  CloudFrontClient,
  CreateDistributionCommand,
  ListDistributionsCommand,
} from '@aws-sdk/client-cloudfront';
import { CONFIGS } from '../../configs/configs';
import log from 'loglevel';
import { getBucketS3Domain } from '../getBucketUrl/getBucketUrl';

export const uploadToCloudFront = async (Bucket: string) => {
  log.info('Running uploadToCloudFront');
  const client = new CloudFrontClient({ region: CONFIGS.region });
  const DomainName = getBucketS3Domain(Bucket);
  log.info(`DomainName ${DomainName}`);
  const list = await client.send(new ListDistributionsCommand({}));
  const alreadyExist = list.DistributionList?.Items?.find(d => d.Id === Bucket);
  if(alreadyExist) {
    log.info(`CloudFront already exists. CloudFormation will not be created`);
    return;
  }
  const command = new CreateDistributionCommand({
    DistributionConfig: {
      CallerReference: Bucket,
      Aliases: {
        Items: [],
        Quantity: 0,
      },
      DefaultRootObject: 'index.html',
      Origins: {
        Items: [
          {
            Id: DomainName,
            DomainName,
            OriginPath: '',
            CustomHeaders: {
              Items: [],
              Quantity: 0,
            },
            S3OriginConfig: {
              OriginAccessIdentity: '',
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false,
            },
          },
        ],
        Quantity: 1
      },
      OriginGroups: {
        Items: [],
        Quantity: 0,
      },
      DefaultCacheBehavior: {
        TargetOriginId: DomainName,
        TrustedSigners: {
          Enabled: false,
          Quantity: 0,
        },
        TrustedKeyGroups: {
          Enabled: false,
          Quantity: 0,
        },
        ViewerProtocolPolicy: 'allow-all',
        AllowedMethods: {
          Quantity: 2,
          Items: ['GET', 'HEAD'],
          CachedMethods: {
            Quantity: 2,
            Items: ['GET', 'HEAD'],
          },
        },
        SmoothStreaming: false,
        Compress: true,
        LambdaFunctionAssociations: {
          Items: [],
          Quantity: 0,
        },
        FunctionAssociations: {
          Items: [],
          Quantity: 0,
        },
        FieldLevelEncryptionId: '',
        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
      },
      ViewerCertificate: {
        CloudFrontDefaultCertificate: true,
        MinimumProtocolVersion: 'TLSv1',
      },
      HttpVersion: 'http2',
      IsIPV6Enabled: true,
      Comment: `Created from s3-on-demand-action and ${Bucket}`,
      Enabled: true,
    },
  });
  log.info(`Running command to create CloudFront ${DomainName}`);
  return client
    .send(command)
    .then(data => {
      log.log('Check your CloudFront distribution at: ', data?.Distribution?.DomainName);
      return data;
    });
}
