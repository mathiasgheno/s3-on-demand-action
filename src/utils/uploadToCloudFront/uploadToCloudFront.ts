import {
  CreateDistributionCommand,
  CloudFrontClient,
} from '@aws-sdk/client-cloudfront';
import { CONFIGS } from '../../configs/configs';
import log from 'loglevel';
import { getBuckeDomain } from '../getBucketUrl/getBucketUrl';

export const uploadToCloudFront = (Bucket: string) => {
  log.info('Running uploadToCloudFront');
  const client = new CloudFrontClient({ region: CONFIGS.region });
  const DomainName = getBuckeDomain(Bucket);
  log.info(`DomainName ${DomainName}`);
  const command = new CreateDistributionCommand({
    DistributionConfig: {
      Origins: {
        Items: [
          {
            CustomOriginConfig: {
              HTTPPort: 80,
              OriginKeepaliveTimeout: 5,
              OriginProtocolPolicy: 'https-only',
              OriginReadTimeout: 30,
              OriginSslProtocols: {
                Items: ['TLSv1.2'],
                Quantity: 1,
              },
              HTTPSPort: 443,
            },
            Id: Bucket,
            DomainName,
          },
        ],
        Quantity: 1
      },
      DefaultRootObject: 'index.html',
      Comment: `Created from s3-on-demand-action and ${Bucket}`,
      CallerReference: new Date().toDateString(),
      DefaultCacheBehavior: {
        ViewerProtocolPolicy: 'https-only',
        TargetOriginId: Bucket,
        MinTTL: 0,
        ForwardedValues: {
          Cookies: {Forward: 'all'},
          Headers: {Items: [], Quantity: 0},
          QueryString: false,
          QueryStringCacheKeys: {Items: [], Quantity: 0},
        }
      },
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

// uploadToCloudFront('2874623886')
//   .then(data => console.log(data))
