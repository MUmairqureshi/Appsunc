import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as lambda from '@aws-cdk/aws-lambda';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AppsyncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "GRAPHQLTEST_API", {
      name: 'test-api',
      schema: appsync.SchemaFile.fromAsset('schema/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }

    })
    new cdk.CfnOutput(this , "APIGraphURL" ,{
      value : api.graphqlUrl
    })

    new cdk.CfnOutput(this , "APIGraphAPIKey" ,{
      value : api.apiKey ||""
    })
    


    const lambdaFnAppsync = new cdk.aws_lambda.Function(this, "appsynctestLambda", {
      functionName: `appsynctestlambda`,
      runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
      code: cdk.aws_lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
    })
    
    // const lambda_function = new cdk.aws_lambda.Function(this, "LambdaFucntion", {
    //   runtime: cdk.aws_lambda.Runtime.NODEJS_12_X,            ///set nodejs runtime environment
    //   code: cdk.aws_lambda.Code.fromAsset("lambda"),          ///path for lambda function directory
    //   handler: 'index.handler',                       ///specfic fucntion in specific file
    //   timeout: cdk.Duration.seconds(10)               ///Time for function to break. limit upto 15 mins
    // })
    
    // set lembda dataSource
    // const lambda_data_source = api.addLambdaDataSource('lambdaDatSource' , lambdaFnAppsync)
    const lambda_data_source = api.addLambdaDataSource("lamdaDataSource", lambdaFnAppsync);
       ///Describing resolver for datasource
       lambda_data_source.createResolver({
        typeName: "Query",
        fieldName: "hello"
      })
      // lambda_data_source.createResolver({
      //   typeName: "Query",
      //   fieldName: "hello"
      // })
  }
}
