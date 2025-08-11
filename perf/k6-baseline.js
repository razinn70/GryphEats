import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s'
};

const BASE = __ENV.GATEWAY_URL || 'http://localhost:4000';

export default function () {
  const res = http.get(`${BASE}/healthz`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
