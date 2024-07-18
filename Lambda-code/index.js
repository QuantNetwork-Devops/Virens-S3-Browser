'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

async function request(event){
    const s3 = new AWS.S3()
    
    let objectArray = [];

    const params = {
        Bucket: event.queryStringParameters.bucketName,
        Prefix: event.queryStringParameters.filePath
    };


    const data = await s3.listObjects(params).promise();

    for (let index = 1; index < data['Contents'].length; index++) {
        objectArray.push(data['Contents'][index]) 
    }
    return objectArray
}

async function SignedUrl(event){
    const s3 = new AWS.S3()
    
    const params = {
        Bucket: event.queryStringParameters.bucketName,
        Key: event.queryStringParameters.fileName,
        Expires: 60
    };

    const url = s3.getSignedUrl('getObject', params);
    return url
}

exports.handler = async (event) => {
    if (event.rawPath === '/listBucketObjects') {
        const result = request(event).then(result => JSON.stringify(result));
        return await result
    }
    if (event.rawPath === '/getSignedURL') {
        const url = SignedUrl(event).then(url => JSON.stringify(url));
        return await url
    }
};