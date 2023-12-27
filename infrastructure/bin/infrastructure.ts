#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const serviceName = process.env.SERVICENAME;
const commitHash = process.env.COMMITHASH;
const account = '';
const region = '';
const env = 'dev';


