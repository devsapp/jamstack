import path from 'path';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import nodeFetch from 'node-fetch';

const Host = 's.devsapp.cn';

const now = Math.floor(Date.now() / 1000);
const expiredSeconds = 300; // 过期时间，最大300秒

const getPayload = (payload?: any) => {
  const defaultPayload = {
    iat: now, // 签署时间
    exp: now + expiredSeconds, // 过期时间，最大300秒
    accessKey: process.env.accessKey, // process.env.accessKey,
  };
  if (payload.domain) {
    return _.assign(defaultPayload, _.pick(payload, 'domain', 'project'));
  } else {
    return defaultPayload;
  }
};
export function getJwtoken(payload) {
  const jwtToken = jwt.sign(getPayload(payload), process.env.accessSecret, {
    algorithm: 'HS256',
  });
  return jwtToken;
}

export function getUploadUrl(payload) {
  return 'https://' + path.join(`${Host}`, `/object/${payload.domain}/${payload.appName}/${payload.fileName}`);
}
export default async (url, payload?: any) => {
  payload = payload || {};
  const { type = 'json' } = payload;
  const jwtToken = jwt.sign(getPayload(payload), process.env.accessSecret, {
    algorithm: 'HS256',
  });

  const response = await nodeFetch('https://' + path.join(`${Host}`, url), {
    method: payload.method || 'GET',
    headers: {
      Host,
      'Content-Type': type === 'json' ? 'application/json' : 'text/plain',
      Authorization: `bear ${jwtToken}`,
    },
    body: payload.body ? JSON.stringify(payload.body) : undefined,
  });
  if (response.status === 200) {
    try {
      return await response.json();
    } catch (error) {
      return await response.text();
    }
  } else {
    console.log(response);
  }
};
