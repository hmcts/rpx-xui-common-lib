export interface IdleConfigModel {
  timeout: number;
  idleMilliseconds: number;
  keepAliveInSeconds: number;
  idleServiceName?: string;
}


export interface IdleConfig {
  idleModalDisplayTime: number;
  totalIdleTime: number;
  keepAliveInSeconds: number; // Not sure what this does
  idleServiceName?: string;
}
