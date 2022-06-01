import {
  CreateDistributionCommand,
  CloudFrontClient,
} from '@aws-sdk/client-cloudfront';
import { CONFIGS } from '../../configs/configs';
import log from 'loglevel';

export const uploadToCloudFront = (Bucket: string) => {
  const client = new CloudFrontClient({ region: CONFIGS.region });
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
            DomainName: Bucket,
          },
        ],
        Quantity: 1
      },
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
  return client
    .send(command)
    .then(data => {
      log.log('Check your CloudFront distribution at: ', data?.Distribution?.DomainName);
      return data;
    });
}
//
// uploadToCloudFront('mathias-gheno-vanilla-modal-on-demand-test-6.s3-website-sa-east-1.amazonaws.com')
//   .then(data => console.log(data))
