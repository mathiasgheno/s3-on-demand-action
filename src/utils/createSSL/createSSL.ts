import { RequestCertificateCommand, ACMClient } from '@aws-sdk/client-acm';
import { CreateDistributionCommand, CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { CONFIGS } from "../../configs/configs";
import { v4 } from 'uuid';
import log from 'loglevel';

function requestCertification(DomainName: string) {
  const acmInstance = new ACMClient({ region: 'us-east-1' });
  const certificationCommand = new RequestCertificateCommand({
    DomainName,
  });
  return acmInstance.send(certificationCommand);
}

function createDistribution(DomainName: string) {
  const cloudfront = new CloudFrontClient(CONFIGS);
  const createDistributionCommand = new CreateDistributionCommand({
    DistributionConfig: {
      Origins: {
        Items: [
          {
            Id: v4(),
            DomainName,
          }
        ],
        Quantity: 1,
      },
      Enabled: true,
      CallerReference: new Date().toISOString(),
      Comment: 'Test',
      DefaultCacheBehavior: undefined,
    }
  });
  return cloudfront.send(createDistributionCommand);
}

async function createSSL(domain: string) {
  log.info('Executing createSSL for domain ' + domain);
  await requestCertification(domain);
  await createDistribution(domain);
  log.info('Finished createSSL execution');
}
