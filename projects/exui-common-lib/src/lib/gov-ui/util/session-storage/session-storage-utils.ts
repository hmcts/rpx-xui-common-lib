import { Caseworker, CaseworkersByService } from '../../../models';
import { ISessionStorageService } from '../../models/isession-storage.interface';

export const getAllCaseworkersFromServices = (caseworkersByService: CaseworkersByService[]): Caseworker[] => {
  let allCaseworkers: Caseworker[] = [];
  caseworkersByService.forEach(caseworkerListByService => {
    allCaseworkers = allCaseworkers.concat(caseworkerListByService.caseworkers);
  });
  return allCaseworkers;
};

export const getSessionStorageKeyForServiceId = (serviceId: string): string => {
  return `${serviceId}-caseworkers`;
};

export const getCaseworkers = (serviceId: string, sessionStorageService: ISessionStorageService): Caseworker[] => {
  const sessionKey = getSessionStorageKeyForServiceId(serviceId);
  const value = sessionStorageService.getItem(sessionKey);
  if (value) {
    return JSON.parse(value) as Caseworker[];
  }
};

export const setCaseworkers = (serviceId: string, caseworkers: Caseworker[], sessionStorageService: ISessionStorageService): void => {
  const sessionKey = getSessionStorageKeyForServiceId(serviceId);
  sessionStorageService.setItem(sessionKey, JSON.stringify(caseworkers));
};
