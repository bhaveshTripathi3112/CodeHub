import { createClient } from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: "fcuSKFXNPLdlHcO51r3nzQHaSvT7t9Dk",
    socket: {
        host: 'redis-17415.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 17415
    }
});

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

