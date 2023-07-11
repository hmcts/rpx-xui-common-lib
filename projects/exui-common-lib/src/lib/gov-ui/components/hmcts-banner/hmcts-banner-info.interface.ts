export interface HmctsBannerInfo {
  message: string;
  type: 'warning' | 'success' | 'information';
  title?: string;
  showMessageIcon?: boolean;
  messageBoldText?: boolean;
}
